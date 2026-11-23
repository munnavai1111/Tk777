const $=s=>document.querySelector(s);let token=localStorage.getItem('tk777_admin_token')||'',admin=null,aviatorRefreshTimer=null;
const api=async(path,body=null,method=null)=>{const r=await fetch('/api'+path,{method:method||(body?'POST':'GET'),headers:{'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{})},body:body?JSON.stringify(body):undefined});const d=await r.json();if(!r.ok)throw Error(d.error||'Request failed');return d};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function frame(content){$('#admin').innerHTML=`<div class="admin-wrap"><header class="top" style="position:static;border-radius:10px"><div class="brand">TK777 <small>ADMIN PANEL</small></div><button onclick="location.href='/'">User Site ↗</button></header>${content}</div>`}
function login(){frame(`<div class="card" style="max-width:480px;margin:40px auto"><h2>Admin Login</h2><p class="muted">Cloudflare ADMIN_EMAIL এবং ADMIN_PASSWORD secrets-এ সেট করা তথ্য দিয়ে প্রবেশ করুন।</p><form id="login"><input class="field" name="email" placeholder="Admin Email" type="email" required><input class="field" name="password" placeholder="Admin password" type="password" required><input class="field" name="username" placeholder="Admin display name"><button class="primary">Secure Login / Bootstrap</button></form><div id="msg"></div></div>`);$('#login').onsubmit=async e=>{e.preventDefault();try{const d=Object.fromEntries(new FormData(e.target));const r=await api('/admin/bootstrap',d);token=r.token;localStorage.setItem('tk777_admin_token',token);admin=r.user;dashboard()}catch(err){$('#msg').textContent=err.message}}}
async function dashboard(){try{admin=(await api('/me')).user;if(admin.role!=='admin')throw Error('Admin permission নেই');const d=await api('/admin/overview');frame(`<h2>Dashboard</h2><div class="admin-grid"><div class="stat">Users<b>${d.users}</b></div><div class="stat">Games<b>${d.games}</b></div><div class="stat">Categories<b>${d.categories}</b></div><div class="stat">Rounds<b>${d.rounds}</b></div></div><div class="admin-nav"><button onclick="userManagement()">ইউজার ম্যানেজমেন্ট</button><button onclick="users()">Users & Free Credits</button><button onclick="coinRequests()">Coin Requests</button><button onclick="referralSettings()">Referral System</button><button onclick="demoDepositRequests()">Demo Deposit Requests</button><button onclick="pageTextEditor()">Deposit & Withdrawal Page Editor</button><button onclick="withdrawRequests()">Demo Withdrawal Requests</button><button onclick="demoNumberSettings()">নাম্বার চেঞ্জ</button><button onclick="cats()">Categories</button><button onclick="games()">Games</button><button onclick="superAceCardImages()">Super Ace তাসের ছবি</button><button onclick="gameNameEdit()">গেম নাম এডিট</button><button onclick="aviatorControl()">Aviator Control</button><button onclick="banners()">Home Banners</button><button onclick="promotionSettings()">Promotion</button><button onclick="settings()">Settings</button><button onclick="logout()">Logout</button></div><div class="card"><h3>Admin Control Center</h3><p>সাইটের ক্যাটাগরি, গেম, ছবি, HTML গেম ফাইল এবং ইউজার অ্যাকাউন্ট এখান থেকে নিয়ন্ত্রণ করুন।</p></div><div id="view"></div>`)}catch(e){login()}}
async function loadAviatorControl(){
  if(!$('#aviatorCurrent'))return;
  try{
    const d=await api('/admin/aviator-control');
    const current=d.currentRound;
    $('#aviatorCurrent').textContent=current?Number(current.crashMultiplier).toFixed(2)+'x':'—';
    $('#aviatorLive').textContent=current?Number(current.multiplier).toFixed(2)+'x':'—';
    $('#aviatorPhase').textContent=current?String(current.status).toUpperCase():'—';
    $('#aviatorNext').textContent=Number(d.nextCrashMultiplier).toFixed(2)+'x';
    const input=$('#aviatorNextInput');
    if(input&&document.activeElement!==input)input.value=Number(d.nextCrashMultiplier).toFixed(2);
    $('#aviatorControlMsg').textContent='';
  }catch(e){
    const msg=$('#aviatorControlMsg');if(msg)msg.textContent=e.message;
  }
}
async function aviatorControl(){
  if(aviatorRefreshTimer){clearInterval(aviatorRefreshTimer);aviatorRefreshTimer=null;}
  $('#view').innerHTML=`<div class="card">
    <h3>Aviator Round Control</h3>
    <p class="muted">সার্ভার নিজে প্রতিটি রাউন্ডের Crash Multiplier তৈরি করে। Admin চাইলে শুধু পরবর্তী রাউন্ডের মান পরিবর্তন করতে পারবেন। চলমান রাউন্ড পরিবর্তন হবে না।</p>
    <div class="admin-grid">
      <div class="stat">বর্তমান রাউন্ডের Crash Point<b id="aviatorCurrent">লোড হচ্ছে…</b></div>
      <div class="stat">চলতি Multiplier<b id="aviatorLive">—</b></div>
      <div class="stat">পরবর্তী রাউন্ড<b id="aviatorNext">লোড হচ্ছে…</b></div>
      <div class="stat">Round Status<b id="aviatorPhase">—</b></div>
    </div>
    <form id="aviatorNextForm" style="margin-top:18px">
      <label for="aviatorNextInput">পরবর্তী রাউন্ডের Crash Multiplier (x)</label>
      <input class="field" id="aviatorNextInput" name="multiplier" type="number" min="1.01" max="1000" step="0.01" value="2.00" required>
      <button class="primary">পরবর্তী রাউন্ড সেট করুন</button>
      <button type="button" onclick="loadAviatorControl()">Refresh</button>
    </form>
    <p class="muted">সীমা: 1.01x–1000.00x। সেটিংটি পরবর্তী তৈরি হওয়া রাউন্ডে কার্যকর হবে। সব ইউজার একই সার্ভার রাউন্ড পাবেন।</p>
    <div id="aviatorControlMsg" class="muted"></div>
  </div>`;
  $('#aviatorNextForm').onsubmit=async e=>{
    e.preventDefault();
    const multiplier=Number($('#aviatorNextInput').value);
    try{
      const d=await api('/admin/aviator-control',{multiplier});
      $('#aviatorControlMsg').textContent='পরবর্তী রাউন্ড '+Number(d.nextCrashMultiplier).toFixed(2)+'x সেট হয়েছে।';
      await loadAviatorControl();
    }catch(err){$('#aviatorControlMsg').textContent=err.message;}
  };
  await loadAviatorControl();
  aviatorRefreshTimer=setInterval(()=>{if($('#aviatorCurrent'))loadAviatorControl();},2000);
}
async function userManagement(){
 $('#view').innerHTML=`<div class="card"><h3>ইউজার ম্যানেজমেন্ট</h3><label>মোবাইল নম্বর দিয়ে সার্চ করুন</label><input class="field" id="userManageSearch" type="tel" inputmode="numeric" placeholder="01XXXXXXXXX"><button class="primary" onclick="searchManagedUsers()">সার্চ</button><div id="managedUserResults"></div></div><div id="managedUserDetail"></div>`;
 await searchManagedUsers();
}
async function searchManagedUsers(){
 const box=$('#managedUserResults');if(!box)return;
 const q=$('#userManageSearch')?.value.trim()||'';
 try{
  const d=await api('/admin/users'+(q?'?q='+encodeURIComponent(q):''));
  box.innerHTML=(d.users||[]).map(u=>`<div class="card"><button type="button" onclick="openManagedUser('${esc(u.id)}')">${esc(u.username||'নাম নেই')} · ${esc(u.email||'')}</button><p>বর্তমান ব্যালেন্স: <b>${Number(u.balance)||0}</b> Virtual Coin</p></div>`).join('')||'কোনো ইউজার পাওয়া যায়নি';
 }catch(e){box.textContent=e.message;}
}
async function openManagedUser(id){
 const host=$('#managedUserDetail');if(!host)return;
 host.innerHTML='<div class="card">তথ্য লোড হচ্ছে…</div>';
 try{
  const d=await api('/admin/users/'+encodeURIComponent(id));const u=d.user,docs=d.documents||{};
  const rows=(items,cols)=>items?.length?`<div class="table-wrap"><table><tr>${cols.map(c=>'<th>'+esc(c.label)+'</th>').join('')}</tr>${items.map(x=>'<tr>'+cols.map(c=>'<td>'+esc(x[c.key]??'—')+'</td>').join('')+'</tr>').join('')}</table></div>`:'<p class="muted">কোনো রেকর্ড নেই</p>';
  host.innerHTML=`<div class="card"><h3>ইউজার প্রোফাইল</h3><p>নাম: <b>${esc(u.display_name||u.username)}</b></p><p>মোবাইল নম্বর: <b>${esc(u.email)}</b></p><p>WhatsApp: <b>${esc(u.whatsapp_number||"সেট করা হয়নি")}</b></p><p>Facebook: <b>${esc(u.facebook_url||"সেট করা হয়নি")}</b></p><p>Gmail: <b>${esc(u.gmail||"সেট করা হয়নি")}</b></p><p>Role: ${esc(u.role)}</p><p>অ্যাকাউন্ট খোলার সময়: ${esc(u.created_at)}</p><p>বর্তমান Virtual Coin: <b>${Number(u.balance)}</b></p><h4>ওয়ালেট নম্বর</h4><p>বর্তমান নম্বর: <b style="font-size:18px">${esc(u.wallet_number||'সেট করা হয়নি')}</b></p><label>নতুন / পরিবর্তিত ওয়ালেট নম্বর (শুধু অ্যাডমিন পরিবর্তন করতে পারবেন)</label><input class="field" id="managedWalletNumber" type="tel" inputmode="numeric" maxlength="20" value="${esc(u.wallet_number||'')}" placeholder="01XXXXXXXXX"><button class="secondary" onclick="saveManagedWalletNumber('${esc(u.id)}')">ওয়ালেট নম্বর সংরক্ষণ</button><div id="managedWalletMsg" class="muted"></div><p class="muted">পুরোনো পাসওয়ার্ড দেখা যায় না। ভুলে গেলে নতুন পাসওয়ার্ড সেট করতে পারবেন।</p><label>নতুন পাসওয়ার্ড সেট করুন (কমপক্ষে ৬ অক্ষর)</label><input class="field" id="managedNewPassword" type="password" minlength="6" maxlength="128" autocomplete="new-password" placeholder="নতুন পাসওয়ার্ড"><input class="field" id="managedConfirmPassword" type="password" minlength="6" maxlength="128" autocomplete="new-password" placeholder="নতুন পাসওয়ার্ড আবার লিখুন"><button type="button" id="resetManagedPasswordBtn">পাসওয়ার্ড রিসেট করুন</button><div id="managedPasswordMsg" class="muted"></div><label>নতুন ব্যালেন্স (সরাসরি সেট করুন)</label><input class="field" id="setUserBalance" type="number" min="0" max="1000000000" step="1" value="${Number(u.balance)}"><label>পরিবর্তনের কারণ</label><input class="field" id="setUserBalanceNote" maxlength="160" placeholder="কারণ (ঐচ্ছিক)"><button class="primary" onclick="saveManagedUserBalance('${esc(u.id)}')">ব্যালেন্স সংরক্ষণ</button><div id="managedBalanceMsg" class="muted"></div></div>
  <div class="card"><h3>লেনদেনের ইতিহাস</h3>${rows(docs.transactions,[{key:'type',label:'ধরন'},{key:'amount',label:'পরিমাণ'},{key:'balance_after',label:'পরের ব্যালেন্স'},{key:'note',label:'বিবরণ'},{key:'created_at',label:'সময়'}])}</div>
  <div class="card"><h3>গেম খেলার রেকর্ড</h3>${rows(docs.gameRounds,[{key:'game_type',label:'গেম'},{key:'bet_amount',label:'খেলার কয়েন'},{key:'multiplier',label:'Multiplier'},{key:'payout',label:'ফেরত কয়েন'},{key:'created_at',label:'সময়'}])}</div>
  <div class="card"><h3>Aviator রেকর্ড</h3>${rows(docs.crashRounds,[{key:'game_id',label:'গেম'},{key:'bet_amount',label:'খেলার কয়েন'},{key:'crash_multiplier',label:'Crash'},{key:'status',label:'Status'},{key:'payout',label:'ফেরত কয়েন'},{key:'created_at',label:'সময়'}])}</div>
  <div class="card"><h3>Demo Deposit রেকর্ড</h3>${rows(docs.demoDeposits,[{key:'method',label:'পদ্ধতি'},{key:'amount',label:'পরিমাণ'},{key:'demo_reference',label:'Demo ID'},{key:'status',label:'Status'},{key:'created_at',label:'সময়'}])}</div>
  <div class="card"><h3>Demo Withdrawal রেকর্ড</h3>${rows(docs.demoWithdrawals,[{key:'method',label:'পদ্ধতি'},{key:'amount',label:'পরিমাণ'},{key:'status',label:'Status'},{key:'created_at',label:'সময়'},{key:'reviewed_at',label:'Review সময়'}])}</div>
  <div class="card"><h3>Free Coin Request রেকর্ড</h3>${rows(docs.coinRequests,[{key:'amount',label:'কয়েন'},{key:'status',label:'Status'},{key:'created_at',label:'সময়'},{key:'reviewed_at',label:'Review সময়'}])}</div>`
  $('#resetManagedPasswordBtn').onclick=()=>resetManagedUserPassword(u.id);;
 }catch(e){host.innerHTML='<div class="card">'+esc(e.message)+'</div>';}
}
async function saveManagedWalletNumber(id){
 const msg=$('#managedWalletMsg'),walletNumber=$('#managedWalletNumber').value.trim();
 if(!/^[0-9+ -]{8,20}$/.test(walletNumber)){msg.textContent='সঠিক ওয়ালেট নম্বর লিখুন।';return;}
 if(!confirm('এই ইউজারের ওয়ালেট নম্বর পরিবর্তন করবেন?'))return;
 try{await api('/admin/user-wallet-number',{userId:id,walletNumber});msg.textContent='ওয়ালেট নম্বর পরিবর্তন হয়েছে।';await openManagedUser(id);}catch(e){msg.textContent=e.message;}
}
async function resetManagedUserPassword(id){
 const msg=$('#managedPasswordMsg');const newPassword=$('#managedNewPassword').value;const confirmPassword=$('#managedConfirmPassword').value;
 if(newPassword.length<6||newPassword.length>128){msg.textContent='পাসওয়ার্ড ৬–১২৮ অক্ষরের হতে হবে।';return;}
 if(newPassword!==confirmPassword){msg.textContent='দুটি পাসওয়ার্ড মিলছে না।';return;}
 if(!confirm('এই ইউজারের পাসওয়ার্ড পরিবর্তন করবেন? পুরোনো সব লগইন সেশন বন্ধ হবে।'))return;
 try{const d=await api('/admin/user-password-reset',{userId:id,newPassword});msg.textContent=d.message||'পাসওয়ার্ড রিসেট হয়েছে।';$('#managedNewPassword').value='';$('#managedConfirmPassword').value='';}
 catch(e){msg.textContent=e.message;}
}
async function saveManagedUserBalance(id){
 const msg=$('#managedBalanceMsg');const balance=Number($('#setUserBalance').value);const note=$('#setUserBalanceNote').value.trim();
 if(!Number.isSafeInteger(balance)||balance<0||balance>1000000000){msg.textContent='০ বা তার বেশি সঠিক পূর্ণসংখ্যা দিন।';return;}
 if(!confirm('এই ইউজারের ব্যালেন্স সরাসরি '+balance+' Virtual Coin সেট করবেন?'))return;
 try{const d=await api('/admin/user-balance-set',{userId:id,balance,note});msg.textContent='নতুন ব্যালেন্স সংরক্ষণ হয়েছে: '+d.balance;await openManagedUser(id);}catch(e){msg.textContent=e.message;}
}

async function users(){const d=await api('/admin/users');$('#view').innerHTML=`<div class="card"><h3>Users & Free Credits</h3><div class="table-wrap"><table><tr><th>User</th><th>Email</th><th>Free Credits</th><th>Action</th></tr>${d.users.map(u=>`<tr><td>${esc(u.username)}</td><td>${esc(u.email)}</td><td>${u.balance}</td><td><button onclick="adjust('${u.id}')">Adjust</button></td></tr>`).join('')}</table></div></div>`}
async function adjust(id){const amount=prompt('ফ্রি ক্রেডিট যোগ করতে positive, কমাতে negative amount লিখুন');if(amount===null)return;const note=prompt('কারণ লিখুন')||'Admin adjustment';try{await api('/admin/balance',{userId:id,amount:Number(amount),note});users()}catch(e){alert(e.message)}}
async function cats(){const d=await api('/admin/categories');$('#view').innerHTML=`<div class="card"><h3>Add / Edit Category</h3><form id="cat"><input class="field" name="id" placeholder="ID (e.g. hot-games)"><input class="field" name="name" placeholder="Category name" required><input class="field" name="image_url" placeholder="Category image URL"><input class="field" name="sort_order" type="number" placeholder="Sort order"><button>Save Category</button></form></div><div class="card">${d.categories.map(c=>`<p>${esc(c.name)} · ${esc(c.image_url)} <button onclick="delCat('${c.id}')">Disable</button></p>`).join('')}</div>`;$('#cat').onsubmit=async e=>{e.preventDefault();const x=Object.fromEntries(new FormData(e.target));try{await api('/admin/categories',x);cats()}catch(err){alert(err.message)}}}
async function delCat(id){if(confirm('Disable category?')){await api('/admin/categories/'+id,null,'DELETE');cats()}}
async function games(){
 const [d,c]=await Promise.all([api('/admin/games'),api('/admin/categories')]);
 const existing=d.games.filter(g=>['aviator','superace'].includes(g.game_type));
 $('#view').innerHTML=`<div class="card"><h3>গেমের কার্ডের ছবি পরিবর্তন</h3>
 <p class="muted">Aviator বা Super Ace নির্বাচন করে ছবির সরাসরি URL দিন। Save Game করলে ইউজার সাইটে ছবিটি দেখা যাবে।</p>
 <form id="game">
 <label>আগের গেম নির্বাচন করুন</label>
 <select class="field" id="existingGame"><option value="">নতুন গেম / নিজে ID লিখুন</option>${d.games.map(g=>`<option value="${esc(g.id)}">${esc(g.name)} · ${esc(g.game_type)}</option>`).join('')}</select>
 <input class="field" name="id" id="gameId" placeholder="Game ID (e.g. aviator)" required>
 <input class="field" name="name" id="gameName" placeholder="Game name" required>
 <select class="field" name="category_id" id="gameCategory">${c.categories.map(x=>`<option value="${esc(x.id)}">${esc(x.name)}</option>`).join('')}</select>
 <label>কার্ডের ছবির লিংক (Image URL)</label>
 <input class="field" name="image_url" id="gameImageUrl" placeholder="https://example.com/aviator-image.jpg" type="url">
 <div id="gameImagePreview" class="muted" style="margin:4px 0 12px">ছবির লিংক দিলে এখানে প্রিভিউ দেখা যাবে।</div>
 <label>Game Type</label>
 <select class="field" name="game_type" id="gameType"><option value="aviator">Aviator</option><option value="superace">Super Ace</option><option value="html">Custom HTML</option></select>
 <label>Free-play HTML game upload (optional)</label><input class="field" id="htmlfile" type="file" accept=".html,.htm,text/html">
 <textarea class="field" id="htmlsource" name="html_content" placeholder="ফ্রি-প্লে HTML গেমের সোর্স (অথবা HTML ফাইল আপলোড করুন)"></textarea>
 <input class="field" name="sort_order" id="gameSort" type="number" placeholder="Sort order">
 <button class="primary">Save Game</button></form></div>
  <div class="card"><h3>আগের গেমগুলো — Delete Control</h3><p class="muted">Delete করলে গেমটি ইউজার সাইট থেকে লুকানো হবে; পুরোনো রাউন্ড/হিস্ট্রি অক্ষত থাকবে।</p>${d.games.map(g=>`<div class="row" style="justify-content:space-between;margin:8px 0"><span>${esc(g.name)} · ${esc(g.game_type)} · ${g.active ? 'চালু' : 'মুছে রাখা'}</span><span>${g.active ? `<button type="button" onclick="editGame('${esc(g.id)}')">Edit</button> <button type="button" onclick="delGame('${esc(g.id)}')">Delete</button>` : 'Deleted'}</span></div>`).join('')}</div>`;

 // Universal image URL controls for every database game
 $('#view').insertAdjacentHTML('afterbegin',`<div class="card"><h3>সব গেমের Image URL নিয়ন্ত্রণ</h3>
 <p class="muted">Aviator, Super Ace, Live এবং Games তালিকার প্রতিটি গেমের ছবি এখানে পরিবর্তন করতে পারবেন। HTTPS Image URL দিন; খালি রাখলে ডিফল্ট ছবি থাকবে।</p>
 ${d.games.map(g=>`<div style="margin:12px 0;padding:8px;border-bottom:1px solid #ffffff22"><label>${esc(g.name)} · ${esc(g.game_type)} — Image URL</label><input class="field all-game-image-url" data-game-id="${esc(g.id)}" type="url" maxlength="1000" placeholder="https://example.com/game-image.jpg" value="${esc(g.image_url||'')}"></div>`).join('')}
 <button type="button" class="primary" id="saveAllGameImages">সব গেমের Image URL Save</button><div id="allGameImageMsg" class="muted"></div></div>`);
 $('#saveAllGameImages').onclick=async()=>{
  const msg=$('#allGameImageMsg');msg.textContent='Saving…';
  try{
   for(const input of document.querySelectorAll('.all-game-image-url')){
    const g=d.games.find(x=>x.id===input.dataset.gameId);
    if(!g)continue;
    const image_url=input.value.trim();
    if(image_url&&!/^https:\/\//i.test(image_url))throw Error(g.name+': শুধু HTTPS Image URL দিন');
    await api('/admin/games',{id:g.id,name:g.name,category_id:g.category_id||'',image_url,game_type:g.game_type,html_content:g.html_content||'',sort_order:g.sort_order||0});
   }
   msg.textContent='সব গেমের Image URL সংরক্ষণ হয়েছে। User Site রিফ্রেশ করুন।';
  }catch(e){msg.textContent=e.message;}
 };


 const slotPosterItems=[
  ['slot-display-super-elements','Super Elements'],['slot-display-azteca-legacy','Azteca Legacy'],['slot-display-flyx','FlyX'],
  ['slot-display-magic-ace','Magic Ace'],['slot-display-circus-joker','Circus Joker'],['slot-display-fortune-gems-3','Fortune Gems 3'],
  ['slot-display-super-ace-ii','Super Ace II'],['slot-display-boxing-king','Boxing King'],['slot-display-super-ace-deluxe','Super Ace Deluxe'],
  ['slot-display-dragon-gems','Dragon Gems'],['slot-display-treasures-of-aztec','Treasures of Aztec'],['slot-display-anubis-wrath','Anubis Wrath'],
  ['slot-display-golden-empire','Golden Empire'],
  ['slot-display-money-coming','Money Coming'],
  ['slot-display-fortune-gems','Fortune Gems'],
  ['slot-display-fortune-gems-2','Fortune Gems 2'],
  ['slot-display-devil-fire-2','Devil Fire 2'],
  ['slot-display-zeus','Zeus'],
  ['slot-display-wild-ace','Wild Ace'],
  ['slot-display-golden-bank','Golden Bank'],
  ['slot-display-party-night','Party Night'],
  ['slot-display-lucky-goldbricks','Lucky Goldbricks'],
  ['slot-display-mahjong-ways','Mahjong Ways'],
  ['slot-display-mahjong-ways-2','Mahjong Ways 2'],
  ['slot-display-fortune-tiger','Fortune Tiger'],
  ['slot-display-fortune-ox','Fortune Ox'],
  ['slot-display-fortune-rabbit','Fortune Rabbit'],
  ['slot-display-lucky-neko','Lucky Neko'],
  ['slot-display-dragon-hatch','Dragon Hatch'],
  ['slot-display-ganesha-fortune','Ganesha Fortune'],
  ['slot-display-wild-bandito','Wild Bandito'],
  ['slot-display-ways-of-the-qilin','Ways of the Qilin']
 ];
 const settingData=await api('/admin/settings');
 const settingValues=Object.fromEntries((settingData.settings||[]).map(x=>[x.key,x.value]));
 let gameNameOverrides={};try{gameNameOverrides=JSON.parse(settingValues.game_name_overrides||'{}');if(!gameNameOverrides||typeof gameNameOverrides!=='object')gameNameOverrides={};}catch{gameNameOverrides={};}
 let hiddenSlotIds=[];try{hiddenSlotIds=JSON.parse(settingValues.slot_display_hidden||'[]');if(!Array.isArray(hiddenSlotIds))hiddenSlotIds=[];}catch{hiddenSlotIds=[];}
 $('#view').insertAdjacentHTML('afterbegin',`<div class="card"><h3>নতুন Slot গেমের ছবি (Image URL)</h3>
 <p class="muted">Super Ace-এর মতো প্রতিটি Slot গেমের জন্য সরাসরি HTTPS Image URL দিন। Save করলে ইউজার সাইটের গেম কার্ডে ছবিটি দেখা যাবে। খালি রাখলে নামসহ ডিফল্ট পোস্টার দেখাবে।</p>
 ${slotPosterItems.map(([id,name])=>'<div style="margin:12px 0;padding:8px;border-bottom:1px solid #ffffff22"><label>'+esc(name)+' — Image URL</label><input class="field slot-display-image-url" data-slot-id="'+id+'" type="url" maxlength="1000" placeholder="https://example.com/'+id+'.jpg" value="'+esc(settingValues['slot_display_image_'+id]||'')+'"><img class="slot-display-image-preview" data-preview-id="'+id+'" src="'+esc(settingValues['slot_display_image_'+id]||'')+'" alt="'+esc(name)+' preview" style="max-width:110px;max-height:145px;object-fit:cover;border-radius:8px;'+(settingValues['slot_display_image_'+id]?'':'display:none')+'"><button type="button" class="slot-display-toggle" data-slot-id="'+id+'">'+(hiddenSlotIds.includes(id)?'Restore to site':'Delete from site')+'</button></div>').join('')}}
 <button type="button" class="primary" id="saveSlotDisplayImages">Save Slot Images</button><div id="slotImageSaveMsg" class="muted"></div></div>`);
 document.querySelectorAll('.slot-display-toggle').forEach(button=>button.addEventListener('click',async()=>{
   const id=button.dataset.slotId;
   const next=hiddenSlotIds.includes(id)?hiddenSlotIds.filter(x=>x!==id):[...hiddenSlotIds,id];
   if(!confirm(next.includes(id)?'এই গেমটি ইউজার সাইট থেকে মুছে ফেলবেন?':'এই গেমটি আবার ইউজার সাইটে দেখাবেন?'))return;
   try{await api('/admin/settings',{key:'slot_display_hidden',value:JSON.stringify(next)});games();}
   catch(err){alert(err.message);}
 }));
 document.querySelectorAll('.slot-display-image-url').forEach(input=>input.addEventListener('input',()=>{
   const img=document.querySelector('[data-preview-id="'+input.dataset.slotId+'"]');
   img.src=input.value;img.style.display=input.value?'block':'none';
 }));
 $('#saveSlotDisplayImages').onclick=async()=>{
   const msg=$('#slotImageSaveMsg');msg.textContent='Saving…';
   try{
     for(const input of document.querySelectorAll('.slot-display-image-url')){
       const value=input.value.trim();
       if(value&&!/^https:\/\//i.test(value))throw Error( input.dataset.slotId+': HTTPS Image URL দিন');
       await api('/admin/settings',{key:'slot_display_image_'+input.dataset.slotId,value});
     }
     msg.textContent='সব Slot ছবির URL সংরক্ষণ হয়েছে। User Site রিফ্রেশ করলে ছবি দেখা যাবে।';
   }catch(err){msg.textContent=err.message;}
 };
 window.adminGameRows=d.games;
 const preview=()=>{const url=$('#gameImageUrl').value.trim(),box=$('#gameImagePreview');box.innerHTML=url?`<img src="${esc(url)}" alt="Image preview" style="max-width:100%;max-height:150px;border-radius:8px" onerror="this.outerHTML='<span class=\\'muted\\'>ছবিটি লোড করা যায়নি। URL পরীক্ষা করুন।</span>'">`:'ছবির লিংক দিলে এখানে প্রিভিউ দেখা যাবে।';};
 $('#gameImageUrl').oninput=preview;
 $('#existingGame').onchange=()=>{const g=d.games.find(x=>x.id===$('#existingGame').value);if(!g)return;$('#gameId').value=g.id;$('#gameName').value=g.name;$('#gameCategory').value=g.category_id||'';$('#gameImageUrl').value=g.image_url||'';$('#gameType').value=g.game_type;$('#gameSort').value=g.sort_order??'';preview();};
 $('#htmlfile').onchange=async e=>{const f=e.target.files[0];if(f){if(f.size>500000)return alert('HTML ফাইল সর্বোচ্চ 500KB হতে পারবে');$('#htmlsource').value=await f.text();}};
 $('#game').onsubmit=async e=>{e.preventDefault();try{await api('/admin/games',Object.fromEntries(new FormData(e.target)));alert('গেমের তথ্য ও ছবির লিংক সেভ হয়েছে');games()}catch(err){alert(err.message)}};
}
function editGame(id){const s=$('#existingGame');if(s){s.value=id;s.dispatchEvent(new Event('change'));window.scrollTo({top:0,behavior:'smooth'});}}


async function gameNameEdit(){
 const [d,s]=await Promise.all([api('/admin/games'),api('/admin/settings')]);
 const settings=Object.fromEntries((s.settings||[]).map(x=>[x.key,x.value]));
 let overrides={};
 try{overrides=JSON.parse(settings.game_name_overrides||'{}');if(!overrides||typeof overrides!=='object')overrides={};}catch{overrides={};}
 const slotItems=[
  ['slot-display-super-elements','Super Elements'],['slot-display-azteca-legacy','Azteca Legacy'],['slot-display-flyx','FlyX'],
  ['slot-display-magic-ace','Magic Ace'],['slot-display-circus-joker','Circus Joker'],['slot-display-fortune-gems-3','Fortune Gems 3'],
  ['slot-display-super-ace-ii','Super Ace II'],['slot-display-boxing-king','Boxing King'],['slot-display-super-ace-deluxe','Super Ace Deluxe'],
  ['slot-display-dragon-gems','Dragon Gems'],['slot-display-treasures-of-aztec','Treasures of Aztec'],['slot-display-anubis-wrath','Anubis Wrath'],
  ['slot-display-golden-empire','Golden Empire'],['slot-display-money-coming','Money Coming'],['slot-display-fortune-gems','Fortune Gems'],
  ['slot-display-fortune-gems-2','Fortune Gems 2'],['slot-display-devil-fire-2','Devil Fire 2'],['slot-display-zeus','Zeus'],
  ['slot-display-wild-ace','Wild Ace'],['slot-display-golden-bank','Golden Bank'],['slot-display-party-night','Party Night'],
  ['slot-display-lucky-goldbricks','Lucky Goldbricks'],['slot-display-mahjong-ways','Mahjong Ways'],['slot-display-mahjong-ways-2','Mahjong Ways 2'],
  ['slot-display-fortune-tiger','Fortune Tiger'],['slot-display-fortune-ox','Fortune Ox'],['slot-display-fortune-rabbit','Fortune Rabbit'],
  ['slot-display-lucky-neko','Lucky Neko'],['slot-display-dragon-hatch','Dragon Hatch'],['slot-display-ganesha-fortune','Ganesha Fortune'],
  ['slot-display-wild-bandito','Wild Bandito'],['slot-display-ways-of-the-qilin','Ways of the Qilin']
 ];
 const rows=d.games.map(g=>({id:g.id,name:g.name,group:'গেম'})).concat(slotItems.map(([id,name])=>({id,name:overrides[id]||name,group:'Slot'})));
 $('#view').innerHTML='<div class="card"><h3>গেম নাম এডিট</h3><p class="muted">এখান থেকে প্রতিটি গেমের নাম পরিবর্তন করে Save Name চাপুন। পরিবর্তিত নাম User Site-এও দেখা যাবে। গেমের ID, ডিজাইন ও পুরোনো হিস্ট্রি অপরিবর্তিত থাকবে।</p>'+rows.map(g=>'<div class="row" style="gap:8px;align-items:center;margin:8px 0"><span style="width:54px;flex-shrink:0">'+esc(g.group)+'</span><input class="field game-name-edit" data-game-id="'+esc(g.id)+'" value="'+esc(g.name)+'" maxlength="80" style="flex:1;min-width:0"><button type="button" onclick="saveGameName(\''+esc(g.id)+'\')">Save Name</button></div>').join('')+'</div>';
}

async function saveGameName(id){
 const input=Array.from(document.querySelectorAll('.game-name-edit')).find(x=>x.dataset.gameId===id);
 const name=(input?.value||'').trim();
 if(!name)return alert('গেমের নাম লিখুন');
 try{await api('/admin/game-name',{id,name});alert('গেমের নাম পরিবর্তন হয়েছে');games();}
 catch(e){alert(e.message);}
}

async function delGame(id){if(confirm('এই গেমটি ইউজার সাইট থেকে মুছে ফেলবেন? পুরোনো হিস্ট্রি অক্ষত থাকবে।')){try{await api('/admin/games/'+id,null,'DELETE');games()}catch(e){alert(e.message)}}}

async function promotionSettings(){
 const d=await api('/admin/settings');
 const values=Object.fromEntries((d.settings||[]).map(x=>[x.key,x.value]));
 $('#view').innerHTML='<div class="card"><h3>Promotion Banners (সর্বোচ্চ ১০টি)</h3><p class="muted">প্রতিটি ঘরে HTTPS Image URL দিন। খালি রাখলে সেই ব্যানার মুছে যাবে।</p>'+Array.from({length:10},(_,n)=>n+1).map(i=>'<div class="banner-admin-row"><label>Promotion Banner '+i+' Image URL</label><input class="field promotion-banner-url" id="promotionBanner'+i+'" type="url" maxlength="1000" placeholder="https://example.com/banner.jpg" value="'+esc(values['promotion_banner_'+i]||'')+'"><img id="promotionBannerPreview'+i+'" class="banner-admin-preview" src="'+esc(values['promotion_banner_'+i]||'')+'" '+(values['promotion_banner_'+i]?'':'hidden')+'></div>').join('')+'<button class="primary" onclick="savePromotionBanners()">Save Promotion Banners</button><div id="promotionSaveMsg" class="muted"></div></div>';
 for(let i=1;i<=10;i++){const input=$('#promotionBanner'+i),img=$('#promotionBannerPreview'+i);input.addEventListener('input',()=>{img.src=input.value;img.hidden=!input.value;});}
}
async function savePromotionBanners(){
 const msg=$('#promotionSaveMsg');msg.textContent='Saving…';
 try{for(let i=1;i<=10;i++){const value=$('#promotionBanner'+i).value.trim();if(value&&!/^https:\/\//i.test(value))throw Error('Promotion Banner '+i+': HTTPS Image URL দিন');await api('/admin/settings',{key:'promotion_banner_'+i,value});}msg.textContent='১০টি Promotion Banner URL সংরক্ষণ হয়েছে। User Site রিফ্রেশ করলে দেখা যাবে।';}
 catch(e){msg.textContent=e.message;}
}
async function banners(){
 const d=await api('/admin/settings');
 const values=Object.fromEntries(d.settings.map(x=>[x.key,x.value]));
 $('#view').innerHTML='<div class="card"><h3>Home Banners (সর্বোচ্চ ৫টি)</h3><p class="muted">প্রতিটি ঘরে HTTPS Image URL দিন। খালি রাখলে সেই ব্যানার মুছে যাবে।</p>'+[1,2,3,4,5].map(i=>'<div class="banner-admin-row"><label>Banner '+i+' Image URL</label><input class="field" id="homeBanner'+i+'" type="url" maxlength="1000" placeholder="https://example.com/banner.jpg" value="'+esc(values['home_banner_'+i]||'')+'"><img id="homeBannerPreview'+i+'" class="banner-admin-preview" src="'+esc(values['home_banner_'+i]||'')+'" '+(values['home_banner_'+i]?'':'hidden')+'></div>').join('')+'<button class="primary" onclick="saveHomeBanners()">Save Banners</button><div id="bannerSaveMsg" class="muted"></div></div>';
 [1,2,3,4,5].forEach(i=>{const input=$('#homeBanner'+i),img=$('#homeBannerPreview'+i);input.addEventListener('input',()=>{img.src=input.value;img.hidden=!input.value;});});
}
async function saveHomeBanners(){
 const msg=$('#bannerSaveMsg');msg.textContent='Saving…';
 try{for(let i=1;i<=5;i++){const value=$('#homeBanner'+i).value.trim();if(value&&!/^https:\/\//i.test(value))throw Error('Banner '+i+': HTTPS Image URL দিন');await api('/admin/settings',{key:'home_banner_'+i,value});}msg.textContent='ব্যানার সংরক্ষণ হয়েছে।';}catch(e){msg.textContent=e.message;}
}




async function withdrawRequests(){
 const d=await api('/admin/withdraw-requests');
 $('#view').innerHTML='<div class="card"><h3>Demo Virtual Coin Withdrawal Requests</h3><p class="muted">Accept করলে শুধু Virtual Coin ইউজারের ব্যালেন্স থেকে কমবে। কোনো টাকা পাঠানো হয় না।</p><div id="withdrawAdminList"></div></div>';
 renderWithdrawRequests(d.requests||[]);
}
function renderWithdrawRequests(rows){
 const box=$('#withdrawAdminList');if(!box)return;
 box.innerHTML=rows.map(x=>'<div class="card"><b>'+esc(x.username||x.email||'User')+'</b><p>'+esc(x.method)+' · '+Number(x.amount)+' Virtual Coin</p><p>ওয়ালেট নম্বর: <b style="font-size:20px">'+esc(x.wallet_number||'—')+'</b></p><p>Balance: '+Number(x.balance||0)+' Coin</p><p>Status: '+esc(x.status)+' · '+esc(x.created_at)+'</p>'+(x.status==='pending'?'<button class="primary" onclick="reviewWithdrawRequest(\''+esc(x.id)+'\',\'approved\')">Approve</button> <button onclick="reviewWithdrawRequest(\''+esc(x.id)+'\',\'rejected\')">বাতিল করে কয়েন ফেরত</button>':'')+'</div>').join('')||'কোনো Withdrawal Request নেই';
}
async function reviewWithdrawRequest(id,status){
 const action=status==='approved'?'Approve':'বাতিল করে কয়েন ফেরত';
 if(!confirm('এই Demo Withdrawal Request '+action+' করবেন?'))return;
 try{await api('/admin/withdraw-requests/review',{id,status});await withdrawRequests();}
 catch(e){alert(e.message);}
}

async function demoDepositRequests(){
 const d=await api('/admin/demo-deposits');
 $('#view').innerHTML=`<div class="card"><h3>Demo Deposit Requests</h3><p class="muted">এগুলো কাল্পনিক পরীক্ষামূলক রেকর্ড। কোনো টাকা যাচাই বা কয়েন যোগ হয় না।</p><div id="demoDepositAdminList"></div></div>`;
 renderDemoDepositRequests(d.requests||[]);
}
function renderDemoDepositRequests(rows){
 const box=$('#demoDepositAdminList');if(!box)return;
 box.innerHTML=rows.map(x=>`<div class="card"><b>${esc(x.username||x.email||'User')}</b><p>${esc(x.method)} · ৳${Number(x.amount)} (Demo)</p><p>Reference: ${esc(x.demo_reference)}</p><p>Status: ${esc(x.status==='accepted'?'Accepted':x.status==='cancelled'?'Cancelled':'Pending')} · ${esc(x.created_at)}</p>${x.status==='pending'?'<button class="primary" onclick="reviewDemoDeposit(\''+esc(x.id)+'\',\'accepted\')">Accept</button> <button onclick="reviewDemoDeposit(\''+esc(x.id)+'\',\'cancelled\')">Cancel</button> ':''}<button onclick="deleteDemoDeposit('${esc(x.id)}')">Delete Demo Record</button></div>`).join('')||'কোনো Demo Request নেই';
}
async function reviewDemoDeposit(id,status){const label=status==='accepted'?'Accept':'Cancel';if(!confirm('এই Demo Request '+label+' করবেন?'))return;try{await api('/admin/demo-deposits/review',{id,status});await demoDepositRequests();}catch(e){alert(e.message);}}
async function deleteDemoDeposit(id){if(!confirm('এই Demo Record মুছে ফেলবেন?'))return;try{await api('/admin/demo-deposits/'+encodeURIComponent(id),null,'DELETE');await demoDepositRequests();}catch(e){alert(e.message);}}

async function coinRequests(){
 const d=await api('/admin/coin-requests');
 $('#view').innerHTML=`<div class="card"><h3>Free Virtual Coin Requests</h3><p class="muted">Approve করলে তবেই ইউজারের ব্যালেন্সে নগদমূল্যহীন Virtual Coin যোগ হবে।</p><label>মোবাইল নম্বর দিয়ে খুঁজুন</label><input class="field" id="coinSearch" placeholder="মোবাইল নম্বর" oninput="searchCoinRequests()"><div id="coinRequestAdminList"></div></div>`;
 renderCoinRequests(d.requests||[]);
}
function renderCoinRequests(rows){
 const box=$('#coinRequestAdminList');if(!box)return;
 box.innerHTML=rows.map(x=>`<div class="card"><b>${esc(x.username||x.email)}</b><p>${esc(x.email)} • ${Number(x.amount)} Virtual Coin</p><p>Status: ${esc(x.status)} • ${esc(x.created_at)}</p>${x.status==='pending'?'<button class="primary" onclick="reviewCoinRequest(\''+esc(x.id)+'\',\'approved\')">Accept</button> <button onclick="reviewCoinRequest(\''+esc(x.id)+'\',\'rejected\')">Reject</button>':''}</div>`).join('')||'কোনো Request নেই';
}
async function searchCoinRequests(){const q=$('#coinSearch').value;const d=await api('/admin/coin-requests?q='+encodeURIComponent(q));renderCoinRequests(d.requests||[]);}
async function reviewCoinRequest(id,status){try{await api('/admin/coin-requests/review',{id,status});await searchCoinRequests();}catch(e){alert(e.message);}}

async function demoNumberSettings(){
 const d=await api('/admin/settings');
 const values=Object.fromEntries((d.settings||[]).map(s=>[s.key,s.value]));
 const current=values.demo_display_number||'01790365006';
 const demoMethods=[['bkash','বিকাশ','12345678912'],['nagad','নগদ','55555555555'],['rocket','রকেট','33333333333']];
 const methodFields=demoMethods.map(([id,label,fallback])=>'<div><label>'+label+' Demo Number</label><input class="field" id="demoMethodNumber-'+id+'" type="tel" inputmode="numeric" maxlength="11" value="'+esc(values['demo_number_'+id]||fallback)+'" placeholder="১১ সংখ্যার কাল্পনিক নম্বর"></div>').join('');
 const bkashIds=readWithdrawDemoIds(values.withdraw_demo_ids_bkash,'DEMO-BKASH-01');
 const nagadIds=readWithdrawDemoIds(values.withdraw_demo_ids_nagad,'DEMO-NAGAD-01');
 const rocketIds=readWithdrawDemoIds(values.withdraw_demo_ids_rocket,'DEMO-ROCKET-01');
 $('#view').innerHTML='<div class="card"><h3>Withdrawal Demo পরিচিতি</h3><p class="muted">এগুলো আসল মোবাইল নম্বর নয়; শুধু কাল্পনিক Demo কোড। ＋ দিয়ে নতুন কোড যোগ এবং Remove দিয়ে মুছতে পারবেন।</p><h4>বিকাশ Demo কোড</h4><div id="withdrawDemoBkashList">'+renderWithdrawDemoInputs('bkash',bkashIds)+'</div><button type="button" onclick="addWithdrawDemoInput(\'bkash\')">＋ Add bKash Demo</button><h4>নগদ Demo কোড</h4><div id="withdrawDemoNagadList">'+renderWithdrawDemoInputs('nagad',nagadIds)+'</div><button type="button" onclick="addWithdrawDemoInput(\'nagad\')">＋ Add Nagad Demo</button><h4>রকেট Demo কোড</h4><div id="withdrawDemoRocketList">'+renderWithdrawDemoInputs('rocket',rocketIds)+'</div><button type="button" onclick="addWithdrawDemoInput(\'rocket\')">＋ Add Rocket Demo</button><button class="primary" onclick="saveWithdrawDemoIds()">Save Withdrawal Demo Codes</button><div id="withdrawDemoIdsMsg" class="muted"></div></div><div class="card"><h3>তিনটি Demo নম্বর পরিবর্তন</h3><p class="muted">নিচের পুরোনো Deposit Demo নম্বর সেটিং আলাদা; Withdrawal Demo কোডের সঙ্গে যুক্ত নয়।</p>'+methodFields+'<button class="primary" onclick="saveDemoMethodNumbers()">Save Three Demo Numbers</button><div id="demoMethodNumbersMsg" class="muted"></div></div><div class="card"><h3>পুরোনো সাধারণ Demo নম্বর</h3><label>Demo Display Number</label><input class="field" id="demoDisplayNumberInput" type="tel" inputmode="numeric" maxlength="11" value="'+esc(current)+'" placeholder="01XXXXXXXXX"><button class="primary" onclick="saveDemoDisplayNumber()">Save Number</button><div id="demoDisplayNumberMsg" class="muted"></div></div>';
}
function readWithdrawDemoIds(raw,fallback){
 try{const v=JSON.parse(raw||'null');return Array.isArray(v)?v.filter(x=>/^DEMO-[A-Z0-9-]{1,24}$/.test(String(x))).slice(0,10):[fallback];}catch{return [fallback];}
}
function renderWithdrawDemoInputs(kind,items){
 return items.map(v=>'<div class="row" style="gap:8px;align-items:center"><input class="field withdraw-demo-id" data-kind="'+kind+'" maxlength="29" value="'+esc(v)+'" placeholder="DEMO-'+kind.toUpperCase()+'-01"><button type="button" onclick="this.parentElement.remove()">Remove</button></div>').join('');
}
function addWithdrawDemoInput(kind){
 const box=$('#withdrawDemo'+(kind==='bkash'?'Bkash':kind==='nagad'?'Nagad':'Rocket')+'List');if(!box)return;
 const count=box.querySelectorAll('.withdraw-demo-id').length;if(count>=10)return alert('সর্বোচ্চ ১০টি Demo কোড যোগ করা যাবে।');
 box.insertAdjacentHTML('beforeend',renderWithdrawDemoInputs(kind,['DEMO-'+kind.toUpperCase()+'-'+String(count+1).padStart(2,'0')]));
}
async function saveWithdrawDemoIds(){
 const msg=$('#withdrawDemoIdsMsg');
 try{
  for(const kind of ['bkash','nagad','rocket']){
   const vals=[...document.querySelectorAll('.withdraw-demo-id[data-kind="'+kind+'"]')].map(x=>x.value.trim().toUpperCase());
   if(vals.length>10||vals.some(x=>!/^DEMO-[A-Z0-9-]{1,24}$/.test(x))||new Set(vals).size!==vals.length)throw Error('শুধু DEMO- দিয়ে শুরু কাল্পনিক কোড দিন; একই কোড দুবার নয়, সর্বোচ্চ ১০টি।');
   await api('/admin/settings',{key:'withdraw_demo_ids_'+kind,value:JSON.stringify(vals)});
  }
  msg.textContent='Withdrawal Demo কোড সংরক্ষণ হয়েছে।';
 }catch(e){msg.textContent=e.message;}
}

async function saveDemoMethodNumbers(){
 const msg=$('#demoMethodNumbersMsg');
 const fields=[['bkash','বিকাশ'],['nagad','নগদ'],['rocket','রকেট']];
 try{
  for(const [id,label] of fields){
   const value=$('#demoMethodNumber-'+id).value.trim();
   if(!/^\d{11}$/.test(value))throw Error(label+' নম্বরটি ঠিক ১১ সংখ্যার হতে হবে।');
  }
  for(const [id] of fields) await api('/admin/settings',{key:'demo_number_'+id,value:$('#demoMethodNumber-'+id).value.trim()});
  msg.textContent='তিনটি Demo নম্বর সংরক্ষণ হয়েছে।';
 }catch(e){msg.textContent=e.message;}
}

async function saveDemoDisplayNumber(){
 const input=$('#demoDisplayNumberInput');
 const msg=$('#demoDisplayNumberMsg');
 const value=input.value.trim();
 if(!/^01[3-9][0-9]{8}$/.test(value)){msg.textContent='সঠিক ১১ সংখ্যার Demo নম্বর দিন (01 দিয়ে শুরু)।';return;}
 try{await api('/admin/settings',{key:'demo_display_number',value});msg.textContent='Demo নম্বর সংরক্ষণ হয়েছে।';}
 catch(e){msg.textContent=e.message;}
}

const DEPOSIT_TEXT_DEFAULTS = {"fields":{"pageTitle":"Demo Deposit","numberLabel":"DEMO NUMBER · COPY ONLY","copyButton":"Copy","numberNotice":"এটি শুধু কাল্পনিক Demo নম্বর। কোনো টাকা পাঠাবেন না।","paymentTitle":"পেমেন্ট পদ্ধতি (ডেমো)","amountLabel":"পরিমাণ","amountPlaceholder":"অথবা নিজের Demo Amount লিখুন","referenceLabel":"Demo Transaction ID (কাল্পনিক)","referencePlaceholder":"নিজের Demo Transaction ID লিখুন","referenceHint":"শুধু পরীক্ষার জন্য কাল্পনিক ID লিখুন। এটি কোনো আসল লেনদেনের প্রমাণ নয়।","submitButton":"Submit Demo Request","historyTitle":"আমার Demo Requests","loadingText":"লোড হচ্ছে…","backButton":"Member Center","chooseMethodError":"আগে একটি Demo পেমেন্ট পদ্ধতি সিলেক্ট করুন।","amountError":"সঠিক Demo Amount লিখুন।","referenceError":"একটি কাল্পনিক Demo Transaction ID লিখুন।","successMessage":"Demo Request জমা হয়েছে। এটি কোনো আসল পেমেন্ট নয় এবং কোনো কয়েন যোগ হবে না।","emptyHistory":"এখনো কোনো Demo Request নেই","historyDemoSuffix":"(Demo)","statusPending":"Pending","statusAccepted":"Accepted","statusCancelled":"Cancelled","currencyPrefix":"৳","methodBkash":"bKash","methodNagad":"Nagad","methodRocket":"Rocket","demoBadge":"DEMO","copiedButton":"Copied","copySuccess":"Demo নম্বর কপি হয়েছে","preset100":"100","preset200":"200","preset300":"300","preset500":"500","preset1000":"1000"},"categories":[]};
const DEPOSIT_FIELD_LABELS = {"pageTitle":"পেজের শিরোনাম","numberLabel":"Demo নম্বরের উপরের লেখা","copyButton":"Copy বাটন","numberNotice":"নম্বরের নিচের সতর্কবার্তা","paymentTitle":"পদ্ধতি বিভাগের শিরোনাম","amountLabel":"পরিমাণের Label","amountPlaceholder":"পরিমাণ ইনপুট Placeholder","referenceLabel":"Demo ID Label","referencePlaceholder":"Demo ID Placeholder","referenceHint":"Demo ID-এর নিচের লেখা","submitButton":"Submit বাটন","historyTitle":"Request History শিরোনাম","loadingText":"লোডিং লেখা","backButton":"ফিরে যাওয়ার বাটন","chooseMethodError":"পদ্ধতি না বাছলে Error","amountError":"ভুল পরিমাণ Error","referenceError":"Demo ID Error","successMessage":"Request জমার Message","emptyHistory":"খালি History Message","historyDemoSuffix":"History-তে Demo শব্দ","statusPending":"Pending Status","statusAccepted":"Accepted Status","statusCancelled":"Cancelled Status","currencyPrefix":"পরিমাণের আগে চিহ্ন","methodBkash":"বিকাশ বাটনের নাম","methodNagad":"নগদ বাটনের নাম","methodRocket":"রকেট বাটনের নাম","demoBadge":"DEMO Badge","copiedButton":"Copy হওয়ার পর বাটনের লেখা","copySuccess":"Copy সফল হলে Toast","preset100":"প্রথম Amount বাটন","preset200":"দ্বিতীয় Amount বাটন","preset300":"তৃতীয় Amount বাটন","preset500":"চতুর্থ Amount বাটন","preset1000":"পঞ্চম Amount বাটন"};
async function depositTextSettings(){
 const d=await api('/admin/settings');
 const raw=d.settings.find(x=>x.key==='deposit_content')?.value;
 let data=DEPOSIT_TEXT_DEFAULTS;
 try{if(raw)data=JSON.parse(raw);}catch{}
 const fields={...DEPOSIT_TEXT_DEFAULTS.fields,...(data.fields||{})};
 const categories=(Array.isArray(data.categories)?data.categories:DEPOSIT_TEXT_DEFAULTS.categories).filter(c=>!(String(c.title||'').trim()==='ডেমো নির্দেশনা'&&String(c.text||'').trim()==='এখানে শুধু কাল্পনিক Demo তথ্য ব্যবহার করুন।')&&!(String(c.title||'').trim()==='অতিরিক্ত তথ্য'&&String(c.text||'').trim()==='এই পেজে কোনো বাস্তব পেমেন্ট বা কয়েন জমা হয় না।'));
 const keys=Object.keys(DEPOSIT_FIELD_LABELS);
 $('#view').innerHTML='<div class="card"><h3>Deposit & Withdrawal Page Editor</h3><p class="muted">নিচের ট্যাব থেকে সম্পূর্ণ পেজের লেখা সম্পাদনা করুন। পেজের মূল ডিজাইন অপরিবর্তিত থাকবে।</p><div class="admin-nav"><button type="button" onclick="depositTextSettings()">Deposit Page</button><button type="button" onclick="withdrawTextSettings()">Withdrawal Page</button></div></div><div class="card"><h3>Deposit Page-এর লেখা সম্পাদনা</h3><p class="muted">প্রতিটি ঘরে ইউজার পেজের লেখা পরিবর্তন করুন। নিরাপত্তার Demo সতর্কবার্তা অপরিবর্তিত থাকবে।</p>'+keys.map(k=>'<label>'+esc(DEPOSIT_FIELD_LABELS[k])+'</label><textarea class="field deposit-text-field" data-key="'+k+'" rows="2">'+esc(fields[k]??'')+'</textarea>').join('')+'<button class="primary" onclick="saveDepositTextFields()">Save Deposit Text</button><div id="depositTextSaveMsg" class="muted"></div></div><div class="card"><h3>নতুন ক্যাটাগরি তৈরি</h3><p class="muted">Deposit পেজে আলাদা শিরোনাম ও লেখা হিসেবে দেখাবে।</p><div id="depositCustomCategories">'+categories.map((c,i)=>depositCategoryHtml(c,i)).join('')+'</div><button type="button" onclick="addDepositTextCategory()">＋ নতুন ক্যাটাগরি</button><button class="primary" onclick="saveDepositTextFields()">Save Text & Categories</button></div>';
}
function depositCategoryHtml(c,i){
 return '<div class="card deposit-custom-category"><label>ক্যাটাগরির নাম</label><input class="field deposit-category-title" maxlength="80" value="'+esc(c.title||'')+'" placeholder="ক্যাটাগরির নাম"><label>ক্যাটাগরির লেখা</label><textarea class="field deposit-category-text" maxlength="300" rows="3">'+esc(c.text||'')+'</textarea><button type="button" onclick="this.parentElement.remove()">ক্যাটাগরি মুছুন</button></div>';
}
function addDepositTextCategory(){
 const box=$('#depositCustomCategories');if(!box)return;
 if(box.children.length>=12)return alert('সর্বোচ্চ ১২টি ক্যাটাগরি যোগ করা যাবে।');
 box.insertAdjacentHTML('beforeend',depositCategoryHtml({title:'নতুন ক্যাটাগরি',text:''},box.children.length));
}
async function saveDepositTextFields(){
 const msg=$('#depositTextSaveMsg');
 try{
  const fields={};
  document.querySelectorAll('.deposit-text-field').forEach(el=>fields[el.dataset.key]=el.value);
  if(!/(কোনো টাকা পাঠাবেন না|do not send money|no real money)/i.test(fields.numberNotice||''))throw Error('Demo সতর্কবার্তায় “কোনো টাকা পাঠাবেন না” কথাটি রাখতে হবে।');
  const categories=[...document.querySelectorAll('.deposit-custom-category')].map(el=>({title:el.querySelector('.deposit-category-title').value.trim(),text:el.querySelector('.deposit-category-text').value.trim()}));
  if(categories.length>12||categories.some(c=>!c.title||!c.text))throw Error('প্রতিটি ক্যাটাগরির নাম ও লেখা পূরণ করুন; সর্বোচ্চ ১২টি।');
  await api('/admin/settings',{key:'deposit_content',value:JSON.stringify({fields,categories})});
  msg.textContent='Deposit পেজের লেখা ও ক্যাটাগরি সংরক্ষণ হয়েছে।';
 }catch(e){msg.textContent=e.message;}
}


function pageTextEditor(){depositTextSettings();}
const WITHDRAW_FIELD_LABELS = {
 pageTitle:'পেজের শিরোনাম',safetyNote:'নিরাপত্তা / Demo নির্দেশনা',methodTitle:'পদ্ধতি বিভাগের শিরোনাম',
 methodBkash:'বিকাশ বাটনের নাম',methodNagad:'নগদ বাটনের নাম',methodRocket:'রকেট বাটনের নাম',demoBadge:'DEMO Badge',
 demoIdsHint:'কোড না বাছাই করলে দেখানো লেখা',demoIdsLabel:'Demo কোডের আগে লেখা',noDemoIds:'কোড না থাকলে দেখানো লেখা',
 amountLabel:'কয়েনের পরিমাণের Label',amountPlaceholder:'পরিমাণ ইনপুট Placeholder',balanceLabel:'বর্তমান ব্যালেন্সের Label',
 coinSuffix:'ব্যালেন্সের Coin শব্দ',submitButton:'Submit বাটনের লেখা',historyTitle:'Request History শিরোনাম',
 loadingText:'লোডিং লেখা',emptyHistory:'খালি History লেখা',recordTitle:'Withdrawal Record শিরোনাম',
 emptyRecord:'খালি Record লেখা',backButton:'ফিরে যাওয়ার বাটন',chooseMethodError:'পদ্ধতি না বাছলে Error',
 amountError:'ভুল পরিমাণ Error',balanceError:'ব্যালেন্স কম হলে Error',successMessage:'Request জমার Message',
 statusPending:'Pending Status',statusApproved:'Approved Status',statusRejected:'Rejected Status',historyCoinSuffix:'History-তে Coin শব্দ'
};
async function withdrawTextSettings(){
 const d=await api('/admin/settings');let data={fields:{}};
 try{const raw=d.settings.find(x=>x.key==='withdraw_content')?.value;if(raw)data=JSON.parse(raw);}catch{}
 const defaults={"pageTitle":"Demo Withdrawal","safetyNote":"শুধু নগদমূল্যহীন Virtual Coin-এর Demo Request। বিকাশ/নগদ/রকেট বাটনগুলো কেবল পদ্ধতি বাছাইয়ের জন্য—কোনো ওয়ালেট নম্বর, টাকা পাঠানো বা নগদ উত্তোলন নেই।","methodTitle":"পদ্ধতি নির্বাচন করুন","methodBkash":"bKash","methodNagad":"Nagad","methodRocket":"Rocket","demoBadge":"DEMO","demoIdsHint":"বিকাশ বা নগদ নির্বাচন করলে Demo পরিচিতি দেখাবে।","demoIdsLabel":"শুধু Demo পরিচিতি:","noDemoIds":"এই পদ্ধতিতে কোনো Demo পরিচিতি যোগ করা হয়নি।","amountLabel":"কয়েনের পরিমাণ","amountPlaceholder":"কত Virtual Coin ফেরত চান","balanceLabel":"বর্তমান ব্যালেন্স:","coinSuffix":"Coin","submitButton":"Submit Demo Withdrawal","historyTitle":"আমার Withdrawal Requests","loadingText":"লোড হচ্ছে…","emptyHistory":"এখনো কোনো Request নেই","recordTitle":"Withdrawal Record","emptyRecord":"কোনো Withdrawal Record নেই","backButton":"Member Center","chooseMethodError":"বিকাশ, নগদ অথবা রকেট নির্বাচন করুন।","amountError":"সঠিক কয়েনের পরিমাণ লিখুন।","balanceError":"আপনার ব্যালেন্সে পর্যাপ্ত Virtual Coin নেই।","successMessage":"Request জমা হয়েছে। নির্ধারিত Virtual Coin সঙ্গে সঙ্গে ব্যালেন্স থেকে কেটে Pending থাকবে; Admin বাতিল করলে কয়েন ফেরত আসবে। কোনো টাকা পাঠানো হবে না।","statusPending":"Pending","statusApproved":"Approved","statusRejected":"Rejected","historyCoinSuffix":"Virtual Coin"};
 const values={...defaults,...(data.fields||{})};
 const keys=Object.keys(WITHDRAW_FIELD_LABELS);
 $('#view').innerHTML='<div class="card"><h3>Deposit & Withdrawal Page Editor</h3><p class="muted">Withdrawal পেজের সব দৃশ্যমান লেখা এখান থেকে বদলাতে পারবেন। মূল ডিজাইন ও Virtual Coin Demo নিয়ম একই থাকবে।</p><div class="admin-nav"><button type="button" onclick="depositTextSettings()">Deposit Page</button><button type="button" onclick="withdrawTextSettings()">Withdrawal Page</button></div></div><div class="card"><h3>Withdrawal Page-এর সম্পূর্ণ লেখা</h3>'+keys.map(k=>'<label>'+esc(WITHDRAW_FIELD_LABELS[k])+'</label><textarea class="field withdraw-text-field" data-key="'+k+'" rows="2">'+esc(values[k]??'')+'</textarea>').join('')+'<p class="muted">নিরাপত্তার Demo নির্দেশনায় বাস্তব টাকা পাঠানো বা ওয়ালেট নম্বর না থাকার কথাটি রাখতে হবে।</p><button class="primary" onclick="saveWithdrawTextFields()">Save Withdrawal Page Text</button><div id="withdrawTextSaveMsg" class="muted"></div></div>';
}
async function saveWithdrawTextFields(){
 const msg=$('#withdrawTextSaveMsg');
 try{const fields={};document.querySelectorAll('.withdraw-text-field').forEach(el=>fields[el.dataset.key]=el.value);
 if(!/(কোনো ওয়ালেট নম্বর|কোনো টাকা পাঠানো|no real money|no wallet)/i.test(fields.safetyNote||''))throw Error('Demo নির্দেশনায় কোনো ওয়ালেট নম্বর বা টাকা পাঠানো হয় না—এ কথা রাখতে হবে।');
 await api('/admin/settings',{key:'withdraw_content',value:JSON.stringify({fields})});msg.textContent='Withdrawal পেজের সব লেখা সংরক্ষণ হয়েছে。';
 }catch(e){msg.textContent=e.message;}
}

async function superAceCardImages(){
 const d=await api('/admin/settings');
 const rows=Object.fromEntries((d.settings||[]).map(x=>[x.key,x.value]));
 let current={};try{current=JSON.parse(rows.superace_card_art||'{}');if(!current||typeof current!=='object')current={};}catch{current={};}
 const cards=[["ace","Ace"],["king","King"],["queen","Queen"],["jack","Jack"],["spade","Spade"],["heart","Heart"],["diamond","Diamond"],["club","Club"],["wild","Wild"],["scatter","SCATTER"],["goldenAce","Yellow Ace"],["goldenCard","Yellow King"],["goldenQueen","Yellow Queen"],["goldenJack","Yellow Jack"],["goldenSpade","Yellow Spade"],["goldenHeart","Yellow Heart"],["goldenDiamond","Yellow Diamond"],["goldenClub","Yellow Club"],["goldenJoker","Golden Joker"]];
 $('#view').innerHTML='<div class="card"><h3>Super Ace — সব সাধারণ, হলুদ/Golden তাস ও SCATTER-এর ছবি</h3><p class="muted">গেমের ৮টি সাধারণ তাস, ৮টি হলুদ/Golden তাস, Wild, SCATTER এবং Golden Joker—সবগুলোর আলাদা HTTPS Image URL দিন। ফাঁকা রাখলে আগের ডিফল্ট ছবি থাকবে।</p>'+cards.map(([id,label])=>'<div style="margin:12px 0"><label>'+label+' Image URL</label><input class="field superace-art-url" data-card="'+id+'" type="url" maxlength="1000" placeholder="https://example.com/'+id+'.png" value="'+esc(current[id]||'')+'"><img data-card-preview="'+id+'" src="'+esc(current[id]||'')+'" style="max-width:100px;max-height:130px;object-fit:contain;margin:6px 0" '+(current[id]?'':'hidden')+'></div>').join('')+'<button class="primary" id="saveSuperAceArt">Save Super Ace তাসের ছবি</button><div id="superAceArtMsg" class="muted"></div></div>';
 document.querySelectorAll('.superace-art-url').forEach(input=>input.addEventListener('input',()=>{const img=document.querySelector('[data-card-preview="'+input.dataset.card+'"]');img.src=input.value;img.hidden=!input.value;}));
 $('#saveSuperAceArt').onclick=async()=>{const msg=$('#superAceArtMsg');try{const value={};for(const input of document.querySelectorAll('.superace-art-url')){const url=input.value.trim();if(url&&!/^https:\/\//i.test(url))throw Error(input.dataset.card+' ছবির URL অবশ্যই HTTPS হতে হবে');if(url)value[input.dataset.card]=url;}await api('/admin/settings',{key:'superace_card_art',value:JSON.stringify(value)});msg.textContent='Super Ace-এর সব তাস ও SCATTER-এর ছবি সংরক্ষণ হয়েছে।';}catch(e){msg.textContent=e.message;}};
}
async function settings(){
 const d=await api('/admin/settings');
 const values=Object.fromEntries(d.settings.map(s=>[s.key,s.value]));
 const imageRows=[['bkash','bKash'],['nagad','Nagad'],['rocket','Rocket']];
 let imageHtml='';
 for(const item of imageRows){const id=item[0],label=item[1],value=values['demo_payment_image_'+id]||'';imageHtml+='<div><label>'+label+' Image URL</label><input class="field" type="url" id="demoPayImg-'+id+'" maxlength="1000" placeholder="https://example.com/'+id+'.png" value="'+esc(value)+'"><img id="demoPayPreview-'+id+'" src="'+esc(value)+'" style="max-width:150px;max-height:55px;object-fit:contain;margin:8px 0" '+(value?'':'hidden')+'></div>';}
 $('#view').innerHTML='<div class="card"><h3>Demo Deposit Button Images</h3><p class="muted">ইউজার সাইটের Demo Deposit পেজে bKash, Nagad ও Rocket বাটনের ছবির HTTPS URL দিন। খালি রাখলে আগের নাম দেখাবে।</p>'+imageHtml+'<button class="primary" onclick="saveDemoPaymentImages()">Save Demo Button Images</button><div id="demoPayImageMsg" class="muted"></div></div>'+
 '<div class="card"><h3>Withdrawal Button Images</h3><p class="muted">Withdrawal পেজের বিকাশ, নগদ ও রকেট বাটনে ছবি দেখাতে HTTPS Image URL দিন। খালি রাখলে আগের বাটন লেখা দেখাবে।</p>'+imageRows.map(([id,label])=>'<div><label>'+label+' Withdrawal Image URL</label><input class="field" type="url" id="withdrawPayImg-'+id+'" maxlength="1000" placeholder="https://example.com/'+id+'.png" value="'+esc(values['withdraw_button_image_'+id]||'')+'"><img id="withdrawPayPreview-'+id+'" src="'+esc(values['withdraw_button_image_'+id]||'')+'" style="max-width:150px;max-height:55px;object-fit:contain;margin:8px 0" '+(values['withdraw_button_image_'+id]?'':'hidden')+'></div>').join('')+'<button class="primary" onclick="saveWithdrawButtonImages()">Save Withdrawal Button Images</button><div id="withdrawPayImageMsg" class="muted"></div></div>'+ 
 '<div class="card"><h3>Telegram Support Button</h3><p class="muted">ইউজার সাইটের ডান পাশে ছোট গোল Telegram বাটন দেখাবে। গেমের ভেতরে এটি লুকানো থাকবে।</p><label>Telegram Username (@ ছাড়া)</label><input class="field" id="supportTelegramUsername" maxlength="80" placeholder="your_username" value="'+esc(values.support_telegram_username||'')+'"><label>বাটনের ছবির HTTPS URL (ঐচ্ছিক)</label><input class="field" id="supportTelegramImage" type="url" maxlength="1000" placeholder="https://example.com/support.png" value="'+esc(values.support_telegram_image_url||'')+'"><button class="primary" onclick="saveSupportSettings()">Save Telegram Support</button><div id="supportSaveMsg" class="muted"></div></div>'+
 '<div class="card"><h3>Site Settings</h3>'+d.settings.filter(s=>!['support_telegram_username','support_telegram_image_url','demo_payment_image_bkash','demo_payment_image_nagad','demo_payment_image_rocket','withdraw_button_image_bkash','withdraw_button_image_nagad','withdraw_button_image_rocket','demo_display_number'].includes(s.key)).map(s=>'<div><label>'+esc(s.key)+'</label><input class="field" id="set-'+esc(s.key)+'" value="'+esc(s.value)+'"><button onclick="saveSetting(\''+esc(s.key)+'\')">Save</button></div>').join('')+'<p class="muted">Settings values are stored in D1.</p></div>';
 for(const item of imageRows){const id=item[0],input=$('#demoPayImg-'+id),img=$('#demoPayPreview-'+id);input.addEventListener('input',()=>{img.src=input.value;img.hidden=!input.value;});}
 for(const item of imageRows){const id=item[0],input=$('#withdrawPayImg-'+id),img=$('#withdrawPayPreview-'+id);input.addEventListener('input',()=>{img.src=input.value;img.hidden=!input.value;});}
}
async function saveWithdrawButtonImages(){const msg=$('#withdrawPayImageMsg');try{for(const id of ['bkash','nagad','rocket']){const value=$('#withdrawPayImg-'+id).value.trim();if(value&&!/^https:\/\//i.test(value))throw Error(id+' image URL অবশ্যই HTTPS হতে হবে');await api('/admin/settings',{key:'withdraw_button_image_'+id,value});}msg.textContent='Withdrawal বাটনের তিনটি Image URL সংরক্ষণ হয়েছে।';}catch(e){msg.textContent=e.message;}}
async function saveDemoPaymentImages(){
 const msg=$('#demoPayImageMsg');
 try{for(const id of ['bkash','nagad','rocket']){const value=$('#demoPayImg-'+id).value.trim();if(value&&!/^https:\/\//i.test(value))throw Error(id+' image URL অবশ্যই HTTPS হতে হবে');await api('/admin/settings',{key:'demo_payment_image_'+id,value});}msg.textContent='তিনটি Demo বাটনের Image URL সংরক্ষণ হয়েছে।';}
 catch(e){msg.textContent=e.message;}
}
async function saveSupportSettings(){const username=$('#supportTelegramUsername').value.trim().replace(/^@/,'');const image=$('#supportTelegramImage').value.trim();const msg=$('#supportSaveMsg');if(username&&!/^[A-Za-z0-9_]{5,32}$/.test(username)){msg.textContent='সঠিক Telegram username দিন (@ ছাড়া)।';return;}if(image&&!/^https:\/\//i.test(image)){msg.textContent='ছবির URL অবশ্যই HTTPS হতে হবে।';return;}try{await api('/admin/settings',{key:'support_telegram_username',value:username});await api('/admin/settings',{key:'support_telegram_image_url',value:image});msg.textContent='Telegram Support সেটিংস সংরক্ষণ হয়েছে।';}catch(e){msg.textContent=e.message;}}
async function saveSetting(key){await api('/admin/settings',{key,value:$('#set-'+key).value});alert('Saved')}
function logout(){localStorage.removeItem('tk777_admin_token');token='';login()}
dashboard();
async function referralSettings(){
 try{
  const v=await api('/admin/referral-settings');
  $('#view').innerHTML=`<div class="card"><h3>Referral System Settings</h3><p class="muted">সব পরিমাণ নগদমূল্যহীন Virtual Coin। নতুন প্লেয়ার গেম খেলে নির্ধারিত মোট টার্নওভার পূরণ করলে রেফারকারী একবার বোনাস পাবেন।</p><label>টার্নওভার শর্ত (Virtual Coin)</label><input class="field" id="refThreshold" type="number" min="1" max="1000000" step="1" value="${v.threshold}"><label>Referral Bonus (Virtual Coin)</label><input class="field" id="refBonus" type="number" min="1" max="1000000" step="1" value="${v.bonus}"><button class="primary" onclick="saveReferralSettings()">Save Referral Settings</button><div id="refSettingsMsg" class="muted"></div></div>`;
 }catch(e){$('#view').textContent=e.message;}
}
async function saveReferralSettings(){
 const msg=$('#refSettingsMsg');
 try{
  const threshold=Number($('#refThreshold').value),bonus=Number($('#refBonus').value);
  const r=await api('/admin/referral-settings',{threshold,bonus});
  msg.textContent='Referral Settings সংরক্ষণ হয়েছে। Threshold: '+r.threshold+' Coin, Bonus: '+r.bonus+' Coin';
 }catch(e){msg.textContent=e.message;}
}