
document.addEventListener('input', event => {
  if (event.target && event.target.id === 'leftAmount') {
    setTimeout(moneyInsertDashboard, 0);
  }
});
document.addEventListener('click', event => {
  if (event.target.closest('.tabs, .paid-toggle, [data-paid-row], #reloadBarBtn')) {
    setTimeout(moneyWireSmartFeatures, 500);
  }
});





(function(){
  try {
    localStorage.setItem('money-pwa-version', 'v2-hotfix');
  } catch(e){}

  function addV2Classes(){
    document.body.classList.add('money-v2-active');

    document.querySelectorAll(
      '.summary-card,.balance-card,.money-mini-analytics,.money-insights-card,.money-chart-card,.money-upcoming-card,.money-bills-section'
    ).forEach(el=>{
      el.classList.add('money-card');
    });
  }

  function splash(){
    if(document.getElementById('moneyV2ForceSplash')) return;

    const el=document.createElement('div');
    el.id='moneyV2ForceSplash';

    el.style.cssText='position:fixed;inset:0;z-index:999999;display:grid;place-items:center;background:linear-gradient(180deg,#f3f6fb,#eef3f9);transition:opacity .45s ease;';

    el.innerHTML='<div style="display:grid;gap:12px;place-items:center;text-align:center;font-family:-apple-system,BlinkMacSystemFont,Inter,sans-serif;"><div style="width:68px;height:68px;border-radius:24px;display:grid;place-items:center;font-size:30px;font-weight:900;background:rgba(255,255,255,.78);backdrop-filter:blur(24px);box-shadow:0 18px 48px rgba(15,23,42,.12);">£</div><div style="font-size:13px;font-weight:800;color:#6b7280;">Money v2 loading…</div></div>';

    document.body.appendChild(el);

    setTimeout(()=>el.style.opacity='0',850);
    setTimeout(()=>el.remove(),1450);
  }

  document.addEventListener('DOMContentLoaded', ()=>{
    splash();
    addV2Classes();

    setTimeout(addV2Classes,600);
    setTimeout(addV2Classes,1600);
  });
})();



// Money PWA Version 2 visual layer
window.MONEY_PWA_VERSION = "v2-20260513-101855";

function moneyV2Splash() {
  if (document.getElementById('moneyV2Splash')) return;

  const splash = document.createElement('div');
  splash.id = 'moneyV2Splash';
  splash.className = 'money-v2-splash';
  splash.innerHTML = `
    <div class="money-v2-splash-inner">
      <div class="money-v2-logo">£</div>
      <div class="money-v2-loading-text">Syncing your month…</div>
    </div>
  `;
  document.body.appendChild(splash);

  setTimeout(() => splash.classList.add('hide'), 900);
  setTimeout(() => splash.remove(), 1500);
}

function moneyV2ApplyClasses() {
  document.querySelectorAll('.summary-card, .card.summary, .balance-card, .money-mini-analytics, .money-insights-card, .money-chart-card, .money-upcoming-card, .money-bills-section').forEach(el => {
    el.classList.add('money-card', 'fade-in');
  });

  document.querySelectorAll('.bill-card, .item-card, .row-card, article[class*="bill"]').forEach(el => {
    el.classList.add('fade-in');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  moneyV2Splash();
  moneyV2ApplyClasses();
  setTimeout(moneyV2ApplyClasses, 700);
  setTimeout(moneyV2ApplyClasses, 1600);
});

document.addEventListener('click', event => {
  if (event.target.closest('#reloadBarBtn, .paid-toggle, [data-paid-row], #moneyBillsSectionHeader')) {
    setTimeout(moneyV2ApplyClasses, 300);
  }
}, true);



// Gold Master version marker
window.MONEY_PWA_VERSION = "gold-master-20260513-100120";



// Compatibility shim: search was removed visually, but older code still references searchBills.
var searchBills = window.searchBills || document.getElementById('searchBills') || null;

function moneyEnsureHiddenSearchShim() {
  if (!window.searchBills && !document.getElementById('searchBills')) {
    const input = document.createElement('input');
    input.id = 'searchBills';
    input.type = 'search';
    input.value = '';
    input.setAttribute('aria-hidden', 'true');
    input.tabIndex = -1;
    input.style.display = 'none';
    document.body.appendChild(input);
    window.searchBills = input;
    searchBills = input;
  } else {
    window.searchBills = document.getElementById('searchBills') || window.searchBills || searchBills;
    searchBills = window.searchBills;
  }
}

moneyEnsureHiddenSearchShim();
document.addEventListener('DOMContentLoaded', moneyEnsureHiddenSearchShim);

window.addEventListener('error', function(event) {
  const content = document.getElementById('content');
  if (content && content.innerHTML.includes('Fetching your spreadsheet')) {
    wireSortPills(table);
  content.innerHTML = `<div class="error"><strong>App error:</strong><br>${String(event.message || 'Unknown error')}</div>`;
  }
});
window.addEventListener('unhandledrejection', function(event) {
  const content = document.getElementById('content');
  const msg = event.reason && event.reason.message ? event.reason.message : event.reason;
  if (content && content.innerHTML.includes('Fetching your spreadsheet')) {
    content.innerHTML = `<div class="error"><strong>Load error:</strong><br>${String(msg || 'Unknown error')}</div>`;
  }
});

const DEFAULT_CLIENT_ID = '493978666690-351guk042764k40or99hppe1ehcb13aq.apps.googleusercontent.com';
const DEFAULT_FILE_ID='1kMyQoPLnKHq6nTMpVjpM5RbyHlt495DIWmIk1wpnUXw';
const SCOPE = 'https://www.googleapis.com/auth/spreadsheets';
const MONTH_NAMES=['January','February','March','April','May','June','July','August','September','October','November','December'];
const MONTH_SHORT=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
let CACHED_TABLES=[], TOKEN_CLIENT=null, CURRENT_SORT=localStorage.getItem('ms.sort')||'unpaid';
function getConfig(){return{clientId:localStorage.getItem('ms.clientId')||DEFAULT_CLIENT_ID,fileId:localStorage.getItem('ms.fileId')||DEFAULT_FILE_ID}}
function parseMoney(s){const n=parseFloat(String(s??'').replace(/[£$,\s]/g,''));return isNaN(n)?0:n}
function fmtMoney(n){return '£'+Number(n||0).toLocaleString('en-GB',{minimumFractionDigits:2,maximumFractionDigits:2})}
function escapeHtml(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function normalize(s){return String(s??'').trim().toLowerCase()}
function getToken(){try{const t=JSON.parse(localStorage.getItem('ms.token')||'null');return t&&Date.now()<t.expiry-60000?t.token:null}catch(e){return null}}
function setToken(token,expiresInSec){localStorage.setItem('ms.token',JSON.stringify({token,expiry:Date.now()+(expiresInSec||3600)*1000}))}
function clearToken(){localStorage.removeItem('ms.token')}
function colLetter(n){let s='';n++;while(n>0){let m=(n-1)%26;s=String.fromCharCode(65+m)+s;n=Math.floor((n-m)/26)}return s}
function initTokenClient(){const {clientId}=getConfig();if(!clientId||!window.google?.accounts?.oauth2)return null;TOKEN_CLIENT=google.accounts.oauth2.initTokenClient({client_id:clientId,scope:SCOPE,callback:r=>{if(r?.access_token){setToken(r.access_token,r.expires_in);showApp();loadSpreadsheet()}else showSignInError(r?.error_description||r?.error||'Google sign-in failed')}});return TOKEN_CLIENT}
function requestSignIn(silent=false){const c=TOKEN_CLIENT||initTokenClient();if(!c){showSignInError('Set your Google OAuth Client ID in Settings first.');return}c.requestAccessToken(silent?{prompt:''}:{prompt:'consent'})}
async function sheetsRequest(url,opts={}){const token=getToken();if(!token)throw new Error('Not signed in');const res=await fetch(url,{cache:'no-store',...opts,headers:{Authorization:'Bearer '+token,'Content-Type':'application/json','Cache-Control':'no-cache',...(opts.headers||{})}});if(res.status===401){clearToken();throw new Error('Session expired — sign in again.')}if(!res.ok)throw new Error(`Sheets API ${res.status}: ${(await res.text()).slice(0,220)}`);return res.status===204?{}:res.json()}
async function fetchSheet(){const {fileId}=getConfig();const range=encodeURIComponent('A1:ZZ2000');const url=`https://sheets.googleapis.com/v4/spreadsheets/${fileId}/values/${range}?valueRenderOption=FORMATTED_VALUE&dateTimeRenderOption=FORMATTED_STRING`;return (await sheetsRequest(url,{method:'GET'})).values||[]}
async function updateValues(range,values){const {fileId}=getConfig();const url=`https://sheets.googleapis.com/v4/spreadsheets/${fileId}/values/${encodeURIComponent(range)}?valueInputOption=USER_ENTERED`;return sheetsRequest(url,{method:'PUT',body:JSON.stringify({range,majorDimension:'ROWS',values})})}
function parseTablesFromGrid(grid){const tables=[];for(let r=0;r<grid.length;r++){const row=grid[r]||[];for(let c=0;c<=row.length-3;c++){if(normalize(row[c])==='date due'&&normalize(row[c+1])==='due'&&normalize(row[c+2])==='paid'){const labelCol=c-1;if(labelCol<0)continue;const label=String(row[labelCol]||'').trim();if(!label||normalize(label)==='date due')continue;const rows=[];let blanks=0;for(let dr=r+1;dr<grid.length;dr++){const drow=grid[dr]||[];const name=String(drow[labelCol]||'').trim();if(!name){blanks++;if(blanks>=2)break;continue}blanks=0;rows.push({name,dueDate:String(drow[c]??'').trim(),due:parseMoney(drow[c+1]),paid:parseMoney(drow[c+2]),sheetRow:dr+1,labelCol,dateCol:c,dueCol:c+1,paidCol:c+2})}if(rows.length)tables.push({label,headerRow:r+1,labelCol,dateCol:c,dueCol:c+1,paidCol:c+2,rows})}}}return tables}
function isRowPaid(r){return r.due<=0||r.paid===0}function outstandingAmount(r){return r.due<=0?0:r.paid}function effectivePaidAmount(r){return r.due<=0?0:(r.paid===0?r.due:0)}function defaultEndDate(){const n=new Date();const last=new Date(n.getFullYear(),n.getMonth()+1,0);return `${last.getFullYear()}-${String(last.getMonth()+1).padStart(2,'0')}-${String(last.getDate()).padStart(2,'0')}`}function todayISO(){const n=new Date();return `${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,'0')}-${String(n.getDate()).padStart(2,'0')}`}function daysBetween(a,b){return Math.max(1,Math.floor((new Date(b+'T00:00:00')-new Date(a+'T00:00:00'))/86400000)-1)}
function pickBestTable(tables){const now=new Date(),full=MONTH_NAMES[now.getMonth()].toLowerCase(),short=MONTH_SHORT[now.getMonth()].toLowerCase();const found=tables.findIndex(t=>normalize(t.label).includes(full)||normalize(t.label).includes(short));return found>=0?found:0}
function showApp(){
  const signInEl = document.getElementById('signin');
  const appEl = document.getElementById('app');
  const navEl = document.getElementById('bottomNav');
  if (signInEl) signInEl.style.display='none';
  if (appEl) appEl.style.display='';
  if (navEl) navEl.style.display='grid';
}
function showSignIn(){
  const appEl = document.getElementById('app');
  const signInEl = document.getElementById('signin');
  const navEl = document.getElementById('bottomNav');
  if (appEl) appEl.style.display='none';
  if (navEl) navEl.style.display='none';
  if (signInEl) signInEl.style.display='';
  signinBtn.disabled=!getConfig().clientId;
  signinBtn.textContent=signinBtn.disabled?'Set Client ID in Settings':'Sign in with Google';
}
function showSignInError(msg){showSignIn();document.querySelector('#signin p').textContent=msg}
function leftKey(table){return 'ms.left:'+table.label.toLowerCase().replace(/[^a-z0-9]/g,'')}function getLeft(table){try{return JSON.parse(localStorage.getItem(leftKey(table))||'null')||{amount:1096,endDate:defaultEndDate()}}catch(e){return{amount:1096,endDate:defaultEndDate()}}}function setLeft(table,data){localStorage.setItem(leftKey(table),JSON.stringify(data))}
function render(){if(!CACHED_TABLES.length){content.innerHTML='<div class="empty">No month tables found in your spreadsheet.</div>';return}monthPicker.innerHTML='';CACHED_TABLES.forEach((t,i)=>{const o=document.createElement('option');o.value=i;o.textContent=(t.label||'Month').slice(0,3);monthPicker.appendChild(o)});let initial=localStorage.getItem('ms.selected');if(initial===null||!CACHED_TABLES[initial])initial=pickBestTable(CACHED_TABLES);monthPicker.value=initial;monthPicker.style.display='block';monthPicker.onchange=()=>{localStorage.setItem('ms.selected',monthPicker.value);renderMonth(CACHED_TABLES[monthPicker.value])};renderMonth(CACHED_TABLES[initial])}
function sortRows(rows){const arr=[...rows];if(CURRENT_SORT==='paid')arr.sort((a,b)=>(isRowPaid(b)?1:0)-(isRowPaid(a)?1:0));else if(CURRENT_SORT==='amount')arr.sort((a,b)=>(b.due||0)-(a.due||0));else if(CURRENT_SORT==='date')arr.sort((a,b)=>(parseInt(a.dueDate)||99)-(parseInt(b.dueDate)||99));else arr.sort((a,b)=>{const ap=isRowPaid(a),bp=isRowPaid(b);if(ap!==bp)return ap?1:-1;return(parseInt(a.dueDate)||99)-(parseInt(b.dueDate)||99)});return arr}
function renderMonth(table){const q=(searchBills.value||'').trim().toLowerCase();const rows=sortRows(table.rows).filter(r=>!q||r.name.toLowerCase().includes(q));const totalPaid=table.rows.reduce((s,r)=>s+effectivePaidAmount(r),0), outstanding=table.rows.reduce((s,r)=>s+outstandingAmount(r),0);const paidCount=table.rows.filter(isRowPaid).length, unpaidCount=table.rows.filter(r=>!isRowPaid(r)).length;const stored=getLeft(table);let days=daysBetween(todayISO(),stored.endDate||defaultEndDate());let spendable=(parseFloat(stored.amount)||0)-outstanding;let perDay=spendable/days;subtitle.textContent=`${table.label} · refreshed ${new Date().toLocaleString('en-GB',{hour:'2-digit',minute:'2-digit'})}`;content.innerHTML=`<div class="tabs"><button class="tab active" data-sort="unpaid">Unpaid <span class="badge">${unpaidCount}</span></button><button class="tab" data-sort="paid">Paid <span class="badge">${paidCount}</span></button></div><section class="summary-grid"><div class="summary-card"><div class="card-label">Outstanding</div><div class="card-value">${fmtMoney(outstanding)}</div><div class="card-meta">Still to pay</div></div><div class="summary-card"><div class="card-label">Paid so far</div><div class="card-value">${fmtMoney(totalPaid)}</div><div class="card-meta">Already covered</div></div><div class="summary-card wide"><div class="card-label">Money left per day</div><div class="card-value">${fmtMoney(perDay)}</div><div class="card-meta">${days} day${days===1?'':'s'} left · ${fmtMoney(stored.amount)} − ${fmtMoney(outstanding)} = ${fmtMoney(spendable)}</div><div class="money-form"><input  value="${Number(stored.amount||0).toFixed(2)}" data-money="leftAmount" data-money="whole" data-money="decimal" id="leftAmount" type="text" inputmode="decimal" autocomplete="off" placeholder="0.00"><input id="leftUntil" type="date" value="${stored.endDate||defaultEndDate()}"></div></div></section><div class="sort-row"><div class="section-title">Bills</div><div class="sort-pill-row" id="sortBills">
      <button type="button" class="sort-pill unpaid-sort" data-sort="unpaid">Unpaid</button>
      <button type="button" class="sort-pill paid-sort" data-sort="paid">Paid</button>
      <button type="button" class="sort-pill date-sort" data-sort="dateAsc">Due ↑</button>
      <button type="button" class="sort-pill date-sort" data-sort="dateDesc">Due ↓</button>
    </div></div><section class="bill-list">${rows.map(r=>{const paid=isRowPaid(r);return `<article class="bill-card ${paid?'paid':'unpaid'}"><div class="bill-icon brand-icon">£</div><div><div class="bill-name">${escapeHtml(r.name)}</div><div class="bill-meta">Due ${escapeHtml(r.dueDate||'—')}</div></div><div class="bill-right"><div class="bill-amount">${fmtMoney(r.due)}</div><button class="status-pill ${paid?'pill-paid':'pill-due'}" data-paid-row="${r.sheetRow}">${paid?'Paid':'Outstanding'}</button></div></article>`}).join('')}</section>`;sortBills.value=CURRENT_SORT;sortBills.onchange=()=>{CURRENT_SORT=sortBills.value;localStorage.setItem('ms.sort',CURRENT_SORT);renderMonth(table)};document.querySelectorAll('[data-sort]').forEach(b=>b.onclick=()=>{CURRENT_SORT=b.dataset.sort;localStorage.setItem('ms.sort',CURRENT_SORT);renderMonth(table)});document.querySelectorAll('[data-row]').forEach(b=>b.onclick=()=>togglePaid(b.dataset.row));leftAmount.oninput=()=>{setLeft(table,{amount:parseFloat(leftAmount.value)||0,endDate:leftUntil.value||defaultEndDate()});renderMonth(table)};leftUntil.onchange=()=>{setLeft(table,{amount:parseFloat(leftAmount.value)||0,endDate:leftUntil.value||defaultEndDate()});renderMonth(table)}}
async function togglePaid(sheetRow){const table=CACHED_TABLES[monthPicker.value]||CACHED_TABLES[0];const row=table.rows.find(r=>String(r.sheetRow)===String(sheetRow));if(!row)return;await updateValues(`${colLetter(row.paidCol)}${row.sheetRow}`,[[isRowPaid(row)?row.due:0]]);await loadSpreadsheet()}
async function appendBill(){const table=CACHED_TABLES[monthPicker.value]||CACHED_TABLES[0];if(!table)return;const name=newName.value.trim(),dueDate=newDueDate.value.trim(),amount=parseMoney(newAmount.value);if(!name||!amount)return;const row=Math.max(...table.rows.map(r=>r.sheetRow||0))+1;await updateValues(`${colLetter(table.labelCol)}${row}:${colLetter(table.paidCol)}${row}`,[[name,dueDate,amount,amount]]);closeAdd();await loadSpreadsheet()}
async function loadSpreadsheet(){content.innerHTML='<div class="spinner">Fetching your spreadsheet…</div>';try{CACHED_TABLES=parseTablesFromGrid(await fetchSheet());render();setTimeout(msWireLeftAmountUpdate,50)}catch(e){if(String(e.message).toLowerCase().includes('sign')){showSignIn();return}content.innerHTML=`<div class="error"><strong>Couldn’t load spreadsheet:</strong><br>${escapeHtml(e.message||e)}</div>`}}
function openConfig(){const c=getConfig();cfgClientId.value=c.clientId;cfgFileId.value=c.fileId;configModal.classList.add('open')}function closeConfig(){configModal.classList.remove('open')}function openAdd(){newName.value='';newDueDate.value='';newAmount.value='';addModal.classList.add('open')}function closeAdd(){addModal.classList.remove('open')}function applyTheme(t){document.documentElement.dataset.theme=t;localStorage.setItem('ms.theme',t);themeBtn.textContent=t==='dark'?'☀':'☾'}
themeBtn.onclick=()=>applyTheme((document.documentElement.dataset.theme||'light')==='dark'?'light':'dark');applyTheme(localStorage.getItem('ms.theme')||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'));settingsBtn.onclick=openConfig;settingsBtnSignin.onclick=openConfig;settingsNav.onclick=openConfig;refreshBtn.onclick=loadSpreadsheet;refreshNav.onclick=loadSpreadsheet;/* addFab removed */addCancel.onclick=closeAdd;addSave.onclick=appendBill;signinBtn.onclick=()=>requestSignIn(false);searchBills.oninput=()=>{if(CACHED_TABLES.length)renderMonth(CACHED_TABLES[monthPicker.value]||CACHED_TABLES[0])};cfgCancel.onclick=closeConfig;cfgSave.onclick=()=>{cfgClientId.value.trim()?localStorage.setItem('ms.clientId',cfgClientId.value.trim()):localStorage.removeItem('ms.clientId');cfgFileId.value.trim()?localStorage.setItem('ms.fileId',cfgFileId.value.trim()):localStorage.removeItem('ms.fileId');TOKEN_CLIENT=null;clearToken();closeConfig();start()};
function waitForGoogle(timeout=10000){return new Promise((res,rej)=>{const t=Date.now();(function tick(){if(window.google?.accounts?.oauth2)return res();if(Date.now()-t>timeout)return rej(new Error('Google sign-in script failed to load'));setTimeout(tick,100)})()})}function start(){const c=getConfig();if(!c.clientId||!c.fileId){showSignIn();return}if(getToken()){showApp();loadSpreadsheet(); setTimeout(msAfterRenderLeftC4Strong,500);return}waitForGoogle().then(()=>{initTokenClient();showSignIn();requestSignIn(true)}).catch(()=>showSignIn())}
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&getToken())loadSpreadsheet()});setInterval(()=>{if(getToken()&&document.visibilityState==='visible')loadSpreadsheet()},120000);if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('service-worker.js?v=20260512-153350').catch(()=>{}));

function wireSortPills(table) {
  const wrap = document.getElementById('sortBills');
  if (!wrap) return;

  wrap.querySelectorAll('.sort-pill').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.sort === CURRENT_SORT);
    btn.onclick = () => {
      CURRENT_SORT = btn.dataset.sort;
      try { localStorage.setItem('ms.sort', CURRENT_SORT); } catch(e) {}
      renderMonth(table);
    };
  });
}

function wireBottomBarActions() {
  const add = document.getElementById('addItemBarBtn');
  const reload = document.getElementById('reloadBarBtn');
    if (add && !add.dataset.wired) {
    add.dataset.wired = '1';
    add.onclick = (event) => { event.preventDefault(); msOpenAddItemModal(); };
  }
  if (reload && !reload.dataset.wired) {
    reload.dataset.wired = '1';
    reload.onclick = () => loadSpreadsheet();
  }
  }


// Verified paid/outstanding write-back handler
function msColLetter(n) {
  let s = '';
  n++;
  while (n > 0) {
    const m = (n - 1) % 26;
    s = String.fromCharCode(65 + m) + s;
    n = Math.floor((n - m) / 26);
  }
  return s;
}

async function msSheetsUpdate(range, values) {
  const { fileId } = getConfig();
  const token = getToken();
  if (!token) throw new Error('Not signed in');
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${fileId}/values/${encodeURIComponent(range)}?valueInputOption=USER_ENTERED`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ range, majorDimension: 'ROWS', values })
  });
  if (res.status === 401) {
    clearToken();
    throw new Error('Session expired — sign in again.');
  }
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Sheets API ${res.status}: ${text.slice(0, 220)}`);
  }
  return res.json();
}

async function msTogglePaid(sheetRow) {
  try {
    const picker = document.getElementById('monthPicker');
    const tableIndex = picker && picker.value !== '' ? picker.value : 0;
    const table = CACHED_TABLES[tableIndex] || CACHED_TABLES[0];
    if (!table) throw new Error('No selected month table loaded.');

    const row = table.rows.find(r => String(r.sheetRow) === String(sheetRow));
    if (!row) throw new Error('Could not find that bill row. Refresh and try again.');
    if (row.paidCol == null || row.sheetRow == null) throw new Error('This row is missing spreadsheet coordinates.');

    // Sheet convention: Paid column is actually outstanding.
    // 0 = paid, full due amount = outstanding.
    const nextOutstanding = isRowPaid(row) ? row.due : 0;
    const range = `${msColLetter(row.paidCol)}${row.sheetRow}`;

    const btn = document.querySelector(`[data-paid-row="${sheetRow}"], [data-row="${sheetRow}"]`);
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Saving…';
    }

    await msSheetsUpdate(range, [[nextOutstanding]]);
    await loadSpreadsheet();
  } catch (err) {
    alert('Could not update paid status: ' + (err.message || err));
    try { await loadSpreadsheet(); } catch(e) {}
  }
}

document.addEventListener('click', function(event) {
  const btn = event.target.closest('[data-paid-row], .paid-toggle');
  if (!btn) return;
  const rowId = btn.dataset.paidRow || btn.dataset.row;
  if (!rowId) return;
  event.preventDefault();
  event.stopPropagation();
  msTogglePaid(rowId);
});


function wireCleanBottomBar() {
  const addBtn = document.getElementById('addItemBarBtn');
  const refreshBtn = document.getElementById('reloadBarBtn');
  if (addBtn && !addBtn.dataset.wired) {
    addBtn.dataset.wired = '1';
    addBtn.onclick = (event) => { event.preventDefault(); msOpenAddItemModal(); };
  }
  if (refreshBtn && !refreshBtn.dataset.wired) {
    refreshBtn.dataset.wired = '1';
    refreshBtn.onclick = () => loadSpreadsheet();
  }
}


// Safe modal closing: Esc key, backdrop tap, and Cancel buttons.
// This does not alter the app shell or modal markup.
function closeAnyOpenModalSafe() {
  document.querySelectorAll('.config-modal.open, .modal.open').forEach(function(modal) {
    modal.classList.remove('open');
  });
}

document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') closeAnyOpenModalSafe();
});

document.addEventListener('click', function(event) {
  const modal = event.target.closest('.config-modal.open, .modal.open');
  if (modal && event.target === modal) {
    closeAnyOpenModalSafe();
  }
});


function msOpenAddItemModal() {
  const existingFns = ['openAddBill', 'openAdd'];
  for (const fn of existingFns) {
    if (typeof window[fn] === 'function') {
      try { window[fn](); return; } catch(e) {}
    }
  }
  const modal = document.getElementById('msAddItemModal');
  if (!modal) return;
  const name = document.getElementById('msNewItemName');
  const date = document.getElementById('msNewItemDate');
  const amount = document.getElementById('msNewItemAmount');
  if (name) name.value = '';
  if (date) date.value = '';
  if (amount) amount.value = '';
  modal.classList.add('open');
}

function msCloseAddItemModal() {
  const modal = document.getElementById('msAddItemModal');
  if (modal) modal.classList.remove('open');
}

function msColumnLetter(n) {
  let s = '';
  n++;
  while (n > 0) {
    const m = (n - 1) % 26;
    s = String.fromCharCode(65 + m) + s;
    n = Math.floor((n - m) / 26);
  }
  return s;
}

async function msPutValues(range, values) {
  if (typeof updateValues === 'function') {
    return updateValues(range, values);
  }
  const { fileId } = getConfig();
  const token = getToken();
  if (!token) throw new Error('Not signed in');
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${fileId}/values/${encodeURIComponent(range)}?valueInputOption=USER_ENTERED`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ range, majorDimension: 'ROWS', values })
  });
  if (res.status === 401) {
    clearToken();
    throw new Error('Session expired — sign in again.');
  }
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Sheets API ${res.status}: ${text.slice(0, 220)}`);
  }
  return res.json();
}

async function msSaveNewItem() {
  const table = CACHED_TABLES[document.getElementById('monthPicker')?.value || 0] || CACHED_TABLES[0];
  if (!table) {
    alert('No month table loaded yet. Tap Refresh and try again.');
    return;
  }

  const name = document.getElementById('msNewItemName')?.value.trim();
  const dueDate = document.getElementById('msNewItemDate')?.value.trim();
  const amount = parseMoney(document.getElementById('msNewItemAmount')?.value || '0');

  if (!name) {
    alert('Please enter an item name.');
    return;
  }
  if (!amount || amount <= 0) {
    alert('Please enter an amount.');
    return;
  }

  const saveBtn = document.getElementById('msAddItemSave');
  try {
    if (saveBtn) {
      saveBtn.disabled = true;
      saveBtn.textContent = 'Adding…';
    }
    const nextRow = Math.max(...table.rows.map(r => r.sheetRow || 0)) + 1;
    const labelCol = table.labelCol ?? table.rows[0]?.labelCol ?? 0;
    const paidCol = table.paidCol ?? table.rows[0]?.paidCol ?? 3;
    const range = `${msColumnLetter(labelCol)}${nextRow}:${msColumnLetter(paidCol)}${nextRow}`;
    await msPutValues(range, [[name, dueDate, amount, amount]]);
    msCloseAddItemModal();
    await loadSpreadsheet();
  } catch (err) {
    alert('Could not add item: ' + (err.message || err));
  } finally {
    if (saveBtn) {
      saveBtn.disabled = false;
      saveBtn.textContent = 'Add';
    }
  }
}

function msWireAddButton() {
  const addBtn = document.getElementById('addItemBarBtn') || document.getElementById('addBtn') || document.getElementById('addItemBtn');
  if (addBtn) {
    addBtn.onclick = function(event) {
      event.preventDefault();
      event.stopPropagation();
      msOpenAddItemModal();
    };
  }

  const cancel = document.getElementById('msAddItemCancel');
  if (cancel) cancel.onclick = msCloseAddItemModal;

  const save = document.getElementById('msAddItemSave');
  if (save) save.onclick = msSaveNewItem;

  const modal = document.getElementById('msAddItemModal');
  if (modal && !modal.dataset.backdropWired) {
    modal.dataset.backdropWired = '1';
    modal.addEventListener('click', function(event) {
      if (event.target === modal) msCloseAddItemModal();
    });
  }
}


function msFixAmountInputs() {
  document.querySelectorAll('#leftAmount, #msNewItemAmount, #newAmount, #newBillAmount, input[name="amount"], input[data-money]').forEach(function(el) {
    el.removeAttribute('max');
    el.removeAttribute('maxlength');
    el.removeAttribute('pattern');
    el.setAttribute('inputmode', 'decimal');
    el.setAttribute('autocomplete', 'off');
    if (el.id === 'leftAmount') {
      el.setAttribute('type', 'text');
    }
  });
}

document.addEventListener('DOMContentLoaded', msFixAmountInputs);
document.addEventListener('focusin', function(event) {
  if (event.target && event.target.matches('#leftAmount, #msNewItemAmount, #newAmount, #newBillAmount, input[name="amount"], input[data-money]')) {
    msFixAmountInputs();
  }
});


function msFixLeftAmountField() {
  const leftAmount = document.getElementById('leftAmount');
  if (!leftAmount) return;

  leftAmount.removeAttribute('max');
  leftAmount.removeAttribute('maxlength');
  leftAmount.removeAttribute('pattern');
  leftAmount.removeAttribute('min');
  leftAmount.removeAttribute('step');

  leftAmount.type = 'text';
  leftAmount.inputMode = 'decimal';
  leftAmount.autocomplete = 'off';

  leftAmount.addEventListener('input', function() {
    const cursor = this.selectionStart;
    const cleaned = this.value
      .replace(/,/g,'')
      .replace(/£/g,'')
      .replace(/[^0-9.]/g,'');
    this.value = cleaned;
    try { this.setSelectionRange(cursor, cursor); } catch(e) {}
  });
}

document.addEventListener('DOMContentLoaded', msFixLeftAmountField);
setTimeout(msFixLeftAmountField, 100);
setTimeout(msFixLeftAmountField, 1000);


function msRecalculatePerDayFromLeftAmount(){ return moneyLeftPerDayRebuiltUpdate(); }

function msNormaliseLeftAmountWholeNumber() {
  const el = document.getElementById('leftAmount');
  if (!el) return;

  el.removeAttribute('max');
  el.removeAttribute('maxlength');
  el.removeAttribute('min');
  el.removeAttribute('step');
  el.removeAttribute('pattern');

  el.type = 'text';
  el.inputMode = 'decimal';
  el.autocomplete = 'off';

  const clean = (value) => {
    let raw = String(value || '')
      .replace(/,/g, '')
      .replace(/£/g, '')
      .replace(/[^0-9.]/g, '');

    const firstDot = raw.indexOf('.');
    if (firstDot !== -1) {
      raw = raw.slice(0, firstDot + 1) + raw.slice(firstDot + 1).replace(/\./g, '');
    }

    return raw;
  };

  const current = clean(el.value);
  el.value = current;

  if (el.dataset.decimalMoneyWired) return;
  el.dataset.decimalMoneyWired = '1';

  el.addEventListener('input', function() {
    const cursor = this.selectionStart || 0;
    const before = this.value;
    const cleaned = clean(before);

    if (before !== cleaned) {
      const removedBeforeCursor = before.slice(0, cursor).length - clean(before.slice(0, cursor)).length;
      this.value = cleaned;

      try {
        const pos = Math.max(0, cursor - removedBeforeCursor);
        this.setSelectionRange(pos, pos);
      } catch (e) {}
    }

    if (typeof msRecalculatePerDayFromLeftAmount === 'function') {
      msRecalculatePerDayFromLeftAmount();
    }
  });

  el.addEventListener('change', function() {
    if (typeof msRecalculatePerDayFromLeftAmount === 'function') {
      msRecalculatePerDayFromLeftAmount();
    }
  });
}

function msSafeWireSyncControls() {
  const refresh = document.getElementById('reloadBarBtn') || document.getElementById('refreshNav') || document.getElementById('refreshBtn');
  if (refresh && !refresh.dataset.safeRefreshWired) {
    refresh.dataset.safeRefreshWired = '1';
    refresh.onclick = function(event) {
      event.preventDefault();
      msRefreshLeftC4AndSheet();
    };
  }

  const addBar = document.getElementById('addItemBarBtn');
  if (addBar && !addBar.dataset.safeAddWired) {
    addBar.dataset.safeAddWired = '1';
    addBar.onclick = function(event) {
      event.preventDefault();
      if (typeof openAdd === 'function') openAdd();
      else if (document.getElementById('msAddItemModal')) document.getElementById('msAddItemModal').classList.add('open');
      else if (document.getElementById('addModal')) document.getElementById('addModal').classList.add('open');
    };
  }

  document.querySelectorAll('[data-paid-row], .paid-toggle, [data-row]').forEach(function(btn) {
    const row = btn.dataset.paidRow || btn.dataset.row;
    if (!row || btn.dataset.safePaidWired) return;
    btn.dataset.safePaidWired = '1';
    btn.addEventListener('click', function(event) {
      event.preventDefault();
      event.stopPropagation();
      if (typeof togglePaid === 'function') togglePaid(row);
    });
  });
}

document.addEventListener('DOMContentLoaded', function() {
  msSafeWireSyncControls();
  setInterval(msSafeWireSyncControls, 1000);
});


function msParseLooseMoney(value) {
  const raw = String(value || '')
    .replace(/,/g, '')
    .replace(/£/g, '')
    .replace(/[^\d.]/g, '');
  const dot = raw.indexOf('.');
  const normalised = dot === -1 ? raw : raw.slice(0, dot + 1) + raw.slice(dot + 1).replace(/\./g, '');
  const n = parseFloat(normalised);
  return Number.isFinite(n) ? n : 0;
}

function msCleanLooseMoney(value) {
  const raw = String(value || '')
    .replace(/,/g, '')
    .replace(/£/g, '')
    .replace(/[^\d.]/g, '');
  const dot = raw.indexOf('.');
  return dot === -1 ? raw : raw.slice(0, dot + 1) + raw.slice(dot + 1).replace(/\./g, '');
}

function msCurrentStillToPay() {
  try {
    const picker = document.getElementById('monthPicker');
    const table = CACHED_TABLES[picker && picker.value !== '' ? picker.value : 0] || CACHED_TABLES[0];
    if (!table || !table.rows) return 0;
    return table.rows.reduce((sum, row) => sum + (isRowPaid(row) ? 0 : (row.paid || 0)), 0);
  } catch (e) {
    return 0;
  }
}

function msDaysLeftInCurrentMonth() {
  const now = new Date();
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
  return Math.max(1, Math.ceil((end - now) / 86400000));
}

function msUpdateLeftAmountPerDay(){ return moneyLeftPerDayRebuiltUpdate(); }


// Sync Amount Left with the spreadsheet tab/range: Left!C4
const MS_LEFT_AMOUNT_RANGE = 'Left!C4';

async function msReadLeftAmountFromSheet() {
  const { fileId } = getConfig();
  const token = getToken();
  if (!token) throw new Error('Not signed in');

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${fileId}/values/${encodeURIComponent(MS_LEFT_AMOUNT_RANGE)}?valueRenderOption=FORMATTED_VALUE`;
  const res = await fetch(url, {
    cache: 'no-store',
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    }
  });

  if (res.status === 401) {
    clearToken();
    throw new Error('Session expired — sign in again.');
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Sheets API ${res.status}: ${text.slice(0, 220)}`);
  }

  const data = await res.json();
  return data.values && data.values[0] && data.values[0][0] != null ? String(data.values[0][0]) : '';
}

async function msWriteLeftAmountToSheet(value){ return msWriteLeftC4Visible(value, true); }

async function msPullLeftAmountC4(){ return msApplyLeftC4ToInputStrong(); }

function msWireLeftAmountC4Sync() {
  const input = document.getElementById('leftAmount');
  if (!input || input.dataset.leftC4SyncWired) return;
  input.dataset.leftC4SyncWired = '1';

  let saveTimer = null;
  const save = () => {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(async () => {
      try {
        await msWriteLeftAmountToSheet(input.value);
        if (typeof msUpdateLeftAmountPerDay === 'function') msUpdateLeftAmountPerDay();
      } catch (err) {
        console.warn('Could not write Left!C4:', err);
      }
    }, 500);
  };

  input.addEventListener('input', save);
  input.addEventListener('change', async () => {
    clearTimeout(saveTimer);
    try {
      await msWriteLeftAmountToSheet(input.value);
      if (typeof msUpdateLeftAmountPerDay === 'function') msUpdateLeftAmountPerDay();
    } catch (err) {
      alert('Could not sync Amount Left: ' + (err.message || err));
    }
  });
}

async function msRefreshLeftC4AndSheet() {
  await loadSpreadsheet();
  setTimeout(async () => {
    msWireLeftAmountC4Sync();
    await msPullLeftAmountC4();
  }, 100);
}


// Strong Left!C4 -> PWA sync.
// This waits until #leftAmount exists, then applies the sheet value after render.
async function msReadLeftC4ValueStrong() {
  const { fileId } = getConfig();
  const token = getToken();
  if (!token) throw new Error('Not signed in');

  const range = 'Left!C4';
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${fileId}/values/${encodeURIComponent(range)}?valueRenderOption=FORMATTED_VALUE&dateTimeRenderOption=FORMATTED_STRING`;

  const res = await fetch(url, {
    cache: 'no-store',
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    }
  });

  if (res.status === 401) {
    clearToken();
    throw new Error('Session expired — sign in again.');
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Sheets API ${res.status}: ${text.slice(0, 220)}`);
  }

  const json = await res.json();
  return json.values && json.values[0] && json.values[0][0] != null ? String(json.values[0][0]) : '';
}

function msCleanLeftC4DisplayValue(value) {
  return String(value || '')
    .replace(/,/g, '')
    .replace(/£/g, '')
    .replace(/[^\d.]/g, '')
    .replace(/(\..*)\./g, '$1');
}

async function msApplyLeftC4ToInputStrong() {
  const input = document.getElementById('leftAmount');
  if (!input) return false;

  try {
    const sheetValue = await msReadLeftC4ValueStrong();
    const cleaned = msCleanLeftC4DisplayValue(sheetValue);

    input.value = cleaned;
    input.dataset.syncedFromLeftC4 = cleaned;
    msLeftC4LastWrittenValue = cleaned;

    if (typeof msUpdateLeftAmountPerDay === 'function') msUpdateLeftAmountPerDay();
    if (typeof msRecalcLeftAmountPerDay === 'function') msRecalcLeftAmountPerDay();
    if (typeof msRecalculatePerDayFromLeftAmount === 'function') msRecalculatePerDayFromLeftAmount();

    return true;
  } catch (err) {
    console.warn('Left!C4 pull failed:', err);
    return false;
  }
}

function msWaitAndApplyLeftC4Strong() {
  let attempts = 0;
  const timer = setInterval(async () => {
    attempts++;
    const ok = await msApplyLeftC4ToInputStrong();
    if (ok || attempts >= 20) clearInterval(timer);
  }, 250);
}

async function msWriteLeftC4Strong(value){ return msWriteLeftC4Visible(value, true); }

function msWireLeftC4Strong() {
  const input = document.getElementById('leftAmount');
  if (!input || input.dataset.leftC4StrongWired) return;

  input.dataset.leftC4StrongWired = '1';

  let saveTimer = null;
  input.addEventListener('input', function() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      msWriteLeftC4Strong(input.value).catch(err => console.warn('Left!C4 write failed:', err));
    }, 700);
  });

  input.addEventListener('change', function() {
    clearTimeout(saveTimer);
    msWriteLeftC4Strong(input.value).catch(err => alert('Could not sync Amount Left: ' + (err.message || err)));
  });
}

function msAfterRenderLeftC4Strong() {
  msWireLeftC4Strong();
  msWaitAndApplyLeftC4Strong();
}


// Strong delegated write-back for Amount Left -> Left!C4.
// Works even if #leftAmount is re-rendered after spreadsheet refresh.
let msLeftC4WriteTimer = null;
let msLeftC4LastWrittenValue = null;

function msNormaliseLeftC4WriteValue(value) {
  const cleaned = String(value || '')
    .replace(/,/g, '')
    .replace(/£/g, '')
    .replace(/[^\d.]/g, '');

  const dot = cleaned.indexOf('.');
  const normalised = dot === -1
    ? cleaned
    : cleaned.slice(0, dot + 1) + cleaned.slice(dot + 1).replace(/\./g, '');

  return normalised;
}

async function msWriteLeftC4Now(value, showErrors = false) {
  const normalised = msNormaliseLeftC4WriteValue(value);
  if (normalised === '') return;

  // Avoid hammering the API if nothing changed.
  if (normalised === msLeftC4LastWrittenValue) return;

  try {
    if (typeof msWriteLeftC4Strong === 'function') {
      await msWriteLeftC4Strong(normalised);
    } else if (typeof msWriteLeftAmountToSheet === 'function') {
      await msWriteLeftAmountToSheet(normalised);
    } else {
      const { fileId } = getConfig();
      const token = getToken();
      if (!token) throw new Error('Not signed in');

      const range = 'Left!C4';
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${fileId}/values/${encodeURIComponent(range)}?valueInputOption=USER_ENTERED`;
      const res = await fetch(url, {
        method: 'PUT',
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          range,
          majorDimension: 'ROWS',
          values: [[parseFloat(normalised)]]
        })
      });

      if (res.status === 401) {
        clearToken();
        throw new Error('Session expired — sign in again.');
      }

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Sheets API ${res.status}: ${text.slice(0, 220)}`);
      }
    }

    msLeftC4LastWrittenValue = normalised;
    const input = document.getElementById('leftAmount');
    if (input) input.dataset.lastSyncedToLeftC4 = normalised;
  } catch (err) {
    console.warn('Left!C4 delegated write failed:', err);
    if (showErrors) alert('Could not update Left!C4: ' + (err.message || err));
  }
}

function msQueueLeftC4Write(value) {
  clearTimeout(msLeftC4WriteTimer);
  msLeftC4WriteTimer = setTimeout(() => {
    msWriteLeftC4Now(value, false);
  }, 650);
}

// Capture-phase delegated listeners. These catch updates even if other handlers exist.
document.addEventListener('input', function(event) {
  if (!event.target || event.target.id !== 'leftAmount') return;
  const cleaned = msNormaliseLeftC4WriteValue(event.target.value);
  msQueueLeftC4Write(cleaned);
}, true);

document.addEventListener('change', function(event) {
  if (!event.target || event.target.id !== 'leftAmount') return;
  clearTimeout(msLeftC4WriteTimer);
  msWriteLeftC4Now(event.target.value, true);
}, true);

document.addEventListener('focusout', function(event) {
  if (!event.target || event.target.id !== 'leftAmount') return;
  clearTimeout(msLeftC4WriteTimer);
  msWriteLeftC4Now(event.target.value, true);
}, true);


// Visible Left!C4 write fix.
// Reading can work with an old readonly token, but writing requires the full Sheets scope.
// If a write fails, this shows the reason and lets the user re-auth.
function msLeftC4Status(message, kind = 'info') {
  let el = document.getElementById('leftC4SyncStatus');
  const input = document.getElementById('leftAmount');
  if (!el && input && input.parentElement) {
    el = document.createElement('div');
    el.id = 'leftC4SyncStatus';
    el.style.cssText = 'margin-top:6px;font-size:11px;font-weight:700;color:#6b7280;';
    input.parentElement.appendChild(el);
  }
  if (!el) return;
  el.textContent = message;
  el.style.color = kind === 'error' ? '#b91c1c' : kind === 'success' ? '#15803d' : '#6b7280';
}

function msLeftC4NumericValue(value) {
  const cleaned = String(value || '')
    .replace(/,/g, '')
    .replace(/£/g, '')
    .replace(/[^\d.]/g, '');
  const dot = cleaned.indexOf('.');
  const normalised = dot === -1 ? cleaned : cleaned.slice(0, dot + 1) + cleaned.slice(dot + 1).replace(/\./g, '');
  const n = parseFloat(normalised);
  return Number.isFinite(n) ? n : 0;
}

async function msWriteLeftC4Visible(value, showAlert = false) {
  const { fileId } = getConfig();
  const token = getToken();
  if (!token) {
    msLeftC4Status('Sign in required to save Amount Left', 'error');
    if (showAlert) alert('Please sign in again so the app can save to Google Sheets.');
    throw new Error('Not signed in');
  }

  const amount = msLeftC4NumericValue(value);
  const range = 'Left!C4';

  msLeftC4Status('Saving Amount Left…');

  const updateUrl = `https://sheets.googleapis.com/v4/spreadsheets/${fileId}/values/${encodeURIComponent(range)}?valueInputOption=USER_ENTERED`;

  const doFetch = async () => fetch(updateUrl, {
    method: 'PUT',
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      range,
      majorDimension: 'ROWS',
      values: [[amount]]
    })
  });

  let res = await doFetch();

  if (res.status === 401 || res.status === 403) {
    const text = await res.text();

    // Most common cause: old readonly token. Clear it so next sign-in asks for writable scope.
    clearToken();
    msLeftC4Status('Please sign in again to allow saving', 'error');
    if (showAlert) {
      alert('Google needs you to sign in again so the app can save changes to the spreadsheet. After signing in, try updating Amount Left again.');
    }
    showSignIn();
    throw new Error(`Google permission issue ${res.status}: ${text.slice(0, 220)}`);
  }

  if (!res.ok) {
    const text = await res.text();
    msLeftC4Status('Amount Left save failed', 'error');
    if (showAlert) alert(`Could not save Amount Left: Sheets API ${res.status}: ${text.slice(0, 220)}`);
    throw new Error(`Sheets API ${res.status}: ${text.slice(0, 220)}`);
  }

  msLeftC4Status('Amount Left saved ✓', 'success');
  if (typeof msApplyLeftC4ToInputStrong === 'function') {
    setTimeout(msApplyLeftC4ToInputStrong, 500);
  }
  return res.json();
}

function msWireLeftC4VisibleWrite() {
  const input = document.getElementById('leftAmount');
  if (!input || input.dataset.visibleLeftC4Wired) return;
  input.dataset.visibleLeftC4Wired = '1';

  let timer = null;
  input.addEventListener('input', function() {
    if (typeof msUpdateLeftAmountPerDay === 'function') msUpdateLeftAmountPerDay();

    clearTimeout(timer);
    const value = input.value;
    timer = setTimeout(() => {
      msWriteLeftC4Visible(value, false).catch(err => console.warn('Amount Left autosave failed:', err));
    }, 900);
  });

  input.addEventListener('change', function() {
    clearTimeout(timer);
    msWriteLeftC4Visible(input.value, true).catch(err => console.warn('Amount Left change save failed:', err));
  });

  input.addEventListener('blur', function() {
    clearTimeout(timer);
    msWriteLeftC4Visible(input.value, true).catch(err => console.warn('Amount Left blur save failed:', err));
  });

  msLeftC4Status('Amount Left sync ready');
}

document.addEventListener('DOMContentLoaded', function() {
  setTimeout(msWireLeftC4VisibleWrite, 500);
  setTimeout(msWireLeftC4VisibleWrite, 1500);
});


// Final due-date sorting fix.
// Supports Due ↑ and Due ↓ using the row dueDate field.
function msDueSortValue(row) {
  const raw = String(row && row.dueDate != null ? row.dueDate : '').trim();

  // Simple day-of-month values: "1", "01", "14" etc.
  const dayOnly = raw.match(/^(\d{1,2})$/);
  if (dayOnly) return parseInt(dayOnly[1], 10);

  // UK-ish full dates: 14/05/2026 or 14-05-2026.
  const ukDate = raw.match(/^(\d{1,2})[\/\-.](\d{1,2})(?:[\/\-.](\d{2,4}))?$/);
  if (ukDate) return parseInt(ukDate[1], 10);

  // Text with first number in it: "Due 14th", "14 May" etc.
  const anyNumber = raw.match(/(\d{1,2})/);
  if (anyNumber) return parseInt(anyNumber[1], 10);

  // Missing/unknown dates go to the end for ascending and beginning for descending via comparator.
  return null;
}

function msSortRowsForCurrentSort(rows) {
  const arr = [...rows];

  if (CURRENT_SORT === 'dateAsc' || CURRENT_SORT === 'dateDesc') {
    arr.sort((a, b) => {
      const av = msDueSortValue(a);
      const bv = msDueSortValue(b);

      if (av == null && bv == null) return String(a.name || '').localeCompare(String(b.name || ''));
      if (av == null) return CURRENT_SORT === 'dateDesc' ? -1 : 1;
      if (bv == null) return CURRENT_SORT === 'dateDesc' ? 1 : -1;

      if (av !== bv) {
        return CURRENT_SORT === 'dateDesc' ? bv - av : av - bv;
      }

      return String(a.name || '').localeCompare(String(b.name || ''));
    });

    return arr;
  }

  if (CURRENT_SORT === 'paid') {
    arr.sort((a, b) => {
      const ap = isRowPaid(a);
      const bp = isRowPaid(b);
      if (ap !== bp) return bp ? 1 : -1;
      const av = msDueSortValue(a) ?? 99;
      const bv = msDueSortValue(b) ?? 99;
      return av - bv;
    });
    return arr;
  }

  // Default/unpaid first.
  arr.sort((a, b) => {
    const ap = isRowPaid(a);
    const bp = isRowPaid(b);
    if (ap !== bp) return ap ? 1 : -1;
    const av = msDueSortValue(a) ?? 99;
    const bv = msDueSortValue(b) ?? 99;
    return av - bv;
  });

  return arr;
}


// Final Money Left input fix.
// Replaces #leftAmount with a clean clone so old handlers cannot limit/cursor-jump it.
function msMoneyLeftParse(value) {
  const raw = String(value || '')
    .replace(/,/g, '')
    .replace(/£/g, '')
    .replace(/[^\d.]/g, '');
  const dot = raw.indexOf('.');
  const normalised = dot === -1 ? raw : raw.slice(0, dot + 1) + raw.slice(dot + 1).replace(/\./g, '');
  const n = parseFloat(normalised);
  return Number.isFinite(n) ? n : 0;
}

function msMoneyLeftCleanForSave(value) {
  const raw = String(value || '')
    .replace(/,/g, '')
    .replace(/£/g, '')
    .replace(/[^\d.]/g, '');
  const dot = raw.indexOf('.');
  return dot === -1 ? raw : raw.slice(0, dot + 1) + raw.slice(dot + 1).replace(/\./g, '');
}

function msMoneyLeftStillToPay() {
  try {
    const picker = document.getElementById('monthPicker');
    const table = CACHED_TABLES[picker && picker.value !== '' ? picker.value : 0] || CACHED_TABLES[0];
    if (!table || !table.rows) return 0;
    return table.rows.reduce((sum, row) => sum + (isRowPaid(row) ? 0 : (row.paid || 0)), 0);
  } catch (e) {
    return 0;
  }
}

// Left-per-day calculation:
// include TODAY
// exclude the selected final/end day.
function msMoneyLeftDays() { return moneyOptionBDaysLeft(); }

function msMoneyLeftRecalc(){ return moneyLeftPerDayRebuiltUpdate(); }

function msWireMoneyLeftCloneFix() {
  const oldInput = document.getElementById('leftAmount');
  if (!oldInput || oldInput.dataset.cloneFixed === '1') return;

  const clone = oldInput.cloneNode(true);
  clone.dataset.cloneFixed = '1';

  clone.removeAttribute('max');
  clone.removeAttribute('maxlength');
  clone.removeAttribute('min');
  clone.removeAttribute('step');
  clone.removeAttribute('pattern');
  clone.setAttribute('type', 'text');
  clone.setAttribute('inputmode', 'decimal');
  clone.setAttribute('autocomplete', 'off');

  oldInput.parentNode.replaceChild(clone, oldInput);

  let timer = null;

  clone.addEventListener('input', function() {
    // Do not change this.value while typing. This is the key fix.
    msMoneyLeftRecalc();

    clearTimeout(timer);
    timer = setTimeout(() => msMoneyLeftWriteBack(this.value, false), 900);
  });

  clone.addEventListener('change', function() {
    clearTimeout(timer);
    msMoneyLeftRecalc();
    msMoneyLeftWriteBack(this.value, true);
  });

  clone.addEventListener('blur', function() {
    clearTimeout(timer);
    msMoneyLeftRecalc();
    msMoneyLeftWriteBack(this.value, true);
  });

  msMoneyLeftRecalc();
}

document.addEventListener('DOMContentLoaded', function() {
  msWireMoneyLeftCloneFix();
  setTimeout(msWireMoneyLeftCloneFix, 250);
  setTimeout(msWireMoneyLeftCloneFix, 1000);
});


// Premium UI helpers: toasts, number pulse, pull-to-refresh hint, and lightweight refresh gesture.
function moneyToast(message) {
  let toast = document.getElementById('moneyToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'moneyToast';
    toast.className = 'money-toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(window.__moneyToastTimer);
  window.__moneyToastTimer = setTimeout(() => toast.classList.remove('show'), 1800);
}

function moneyPulseNumbers() {
  document.querySelectorAll('.big, .amount, [data-per-day-value]').forEach(el => {
    el.style.transform = 'scale(1.018)';
    el.style.opacity = '.86';
    setTimeout(() => {
      el.style.transform = '';
      el.style.opacity = '';
    }, 180);
  });
}

function moneyAddRefreshHint() {
  const app = document.getElementById('app');
  if (!app || document.getElementById('pullRefreshHint')) return;
  const hint = document.createElement('div');
  hint.id = 'pullRefreshHint';
  hint.className = 'pull-refresh-hint';
  hint.textContent = 'Pull down to refresh';
  app.prepend(hint);
}

function moneyWirePremiumRefresh() {
  if (window.__moneyPremiumRefreshWired) return;
  window.__moneyPremiumRefreshWired = true;

  let startY = 0;
  let armed = false;

  window.addEventListener('touchstart', event => {
    if (window.scrollY > 2) return;
    startY = event.touches && event.touches[0] ? event.touches[0].clientY : 0;
    armed = true;
  }, { passive: true });

  window.addEventListener('touchend', event => {
    if (!armed) return;
    armed = false;
    const endY = event.changedTouches && event.changedTouches[0] ? event.changedTouches[0].clientY : 0;
    if (window.scrollY <= 2 && endY - startY > 76) {
      moneyToast('Refreshing…');
      if (typeof loadSpreadsheet === 'function') {
        loadSpreadsheet();
        setTimeout(() => moneyToast('Updated ✓'), 900);
      }
    }
  }, { passive: true });
}

function moneyWirePremiumUI() {
  moneyAddRefreshHint();
  moneyPulseNumbers();

  document.querySelectorAll('.paid-toggle, [data-paid-row], #msAddItemSave, #reloadBarBtn').forEach(btn => {
    if (btn.dataset.moneyPremiumWired) return;
    btn.dataset.moneyPremiumWired = '1';
    btn.addEventListener('click', () => {
      setTimeout(moneyPulseNumbers, 250);
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  moneyWirePremiumUI();
  moneyWirePremiumRefresh();
  setTimeout(moneyWirePremiumUI, 800);
});


// Native-feeling bottom sheet helpers.
function moneyCloseOpenSheets() {
  document.querySelectorAll('.config-modal.open, .modal.open').forEach(modal => {
    modal.classList.remove('open');
  });
}

function moneyWireBottomSheets() {
  document.querySelectorAll('.config-modal, .modal').forEach(modal => {
    if (!modal.dataset.moneySheetWired) {
      modal.dataset.moneySheetWired = '1';
      modal.addEventListener('click', event => {
        if (event.target === modal) moneyCloseOpenSheets();
      });
    }

    const sheet = modal.querySelector('.config-box, .sheet');
    if (sheet && !sheet.dataset.moneySheetPrepared) {
      sheet.dataset.moneySheetPrepared = '1';

      if (!sheet.querySelector('.money-sheet-handle')) {
        const handle = document.createElement('div');
        handle.className = 'money-sheet-handle';
        handle.setAttribute('aria-hidden', 'true');
        sheet.prepend(handle);
      }

      if (!sheet.querySelector('[data-close-modal]')) {
        const close = document.createElement('button');
        close.type = 'button';
        close.className = 'modal-close';
        close.setAttribute('data-close-modal', '1');
        close.setAttribute('aria-label', 'Close');
        close.textContent = '×';
        close.addEventListener('click', event => {
          event.preventDefault();
          event.stopPropagation();
          moneyCloseOpenSheets();
        });
        sheet.appendChild(close);
      }

      let startY = 0;
      let currentY = 0;
      let dragging = false;

      sheet.addEventListener('touchstart', event => {
        if (!event.touches || !event.touches[0]) return;
        startY = event.touches[0].clientY;
        currentY = startY;
        dragging = true;
      }, { passive: true });

      sheet.addEventListener('touchmove', event => {
        if (!dragging || !event.touches || !event.touches[0]) return;
        currentY = event.touches[0].clientY;
        const delta = Math.max(0, currentY - startY);
        if (delta > 0 && sheet.scrollTop <= 0) {
          sheet.style.transform = `translateY(${Math.min(delta, 120)}px)`;
        }
      }, { passive: true });

      sheet.addEventListener('touchend', () => {
        if (!dragging) return;
        dragging = false;
        const delta = Math.max(0, currentY - startY);
        sheet.style.transform = '';
        if (delta > 96 && sheet.scrollTop <= 0) {
          moneyCloseOpenSheets();
        }
      }, { passive: true });
    }
  });
}

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') moneyCloseOpenSheets();
});

document.addEventListener('click', event => {
  const close = event.target.closest('[data-close-modal]');
  if (close) {
    event.preventDefault();
    moneyCloseOpenSheets();
  }
});

document.addEventListener('DOMContentLoaded', () => {
  moneyWireBottomSheets();
  setInterval(moneyWireBottomSheets, 1200);
});


// Hero, insights, swipe gestures and charts.
function moneyParseAmountText(text) {
  const cleaned = String(text || '').replace(/,/g, '').replace(/£/g, '').replace(/[^\d.-]/g, '');
  const n = parseFloat(cleaned);
  return Number.isFinite(n) ? n : 0;
}

function moneyFmt(n) {
  if (typeof fmtMoney === 'function') return fmtMoney(n || 0);
  return '£' + (n || 0).toFixed(2);
}

function moneyCurrentTable() {
  try {
    const picker = document.getElementById('monthPicker');
    return CACHED_TABLES[picker && picker.value !== '' ? picker.value : 0] || CACHED_TABLES[0];
  } catch (e) {
    return null;
  }
}

function moneyDueDay(row) {
  const raw = String(row && row.dueDate != null ? row.dueDate : '').trim();
  const m = raw.match(/(\d{1,2})/);
  return m ? parseInt(m[1], 10) : null;
}

function moneyDaysUntilDue(row) {
  const day = moneyDueDay(row);
  if (!day) return null;
  const now = new Date();
  const due = new Date(now.getFullYear(), now.getMonth(), day, 23, 59, 59);
  return Math.ceil((due - now) / 86400000);
}

function moneyMetrics() {
  const table = moneyCurrentTable();
  const rows = table && table.rows ? table.rows : [];
  const unpaid = rows.filter(r => !isRowPaid(r));
  const paid = rows.filter(r => isRowPaid(r));

  const unpaidTotal = unpaid.reduce((s, r) => s + (r.paid || r.due || 0), 0);
  const paidTotal = paid.reduce((s, r) => s + (r.due || 0), 0);
  const allTotal = rows.reduce((s, r) => s + (r.due || 0), 0);

  const leftInput = document.getElementById('leftAmount');
  const left = leftInput ? moneyParseAmountText(leftInput.value) : 0;

  const daysLeft = moneyOptionBDaysLeft();

  const safeToSpend = (() => { try { return parseFloat(String(moneySafeSpendOptionBValue()).replace(/,/g,'').replace(/£/g,'')) || ((left - unpaidTotal) / daysLeft); } catch(e){ return (left - unpaidTotal) / daysLeft; } })();
  const upcoming = unpaid
    .map(r => ({ ...r, daysUntil: moneyDaysUntilDue(r) }))
    .filter(r => r.daysUntil != null && r.daysUntil >= 0 && r.daysUntil <= 7)
    .sort((a, b) => a.daysUntil - b.daysUntil)
    .slice(0, 4);

  const largest = unpaid.slice().sort((a, b) => (b.paid || b.due || 0) - (a.paid || a.due || 0))[0];

  return { rows, unpaid, paid, unpaidTotal, paidTotal, allTotal, left, daysLeft, safeToSpend, upcoming, largest };
}

function moneyBuildDashboardHTML() {
  const m = moneyMetrics();
  const paidPct = m.allTotal ? Math.min(100, (m.paidTotal / m.allTotal) * 100) : 0;
  const unpaidPct = m.allTotal ? Math.min(100, (m.unpaidTotal / m.allTotal) * 100) : 0;
  const leftPct = m.left ? Math.max(0, Math.min(100, ((m.left - m.unpaidTotal) / m.left) * 100)) : 0;

  const insightA = m.upcoming.length
    ? `${m.upcoming.length} bill${m.upcoming.length === 1 ? '' : 's'} due in the next 7 days.`
    : 'No unpaid bills due in the next 7 days.';

  const insightB = m.largest
    ? `Largest unpaid bill: ${escapeHtml(m.largest.name)} at ${moneyFmt(m.largest.paid || m.largest.due || 0)}.`
    : 'No unpaid bills left. Nice.';

  const shownPerDay = moneyGetDisplayedPerDayValue();
  const insightC = shownPerDay ? `Safe to spend: ${shownPerDay} per day.` : (m.safeToSpend >= 0 ? `Safe to spend: ${moneyFmt(m.safeToSpend)} per day.` : `You are short by ${moneyFmt(Math.abs(m.safeToSpend))} per day.`);

  const upcomingHTML = m.upcoming.length
    ? m.upcoming.map(r => `
      <div class="money-upcoming-item">
        <strong>${escapeHtml(r.name)}</strong>
        <span>${r.daysUntil === 0 ? 'Today' : `in ${r.daysUntil} day${r.daysUntil === 1 ? '' : 's'}`} · ${moneyFmt(r.paid || r.due || 0)}</span>
      </div>
    `).join('')
    : `<div class="money-upcoming-item"><strong>Nothing urgent</strong><span>Next 7 days clear</span></div>`;

  return `
    <section class="money-hero">
      <div class="money-hero-top">
        <div class="money-hero-kicker">Safe to spend today</div>
        <div class="money-hero-amount"><span data-safe-spend-placeholder="1">—</span></div>
        <div class="money-hero-sub">${moneyReadCorrectDaysText ? (moneyReadCorrectDaysText() || `${m.daysLeft} day${m.daysLeft === 1 ? '' : 's'} left`) : `${m.daysLeft} day${m.daysLeft === 1 ? '' : 's'} left`} · ${moneyFmt(m.unpaidTotal)} still to pay</div>
      </div>
      <div class="money-hero-row">
        <div class="money-hero-stat"><strong>${m.unpaid.length}</strong><span>Unpaid</span></div>
        <div class="money-hero-stat"><strong>${m.paid.length}</strong><span>Paid</span></div>
        <div class="money-hero-stat"><strong>${moneyFmt(m.left)}</strong><span>Left</span></div>
      </div>
    </section>

    <section class="money-insights-card">
      <div class="money-section-title">Smart insights <span>✨</span></div>
      <div class="money-insight-list">
        <div class="money-insight"><span class="money-insight-icon">⏱</span><span>${insightA}</span></div>
        <div class="money-insight"><span class="money-insight-icon">💡</span><span>${insightB}</span></div>
        <div class="money-insight"><span class="money-insight-icon">£</span><span>${insightC}</span></div>
      </div>
    </section>

    <section class="money-chart-card">
      <div class="money-section-title">Month snapshot <span>${Math.round(paidPct)}% paid</span></div>
      <div class="money-chart-bars">
        <div class="money-chart-row"><span>Paid</span><div class="money-chart-track"><div class="money-chart-fill paid" data-width="${paidPct}"></div></div><span>${moneyFmt(m.paidTotal)}</span></div>
        <div class="money-chart-row"><span>Unpaid</span><div class="money-chart-track"><div class="money-chart-fill unpaid" data-width="${unpaidPct}"></div></div><span>${moneyFmt(m.unpaidTotal)}</span></div>
        <div class="money-chart-row"><span>Buffer</span><div class="money-chart-track"><div class="money-chart-fill left" data-width="${leftPct}"></div></div><span>${Math.round(leftPct)}%</span></div>
      </div>
    </section>

    <section class="money-upcoming-card" data-section="upcoming">
      <div class="money-section-title">Upcoming this week <span>📅</span></div>
      <div class="money-upcoming-list">${upcomingHTML}</div>
    </section>
  `;
}

function moneyInsertDashboard() {
  const app = document.getElementById('app');
  const content = document.getElementById('content') || app;
  if (!content || !moneyCurrentTable()) return;

  let dash = document.getElementById('moneySmartDashboard');
  if (!dash) {
    dash = document.createElement('div');
    dash.id = 'moneySmartDashboard';

    const tabs = content.querySelector('.tabs');
    if (tabs && tabs.parentNode) {
      tabs.parentNode.insertBefore(dash, tabs);
    } else {
      content.prepend(dash);
    }
  }

  dash.innerHTML = moneyBuildDashboardHTML();

  requestAnimationFrame(() => {
    dash.querySelectorAll('.money-chart-fill').forEach(el => {
      el.style.width = `${el.dataset.width || 0}%`;
    });
  });
}

function moneyWrapSwipeCards() {
  document.querySelectorAll('.bill-card, article[class*="bill"]').forEach(card => {
    if (card.closest('.money-swipe-wrap')) return;

    const wrap = document.createElement('div');
    wrap.className = 'money-swipe-wrap';
    wrap.innerHTML = `
      <div class="money-swipe-actions">
        <div class="money-swipe-action pay">Paid</div>
        <div class="money-swipe-action more">Refresh</div>
      </div>
    `;
    card.parentNode.insertBefore(wrap, card);
    wrap.appendChild(card);

    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let dragging = false;

    card.addEventListener('touchstart', event => {
      const t = event.touches && event.touches[0];
      if (!t) return;
      startX = t.clientX;
      startY = t.clientY;
      currentX = startX;
      dragging = true;
      wrap.classList.add('swiping');
    }, { passive: true });

    card.addEventListener('touchmove', event => {
      if (!dragging) return;
      const t = event.touches && event.touches[0];
      if (!t) return;
      const dx = t.clientX - startX;
      const dy = t.clientY - startY;
      if (Math.abs(dy) > Math.abs(dx)) return;
      currentX = t.clientX;
      const clamped = Math.max(-92, Math.min(92, dx));
      card.style.transform = `translateX(${clamped}px)`;
    }, { passive: true });

    card.addEventListener('touchend', () => {
      if (!dragging) return;
      dragging = false;
      wrap.classList.remove('swiping');
      const dx = currentX - startX;
      card.style.transform = '';

      if (dx > 74) {
        const paidBtn = card.querySelector('.paid-toggle, [data-paid-row], [data-row]');
        if (paidBtn) paidBtn.click();
        if (typeof moneyToast === 'function') moneyToast('Marked paid');
      } else if (dx < -74) {
        if (typeof loadSpreadsheet === 'function') loadSpreadsheet();
        if (typeof moneyToast === 'function') moneyToast('Refreshed');
      }
    }, { passive: true });
  });
}

function moneyWireSmartFeatures() {
  moneyInsertDashboard();
  moneyWrapSwipeCards();
}

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(moneyWireSmartFeatures, 800);
  setInterval(moneyWrapSwipeCards, 1600);
});


// Keeps premium dashboard sections visible after Paid/Unpaid/Due sorting rerenders.
function moneyRefreshPremiumDashboardSoon() {
  clearTimeout(window.__moneyDashboardRefreshTimer);
  window.__moneyDashboardRefreshTimer = setTimeout(() => {
    if (typeof moneyWireSmartFeatures === 'function') {
      moneyWireSmartFeatures();
    }
    if (typeof moneyInsertDashboard === 'function') {
      moneyInsertDashboard();
    }
  }, 80);
}

function moneyPatchRenderForDashboardPersistence() {
  if (window.__moneyDashboardRenderPatched) return;
  window.__moneyDashboardRenderPatched = true;

  if (typeof renderMonth === 'function') {
    const originalRenderMonth = renderMonth;
    renderMonth = function(...args) {
      const result = originalRenderMonth.apply(this, args);
      moneyRefreshPremiumDashboardSoon();
      return result;
    };
  }

  if (typeof render === 'function') {
    const originalRender = render;
    render = function(...args) {
      const result = originalRender.apply(this, args);
      moneyRefreshPremiumDashboardSoon();
      return result;
    };
  }
}

// Capture tab/sort clicks before the app rerenders, then rebuild after.
document.addEventListener('click', function(event) {
  if (event.target.closest('.tabs .tab, [data-sort], .sort-pill')) {
    setTimeout(moneyRefreshPremiumDashboardSoon, 120);
    setTimeout(moneyRefreshPremiumDashboardSoon, 350);
  }
}, true);

// Watch the content area because some handlers replace innerHTML.
document.addEventListener('DOMContentLoaded', function() {
  moneyPatchRenderForDashboardPersistence();
  moneyRefreshPremiumDashboardSoon();

  const target = document.getElementById('content') || document.getElementById('app');
  if (target && !target.dataset.moneyDashboardObserver) {
    target.dataset.moneyDashboardObserver = '1';
    const observer = new MutationObserver(() => {
      const hasRows = !!document.querySelector('.bill-card, article[class*="bill"]');
      const hasDashboard = !!document.getElementById('moneySmartDashboard');
      if (hasRows && !hasDashboard) {
        moneyRefreshPremiumDashboardSoon();
      }
    });
    observer.observe(target, { childList: true, subtree: true });
  }

  setTimeout(moneyPatchRenderForDashboardPersistence, 500);
  setTimeout(moneyRefreshPremiumDashboardSoon, 700);
});


// Smart bill icons/logos.
function moneyBillIconForName(name) {
  const n = String(name || '').toLowerCase();

  const rules = [
    { kind: 'home', icon: '⌂', words: ['rent', 'mortgage', 'council', 'service charge', 'ground rent'] },
    { kind: 'utility', icon: '⚡', words: ['electric', 'electricity', 'gas', 'water', 'utility', 'octopus', 'edf', 'eon', 'british gas', 'bulb'] },
    { kind: 'media', icon: '▶', words: ['netflix', 'spotify', 'prime', 'amazon', 'disney', 'apple', 'tv', 'now', 'youtube', 'subscription'] },
    { kind: 'phone', icon: '◉', words: ['phone', 'mobile', 'vodafone', 'ee', 'o2', 'three', 'broadband', 'internet', 'wifi', 'bt', 'virgin'] },
    { kind: 'car', icon: '◆', words: ['car', 'fuel', 'petrol', 'insurance car', 'road tax', 'mot', 'parking'] },
    { kind: 'insurance', icon: '◇', words: ['insurance', 'life cover', 'policy', 'protection'] },
    { kind: 'food', icon: '●', words: ['food', 'tesco', 'sainsbury', 'aldi', 'lidl', 'ocado', 'groceries'] },
    { kind: 'finance', icon: '£', words: ['loan', 'credit', 'card', 'bank', 'savings', 'isa', 'paypal', 'klarna'] },
    { kind: 'health', icon: '+', words: ['gym', 'health', 'dental', 'doctor', 'medical', 'therapy'] }
  ];

  for (const rule of rules) {
    if (rule.words.some(w => n.includes(w))) return rule;
  }

  const trimmed = String(name || '').trim();
  const initial = trimmed ? trimmed[0].toUpperCase() : '•';
  return { kind: 'default', icon: initial, words: [] };
}

function moneyApplyBillLogos() {
  document.querySelectorAll('.bill-card, article[class*="bill"], .item-card, .row-card').forEach(card => {
    const nameEl =
      card.querySelector('.bill-name') ||
      card.querySelector('[class*="name"]') ||
      card.querySelector('strong') ||
      card.querySelector('h3');

    const name = nameEl ? nameEl.textContent.trim() : card.textContent.trim();

    let icon = card.querySelector('.bill-icon, .money-bill-logo');
    if (!icon) {
      icon = document.createElement('div');
      icon.className = 'money-bill-logo';

      const firstContent = Array.from(card.children).find(el => !el.classList.contains('money-swipe-actions'));
      if (firstContent) card.insertBefore(icon, firstContent);
      else card.prepend(icon);
    }

    const match = moneyBillIconForName(name);
    icon.classList.add('money-bill-logo');
    icon.dataset.kind = match.kind;
    icon.textContent = match.icon;
    icon.setAttribute('aria-label', `${match.kind} bill icon`);
  });
}

function moneyWireBillLogoObserver() {
  if (window.__moneyBillLogoObserverWired) return;
  window.__moneyBillLogoObserverWired = true;

  const root = document.getElementById('content') || document.getElementById('app') || document.body;
  const observer = new MutationObserver(() => {
    clearTimeout(window.__moneyBillLogoTimer);
    window.__moneyBillLogoTimer = setTimeout(moneyApplyBillLogos, 80);
  });
  observer.observe(root, { childList: true, subtree: true });
}

document.addEventListener('DOMContentLoaded', () => {
  moneyApplyBillLogos();
  moneyWireBillLogoObserver();
  setTimeout(moneyApplyBillLogos, 700);
});


// Make Safe to spend today match the existing Money Left per day value exactly.
function moneyGetDisplayedPerDayValue() {
  const el =
    document.getElementById('perDayValue') ||
    document.getElementById('perDayValueEl') ||
    document.querySelector('[data-per-day-value]') ||
    document.querySelector('.per-day .big');

  return el ? String(el.textContent || '').trim() : '';
}

function moneySyncHeroSafeSpendToPerDay() {
  const perDayText = moneyGetDisplayedPerDayValue();
  if (!perDayText) return;

  document.querySelectorAll('.money-hero-amount').forEach(el => {
    el.textContent = perDayText;
  });

  // Also update the smart insight that mentions safe to spend.
  document.querySelectorAll('.money-insight').forEach(insight => {
    const text = insight.textContent || '';
    if (text.toLowerCase().includes('safe to spend') || text.toLowerCase().includes('short by')) {
      const span = insight.querySelector('span:not(.money-insight-icon)') || insight;
      span.textContent = `Safe to spend: ${perDayText} per day.`;
    }
  });
}

function moneyWireSafeSpendMatch() {
  moneySyncHeroSafeSpendToPerDay();

  const perDayEl =
    document.getElementById('perDayValue') ||
    document.getElementById('perDayValueEl') ||
    document.querySelector('[data-per-day-value]') ||
    document.querySelector('.per-day .big');

  if (perDayEl && !perDayEl.dataset.safeSpendObserver) {
    perDayEl.dataset.safeSpendObserver = '1';
    const observer = new MutationObserver(() => moneySyncHeroSafeSpendToPerDay());
    observer.observe(perDayEl, { childList: true, characterData: true, subtree: true });
  }
}

document.addEventListener('DOMContentLoaded', function() {
  setTimeout(moneyWireSafeSpendMatch, 500);
  setTimeout(moneyWireSafeSpendMatch, 1200);
});

document.addEventListener('input', function(event) {
  if (event.target && event.target.id === 'leftAmount') {
    setTimeout(moneyWireSafeSpendMatch, 80);
    setTimeout(moneyWireSafeSpendMatch, 400);
  }
});

document.addEventListener('click', function(event) {
  if (event.target.closest('.tabs, .paid-toggle, [data-paid-row], #reloadBarBtn')) {
    setTimeout(moneyWireSafeSpendMatch, 400);
    setTimeout(moneyWireSafeSpendMatch, 900);
  }
});


// Hard sync: Safe to spend today must equal the Money Left per day calculation.
function moneySafeSpendFindPerDayElement() {
  return (
    document.getElementById('perDayValue') ||
    document.getElementById('perDayValueEl') ||
    document.querySelector('[data-per-day-value]') ||
    document.querySelector('.per-day .big') ||
    document.querySelector('[class*="perDay"]') ||
    document.querySelector('[class*="per-day"] .big')
  );
}

function moneySafeSpendReadPerDay() {
  const el = moneySafeSpendFindPerDayElement();
  const text = el ? String(el.textContent || '').trim() : '';
  return text || '';
}

function moneySafeSpendCalculateFromSameInputs() {
  try {
    const input = document.getElementById('leftAmount');
    const amount = typeof msMoneyLeftParse === 'function'
      ? msMoneyLeftParse(input ? input.value : 0)
      : parseFloat(String(input ? input.value : '0').replace(/,/g,'').replace(/£/g,'').replace(/[^\d.]/g,'')) || 0;

    const stillToPay = typeof msMoneyLeftStillToPay === 'function'
      ? msMoneyLeftStillToPay()
      : (typeof moneyMetrics === 'function' ? moneyMetrics().unpaidTotal : 0);

    const days = moneyOptionBDaysLeft();

    const perDay = (amount - stillToPay) / days;
    return typeof fmtMoney === 'function' ? fmtMoney(perDay) : ('£' + perDay.toFixed(2));
  } catch (e) {
    return '';
  }
}

function moneySafeSpendCurrentValue() {
  return moneySafeSpendReadPerDay() || moneySafeSpendCalculateFromSameInputs();
}

function moneySafeSpendApply(){ return moneyLeftPerDayRebuiltUpdate(); }

function moneySafeSpendPatchDashboardBuilder(){ return moneyLeftPerDayRebuiltUpdate(); }

function moneySafeSpendWireHardSync() {
  moneySafeSpendPatchDashboardBuilder();
  moneySafeSpendApply();

  const perDay = moneySafeSpendFindPerDayElement();
  if (perDay && !perDay.dataset.safeSpendHardObserver) {
    perDay.dataset.safeSpendHardObserver = '1';
    new MutationObserver(() => {
      setTimeout(moneySafeSpendApply, 0);
      setTimeout(() => {
        if (typeof moneyInsertDashboard === 'function') moneyInsertDashboard();
        moneySafeSpendApply();
      }, 80);
    }).observe(perDay, { childList: true, subtree: true, characterData: true });
  }
}

document.addEventListener('DOMContentLoaded', function() {
  moneySafeSpendWireHardSync();
  setTimeout(moneySafeSpendWireHardSync, 500);
  setTimeout(moneySafeSpendWireHardSync, 1200);
});

document.addEventListener('input', function(event) {
  if (event.target && event.target.id === 'leftAmount') {
    setTimeout(moneySafeSpendWireHardSync, 0);
    setTimeout(moneySafeSpendWireHardSync, 160);
    setTimeout(() => {
      if (typeof moneyInsertDashboard === 'function') moneyInsertDashboard();
      moneySafeSpendApply();
    }, 320);
  }
}, true);

document.addEventListener('click', function(event) {
  if (event.target.closest('.tabs, .paid-toggle, [data-paid-row], #reloadBarBtn, .sort-pill')) {
    setTimeout(moneySafeSpendWireHardSync, 200);
    setTimeout(moneySafeSpendWireHardSync, 700);
  }
}, true);


// Final fix: dashboard hero must mirror the existing correct Money Left per day UI,
// including the already-correct days-left text.
function moneyFindPerDayValueEl() {
  return (
    document.getElementById('perDayValue') ||
    document.getElementById('perDayValueEl') ||
    document.querySelector('[data-per-day-value]') ||
    document.querySelector('.per-day .big')
  );
}

function moneyFindPerDayMetaEl() {
  return (
    document.getElementById('perDayMeta') ||
    document.querySelector('[data-per-day-meta]') ||
    document.querySelector('.per-day .meta')
  );
}

function moneyReadCorrectPerDayText() {
  const el = moneyFindPerDayValueEl();
  return el ? String(el.textContent || '').trim() : '';
}

function moneyReadCorrectDaysText() {
  const el = moneyFindPerDayMetaEl();
  const text = el ? String(el.textContent || '').trim() : '';
  return text || '';
}

function moneyApplyCorrectHeroValues(){ return moneyLeftPerDayRebuiltUpdate(); }

function moneyPatchDashboardForCorrectDays(){ return moneyLeftPerDayRebuiltUpdate(); }

function moneyWireCorrectPerDayHeroSync() {
  moneyPatchDashboardForCorrectDays();
  moneyApplyCorrectHeroValues();

  [moneyFindPerDayValueEl(), moneyFindPerDayMetaEl()].forEach(el => {
    if (!el || el.dataset.heroMirrorObserver) return;
    el.dataset.heroMirrorObserver = '1';
    new MutationObserver(() => {
      setTimeout(moneyApplyCorrectHeroValues, 0);
      setTimeout(() => {
        if (typeof moneyInsertDashboard === 'function') moneyInsertDashboard();
        moneyApplyCorrectHeroValues();
      }, 120);
    }).observe(el, { childList: true, characterData: true, subtree: true });
  });
}

document.addEventListener('DOMContentLoaded', function() {
  setTimeout(moneyWireCorrectPerDayHeroSync, 400);
  setTimeout(moneyWireCorrectPerDayHeroSync, 1000);
  setTimeout(moneyWireCorrectPerDayHeroSync, 1800);
});

document.addEventListener('input', function(event) {
  if (event.target && event.target.id === 'leftAmount') {
    setTimeout(moneyWireCorrectPerDayHeroSync, 50);
    setTimeout(moneyWireCorrectPerDayHeroSync, 300);
  }
}, true);

document.addEventListener('click', function(event) {
  if (event.target.closest('.tabs, .paid-toggle, [data-paid-row], #reloadBarBtn, .sort-pill')) {
    setTimeout(moneyWireCorrectPerDayHeroSync, 250);
    setTimeout(moneyWireCorrectPerDayHeroSync, 800);
  }
}, true);


// Option B day-count rule:
// Include today, exclude the selected/reset/end date.
// Example: today 12th, selected end 30th => count 12..29 = 18 days.
function moneyOptionBDaysLeft() {
  const now = new Date();

  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  // Try to use the app's selected end date if there is one.
  // Fallback to last day of the current month.
  let endDate = null;

  const candidates = [
    document.getElementById('endDate'),
    document.getElementById('targetDate'),
    document.getElementById('selectedDate'),
    document.querySelector('[data-end-date]'),
    document.querySelector('input[type="date"]')
  ].filter(Boolean);

  for (const el of candidates) {
    const value = el.dataset && el.dataset.endDate ? el.dataset.endDate : el.value;
    if (!value) continue;

    const parsed = new Date(value + (String(value).includes('T') ? '' : 'T00:00:00'));
    if (!isNaN(parsed.getTime())) {
      endDate = new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
      break;
    }
  }

  if (!endDate) {
    endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    endDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
  }

  // Exclude the end date. Including today means simple difference in calendar days.
  const days = Math.floor((endDate - today) / 86400000);

  return Math.max(1, days);
}

// Override the various day functions added during previous patches.
function msMoneyLeftDays() {
  return moneyOptionBDaysLeft();
}

function msDaysLeftInCurrentMonth() {
  return moneyOptionBDaysLeft();
}

function msMoneyLeftDaysRemaining() {
  return moneyOptionBDaysLeft();
}

function moneySafeSpendDaysLeft() {
  return moneyOptionBDaysLeft();
}

function moneyPatchOptionBDayDisplays() {
  const days = moneyOptionBDaysLeft();
  const text = `${days} day${days === 1 ? '' : 's'} left`;

  const metaEls = [
    document.getElementById('perDayMeta'),
    document.querySelector('[data-per-day-meta]'),
    document.querySelector('.per-day .meta')
  ].filter(Boolean);

  metaEls.forEach(el => {
    el.textContent = text;
  });

  document.querySelectorAll('.money-hero-sub').forEach(el => {
    const stillToPayMatch = String(el.textContent || '').match(/·\s*(.*still to pay)/i);
    const stillToPay = stillToPayMatch ? stillToPayMatch[1] : '';
    el.textContent = stillToPay ? `${text} · ${stillToPay}` : text;
  });
}

document.addEventListener('DOMContentLoaded', function() {
  moneyPatchOptionBDayDisplays();
  setTimeout(moneyPatchOptionBDayDisplays, 500);
  setTimeout(moneyPatchOptionBDayDisplays, 1200);
});

document.addEventListener('input', function(event) {
  if (event.target && event.target.id === 'leftAmount') {
    setTimeout(moneyPatchOptionBDayDisplays, 100);
  }
}, true);

document.addEventListener('click', function(event) {
  if (event.target.closest('.tabs, .paid-toggle, [data-paid-row], #reloadBarBtn, .sort-pill')) {
    setTimeout(moneyPatchOptionBDayDisplays, 300);
    setTimeout(moneyPatchOptionBDayDisplays, 900);
  }
}, true);


// Safe to spend today must use the same Option B logic:
// include today, exclude end/reset date.
function moneySafeSpendOptionBValue(){ return moneyLeftPerDayRebuiltUpdate(); }

function moneyApplySafeSpendOptionB(){ return moneyLeftPerDayRebuiltUpdate(); }

function moneyPatchSafeSpendDashboardBuilder() {
  if (window.__moneySafeSpendOptionBPatched) return;
  if (typeof moneyBuildDashboardHTML !== 'function') return;

  window.__moneySafeSpendOptionBPatched = true;

  const original = moneyBuildDashboardHTML;

  moneyBuildDashboardHTML = function(...args) {
    let out = String(original.apply(this, args));

    const value = moneySafeSpendOptionBValue();
    const days = typeof moneyOptionBDaysLeft === 'function'
      ? moneyOptionBDaysLeft()
      : 1;

    const daysText = `${days} day${days === 1 ? '' : 's'} left`;

    out = out.replace(
      /(<div class="money-hero-amount">)([\s\S]*?)(<\/div>)/,
      `$1${value}$3`
    );

    out = out.replace(
      /(Safe to spend: )[^<]+?( per day\.)/,
      `$1${value}$2`
    );

    out = out.replace(
      /(You are short by )[^<]+?( per day\.)/,
      `Safe to spend: ${value} per day.`
    );

    out = out.replace(
      /(<div class="money-hero-sub">)([\s\S]*?)( · [\s\S]*? still to pay<\/div>)/,
      `$1${daysText}$3`
    );

    return out;
  };
}

document.addEventListener('DOMContentLoaded', function() {
  moneyPatchSafeSpendDashboardBuilder();
  moneyApplySafeSpendOptionB();

  setTimeout(moneyApplySafeSpendOptionB, 500);
  setTimeout(moneyApplySafeSpendOptionB, 1200);
});

document.addEventListener('input', function(event) {
  if (event.target && event.target.id === 'leftAmount') {
    setTimeout(moneyApplySafeSpendOptionB, 50);
    setTimeout(moneyApplySafeSpendOptionB, 250);
    setTimeout(() => {
      if (typeof moneyInsertDashboard === 'function') moneyInsertDashboard();
      moneyApplySafeSpendOptionB();
    }, 450);
  }
}, true);

document.addEventListener('click', function(event) {
  if (event.target.closest('.tabs, .paid-toggle, [data-paid-row], #reloadBarBtn, .sort-pill')) {
    setTimeout(moneyApplySafeSpendOptionB, 250);
    setTimeout(moneyApplySafeSpendOptionB, 800);
  }
}, true);


// Final Money Left per day Option B fix.
// Forces the original Money Left per day box to use:
// include today, exclude selected/end date.
function moneyOptionBDaysText() {
  const days = typeof moneyOptionBDaysLeft === 'function'
    ? moneyOptionBDaysLeft()
    : 1;
  return `${days} day${days === 1 ? '' : 's'} left`;
}

function moneyUpdateOriginalPerDayBoxOptionB(){ return moneyLeftPerDayRebuiltUpdate(); }

function moneyPatchOriginalPerDayFunctionsOptionB(){ return moneyLeftPerDayRebuiltUpdate(); }

document.addEventListener('DOMContentLoaded', function() {
  moneyPatchOriginalPerDayFunctionsOptionB();
  setTimeout(moneyUpdateOriginalPerDayBoxOptionB, 300);
  setTimeout(moneyUpdateOriginalPerDayBoxOptionB, 900);
  setTimeout(moneyUpdateOriginalPerDayBoxOptionB, 1600);
});

document.addEventListener('input', function(event) {
  if (event.target && event.target.id === 'leftAmount') {
    setTimeout(moneyUpdateOriginalPerDayBoxOptionB, 0);
    setTimeout(moneyUpdateOriginalPerDayBoxOptionB, 160);
  }
}, true);

document.addEventListener('click', function(event) {
  if (event.target.closest('.tabs, .paid-toggle, [data-paid-row], #reloadBarBtn, .sort-pill')) {
    setTimeout(moneyUpdateOriginalPerDayBoxOptionB, 250);
    setTimeout(moneyUpdateOriginalPerDayBoxOptionB, 800);
  }
}, true);


// ============================================================================
// Money Left per day — rebuilt from scratch
// Single source of truth.
// Formula:
//   (Money Left - total unpaid bills) / Option B days
//
// Option B days:
//   Include today, exclude selected/end/reset date.
//   Example: 12th -> 30th = 18 days, counting 12..29.
// ============================================================================

function moneyLeftRebuiltParseMoney(value) {
  const cleaned = String(value || '')
    .replace(/,/g, '')
    .replace(/£/g, '')
    .replace(/[^\d.-]/g, '');
  const n = parseFloat(cleaned);
  return Number.isFinite(n) ? n : 0;
}

function moneyLeftRebuiltFmt(value) {
  if (typeof fmtMoney === 'function') return fmtMoney(value || 0);
  const sign = value < 0 ? '-' : '';
  return sign + '£' + Math.abs(value || 0).toFixed(2);
}

function moneyLeftRebuiltSelectedEndDay() {
  // Prefer explicit date/end-date controls if the app has one.
  const controls = [
    document.getElementById('endDate'),
    document.getElementById('targetDate'),
    document.getElementById('selectedDate'),
    document.querySelector('[data-end-date]'),
    document.querySelector('input[type="date"]')
  ].filter(Boolean);

  for (const el of controls) {
    const raw = (el.dataset && el.dataset.endDate) ? el.dataset.endDate : el.value;
    if (!raw) continue;

    // YYYY-MM-DD
    const iso = String(raw).match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
    if (iso) {
      return {
        year: parseInt(iso[1], 10),
        month: parseInt(iso[2], 10) - 1,
        day: parseInt(iso[3], 10)
      };
    }

    // DD/MM/YYYY or DD-MM-YYYY
    const uk = String(raw).match(/^(\d{1,2})[\/.-](\d{1,2})(?:[\/.-](\d{2,4}))?$/);
    if (uk) {
      const now = new Date();
      const year = uk[3] ? parseInt(uk[3].length === 2 ? '20' + uk[3] : uk[3], 10) : now.getFullYear();
      return {
        year,
        month: parseInt(uk[2], 10) - 1,
        day: parseInt(uk[1], 10)
      };
    }
  }

  // If there is no explicit control, use the selected/current month table's last day.
  // This avoids timezone offsets and keeps month maths deterministic.
  const now = new Date();
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return {
    year: end.getFullYear(),
    month: end.getMonth(),
    day: end.getDate()
  };
}

function moneyLeftRebuiltDaysLeft() {
  const now = new Date();

  const todayUTC = Date.UTC(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const endParts = moneyLeftRebuiltSelectedEndDay();
  const endUTC = Date.UTC(
    endParts.year,
    endParts.month,
    endParts.day
  );

  // Option B: include today, exclude end date.
  // Calendar-day difference gives exactly that.
  // Example: 12 -> 30 = 18.
  const days = Math.floor((endUTC - todayUTC) / 86400000);

  return Math.max(1, days);
}

function moneyLeftRebuiltUnpaidTotal() {
  try {
    const picker = document.getElementById('monthPicker');
    const table = CACHED_TABLES[picker && picker.value !== '' ? picker.value : 0] || CACHED_TABLES[0];
    if (!table || !Array.isArray(table.rows)) return 0;

    return table.rows.reduce((sum, row) => {
      const paid = typeof isRowPaid === 'function' ? isRowPaid(row) : false;
      if (paid) return sum;

      // In this app row.paid is the outstanding/current unpaid amount.
      const outstanding = Number(row.paid || 0);
      const due = Number(row.due || 0);
      return sum + (outstanding || due || 0);
    }, 0);
  } catch (e) {
    return 0;
  }
}

function moneyLeftPerDayRebuiltValue() {
  const leftInput = document.getElementById('leftAmount');
  const left = moneyLeftRebuiltParseMoney(leftInput ? leftInput.value : 0);
  const unpaid = moneyLeftRebuiltUnpaidTotal();
  const days = moneyLeftRebuiltDaysLeft();

  return {
    left,
    unpaid,
    days,
    perDay: (left - unpaid) / Math.max(1, days)
  };
}

function moneyLeftPerDayRebuiltUpdate() {
  const calc = moneyLeftPerDayRebuiltValue();
  const amountText = moneyLeftRebuiltFmt(calc.perDay);
  const daysText = `${calc.days} day${calc.days === 1 ? '' : 's'} left`;

  const valueEls = [
    document.getElementById('perDayValue'),
    document.getElementById('perDayValueEl'),
    document.querySelector('[data-per-day-value]'),
    document.querySelector('.per-day .big')
  ].filter(Boolean);

  const metaEls = [
    document.getElementById('perDayMeta'),
    document.querySelector('[data-per-day-meta]'),
    document.querySelector('.per-day .meta')
  ].filter(Boolean);

  valueEls.forEach(el => {
    el.textContent = amountText;
    el.dataset.rebuiltPerDay = '1';
  });

  metaEls.forEach(el => {
    el.textContent = daysText;
    el.dataset.rebuiltDays = String(calc.days);
  });

  // Keep hero/dashboard aligned with this exact source of truth.
  document.querySelectorAll('.money-hero-amount').forEach(el => {
    el.textContent = amountText;
  });

  document.querySelectorAll('.money-hero-sub').forEach(el => {
    el.textContent = `${daysText} · ${moneyLeftRebuiltFmt(calc.unpaid)} still to pay`;
  });

  document.querySelectorAll('.money-insight').forEach(insight => {
    const text = String(insight.textContent || '').toLowerCase();
    if (text.includes('safe to spend') || text.includes('short by')) {
      const target = insight.querySelector('span:not(.money-insight-icon)') || insight;
      target.textContent = `Safe to spend: ${amountText} per day.`;
    }
  });

  return calc;
}

function moneyLeftPerDayRebuiltPatchDashboard() {
  if (window.__moneyLeftPerDayRebuiltDashboardPatched) return;
  if (typeof moneyBuildDashboardHTML !== 'function') return;

  window.__moneyLeftPerDayRebuiltDashboardPatched = true;
  const original = moneyBuildDashboardHTML;

  moneyBuildDashboardHTML = function(...args) {
    let out = String(original.apply(this, args));
    const calc = moneyLeftPerDayRebuiltValue();
    const amountText = moneyLeftRebuiltFmt(calc.perDay);
    const daysText = `${calc.days} day${calc.days === 1 ? '' : 's'} left`;

    out = out.replace(
      /(<div class="money-hero-amount">)([\s\S]*?)(<\/div>)/,
      `$1${amountText}$3`
    );

    out = out.replace(
      /(<div class="money-hero-sub">)([\s\S]*?)(<\/div>)/,
      `$1${daysText} · ${moneyLeftRebuiltFmt(calc.unpaid)} still to pay$3`
    );

    out = out.replace(
      /(Safe to spend: )[^<]+?( per day\.)/,
      `$1${amountText}$2`
    );

    out = out.replace(
      /(You are short by )[^<]+?( per day\.)/,
      `Safe to spend: ${amountText} per day.`
    );

    return out;
  };
}

function moneyLeftPerDayRebuiltWire() {
  moneyLeftPerDayRebuiltPatchDashboard();
  moneyLeftPerDayRebuiltUpdate();

  const input = document.getElementById('leftAmount');
  if (input && !input.dataset.rebuiltPerDayWired) {
    input.dataset.rebuiltPerDayWired = '1';
    input.addEventListener('input', () => setTimeout(moneyLeftPerDayRebuiltUpdate, 0), true);
    input.addEventListener('change', () => setTimeout(moneyLeftPerDayRebuiltUpdate, 0), true);
    input.addEventListener('blur', () => setTimeout(moneyLeftPerDayRebuiltUpdate, 0), true);
  }
}

// Override previous function names so any existing app hooks call this rebuilt logic.
window.msMoneyLeftDays = moneyLeftRebuiltDaysLeft;
window.msUpdateMoneyLeftPerDaySimple = moneyLeftPerDayRebuiltUpdate;
window.msMoneyLeftRecalc = moneyLeftPerDayRebuiltUpdate;
window.msUpdateLeftAmountPerDay = moneyLeftPerDayRebuiltUpdate;
window.msRecalculatePerDayFromLeftAmount = moneyLeftPerDayRebuiltUpdate;
window.moneyUpdateOriginalPerDayBoxOptionB = moneyLeftPerDayRebuiltUpdate;

document.addEventListener('DOMContentLoaded', function() {
  moneyLeftPerDayRebuiltWire();
  setTimeout(moneyLeftPerDayRebuiltWire, 300);
  setTimeout(moneyLeftPerDayRebuiltWire, 900);
  setTimeout(moneyLeftPerDayRebuiltWire, 1600);
});

document.addEventListener('click', function(event) {
  if (event.target.closest('.tabs, .paid-toggle, [data-paid-row], #reloadBarBtn, .sort-pill, #monthPicker')) {
    setTimeout(moneyLeftPerDayRebuiltWire, 120);
    setTimeout(moneyLeftPerDayRebuiltWire, 500);
  }
}, true);

document.addEventListener('change', function(event) {
  if (event.target && (event.target.id === 'monthPicker' || event.target.id === 'leftAmount')) {
    setTimeout(moneyLeftPerDayRebuiltWire, 0);
  }
}, true);


// Compatibility shim for older render hooks.
// Older code still calls msWireLeftAmountUpdate(); route it to the rebuilt calc.
function msWireLeftAmountUpdate() {
  if (typeof moneyLeftPerDayRebuiltWire === 'function') {
    return moneyLeftPerDayRebuiltWire();
  }
  if (typeof moneyLeftPerDayRebuiltUpdate === 'function') {
    return moneyLeftPerDayRebuiltUpdate();
  }
}


// Safe to spend today mirror fix.
// The hero card no longer calculates its own amount.
// It mirrors the existing Money Left per day / left-to-pay display directly.
function moneyFindPrimaryLeftPerDayValue() {
  return (
    document.getElementById('perDayValue') ||
    document.getElementById('perDayValueEl') ||
    document.querySelector('[data-per-day-value]') ||
    document.querySelector('.per-day .big')
  );
}

function moneyFindPrimaryLeftPerDayMeta() {
  return (
    document.getElementById('perDayMeta') ||
    document.querySelector('[data-per-day-meta]') ||
    document.querySelector('.per-day .meta')
  );
}

function moneyMirrorSafeSpendFromPrimary() {
  const valueEl = moneyFindPrimaryLeftPerDayValue();
  const metaEl = moneyFindPrimaryLeftPerDayMeta();

  const value = valueEl ? String(valueEl.textContent || '').trim() : '';
  const meta = metaEl ? String(metaEl.textContent || '').trim() : '';

  if (value) {
    document.querySelectorAll('.money-hero-amount').forEach(el => {
      el.textContent = value;
      el.dataset.mirrorsPrimaryPerDay = '1';
    });

    document.querySelectorAll('.money-insight').forEach(insight => {
      const text = String(insight.textContent || '').toLowerCase();
      if (text.includes('safe to spend') || text.includes('short by')) {
        const target = insight.querySelector('span:not(.money-insight-icon)') || insight;
        target.textContent = `Safe to spend: ${value} per day.`;
      }
    });
  }

  if (meta) {
    document.querySelectorAll('.money-hero-sub').forEach(el => {
      const oldText = String(el.textContent || '');
      const stillToPayMatch = oldText.match(/·\s*(.*still to pay)/i);
      const stillToPay = stillToPayMatch ? stillToPayMatch[1] : '';
      el.textContent = stillToPay ? `${meta} · ${stillToPay}` : meta;
    });
  }
}

function moneyPatchDashboardHeroMirror() {
  if (window.__moneyHeroMirrorPatched) return;
  if (typeof moneyBuildDashboardHTML !== 'function') return;

  window.__moneyHeroMirrorPatched = true;
  const original = moneyBuildDashboardHTML;

  moneyBuildDashboardHTML = function(...args) {
    let out = String(original.apply(this, args));

    const valueEl = moneyFindPrimaryLeftPerDayValue();
    const metaEl = moneyFindPrimaryLeftPerDayMeta();

    const value = valueEl ? String(valueEl.textContent || '').trim() : '';
    const meta = metaEl ? String(metaEl.textContent || '').trim() : '';

    if (value) {
      out = out.replace(
        /(<div class="money-hero-amount">)([\s\S]*?)(<\/div>)/,
        `$1${value}$3`
      );

      out = out.replace(
        /(Safe to spend: )[^<]+?( per day\.)/,
        `$1${value}$2`
      );

      out = out.replace(
        /(You are short by )[^<]+?( per day\.)/,
        `Safe to spend: ${value} per day.`
      );
    }

    if (meta) {
      out = out.replace(
        /(<div class="money-hero-sub">)([\s\S]*?)( · [\s\S]*? still to pay<\/div>)/,
        `$1${meta}$3`
      );

      out = out.replace(
        /(<div class="money-hero-sub">)([\s\S]*?)(<\/div>)/,
        (match, start, middle, end) => {
          if (String(middle).includes('still to pay')) return match;
          return `${start}${meta}${end}`;
        }
      );
    }

    return out;
  };
}

function moneyWireSafeSpendMirror() {
  moneyPatchDashboardHeroMirror();
  moneyMirrorSafeSpendFromPrimary();

  [moneyFindPrimaryLeftPerDayValue(), moneyFindPrimaryLeftPerDayMeta()].forEach(el => {
    if (!el || el.dataset.safeSpendMirrorObserver) return;
    el.dataset.safeSpendMirrorObserver = '1';

    new MutationObserver(() => {
      setTimeout(moneyMirrorSafeSpendFromPrimary, 0);
      setTimeout(() => {
        if (typeof moneyInsertDashboard === 'function') moneyInsertDashboard();
        moneyMirrorSafeSpendFromPrimary();
      }, 120);
    }).observe(el, { childList: true, characterData: true, subtree: true });
  });
}

document.addEventListener('DOMContentLoaded', function() {
  moneyWireSafeSpendMirror();
  setTimeout(moneyWireSafeSpendMirror, 400);
  setTimeout(moneyWireSafeSpendMirror, 1000);
  setTimeout(moneyWireSafeSpendMirror, 1800);
});

document.addEventListener('input', function(event) {
  if (event.target && event.target.id === 'leftAmount') {
    setTimeout(moneyWireSafeSpendMirror, 80);
    setTimeout(moneyWireSafeSpendMirror, 350);
  }
}, true);

document.addEventListener('click', function(event) {
  if (event.target.closest('.tabs, .paid-toggle, [data-paid-row], #reloadBarBtn, .sort-pill, #monthPicker')) {
    setTimeout(moneyWireSafeSpendMirror, 250);
    setTimeout(moneyWireSafeSpendMirror, 850);
  }
}, true);


// HARD FINAL FIX:
// Safe to spend today must visually equal the primary Money Left per day display.
// This runs after every render/update and also on a short interval so rebuilds cannot overwrite it.
function moneyPrimaryPerDayValueText() {
  const selectors = [
    '#perDayValue',
    '#perDayValueEl',
    '[data-per-day-value]',
    '.per-day .big'
  ];

  for (const selector of selectors) {
    const el = document.querySelector(selector);
    if (el && String(el.textContent || '').trim()) {
      return String(el.textContent || '').trim();
    }
  }

  return '';
}

function moneyPrimaryPerDayMetaText() {
  const selectors = [
    '#perDayMeta',
    '[data-per-day-meta]',
    '.per-day .meta'
  ];

  for (const selector of selectors) {
    const el = document.querySelector(selector);
    if (el && String(el.textContent || '').trim()) {
      return String(el.textContent || '').trim();
    }
  }

  return '';
}

function moneyForceSafeSpendMatch() {
  const value = moneyPrimaryPerDayValueText();
  const meta = moneyPrimaryPerDayMetaText();

  if (value) {
    document.querySelectorAll('.money-hero-amount').forEach(el => {
      if (el.textContent !== value) el.textContent = value;
      el.setAttribute('data-force-matched-per-day', '1');
    });

    document.querySelectorAll('.money-insight').forEach(insight => {
      const text = String(insight.textContent || '').toLowerCase();
      if (text.includes('safe to spend') || text.includes('short by')) {
        const target = insight.querySelector('span:not(.money-insight-icon)') || insight;
        const newText = `Safe to spend: ${value} per day.`;
        if (target.textContent !== newText) target.textContent = newText;
      }
    });
  }

  if (meta) {
    document.querySelectorAll('.money-hero-sub').forEach(el => {
      const old = String(el.textContent || '');
      const still = old.match(/·\s*(.*still to pay)/i);
      const suffix = still ? ` · ${still[1]}` : '';
      const next = `${meta}${suffix}`;
      if (el.textContent !== next) el.textContent = next;
    });
  }
}

function moneyPatchDashboardHTMLForceMatch() {
  if (window.__moneyPatchDashboardHTMLForceMatch) return;
  if (typeof moneyBuildDashboardHTML !== 'function') return;

  window.__moneyPatchDashboardHTMLForceMatch = true;
  const original = moneyBuildDashboardHTML;

  moneyBuildDashboardHTML = function(...args) {
    let out = String(original.apply(this, args));

    // Put harmless placeholders in the dashboard HTML.
    // The force matcher replaces them immediately after render with the real primary value.
    out = out.replace(
      /(<div class="money-hero-amount">)([\s\S]*?)(<\/div>)/,
      '$1<span data-safe-spend-placeholder="1">—</span>$3'
    );

    out = out.replace(
      /(Safe to spend: )[^<]+?( per day\.)/,
      '$1—$2'
    );

    return out;
  };
}

function moneyStartSafeSpendForceMatch() {
  moneyPatchDashboardHTMLForceMatch();
  moneyForceSafeSpendMatch();

  if (!window.__moneySafeSpendForceInterval) {
    window.__moneySafeSpendForceInterval = setInterval(moneyForceSafeSpendMatch, 250);
  }

  const root = document.getElementById('content') || document.getElementById('app') || document.body;
  if (root && !root.dataset.safeSpendForceObserver) {
    root.dataset.safeSpendForceObserver = '1';
    const observer = new MutationObserver(() => {
      requestAnimationFrame(moneyForceSafeSpendMatch);
    });
    observer.observe(root, { childList: true, subtree: true, characterData: true });
  }
}

document.addEventListener('DOMContentLoaded', function() {
  moneyStartSafeSpendForceMatch();
  setTimeout(moneyStartSafeSpendForceMatch, 500);
  setTimeout(moneyStartSafeSpendForceMatch, 1500);
});

document.addEventListener('input', function(event) {
  if (event.target && event.target.id === 'leftAmount') {
    setTimeout(moneyForceSafeSpendMatch, 0);
    setTimeout(moneyForceSafeSpendMatch, 150);
    setTimeout(moneyForceSafeSpendMatch, 450);
  }
}, true);

document.addEventListener('click', function(event) {
  if (event.target.closest('.tabs, .paid-toggle, [data-paid-row], #reloadBarBtn, .sort-pill, #monthPicker')) {
    setTimeout(moneyForceSafeSpendMatch, 100);
    setTimeout(moneyForceSafeSpendMatch, 400);
    setTimeout(moneyForceSafeSpendMatch, 1000);
  }
}, true);


// Move the main summary card under the search bar, where Safe to Spend used to be.
function moneyMoveSummaryUnderSearch() {
  const content = document.getElementById('content') || document.getElementById('app') || document.body;

  const search =
    document.getElementById('searchBills') ||
    document.querySelector('input[type="search"]') ||
    document.querySelector('.search-input');

  if (!content || !search) return;

  const searchBlock =
    search.closest('.search-row, .filters, .toolbar, .controls, .search-wrap, .searchbar') ||
    search.parentElement;

  if (!searchBlock || !searchBlock.parentNode) return;

  const cards = Array.from(document.querySelectorAll('.summary-card, .card.summary, .balance-card, [class*="summary"]'));

  // Pick the card that contains the real summary labels.
  const summary = cards.find(card => {
    const text = String(card.textContent || '').toLowerCase();
    return (
      text.includes('outstanding') ||
      text.includes('paid so far') ||
      text.includes('money left') ||
      text.includes('left amount')
    );
  });

  if (!summary || summary.dataset.movedUnderSearch === '1') return;

  summary.dataset.movedUnderSearch = '1';
  summary.classList.add('money-summary-under-search');

  searchBlock.parentNode.insertBefore(summary, searchBlock.nextSibling);
}

function moneyWireMoveSummaryUnderSearch() {
  moneyMoveSummaryUnderSearch();

  const root = document.getElementById('content') || document.getElementById('app') || document.body;
  if (root && !root.dataset.summaryMoveObserver) {
    root.dataset.summaryMoveObserver = '1';
    new MutationObserver(() => {
      clearTimeout(window.__moneyMoveSummaryTimer);
      window.__moneyMoveSummaryTimer = setTimeout(moneyMoveSummaryUnderSearch, 80);
    }).observe(root, { childList: true, subtree: true });
  }
}

document.addEventListener('DOMContentLoaded', function() {
  moneyWireMoveSummaryUnderSearch();
  setTimeout(moneyWireMoveSummaryUnderSearch, 400);
  setTimeout(moneyWireMoveSummaryUnderSearch, 1200);
});

document.addEventListener('click', function(event) {
  if (event.target.closest('.tabs, .paid-toggle, [data-paid-row], #reloadBarBtn, .sort-pill, #monthPicker')) {
    setTimeout(moneyMoveSummaryUnderSearch, 250);
    setTimeout(moneyMoveSummaryUnderSearch, 800);
  }
}, true);


// Mini analytics graph: compact iOS-style monthly snapshot.
function moneyMiniAnalyticsParse(text) {
  const n = parseFloat(String(text || '').replace(/,/g,'').replace(/£/g,'').replace(/[^\d.-]/g,''));
  return Number.isFinite(n) ? n : 0;
}

function moneyMiniAnalyticsFmt(n) {
  if (typeof fmtMoney === 'function') return fmtMoney(n || 0);
  return '£' + (n || 0).toFixed(2);
}

function moneyMiniAnalyticsRows() {
  try {
    const picker = document.getElementById('monthPicker');
    const table = CACHED_TABLES[picker && picker.value !== '' ? picker.value : 0] || CACHED_TABLES[0];
    return table && Array.isArray(table.rows) ? table.rows : [];
  } catch(e) {
    return [];
  }
}

function moneyMiniAnalyticsMetrics() {
  const rows = moneyMiniAnalyticsRows();
  const paidRows = rows.filter(r => typeof isRowPaid === 'function' ? isRowPaid(r) : false);
  const unpaidRows = rows.filter(r => !(typeof isRowPaid === 'function' ? isRowPaid(r) : false));

  const paid = paidRows.reduce((s,r)=>s + Number(r.due || 0), 0);
  const unpaid = unpaidRows.reduce((s,r)=>s + (Number(r.paid || 0) || Number(r.due || 0)), 0);

  const leftInput = document.getElementById('leftAmount');
  const left = moneyMiniAnalyticsParse(leftInput ? leftInput.value : 0);

  const perDayText = (
    document.getElementById('perDayValue') ||
    document.getElementById('perDayValueEl') ||
    document.querySelector('[data-per-day-value]') ||
    document.querySelector('.per-day .big')
  )?.textContent || '';

  const perDay = moneyMiniAnalyticsParse(perDayText);

  return { paid, unpaid, left, perDay };
}

function moneyMiniAnalyticsPath(values, width, height, pad) {
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = Math.max(1, max - min);
  const step = (width - pad * 2) / Math.max(1, values.length - 1);

  const points = values.map((v, i) => {
    const x = pad + i * step;
    const y = height - pad - ((v - min) / range) * (height - pad * 2);
    return [x, y];
  });

  const d = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
  const area = `${d} L ${points[points.length-1][0].toFixed(1)} ${(height-pad).toFixed(1)} L ${points[0][0].toFixed(1)} ${(height-pad).toFixed(1)} Z`;

  return { d, area, points };
}

function moneyRenderMiniAnalytics() {
  const content = document.getElementById('content') || document.getElementById('app') || document.body;
  if (!content) return;

  let card = document.getElementById('moneyMiniAnalytics');
  if (!card) {
    card = document.createElement('section');
    card.id = 'moneyMiniAnalytics';
    card.className = 'money-mini-analytics';

    const summary = document.querySelector('.money-summary-under-search');
    const dashboard = document.getElementById('moneySmartDashboard');
    const tabs = document.querySelector('.tabs');

    if (summary && summary.parentNode) {
      summary.parentNode.insertBefore(card, summary.nextSibling);
    } else if (dashboard && dashboard.parentNode) {
      dashboard.parentNode.insertBefore(card, dashboard.firstChild);
    } else if (tabs && tabs.parentNode) {
      tabs.parentNode.insertBefore(card, tabs);
    } else {
      content.prepend(card);
    }
  }

  const m = moneyMiniAnalyticsMetrics();

  // Synthetic trend: starts with left + unpaid, then gradually moves towards remaining buffer.
  // It is intentionally a compact "health curve", not bank history.
  const start = Math.max(0, m.left + m.unpaid * 0.28);
  const mid1 = Math.max(0, m.left + m.unpaid * 0.14);
  const mid2 = Math.max(0, m.left - m.unpaid * 0.20);
  const end = Math.max(0, m.left - m.unpaid);
  const values = [start, mid1, m.left, mid2, end];

  const width = 360;
  const height = 92;
  const pad = 10;
  const chart = moneyMiniAnalyticsPath(values, width, height, pad);
  const last = chart.points[chart.points.length - 1];

  card.innerHTML = `
    <div class="money-mini-analytics-head">
      <div>
        <div class="money-mini-analytics-title">Mini analytics</div>
        <div class="money-mini-analytics-sub">Month health curve</div>
      </div>
      <div class="money-mini-analytics-sub">${m.perDay ? moneyMiniAnalyticsFmt(m.perDay) + '/day' : 'Live'}</div>
    </div>

    <svg class="money-mini-chart" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" aria-label="Mini analytics graph">
      <line class="grid" x1="${pad}" y1="${height-pad}" x2="${width-pad}" y2="${height-pad}"></line>
      <line class="grid" x1="${pad}" y1="${height/2}" x2="${width-pad}" y2="${height/2}"></line>
      <path class="area" d="${chart.area}"></path>
      <path class="line" d="${chart.d}"></path>
      <circle class="dot" cx="${last[0].toFixed(1)}" cy="${last[1].toFixed(1)}" r="4"></circle>
    </svg>

    <div class="money-mini-legend">
      <div class="money-mini-legend-item"><strong>${moneyMiniAnalyticsFmt(m.left)}</strong><span>Money left</span></div>
      <div class="money-mini-legend-item"><strong>${moneyMiniAnalyticsFmt(m.unpaid)}</strong><span>Unpaid</span></div>
      <div class="money-mini-legend-item"><strong>${moneyMiniAnalyticsFmt(m.paid)}</strong><span>Paid</span></div>
    </div>
  `;
}

function moneyWireMiniAnalytics() {
  moneyRenderMiniAnalytics();

  const root = document.getElementById('content') || document.getElementById('app') || document.body;
  if (root && !root.dataset.miniAnalyticsObserver) {
    root.dataset.miniAnalyticsObserver = '1';
    new MutationObserver(() => {
      clearTimeout(window.__moneyMiniAnalyticsTimer);
      window.__moneyMiniAnalyticsTimer = setTimeout(moneyRenderMiniAnalytics, 120);
    }).observe(root, { childList: true, subtree: true, characterData: true });
  }
}

document.addEventListener('DOMContentLoaded', function() {
  moneyWireMiniAnalytics();
  setTimeout(moneyWireMiniAnalytics, 700);
  setTimeout(moneyWireMiniAnalytics, 1600);
});

document.addEventListener('input', function(event) {
  if (event.target && event.target.id === 'leftAmount') {
    setTimeout(moneyRenderMiniAnalytics, 80);
    setTimeout(moneyRenderMiniAnalytics, 350);
  }
}, true);

document.addEventListener('click', function(event) {
  if (event.target.closest('.tabs, .paid-toggle, [data-paid-row], #reloadBarBtn, .sort-pill, #monthPicker')) {
    setTimeout(moneyRenderMiniAnalytics, 300);
    setTimeout(moneyRenderMiniAnalytics, 900);
  }
}, true);


// Collapsible Bills section.
function moneyBillsFindList() {
  return (
    document.querySelector('.bill-list') ||
    document.querySelector('[class*="bill-list"]') ||
    document.querySelector('.items') ||
    document.querySelector('.list')
  );
}

function moneyBillsCountsText() {
  try {
    const rows = (() => {
      const picker = document.getElementById('monthPicker');
      const table = CACHED_TABLES[picker && picker.value !== '' ? picker.value : 0] || CACHED_TABLES[0];
      return table && Array.isArray(table.rows) ? table.rows : [];
    })();

    const unpaid = rows.filter(r => !(typeof isRowPaid === 'function' ? isRowPaid(r) : false)).length;
    const paid = rows.filter(r => typeof isRowPaid === 'function' ? isRowPaid(r) : false).length;

    return `${unpaid} unpaid · ${paid} paid`;
  } catch (e) {
    return 'Tap to show or hide';
  }
}

function moneyWireBillsCollapsible_DISABLED() {
  const list = moneyBillsFindList();
  if (!list) return;

  list.classList.add('money-bills-collapsible-target');

  let toggle = document.getElementById('moneyBillsToggle');

  if (!toggle) {
    toggle = document.createElement('button');
    toggle.id = 'moneyBillsToggle';
    toggle.type = 'button';
    toggle.className = 'money-bills-toggle';
    toggle.setAttribute('aria-expanded', document.body.classList.contains('money-bills-collapsed') ? 'false' : 'true');

    const tabs = document.querySelector('.tabs');
    const insertBefore = tabs || list;

    insertBefore.parentNode.insertBefore(toggle, insertBefore.nextSibling || list);
  }

  toggle.innerHTML = `
    <span class="money-bills-toggle-left">
      <span class="money-bills-toggle-title">Bills</span>
      <span class="money-bills-toggle-sub">${moneyBillsCountsText()}</span>
    </span>
    <span class="money-bills-toggle-icon">⌄</span>
  `;

  if (!toggle.dataset.billsCollapseWired) {
    toggle.dataset.billsCollapseWired = '1';

    const saved = localStorage.getItem('money.bills.collapsed');
    if (saved === '1') {
      document.body.classList.add('money-bills-collapsed');
      toggle.setAttribute('aria-expanded', 'false');
    }

    toggle.addEventListener('click', function() {
      const collapsed = document.body.classList.toggle('money-bills-collapsed');
      localStorage.setItem('money.bills.collapsed', collapsed ? '1' : '0');
      toggle.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
    });
  }
}

document.addEventListener('DOMContentLoaded', function() {
  /* disabled v1 */
  setTimeout(function(){}, 500);
  setTimeout(function(){}, 1400);
});

document.addEventListener('click', function(event) {
  if (event.target.closest('.tabs, .paid-toggle, [data-paid-row], #reloadBarBtn, .sort-pill, #monthPicker')) {
    setTimeout(function(){}, 250);
    setTimeout(function(){}, 900);
  }
}, true);

document.addEventListener('input', function(event) {
  if (event.target && event.target.id === 'leftAmount') {
    setTimeout(function(){}, 200);
  }
}, true);


// Collapsible Bills v2: wraps the actual bill-card nodes, not a guessed list selector.
function moneyBillsV2Rows() {
  try {
    const picker = document.getElementById('monthPicker');
    const table = CACHED_TABLES[picker && picker.value !== '' ? picker.value : 0] || CACHED_TABLES[0];
    return table && Array.isArray(table.rows) ? table.rows : [];
  } catch(e) {
    return [];
  }
}

function moneyBillsV2Subtitle() {
  const rows = moneyBillsV2Rows();
  if (!rows.length) return 'Tap to show or hide bills';

  const paid = rows.filter(r => typeof isRowPaid === 'function' ? isRowPaid(r) : false).length;
  const unpaid = rows.length - paid;

  return `${unpaid} unpaid · ${paid} paid`;
}

function moneyBillsV2FindFirstBill() {
  return (
    document.querySelector('.money-swipe-wrap') ||
    document.querySelector('.bill-card') ||
    document.querySelector('article[class*="bill"]') ||
    document.querySelector('.item-card') ||
    document.querySelector('.row-card')
  );
}

function moneyBillsV2CardNodes() {
  // Prefer swipe wrappers if present, otherwise the actual card nodes.
  const wrappers = Array.from(document.querySelectorAll('.money-swipe-wrap'));
  if (wrappers.length) return wrappers;

  return Array.from(document.querySelectorAll('.bill-card, article[class*="bill"], .item-card, .row-card'))
    .filter(node => !node.closest('#moneySmartDashboard') && !node.closest('#moneyMiniAnalytics'));
}

function moneyBillsV2Build() {
  const first = moneyBillsV2FindFirstBill();
  if (!first) return;

  let header = document.getElementById('moneyBillsHeaderV2');
  let wrap = document.getElementById('moneyBillsListWrapV2');

  if (!header) {
    header = document.createElement('button');
    header.id = 'moneyBillsHeaderV2';
    header.type = 'button';
    header.className = 'money-bills-header-v2';

    const anchor = document.querySelector('.tabs') || first;
    anchor.parentNode.insertBefore(header, anchor.nextSibling);
  }

  if (!wrap) {
    wrap = document.createElement('div');
    wrap.id = 'moneyBillsListWrapV2';
    wrap.className = 'money-bills-list-wrap-v2';

    header.parentNode.insertBefore(wrap, header.nextSibling);
  }

  header.innerHTML = `
    <span>
      <strong>Bills</strong>
      <span>${moneyBillsV2Subtitle()}</span>
    </span>
    <span class="money-bills-chevron-v2">⌄</span>
  `;

  if (!header.dataset.v2Wired) {
    header.dataset.v2Wired = '1';

    if (localStorage.getItem('money.bills.collapsed.v2') === '1') {
      document.body.classList.add('money-bills-collapsed-v2');
      header.setAttribute('aria-expanded', 'false');
    } else {
      header.setAttribute('aria-expanded', 'true');
    }

    header.addEventListener('click', function(event) {
      event.preventDefault();
      const collapsed = document.body.classList.toggle('money-bills-collapsed-v2');
      localStorage.setItem('money.bills.collapsed.v2', collapsed ? '1' : '0');
      header.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
    });
  }

  // Move all bill cards/wrappers into the collapsible wrapper.
  moneyBillsV2CardNodes().forEach(node => {
    if (node === wrap || node.closest('#moneyBillsListWrapV2')) return;
    wrap.appendChild(node);
  });
}

function moneyBillsV2Wire_DISABLED() {
  moneyBillsV2Build();

  const root = document.getElementById('content') || document.getElementById('app') || document.body;
  if (root && !root.dataset.billsV2Observer) {
    root.dataset.billsV2Observer = '1';
    new MutationObserver(() => {
      clearTimeout(window.__moneyBillsV2Timer);
      window.__moneyBillsV2Timer = setTimeout(moneyBillsV2Build, 120);
    }).observe(root, { childList: true, subtree: true });
  }
}

document.addEventListener('DOMContentLoaded', function() {
  /* disabled old Bills collapse v2 */
  setTimeout(function(){}, 500);
  setTimeout(function(){}, 1400);
  setTimeout(function(){}, 2500);
});

document.addEventListener('click', function(event) {
  if (event.target.closest('.tabs, .paid-toggle, [data-paid-row], #reloadBarBtn, .sort-pill, #monthPicker')) {
    setTimeout(moneyBillsV2Build, 250);
    setTimeout(moneyBillsV2Build, 900);
  }
}, true);


// Bills section: header + sort controls + list all inside one collapsible section.
function moneyBillsSectionRows() {
  try {
    const picker = document.getElementById('monthPicker');
    const table = CACHED_TABLES[picker && picker.value !== '' ? picker.value : 0] || CACHED_TABLES[0];
    return table && Array.isArray(table.rows) ? table.rows : [];
  } catch(e) {
    return [];
  }
}

function moneyBillsSectionSubtitle() {
  const rows = moneyBillsSectionRows();
  if (!rows.length) return 'Unpaid · Paid · Due sorting';

  const paid = rows.filter(r => typeof isRowPaid === 'function' ? isRowPaid(r) : false).length;
  const unpaid = rows.length - paid;
  return `${unpaid} unpaid · ${paid} paid`;
}

function moneyBillsSectionCardNodes() {
  const wrappers = Array.from(document.querySelectorAll('.money-swipe-wrap'));
  if (wrappers.length) return wrappers.filter(n => !n.closest('#moneyBillsSection'));

  return Array.from(document.querySelectorAll('.bill-card, article[class*="bill"], .item-card, .row-card'))
    .filter(node =>
      !node.closest('#moneyBillsSection') &&
      !node.closest('#moneySmartDashboard') &&
      !node.closest('#moneyMiniAnalytics')
    );
}

function moneyBillsSectionControlNodes() {
  const nodes = [];

  const tabs = document.querySelector('.tabs');
  if (tabs && !tabs.closest('#moneyBillsSection')) nodes.push(tabs);

  // Pick likely Due sort controls/rows/buttons that are currently standing alone.
  Array.from(document.querySelectorAll('button, .sort-row, .sort-controls, [data-sort]')).forEach(el => {
    if (el.closest('#moneyBillsSection')) return;
    if (el.closest('#moneySmartDashboard') || el.closest('#moneyMiniAnalytics')) return;

    const text = String(el.textContent || '').trim().toLowerCase();
    const sort = String(el.dataset && el.dataset.sort || '').toLowerCase();

    if (
      text === 'due ↑' ||
      text === 'due ↓' ||
      text.includes('due ↑') ||
      text.includes('due ↓') ||
      sort === 'dateasc' ||
      sort === 'datedesc'
    ) {
      // If button has parent sort row, move parent once.
      const parent = el.closest('.sort-row, .sort-controls');
      nodes.push(parent || el);
    }
  });

  return Array.from(new Set(nodes)).filter(Boolean);
}

function moneyEnsureBillsSection() {
  let section = document.getElementById('moneyBillsSection');
  if (!section) {
    section = document.createElement('section');
    section.id = 'moneyBillsSection';
    section.className = 'money-bills-section';

    section.innerHTML = `
      <button id="moneyBillsSectionHeader" type="button" class="money-bills-section-header" aria-expanded="true">
        <span class="money-bills-section-header-text">
          <span class="money-bills-section-title">Bills</span>
          <span class="money-bills-section-sub">Unpaid · Paid · Due sorting</span>
        </span>
        <span class="money-bills-section-chevron">⌄</span>
      </button>
      <div id="moneyBillsSectionBody" class="money-bills-section-body">
        <div id="moneyBillsSectionControls" class="money-bills-section-controls"></div>
        <div id="moneyBillsSectionList" class="money-bills-section-list"></div>
      </div>
    `;

    const firstControl = document.querySelector('.tabs') || document.querySelector('[data-sort]');
    const firstCard = moneyBillsSectionCardNodes()[0];
    const anchor = firstControl || firstCard;

    if (anchor && anchor.parentNode) {
      anchor.parentNode.insertBefore(section, anchor);
    } else {
      const content = document.getElementById('content') || document.getElementById('app') || document.body;
      content.appendChild(section);
    }
  }

  const header = document.getElementById('moneyBillsSectionHeader');
  if (header && !header.dataset.wired) {
    header.dataset.wired = '1';

    if (localStorage.getItem('money.bills.section.collapsed') === '1') {
      document.body.classList.add('money-bills-section-collapsed');
      header.setAttribute('aria-expanded', 'false');
    }

    header.addEventListener('click', function(event) {
      event.preventDefault();
      const collapsed = document.body.classList.toggle('money-bills-section-collapsed');
      localStorage.setItem('money.bills.section.collapsed', collapsed ? '1' : '0');
      header.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
    });
  }

  return section;
}

function moneyBuildBillsSection() {
  const section = moneyEnsureBillsSection();
  const controls = document.getElementById('moneyBillsSectionControls');
  const list = document.getElementById('moneyBillsSectionList');
  const sub = section.querySelector('.money-bills-section-sub');

  if (sub) sub.textContent = moneyBillsSectionSubtitle();

  moneyBillsSectionControlNodes().forEach(node => {
    if (node && controls && !node.closest('#moneyBillsSectionControls')) {
      controls.appendChild(node);
    }
  });

  moneyBillsSectionCardNodes().forEach(node => {
    if (node && list && !node.closest('#moneyBillsSectionList')) {
      list.appendChild(node);
    }
  });

  // Disable previous standalone collapsible headers if present.
  document.querySelectorAll('#moneyBillsToggle, #moneyBillsHeaderV2').forEach(el => {
    el.style.display = 'none';
  });
}

function moneyWireBillsSection() {
  moneyBuildBillsSection();

  const root = document.getElementById('content') || document.getElementById('app') || document.body;
  if (root && !root.dataset.billsSectionObserver) {
    root.dataset.billsSectionObserver = '1';
    new MutationObserver(() => {
      clearTimeout(window.__moneyBillsSectionTimer);
      window.__moneyBillsSectionTimer = setTimeout(moneyBuildBillsSection, 120);
    }).observe(root, { childList: true, subtree: true });
  }
}

document.addEventListener('DOMContentLoaded', function() {
  moneyWireBillsSection();
  setTimeout(moneyWireBillsSection, 500);
  setTimeout(moneyWireBillsSection, 1400);
  setTimeout(moneyWireBillsSection, 2600);
});

document.addEventListener('click', function(event) {
  if (event.target.closest('.tabs, .paid-toggle, [data-paid-row], #reloadBarBtn, .sort-pill, #monthPicker, [data-sort]')) {
    setTimeout(moneyBuildBillsSection, 250);
    setTimeout(moneyBuildBillsSection, 900);
  }
}, true);


// Move Search Bills into Bills section body.
function moneyBillsSectionMoveSearch() {
  const section = document.getElementById('moneyBillsSection');
  const body = document.getElementById('moneyBillsSectionBody');
  const controls = document.getElementById('moneyBillsSectionControls');

  if (!section || !body || !controls) return;

  let searchWrap = document.getElementById('moneyBillsSectionSearch');

  if (!searchWrap) {
    searchWrap = document.createElement('div');
    searchWrap.id = 'moneyBillsSectionSearch';
    searchWrap.className = 'money-bills-section-search';
    body.insertBefore(searchWrap, controls);
  }

  const search =
    document.getElementById('searchBills') ||
    document.querySelector('input[type="search"]') ||
    document.querySelector('.search-input');

  if (!search) return;

  const block =
    search.closest('.search-row, .filters, .toolbar, .controls, .search-wrap, .searchbar') ||
    search.parentElement ||
    search;

  if (block && block !== searchWrap && !block.closest('#moneyBillsSectionSearch')) {
    searchWrap.appendChild(block);
  }
}

function moneyWireBillsSectionSearch() {
  if (typeof moneyBuildBillsSection === 'function') {
    try { moneyBuildBillsSection(); } catch(e) {}
  }

  moneyBillsSectionMoveSearch();

  const root = document.getElementById('content') || document.getElementById('app') || document.body;
  if (root && !root.dataset.billsSectionSearchObserver) {
    root.dataset.billsSectionSearchObserver = '1';
    new MutationObserver(() => {
      clearTimeout(window.__moneyBillsSearchMoveTimer);
      window.__moneyBillsSearchMoveTimer = setTimeout(moneyBillsSectionMoveSearch, 120);
    }).observe(root, { childList: true, subtree: true });
  }
}

document.addEventListener('DOMContentLoaded', function() {
  moneyWireBillsSectionSearch();
  setTimeout(moneyWireBillsSectionSearch, 500);
  setTimeout(moneyWireBillsSectionSearch, 1400);
  setTimeout(moneyWireBillsSectionSearch, 2600);
});

document.addEventListener('click', function(event) {
  if (event.target.closest('.tabs, .paid-toggle, [data-paid-row], #reloadBarBtn, .sort-pill, #monthPicker, [data-sort], #moneyBillsSectionHeader')) {
    setTimeout(moneyBillsSectionMoveSearch, 200);
    setTimeout(moneyBillsSectionMoveSearch, 800);
  }
}, true);


// Strong layout repair:
// 1. Summary card goes to the top.
// 2. Search goes inside Bills section.
// 3. Sort controls and bill cards remain inside Bills section.
function moneyLayoutRoot() {
  return document.getElementById('content') || document.getElementById('app') || document.body;
}

function moneyFindSummaryCard() {
  const cards = Array.from(document.querySelectorAll('.summary-card, .card.summary, .balance-card, [class*="summary"]'));
  return cards.find(card => {
    if (card.closest('#moneyBillsSection')) return false;
    const text = String(card.textContent || '').toLowerCase();
    return (
      text.includes('outstanding') ||
      text.includes('paid so far') ||
      text.includes('money left') ||
      text.includes('money left per day') ||
      text.includes('left per day')
    );
  });
}

function moneyMoveSummaryToTop() {
  const root = moneyLayoutRoot();
  const summary = moneyFindSummaryCard();
  if (!root || !summary) return;

  summary.classList.add('money-top-summary-anchor');

  const firstGoodAnchor =
    document.getElementById('moneyMiniAnalytics') ||
    document.getElementById('moneySmartDashboard') ||
    document.getElementById('moneyBillsSection') ||
    root.firstElementChild;

  // Prefer just after top title/header controls, but before analytics/bills.
  if (firstGoodAnchor && firstGoodAnchor.parentNode) {
    firstGoodAnchor.parentNode.insertBefore(summary, firstGoodAnchor);
  } else {
    root.prepend(summary);
  }
}

function moneyEnsureBillsSectionExists() {
  if (typeof moneyBuildBillsSection === 'function') {
    try { moneyBuildBillsSection(); } catch(e) {}
  }

  let section = document.getElementById('moneyBillsSection');
  if (section) return section;

  section = document.createElement('section');
  section.id = 'moneyBillsSection';
  section.className = 'money-bills-section';
  section.innerHTML = `
    <button id="moneyBillsSectionHeader" type="button" class="money-bills-section-header" aria-expanded="true">
      <span class="money-bills-section-header-text">
        <span class="money-bills-section-title">Bills</span>
        <span class="money-bills-section-sub">Search · Sort · Bills</span>
      </span>
      <span class="money-bills-section-chevron">⌄</span>
    </button>
    <div id="moneyBillsSectionBody" class="money-bills-section-body">
      <div id="moneyBillsSectionSearch" class="money-bills-section-search"></div>
      <div id="moneyBillsSectionControls" class="money-bills-section-controls"></div>
      <div id="moneyBillsSectionList" class="money-bills-section-list"></div>
    </div>
  `;

  const root = moneyLayoutRoot();
  root.appendChild(section);
  return section;
}

function moneyMoveSearchIntoBills() {
  const section = moneyEnsureBillsSectionExists();
  let body = document.getElementById('moneyBillsSectionBody');
  let searchSlot = document.getElementById('moneyBillsSectionSearch');

  if (!body) {
    body = document.createElement('div');
    body.id = 'moneyBillsSectionBody';
    body.className = 'money-bills-section-body';
    section.appendChild(body);
  }

  if (!searchSlot) {
    searchSlot = document.createElement('div');
    searchSlot.id = 'moneyBillsSectionSearch';
    searchSlot.className = 'money-bills-section-search';
    body.prepend(searchSlot);
  }

  const search =
    document.getElementById('searchBills') ||
    document.querySelector('input[type="search"]') ||
    document.querySelector('.search-input');

  if (!search) return;

  const searchBlock =
    search.closest('.search-row, .filters, .toolbar, .controls, .search-wrap, .searchbar') ||
    search.parentElement ||
    search;

  if (searchBlock && !searchBlock.closest('#moneyBillsSectionSearch')) {
    searchSlot.appendChild(searchBlock);
  }
}

function moneyMoveControlsAndCardsIntoBills() {
  const section = moneyEnsureBillsSectionExists();
  const body = document.getElementById('moneyBillsSectionBody');
  let controls = document.getElementById('moneyBillsSectionControls');
  let list = document.getElementById('moneyBillsSectionList');

  if (!controls) {
    controls = document.createElement('div');
    controls.id = 'moneyBillsSectionControls';
    controls.className = 'money-bills-section-controls';
    body.appendChild(controls);
  }

  if (!list) {
    list = document.createElement('div');
    list.id = 'moneyBillsSectionList';
    list.className = 'money-bills-section-list';
    body.appendChild(list);
  }

  const tabs = document.querySelector('.tabs');
  if (tabs && !tabs.closest('#moneyBillsSectionControls')) {
    controls.appendChild(tabs);
  }

  Array.from(document.querySelectorAll('button, .sort-row, .sort-controls, [data-sort]')).forEach(el => {
    if (el.closest('#moneyBillsSection')) return;
    if (el.closest('#moneySmartDashboard') || el.closest('#moneyMiniAnalytics')) return;

    const text = String(el.textContent || '').trim().toLowerCase();
    const sort = String(el.dataset && el.dataset.sort || '').toLowerCase();

    if (
      text.includes('due ↑') ||
      text.includes('due ↓') ||
      sort === 'dateasc' ||
      sort === 'datedesc'
    ) {
      const parent = el.closest('.sort-row, .sort-controls') || el;
      if (!parent.closest('#moneyBillsSectionControls')) controls.appendChild(parent);
    }
  });

  const cards = Array.from(document.querySelectorAll('.money-swipe-wrap')).length
    ? Array.from(document.querySelectorAll('.money-swipe-wrap'))
    : Array.from(document.querySelectorAll('.bill-card, article[class*="bill"], .item-card, .row-card'));

  cards.forEach(card => {
    if (card.closest('#moneyBillsSectionList')) return;
    if (card.closest('#moneySmartDashboard') || card.closest('#moneyMiniAnalytics')) return;
    list.appendChild(card);
  });
}

function moneyFixLayoutNow() {
  moneyMoveSummaryToTop();
  moneyEnsureBillsSectionExists();
  moneyMoveSearchIntoBills();
  moneyMoveControlsAndCardsIntoBills();

  // Hide old duplicated standalone Bills headers.
  document.querySelectorAll('#moneyBillsToggle, #moneyBillsHeaderV2').forEach(el => {
    el.style.display = 'none';
  });
}

function moneyWireFixedLayout() {
  moneyFixLayoutNow();

  const root = moneyLayoutRoot();
  if (root && !root.dataset.fixedLayoutObserver) {
    root.dataset.fixedLayoutObserver = '1';
    new MutationObserver(() => {
      clearTimeout(window.__moneyFixedLayoutTimer);
      window.__moneyFixedLayoutTimer = setTimeout(moneyFixLayoutNow, 120);
    }).observe(root, { childList: true, subtree: true });
  }
}

document.addEventListener('DOMContentLoaded', function() {
  moneyWireFixedLayout();
  setTimeout(moneyWireFixedLayout, 500);
  setTimeout(moneyWireFixedLayout, 1400);
  setTimeout(moneyWireFixedLayout, 2600);
});

document.addEventListener('click', function(event) {
  if (event.target.closest('.tabs, .paid-toggle, [data-paid-row], #reloadBarBtn, .sort-pill, #monthPicker, [data-sort], #moneyBillsSectionHeader')) {
    setTimeout(moneyFixLayoutNow, 200);
    setTimeout(moneyFixLayoutNow, 800);
  }
}, true);


// Simplified Bills section + card icon labels.
function moneySimplifyBillsAndAddCardIcons() {
  document.querySelectorAll('[data-card-icon]').forEach(el => el.removeAttribute('data-card-icon'));
  document.querySelectorAll('#searchBills, #moneyBillsSectionSearch, .money-bills-section-search, input[type="search"]').forEach(el => {
    const block = el.closest('.search-row, .filters, .toolbar, .controls, .search-wrap, .searchbar') || el;
    block.style.display = 'none';
  });
  document.querySelectorAll('.tabs, #moneyBillsSectionControls, .money-bills-section-controls, .sort-row, .sort-controls, button[data-sort], [data-sort]').forEach(el => {
    if (!el.closest('.bill-card') && !el.closest('article[class*="bill"]')) el.style.display = 'none';
  });
}

function moneyWireSimplifiedBillsCards() {
  moneySimplifyBillsAndAddCardIcons();

  const root = document.getElementById('content') || document.getElementById('app') || document.body;
  if (root && !root.dataset.simplifiedBillsCardObserver) {
    root.dataset.simplifiedBillsCardObserver = '1';
    new MutationObserver(() => {
      clearTimeout(window.__moneySimplifiedBillsTimer);
      window.__moneySimplifiedBillsTimer = setTimeout(moneySimplifyBillsAndAddCardIcons, 120);
    }).observe(root, { childList: true, subtree: true, characterData: true });
  }
}

document.addEventListener('DOMContentLoaded', function() {
  moneyWireSimplifiedBillsCards();
  setTimeout(moneyWireSimplifiedBillsCards, 500);
  setTimeout(moneyWireSimplifiedBillsCards, 1400);
});

document.addEventListener('click', function(event) {
  if (event.target.closest('#moneyBillsSectionHeader, .paid-toggle, [data-paid-row], #reloadBarBtn, #monthPicker')) {
    setTimeout(moneySimplifyBillsAndAddCardIcons, 250);
    setTimeout(moneySimplifyBillsAndAddCardIcons, 900);
  }
}, true);

start();
setTimeout(moneyWireSimplifiedBillsCards, 1000);
setTimeout(moneyWireFixedLayout, 1000);
setTimeout(moneyWireBillsSectionSearch, 1000);
setTimeout(moneyWireBillsSection, 900);
setTimeout(function(){}, 900);
setTimeout(function(){}, 800);
setTimeout(moneyWireMiniAnalytics, 900);
setTimeout(moneyWireMoveSummaryUnderSearch, 700);
setTimeout(moneyStartSafeSpendForceMatch, 800);
setTimeout(moneyWireSafeSpendMirror, 800);
setTimeout(moneyLeftPerDayRebuiltWire, 800);
setTimeout(moneyUpdateOriginalPerDayBoxOptionB, 800);
setTimeout(moneyApplySafeSpendOptionB, 800);
setTimeout(moneyPatchOptionBDayDisplays, 700);
setTimeout(moneyWireCorrectPerDayHeroSync, 800);
setTimeout(moneySafeSpendWireHardSync, 700);
setTimeout(moneyWireSafeSpendMatch, 700);
setTimeout(moneyApplyBillLogos, 500);
moneyRefreshPremiumDashboardSoon();
setTimeout(moneyWireSmartFeatures, 1000);
setTimeout(moneyWireBottomSheets, 300);
setTimeout(moneyWirePremiumUI, 500);
msWireMoneyLeftCloneFix();
setTimeout(msWireLeftC4VisibleWrite, 500);
setTimeout(msAfterRenderLeftC4Strong, 500);
setTimeout(() => { msWireLeftAmountC4Sync(); msPullLeftAmountC4(); }, 300);
msWireLeftAmountUpdate();
msSafeWireSyncControls();
msNormaliseLeftAmountWholeNumber();
setTimeout(msNormaliseLeftAmountWholeNumber, 200);
setTimeout(msNormaliseLeftAmountWholeNumber, 800);
msWireLeftAmountFinal();
setTimeout(msWireLeftAmountRecalc, 500);
msFixLeftAmountField();
msWireLeftAmountRecalc();
msFixAmountInputs();
msWireAddButton();
document.addEventListener('DOMContentLoaded', msWireAddButton);

document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('input[name="amount"], input#amount').forEach(function(el) {
    el.removeAttribute('max');
    el.setAttribute('step', '0.01');
    el.setAttribute('min', '0');
    el.setAttribute('inputmode', 'decimal');
  });
});


document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.config-box, .sheet').forEach(function(box) {
    if (box.querySelector('[data-safe-close-modal]')) return;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('data-safe-close-modal', '1');
    btn.setAttribute('aria-label', 'Close');
    btn.textContent = '×';
    btn.style.cssText = 'position:absolute;top:12px;right:12px;width:34px;height:34px;border-radius:17px;border:1px solid rgba(107,114,128,.18);background:rgba(255,255,255,.9);color:#6b7280;font-size:24px;line-height:1;display:grid;place-items:center;cursor:pointer;z-index:5;';
    box.style.position = box.style.position || 'relative';
    btn.onclick = function(e) {
      e.preventDefault();
      e.stopPropagation();
      closeAnyOpenModalSafe();
    };
    box.appendChild(btn);
  });
});


setTimeout(() => {
  const content = document.getElementById('content');
  if (content && content.innerHTML.includes('Fetching your spreadsheet')) {
    content.innerHTML = '<div class="error"><strong>Still fetching…</strong><br>The spreadsheet request did not finish. Tap Refresh, or check Google sign-in/config.</div>';
  }
}, 15000);

wireCleanBottomBar();

wireBottomBarActions();




/*
  Dashboard-safe canonical daily calc.
  Keeps dashboard renderer intact, then updates both Money Left per day and Safe to spend today
  from the same calculation.
*/
(function () {
  function parseMoney(value) {
    const cleaned = String(value || "")
      .replace(/,/g, "")
      .replace(/£/g, "")
      .replace(/[^\d.-]/g, "");
    const n = parseFloat(cleaned);
    return Number.isFinite(n) ? n : 0;
  }

  function fmt(value) {
    if (typeof window.fmtMoney === "function") return window.fmtMoney(value || 0);
    const sign = value < 0 ? "-" : "";
    return sign + "£" + Math.abs(value || 0).toFixed(2);
  }

  function currentRows() {
    try {
      const picker = document.getElementById("monthPicker");
      const index = picker && picker.value !== "" ? picker.value : 0;
      const table = (window.CACHED_TABLES && (window.CACHED_TABLES[index] || window.CACHED_TABLES[0])) || null;
      return table && Array.isArray(table.rows) ? table.rows : [];
    } catch (e) {
      return [];
    }
  }

  function rowIsPaid(row) {
    try {
      if (typeof window.isRowPaid === "function") return window.isRowPaid(row);
    } catch (e) {}
    return false;
  }

  function unpaidTotal() {
    return currentRows().reduce((sum, row) => {
      if (rowIsPaid(row)) return sum;
      const outstanding = Number(row && row.paid ? row.paid : 0);
      const due = Number(row && row.due ? row.due : 0);
      return sum + (outstanding || due || 0);
    }, 0);
  }

  function selectedEndDateParts() {
    const now = new Date();

    const candidates = [
      document.getElementById("endDate"),
      document.getElementById("targetDate"),
      document.getElementById("selectedDate"),
      document.querySelector("[data-end-date]"),
      document.querySelector("[data-reset-date]"),
      document.querySelector("input[type='date']")
    ].filter(Boolean);

    for (const el of candidates) {
      const raw = (el.dataset && (el.dataset.endDate || el.dataset.resetDate)) || el.value || "";
      if (!raw) continue;

      const iso = String(raw).match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
      if (iso) {
        return { year: +iso[1], month: +iso[2] - 1, day: +iso[3] };
      }

      const uk = String(raw).match(/^(\d{1,2})[\/.-](\d{1,2})(?:[\/.-](\d{2,4}))?$/);
      if (uk) {
        const year = uk[3] ? +(uk[3].length === 2 ? "20" + uk[3] : uk[3]) : now.getFullYear();
        return { year, month: +uk[2] - 1, day: +uk[1] };
      }
    }

    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return { year: end.getFullYear(), month: end.getMonth(), day: end.getDate() };
  }

  function optionBDays() {
    const now = new Date();
    const todayUTC = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
    const end = selectedEndDateParts();
    const endUTC = Date.UTC(end.year, end.month, end.day);
    return Math.max(1, Math.floor((endUTC - todayUTC) / 86400000));
  }

  function calculateDaily() {
    const input = document.getElementById("leftAmount");
    const left = parseMoney(input ? input.value : 0);
    const unpaid = unpaidTotal();
    const days = optionBDays();
    const perDay = (left - unpaid) / days;

    return {
      left,
      unpaid,
      days,
      perDay,
      amountText: fmt(perDay),
      daysText: `${days} day${days === 1 ? "" : "s"} left`,
      unpaidText: fmt(unpaid)
    };
  }

  function setAll(selectors, text) {
    selectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => {
        if (el.textContent !== text) el.textContent = text;
      });
    });
  }

  function applyDailyCalc() {
    const calc = calculateDaily();

    setAll([
      "#perDayValue",
      "#perDayValueEl",
      "[data-per-day-value]",
      ".per-day .big"
    ], calc.amountText);

    setAll([
      "#perDayMeta",
      "[data-per-day-meta]",
      ".per-day .meta"
    ], calc.daysText);

    setAll([".money-hero-amount"], calc.amountText);

    document.querySelectorAll(".money-hero-sub").forEach(el => {
      const next = `${calc.daysText} · ${calc.unpaidText} still to pay`;
      if (el.textContent !== next) el.textContent = next;
    });

    document.querySelectorAll(".money-insight").forEach(insight => {
      const t = String(insight.textContent || "").toLowerCase();
      if (t.includes("safe to spend") || t.includes("short by")) {
        const target = insight.querySelector("span:not(.money-insight-icon)") || insight;
        const next = `Safe to spend: ${calc.amountText} per day.`;
        if (target.textContent !== next) target.textContent = next;
      }
    });

    return calc;
  }

  function patchDashboardBuilder() {
    if (window.__dashboardSafeCalcPatched || typeof window.moneyBuildDashboardHTML !== "function") return;
    window.__dashboardSafeCalcPatched = true;

    const original = window.moneyBuildDashboardHTML;

    window.moneyBuildDashboardHTML = function (...args) {
      let out = String(original.apply(this, args));
      const calc = calculateDaily();

      out = out.replace(
        /(<div class="money-hero-amount">)([\s\S]*?)(<\/div>)/,
        `$1${calc.amountText}$3`
      );

      out = out.replace(
        /(<div class="money-hero-sub">)([\s\S]*?)(<\/div>)/,
        `$1${calc.daysText} · ${calc.unpaidText} still to pay$3`
      );

      out = out.replace(
        /(Safe to spend: )[^<]+?( per day\.)/,
        `$1${calc.amountText}$2`
      );

      out = out.replace(
        /(You are short by )[^<]+?( per day\.)/,
        `Safe to spend: ${calc.amountText} per day.`
      );

      return out;
    };
  }

  function ensureDashboardExists() {
    if (document.getElementById("moneySmartDashboard")) return;
    if (typeof window.moneyWireSmartFeatures === "function") {
      try { window.moneyWireSmartFeatures(); } catch (e) {}
    } else if (typeof window.moneyInsertDashboard === "function") {
      try { window.moneyInsertDashboard(); } catch (e) {}
    }
  }

  let timer = null;
  function schedule(delay = 50) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      patchDashboardBuilder();
      ensureDashboardExists();
      applyDailyCalc();
    }, delay);
  }

  function wire() {
    patchDashboardBuilder();
    ensureDashboardExists();
    applyDailyCalc();

    const input = document.getElementById("leftAmount");
    if (input && !input.dataset.dashboardSafeCalcWired) {
      input.dataset.dashboardSafeCalcWired = "1";
      input.addEventListener("input", () => schedule(0), true);
      input.addEventListener("change", () => schedule(0), true);
      input.addEventListener("blur", () => schedule(0), true);
    }

    const root = document.getElementById("content") || document.getElementById("app") || document.body;
    if (root && !root.dataset.dashboardSafeCalcObserver) {
      root.dataset.dashboardSafeCalcObserver = "1";
      new MutationObserver(() => schedule(80)).observe(root, {
        childList: true,
        subtree: true,
        characterData: true
      });
    }
  }

  window.moneyCanonicalDailyCalc = calculateDaily;
  window.moneyCanonicalDailyUpdate = applyDailyCalc;
  window.moneyOptionBDaysLeft = optionBDays;
  window.msMoneyLeftDays = optionBDays;
  window.msUpdateMoneyLeftPerDaySimple = applyDailyCalc;
  window.msMoneyLeftRecalc = applyDailyCalc;
  window.msUpdateLeftAmountPerDay = applyDailyCalc;
  window.msRecalculatePerDayFromLeftAmount = applyDailyCalc;
  window.msWireLeftAmountUpdate = wire;

  document.addEventListener("DOMContentLoaded", () => {
    wire();
    setTimeout(wire, 500);
    setTimeout(wire, 1200);
    setTimeout(wire, 2200);
  });

  document.addEventListener("click", event => {
    if (event.target.closest(".tabs, .paid-toggle, [data-paid-row], #reloadBarBtn, .sort-pill, #monthPicker")) {
      schedule(150);
      setTimeout(wire, 600);
    }
  }, true);

  document.addEventListener("change", event => {
    if (event.target && (event.target.id === "monthPicker" || event.target.id === "leftAmount")) {
      schedule(0);
    }
  }, true);

  setInterval(wire, 900);
  setTimeout(wire, 0);
})();
