/*
TK777 server-authoritative Aviator routes.
MERGE into the CURRENT deployed Worker; do not replace its auth/password code.
A) Add helper tickTK777Game(env) before `export default`.
B) Add PUBLIC_GAME_ROUTES inside fetch try{} before `if(p.startsWith('/api/admin/'))`.
C) Add ADMIN_GAME_ROUTES inside the authenticated /api/admin/ block.
Run schema.sql once before deploying this Worker.
*/
async function tickTK777Game(env){
 const now=Math.floor(Date.now()/1000);
 let g=await env.DB.prepare('SELECT * FROM game_state WHERE id=1').first();
 if(!g){const a=+(1.1+Math.random()*5.5).toFixed(2),b=+(1.1+Math.random()*5.5).toFixed(2);
  await env.DB.prepare("INSERT OR IGNORE INTO game_state(id,round,phase,round_started_at,crash_multiplier,next_multiplier) VALUES(1,1,'waiting',?,?,?)").bind(now+5,a,b).run();
  g=await env.DB.prepare('SELECT * FROM game_state WHERE id=1').first();
 }
 if(g.phase==='waiting'&&now>=Number(g.round_started_at)){
  const r=await env.DB.prepare("UPDATE game_state SET phase='flying',round_started_at=?,updated_at=CURRENT_TIMESTAMP WHERE id=1 AND phase='waiting'").bind(now).run();
  if(r.meta?.changes) await env.DB.prepare("UPDATE game_bets SET state='active' WHERE round=? AND state='pending'").bind(g.round).run();
 }
 g=await env.DB.prepare('SELECT * FROM game_state WHERE id=1').first();
 if(g.phase==='flying'){
  const cur=Math.exp(Math.max(0,now-Number(g.round_started_at))*0.17);
  if(cur>=Number(g.crash_multiplier)){
   const r=await env.DB.prepare("UPDATE game_state SET phase='crashed',last_crash=crash_multiplier,crashed_at=?,updated_at=CURRENT_TIMESTAMP WHERE id=1 AND phase='flying' AND round=?").bind(now,g.round).run();
   if(r.meta?.changes){
    await env.DB.prepare('INSERT INTO game_crash_history(round,multiplier) VALUES(?,?)').bind(g.round,g.crash_multiplier).run();
    await env.DB.prepare("UPDATE game_bets SET state='lost',settled_at=CURRENT_TIMESTAMP WHERE round=? AND state='active'").bind(g.round).run();
   }
  }
 }
 g=await env.DB.prepare('SELECT * FROM game_state WHERE id=1').first();
 if(g.phase==='crashed'&&now>=Number(g.crashed_at||now)+3){
  await env.DB.prepare("UPDATE game_state SET round=round+1,phase='waiting',crash_multiplier=next_multiplier,next_multiplier=?,round_started_at=?,updated_at=CURRENT_TIMESTAMP WHERE id=1 AND phase='crashed'").bind(+(1.1+Math.random()*5.5).toFixed(2),now+5).run();
  g=await env.DB.prepare('SELECT * FROM game_state WHERE id=1').first();
 }
 const current=g.phase==='flying'?Math.min(Number(g.crash_multiplier),Math.exp(Math.max(0,now-Number(g.round_started_at))*0.17)):1;
 const h=await env.DB.prepare('SELECT multiplier FROM game_crash_history ORDER BY id DESC LIMIT 12').all();
 return {round:g.round,phase:g.phase,multiplier:+current.toFixed(2),crashMultiplier:Number(g.crash_multiplier),nextCrash:Number(g.phase==='waiting'?g.crash_multiplier:g.next_multiplier),lastCrash:g.last_crash,roundStartedAt:g.round_started_at,history:(h.results||[]).map(x=>Number(x.multiplier))};
}

// PUBLIC_GAME_ROUTES — insert inside try{} before the authenticated admin prefix.
if(p==='/api/game/state'&&m==='GET'){
 const g=await tickTK777Game(env);
 // Do not expose crash_multiplier / next_multiplier to players.
 const game={round:g.round,phase:g.phase,multiplier:g.multiplier,lastCrash:g.lastCrash,roundStartedAt:g.roundStartedAt,history:g.history};
 return json({success:true,game});
}
if(p==='/api/game/bets'&&m==='GET'){
 const a=await requireUser(request,env); if(!a)return fail('Unauthorized',401);
 const r=await env.DB.prepare('SELECT id,round,slot,stake,state,cashout_multiplier,payout,created_at,settled_at FROM game_bets WHERE user_id=? ORDER BY id DESC LIMIT 100').bind(a.id).all();
 return json({success:true,bets:r.results||[]});
}
if(p==='/api/game/bet'&&m==='POST'){
 const a=await requireUser(request,env); if(!a)return fail('Unauthorized',401);
 const x=await body(request),stake=Number(x?.amount),slot=Number(x?.slot||0),g=await tickTK777Game(env);
 if(g.phase!=='waiting')return fail('Betting is closed for this round',409);
 if(!Number.isInteger(stake)||stake<1||stake>1000000||![0,1].includes(slot))return fail('Invalid bet amount or slot');
 const dup=await env.DB.prepare("SELECT id FROM game_bets WHERE user_id=? AND round=? AND slot=? AND state IN ('pending','active')").bind(a.id,g.round,slot).first();
 if(dup)return fail('A bet already exists in this slot for this round',409);
 const debit=await env.DB.prepare('UPDATE users SET balance=balance-? WHERE id=? AND balance>=?').bind(stake,a.id,stake).run();
 if(!debit.meta?.changes)return fail('Insufficient balance',409);
 try{
  const ins=await env.DB.prepare("INSERT INTO game_bets(user_id,round,slot,stake,state) SELECT ?,?,?,?,'pending' WHERE EXISTS(SELECT 1 FROM game_state WHERE id=1 AND phase='waiting' AND round=?)").bind(a.id,g.round,slot,stake,g.round).run();
  if(!ins.meta?.changes)throw new Error('Betting closed; please try next round');
  const user=await env.DB.prepare('SELECT balance FROM users WHERE id=?').bind(a.id).first();
  return json({success:true,bet:{id:ins.meta.last_row_id,round:g.round,slot,stake,state:'pending'},balance:user.balance});
 }catch(e){await env.DB.prepare('UPDATE users SET balance=balance+? WHERE id=?').bind(stake,a.id).run();throw e;}
}
if(p==='/api/game/bet/cancel'&&m==='POST'){
 const a=await requireUser(request,env); if(!a)return fail('Unauthorized',401);
 const x=await body(request),id=Number(x?.id),g=await tickTK777Game(env);
 if(g.phase!=='waiting'||!Number.isInteger(id))return fail('Bet cannot be cancelled now',409);
 const bet=await env.DB.prepare("SELECT id,stake FROM game_bets WHERE id=? AND user_id=? AND round=? AND state='pending'").bind(id,a.id,g.round).first();
 if(!bet)return fail('Pending bet not found',404);
 const upd=await env.DB.prepare("UPDATE game_bets SET state='cancelled',settled_at=CURRENT_TIMESTAMP WHERE id=? AND user_id=? AND state='pending' AND EXISTS(SELECT 1 FROM game_state WHERE id=1 AND phase='waiting')").bind(id,a.id).run();
 if(!upd.meta?.changes)return fail('Bet already processed',409);
 await env.DB.prepare('UPDATE users SET balance=balance+? WHERE id=?').bind(bet.stake,a.id).run();
 const user=await env.DB.prepare('SELECT balance FROM users WHERE id=?').bind(a.id).first();
 return json({success:true,balance:user.balance});
}
if(p==='/api/game/bet/cashout'&&m==='POST'){
 const a=await requireUser(request,env); if(!a)return fail('Unauthorized',401);
 const x=await body(request),id=Number(x?.id),g=await tickTK777Game(env);
 if(g.phase!=='flying'||!Number.isInteger(id))return fail('Cash out is closed',409);
 const bet=await env.DB.prepare("SELECT id,stake FROM game_bets WHERE id=? AND user_id=? AND round=? AND state='active'").bind(id,a.id,g.round).first();
 if(!bet)return fail('Active bet not found',404);
 const target=Number(x?.autoMultiplier),mult=Number.isFinite(target)&&target>=1.01?Math.min(g.multiplier,target):g.multiplier;
 if(mult<1)return fail('Invalid cash out multiplier');
 const payout=Number((Number(bet.stake)*mult).toFixed(2));
 const upd=await env.DB.prepare("UPDATE game_bets SET state='won',cashout_multiplier=?,payout=?,settled_at=CURRENT_TIMESTAMP WHERE id=? AND user_id=? AND state='active' AND EXISTS(SELECT 1 FROM game_state WHERE id=1 AND phase='flying' AND round=?)").bind(mult,payout,id,a.id,g.round).run();
 if(!upd.meta?.changes)return fail('Bet already settled',409);
 await env.DB.prepare('UPDATE users SET balance=balance+? WHERE id=?').bind(payout,a.id).run();
 const user=await env.DB.prepare('SELECT balance FROM users WHERE id=?').bind(a.id).first();
 return json({success:true,multiplier:mult,payout,balance:user.balance});
}

// ADMIN_GAME_ROUTES — insert after requireAdmin succeeds in the /api/admin/ block.
if(p==='/api/admin/game'&&m==='GET'){
 const game=await tickTK777Game(env);return json({success:true,game});
}
if(p==='/api/admin/game'&&m==='POST'){
 const x=await body(request),v=Number(x?.multiplier);
 if(!Number.isFinite(v)||v<1.01||v>100)return fail('Multiplier must be between 1.01 and 100');
 let g=await env.DB.prepare('SELECT * FROM game_state WHERE id=1').first();
 const now=Math.floor(Date.now()/1000);
 if(!g){await env.DB.prepare("INSERT INTO game_state(id,round,phase,round_started_at,crash_multiplier,next_multiplier) VALUES(1,1,'waiting',?,?,?)").bind(now+5,v,+(1.1+Math.random()*5.5).toFixed(2)).run();}
 else if(g.phase==='waiting')await env.DB.prepare('UPDATE game_state SET crash_multiplier=?,updated_at=CURRENT_TIMESTAMP WHERE id=1 AND phase=\'waiting\'').bind(v).run();
 else await env.DB.prepare('UPDATE game_state SET next_multiplier=?,updated_at=CURRENT_TIMESTAMP WHERE id=1').bind(v).run();
 return json({success:true,message:'Next round crash multiplier saved',multiplier:v});
}
