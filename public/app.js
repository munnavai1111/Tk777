
let token = localStorage.getItem('tk777_token') || '';
let me = null, categories = [], games = [];
let homeBanners = [], homeBannerTimer = null;
let promotionBanners = [];
let supportSettings = {telegram_username:'',telegram_image_url:''};
const DEFAULT_DEPOSIT_CONTENT = {"fields":{"pageTitle":"Deposit","numberLabel":"NUMBER · COPY ONLY","copyButton":"Copy","numberNotice":"সেন্ড মানি করুন এই নাম্বারে।","paymentTitle":"পেমেন্ট পদ্ধতি","amountLabel":"পরিমাণ","amountPlaceholder":"Amount লিখুন","referenceLabel":"Transaction ID (BDT)","referencePlaceholder":"Transaction ID লিখুন","referenceHint":"ID লিখুন।","submitButton":"Submit Request","historyTitle":"আমার Requests","loadingText":"লোড হচ্ছে…","backButton":"Member Center","chooseMethodError":"আগে একটি পেমেন্ট পদ্ধতি সিলেক্ট করুন।","amountError":"সঠিক Amount লিখুন।","referenceError":"একটি Transaction ID লিখুন।","successMessage":"Request জমা হয়েছে। ২ মিনিটের মধ্যে ব্যালেন্স যোগ হবে ।","emptyHistory":"এখনো কোনো Request নেই","historyDemoSuffix":"(BDT)","statusPending":"Pending","statusAccepted":"Accepted","statusCancelled":"Cancelled","currencyPrefix":"৳"},"categories":[]};
let depositContent = DEFAULT_DEPOSIT_CONTENT;
const DEFAULT_WITHDRAW_CONTENT = {"fields":{"pageTitle":" Withdrawal","safetyNote":"শুধু নগদমূল্যহীন Virtual Coin-এর Demo Request। বিকাশ/নগদ/রকেট।","methodTitle":"পদ্ধতি নির্বাচন করুন","methodBkash":"bKash","methodNagad":"Nagad","methodRocket":"Rocket","demoBadge":"BDT","demoIdsHint":"বিকাশ বা নগদ নির্বাচন করলে পরিচিতি দেখাবে।","demoIdsLabel":"শুধু পরিচিতি:","noDemoIds":" সমস্যা হলে টেলিগ্রামে যোগাযোগ করুন।","amountLabel":" পরিমাণ","amountPlaceholder":"কত টাকা উইথড্র করতে চান","balanceLabel":"বর্তমান ব্যালেন্স:","coinSuffix":"Coin","submitButton":"Submit Demo Withdrawal","historyTitle":"আমার Withdrawal Requests","loadingText":"লোড হচ্ছে…","emptyHistory":"এখনো কোনো Request নেই","recordTitle":"Withdrawal Record","emptyRecord":"কোনো Withdrawal Record নেই","backButton":"Member Center","chooseMethodError":"বিকাশ, নগদ অথবা রকেট নির্বাচন করুন।","amountError":"সঠিক কয়েনের পরিমাণ লিখুন।","balanceError":"আপনার ব্যালেন্সে পর্যাপ্ত ব্যালেন্স নেই।","successMessage":"Request জমা হয়েছে। নির্ধারিত Virtual Coin সঙ্গে সঙ্গে ব্যালেন্স থেকে কেটে Pending থাকবে; Admin বাতিল করলে কয়েন ফেরত আসবে। কোনো টাকা পাঠানো হবে না।","statusPending":"Pending","statusApproved":"Approved","statusRejected":"Rejected","historyCoinSuffix":"Virtual Coin"}};
let withdrawContent = DEFAULT_WITHDRAW_CONTENT;
function withdrawText(key){return String((withdrawContent.fields||{})[key] ?? (DEFAULT_WITHDRAW_CONTENT.fields||{})[key] ?? '');}
function depositText(key){return String((depositContent.fields||{})[key] ?? (DEFAULT_DEPOSIT_CONTENT.fields||{})[key] ?? '');}
function depositExtraCategories(){return (Array.isArray(depositContent.categories)?depositContent.categories:[]).map(c=>'<div class="card"><h3>'+esc(c.title||'')+'</h3><p>'+esc(c.text||'')+'</p></div>').join('');}
let demoPaymentImages = {bkash:'',nagad:'',rocket:''};
let withdrawButtonImages = {bkash:'',nagad:'',rocket:''};
let demoMethodNumbers = {bkash:'12345678912',nagad:'55555555555',rocket:'33333333333'};
let withdrawDemoIds = {bkash:['BKASH-01'],nagad:['NAGAD-01'],rocket:['ROCKET-01']};
let slotDisplayImages = {}, slotDisplayHidden = [];
let isPlayingGame = false;
let crashTimer = null;
let crashGameId = null;
let crashPollBusy = false;
let crashPhase = 'countdown';
let crashHistoryData = [];
let crashVisualFrame = null;
let crashVisualValue = 1;
let crashVisualSegment = null;
let crashVisualUpdatedAt = 0;
let crashVisualStartMs = null;
let crashServerClockOffset = 0;
let crashVisualCrashMultiplier = null;
let aviatorCrowdSession = null;
let aviatorCrowdPeak = 1832;


let crashSlots = [
  { roundId:null,busy:false,status:'ready',auto:false,autoBet:false,autoTarget:2,lastAutoSessionId:null },
  { roundId:null,busy:false,status:'ready',auto:false,autoBet:false,autoTarget:2,lastAutoSessionId:null }
];

window.TK777_WELCOME_AUDIO='data:audio/mpeg;base64,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';
const $ = s => document.querySelector(s);

let tk777WelcomeAudio=null;
let tk777WelcomeStarted=false;
let tk777WelcomePending=false;
function startTk777WelcomeAudio(){
  if(tk777WelcomeStarted || tk777WelcomePending)return;
  if(!tk777WelcomeAudio){
    tk777WelcomeAudio=new Audio();
    tk777WelcomeAudio.src=window.TK777_WELCOME_AUDIO;
    tk777WelcomeAudio.preload='auto';
    tk777WelcomeAudio.volume=0.9;
    tk777WelcomeAudio.load();
  }
  tk777WelcomePending=true;
  const attempt=tk777WelcomeAudio.play();
  if(attempt && typeof attempt.then==='function'){
    attempt.then(()=>{
      tk777WelcomeStarted=true;
      tk777WelcomePending=false;
    }).catch(()=>{
      tk777WelcomePending=false;
      // Browser autoplay may be blocked; retry on the next user interaction.
    });
  } else {
    tk777WelcomeStarted=true;
    tk777WelcomePending=false;
  }
}
// Begin buffering and attempt playback as soon as this script runs.
startTk777WelcomeAudio();
// Keep retrying after autoplay rejection; a successful user gesture can unlock playback.
document.addEventListener('pointerdown',startTk777WelcomeAudio,{capture:true});
document.addEventListener('keydown',startTk777WelcomeAudio,{capture:true});

window.addEventListener('message', event => {
  if (event.origin !== location.origin) return;
  const frame = document.getElementById('superAceFrame');
  if (!frame || event.source !== frame.contentWindow) return;
  if (event.data?.type === 'tk777-welcome-audio') {
    startTk777WelcomeAudio();
    return;
  }
  if (event.data?.type !== 'tk777-balance-update') return;
  const balance = Number(event.data.balance);
  if (!Number.isFinite(balance) || balance < 0) return;
  if (me) me.balance = balance;
  const amount = money(balance);
  ['topBalanceValue','memberBalanceValue','gameBalance'].forEach(id => {
    const element = document.getElementById(id);
    if (element) element.textContent = amount;
  });
});

const api = async (path, body = null) => {
  const r = await fetch('/api' + path, {
    method: body ? 'POST' : 'GET',
    headers: {
      'Content-Type':'application/json',
      ...(token ? {Authorization:'Bearer '+token} : {})
    },
    body: body ? JSON.stringify(body) : undefined
  });

  const raw = await r.text();
  let d;

  try {
    d = JSON.parse(raw);
  } catch {
    throw Error(`API Error: HTTP ${r.status}; JSON response পাওয়া যায়নি`);
  }

  if (!r.ok) throw Error(d.error || 'সমস্যা হয়েছে');
  return d;
};

const money = n =>
  'BDT ' + Number(n || 0).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});

function esc(s = '') {
  return String(s).replace(/[&<>"']/g, c => ({
    '&':'&amp;',
    '<':'&lt;',
    '>':'&gt;',
    '"':'&quot;',
    "'":'&#39;'
  }[c]));
}

function stopCrashMonitor() {
  if (crashVisualFrame !== null) cancelAnimationFrame(crashVisualFrame);
  crashVisualFrame = null;
  crashVisualSegment = null;
  crashVisualValue = 1;
  crashVisualUpdatedAt = 0;
  crashVisualStartMs = null;
  if (crashTimer) clearInterval(crashTimer);
  crashTimer = null;
  crashGameId = null;
  crashPollBusy = false;
  crashPhase = 'countdown';
}

const TK777_AVATARS = ['😎','🧑🏻‍🚀','🐼','🐧','🐯'];
let accountProfile = null;
async function loadAccountProfile(){
  try {
    const data=await api('/account/profile');
    accountProfile=data.profile||null;
    const label='VIP LEVEL '+Number(accountProfile?.vip_level||0);
    const top=document.getElementById('topVipBadge'),member=document.getElementById('memberVipBadge');
    if(top){top.textContent=label;top.hidden=false;}
    if(member)member.textContent=label;
    const name=document.getElementById('memberProfileName'),phone=document.getElementById('memberProfilePhone'),gmail=document.getElementById('memberProfileGmail');
    if(name)name.textContent=accountProfile.display_name||'নাম সেট করা হয়নি';
    if(phone)phone.textContent='ইউজার নাম: '+(accountProfile.phone||'');
    if(gmail)gmail.textContent='Gmail: '+(accountProfile.gmail_masked||'***');
    return accountProfile;
  } catch(e) { return null; }
}
function selectedAvatar() {
  const n = Number(localStorage.getItem('tk777_profile_avatar') || 0);
  return Number.isInteger(n) && n >= 0 && n < TK777_AVATARS.length ? n : 0;
}
function avatarImage(index, extraClass) {
  const emoji = TK777_AVATARS[index] || TK777_AVATARS[0];
  const colors = [['#ffe36a','#e69b22'],['#8bd9ff','#3475bd'],['#f7f7f7','#aab8c7'],['#a6f2e1','#299b89'],['#ffbf72','#d65c2b']];
  const pair = colors[index] || colors[0];
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="g" x2="1" y2="1"><stop stop-color="'+pair[0]+'"/><stop offset="1" stop-color="'+pair[1]+'"/></linearGradient></defs><circle cx="50" cy="50" r="49" fill="url(#g)"/><circle cx="50" cy="50" r="45" fill="none" stroke="#ffffff" stroke-opacity=".65" stroke-width="3"/><text x="50" y="68" text-anchor="middle" font-size="62">'+emoji+'</text></svg>';
  return '<img class="'+(extraClass || '')+'" alt="Profile avatar" src="data:image/svg+xml,'+encodeURIComponent(svg)+'">';
}
function toggleAvatarPicker() {
  const panel = document.getElementById('avatarPicker');
  if (panel) panel.hidden = !panel.hidden;
}
function chooseAvatar(index) {
  if (!Number.isInteger(index) || index < 0 || index >= TK777_AVATARS.length) return;
  localStorage.setItem('tk777_profile_avatar',String(index));
  const current = document.getElementById('topProfileAvatar');
  if (current) current.outerHTML = avatarImage(index,'top-profile-avatar').replace('<img ','<img id="topProfileAvatar" ');
  const member = document.getElementById('memberProfileAvatar');
  if (member) member.outerHTML = avatarImage(index,'member-large-avatar').replace('<img ','<img id="memberProfileAvatar" ');
  const account = document.getElementById('accountProfileAvatar');
  if (account) account.outerHTML = avatarImage(index,'account-large-avatar').replace('<img ','<img id="accountProfileAvatar" ');
  const panel = document.getElementById('avatarPicker');
  if (panel) panel.hidden = true;
}

async function refreshBalance(button) {
  if (!me || !token) return showAuth();
  if (button) button.classList.add('is-refreshing');
  try {
    const data = await api('/me');
    me = data.user;
    const amount = money(me.balance);
    const top = document.getElementById('topBalanceValue');
    const member = document.getElementById('memberBalanceValue');
    const game = document.getElementById('gameBalance');
    if (top) top.textContent = amount;
    if (member) member.textContent = amount;
    if (game) game.textContent = amount;
    toast('ব্যালেন্স আপডেট হয়েছে');
  } catch (e) {
    toast(e.message || 'ব্যালেন্স রিফ্রেশ করা যায়নি');
  } finally {
    if (button) button.classList.remove('is-refreshing');
  }
}

function memberCenter() {
  shell(`
    <div class="member-page">
      <section class="member-profile-card">
        <div class="member-profile-main">
          <button class="member-avatar-button" onclick="toggleAvatarPicker()" aria-label="প্রোফাইল ছবি পরিবর্তন">
            ${avatarImage(selectedAvatar(),'member-large-avatar').replace('<img ','<img id="memberProfileAvatar" ')}
          </button>
          <div class="member-identity">
            <span class="member-level" id="memberVipBadge">VIP LEVEL —</span>
            <h2 id="memberProfileName">${esc(me.username || 'Member')}</h2>
            <p id="memberProfilePhone">ইউজার নাম: ${esc(me.username || '')}</p>
            <p id="memberProfileGmail">Gmail: ***</p>
          </div>
        </div>
        <div class="member-balance">
          <div><small>AVAILABLE BALANCE</small><strong id="memberBalanceValue">${money(me.balance)}</strong></div>
          <button type="button" onclick="refreshBalance(this)" aria-label="Refresh balance"><span class="member-balance-refresh-icon">↻</span></button>
        </div>
        <div class="member-shortcuts">
          <button onclick="openHomeDeposit()">Deposit</button>
          <button onclick="openHomeWithdraw()">Withdrawal</button>
          <button onclick="page('bank')">Bank Account</button>
        </div>
      </section>
      <div class="member-section-title"><span>Member Center</span></div>
      <div class="member-menu-grid">
        <button onclick="page('reward')"><i>🏆</i><span>My Rewards</span></button>
        <button onclick="page('history')"><i>✥</i><span>Bet History</span></button>
        <button onclick="page('profitloss')"><i>▤</i><span>Profit And Loss</span></button>
        <button onclick="page('depositRecord')"><i>📋</i><span>Deposit Record</span></button>
        <button onclick="page('withdrawRecord')"><i>📥</i><span>Withdrawal Record</span></button>
        <button onclick="page('history')"><i>▣</i><span>Transaction History</span></button>
        <button onclick="page('account')"><i>♙</i><span>My Account</span></button>
        <button onclick="page('security')"><i>♢</i><span>Security Center</span></button>
        <button onclick="page('invite')"><i>♧</i><span>Invite Friends</span></button>
        <button onclick="page('mission')"><i>🎁</i><span>Mission</span></button>
        <button onclick="page('rebate')"><i>◉</i><span>Rebate</span></button>
        <button class="internal-message-menu" onclick="page('messages')"><i>✉</i><span>Internal Message</span><em id="internalMessageBadge" class="internal-message-badge" hidden>0</em></button>
        <button onclick="page('suggestion')"><i>☏</i><span>Suggestion</span></button>
        <button onclick="page('download')"><i>⇩</i><span>Download App</span></button>
        <button onclick="page('service')"><i>◷</i><span>Customer Service</span></button>
        <button onclick="logout()"><i>⇥</i><span>Logout</span></button>
      </div>
    </div>
  `);
  loadAccountProfile();
  loadUnreadMessages();
}

async function profitLossPage() {
  if (!me) return showAuth();
  try {
    const d = await api('/history');
    const rounds = d.rounds || [];
    const wagered = rounds.reduce((sum,r)=>sum+Number(r.bet_amount||0),0);
    const returned = rounds.reduce((sum,r)=>sum+Number(r.payout||0),0);
    const net = returned - wagered;
    shell(`
      <div class="page">
        <h3>Profit And Loss</h3>
        <div class="card profit-summary">
          <small>Total Bet</small><strong>${money(wagered)}</strong>
          <small>Total Payout</small><strong>${money(returned)}</strong>
          <small>Net ${net >= 0 ? 'Profit' : 'Loss'}</small><strong class="${net >= 0 ? 'gold' : 'loss'}">${net >= 0 ? '+' : ''}${money(net)}</strong>
        </div>
        <div class="card">
          ${rounds.map(r=>'<div class="history-row"><span>'+esc(r.game_id)+'<small>Bet '+Number(r.bet_amount||0)+' · '+Number(r.multiplier||0)+'x</small></span><b>'+money(r.payout||0)+'</b></div>').join('') || 'এখনো কোনো গেম রেকর্ড নেই'}
        </div>
        <button class="secondary" onclick="page('member')">Member Center</button>
      </div>
    `);
  } catch(e) { toast(e.message); }
}

function shell(content) {
  $('#app').innerHTML = `
    <div class="shell">
      <header class="top">
        <div class="brand">TK777<small>PLAY • ENJOY</small></div>
        <div class="top-actions">
          ${me ? '<div class="balance-chip"><span id="topBalanceValue">'+money(me.balance)+'</span><button class="balance-refresh" type="button" onclick="refreshBalance(this)" aria-label="Refresh balance">↻</button></div>' : ''}
          ${me ? '<span class="top-vip-badge" id="topVipBadge" hidden>VIP LEVEL —</span><button class="top-profile-button" aria-label="Choose profile picture" onclick="toggleAvatarPicker()">'+avatarImage(selectedAvatar(),'top-profile-avatar').replace('<img ','<img id="topProfileAvatar" ')+'</button>' : '<button onclick="showAuth()">Login</button>'}
        </div>
        ${me ? '<div class="avatar-picker" id="avatarPicker" hidden><b>Choose Profile</b><div class="avatar-choices">'+TK777_AVATARS.map((_,i)=>'<button class="avatar-choice '+(i===selectedAvatar()?'selected':'')+'" onclick="chooseAvatar('+i+')">'+avatarImage(i,'')+'</button>').join('')+'</div></div>' : ''}
      </header>

      ${content}

      <nav class="bottom">
        <button onclick="home()"><b>⌂</b>Home</button>
        <button onclick="page('promotion')"><b>🎁</b>Promotion</button>
        <button onclick="page('invite')"><b>♧</b>Invite</button>
        <button onclick="page('reward')"><b>★</b>Reward</button>
        <button onclick="page('member')"><b>♙</b>Member</button>
      </nav>
      ${!isPlayingGame ? `<button class="telegram-support-float" type="button" onclick="openTelegramSupport()" aria-label="Telegram Support">${supportSettings.telegram_image_url ? `<img src="${esc(supportSettings.telegram_image_url)}" alt="Support">` : '<span>➤</span>'}</button>` : ''}
    </div>`;
}

function openTelegramSupport() {
  const username = String(supportSettings.telegram_username || '').trim().replace(/^@/,'').replace(/[^A-Za-z0-9_]/g,'');
  if (!username) return toast('Telegram Support এখনো সেট করা হয়নি');
  window.open('https://t.me/' + username,'_blank','noopener');
}

function toast(t) {
  let e = document.createElement('div');
  e.className = 'toast';
  e.textContent = t;
  $('#app').prepend(e);
  setTimeout(() => e.remove(), 3000);
}

async function init() {
  // Load independent API resources together instead of waiting for each one in sequence.
  const [meData, categoriesData, gamesData, homeBannerData, promotionBannerData, supportData, slotDisplayData] = await Promise.all([
    token ? api('/me').catch(() => null) : Promise.resolve(null),
    api('/categories').catch(() => null),
    api('/games').catch(() => null),
    api('/home-banners').catch(() => null),
    api('/promotion-banners').catch(() => null),
    api('/support-settings').catch(() => null),
    api('/slot-display-images').catch(() => null)
  ]);

  if (token) {
    if (meData?.user) me = meData.user;
    else {
      token = '';
      localStorage.removeItem('tk777_token');
    }
  }

  categories = categoriesData?.categories || [];
  games = gamesData?.games || [];
  homeBanners = homeBannerData?.banners || [];
  promotionBanners = promotionBannerData?.banners || [];

  if (supportData) supportSettings = supportData;
  demoPaymentImages = supportSettings.demo_payment_images || {bkash:'',nagad:'',rocket:''};
  withdrawButtonImages = supportSettings.withdraw_button_images || {bkash:'',nagad:'',rocket:''};
  demoMethodNumbers = supportSettings.demo_numbers || demoMethodNumbers;
  withdrawDemoIds = supportSettings.withdraw_demo_ids || withdrawDemoIds;
  depositContent = supportSettings.deposit_content || DEFAULT_DEPOSIT_CONTENT;
  withdrawContent = supportSettings.withdraw_content || DEFAULT_WITHDRAW_CONTENT;

  slotDisplayImages = {...(slotDisplayData?.images || {})};
  // Use the original PG Soft title logos unless the admin has supplied a custom URL.
  const originalPgLogos = {
    'slot-display-fortune-rabbit': 'https://res.cloudinary.com/dqwcjnzgz/image/upload/f_auto/spacecas/games/pg-soft/fortune-rabbit-logo.png',
    'slot-display-fortune-ox': 'https://res.cloudinary.com/dqwcjnzgz/image/upload/f_auto/spacecas/games/pg-soft/fortune-ox-logo.png',
    'slot-display-treasures-of-aztec': 'https://res.cloudinary.com/dqwcjnzgz/image/upload/f_auto/spacecas/games/pg-soft/treasures-of-aztec-logo.png'
  };
  const previousPgArtwork = {
    'slot-display-fortune-rabbit': 'https://apostas.gazetaesportiva.com/static/wp/imagem-destaque-fortune-rabbit-2.webp',
    'slot-display-fortune-ox': 'https://es-mx.fortune-ox.online/image/fortune-ox-logo-poster.webp',
    'slot-display-treasures-of-aztec': 'https://www.casinoplus.com.ph/cp-games/game/pg/treasures-of-aztec/icon.png'
  };
  Object.entries(originalPgLogos).forEach(([id, url]) => {
    if (!slotDisplayImages[id] || slotDisplayImages[id] === previousPgArtwork[id]) slotDisplayImages[id] = url;
  });
  slotDisplayHidden = Array.isArray(slotDisplayData?.hiddenIds) ? slotDisplayData.hiddenIds : [];
  const slotNameOverrides = slotDisplayData?.nameOverrides || {};
  displaySlotGames.forEach(g => { if (typeof slotNameOverrides[g.id] === 'string' && slotNameOverrides[g.id].trim()) g.name = slotNameOverrides[g.id].trim(); });

  home();
}


function renderHomeBanners() {
  if (!homeBanners.length) return '<div class="hero"><div class="hero-copy"><span class="hero-tag">WELCOME TO</span><h2>TK777</h2><p>PLAY • EXPLORE • ENJOY</p><small>Free-play arcade experience</small></div><div class="hero-mark">777</div></div>';
  return '<div class="home-banner-wrap"><div class="home-banner-track" id="homeBannerTrack">' + homeBanners.map((url,i) => '<div class="home-banner-slide"><img src="' + esc(url) + '" alt="TK777 Banner ' + (i+1) + '"></div>').join('') + '</div>' + (homeBanners.length > 1 ? '<div class="home-banner-dots">' + homeBanners.map((_,i) => '<button class="' + (i===0?'active':'') + '" onclick="goHomeBanner(' + i + ')" aria-label="Banner ' + (i+1) + '"></button>').join('') + '</div>' : '') + '</div>';
}
function setupHomeBanners() {
  const track = document.getElementById('homeBannerTrack');
  if (!track || homeBanners.length < 2) return;
  let index = 0;
  const dots = document.querySelectorAll('.home-banner-dots button');
  window.goHomeBanner = function(n) {
    index = (n + homeBanners.length) % homeBanners.length;
    track.scrollTo({left:track.clientWidth * index,behavior:'smooth'});
    dots.forEach((d,i) => d.classList.toggle('active',i===index));
  };
  let sx = 0;
  track.addEventListener('touchstart',e => {sx=e.touches[0].clientX;},{passive:true});
  track.addEventListener('touchend',e => {const dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>35)window.goHomeBanner(index+(dx<0?1:-1));},{passive:true});
  homeBannerTimer = setInterval(() => window.goHomeBanner(index+1),5000);
}

/* HOME */

function openHomeDeposit() {
  const app = document.getElementById('app');
  if (!app || window.tk777DepositLoading) return;
  window.tk777DepositLoading = true;
  const overlay = document.createElement('div');
  overlay.id = 'homeDepositLoading';
  overlay.innerHTML = '<div style="display:flex;flex-direction:column;align-items:center;gap:12px"><div style="width:34px;height:34px;border:4px solid rgba(255,255,255,.25);border-top-color:#f5c542;border-radius:50%;animation:tk777DepositSpin .7s linear infinite"></div><strong>লোড হচ্ছে...</strong></div>';
  overlay.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(5,8,18,.82);display:flex;align-items:center;justify-content:center;color:#fff;font-size:16px;backdrop-filter:blur(3px)';
  if (!document.getElementById('tk777DepositLoadingStyle')) {
    const style = document.createElement('style');
    style.id = 'tk777DepositLoadingStyle';
    style.textContent = '@keyframes tk777DepositSpin{to{transform:rotate(360deg)}}';
    document.head.appendChild(style);
  }
  document.body.appendChild(overlay);
  window.setTimeout(() => {
    overlay.remove();
    window.tk777DepositLoading = false;
    page('deposit');
  }, 1000);
}

function openHomeWithdraw() {
  const app = document.getElementById('app');
  if (!app || window.tk777WithdrawLoading) return;
  window.tk777WithdrawLoading = true;
  const overlay = document.createElement('div');
  overlay.id = 'homeWithdrawLoading';
  overlay.innerHTML = '<div style="display:flex;flex-direction:column;align-items:center;gap:12px"><div style="width:34px;height:34px;border:4px solid rgba(255,255,255,.25);border-top-color:#f5c542;border-radius:50%;animation:tk777DepositSpin .7s linear infinite"></div><strong>লোড হচ্ছে...</strong></div>';
  overlay.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(5,8,18,.82);display:flex;align-items:center;justify-content:center;color:#fff;font-size:16px;backdrop-filter:blur(3px)';
  if (!document.getElementById('tk777DepositLoadingStyle')) {
    const style = document.createElement('style');
    style.id = 'tk777DepositLoadingStyle';
    style.textContent = '@keyframes tk777DepositSpin{to{transform:rotate(360deg)}}';
    document.head.appendChild(style);
  }
  document.body.appendChild(overlay);
  window.setTimeout(() => {
    overlay.remove();
    window.tk777WithdrawLoading = false;
    page('withdraw');
  }, 1000);
}

function home() {
  isPlayingGame = false;
  stopCrashMonitor();
  if (homeBannerTimer) clearInterval(homeBannerTimer);
  homeBannerTimer = null;

  shell(`
    ${renderHomeBanners()}

    <div class="home-money-actions"><button onclick="openHomeDeposit()">＋ Deposit</button><button onclick="openHomeWithdraw()">↗ Withdraw</button></div>
    <div class="quick">
      <button onclick="page('member')"><b>◉</b><span>Balance</span></button>
      <button onclick="page('history')"><b>▤</b><span>History</span></button>
      <button onclick="page('promotion')"><b>🎁</b><span>Rewards</span></button>
      <button onclick="page('member')"><b>♙</b><span>Account</span></button>
    </div>

    <div class="section">
      <div class="section-head">
        <span>GAME CATEGORIES</span>
        <small>ALL CATEGORIES ›</small>
      </div>
      <div class="cats">
        ${categories.map((c,i) => `
          <button class="cat" onclick="filterGames('${esc(c.id)}')">
            ${c.image_url
              ? `<img src="${esc(c.image_url)}" alt="" onerror="this.style.display='none'">`
              : `<span>${['🔥','♥','🎰','♛','⚽','🏆','♠','🐟','🎟','🎯','👑','🎁'][i%12]}</span>`}
            <b>${esc(c.name)}</b>
          </button>
        `).join('')}
      </div>
    </div>

    <div class="section">
      <div class="section-head">
        <span>🔥 HOT GAMES</span>
        <small>${games.filter(g => !isLiveGame(g)).length + displaySlotGames.length} GAMES</small>
      </div>
      <div class="games">${homeGamesWithSlots().map(g => g.id.startsWith('slot-display-') ? displaySlotCard(g) : gameCard(g)).join('')}</div>
    </div>

    <div class="section">
      <div class="notice">
        ভাগ্য পরীক্ষা করতে পছন্দের গেম বেছে নিন। TK777-এ উপভোগ করুন আকর্ষণীয় গেমিং অভিজ্ঞতা
      </div>
    </div>
  `);
  setupHomeBanners();
}

function favoriteIds() {
  try {
    return JSON.parse(localStorage.getItem('tk777_favorites') || '[]');
  } catch {
    return [];
  }
}

function toggleFavorite(id, el) {
  let ids = favoriteIds();
  ids = ids.includes(id) ? ids.filter(x => x !== id) : [...ids,id];
  localStorage.setItem('tk777_favorites',JSON.stringify(ids));
  if (el) el.textContent = ids.includes(id) ? '♥' : '♡';
}

const TK777_GAME_COVER_ART = {
  aviator: 'https://d204vpor8h38p3.cloudfront.net/Game_Image/287x200/Online-Casino-Instant-Game-CRAZY-Aviator.webp?v=1795234292',
  superace: 'https://slotcatalog.com/userfiles/image/games/Jili-Games/24610/Super-Ace-hot_cold.webp'
};
function gameCard(g) {
  const type = String(g.game_type || '').toLowerCase();
  const name = String(g.name || '').toLowerCase();
  const id = String(g.id || '').toLowerCase();
  const liveArt = {
    'european-roulette': ['🎡', 'EUROPEAN ROULETTE', 'live-roulette'],
    'baccarat': ['🃏', 'BACCARAT', 'live-cards'],
    'live-roulette': ['🎯', 'LIVE ROULETTE', 'live-roulette'],
    'live-blackjack': ['♠️', 'LIVE BLACKJACK', 'live-cards'],
    'live-baccarat': ['♦️', 'LIVE BACCARAT', 'live-cards'],
    'evo-crazy-time': ['🎡', 'CRAZY TIME', 'live-show'],
    'evo-funky-time': ['🪩', 'FUNKY TIME', 'live-show'],
    'evo-disco-balls': ['🪩', 'DISCO BALLS', 'live-show'],
    'evo-mega-ball': ['🔮', 'MEGA BALL', 'live-show'],
    'evo-dream-catcher': ['🌙', 'DREAM CATCHER', 'live-show'],
    'evo-lightning-roulette': ['⚡', 'LIGHTNING ROULETTE', 'live-show'],
    'evo-monopoly-live': ['🏙️', 'MONOPOLY LIVE', 'live-show'],
    'evo-deal-or-no-deal': ['💼', 'DEAL OR NO DEAL', 'live-show'],
    'evo-crazy-coin-flip': ['🪙', 'CRAZY COIN FLIP', 'live-show'],
    'evo-xxx-lightning': ['⚡', 'XXXTREME LIGHTNING', 'live-show']
  };
  const live = liveArt[id] || (type === 'evolution-demo' ? ['🎲', name.toUpperCase(), 'live-show'] : type === 'live' && /roulette/.test(name)
    ? ['🎡', name.toUpperCase(), 'live-roulette']
    : type === 'live' && /blackjack/.test(name)
      ? ['♠️', name.toUpperCase(), 'live-cards']
      : type === 'live' && /baccarat/.test(name)
        ? ['🃏', name.toUpperCase(), 'live-cards'] : null);
  const officialCover = /aviator/.test(name) || type === 'aviator'
    ? TK777_GAME_COVER_ART.aviator
    : /super\s*ace/.test(name) || type === 'superace'
      ? TK777_GAME_COVER_ART.superace
      : '';
  const liveCoverArt = {
    'evo-crazy-time': 'https://games.evolution.com/wp-content/uploads/2023/03/crazy-time-logo.svg',
    'evo-funky-time': 'https://games.evolution.com/wp-content/uploads/2023/05/funky_time_logo_eng_2023_01.svg',
    'evo-disco-balls': 'https://games.evolution.com/wp-content/uploads/2026/07/disco_balls_ui_logo_eng_2026_05.svg',
    'evo-mega-ball': 'https://games.evolution.com/wp-content/uploads/2023/03/mega-ball-logo.svg',
    'evo-dream-catcher': 'https://games.evolution.com/wp-content/uploads/2023/03/dream-catcher-logo.svg',
    'evo-lightning-roulette': 'https://games.evolution.com/wp-content/uploads/2023/03/lightning-roulette-logo.svg',
    'evo-monopoly-live': 'https://games.evolution.com/wp-content/uploads/2023/03/monopoly-live-game-logo.png',
    'evo-deal-or-no-deal': 'https://games.evolution.com/wp-content/uploads/2023/03/deal-or-no-deal-logo.svg',
    'evo-crazy-coin-flip': 'https://games.evolution.com/wp-content/uploads/2023/05/crazy-coin-flip-logo-s-1.png',
    'evo-xxx-lightning': 'https://games.evolution.com/wp-content/uploads/2023/03/xxxtreme-lightning-roulette-logo.svg'
  };
  const cover = g.image_url || officialCover || liveCoverArt[id] || '';
  const placeholder = live
    ? `<div class="placeholder live-game-cover ${live[2]}"><span>${live[0]}</span><small>${esc(live[1])}</small></div>`
    : `<div class="placeholder">${type === 'aviator' ? '✈️' : type === 'superace' ? '🂡' : '🎮'}</div>`;
  return `
    <button class="game" onclick="openGame('${esc(g.id)}')">
      <span class="favorite-toggle"
        onclick="event.stopPropagation();toggleFavorite('${esc(g.id)}',this)">
        ${favoriteIds().includes(g.id) ? '♥' : '♡'}
      </span>
      ${cover
        ? `<img ${live ? 'class="live-game-logo"' : ''} src="${esc(cover)}" data-fallback="${esc(liveCoverArt[id] || '')}" alt="${esc(g.name)}" loading="lazy" onerror="if(this.dataset.fallback && this.src!==this.dataset.fallback){this.src=this.dataset.fallback}else{this.style.display='none'}">`
        : placeholder}
      <strong>${esc(g.name)}</strong>
      <small>${live ? 'LIVE CASINO' : type === 'aviator' ? 'CRASH GAME' : type === 'superace' ? 'CARD GAME' : 'ARCADE GAME'}</small>
    </button>`;
}

// Display-only Slot cards; no game files or play links yet.
const displaySlotGames = [
  {id:'slot-display-super-elements',name:'Super Elements',mark:'⚡',tone:'elements'},
  {id:'slot-display-azteca-legacy',name:'Azteca Legacy',mark:'☀',tone:'azteca'},
  {id:'slot-display-flyx',name:'FlyX',mark:'✈',tone:'flyx'},
  {id:'slot-display-magic-ace',name:'Magic Ace',mark:'♣',tone:'magic'},
  {id:'slot-display-circus-joker',name:'Circus Joker',mark:'🃏',tone:'circus'},
  {id:'slot-display-fortune-gems-3',name:'Fortune Gems 3',mark:'💎',tone:'fortune'},
  {id:'slot-display-super-ace-ii',name:'Super Ace II',mark:'♛',tone:'ace2'},
  {id:'slot-display-boxing-king',name:'Boxing King',mark:'🥊',tone:'boxing'},
  {id:'slot-display-super-ace-deluxe',name:'Super Ace Deluxe',mark:'♛',tone:'deluxe'},
  {id:'slot-display-dragon-gems',name:'Dragon Gems',mark:'🐉',tone:'dragon'},
  {id:'slot-display-treasures-of-aztec',name:'Treasures of Aztec',mark:'☀',tone:'treasures'},
  {id:'slot-display-anubis-wrath',name:'Anubis Wrath',mark:'𓃥',tone:'anubis'},
  {id:'slot-display-golden-empire',name:'Golden Empire',mark:'👑',tone:'azteca'},
  {id:'slot-display-money-coming',name:'Money Coming',mark:'💰',tone:'fortune'},
  {id:'slot-display-fortune-gems',name:'Fortune Gems',mark:'💎',tone:'fortune'},
  {id:'slot-display-fortune-gems-2',name:'Fortune Gems 2',mark:'💎',tone:'fortune'},
  {id:'slot-display-devil-fire-2',name:'Devil Fire 2',mark:'🔥',tone:'flyx'},
  {id:'slot-display-zeus',name:'Zeus',mark:'⚡',tone:'elements'},
  {id:'slot-display-wild-ace',name:'Wild Ace',mark:'🂡',tone:'ace2'},
  {id:'slot-display-golden-bank',name:'Golden Bank',mark:'🏦',tone:'deluxe'},
  {id:'slot-display-party-night',name:'Party Night',mark:'🎉',tone:'circus'},
  {id:'slot-display-lucky-goldbricks',name:'Lucky Goldbricks',mark:'🧱',tone:'treasures'},
  {id:'slot-display-mahjong-ways',name:'Mahjong Ways',mark:'🀄',tone:'elements'},
  {id:'slot-display-mahjong-ways-2',name:'Mahjong Ways 2',mark:'🀄',tone:'elements'},
  {id:'slot-display-fortune-tiger',name:'Fortune Tiger',mark:'🐯',tone:'fortune'},
  {id:'slot-display-fortune-ox',name:'Fortune Ox',mark:'🐂',tone:'azteca'},
  {id:'slot-display-fortune-rabbit',name:'Fortune Rabbit',mark:'🐇',tone:'magic'},
  {id:'slot-display-lucky-neko',name:'Lucky Neko',mark:'🐱',tone:'fortune'},  {id:'slot-display-dragon-hatch',name:'Dragon Hatch',mark:'🐉',tone:'dragon'},  {id:'slot-display-ganesha-fortune',name:'Ganesha Fortune',mark:'🐘',tone:'treasures'},  {id:'slot-display-wild-bandito',name:'Wild Bandito',mark:'🤠',tone:'flyx'},
  {id:'slot-display-ways-of-the-qilin',name:'Ways of the Qilin',mark:'🐉',tone:'anubis'}
];

// Verified game artwork. Admin-uploaded artwork takes priority over these defaults.
const TK777_SLOT_LOGOS = {
  'slot-display-super-elements': 'https://fachaigaming.com/uploads/d5b58980-9bdc-4e61-9584-bc01d71e1ddd-22055_feature-front_en.webp',
  'slot-display-flyx': 'https://www.fluffyspins.com/images/local/misc/FlyXSlotCrashStyleCasinoGame.jpg',
  'slot-display-treasures-of-aztec': 'https://www.casinoplus.com.ph/cp-games/game/pg/treasures-of-aztec/icon.png',
  'slot-display-anubis-wrath': 'https://casinocompendium.com/wp-content/uploads/2024/05/PG-Soft-releases-Anubis-Wrath.jpg',
  'slot-display-mahjong-ways-2': 'https://www.casinomeerkat.com/_next/image?q=100&url=https%3A%2F%2Fv2-prod-supabase.casinomeerkat.com%2Fstorage%2Fv1%2Fobject%2Fpublic%2Fimages%2Fmahjong-ways-2_demo_slot.webp%3Fv%3D1750968003876&w=1920',
  'slot-display-wild-bandito': 'https://www.casinos.com/cdn-cgi/image/f%3Dwebp%2Cq%3D86%2Cg%3Dauto/https%3A/objects.kaxmedia.com/genesis/wild-bandito-slot.jpg?v=d254865b199cf6775b2b2a9f0027a69e9a3cb105',
  'slot-display-circus-joker': 'https://www.ph-golden-panda.com/casino/images/circus-joker-4096.webp',
  'slot-display-fortune-gems-3': 'https://www.jiligames.shop/Games%20_%20JILI%20Games_files/bPW0fMkqGM6aXc0p4UeegcJp6kGI1L1vvYwqe0oa.png',
  'slot-display-super-ace-ii': 'https://www.ph-royal-panda.com/casino/images/super-ace-ii.webp',
  'slot-display-boxing-king': 'https://www.jiligames.shop/Games%20_%20JILI%20Games_files/7aygh0MAxhIcoy8eEQLaiEi2YkALj8vzQL5eAVz3.png',
  'slot-display-super-ace-deluxe': 'https://www.jiligames.shop/Games%20_%20JILI%20Games_files/wyk22swsN05seukkxRdqAjzOIZCwhkvsUGFedrC6.png',
  'slot-display-golden-empire': 'https://www.jiligames.shop/Games%20_%20JILI%20Games_files/hGWLb9j2LOPPHyKFxKV2iiFb6ZUyTqvqVDkIhtPi.png',
  'slot-display-money-coming': 'https://www.newvvjl.net/casino/images/money-coming.webp',
  'slot-display-fortune-gems': 'https://www.bejilifish.net/casino/images/fortune-gems.webp',
  'slot-display-fortune-gems-2': 'https://www.jiligames.shop/Games%20_%20JILI%20Games_files/KZv0aJk9dsNFcVWIfOPPhtZ22NVxM1rhpGr1ZI9k.png',
  'slot-display-devil-fire-2': 'https://www.jiligames.shop/Games%20_%20JILI%20Games_files/j5wu4aZMm9X8b1w9sg8cDFprm9hSfcxzYV3H7LMO.png',
  'slot-display-zeus': 'https://www.jiligames.shop/Games%20_%20JILI%20Games_files/MBHlzTphKgp5qXO9qwVxxsCXEghEZeJm0YySTchp.png',
  'slot-display-wild-ace': 'https://miro.medium.com/v2/resize%3Afit%3A623/1%2AtkK6fXUpd3p2lDbdnQwgXw.png',
  'slot-display-fortune-tiger': 'https://resourcesbr.sbcnoticias.com/sbcnoticiasbr/sites/3/2026/06/Onde-Jogar-O-Jogo-do-Tigrinho.jpg',
  'slot-display-fortune-ox': 'https://es-mx.fortune-ox.online/image/fortune-ox-logo-poster.webp',
  'slot-display-fortune-rabbit': 'https://apostas.gazetaesportiva.com/static/wp/imagem-destaque-fortune-rabbit-2.webp',
  'slot-display-lucky-neko': 'https://slotcatalog.com/userfiles/image/games/PG-Soft/19433/Lucky-Neko-1_sq.jpg',
  'slot-display-dragon-hatch': 'https://slotslaunch.nyc3.digitaloceanspaces.com/18193/dragon-hatch.jpg',
  'slot-display-ganesha-fortune': 'https://www.play-mx.com/casino/images/pgs-ganesha-fortune.webp',
  'slot-display-mahjong-ways': 'https://media.leovegas.com/images/games/mahjong-ways/mahjong-ways-tile-auth.jpg?tr=w-800',
  'slot-display-azteca-legacy': 'https://auth.spindex.net/storage/v1/object/public/slot-thumbnails/azteca-legacy.webp',
  'slot-display-magic-ace': 'https://assets.socino.com/game/magic-ace-66e93a311c73e24c12d4150e/magic-ace-thumb-en.webp',
  'slot-display-dragon-gems': 'https://img.rationalcdn.com/starsweb/prod/43384_0.png',
  'slot-display-golden-bank': 'https://wbgame.jlfafafa3.com/All-In-One/production/img/jiliPlusPlayer/games/CzjCNYAOnopzNiDJgdfg7I6ZqWoO2bwqxGRMV8t5.png',
  'slot-display-party-night': 'https://www.jiligames.games/wp-content/uploads/2022/07/Party-Night.png',
  'slot-display-lucky-goldbricks': 'https://wbgame.jlfafafa3.com/All-In-One/production/img/jiliPlusPlayer/games/wb6WqSCuNMSdhjDBksI5jFNlUPDuJiOsT5nO0UCB.png',
  'slot-display-ways-of-the-qilin': 'https://surebet247.com/static/img/icons/PG%20Soft/ways-of-the-qilin.png'
};

function displaySlotCard(g) {
  const image = slotDisplayImages[g.id] || TK777_SLOT_LOGOS[g.id] || '';
  const art = image
    ? '<img class="slot-admin-image" src="' + esc(image) + '" alt="' + esc(g.name) + '" loading="lazy" onerror="this.style.display=\'none\'">'
    : '<div class="slot-poster slot-' + esc(g.tone) + '"><span class="slot-poster-mark">' + g.mark + '</span></div>';
  return '<div class="game display-slot-game" aria-label="' + esc(g.name) + '"><div class="slot-art">' + art + '</div><strong>' + esc(g.name) + '</strong><small>SLOT GAME</small></div>';
}

function isLiveGame(g) {
  const type = String(g?.game_type || '').toLowerCase();
  const id = String(g?.id || '').toLowerCase();
  return type === 'live' || type === 'evolution-demo' || id.startsWith('evo-') || id.startsWith('live-');
}

function homeGamesWithSlots() {
  const list = games.filter(g => !isLiveGame(g));
  const at = list.findIndex(g => /super\s*ace/i.test(String(g.name || '')));
  list.splice(at < 0 ? list.length : at + 1, 0, ...displaySlotGames.filter(g => !slotDisplayHidden.includes(g.id)));
  return list;
}
function filterGames(id) {
  isPlayingGame = false;
  const c = categories.find(x => x.id === id);
  const categoryName = String(c?.name || '');
  const isSlotsCategory = /slot/i.test(categoryName);
  const isLiveCategory = /live/i.test(categoryName);
  const categoryGames = games.filter(g => g.category_id === id);
  const list = id === 'favorites'
    ? games.filter(g => favoriteIds().includes(g.id) && !isLiveGame(g))
    : [...categoryGames.filter(g => isLiveCategory ? isLiveGame(g) : !isLiveGame(g)), ...(isSlotsCategory ? displaySlotGames.filter(g => !slotDisplayHidden.includes(g.id)) : [])];

  stopCrashMonitor();

  shell(`
    <div class="page">
      <div class="section-head">
        <span>${esc(c?.name || 'Games')}</span>
        <small>${list.length} GAMES</small>
      </div>
      <div class="games${isLiveCategory ? " live-games-grid" : ""}">
        ${list.map(g => g.id.startsWith('slot-display-') ? displaySlotCard(g) : gameCard(g)).join('') || '<p class="muted">এই ক্যাটাগরিতে এখনো গেম যোগ করা হয়নি।</p>'}
      </div>
      <button class="secondary" onclick="home()">ফিরে যান</button>
    </div>
  `);
}

/* LOGIN AND REGISTER */

function showAuth() {
  isPlayingGame = false;
  stopCrashMonitor();
  shell(`
    <div class="page"><div class="card auth-card">
      <h2>Welcome to TK777</h2>
      <div class="tabs">
        <button id="loginTab" class="active" onclick="authMode('login')">Login</button>
        <button id="registerTab" onclick="authMode('register')">Create Account</button>
      </div>
      <style>
        .password-field{position:relative;display:flex;align-items:center}
        .password-field .field{width:100%;padding-right:48px}
        .password-toggle{position:absolute;right:8px;top:50%;transform:translateY(-50%);width:36px;height:36px;padding:0;border:0;background:transparent;color:inherit;display:grid;place-items:center;cursor:pointer}
        .password-toggle svg{width:20px;height:20px}
      </style>
      <form id="authform">
        <label>মোবাইল নম্বর</label>
        <input class="field" name="phone" type="tel" inputmode="numeric" required autocomplete="tel" placeholder="01XXXXXXXXX">
        <label>Password</label>
        <div class="password-field">
          <input class="field" name="password" type="password" minlength="6" maxlength="128" required autocomplete="current-password" placeholder="কমপক্ষে ৬ অক্ষর">
          <button class="password-toggle" type="button" data-toggle-password="password" aria-label="পাসওয়ার্ড দেখান" title="পাসওয়ার্ড দেখান"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg></button>
        </div>
        <div id="confirmPasswordWrap" class="hidden">
          <label>Confirm Password</label>
          <div class="password-field">
            <input class="field" name="confirmPassword" type="password" minlength="6" maxlength="128" autocomplete="new-password" placeholder="পাসওয়ার্ড আবার লিখুন">
            <button class="password-toggle" type="button" data-toggle-password="confirmPassword" aria-label="কনফার্ম পাসওয়ার্ড দেখান" title="পাসওয়ার্ড দেখান"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg></button>
          </div>
        </div>
        <button class="primary" id="authSubmit">Login</button>
      </form>
      <p class="muted" id="authHint">সঠিক ভাবে লগইন করুন</p>
    </div></div>`);
  authMode('login');
}
let mode = 'login';
function authMode(m) {
  mode = m;
  const currentMode = m;
  const f = $('#authform');
  if (!f) return;
  $('#confirmPasswordWrap').classList.toggle('hidden',m !== 'register');
  f.elements.confirmPassword.required = m === 'register';
  f.elements.password.autocomplete = m === 'register' ? 'new-password' : 'current-password';
  $('#loginTab').classList.toggle('active',m === 'login');
  $('#registerTab').classList.toggle('active',m === 'register');
  $('#authSubmit').textContent = m === 'register' ? 'Create Account' : 'Login';
  $('#authHint').textContent = m === 'register' ? 'সঠিক ভাবে রেজিষ্ট্রেশন করুন' : 'সঠিক ভাবে লগইন করুন';
  f.querySelectorAll('[data-toggle-password]').forEach(btn => {
    btn.onclick = () => {
      const input = f.querySelector('[name="' + btn.dataset.togglePassword + '"]');
      if (!input) return;
      const show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      btn.setAttribute('aria-label', show ? 'পাসওয়ার্ড লুকান' : 'পাসওয়ার্ড দেখান');
      btn.title = show ? 'পাসওয়ার্ড লুকান' : 'পাসওয়ার্ড দেখান';
    };
  });
  f.onsubmit = async e => {
    e.preventDefault();
    const passwordInput = f.querySelector('input[name="password"]');
    const confirmInput = f.querySelector('input[name="confirmPassword"]');
    const password = passwordInput.value;
    const confirmPassword = confirmInput.value;
    // Ignore accidental leading/trailing whitespace and equivalent Unicode forms.
    if (currentMode === 'register' && password !== confirmPassword) {
      toast('পাসওয়ার্ড ও কনফার্ম পাসওয়ার্ড মিলছে না');
      confirmInput.focus();
      return;
    }
    const data = { phone: f.querySelector('input[name="phone"]').value, password };
    if(currentMode==='register'){
      data.confirmPassword=confirmPassword;
      data.referralCode=new URLSearchParams(window.location.search).get('ref')||'';
    }
    try {
      const r = await api('/'+currentMode,data);
      token = r.token;
      localStorage.setItem('tk777_token',token);
      me = r.user;
      home();
    } catch (err) { toast(err.message); }
  };
}
/* MEMBER AND PAGES */



let selectedWithdrawMethod = '';
function setWithdrawAmount(amount){const input=document.getElementById('withdrawCoinAmount');if(input){input.value=String(amount);input.dispatchEvent(new Event('input',{bubbles:true}));}}
function selectWithdrawMethod(method){
  selectedWithdrawMethod=method;
  document.querySelectorAll('.withdraw-method').forEach(el=>{
    const on=el.dataset.method===method;
    el.classList.toggle('selected',on);
    el.setAttribute('aria-pressed',on?'true':'false');
  });
}
function showWithdrawDemoIds(kind){
 const box=document.getElementById('withdrawDemoIdList');if(!box)return;
 const ids=kind?(withdrawDemoIds[kind]||[]):[];
 box.innerHTML=ids.length?'<small>'+esc(withdrawText('demoIdsLabel'))+' </small>'+ids.map(x=>'<span class="demo-withdraw-code">'+esc(x)+'</span>').join(' '):'<small>'+esc(withdrawText('noDemoIds'))+'</small>';
}
async function withdrawPage(){
 if(!me)return showAuth();selectedWithdrawMethod='';
 shell(`<div class="page member-subpage"><div class="member-subpage-heading"><button onclick="page('member')">‹</button><h2>${esc(withdrawText('pageTitle'))}</h2></div>
 <div class="card coin-request-card"><p class="muted">${esc(withdrawText('safetyNote'))}</p><label for="withdrawWalletNumber" style="display:block;font-size:15px;font-weight:700;margin:12px 0 6px">ওয়ালেট নম্বর</label><div style="display:flex;gap:8px;align-items:center"><input id="withdrawWalletNumber" class="field" type="tel" inputmode="numeric" autocomplete="tel" maxlength="20" placeholder="ওয়ালেট নাম্বার দিন" style="flex:1;width:100%;box-sizing:border-box;min-width:0;font-size:14px;height:32px;min-height:32px;padding:4px 8px"><button id="saveWithdrawWalletBtn" type="button" class="primary" onclick="saveWithdrawWalletNumber()" style="width:auto;min-width:64px;padding:10px 14px;margin:0">সেভ</button></div><small id="withdrawWalletMsg" class="muted"></small><h3>${esc(withdrawText('methodTitle'))}</h3><div class="demo-payment-methods">
 <button type="button" class="demo-payment-method withdraw-method" data-method="Demo bKash" onclick="selectWithdrawMethod('Demo bKash');showWithdrawDemoIds('bkash')">${withdrawButtonImages.bkash ? '<img src="'+esc(withdrawButtonImages.bkash)+'" alt="bKash" style="width:100%;height:34px;object-fit:contain">' : esc(withdrawText('methodBkash'))} <small>${esc(withdrawText('demoBadge'))}</small></button>
 <button type="button" class="demo-payment-method withdraw-method" data-method="Demo Nagad" onclick="selectWithdrawMethod('Demo Nagad');showWithdrawDemoIds('nagad')">${withdrawButtonImages.nagad ? '<img src="'+esc(withdrawButtonImages.nagad)+'" alt="Nagad" style="width:100%;height:34px;object-fit:contain">' : esc(withdrawText('methodNagad'))} <small>${esc(withdrawText('demoBadge'))}</small></button>
 <button type="button" class="demo-payment-method withdraw-method" data-method="Demo Rocket" onclick="selectWithdrawMethod('Demo Rocket');showWithdrawDemoIds('rocket')">${withdrawButtonImages.rocket ? '<img src="'+esc(withdrawButtonImages.rocket)+'" alt="Rocket" style="width:100%;height:34px;object-fit:contain">' : esc(withdrawText('methodRocket'))} <small>${esc(withdrawText('demoBadge'))}</small></button></div>
 <div id="withdrawDemoIdList" class="muted">${esc(withdrawText('demoIdsHint'))}</div><label for="withdrawCoinAmount">${esc(withdrawText('amountLabel'))}</label><input id="withdrawCoinAmount" class="field" type="number" min="1" step="1" inputmode="numeric" placeholder="${esc(withdrawText('amountPlaceholder'))}"><div class="withdraw-quick-amounts" style="display:flex;flex-wrap:wrap;gap:8px;margin:8px 0 12px"><button type="button" class="secondary" onclick="setWithdrawAmount(100)" style="min-width:58px;padding:8px 12px;margin:0">100</button><button type="button" class="secondary" onclick="setWithdrawAmount(200)" style="min-width:58px;padding:8px 12px;margin:0">200</button><button type="button" class="secondary" onclick="setWithdrawAmount(300)" style="min-width:58px;padding:8px 12px;margin:0">300</button><button type="button" class="secondary" onclick="setWithdrawAmount(500)" style="min-width:58px;padding:8px 12px;margin:0">500</button><button type="button" class="secondary" onclick="setWithdrawAmount(1000)" style="min-width:58px;padding:8px 12px;margin:0">1000</button></div>
 <small class="muted">${esc(withdrawText('balanceLabel'))} <b>${Number(me.balance||0).toLocaleString('en-US')} টাকা</b></small><div id="withdrawPasswordSetup" style="margin:14px 0"><label for="withdrawPasswordSet" style="display:block;font-weight:700;margin-bottom:6px">৬ সংখ্যার উইথড্র পাসওয়ার্ড সেট করুন</label><div style="display:flex;gap:8px;align-items:center"><input id="withdrawPasswordSet" class="field" type="password" inputmode="numeric" autocomplete="new-password" maxlength="6" placeholder="৬ সংখ্যার পাসওয়ার্ড" style="flex:1;min-width:0;min-height:42px;padding:9px"><button id="saveWithdrawPasswordBtn" type="button" class="primary" onclick="saveWithdrawPassword()" style="width:auto;min-width:64px;padding:10px 14px;margin:0">সেভ</button></div><small id="withdrawPasswordMsg" class="muted"></small></div><div id="withdrawPasswordEntry" hidden><label for="withdrawPassword" style="display:block;font-weight:700;margin:10px 0 6px">উইথড্র পাসওয়ার্ড</label><input id="withdrawPassword" class="field" type="password" inputmode="numeric" autocomplete="current-password" maxlength="6" placeholder="৬ সংখ্যার পাসওয়ার্ড দিন" style="max-width:220px"></div><button class="primary" onclick="submitWithdrawRequest()">${esc(withdrawText('submitButton'))}</button><p id="withdrawRequestMsg" class="muted"></p></div>
<button class="secondary" onclick="page('member')">${esc(withdrawText('backButton'))}</button></div>`);
 loadWithdrawWalletNumber();
 loadWithdrawPassword();
}
async function loadWithdrawWalletNumber(){
 const input=document.getElementById('withdrawWalletNumber'),btn=document.getElementById('saveWithdrawWalletBtn'),msg=document.getElementById('withdrawWalletMsg');if(!input)return;
 try{const d=await api('/wallet-number');if(d.walletNumber){input.value=d.walletNumber;input.readOnly=true;input.style.background='#d00000';input.style.color='#ffeb00';input.style.fontWeight='900';input.style.textShadow='1px 1px 0 #7a0000, 2px 2px 0 rgba(120,0,0,.35)';input.style.border='1px solid #a00000';input.style.height='32px';input.style.minHeight='32px';input.style.padding='4px 8px';input.style.boxSizing='border-box';input.style.width='100%';if(btn)btn.remove();if(msg)msg.textContent='নম্বর সেভ করা আছে।';}}
 catch(e){if(msg)msg.textContent=e.message;}
}
async function saveWithdrawWalletNumber(){
 const input=document.getElementById('withdrawWalletNumber'),msg=document.getElementById('withdrawWalletMsg'),btn=document.getElementById('saveWithdrawWalletBtn'),walletNumber=String(input?.value||'').trim();
 if(!/^[0-9+ -]{8,20}$/.test(walletNumber)){if(msg)msg.textContent='সঠিক ওয়ালেট নম্বর লিখুন।';return;}
 if(!confirm('এই নম্বরটি একবার সেভ করবেন? পরে নিজে পরিবর্তন করতে পারবেন না।'))return;
 try{const d=await api('/wallet-number',{walletNumber});input.value=d.walletNumber;input.readOnly=true;input.style.background='#d00000';input.style.color='#ffeb00';input.style.fontWeight='900';input.style.textShadow='1px 1px 0 #7a0000, 2px 2px 0 rgba(120,0,0,.35)';input.style.border='1px solid #a00000';input.style.height='32px';input.style.minHeight='32px';input.style.padding='4px 8px';input.style.boxSizing='border-box';input.style.width='100%';if(btn)btn.remove();if(msg)msg.textContent='নম্বর সেভ হয়েছে।';}catch(e){if(msg)msg.textContent=e.message;}
}
async function loadWithdrawPassword(){
 const setup=document.getElementById('withdrawPasswordSetup'),entry=document.getElementById('withdrawPasswordEntry');if(!setup||!entry)return;
 try{const d=await api('/withdraw-password/status');if(d.passwordSet){setup.remove();entry.hidden=false;}else{setup.hidden=false;entry.hidden=true;}}
 catch(e){const msg=document.getElementById('withdrawPasswordMsg');if(msg)msg.textContent=e.message;}
}
async function saveWithdrawPassword(){
 const input=document.getElementById('withdrawPasswordSet'),msg=document.getElementById('withdrawPasswordMsg'),btn=document.getElementById('saveWithdrawPasswordBtn'),password=String(input?.value||'');
 if(!/^\d{6}$/.test(password)){if(msg)msg.textContent='ঠিক ৬ সংখ্যার পাসওয়ার্ড দিন।';return;}
 if(!confirm('এই উইথড্র পাসওয়ার্ডটি একবার সেট করবেন? পরে নিজে পরিবর্তন করতে পারবেন না।'))return;
 try{await api('/withdraw-password/set',{password});const setup=document.getElementById('withdrawPasswordSetup'),entry=document.getElementById('withdrawPasswordEntry');if(setup)setup.remove();if(entry)entry.hidden=false;const pass=document.getElementById('withdrawPassword');if(pass)pass.focus();if(msg)msg.textContent='উইথড্র পাসওয়ার্ড সেভ হয়েছে।';}catch(e){if(msg)msg.textContent=e.message;}
}
async function loadWithdrawRequests(){
 const box=document.getElementById('withdrawRequestHistory');if(!box)return;
 try{const d=await api('/withdraw-requests');box.innerHTML=(d.requests||[]).map(x=>'<div class="history-row"><span>'+esc(x.method)+' · '+Number(x.amount)+' '+esc(withdrawText('historyCoinSuffix'))+'<small>'+esc(x.created_at)+'</small></span><b>'+esc(x.status==='approved'?withdrawText('statusApproved'):x.status==='rejected'?withdrawText('statusRejected'):withdrawText('statusPending'))+'</b></div>').join('')||esc(withdrawText('emptyHistory'));}catch(e){box.textContent=e.message;}
}
async function withdrawRecordPage(){
 if(!me)return showAuth();
 shell('<div class="page member-subpage"><div class="member-subpage-heading"><button onclick="page(\'member\')">‹</button><h2>'+esc(withdrawText('recordTitle'))+'</h2></div><div id="withdrawRecordList" class="card">'+esc(withdrawText('loadingText'))+'</div><button class="secondary" onclick="page(\'member\')">'+esc(withdrawText('backButton'))+'</button></div>');
 const box=document.getElementById('withdrawRecordList');
 try{const d=await api('/withdraw-requests');box.innerHTML=(d.requests||[]).map(x=>'<div class="history-row"><span>'+esc(x.method)+' · '+Number(x.amount)+' '+esc(withdrawText('historyCoinSuffix'))+'<small>'+esc(x.created_at)+'</small></span><b>'+esc(x.status==='approved'?withdrawText('statusApproved'):x.status==='rejected'?withdrawText('statusRejected'):withdrawText('statusPending'))+'</b></div>').join('')||esc(withdrawText('emptyRecord'));}catch(e){box.textContent=e.message;}
}
async function submitWithdrawRequest(){
 const msg=document.getElementById('withdrawRequestMsg');if(!msg)return;
 const amount=Number(document.getElementById('withdrawCoinAmount')?.value);
 const walletInput=document.getElementById('withdrawWalletNumber');
 const password=String(document.getElementById('withdrawPassword')?.value||'');
 if(!selectedWithdrawMethod){msg.textContent=withdrawText('chooseMethodError');return;}
 if(!walletInput?.readOnly||!walletInput.value.trim()){msg.textContent='আগে ওয়ালেট নম্বর সেভ করুন।';return;}
 if(!/^\d{6}$/.test(password)){msg.textContent='৬ সংখ্যার উইথড্র পাসওয়ার্ড দিন।';return;}
 if(!Number.isSafeInteger(amount)||amount<1){msg.textContent=withdrawText('amountError');return;}
 if(amount>Number(me.balance||0)){msg.textContent=withdrawText('balanceError');return;}
 try{await api('/withdraw-requests',{method:selectedWithdrawMethod,amount,withdrawPassword:password});msg.textContent=withdrawText('successMessage');const pass=document.getElementById('withdrawPassword');if(pass)pass.value='';await loadWithdrawRequests();await refreshBalance();}
 catch(e){msg.textContent=e.message;}
}



async function inviteFriendsPage() {
  if(!me)return showAuth();
  shell('<div class="page invite-page"><div class="member-subpage-heading"><button onclick="page(\'member\')" aria-label="Back">‹</button><h2>Invite Friends</h2></div><div class="card"><h3>আপনার Referral Link</h3><p id="refRuleText">রেফার করুন এবং ১০৮ টাকা বোনাস পান</p><input class="field" id="referralLink" readonly value="লোড হচ্ছে..."><button class="primary" id="copyReferralLink" type="button">Copy Invite Link</button><div id="referralMsg" class="muted"></div></div><div class="card"><h3>Referral Summary</h3><p>মোট Invite: <b id="refTotal">—</b></p><p>সফল রেফার: <b id="refQualified">—</b></p><p>মোট Referral Bonus: <b id="refEarned">—</b> টাকা</p><small class="muted">প্রতি সফল রেফারে ২,০০০ টাকা গেম টার্নওভার পূরণ হলে ১০৮ টাকা স্বয়ংক্রিয়ভাবে পাবেন। নিচের অতিরিক্ত বোনাসগুলো আলাদাভাবে ক্লেইম করতে পারবেন।</small></div><div class="card referral-milestones"><h3>অতিরিক্ত Referral Bonus</h3><p class="muted">প্রতিটি ধাপের বোনাস একবার করে ক্লেইম করা যাবে।</p><div id="referralMilestoneList" class="milestone-list">লোড হচ্ছে...</div></div></div>');
  try{
    const d=await api('/referral'),link=window.location.origin+'/?ref='+encodeURIComponent(d.code),input=document.getElementById('referralLink');
    if(input)input.value=link;
    const rule=document.getElementById('refRuleText');if(rule)rule.textContent='রেফার করুন এবং ১০৮ টাকা বোনাস পান';
    document.getElementById('refTotal').textContent=d.total;
    document.getElementById('refQualified').textContent=d.qualified;
    document.getElementById('refEarned').textContent=d.earned;
    const list=document.getElementById('referralMilestoneList');
    if(list)list.innerHTML=(d.milestones||[]).map(x=>'<div class="milestone-row"><div class="milestone-count"><b>'+x.milestone+' জন রেফার</b><small>'+x.amount+' টাকা বোনাস</small></div>'+(x.claimed?'<span class="milestone-done">ক্লেইম হয়েছে ✓</span>':x.available?'<button class="milestone-claim" type="button" onclick="claimReferralMilestone('+x.milestone+')">ক্লেইম নিন</button>':'<span class="milestone-locked">'+x.milestone+' জন পূর্ণ করুন</span>')+'</div>').join('');
    document.getElementById('copyReferralLink').onclick=async()=>{
      try{await navigator.clipboard.writeText(link);document.getElementById('referralMsg').textContent='Referral Link কপি হয়েছে।';}
      catch{input.select();document.execCommand('copy');document.getElementById('referralMsg').textContent='Referral Link কপি হয়েছে।';}
    };
  }catch(e){const m=document.getElementById('referralMsg');if(m)m.textContent=e.message;}
}

async function claimReferralMilestone(milestone){
  try{
    const result=await api('/referral/claim',{milestone});
    toast(result.message+' ('+result.amount+' টাকা)');
    await refreshBalance();
    await inviteFriendsPage();
  }catch(e){toast(e.message);}
}

async function myAccountPage(){
  shell('<div class="page member-subpage my-account-page"><div class="member-subpage-heading"><button onclick="page(\'member\')">‹</button><h2>My Account</h2></div><div class="account-profile-card"><span class="account-vip-badge" id="accountVipBadge">VIP LEVEL —</span><button class="account-avatar-button" onclick="toggleAvatarPicker()" aria-label="প্রোফাইল ছবি পরিবর্তন">'+avatarImage(selectedAvatar(),'account-large-avatar').replace('<img ','<img id="accountProfileAvatar" ')+'</button><h2 id="accountDisplayName">লোড হচ্ছে...</h2><p class="account-user-phone" id="accountPhone">ইউজার নাম: —</p><p id="accountGmail">Gmail: ***</p><div class="account-turnover"><span>মোট গেম খেলেছেন</span><b id="accountTurnover">—</b></div><div class="account-vip-progress"><div><span id="accountNextLevel">পরবর্তী VIP Level</span><b id="accountProgressText">—</b></div><div class="account-progress-track"><i id="accountProgressBar"></i></div></div></div><button class="secondary" onclick="page(\'member\')">Member Center</button></div>');
  const profile=await loadAccountProfile();
  if(!profile){const n=document.getElementById('accountDisplayName');if(n)n.textContent='প্রোফাইল লোড করা যায়নি';return;}
  const set=(id,value)=>{const el=document.getElementById(id);if(el)el.textContent=value;};
  set('accountDisplayName',profile.display_name||'নাম সেট করা হয়নি');
  set('accountPhone','ইউজার নাম: '+(profile.phone||''));
  set('accountGmail','Gmail: '+(profile.gmail_masked||'***'));
  set('accountTurnover',Number(profile.turnover||0).toLocaleString('en-US')+' টাকা');
  set('accountVipBadge','VIP LEVEL '+Number(profile.vip_level||0));
  const level=Number(profile.vip_level||0),turnover=Number(profile.turnover||0);
  set('accountNextLevel','পরবর্তী VIP Level '+(level+1));
  set('accountProgressText',Math.floor(turnover%2000).toLocaleString('en-US')+' / 2,000');
  const bar=document.getElementById('accountProgressBar');if(bar)bar.style.width=Math.min(100,(turnover%2000)/20)+'%';
}

async function securityCenterPage(){if(!me)return showAuth();shell('<div class="page member-subpage"><div class="member-subpage-heading"><button onclick="page(\'member\')">‹</button><h2>Security Center</h2></div><div class="card"><h3>নিজের নাম সেট করুন</h3><p class="muted">নাম একবার সেভ করলে নিজে আর পরিবর্তন করতে পারবেন না।</p><input id="securityDisplayName" class="field" maxlength="60" placeholder="আপনার নাম"><button id="saveSecurityName" class="primary" onclick="saveSecurityProfile(\'name\')">নাম সেভ করুন</button><small id="securityNameMsg" class="muted"></small></div><div class="card"><h3>লগইন পাসওয়ার্ড পরিবর্তন</h3><input id="securityOldPassword" class="field" type="password" placeholder="পুরোনো পাসওয়ার্ড"><input id="securityNewPassword" class="field" type="password" minlength="6" maxlength="128" placeholder="নতুন পাসওয়ার্ড (কমপক্ষে ৬ অক্ষর)"><input id="securityConfirmPassword" class="field" type="password" minlength="6" maxlength="128" placeholder="নতুন পাসওয়ার্ড আবার লিখুন"><button class="primary" onclick="changeLoginPassword()">পাসওয়ার্ড পরিবর্তন</button><small id="securityPasswordMsg" class="muted"></small></div><div class="card"><h3>উইথড্র পাসওয়ার্ড পরিবর্তন</h3><p class="muted">বর্তমান ৬ সংখ্যার পাসওয়ার্ড দিয়ে যাচাই করতে হবে।</p><input id="securityOldWithdrawPassword" class="field" type="password" inputmode="numeric" maxlength="6" placeholder="বর্তমান উইথড্র পাসওয়ার্ড"><input id="securityNewWithdrawPassword" class="field" type="password" inputmode="numeric" maxlength="6" placeholder="নতুন ৬ সংখ্যার পাসওয়ার্ড"><input id="securityConfirmWithdrawPassword" class="field" type="password" inputmode="numeric" maxlength="6" placeholder="নতুন পাসওয়ার্ড আবার লিখুন"><button class="primary" onclick="changeWithdrawPassword()">উইথড্র পাসওয়ার্ড পরিবর্তন</button><small id="securityWithdrawMsg" class="muted"></small></div><div class="card"><h3>যোগাযোগের তথ্য</h3><p class="muted">তিনটি তথ্য একবার সেভ করলে আর পরিবর্তন করা যাবে না।</p><label>WhatsApp নম্বর</label><input id="securityWhatsapp" class="field" type="tel" maxlength="20" placeholder="WhatsApp নম্বর"><label>Facebook লিংক</label><input id="securityFacebook" class="field" type="url" maxlength="250" placeholder="https://facebook.com/..."><label>Gmail</label><input id="securityGmail" class="field" type="email" maxlength="254" placeholder="আপনার Gmail"><button id="saveSecurityContacts" class="primary" onclick="saveSecurityProfile(\'contacts\')">তথ্য সেভ করুন</button><small id="securityContactMsg" class="muted"></small></div><button class="secondary" onclick="page(\'member\')">Member Center</button></div>');try{const d=await api('/security/profile'),f=d.profile||{},n=document.getElementById('securityDisplayName');if(f.display_name){n.value=f.display_name;n.readOnly=true;document.getElementById('saveSecurityName').remove();document.getElementById('securityNameMsg').textContent='নাম সেভ হয়েছে।';}if(d.contactsSaved){document.getElementById('securityWhatsapp').value=f.whatsapp_number||'';document.getElementById('securityFacebook').value=f.facebook_url||'';document.getElementById('securityGmail').value=f.gmail_masked||'';for(const id of ['securityWhatsapp','securityFacebook','securityGmail'])document.getElementById(id).readOnly=true;document.getElementById('saveSecurityContacts').remove();document.getElementById('securityContactMsg').textContent='তথ্য সেভ হয়েছে। আর পরিবর্তন করা যাবে না।';}}catch(e){document.getElementById('securityContactMsg').textContent=e.message;}}
async function saveSecurityProfile(kind){const n=document.getElementById('securityDisplayName'),nm=document.getElementById('securityNameMsg'),cm=document.getElementById('securityContactMsg');let body={};if(kind==='name'){body.displayName=String(n.value||'').trim();if(body.displayName.length<2){nm.textContent='কমপক্ষে ২ অক্ষরের নাম লিখুন।';return;}}else{body.whatsapp=document.getElementById('securityWhatsapp').value.trim();body.facebook=document.getElementById('securityFacebook').value.trim();body.gmail=document.getElementById('securityGmail').value.trim();if(!body.whatsapp||!body.facebook||!body.gmail){cm.textContent='WhatsApp, Facebook লিংক ও Gmail—তিনটিই পূরণ করুন।';return;}}try{const d=await api('/security/profile',body);if(kind==='name'){n.value=d.profile.display_name;n.readOnly=true;document.getElementById('saveSecurityName').remove();nm.textContent='নাম সেভ হয়েছে।';}else{document.getElementById('securityWhatsapp').readOnly=true;document.getElementById('securityFacebook').readOnly=true;const g=document.getElementById('securityGmail');g.value=d.profile.gmail_masked||('***'+body.gmail.slice(-3));g.readOnly=true;document.getElementById('saveSecurityContacts').remove();cm.textContent='তথ্য সেভ হয়েছে। আর পরিবর্তন করা যাবে না।';}}catch(e){(kind==='name'?nm:cm).textContent=e.message;}}
async function changeLoginPassword(){const msg=document.getElementById('securityPasswordMsg'),oldPassword=document.getElementById('securityOldPassword').value,newPassword=document.getElementById('securityNewPassword').value,confirmPassword=document.getElementById('securityConfirmPassword').value;if(!oldPassword||newPassword.length<6||newPassword.length>128){msg.textContent='পুরোনো পাসওয়ার্ড দিন এবং নতুন পাসওয়ার্ড ৬–১২৮ অক্ষরের করুন।';return;}if(newPassword!==confirmPassword){msg.textContent='নতুন পাসওয়ার্ড দুটি মিলছে না।';return;}try{const d=await api('/security/password',{oldPassword,newPassword});msg.textContent=d.message;document.getElementById('securityOldPassword').value='';document.getElementById('securityNewPassword').value='';document.getElementById('securityConfirmPassword').value='';}catch(e){msg.textContent=e.message;}}
async function changeWithdrawPassword(){const msg=document.getElementById('securityWithdrawMsg'),oldPassword=document.getElementById('securityOldWithdrawPassword').value,newPassword=document.getElementById('securityNewWithdrawPassword').value,confirmPassword=document.getElementById('securityConfirmWithdrawPassword').value;if(!/^[0-9]{6}$/.test(oldPassword)||!/^[0-9]{6}$/.test(newPassword)){msg.textContent='বর্তমান ও নতুন—দুটিই ৬ সংখ্যার হতে হবে।';return;}if(newPassword!==confirmPassword){msg.textContent='নতুন উইথড্র পাসওয়ার্ড দুটি মিলছে না।';return;}try{const d=await api('/security/withdraw-password',{oldPassword,newPassword});msg.textContent=d.message;document.getElementById('securityOldWithdrawPassword').value='';document.getElementById('securityNewWithdrawPassword').value='';document.getElementById('securityConfirmWithdrawPassword').value='';}catch(e){msg.textContent=e.message;}}
async function rebatePage(){
 if(!me)return showAuth();
 shell('<div class="page member-subpage rebate-page"><div class="member-subpage-heading"><button onclick="page(\'member\')" aria-label="Back">‹</button><h2>Rebate</h2></div><div class="rebate-hero"><div class="rebate-hero-label">আপনার জমা রিবেট</div><div class="rebate-amount" id="rebatePending">৳0.00</div><div class="rebate-hero-note">প্রতি ১,০০০ টাকা বেটে ১০ টাকা রিবেট</div><button class="rebate-claim-btn" id="rebateClaimBtn" onclick="claimRebate()">রিবেট ক্লেইম করুন</button></div><div class="rebate-stats"><div><small>মোট রিবেট অর্জন</small><b id="rebateEarned">৳0.00</b></div><div><small>আগে ক্লেইম করেছেন</small><b id="rebateClaimed">৳0.00</b></div></div><div class="rebate-info"><b>রিবেট কীভাবে হিসাব হবে?</b><p>আপনার প্রতিটি গেমের বেটের ১% হিসেবে রিবেট হিসাব হবে—প্রতি ১,০০০ টাকায় ১০ টাকা। ১ টাকা বেট করলেও ১ পয়সা রিবেট জমা হবে। জমা রিবেট নিজেই ক্লেইম করতে পারবেন।</p></div><button class="secondary" onclick="page(\'member\')">Member Center</button></div>');
 await loadRebate();
}
async function loadRebate(){
 const pending=document.getElementById('rebatePending');if(!pending)return;
 try{const d=await api('/rebate');pending.textContent='৳'+Number(d.pending||0).toFixed(2);document.getElementById('rebateEarned').textContent='৳'+Number(d.earned||0).toFixed(2);document.getElementById('rebateClaimed').textContent='৳'+Number(d.claimed||0).toFixed(2);const b=document.getElementById('rebateClaimBtn');b.disabled=Number(d.pending||0)<=0;b.textContent=Number(d.pending||0)>0?'রিবেট ক্লেইম করুন':'রিবেট জমা হলে ক্লেইম করুন';}catch(e){pending.textContent='লোড করা যায়নি';}
}
async function claimRebate(){
 const b=document.getElementById('rebateClaimBtn');if(!b||b.disabled)return;b.disabled=true;b.textContent='ক্লেইম হচ্ছে...';
 try{const d=await api('/rebate/claim',{ });if(d.error)throw new Error(d.error);await loadRebate();if(typeof refreshBalance==='function')await refreshBalance();alert('৳'+Number(d.amount||0).toFixed(2)+' রিবেট ব্যালেন্সে যোগ হয়েছে।');}
 catch(e){alert(e.message||'রিবেট ক্লেইম করা যায়নি');await loadRebate();}
}

async function loadUnreadMessages(){const badge=document.getElementById('internalMessageBadge');if(!badge||!me)return;try{const d=await api('/messages'),n=Number(d.unread||0);badge.textContent=n>99?'99+':String(n);badge.hidden=n===0;}catch(e){}}
async function internalMessagesPage(){
 if(!me)return showAuth();
 shell('<div class="page member-subpage internal-messages-page"><div class="member-subpage-heading"><button onclick="page(\'member\')" aria-label="Back">‹</button><h2>Internal Message</h2></div><div id="internalMessageList" class="internal-message-list"><div class="card">মেসেজ লোড হচ্ছে...</div></div><button class="secondary" onclick="page(\'member\')">Member Center</button></div>');
 const box=document.getElementById('internalMessageList');
 try{const d=await api('/messages'),rows=d.messages||[];box.innerHTML=rows.map(m=>'<article class="internal-message-card '+(m.read_at?'is-read':'is-unread')+'"><div class="internal-message-heading"><b>'+esc(m.title)+'</b><small>'+esc(m.created_at||'')+'</small></div><p>'+esc(m.body)+'</p></article>').join('')||'<div class="card internal-message-empty">এখনো কোনো মেসেজ আসেনি।</div>';await api('/messages/read',{read:true});const badge=document.getElementById('internalMessageBadge');if(badge)badge.hidden=true;}
 catch(e){box.innerHTML='<div class="card">'+esc(e.message)+'</div>';}
}

async function promotionPage() {
  isPlayingGame = false;
  stopCrashMonitor();
  const banners = Array.isArray(promotionBanners) ? promotionBanners.filter(url => String(url || '').toLowerCase().startsWith('https://')) : [];
  shell(`
    <div class="page member-subpage promotion-page">
      <div class="member-subpage-heading"><button onclick="home()" aria-label="Back">‹</button><h2>Promotion</h2></div>
      ${banners.length ? '<div class="promotion-banner-list">' + banners.map((url,i) => '<div class="promotion-banner-card"><img src="'+esc(url)+'" alt="Promotion Banner '+(i+1)+'" loading="lazy" onerror="this.parentElement.hidden=true"></div>').join('') + '</div>' : '<div class="card promotion-empty">বর্তমানে কোনো নতুন প্রমোশন নেই।</div>'}
      <button class="secondary" onclick="home()">Home</button>
    </div>
  `);
}


async function bankAccountPage(){
  if(!me)return showAuth();
  shell('<div class="page member-subpage bank-account-page"><div class="member-subpage-heading"><button onclick="page(\'member\')">‹</button><h2>Bank Account</h2></div><div id="bankAccountContent" class="card"><p>লোড হচ্ছে…</p></div></div>');
  await loadBankAccounts();
}
async function loadBankAccounts(){
  const box=document.getElementById('bankAccountContent');if(!box)return;
  try{
    const d=await api('/bank-accounts'),items=Array.isArray(d.accounts)?d.accounts:[];
    const rows=items.map((x,i)=>'<div class="bank-account-saved"><span class="bank-account-index">'+(i+1)+'</span><div><b>'+esc(x.method)+'</b><strong>'+esc(x.number)+'</strong></div><span class="bank-account-lock">Saved</span></div>').join('');
    const form=items.length<5?'<div class="bank-account-form"><h3>নতুন নম্বর যোগ করুন</h3><label for="bankAccountMethod">Payment Method</label><select id="bankAccountMethod" class="field"><option value="bKash">বিকাশ</option><option value="Nagad">নগদ</option><option value="Rocket">রকেট</option></select><label for="bankAccountNumber">Number</label><input id="bankAccountNumber" class="field" type="tel" inputmode="numeric" maxlength="11" placeholder="১১ সংখ্যার নম্বর"><button class="primary" type="button" onclick="saveBankAccount()">Save Number</button></div>':'<p class="bank-account-limit">সর্বোচ্চ ৫টি নম্বর সংরক্ষণ করা হয়েছে।</p>';
    box.innerHTML='<div class="bank-account-count">সংরক্ষিত নম্বর: '+items.length+'/5</div>'+(rows||'<p class="muted">এখনো কোনো নম্বর যোগ করা হয়নি।</p>')+form;
  }catch(e){box.textContent=e.message||'তথ্য লোড করা যায়নি';}
}
async function saveBankAccount(){
  const method=document.getElementById('bankAccountMethod')?.value||'';
  const number=String(document.getElementById('bankAccountNumber')?.value||'').replace(/\D/g,'');
  if(!['bKash','Nagad','Rocket'].includes(method))return toast('পেমেন্ট পদ্ধতি নির্বাচন করুন');
  if(!/^01[3-9]\d{8}$/.test(number))return toast('সঠিক ১১ সংখ্যার নম্বর দিন');
  const button=document.querySelector('.bank-account-form .primary');if(button)button.disabled=true;
  try{await api('/bank-accounts',{method,number});toast('নম্বর সেভ হয়েছে');await loadBankAccounts();}
  catch(e){toast(e.message||'নম্বর সেভ করা যায়নি');if(button)button.disabled=false;}
}

function page(name) {
  isPlayingGame = false;
  stopCrashMonitor();
  if (name === 'member') return memberCenter();
  if (name === 'security') return securityCenterPage();
  if (name === 'invite') return inviteFriendsPage();
  if (name === 'deposit') return depositPage();
  if (name === 'withdraw') return withdrawPage();
  if (name === 'bank') return bankAccountPage();
  if (name === 'withdrawRecord') return withdrawRecordPage();
  if (name === 'depositRecord') return depositRecordPage();
  if (name === 'history') return historyPage();
  if (name === 'account') return myAccountPage();
  if (name === 'profitloss') return profitLossPage();
  if (name === 'messages') return internalMessagesPage();
  if (name === 'rebate') return rebatePage();
  if (name === 'promotion') return promotionPage();

  const pages = {
    deposit: ['Deposit Information','TK777 একটি ফ্রি-প্লে গেমিং ডেমো। এখানে শুধু নগদমূল্যহীন Virtual Coin ব্যবহার করা হয়। বাস্তব টাকা জমা করা যায় না।'],
    withdraw: ['Withdrawal Information','TK777-তে শুধু নগদমূল্যহীন Virtual Coin ব্যবহার করা হয়। বাস্তব টাকা উত্তোলন করা যায় না।'],
    bank: ['Bank Account','এই ডেমোতে কোনো ব্যাংক অ্যাকাউন্ট বা বাস্তব অর্থের লেনদেন সংরক্ষণ করা হয় না।'],
    depositRecord: ['Deposit Record','এই ফ্রি-প্লে ডেমোতে বাস্তব অর্থের ডিপোজিট নেই, তাই Deposit Record প্রযোজ্য নয়।'],
    withdrawRecord: ['Withdrawal Record','এই ফ্রি-প্লে ডেমোতে বাস্তব অর্থের উত্তোলন নেই, তাই Withdrawal Record প্রযোজ্য নয়।'],
    account: ['My Account','আপনার প্রোফাইল ছবি পরিবর্তন করতে উপরের প্রোফাইল আইকনে চাপ দিন।'],
    security: ['Security Center','আপনার অ্যাকাউন্ট নিরাপদ রাখতে লগইন তথ্য গোপন রাখুন এবং নিজের ডিভাইস থেকে লগআউট করতে ভুলবেন না।'],
    invite: ['Invite Friends','এই ডেমোতে রেফারেল বোনাস চালু নেই।'],
    mission: ['Mission','বর্তমানে কোনো মিশন চালু নেই।'],
    messages: ['Internal Message','আপনার জন্য নতুন কোনো বার্তা নেই।'],
    suggestion: ['Suggestion','পরামর্শ জমা দেওয়ার সুবিধা শিগগিরই যুক্ত করা হবে।'],
    download: ['Download App','TK777-এর অ্যাপ ডাউনলোড বর্তমানে উপলব্ধ নয়।'],
    service: ['Customer Service','কাস্টমার সার্ভিসের যোগাযোগের তথ্য বর্তমানে যুক্ত করা হয়নি।'],
    reward: ['Reward Center','বর্তমানে কোনো নতুন রিওয়ার্ড নেই।'],
    promotion: ['Promotion','বর্তমানে কোনো নতুন প্রমোশন নেই।']
  };
  const item = pages[name] || ['TK777','এই পেজটি বর্তমানে উপলব্ধ নয়।'];
  shell(`
    <div class="page member-subpage">
      <div class="member-subpage-heading"><button onclick="page('member')" aria-label="Back">‹</button><h2>${esc(item[0])}</h2></div>
      <div class="card"><p>${esc(item[1])}</p></div>
      <button class="secondary" onclick="page('member')">Member Center</button>
    </div>
  `);
}


function selectDemoMethod(method){
  const input=document.getElementById('demoPaymentMethod');
  if(!input)return;
  input.value=method;
  const demoNumbers={
    'Demo bKash':demoMethodNumbers.bkash,
    'Demo Nagad':demoMethodNumbers.nagad,
    'Demo Rocket':demoMethodNumbers.rocket
  };
  const number=document.getElementById('demoDisplayNumber');
  if(number && demoNumbers[method]) number.textContent=demoNumbers[method];
  document.querySelectorAll('.demo-payment-method').forEach(el=>{
    const selected=el.dataset.method===method;
    el.classList.toggle('selected',selected);
    el.setAttribute('aria-pressed',selected?'true':'false');
  });
}
function selectDemoAmount(amount){
  const input=document.getElementById('demoAmount');
  if(!input)return;
  input.value=String(amount);
  document.querySelectorAll('.demo-amount-button').forEach(el=>{
    const selected=Number(el.dataset.amount)===Number(amount);
    el.classList.toggle('selected',selected);
    el.setAttribute('aria-pressed',selected?'true':'false');
  });
}
function syncDemoAmountInput(){
  const input=document.getElementById('demoAmount');
  if(!input)return;
  document.querySelectorAll('.demo-amount-button').forEach(el=>{
    const selected=el.dataset.amount===input.value;
    el.classList.toggle('selected',selected);
    el.setAttribute('aria-pressed',selected?'true':'false');
  });
}
async function depositRecordPage(){
  if(!me) return showAuth();
  shell(`<div class="page member-subpage">
    <div class="member-subpage-heading"><button onclick="page('member')">‹</button><h2>Deposit Record</h2></div>
    <div id="memberDepositHistory" class="card">লোড হচ্ছে…</div>
    <button class="secondary" onclick="page('member')">Member Center</button>
  </div>`);
  try {
    const d=await api('/demo-deposits');
    const box=document.getElementById('memberDepositHistory');
    if(!box)return;
    box.innerHTML=(d.requests||[]).map(x=>'<div class="history-row"><span>'+esc(x.method)+' · '+esc(depositText('currencyPrefix'))+Number(x.amount)+' '+esc(depositText('historyDemoSuffix'))+'<small>'+esc(x.demo_reference)+' · '+esc(x.created_at)+'</small></span><b>'+esc(x.status==='pending'?depositText('statusPending'):x.status==='accepted'?depositText('statusAccepted'):depositText('statusCancelled'))+'</b></div>').join('')||esc(depositText('emptyHistory'));
  } catch(e) {
    const box=document.getElementById('memberDepositHistory');
    if(box)box.textContent=e.message;
  }
}

async function depositPage(){
  if(!me) return showAuth();
  const t=depositText;
  shell(`<div class="page member-subpage">
    <div class="member-subpage-heading"><button onclick="page('member')">‹</button><h2>${esc(t('pageTitle'))}</h2></div>
    <style>.demo-number-panel{margin:12px 0;padding:15px 12px;border:1px solid #c9a24e;border-radius:13px;background:linear-gradient(145deg,#173d39,#0b292f);text-align:center;box-shadow:0 5px 14px #0004}
.demo-number-label{font-size:10px;font-weight:1000;letter-spacing:1.5px;color:#f5d77e}
.demo-number-row{display:flex;align-items:center;justify-content:center;gap:12px;margin:8px 0}
.demo-number-row strong{font-size:clamp(25px,7vw,34px);letter-spacing:1.5px;color:#fff1bd;text-shadow:0 2px 8px #0008}
.demo-number-row button{padding:9px 14px;border:1px solid #f3d17c;border-radius:9px;background:linear-gradient(145deg,#ffe58a,#d59a2e);color:#30210c;font-weight:1000}
.demo-number-panel small{display:block;font-size:11px;color:#ffe6b3;line-height:1.5}</style>
    <div class="demo-number-panel">
      <div class="demo-number-label">${esc(t('numberLabel'))}</div>
      <div class="demo-number-row"><strong id="demoDisplayNumber">${esc(supportSettings.demo_display_number || '01790365006')}</strong><button type="button" onclick="copyDemoNumber(this)">${esc(t('copyButton'))}</button></div>
      <small>${esc(t('numberNotice'))}</small>
    </div>
    ${depositExtraCategories()}
    <div class="card coin-request-card demo-deposit-card">
      <h3>${esc(t('paymentTitle'))}</h3>
      <div class="demo-payment-methods">
        <button type="button" class="demo-payment-method" data-method="Demo bKash" aria-pressed="false" onclick="selectDemoMethod('Demo bKash')">${demoPaymentImages.bkash ? '<img src="'+esc(demoPaymentImages.bkash)+'" alt="bKash" style="width:100%;height:34px;object-fit:contain">' : esc(t('methodBkash'))} <small>${esc(t('demoBadge'))}</small></button>
        <button type="button" class="demo-payment-method" data-method="Demo Nagad" aria-pressed="false" onclick="selectDemoMethod('Demo Nagad')">${demoPaymentImages.nagad ? '<img src="'+esc(demoPaymentImages.nagad)+'" alt="Nagad" style="width:100%;height:34px;object-fit:contain">' : esc(t('methodNagad'))} <small>${esc(t('demoBadge'))}</small></button>
        <button type="button" class="demo-payment-method" data-method="Demo Rocket" aria-pressed="false" onclick="selectDemoMethod('Demo Rocket')">${demoPaymentImages.rocket ? '<img src="'+esc(demoPaymentImages.rocket)+'" alt="Rocket" style="width:100%;height:34px;object-fit:contain">' : esc(t('methodRocket'))} <small>${esc(t('demoBadge'))}</small></button>
      </div>
      <input type="hidden" id="demoPaymentMethod" value="">
      <label for="demoAmount">${esc(t('amountLabel'))}</label>
      <input id="demoAmount" class="field" type="number" min="1" step="1" inputmode="numeric" placeholder="${esc(t('amountPlaceholder'))}" oninput="syncDemoAmountInput()">
      <div class="demo-amount-buttons">
        <button type="button" class="demo-amount-button" data-amount="100" onclick="selectDemoAmount(100)">${esc(t('currencyPrefix'))}${esc(t('preset100'))}</button>
        <button type="button" class="demo-amount-button" data-amount="200" onclick="selectDemoAmount(200)">${esc(t('currencyPrefix'))}${esc(t('preset200'))}</button>
        <button type="button" class="demo-amount-button" data-amount="300" onclick="selectDemoAmount(300)">${esc(t('currencyPrefix'))}${esc(t('preset300'))}</button>
        <button type="button" class="demo-amount-button" data-amount="500" onclick="selectDemoAmount(500)">${esc(t('currencyPrefix'))}${esc(t('preset500'))}</button>
        <button type="button" class="demo-amount-button" data-amount="1000" onclick="selectDemoAmount(1000)">${esc(t('currencyPrefix'))}${esc(t('preset1000'))}</button>
      </div>
      <label for="demoReference">${esc(t('referenceLabel'))}</label>
      <input id="demoReference" class="field" type="text" maxlength="80" autocomplete="off" placeholder="${esc(t('referencePlaceholder'))}">
      <small class="muted">${esc(t('referenceHint'))}</small>
      <button class="primary" onclick="submitDemoDeposit()">${esc(t('submitButton'))}</button>
      <p id="demoDepositMsg" class="muted"></p>
    </div>
    <button class="secondary" onclick="page('member')">${esc(t('backButton'))}</button>
  </div>`);
}
function copyDemoNumber(button){
  const number=document.getElementById('demoDisplayNumber')?.textContent.trim()||'01790365006';
  const done=()=>{if(button){button.textContent=depositText('copiedButton');setTimeout(()=>{if(button.isConnected)button.textContent='Copy';},1800);}toast(depositText('copySuccess'));};  if(navigator.clipboard && window.isSecureContext){
    navigator.clipboard.writeText(number).then(done).catch(()=>fallbackCopyDemoNumber(number,done));
  }else fallbackCopyDemoNumber(number,done);
}
function fallbackCopyDemoNumber(number,done){
  const field=document.createElement('textarea');
  field.value=number;field.setAttribute('readonly','');field.style.position='fixed';field.style.opacity='0';
  document.body.appendChild(field);field.select();
  try{if(document.execCommand('copy'))done();else toast('কপি করা যায়নি');}
  catch(e){toast('কপি করা যায়নি');}
  field.remove();
}

async function loadDemoDeposits(){
 const box=document.getElementById('demoDepositHistory');if(!box)return;
 try{const d=await api('/demo-deposits');box.innerHTML=(d.requests||[]).map(x=>'<div class="history-row"><span>'+esc(x.method)+' · '+esc(depositText('currencyPrefix'))+Number(x.amount)+' '+esc(depositText('historyDemoSuffix'))+'<small>'+esc(x.demo_reference)+' · '+esc(x.created_at)+'</small></span><b>'+esc(x.status==='pending'?depositText('statusPending'):x.status==='accepted'?depositText('statusAccepted'):depositText('statusCancelled'))+'</b></div>').join('')||esc(depositText('emptyHistory'));}
 catch(e){box.textContent=e.message;}
}
async function submitDemoDeposit(){
 const method=document.getElementById('demoPaymentMethod')?.value;
 const amount=Number(document.getElementById('demoAmount')?.value);
 const demo_reference=document.getElementById('demoReference')?.value.trim();
 const msg=document.getElementById('demoDepositMsg');if(!msg)return;
 if(!method){msg.textContent=depositText('chooseMethodError');return;}
 if(!Number.isFinite(amount)||amount<=0||!Number.isInteger(amount)){msg.textContent=depositText('amountError');return;}
 if(!demo_reference){msg.textContent=depositText('referenceError');return;}
 try{const requestMethod=String(method).replace(/^Demo\s+/,'');await api('/demo-deposits',{method:requestMethod,amount,demo_reference});msg.textContent=depositText('successMessage');await loadDemoDeposits();}
 catch(e){msg.textContent=e.message;}
}

async function historyPage() {
  if (!me) return showAuth();

  try {
    const d = await api('/history');

    shell(`
      <div class="page">
        <h3>Transaction History</h3>
        <div class="card">
          ${d.transactions.map(t => `
            <div class="history-row">
              <span>
                ${esc(t.note)}
                <small>${esc(t.created_at)}</small>
              </span>
              <b class="${t.amount >= 0 ? 'gold' : 'loss'}">
                ${t.amount > 0 ? '+' : ''}${t.amount}
                <small>ক্রেডিট</small>
                <small>Balance ${money(t.balance_after)}</small>
              </b>
            </div>
          `).join('') || 'কোনো লেনদেন নেই'}
        </div>

        <h3>Game History</h3>
        <div class="card">
          ${d.rounds.map(r => `
            <div class="history-row">
              <span>
                ${esc(r.game_id)}
                <small>Bet ${r.bet_amount} · ${r.multiplier}x</small>
              </span>
              <b>${r.payout} <small>পেআউট</small></b>
            </div>
          `).join('') || 'কোনো গেম খেলা হয়নি'}
        </div>
      </div>
    `);
  } catch (e) {
    toast(e.message);
  }
}

function logout() {
  api('/logout',{}).catch(() => {});
  token = '';
  me = null;
  localStorage.removeItem('tk777_token');
  home();
}

/* GAME ROUTING */

let gameDepositPopupTimer = null;

function showGameDepositPopup() {
  const existing = document.getElementById('gameDepositPopup');
  if (existing) existing.remove();
  if (gameDepositPopupTimer) clearTimeout(gameDepositPopupTimer);

  const popup = document.createElement('div');
  popup.id = 'gameDepositPopup';
  popup.className = 'game-deposit-overlay';
  popup.innerHTML = `
    <div class="game-deposit-modal" role="dialog" aria-modal="true" aria-labelledby="gameDepositTitle">
      <button class="game-deposit-close" type="button" aria-label="বন্ধ করুন" onclick="closeGameDepositPopup()">×</button>
      <div class="game-deposit-icon">＋</div>
      <h3 id="gameDepositTitle">এই গেম খেলতে ডিপোজিট পেজে যান</h3>
      <p>ডিপোজিট পেজে গিয়ে উপলব্ধ Virtual Coin সংক্রান্ত তথ্য দেখুন।</p>
      <button class="game-deposit-button" type="button" onclick="closeGameDepositPopup();page('deposit')">ডিপোজিট</button>
    </div>`;
  document.body.appendChild(popup);
  gameDepositPopupTimer = setTimeout(closeGameDepositPopup, 4000);
}

function closeGameDepositPopup() {
  if (gameDepositPopupTimer) {
    clearTimeout(gameDepositPopupTimer);
    gameDepositPopupTimer = null;
  }
  document.getElementById('gameDepositPopup')?.remove();
}

function openGame(id) {
  const g = games.find(x => x.id === id);
  if (!g) return;

  const gameName = String(g.name || '');
  const gameType = String(g.game_type || '').toLowerCase();
  const isAviator = gameType === 'aviator' || /aviator/i.test(gameName);
  const isSuperAce = gameType === 'superace' || /super\\s*ace/i.test(gameName);
  if (!isAviator && !isSuperAce) {
    isPlayingGame = false;
    showGameDepositPopup();
    return;
  }

  isPlayingGame = true;

  if (!me) {
    showAuth();
    toast('গেম খেলতে Login করুন');
    return;
  }

  if (g.game_type === 'html') {
    if (!g.html_content) {
      toast('এই গেমে HTML ফাইল যোগ করা হয়নি');
      return;
    }

    stopCrashMonitor();

    shell(`
      <div class="page">
        <h3>${esc(g.name)}</h3>
        <div class="card game-frame">
          <iframe id="customGame" title="Custom game" sandbox="allow-scripts" referrerpolicy="no-referrer"></iframe>
        </div>
        <button class="secondary" onclick="home()">ফিরে যান</button>
      </div>
    `);

    $('#customGame').srcdoc = g.html_content;
    return;
  }

  if (g.game_type === 'aviator') aviator(g);
  else if (g.game_type === 'superace') superAce(g);
  else if (g.game_type === 'minigame') miniGame(g);
  else if (g.game_type === 'evolution-demo') evolutionDemo(g);
}

/* ==========================================
   FREE VIRTUAL-COIN MINI GAMES
========================================== */
const MINI_GAME_INFO = {
  'gold-mines':{icon:'💎',subtitle:'Find a safe gem tile',choices:[['1','1'],['2','2'],['3','3'],['4','4'],['5','5']],hint:'একটি ঘর বাছুন। মাইন এড়াতে পারলে 1.8x।'},
  'plinko':{icon:'🔴',subtitle:'Drop the ball',choices:[],hint:'বলটি নিজে থেকেই একটি মাল্টিপ্লায়ার ঘরে পড়বে।'},
  'classic-dice':{icon:'🎲',subtitle:'Predict the dice',choices:[['high','HIGH · 4–6'],['low','LOW · 1–3']],hint:'High বা Low বেছে নিন। সঠিক হলে 1.9x।'},
  'royal-coinflip':{icon:'🪙',subtitle:'Heads or Tails',choices:[['heads','HEADS'],['tails','TAILS']],hint:'এক পাশ বেছে নিন। সঠিক হলে 1.9x।'},
  'european-roulette':{icon:'🎡',subtitle:'Choose a colour',choices:[['red','RED'],['black','BLACK'],['green','GREEN · 0']],hint:'লাল/কালোতে 1.9x, সবুজ 0-তে 14x।'},
  'blackjack-21':{icon:'🂡',subtitle:'Reach 18–21',choices:[],hint:'কার্ড তুলুন। সার্ভার ফলাফল তৈরি করবে; ১৮ বা বেশি হলে 1.8x।'},
  'baccarat':{icon:'♠️',subtitle:'Player · Banker · Tie',choices:[['player','PLAYER'],['banker','BANKER'],['tie','TIE']],hint:'Player/Banker 1.95x, Tie 8x।'},
  'diamond-slots':{icon:'💎',subtitle:'Match the reels',choices:[],hint:'তিনটি রিল ঘুরবে। তিনটি এক হলে 5x, দুটি মিললে 1.5x।'},
  'fortune-wheel':{icon:'🎯',subtitle:'Spin for a multiplier',choices:[],hint:'চাকা ঘুরিয়ে 0x থেকে 10x পর্যন্ত ফল পান।'},
  'royal-keno':{icon:'👑',subtitle:'Pick a lucky number',choices:Array.from({length:10},(_,i)=>[String(i+1),String(i+1)]),hint:'১–১০ থেকে নম্বর বাছুন। মিললে 8x।'},
  'live-roulette':{icon:'🎡',subtitle:'Live Roulette Table',choices:[['red','RED'],['black','BLACK'],['green','GREEN · 0']],hint:'ডিলার-স্টাইল সিমুলেটেড রুলেট টেবিল। লাল/কালো 1.9x, সবুজ 14x।'},
  'live-blackjack':{icon:'🂡',subtitle:'Live Blackjack Table',choices:[],hint:'অ্যানিমেটেড ডিলার কার্ড খুলবে। এটি সিমুলেটেড টেবিল, আসল লাইভ ডিলার নয়।'},
  'live-baccarat':{icon:'♠️',subtitle:'Live Baccarat Table',choices:[['player','PLAYER'],['banker','BANKER'],['tie','TIE']],hint:'ডিলার-স্টাইল সিমুলেটেড Baccarat। Player/Banker 1.95x, Tie 8x।'}
};
/* Evolution-style preview screens. Visual-only demo, not provider streams. */
function evolutionDemo(g) {
  stopCrashMonitor();
  const demos = {
    'evo-crazy-time': ['🎡', 'BONUS WHEEL', 'crazy', '/live-casino/game-shows/crazy-time/'],
    'evo-funky-time': ['🪩', 'FUNKY BONUS', 'funky', '/live-casino/game-shows/funky-time/'],
    'evo-disco-balls': ['🪩', 'DISCO BALLS', 'disco', '/live-casino/game-shows/disco-balls/'],
    'evo-mega-ball': ['🔮', 'MEGA BALL', 'mega', '/live-casino/game-shows/mega-ball/'],
    'evo-dream-catcher': ['🌙', 'DREAM CATCHER', 'dream', '/live-casino/game-shows/dream-catcher/'],
    'evo-lightning-roulette': ['⚡', 'LIGHTNING ROULETTE', 'lightning', '/live-casino/live-roulette/lightning-roulette/'],
    'evo-monopoly-live': ['🏙️', 'MONOPOLY LIVE', 'monopoly', '/live-casino/game-shows/monopoly-live/'],
    'evo-deal-or-no-deal': ['💼', 'DEAL OR NO DEAL', 'deal', '/live-casino/game-shows/deal-or-no-deal-live/'],
    'evo-crazy-coin-flip': ['🪙', 'CRAZY COIN FLIP', 'coin', '/live-casino/crazy-coin-flip/'],
    'evo-xxx-lightning': ['⚡', 'XXXTREME LIGHTNING', 'lightning', '/live-casino/live-roulette/xxxtreme-lightning-roulette/']
  };
  const [symbol, label, theme, path] = demos[g.id] || ['🎲', 'LIVE GAME', 'crazy', '/'];
  const officialUrl = 'https://games.evolution.com' + path;
  shell(`
    <div class="page evo-demo-page">
      <div class="evo-demo-top">
        <button class="secondary" onclick="home()">‹ BACK</button>
        <span class="evo-demo-live"><i></i> OFFICIAL VIDEO</span>
      </div>
      <h2 class="evo-video-title">${esc(g.name)}</h2>
      <section class="evo-video-frame-wrap">
        <iframe class="evo-video-frame" title="${esc(g.name)} official Evolution video page"
          src="${officialUrl}" loading="lazy" allow="autoplay; fullscreen; picture-in-picture"
          referrerpolicy="strict-origin-when-cross-origin"></iframe>
      </section>
      <section class="card evo-demo-notice">
        <b>OFFICIAL EVOLUTION FREEPLAY</b>
        <p>এটি Evolution-এর অফিসিয়াল ফ্রি-প্লে ভিডিও পেজ। TK777 থেকে কোনো বেট বা টাকা জমা হবে না। ভিডিওটি এখানে না চললে নিচের অফিসিয়াল লিংক ব্যবহার করুন।</p>
        <a class="button secondary evo-official-link" href="${officialUrl}" target="_blank" rel="noopener noreferrer">Evolution-এ ভিডিও খুলুন ↗</a>
      </section>
      <button class="secondary evo-demo-back" onclick="home()">গেম তালিকায় ফিরে যান</button>
    </div>
  `);
}

function miniGameStage(gameId) {
  const stages = {
    'gold-mines':'<div class="mg-mines-grid">'+Array.from({length:5},(_,i)=>'<span class="mg-mine-tile" style="--i:'+i+'">?</span>').join('')+'</div>',
    'plinko':'<div class="mg-plinko"><div class="mg-plinko-pegs">'+Array.from({length:6},(_,r)=>'<div>'+Array.from({length:r+3},()=>'<i></i>').join('')+'</div>').join('')+'</div><span class="mg-plinko-ball">●</span><div class="mg-plinko-bins"><i>0.5x</i><i>1x</i><i>2x</i><i>5x</i><i>1x</i></div></div>',
    'classic-dice':'<div class="mg-dice">⚄</div>',
    'royal-coinflip':'<div class="mg-coin"><span>TK</span></div>',
    'european-roulette':'<div class="mg-roulette-wrap"><div class="mg-roulette"><span>0</span>'+Array.from({length:11},(_,i)=>'<b>'+(i+1)+'</b>').join('')+'</div><i class="mg-roulette-pointer"></i></div>',
    'blackjack-21':'<div class="mg-cards"><span>?</span><span>?</span><span>?</span></div>',
    'baccarat':'<div class="mg-baccarat"><div><small>PLAYER</small><span>?</span><span>?</span></div><div><small>BANKER</small><span>?</span><span>?</span></div></div>',
    'diamond-slots':'<div class="mg-reels"><span>💎</span><span>👑</span><span>7️⃣</span></div>',
    'fortune-wheel':'<div class="mg-wheel-wrap"><i class="mg-wheel-pointer"></i><div class="mg-wheel"><b>2x</b><b>5x</b><b>0x</b><b>3x</b><b>10x</b><b>1x</b><b>4x</b><b>0x</b></div></div>',
    'royal-keno':'<div class="mg-keno-balls">'+Array.from({length:10},(_,i)=>'<span style="--i:'+i+'">'+(i+1)+'</span>').join('')+'</div>',
    'live-roulette':'<div class="live-table-scene"><div class="live-dealer"><span>👩🏻‍💼</span><b>DEALER MAYA</b></div><div class="mg-roulette-wrap"><div class="mg-roulette"><span>0</span>'+Array.from({length:11},(_,i)=>'<b>'+(i+1)+'</b>').join('')+'</div><i class="mg-roulette-pointer"></i></div><small>SIMULATED LIVE ROULETTE</small></div>',
    'live-blackjack':'<div class="live-table-scene"><div class="live-dealer"><span>👨🏻‍💼</span><b>DEALER ALEX</b></div><div class="mg-cards"><span>?</span><span>?</span><span>?</span></div><small>SIMULATED LIVE BLACKJACK</small></div>',
    'live-baccarat':'<div class="live-table-scene"><div class="live-dealer"><span>👩🏻‍💼</span><b>DEALER LUNA</b></div><div class="mg-baccarat"><div><small>PLAYER</small><span>?</span><span>?</span></div><div><small>BANKER</small><span>?</span><span>?</span></div></div><small>SIMULATED LIVE BACCARAT</small></div>'
  };
  return '<div class="mini-stage mini-stage-'+gameId+'" id="miniStage">'+(stages[gameId]||'<div class="mg-fallback">✨</div>')+'</div>';}
function miniGame(g) {
  stopCrashMonitor();
  const info = MINI_GAME_INFO[g.id];
  if (!info) return toast('গেমটি প্রস্তুত নয়');  const buttons = info.choices.length
    ? info.choices.map(([value,label])=>'<button type="button" class="mini-choice" data-choice="'+esc(value)+'" onclick="selectMiniChoice(this)">'+esc(label)+'</button>').join('')
    : '';
  shell(`
    <div class="page mini-game-page">
      <div class="mini-game-top"><button class="secondary" onclick="home()">‹ BACK</button><b>${esc(g.name)}</b><span id="miniBalance">${Number(me.balance).toLocaleString("en-US")} Coin</span></div>
      <section class="card mini-game-board">
        <div class="mini-game-kicker">${g.id.startsWith("live-") ? "TK777 • SIMULATED LIVE TABLE" : "TK777 • FREE ARCADE"}</div>
        <h2>${esc(g.name)}</h2><p class="muted">${esc(info.subtitle)}</p>
        ${miniGameStage(g.id)}
        <div class="mini-result" id="miniResult">READY TO PLAY</div>
        <div class="mini-detail" id="miniDetail">${esc(info.hint)}</div>
        ${buttons ? '<div class="mini-choices" id="miniChoices">'+buttons+'</div>' : ''}
        <label for="miniBet">BET · VIRTUAL COIN</label>
        <input class="field" id="miniBet" type="number" min="1" max="1000000" step="1" value="10">
        <button class="primary mini-play-button" id="miniPlay" onclick="playMiniGame('${esc(g.id)}')">▶ PLAY NOW</button>
        <small class="muted">শুধু নগদমূল্যহীন Virtual Coin · কোনো বাস্তব অর্থ নয়</small>
      </section>
      <button class="secondary" onclick="home()">ফিরে যান</button>
    </div>  `);
}
function selectMiniChoice(button) {
  document.querySelectorAll('.mini-choice').forEach(x=>x.classList.remove('selected'));
  button.classList.add('selected');
}
async function playMiniGame(gameId) {
  const button = document.getElementById('miniPlay');
  const bet = Number(document.getElementById('miniBet')?.value);
  const selected = document.querySelector('.mini-choice.selected');
  const choice = selected?.dataset.choice || '';
  if (!Number.isSafeInteger(bet) || bet < 1 || bet > 1000000) return toast('১ থেকে ১০,০০,০০০-এর মধ্যে বেট দিন');
  const info = MINI_GAME_INFO[gameId];
  if (info?.choices.length && !choice) return toast('আগে একটি অপশন বেছে নিন');
  button.disabled = true;
  button.textContent = 'ANIMATING...';
  const stage = document.getElementById('miniStage');
  if (stage) { stage.classList.remove('is-result'); stage.classList.add('is-spinning'); }
  const startedAt = Date.now();
  try {
    const r = await api('/mini-play',{gameId,betAmount:bet,choice});
    const remaining = Math.max(0,1700-(Date.now()-startedAt));
    if (remaining) await new Promise(resolve=>setTimeout(resolve,remaining));
    me.balance = r.balance;
    const bal = document.getElementById('miniBalance');
    if (bal) bal.textContent = Number(r.balance).toLocaleString('en-US')+' Coin';
    const result = document.getElementById('miniResult');
    if (result) result.textContent = r.result;
    const detail = document.getElementById('miniDetail');
    if (detail) detail.textContent = r.detail+' · '+r.multiplier+'x · পেআউট '+r.payout+' কয়েন';
    if (stage) { stage.classList.remove('is-spinning'); stage.classList.add('is-result'); }
    toast(r.payout > bet ? 'আপনি জিতেছেন!' : r.payout === bet ? 'বেট ফেরত এসেছে' : 'এই রাউন্ডে জয় হয়নি');
  } catch(e) {
    if (stage) stage.classList.remove('is-spinning');
    toast(e.message);
  } finally { button.disabled = false; button.textContent = '↻ PLAY AGAIN'; }
}
/* ==========================================
   TK777 FLIGHT GAME SCREEN
========================================== */

function aviator(g) {
  const aviatorTitle = g.name || 'Aviator';
  stopCrashMonitor();

  crashSlots = [
    {roundId:null,busy:false,status:'ready',auto:false,autoBet:false,autoTarget:2,lastAutoSessionId:null},
    {roundId:null,busy:false,status:'ready',auto:false,autoBet:false,autoTarget:2,lastAutoSessionId:null}
  ];
  crashGameId = g.id;
  crashPhase = 'countdown';

  $('#app').innerHTML = `
    <main class="aviator-app">
      <header class="aviator-header">
        <button class="aviator-back" onclick="home()" aria-label="Back">‹</button>
        <div class="aviator-wordmark">${esc(aviatorTitle)}<span>TK777</span></div>
        <button class="aviator-menu" type="button" onclick="toast(&quot;Game menu&quot;)" aria-label="Game menu">☰</button>
        <div class="aviator-wallet"><small>VIRTUAL BALANCE</small><b id="gameBalance">${money(me.balance)}</b></div>
      </header>

      <div class="aviator-ticker">
        <span class="ticker-label">LAST</span>
        <div id="crashHistoryTicker" class="ticker-values"><i>Loading results…</i></div>
        <button class="history-more-button" type="button" onclick="toggleCrashHistory()" aria-label="Show 15 more multipliers">⋯</button>
        <div id="crashHistoryMore" class="history-more-popover" hidden></div>
      </div>

      <section class="aviator-game-body">
        <div class="aviator-stage countdown" id="aviatorStage">
          <div class="aviator-rays"></div>
          <div class="aviator-sky"></div>
          <div class="aviator-stars"></div>
          <div class="aviator-clouds cloud-back"></div>
          <div class="aviator-clouds cloud-middle"></div>
          <div class="aviator-clouds cloud-front"></div>
          <div class="stage-flash" id="stageFlash"></div>

          <div class="aviator-promo" id="aviatorPromo">
            <div class="promo-partners"><b>UFC</b><i></i><strong>${esc(aviatorTitle)}</strong></div>
            <div class="promo-official">OFFICIAL PARTNERS</div>
            <div class="promo-progress"><span></span></div>
            <div class="promo-spribe">
              <b>✺ SPRIBE</b>
              <span>Official Game <em>✓</em></span>
              <small>Since 2019</small>
            </div>
            <div class="promo-plane">✈</div>
          </div>

          <div class="crash-flew-away" aria-hidden="true">FLEW AWAY!</div>
          <div class="multiplier" id="multi">1.00x</div>
          <div class="crash-status" id="crashStatus">WAITING FOR NEXT ROUND</div>
          <div class="aviator-crowd" id="aviatorCrowd" aria-label="Animated player count">
            <span class="crowd-avatar crowd-avatar-one"><i></i></span>
            <span class="crowd-avatar crowd-avatar-two"><i></i></span>
            <span class="crowd-avatar crowd-avatar-three"><i></i></span>
            <b id="aviatorCrowdCount">1</b>
          </div>

          <svg class="flight-chart" id="flightChart" viewBox="0 0 1000 440" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id="flightLine" x1="0" y1="1" x2="1" y2="0">
                <stop offset="0%" stop-color="#ff304c"/>
                <stop offset="100%" stop-color="#ff304c"/>
              </linearGradient>
              <linearGradient id="flightFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#b30b32" stop-opacity=".78"/>
                <stop offset="100%" stop-color="#ed1741" stop-opacity=".58"/>
              </linearGradient>
              <filter id="flightGlow">
                <feGaussianBlur stdDeviation="4" result="blur"/>
                <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
            </defs>
            <path id="flightArea" class="flight-area" d="M35 405 L35 440 L35 440 Z"/>
            <path id="flightPath" class="flight-path" d="M35 405"/>
            <circle id="flightDot" class="flight-dot" cx="35" cy="405" r="6"/>
          </svg>

          <div class="plane-trail" id="planeTrail"></div>
          <div class="plane-wrap" id="planeWrap">
            <svg class="plane user-plane" id="plane" viewBox="110 95 340 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="User-designed red aircraft"><path d="M357,187 L349,179 L312,193 L311,195 L350,203 L357,190Z M371,168 L369,169 L366,178 L364,178 L361,174 L358,174 L358,177 L364,184 L358,200 L362,198 L367,191 L372,194 L374,193 L369,185Z M403,168 L410,184 L414,182 L423,170 L422,168 L412,166 L404,166Z M405,170 L407,168 L417,168 L420,170 L408,175Z M409,194 L398,166 L389,158 L369,160 L337,169 L328,169 L318,164 L310,163 L298,167 L278,178 L271,184 L270,192 L296,195 L301,191 L344,171 L375,162 L384,162 L388,167 L401,199 L397,200 L392,198 L359,215 L344,219 L336,216 L333,213 L335,209 L329,206 L218,188 L206,188 L196,192 L192,197 L205,210 L214,206 L216,210 L213,213 L190,224 L187,228 L186,235 L212,223 L215,223 L218,228 L210,233 L211,235 L238,223 L241,224 L239,227 L183,253 L173,250 L147,230 L138,228 L122,236 L123,239 L133,234 L136,235 L126,242 L118,245 L116,251 L119,252 L130,248 L155,273 L158,273 L159,271 L139,249 L140,246 L144,245 L163,257 L174,259 L174,262 L166,265 L165,268 L169,269 L231,244 L235,244 L240,249 L246,250 L296,233 L318,223 L334,224 L329,228 L227,262 L181,274 L156,276 L149,280 L153,284 L159,284 L160,287 L164,289 L183,282 L322,243 L357,231 L381,221 L403,209 L409,201Z M216,192 L220,191 L275,201 L308,205 L329,209 L330,211 L325,216 L321,217 L226,196Z M310,173 L308,176 L291,184 L282,184 L280,182 L287,176 L298,171 L306,171Z M308,167 L314,166 L328,173 L314,181 L311,181 L310,179 L317,175 L317,172 L309,169Z" fill="#f02036" fill-rule="evenodd" stroke="#f02036" stroke-linejoin="round" stroke-width="1"/><g class="user-plane-propeller" transform="translate(427 190)"><g class="user-plane-propeller-spin"><path d="M-3,-5 C-10,-22 -8,-43 0,-57 C8,-43 10,-22 3,-5Z" fill="#f02036" stroke="#f02036" stroke-linejoin="round"/><path d="M-3,-5 C-10,-22 -8,-43 0,-57 C8,-43 10,-22 3,-5Z" transform="rotate(180)" fill="#f02036" stroke="#f02036" stroke-linejoin="round"/></g><circle cx="0" cy="0" r="4" fill="#f02036"/></g></svg>
            <div class="plane-fire"></div>
          </div>
          
        </div>

        <div class="aviator-bet-panels">
          ${[0,1].map(i => `
            <section class="aviator-bet-card">
              <div class="bet-mode-tabs">
                <button id="betMode${i}" class="mode-tab active" onclick="setAviatorMode(${i},'bet')">Bet</button>
                <button id="autoMode${i}" class="mode-tab" onclick="setAviatorMode(${i},'auto')">Auto</button>
              </div>
              <div class="bet-card-main">
                <div class="bet-amount-side">
                  <div class="bet-amount-wrap">
                    <button type="button" onclick="adjustQuickBet(${i},-1)" aria-label="Decrease bet">−</button>
                    <input id="crashBet${i}" type="number" min="1" max="1000000" step="1" value="10" aria-label="Bet amount" oninput="syncBetButton(${i})" onchange="syncBetButton(${i})">
                    <button type="button" onclick="adjustQuickBet(${i},1)" aria-label="Increase bet">+</button>
                  </div>
                  <div class="quick-bets">
                    ${[1,10,50,100].map(v => `<button type="button" onclick="setQuickBet(${i},${v})">${v}</button>`).join('')}
                  </div>
                </div>
                <div class="bet-action-side">
                  <button class="aviator-bet-button" id="startCrash${i}" onclick="startCrash(${i})">Bet<br><b>BDT 10.00</b></button>
                  <button class="aviator-cashout-button" id="cashoutBtn${i}" disabled onclick="cashout(${i})">Cash Out<br><b>BDT 0.00</b></button>
                  <button class="aviator-cancel-button" id="cancelAuto${i}" onclick="cancelAuto(${i})" disabled>Cancel</button>
                </div>
              </div>
              <div class="aviator-auto-row" id="autoOptions${i}">
                <label><input type="checkbox" id="autoBetToggle${i}" onchange="toggleAutoBet(${i},this.checked)"> Auto Bet</label>
                <label><input type="checkbox" id="autoToggle${i}" onchange="toggleAuto(${i},this.checked)"> Auto Cash Out</label>
                <label class="auto-cash-label">Auto Cash Out
                  <input type="number" id="autoTarget${i}" min="1.01" max="1000" step=".01" value="2.00"><span>x</span>
                </label>
              </div>
              <div class="aviator-slot-status"><span id="slotStatus${i}">READY</span><small id="result${i}">Waiting for next round</small></div>
            </section>
          `).join('')}
        </div>
        <div class="aviator-footer-note">TK777 • BDT OFFICIALS GAME</div>

      </section>
    </main>
  `;

  startCrashMonitor(g.id);
}

function syncBetButton(index) {
  const input = $('#crashBet'+index);
  const btn = $('#startCrash'+index);
  if (!input || !btn) return;
  const slot = crashSlots[index];
  if (slot?.roundId && crashPhase === 'countdown') return;
  const amount = Number(input.value);
  const shown = Number.isFinite(amount) && amount >= 0 ? amount : 0;
  btn.innerHTML = 'Bet<br><b>BDT '+shown.toFixed(2)+'</b>';
  btn.classList.remove('is-bet-cancel');
}

function setQuickBet(index, amount) {
  const input = $('#crashBet'+index);
  if (!input) return;
  input.value = String(amount);
  syncBetButton(index);
}

function adjustQuickBet(index, direction) {
  const input = $('#crashBet'+index);
  if (!input) return;
  const current = Math.max(1,Number(input.value)||1);
  const next = Math.max(1,Math.min(1000000,current + direction*10));
  input.value = String(next);
  syncBetButton(index);
}

function setAviatorMode(index, mode) {
  const bet = $('#betMode'+index);
  const auto = $('#autoMode'+index);
  const options = $('#autoOptions'+index);
  if (bet) bet.classList.toggle('active',mode==='bet');
  if (auto) auto.classList.toggle('active',mode==='auto');
  if (options) options.classList.toggle('auto-mode-active',mode==='auto');
}

/* ==========================================
   CRASH ROUND MONITOR
========================================== */

function startCrashMonitor(gameId) {
  stopCrashMonitor();
  crashGameId = gameId;

  pollCrashState();

  crashTimer = setInterval(() => {
    pollCrashState();
  },400);
}

function multiplierHistoryClass(value) {
  const n = Number(value);
  if (n >= 15) return 'history-red';
  if (n >= 10) return 'history-pink';
  if (n >= 5) return 'history-purple';
  if (n >= 2) return 'history-orange';
  return 'history-blue';
}

function updateCrashHistory(previous) {
  crashHistoryData = Array.isArray(previous) ? previous.slice(0,25) : [];
  const ticker = $('#crashHistoryTicker');
  const more = $('#crashHistoryMore');
  const renderChip = x => {
    const n = Number(x.crash_multiplier);
    return `<span class="${multiplierHistoryClass(n)}">${n.toFixed(2)}x</span>`;
  };
  if (ticker) {
    ticker.innerHTML = crashHistoryData.length
      ? crashHistoryData.slice(0,10).map(renderChip).join('')
      : '<i>No previous rounds yet</i>';
  }
  if (more) {
    const extra = crashHistoryData.slice(10,25);
    more.innerHTML = extra.length
      ? '<div class="history-more-title">PREVIOUS 15 RESULTS</div><div class="history-more-grid">'+extra.map(renderChip).join('')+'</div>'
      : '<div class="history-more-title">আরও পুরোনো রাউন্ড নেই</div>';
  }
}

function toggleCrashHistory() {
  const panel = $('#crashHistoryMore');
  const button = $('.history-more-button');
  if (!panel) return;
  const opening = panel.hidden;
  panel.hidden = !opening;
  if (button) button.classList.toggle('active',opening);
}
function setAviatorFeed(mode) {
  ['all','previous','top'].forEach(key => {
    const button = $('#feed'+key.charAt(0).toUpperCase()+key.slice(1));
    if (button) button.classList.toggle('active',key===mode);
  });
  const summary = $('.feed-summary');
  const history = $('#crashHistory');
  if (!summary || !history) return;
  if (mode === 'previous') {
    summary.innerHTML = '<b>Previous rounds</b><span>সম্পন্ন রাউন্ডের ফলাফল</span>';
    history.innerHTML = crashHistoryData.length ? crashHistoryData.map(x => {
      const n = Number(x.crash_multiplier);
      return '<span class="'+(n >= 2 ? 'history-high' : 'history-low')+'">'+n.toFixed(2)+'x</span>';
    }).join('') : '<span class="muted">আগের কোনো রাউন্ড নেই</span>';
  } else if (mode === 'top') {
    summary.innerHTML = '<b>Top</b><span>সার্ভারের Top তালিকা অনুপস্থিত</span>';
    history.innerHTML = '<span class="muted">Top Players তালিকা দেখানোর API এখনো নেই</span>';
  } else {
    summary.innerHTML = '<b>All Bets</b><span>লাইভ বেট তালিকা</span>';
    history.innerHTML = '<span class="muted">All Bets লাইভ তালিকার জন্য সার্ভার API প্রয়োজন</span>';
  }
}

function updateSlotStatus(i,text) {
  const el = $('#slotStatus'+i);
  if (el) el.textContent = text;
}

function updateSlotButtons(i) {
  const slot = crashSlots[i];
  const start = $('#startCrash'+i);
  const cash = $('#cashoutBtn'+i);
  const cancel = $('#cancelAuto'+i);
  const autoToggle = $('#autoToggle'+i);
  const autoBetToggle = $('#autoBetToggle'+i);
  const targetInput = $('#autoTarget'+i);

  if (!start || !cash) return;

  if (autoToggle) autoToggle.checked = !!slot.auto;
  if (autoBetToggle) autoBetToggle.checked = !!slot.autoBet;

  if (targetInput && document.activeElement !== targetInput) {
    targetInput.value = Number(slot.autoTarget || 2).toFixed(2);
  }

  if (cancel) {
    cancel.disabled = !slot.auto || slot.busy;
  }

  const canCancelBet = !!slot.roundId && crashPhase === 'countdown';
  start.disabled = slot.busy || (!canCancelBet && crashPhase !== 'countdown');
  if (canCancelBet) {
    start.innerHTML = 'Cancel';
    start.classList.add('is-bet-cancel');
  } else {
    const amount = Math.max(0,Number($('#crashBet'+i)?.value || 0));
    start.innerHTML = 'Bet<br><b>BDT '+amount.toFixed(2)+'</b>';
    start.classList.remove('is-bet-cancel');
  }

  cash.disabled =
    !slot.roundId ||
    slot.busy ||
    slot.status !== 'active' ||
    crashPhase !== 'active';
}

function updateAllSlotButtons() {
  for (let i=0;i<crashSlots.length;i++) {
    updateSlotButtons(i);
  }
}

function updateAviatorCrowd(state) {
  const countEl = $('#aviatorCrowdCount');
  if (!countEl || !state) return;
  const sessionKey = String(state.sessionId || state.startMs || 'aviator-session');
  if (sessionKey !== aviatorCrowdSession) {
    aviatorCrowdSession = sessionKey;
    aviatorCrowdPeak = 1832 + Math.floor(Math.random() * 269);
  }
  let count = 1;
  if (state.status === 'countdown') {
    const remaining = Math.max(0, Math.min(5000, Number(state.countdownMs || 0)));
    const progress = 1 - remaining / 5000;
    count = Math.round(1 + (aviatorCrowdPeak - 1) * Math.pow(progress, 1.65));
  } else if (state.status === 'active') {
    const elapsed = Math.max(0, Date.now() - Number(state.startMs || Date.now()));
    const progress = Math.min(1, elapsed / 20000);
    count = Math.round(aviatorCrowdPeak - (aviatorCrowdPeak - 607) * progress);
  } else {
    count = Number(countEl.textContent) || 607;
  }
  countEl.textContent = count.toLocaleString('en-US');
}

async function pollCrashState() {
  if (crashPollBusy || !crashGameId) return;
  if (!$('#aviatorStage')) return;

  crashPollBusy = true;

  try {
    const requestStartedAt = Date.now();
    const state = await api('/crash/state',{
      gameId:crashGameId
    });
    const responseReceivedAt = Date.now();
    if (Number.isFinite(Number(state.serverNow))) {
      crashServerClockOffset = Number(state.serverNow) - (requestStartedAt + responseReceivedAt) / 2;
    }

    if (!$('#aviatorStage')) return;
    const multiplier = Number(state.multiplier || 1);
    const multi = $('#multi');
    const status = $('#crashStatus');
    const stage = $('#aviatorStage');
    crashPhase = state.status;
    updateAviatorCrowd(state);

    if (state.status === 'countdown') {
      const seconds = Math.max(0,Number(state.countdownMs || 0)/1000);

      stage.classList.remove('running','crashed');
      stage.classList.add('countdown');

      stopCrashVisualAnimation();
      crashVisualValue = 1;
      crashVisualStartMs = null;
      crashVisualCrashMultiplier = null;
      const resetPlane = $('#planeWrap');
      const resetGraph = $('#flightChart');
      if (resetPlane) {
        resetPlane.classList.remove('plane-hover','plane-approach','plane-crashed');
        resetPlane.style.left = '10%';        resetPlane.style.top = '70%';
      }
      if (resetGraph) resetGraph.classList.remove('graph-crashed');
      if (multi) multi.textContent = '1.00x';
      updateFlightGlow(1);

      updateFlightCurve(1);

      if (status) {
        status.textContent = `STARTING IN ${Math.ceil(seconds)}s`;
      }

      crashSlots.forEach((slot,i) => {
        if (slot.autoBet && !slot.roundId && !slot.busy && slot.lastAutoSessionId !== state.sessionId) {
          slot.lastAutoSessionId = state.sessionId;
          startCrash(i);
        }
        if (!slot.roundId && !slot.busy && slot.status !== 'ready') {
          slot.status = 'ready';
          updateSlotStatus(i,'READY');

          const result = $('#result'+i);
          if (result) result.textContent = 'নতুন রাউন্ডে বেট করতে পারবেন';
        }
      });

    } else if (state.status === 'active') {
      stage.classList.remove('countdown','crashed');
      stage.classList.add('running');

      crashVisualCrashMultiplier = Number(state.crashMultiplier) > 1
        ? Number(state.crashMultiplier)
        : null;
      setCrashVisualTarget(multiplier,state.startMs);
      const flyingPlane = $('#planeWrap');
      if (flyingPlane) flyingPlane.classList.remove('plane-crashed');

      if (status) status.textContent = 'FLYING';

      for (let i=0;i<crashSlots.length;i++) {
        const slot = crashSlots[i];

        if (
          slot.roundId &&
          slot.status === 'active' &&
          slot.auto &&
          !slot.busy &&
          multiplier >= Number(slot.autoTarget || 2)
        ) {
          cashout(i);
        }
      }

    } else {
      stage.classList.remove('running','countdown');
      stage.classList.add('crashed');

      stopCrashVisualAnimation();
      crashVisualStartMs = null;
      crashVisualValue = multiplier;
      if (multi) multi.textContent = multiplier.toFixed(2)+'x';
      updateFlightGlow(multiplier);
      updateFlightCurve(multiplier);
      updateCashoutAmounts(multiplier);

      if (status) status.textContent = 'CRASHED AT '+multiplier.toFixed(2)+'x';

      const wrap = $('#planeWrap');
      if (wrap) {
        wrap.classList.remove('plane-hover','plane-approach');
        wrap.classList.add('plane-crashed');
      }
      const disappearingGraph = $('#flightChart');
      if (disappearingGraph) disappearingGraph.classList.add('graph-crashed');

      const flash = $('#stageFlash');
      if (flash) flash.classList.add('show');
    }

    updateCrashHistory(state.previous || []);
    updateAllSlotButtons();

    for (let i=0;i<crashSlots.length;i++) {
      const slot = crashSlots[i];

      if (!slot.roundId || slot.busy) continue;

      if (slot.status === 'active') {
        try {
          const t = await api('/crash/tick',{
            roundId:slot.roundId
          });

          if (t.balance !== undefined && me) {
            me.balance = t.balance;
            const bal = $('#gameBalance');
            if (bal) bal.textContent = money(me.balance);
          }

          if (t.betStatus !== 'active') {
            slot.status = t.betStatus;
            slot.roundId = null;

            updateSlotStatus(
              i,
              t.betStatus === 'cashed_out' ? 'CASHED OUT' : 'CRASHED'
            );

            const result = $('#result'+i);

            if (result) {
              result.textContent = t.betStatus === 'cashed_out'
                ? `Cash Out: ${t.multiplier}x · পেআউট ${t.payout} ক্রেডিট`
                : 'ক্র্যাশ হয়েছে · পেআউট ০';
            }

            updateSlotButtons(i);
          }
        } catch (e) {
          console.error('Crash bet status error',e);
        }
      }
    }

  } catch (e) {
    console.error('Crash state error',e);
    const status = $('#crashStatus');
    if (status) status.textContent = 'RECONNECTING...';
  } finally {
    crashPollBusy = false;
  }
}

/* Smoothly interpolate between authoritative server multiplier snapshots. */
function stopCrashVisualAnimation() {
  if (crashVisualFrame !== null) cancelAnimationFrame(crashVisualFrame);
  crashVisualFrame = null;
  crashVisualSegment = null;
}

function setCrashVisualTarget(target,startMs) {
  if (Number.isFinite(Number(startMs))) crashVisualStartMs = Number(startMs);
  if (crashVisualStartMs === null) {
    crashVisualStartMs = Date.now()-Math.log(Math.max(1,Number(target)||1))*12000;
  }
  if (crashVisualFrame === null) {
    crashVisualFrame = requestAnimationFrame(renderCrashVisual);
  }
}

function updateFlightGlow(multiplier) {
  const stage = $('#aviatorStage');
  if (!stage) return;
  const value = Number(multiplier) || 1;
  let tier = 'base';
  let color = 'rgba(0,0,0,0)';
  let spread = 0.72;
  if (value >= 100) { tier = 'gold'; color = 'rgba(255,190,70,.30)'; spread = 1.65; }
  else if (value >= 50) { tier = 'pink'; color = 'rgba(225,90,190,.27)'; spread = 1.55; }
  else if (value >= 20) { tier = 'mint'; color = 'rgba(65,210,175,.26)'; spread = 1.48; }
  else if (value >= 10) { tier = 'orange'; color = 'rgba(255,155,65,.25)'; spread = 1.38; }
  else if (value >= 5) { tier = 'blue'; color = 'rgba(85,145,255,.24)'; spread = 1.28; }
  else if (value >= 3) { tier = 'red'; color = 'rgba(255,75,95,.23)'; spread = 1.12; }
  else if (value >= 2) { tier = 'violet'; color = 'rgba(170,105,255,.22)'; spread = .94; }

  // Update only when the multiplier enters a new color band; otherwise
  // repeated animation frames would keep restarting the CSS transition.
  if (stage.dataset.flightGlowTier === tier) return;
  stage.dataset.flightGlowTier = tier;
  stage.style.setProperty('--flight-glow-color', color);
  stage.style.setProperty('--flight-glow-spread', String(spread));
}

function renderCrashVisual(now) {
  if (!$('#aviatorStage') || crashVisualStartMs === null) {
    crashVisualFrame = null;
    return;
  }

  // Match the server's exponential flight curve continuously between polls.
  const elapsed = Math.max(0,Date.now()+crashServerClockOffset-crashVisualStartMs);
  const rawValue = Math.max(1,Math.exp(elapsed/12000));
  const value = crashVisualCrashMultiplier
    ? Math.min(rawValue,crashVisualCrashMultiplier)
    : rawValue;
  crashVisualValue = value;
  updateFlightGlow(value);

  const multi = $('#multi');
  if (multi) multi.textContent = value.toFixed(2)+'x';
  updateFlightCurve(value);
  updateCashoutAmounts(value);

  crashVisualFrame = requestAnimationFrame(renderCrashVisual);
}

function updateCashoutAmounts(multiplier) {
  for (let i=0;i<crashSlots.length;i++) {
    const slot = crashSlots[i];
    const button = $('#cashoutBtn'+i);
    const input = $('#crashBet'+i);
    if (!button || !slot.roundId || slot.status !== 'active') continue;
    const bet = Math.max(0,Number(input?.value || slot.betAmount || 0));
    const payout = Math.round(bet*Math.round(multiplier*100)/100*100)/100;
    button.innerHTML = 'Cash Out<br><b>BDT '+payout.toFixed(2)+'</b>';
  }
}

/* ==========================================
   FLIGHT GRAPH AND PLANE MOVEMENT
========================================== */

function updateFlightCurve(multiplier) {
  const path = $('#flightPath');
  const area = $('#flightArea');
  const dot = $('#flightDot');
  const wrap = $('#planeWrap');
  const trail = $('#planeTrail');

  if (!path || !dot || !wrap) return;

  // The plane and the graph endpoint share the exact same coordinates.
  // The plane reaches its reference stopping point gradually, then both hold.
  const elapsed = crashPhase === 'active' && crashVisualStartMs !== null
    ? Math.max(0,Date.now()+crashServerClockOffset-crashVisualStartMs)
    : 0;
  const progress = crashPhase === 'active'
    ? Math.max(0,Math.min(1,elapsed/4500))
    : 0;
  const x = 35 + 530*progress;
  // Gentle vertical bob; graph endpoint receives the identical offset.
  const bob = crashPhase === 'active' ? Math.sin(elapsed/520)*7 : 0;
  const y = 405 - 260*progress + bob;
  const c1x = 35 + (x-35)*0.34;
  const c2x = 35 + (x-35)*0.72;
  const c2y = y + (405-y)*0.16;
  const curve = `M35 405 C${c1x} 405 ${c2x} ${c2y} ${x} ${y}`;

  path.setAttribute('d',curve);
  area.setAttribute('d',curve+` L${x} 440 L35 440 Z`);
  dot.setAttribute('cx',x);
  dot.setAttribute('cy',y);

  // Anchor the graph tip to the aircraft's actual nose/propeller point,
  // not to the center of the plane wrapper. This keeps the red line attached
  // even while the aircraft bobs up and down.
  const stage = wrap.closest('.aviator-stage');
  const planeSvg = wrap.querySelector('svg');
  if (stage && planeSvg) {
    const stageWidth = stage.clientWidth;
    const stageHeight = stage.clientHeight;
    const planeRect = planeSvg.getBoundingClientRect();
    const tipX = (x/1000)*stageWidth;
    const tipY = (y/440)*stageHeight;
    // Account for SVG's default xMidYMid meet letterboxing. The aircraft
    // artwork is narrower than its CSS viewport on mobile; using the raw
    // viewport width creates a visible gap at the tail.
    const svgScale = Math.min(planeRect.width/340,planeRect.height/200);
    const artworkWidth = 340*svgScale;
    const artworkHeight = 200*svgScale;
    const artworkLeft = (planeRect.width-artworkWidth)/2;
    const artworkTop = (planeRect.height-artworkHeight)/2;
    // Rearmost tail point in the supplied aircraft artwork: (116,251).
    const rearOffsetX = artworkLeft+(116-110)*svgScale-planeRect.width/2;
    const rearOffsetY = artworkTop+(251-95)*svgScale-planeRect.height/2;
    const wrapperCenterX = tipX - rearOffsetX;
    const wrapperCenterY = tipY - rearOffsetY;
    wrap.style.left = (wrapperCenterX/stageWidth*100)+'%';
    wrap.style.top = (wrapperCenterY/stageHeight*100)+'%';
  }
  wrap.classList.remove('plane-hover','plane-approach');

  path.style.strokeDasharray = 'none';
  path.style.strokeDashoffset = '0';
  if (area) area.style.opacity = progress > 0 ? '.82' : '0';

  if (trail) {
    trail.style.left = (x/10)+'%';
    trail.style.top = (y/4.4)+'%';
    trail.style.opacity = progress > 0 ? '1' : '0';
  }

  const flash = $('#stageFlash');
  if (flash) flash.classList.remove('show');
}

/* ==========================================
   AUTO CASH OUT
========================================== */

function toggleAutoBet(index,enabled) {
  const slot = crashSlots[index];
  if (!slot) return;
  slot.autoBet = !!enabled;
  if (enabled) { slot.lastAutoSessionId = null; toast('Auto Bet চালু হয়েছে'); }
  else toast('Auto Bet বন্ধ করা হয়েছে');
  updateSlotButtons(index);
}

function toggleAuto(index,enabled) {
  const slot = crashSlots[index];
  const input = $('#autoTarget'+index);

  if (!slot) return;

  const target = Number(input?.value || 2);

  if (!Number.isFinite(target) || target < 1.01 || target > 1000) {
    toast('AUTO multiplier 1.01x থেকে 1000x এর মধ্যে দিন');

    const toggle = $('#autoToggle'+index);
    if (toggle) toggle.checked = false;

    slot.auto = false;
    return;
  }

  slot.autoTarget = target;
  slot.auto = !!enabled;

  updateSlotButtons(index);
}

async function cancelAuto(index) {
  const slot = crashSlots[index];
  if (!slot || slot.busy) return;

  if (slot.roundId && crashPhase === 'countdown') {
    slot.busy = true;
    updateSlotButtons(index);
    try {
      const r = await api('/crash/cancel',{ roundId:slot.roundId });
      slot.roundId = null;
      slot.status = 'cancelled';
      slot.auto = false;
      const betButton = $('#startCrash'+index);
      if (betButton) {
        betButton.classList.remove('is-bet-cancel');
        const amount = Math.max(0,Number($('#crashBet'+index)?.value || 0));
        betButton.innerHTML = 'Bet<br><b>BDT '+amount.toFixed(2)+'</b>';
      }
      if (r.balance !== undefined) {
        me.balance = r.balance;
        const bal = $('#gameBalance');
        if (bal) bal.textContent = money(me.balance);
      }
      updateSlotStatus(index,'BET CANCELLED');
      const result = $('#result'+index);
      if (result) result.textContent = 'বেট বাতিল হয়েছে';
      toast('বেট বাতিল হয়েছে');
    } catch (e) {
      toast(e.message || 'বেট বাতিল করা যায়নি');
    } finally {
      slot.busy = false;
      updateSlotButtons(index);
    }
    return;
  }

  slot.auto = false;
  const toggle = $('#autoToggle'+index);
  if (toggle) toggle.checked = false;
  updateSlotButtons(index);
  toast('Auto Cash Out বাতিল করা হয়েছে');
}

/* ==========================================
   PLACE BET
========================================== */

async function startCrash(index) {
  const slot = crashSlots[index];

  if (!slot || slot.busy) return;

  if (slot.roundId && crashPhase === 'countdown') {
    await cancelAuto(index);
    return;
  }
  if (slot.roundId) return;

  if (crashPhase !== 'countdown') {
    toast('শুধু কাউন্টডাউনের সময় বেট করা যাবে');
    updateSlotButtons(index);
    return;
  }

  const betInput = $('#crashBet'+index);
  const button = $('#startCrash'+index);
  const result = $('#result'+index);

  try {
    const bet = Number(betInput.value);

    if (!Number.isSafeInteger(bet) || bet < 1 || bet > 1000000) {
      throw Error('১ থেকে ১০,০০,০০০ এর মধ্যে পূর্ণসংখ্যার বেট দিন');
    }

    const targetInput = $('#autoTarget'+index);
    const target = Number(targetInput?.value || 2);

    if (!Number.isFinite(target) || target < 1.01 || target > 1000) {
      throw Error('AUTO multiplier 1.01x থেকে 1000x এর মধ্যে দিন');
    }
    slot.autoTarget = target;
    slot.busy = true;
    updateSlotButtons(index);    const r = await api('/crash/start',{
      gameId:crashGameId,
      betAmount:bet
    });

    slot.roundId = r.roundId;
    slot.betAmount = bet;
    slot.status = 'active';
    me.balance = r.balance;

    const bal = $('#gameBalance');
    if (bal) bal.textContent = money(me.balance);

    updateSlotStatus(index,'BET ACTIVE');

    if (result) {
      result.textContent = 'বেট সফল! প্লেন উড়লে Cash Out করতে পারবেন।';
    }  } catch (e) {
    const errorText = String(e?.message || '');
    const displayMessage = /পর্যাপ্ত ফ্রি কয়েন নেই|insufficient.*(coin|balance)|not enough.*(coin|balance)/i.test(errorText)
      ? 'পর্যাপ্ত ব্যালেন্স নেই'
      : errorText;
    toast(displayMessage);
    if (result) result.textContent = displayMessage;
  } finally {
    slot.busy = false;
    updateSlotButtons(index);
  }
}

/* ==========================================
   CASH OUT
========================================== */

function showAviatorCashoutPopup(message) {
  const previous = document.getElementById('aviatorCashoutPopup');
  if (previous) previous.remove();
  const popup = document.createElement('div');
  popup.id = 'aviatorCashoutPopup';
  popup.className = 'aviator-cashout-popup';
  popup.textContent = message;
  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'aviator-cashout-close';
  close.setAttribute('aria-label','Close');
  close.textContent = '×';
  close.onclick = () => {
    window.clearTimeout(window.aviatorCashoutPopupTimer);
    popup.classList.add('is-hiding');
    window.setTimeout(() => popup.remove(), 180);
  };
  popup.appendChild(close);
  document.body.appendChild(popup);
  window.clearTimeout(window.aviatorCashoutPopupTimer);
  window.aviatorCashoutPopupTimer = window.setTimeout(() => {
    popup.classList.add('is-hiding');
    window.setTimeout(() => popup.remove(), 180);
  }, 2000);
}

async function cashout(index) {
  const slot = crashSlots[index];

  if (!slot || !slot.roundId || slot.busy) return;

  if (crashPhase !== 'active') {
    toast('প্লেন ওড়া শুরু হলে Cash Out করতে পারবেন');
    return;
  }

  const roundId = slot.roundId;

  slot.busy = true;
  updateSlotButtons(index);

  try {
    const r = await api('/crash/cashout',{
      roundId
    });

    if (r.balance !== undefined) {
      me.balance = r.balance;

      const bal = $('#gameBalance');
      if (bal) bal.textContent = money(me.balance);
    }

    const betAmount = Number(slot.betAmount || $('#crashBet'+index)?.value || 0);
    const payoutAmount = Number(r.payout || 0);
    const profitAmount = payoutAmount - betAmount;
    slot.roundId = null;
    slot.status = r.status;
    slot.auto = false;

    updateSlotStatus(
      index,
      r.status === 'cashed_out' ? 'CASHED OUT' : 'CRASHED'
    );

    const result = $('#result'+index);

    if (result) {
      result.textContent = r.status === 'cashed_out' ? 'Cash Out সফল হয়েছে' : 'Cash Out-এর আগেই ক্র্যাশ হয়েছে।';
    }
    if (r.status === 'cashed_out') {
      showAviatorCashoutPopup(
        `${Number(r.multiplier).toFixed(2)}x  ·  WIN BDT ${payoutAmount.toFixed(2)}`
      );
    }

  } catch (e) {
    toast(e.message);
  } finally {
    slot.busy = false;
    updateSlotButtons(index);
  }
}

/* ==========================================
   SUPER ACE
========================================== */

function renderSuperAceCards(randomize = false) {
  const faces = [
    {rank:'A',symbol:'♠',kind:'ace'},
    {rank:'K',symbol:'♛',kind:'king'},
    {rank:'Q',symbol:'♛',kind:'queen'},
    {rank:'J',symbol:'♞',kind:'jack'},
    {rank:'',symbol:'♠',kind:'spade'}
  ];
  return Array.from({length:20},(_,i) => {
    const item = randomize
      ? {rank:['A','K','Q','J','10'][Math.floor(Math.random()*5)],symbol:['♠','♥','♦','♣'][Math.floor(Math.random()*4)],kind:'random'}
      : faces[i%5];
    return `<div class="sa-card sa-${item.kind}">
      ${item.rank ? `<span class="sa-rank">${item.rank}</span>` : ''}
      <span class="sa-art">${item.symbol}</span>
    </div>`;
  }).join('');
}

function superAce(g) {
  stopCrashMonitor();
  shell(`
    <div class="superace-host">
      <iframe id="superAceFrame" class="superace-frame" title="Super Ace" src="/superace.html?gameId=${encodeURIComponent(g.id)}"></iframe>
    </div>
  `);
}
/* MOBILE BROWSER BACK NAVIGATION */
(function setupTk777BackNavigation() {
  const originalHome = home;
  const originalPage = page;
  const originalOpenGame = openGame;
  const originalShowAuth = showAuth;
  let routes = [{type:'home'}];
  let restoring = false;
  let firstHomeRender = true;
  let nestedNavigation = 0;

  try {
    history.replaceState({tk777App:true,tk777Index:0}, '', location.href);
  } catch (_) {}

  function pushRoute(route) {
    if (restoring || nestedNavigation) return;
    routes.push(route);
    try {
      history.pushState({tk777App:true,tk777Index:routes.length-1}, '', location.href);
    } catch (_) {}
  }

  home = function() {
    if (firstHomeRender) firstHomeRender = false;
    else pushRoute({type:'home'});
    nestedNavigation++;
    try { return originalHome.apply(this, arguments); }
    finally { nestedNavigation--; }
  };

  page = function(name) {
    pushRoute({type:'page',name});
    nestedNavigation++;
    try { return originalPage.apply(this, arguments); }
    finally { nestedNavigation--; }
  };

  openGame = function(id) {
    const game = games.find(x => x.id === id);
    if (!game) return;
    pushRoute(me ? {type:'game',id} : {type:'auth'});
    nestedNavigation++;
    try { return originalOpenGame.apply(this, arguments); }
    finally { nestedNavigation--; }
  };

  showAuth = function() {
    pushRoute({type:'auth'});
    nestedNavigation++;
    try { return originalShowAuth.apply(this, arguments); }
    finally { nestedNavigation--; }
  };

  window.addEventListener('popstate', function(event) {
    if (!routes.length) routes = [{type:'home'}];
    if (routes.length > 1) routes.pop();
    const route = routes[routes.length-1] || {type:'home'};
    restoring = true;
    try {
      if (route.type === 'page') originalPage(route.name);
      else if (route.type === 'game') originalOpenGame(route.id);
      else if (route.type === 'auth') originalShowAuth();
      else originalHome();
    } finally {
      restoring = false;
    }
    if (!event.state || !event.state.tk777App) {
      try { history.pushState({tk777App:true,tk777Index:routes.length-1}, '', location.href); } catch (_) {}
    }
  });
})();
 
/* START APPLICATION */
init();