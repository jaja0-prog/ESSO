/* ESSO • Interface, demonstração local e integração opcional com Supabase */
(() => {
'use strict';
const cfg = window.MMB_CONFIG || {};
const priceEngine=window.ESSO_PRICE;
const $ = (q, root=document) => root.querySelector(q);
const $$ = (q, root=document) => [...root.querySelectorAll(q)];
const escapeHtml = (x='') => String(x ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const fmt = n => Number(n||0).toLocaleString('pt-BR');
const dt = v => new Date(v).toLocaleDateString('pt-BR',{day:'2-digit',month:'short',year:'numeric'});
const tm = v => new Date(v).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'});
const uid = () => (crypto?.randomUUID?.() || `id-${Date.now()}-${Math.random().toString(36).slice(2)}`);
const daysAgo = n => new Date(Date.now()-n*86400000).toISOString();
const daysAhead = n => new Date(Date.now()+n*86400000).toISOString();
const links = {
  meet: cfg.meetUrl || 'https://meet.google.com/',
  upseller: cfg.upsellerUrl || 'https://app.upseller.com/pt/login',
  dogama: cfg.dogamaUrl || 'https://dogama.com.br/'
};
const paths = {
  home:'<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/>',
  box:'<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M3 9h18M9 3v18"/>',
  chat:'<path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8z"/>',
  bulb:'<path d="M9 18h6m-5 4h4M8 14a6 6 0 1 1 8 0c-.8.7-1.3 1.5-1.3 3H9.3c0-1.5-.5-2.3-1.3-3z"/>',
  spark:'<path d="m12 2 2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5z"/>',
  settings:'<circle cx="12" cy="12" r="3"/><path d="m19.4 15 .2.2 1.5 1.2-1.4 2.4-1.8-.7a8.4 8.4 0 0 1-2.6 1.5L15 22h-6l-.3-2.4a8.4 8.4 0 0 1-2.6-1.5l-1.8.7-1.4-2.4L4.4 15a8.9 8.9 0 0 1 0-3l-1.5-1.4 1.4-2.4 1.8.7a8.4 8.4 0 0 1 2.6-1.5L9 5h6l.3 2.4a8.4 8.4 0 0 1 2.6 1.5l1.8-.7 1.4 2.4-1.5 1.4a8.9 8.9 0 0 1 0 3z" transform="translate(0 -1) scale(.96)"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  arrow:'<path d="M5 12h14m-6-6 6 6-6 6"/>',
  ext:'<path d="M14 3h7v7m0-7-9 9M20 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5"/>',
  video:'<rect x="3" y="6" width="13" height="12" rx="2"/><path d="m16 10 5-3v10l-5-3"/>',
  bell:'<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>',
  menu:'<path d="M4 7h16M4 12h16M4 17h16"/>',
  trend:'<path d="m3 17 6-6 4 4 8-8M15 7h6v6"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l4 2"/>',
  check:'<path d="m4 12 5 5L20 6"/>',
  arrowleft:'<path d="M19 12H5m6-6-6 6 6 6"/>',
  search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
  photo:'<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/>',
  send:'<path d="m22 2-7 20-4-9-9-4L22 2ZM22 2 11 13"/>',
  paperclip:'<path d="m20 12-8.4 8.4a6 6 0 0 1-8.4-8.4L13 2.2a4 4 0 0 1 5.7 5.6l-9 9a2 2 0 0 1-2.8-2.8l8-8"/>',
  store:'<path d="M3 10h18l-2-7H5zM5 10v11h14V10M9 21v-7h6v7"/>',
  chart:'<path d="M3 3v18h18M7 16v-4M12 16V7M17 16v-7"/>',
  copy:'<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',
  log:'<path d="M10 17l5-5-5-5M15 12H3M12 3h6a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3h-6"/>',
  filter:'<path d="M4 6h16M7 12h10m-7 6h4"/>',
  link:'<path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-2 2M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l2-2"/>',
  team:'<circle cx="9" cy="8" r="3"/><path d="M3 20v-2a6 6 0 0 1 12 0v2M17 5a3 3 0 0 1 0 6m1 3a6 6 0 0 1 3 5v1"/>',
  target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18"/>',
  shield:'<path d="m12 2 9 4v6c0 5-3 8-9 10-6-2-9-5-9-10V6z"/><path d="m8 12 3 3 5-6"/>',
  trash:'<path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14M10 11v6m4-6v6"/>'
};
const ic = (name, size='') => `<svg class="icon ${size}" viewBox="0 0 24 24" aria-hidden="true">${paths[name]||paths.spark}</svg>`;
const sid = id => escapeHtml(id);
const seed = () => ({
  members:[
    {user_id:'demo-owner',display_name:'João',role:'owner'},
    {user_id:'demo-partner',display_name:'Daka',role:'partner'}
  ],
  listings:[],
  experiments:[],
  messages:[],
  ideas:[],
  playbooks:[],
  price_calculations:[]
});
let state={mode:(cfg.supabaseUrl&&cfg.supabaseAnonKey)?'cloud':'demo', user:null, data:null, route:'dashboard', detail:null, modal:null, search:'', filter:'Todos', sideOpen:false, file:null, filePreview:'', loading:false, authError:'',realtime:null,askQuestion:'',askAnswer:'',pricing:null};
let client=null, photoCache=new Map();
const demoKey='esso-app-demo-v8';
const demoUserKey='esso-person-v8';
// ESSO — Controle de acesso da demonstração
const ESSO_ACCESS_KEY = 'pipi no short';
const ESSO_MAX_ATTEMPTS = 3;
const ESSO_BLOCK_TIME = 7 * 60 * 1000;

function accessStatus(profile) {
  const key = `esso-access-${profile}`;
  const data = JSON.parse(localStorage.getItem(key) || '{}');

  if (data.blockedUntil && Date.now() >= data.blockedUntil) {
    localStorage.removeItem(key);
    return { attempts: 0, blockedUntil: 0 };
  }

  return {
    attempts: data.attempts || 0,
    blockedUntil: data.blockedUntil || 0
  };
}

function checkAccess(profile, password) {
  const key = `esso-access-${profile}`;
  const status = accessStatus(profile);

  if (status.blockedUntil > Date.now()) {
    const minutes = Math.ceil(
      (status.blockedUntil - Date.now()) / 60000
    );

    return {
      allowed: false,
      message: `Acesso bloqueado. Tente novamente em ${minutes} minuto(s).`
    };
  }

  if (password === ESSO_ACCESS_KEY) {
    localStorage.removeItem(key);
    return { allowed: true };
  }

  const attempts = status.attempts + 1;

  if (attempts >= ESSO_MAX_ATTEMPTS) {
    localStorage.setItem(key, JSON.stringify({
      attempts,
      blockedUntil: Date.now() + ESSO_BLOCK_TIME
    }));

    return {
      allowed: false,
      message: 'Você errou 3 vezes. Acesso bloqueado por 7 minutos.'
    };
  }

  localStorage.setItem(key, JSON.stringify({
    attempts,
    blockedUntil: 0
  }));

  return {
    allowed: false,
    message: `Palavra-chave incorreta. Restam ${ESSO_MAX_ATTEMPTS - attempts} tentativa(s).`
  };
}
const priceDraftKey='esso-price-draft-v8';
function blankPrice(){const a=structuredClone(priceEngine.defaults);try{const old=JSON.parse(localStorage.getItem(priceDraftKey));if(old&&typeof old==='object'&&['Shopee','Mercado Livre'].includes(old.market))return {...a,...old}}catch{}return a}
state.pricing=blankPrice();
function savePriceDraft(){try{localStorage.setItem(priceDraftKey,JSON.stringify(state.pricing))}catch{}}
let demoChannel=('BroadcastChannel' in window)?new BroadcastChannel('esso-demo-sync'):null;
const startDemo=()=>{try{state.data=JSON.parse(localStorage.getItem(demoKey))||seed()}catch{state.data=seed()}if(!state.data.playbooks)state.data.playbooks=[];if(!state.data.price_calculations)state.data.price_calculations=[];state.data.members.forEach(member => {
  if (member.user_id === 'demo-owner') {
    member.display_name = 'João';
  }

  if (member.user_id === 'demo-partner') {
    member.display_name = 'Daka';
  }
});
const selected=sessionStorage.getItem(demoUserKey);state.user=selected?{id:selected,email:'demonstracao@local'}:null;persistDemo()};
const persistDemo=()=>{if(state.mode==='demo' && state.data){try{localStorage.setItem(demoKey,JSON.stringify(state.data));demoChannel?.postMessage({type:'sync',at:Date.now()})}catch{notify('Armazenamento local cheio. Tente imagens menores.',true)}}};
const me=()=>state.data?.members?.find(m=>m.user_id===state.user?.id)||{display_name:'João',role:'owner',user_id:state.user?.id};const memberName=id=>state.data?.members?.find(m=>m.user_id===id)?.display_name||'Equipe';
const displayName=()=>me().display_name;
const initials=name=>(name||'ES').trim().split(/\s+/).slice(0,2).map(s=>s[0].toUpperCase()).join('');
const brand=()=>`<div class="brand"><div class="brand-mark esso">${cfg.brandLogo?`<img src="${escapeHtml(cfg.brandLogo)}" alt="Logo"/>`:''}</div><div><strong>${escapeHtml(cfg.brandName||'ESSO')}</strong><span>PRIVATE WORKSPACE</span></div></div>`;
function notify(msg,error=false){const el=document.createElement('div');el.className=`toast${error?' error':''}`;el.textContent=msg;$('#toast-stack').append(el);setTimeout(()=>el.remove(),4000)}
async function init(){
  if(state.mode==='demo'){startDemo();render();return}
  try{
    const module=await import('https://esm.sh/@supabase/supabase-js@2.57.2');
    client=module.createClient(cfg.supabaseUrl,cfg.supabaseAnonKey,{auth:{persistSession:true,autoRefreshToken:true}});
    const {data:{session}}=await client.auth.getSession();
    if(session){state.user=session.user;await loadCloud()}else{render()}
    client.auth.onAuthStateChange((event,session)=>{
      if(event==='SIGNED_OUT'){state.user=null;state.data=null;state.realtime?.unsubscribe();state.realtime=null;render()}
    });
  }catch(e){state.authError='Não foi possível conectar ao Supabase. Confirme a URL, a chave e a conexão com a internet.';render()}
}
async function loadCloud(){
  state.loading=true; render();
  try{
    const [members,listings,experiments,messages,ideas,playbooks,price_calculations]=await Promise.all(['members','listings','experiments','messages','ideas','playbooks','price_calculations'].map(x=>client.from(x).select('*')));
    const bad=[members,listings,experiments,messages,ideas,playbooks,price_calculations].find(x=>x.error);
    if(bad)throw bad.error;
    if(!members.data?.some(m=>m.user_id===state.user.id))throw new Error('Este e-mail não está na lista de membros autorizados.');
    state.data={members:members.data,listings:listings.data,experiments:experiments.data,messages:messages.data,ideas:ideas.data,playbooks:playbooks.data,price_calculations:price_calculations.data};
    state.authError='';
    subscribeRealtime();
  }catch(e){state.authError=e.message||'Falha ao carregar dados.';state.data=null}
  state.loading=false;render();
}
function subscribeRealtime(){
  if(state.realtime)client.removeChannel(state.realtime);
  const ch=state.realtime=client.channel('mmb-team-updates').on('postgres_changes',{event:'*',schema:'public'}, async payload=>{
    if(!state.data)return;
    const table=payload.table;
    if(!['members','listings','experiments','messages','ideas','playbooks','price_calculations'].includes(table))return;
    const arr=state.data[table];
    const row=payload.new;const old=payload.old;
    if(payload.eventType==='INSERT' && row && !arr.some(x=>(x.id||x.user_id)===(row.id||row.user_id)))arr.push(row);
    if(payload.eventType==='UPDATE' && row){const i=arr.findIndex(x=>(x.id||x.user_id)===(row.id||row.user_id));if(i>=0)arr[i]=row;else arr.push(row)}
    if(payload.eventType==='DELETE'){const i=arr.findIndex(x=>(x.id||x.user_id)===(old.id||old.user_id));if(i>=0)arr.splice(i,1)}
    const sc=$('.chat-scroll'), atBottom=sc?sc.scrollHeight-sc.scrollTop-sc.clientHeight<140:false;
    if(canRender()){render();if(state.route==='chat'&&atBottom)scrollChat()}
  }).subscribe(status=>{
    if(state.realtime!==ch)return;
    if(status==='CHANNEL_ERROR'||status==='TIMED_OUT'||status==='CLOSED'){setTimeout(()=>{if(state.realtime===ch&&state.data)subscribeRealtime()},3000)}
    else if(status==='SUBSCRIBED'){syncCloud()}
  });
}
async function insert(table,row){
  if(state.mode==='demo'){state.data[table].push(row);persistDemo();return row}
  const {data,error}=await client.from(table).insert(row).select().single();
  if(error)throw error;state.data[table].push(data);return data
}
async function update(table,id,patch){
  if(state.mode==='demo'){const entry=state.data[table].find(r=>r.id===id);Object.assign(entry,patch);persistDemo();return entry}
  const {data,error}=await client.from(table).update(patch).eq('id',id).select().single();
  if(error)throw error;const i=state.data[table].findIndex(x=>x.id===id);if(i>=0)state.data[table][i]=data;return data
}
async function toOptimizedImage(file){
  if(!file)return null;
  if(!file.type.startsWith('image/'))throw new Error('Envie uma imagem PNG, JPG ou WebP.');
  if(file.size>12*1024*1024)throw new Error('A imagem deve ter no máximo 12 MB.');
  return new Promise((resolve,reject)=>{const input=new Image();const obj=URL.createObjectURL(file);input.onload=()=>{let {width:w,height:h}=input;const max=1400, scale=Math.min(1,max/Math.max(w,h));w=Math.round(w*scale);h=Math.round(h*scale);const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;canvas.getContext('2d').drawImage(input,0,0,w,h);canvas.toBlob(blob=>{URL.revokeObjectURL(obj);if(!blob)return reject(new Error('Falha na imagem.'));resolve(blob)},'image/jpeg',.8)};input.onerror=()=>{URL.revokeObjectURL(obj);reject(new Error('Imagem inválida.'))};input.src=obj})
}
async function uploadImage(file){
  if(!file||!file.size)return '';
  const blob=await toOptimizedImage(file);
  if(state.mode==='demo')return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=reject;reader.readAsDataURL(blob)});
  const path=`${state.user.id}/${Date.now()}-${uid()}.jpg`;
  const {error}=await client.storage.from('assets').upload(path,blob,{contentType:'image/jpeg',upsert:false});
  if(error)throw error;return path;
}
async function resolvePhotos(){
  for(const img of $$('img[data-photo]')){
    const path=img.getAttribute('data-photo');
    if(!path)continue;
    if(path.startsWith('data:')||path.startsWith('blob:')){img.src=path;continue}
    if(!client)continue;
    if(photoCache.has(path)){img.src=photoCache.get(path);continue}
    const {data,error}=await client.storage.from('assets').createSignedUrl(path,3600);
    if(!error&&data?.signedUrl){photoCache.set(path,data.signedUrl);if(img.isConnected)img.src=data.signedUrl}
  }
}
const pic=(path,cls='')=>`<div class="thumb ${cls}">${path?`<img alt="Foto do produto" data-photo="${escapeHtml(path)}" />`:ic('box','lg')}</div>`;
const badge=x=>{const t=expStatus(x);return `<span class="tag ${t.c}">${t.label}</span>`};
function expStatus(x){if(x.reviewed_at)return {c:'done',label:'Concluído'};if(Date.now()>=new Date(x.review_at))return {c:'due',label:'Hora de revisar'};return{c:'pending',label:'Em acompanhamento'}}
const timerText=x=>{if(x.reviewed_at)return `Avaliado em ${dt(x.reviewed_at)}`;const d=+new Date(x.review_at)-Date.now();if(d<=0)return `Prazo vencido há ${humanDuration(-d)}`;return `Revisão em ${humanDuration(d)}`};
function humanDuration(ms){let total=Math.floor(ms/1000);let d=Math.floor(total/86400),h=Math.floor(total%86400/3600),m=Math.floor(total%3600/60),s=total%60;return d>0?`${d}d ${h}h ${m}min`:h>0?`${h}h ${m}min ${s}s`:`${m}min ${s}s`}
const byTime=(xs,key='created_at')=>[...(xs||[])].sort((a,b)=>new Date(b[key])-new Date(a[key]));
const experiments=()=>byTime(state.data.experiments,'started_at');
const listingBy=id=>state.data.listings.find(l=>l.id===id);
const listingExps=id=>experiments().filter(x=>x.listing_id===id);
const pct=x=>x.after_visits==null||!x.before_visits?null:Math.round(((x.after_visits-x.before_visits)/x.before_visits)*100);
function lessons(){const done=state.data.experiments.filter(x=>x.reviewed_at&&x.after_visits!=null&&x.before_visits>0);const groups={};for(const exp of done){const t=exp.change_type||'Outros';(groups[t]??=[]).push(pct(exp))}return Object.entries(groups).map(([label,values])=>({label,count:values.length,avg:Math.round(values.reduce((a,b)=>a+b,0)/values.length)})).sort((a,b)=>b.avg-a.avg)}
function sections(){return [{id:'dashboard',name:'Visão geral',icon:'home'},{id:'listings',name:'Anúncios',icon:'box'},{id:'chat',name:'Mensagens',icon:'chat'},{id:'pricing',name:'Calculadora de preços',icon:'chart'},{id:'ideas',name:'Ideias',icon:'bulb'},{id:'playbooks',name:'Passo a passo',icon:'copy'},{id:'learning',name:'Aprendizados',icon:'spark'},{id:'settings',name:'Configurações',icon:'settings'}]}
function nav(){const ext=[['upseller','UpSeller'],['dogama','Dogama'],['meet','Meet']];return `<header class="sh-nav ${state.sideOpen?'open':''}"><div class="sh-nav-in">${brand()}<nav class="sh-links" aria-label="Navegação principal">${sections().map(x=>`<button data-action="route" data-id="${x.id}" class="nav-item ${state.route===x.id?'active':''}"><span>${x.name}</span></button>`).join('')}</nav><div class="sh-nav-actions">${ext.map(([k,n])=>`<a class="sh-ext" href="${escapeHtml(links[k])}" target="_blank" rel="noopener noreferrer">${n}</a>`).join('')}<button class="top-icon-btn" data-action="theme" title="Alternar tema claro/escuro" aria-label="Alternar tema">${themeIcon()}</button><button class="top-icon-btn" data-action="alerts" title="Avisos">${ic('bell')}</button><button class="top-icon-btn" data-action="profile" title="Perfil"><div class="avatar" style="width:26px;height:26px;border-radius:8px;font-size:10px">${initials(displayName())}</div></button><button class="top-icon-btn mobile-menu" data-action="menu" aria-label="Menu">${ic('menu')}</button></div></div></header>`}
function footer(){return `<footer class="sh-footer"><div class="sh-foot-in"><div>${brand()}<p>Grandes resultados começam com pequenos testes.</p></div><div><b>Workspace</b>${sections().slice(0,5).map(x=>`<button data-action="route" data-id="${x.id}">${x.name}</button>`).join('')}</div><div><b>Mais</b>${sections().slice(5).map(x=>`<button data-action="route" data-id="${x.id}">${x.name}</button>`).join('')}</div><div><b>Acesso rápido</b><a href="${escapeHtml(links.upseller)}" target="_blank" rel="noopener noreferrer">UpSeller</a><a href="${escapeHtml(links.dogama)}" target="_blank" rel="noopener noreferrer">Dogama</a><a href="${escapeHtml(links.meet)}" target="_blank" rel="noopener noreferrer">Google Meet</a></div></div></footer>`}
function topbar(){return ''}
function pageHead(eyebrow,title,sub,button=''){return `<div class="page-head"><div><div class="page-eyebrow"><i class="dot"></i>${eyebrow}</div><h1>${title}</h1><p>${sub}</p></div>${button}</div>`}
function demoBanner(){return state.mode==='demo'?`<div class="demo-banner">${ic('shield','sm')} Demonstração local — os dados de teste ficam neste navegador. Para compartilhar com seu sócio em dispositivos diferentes, configure o modo privado online.</div>`:''}
function latestMetric(listingId){const e=listingExps(listingId)[0];return e? (e.reviewed_at?e.after_visits:e.before_visits):0}
function home(){const d=state.data;const total=d.listings.length;const active=d.experiments.filter(x=>!x.reviewed_at);const due=active.filter(x=>new Date(x.review_at)<=new Date());const done=d.experiments.filter(x=>x.reviewed_at&&pct(x)!==null);const avg=done.length?Math.round(done.reduce((a,x)=>a+pct(x),0)/done.length):0;const recents=experiments().slice(0,4);const ls=lessons();return `<section class="sh-hero"><span class="sh-pill">${ic('spark','sm')} Workspace privado · ${total} anúncio${total===1?'':'s'}</span><h1>Bom trabalho, ${escapeHtml(displayName())} <span class="ag-text">✦</span></h1><p>Aqui suas ideias viram testes — e os testes viram decisões.</p><div class="hero-actions"><button class="btn primary" data-action="new-experiment">Novo acompanhamento ${ic('arrow','sm')}</button><button class="btn soft" data-action="new-listing">Adicionar anúncio</button></div><div class="sh-float fl-left card"><small>Testes em andamento</small><b>${active.length}</b></div><div class="sh-float fl-right card"><small>Revisões pendentes</small><b>${due.length}</b></div></section><div class="stats-grid"><div class="card stat-card"><div class="stat-icon">${ic('box')}</div><div class="stat-label">Anúncios cadastrados</div><div class="stat-main"><span class="stat-num">${total}</span></div><div class="stat-desc">No workspace</div></div><div class="card stat-card"><div class="stat-icon">${ic('clock')}</div><div class="stat-label">Testes em andamento</div><div class="stat-main"><span class="stat-num">${active.length}</span></div><div class="stat-desc">Com prazo de revisão</div></div><div class="card stat-card"><div class="stat-icon">${ic('calendar')}</div><div class="stat-label">Revisões pendentes</div><div class="stat-main"><span class="stat-num">${due.length}</span></div><div class="stat-desc">Aguardando medição</div></div><div class="card stat-card"><div class="stat-icon">${ic('trend')}</div><div class="stat-label">Variação média de visitas</div><div class="stat-main"><span class="stat-num">${done.length?(avg>0?'+':'')+avg+'%':'—'}</span></div><div class="stat-desc">${done.length} teste${done.length===1?'':'s'} avaliado${done.length===1?'':'s'}</div></div></div><div class="content-grid"><section class="card panel"><div class="panel-heading"><div><b class="section-title">Acompanhamentos recentes</b><p class="section-sub">O que foi alterado e quando revisar</p></div><button class="link-action" data-action="route" data-id="listings">Ver anúncios ${ic('arrow','sm')}</button></div>${recents.length?recents.map(x=>{const l=listingBy(x.listing_id);return `<div class="project-row" data-action="detail" data-id="${x.listing_id}">${pic(l?.image_path||x.image_path)}<div style="min-width:0"><div class="project-title">${escapeHtml(l?.title||'Anúncio')}</div><div class="project-info">${escapeHtml(x.change_type)} · ${escapeHtml(l?.marketplace||'')} · ${dt(x.started_at)}</div></div><div class="project-meta">${badge(x)}<div class="countdown-small" data-timer="${x.id}">${timerText(x)}</div></div></div>`}).join(''):`${empty('Nenhum acompanhamento','Cadastre um anúncio e crie seu primeiro teste.', 'Novo teste','new-experiment')}`}</section><section class="card panel"><div class="panel-heading"><div><b class="section-title">Atalhos do dia</b><p class="section-sub">Tudo à mão, sem mudar de rotina</p></div></div><div class="action-list"><button class="action-tile" data-action="route" data-id="chat"><div class="action-symbol">${ic('chat')}</div><div><b>Conversar com o sócio</b><small>Chat, prints e histórico em um só lugar</small></div>${ic('arrow')}</button><button class="action-tile" data-action="route" data-id="pricing"><div class="action-symbol">${ic('chart')}</div><div><b>Calcular preço de venda</b><small>Shopee e Mercado Livre</small></div>${ic('arrow')}</button><button class="action-tile" data-action="new-idea"><div class="action-symbol">${ic('bulb')}</div><div><b>Anotar uma nova ideia</b><small>Salve antes de esquecer</small></div>${ic('arrow')}</button><button class="action-tile" data-action="route" data-id="playbooks"><div class="action-symbol">${ic('copy')}</div><div><b>Atualizar passo a passo</b><small>Guia vivo da operação</small></div>${ic('arrow')}</button><button class="action-tile" data-action="route" data-id="learning"><div class="action-symbol">${ic('spark')}</div><div><b>Ver o que está funcionando</b><small>Aprendizados dos seus testes</small></div>${ic('arrow')}</button></div><div class="insight-box"><div class="lead">${ic('spark','sm')} Insight da operação</div><p>${ls.length?`Seu melhor tipo de alteração até agora foi <b>${escapeHtml(ls[0].label)}</b>, com variação média de ${ls[0].avg>=0?'+':''}${ls[0].avg}% nas visitas (${ls[0].count} teste${ls[0].count===1?'':'s'}).`:'Comece a marcar os resultados dos testes. O painel irá identificar quais tipos de mudança mais ajudaram os anúncios.'}</p></div></section></div><div class="bottom-grid"><section class="card panel"><div class="panel-heading"><div><b class="section-title">Evolução dos anúncios</b><p class="section-sub">Comparação antes × depois dos testes finalizados</p></div><span class="secondary-pill">${ic('chart','sm')} Visitas</span></div>${chart(done)}</section><section class="card panel"><div class="panel-heading"><div><b class="section-title">Atividade da equipe</b><p class="section-sub">Novidades no workspace</p></div></div><div class="activity">${activity().slice(0,3).map(x=>`<div class="activity-item"><div class="activity-icon">${ic(x.icon,'sm')}</div><div><b>${escapeHtml(x.title)}</b><p>${escapeHtml(x.body)}</p><time>${dt(x.date)} às ${tm(x.date)}</time></div></div>`).join('')||'<p class="tiny-txt">Nenhuma atividade por enquanto.</p>'}</div></section></div>`}
function chart(done){if(!done.length)return `<div class="empty" style="padding:27px">${ic('chart')}<p>Quando vocês registrarem a medição depois de uma mudança, o gráfico aparecerá aqui.</p></div>`;const selected=[...done].sort((a,b)=>new Date(a.reviewed_at)-new Date(b.reviewed_at)).slice(-6);const max=Math.max(...selected.flatMap(e=>[e.before_visits,e.after_visits]),1);const w=600,h=154,pad=30,step=(w-pad*2)/Math.max(1,selected.length-1);const pts=arr=>selected.map((e,i)=>`${pad+i*step},${h-15-arr(e)/max*(h-40)}`).join(' ');return `<div class="chart-wrap"><svg viewBox="0 0 600 154" preserveAspectRatio="none" aria-label="Evolução de visitas"><defs><linearGradient id="areagrad" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#9f91ef" stop-opacity=".18"/><stop offset="1" stop-color="#9f91ef" stop-opacity="0"/></linearGradient></defs>${[40,80,120].map(y=>`<line x1="0" x2="600" y1="${y}" y2="${y}" stroke="#ffffff" stroke-opacity=".075" stroke-dasharray="4 8"/>`).join('')}<polyline points="${pts(e=>e.before_visits)}" fill="none" stroke="#7c90b8" stroke-opacity=".65" stroke-width="2.5" stroke-dasharray="6 5"/><polyline points="${pts(e=>e.after_visits)}" fill="none" stroke="#a998ff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>${selected.map((e,i)=>{const x=pad+i*step,y=h-15-e.after_visits/max*(h-40);return `<circle cx="${x}" cy="${y}" r="4" fill="#b8a7ff" stroke="#22283d" stroke-width="2"><title>${escapeHtml(listingBy(e.listing_id)?.title||'Teste')}: ${e.after_visits} visitas</title></circle>`}).join('')}</svg></div><div class="chart-labels"><span>◌ Antes (tracejado)</span><span>● Depois</span><span>${selected.length} medições</span></div>`}
function activity(){const v=[];for(const e of state.data.experiments)v.push({date:e.started_at,title:'Novo teste criado',body:`${memberName(e.created_by)}: ${e.label}`,icon:'target'});for(const e of state.data.ideas)v.push({date:e.created_at,title:'Ideia registrada',body:`${memberName(e.created_by)}: ${e.title}`,icon:'bulb'});for(const m of state.data.messages)v.push({date:m.created_at,title:'Mensagem na equipe',body:`${memberName(m.author)}: ${m.body?.slice(0,80)||'Imagem enviada'}`,icon:'chat'});return v.sort((a,b)=>new Date(b.date)-new Date(a.date))}
function empty(title,desc,btn,action){return `<div class="empty">${ic('box','lg')}<h3>${title}</h3><p>${desc}</p>${btn?`<button class="btn soft sm" data-action="${action}">${ic('plus','sm')} ${btn}</button>`:''}</div>`}
function listingsPage(){const ls=byTime(state.data.listings).filter(l=>[l.title,l.store,l.marketplace].join(' ').toLowerCase().includes(state.search.toLowerCase())&&(state.filter==='Todos'||l.marketplace===state.filter));return `${pageHead('SEUS PRODUTOS','Central de anúncios','Cada anúncio com seu próprio histórico de testes, imagens e resultados.',`<button class="btn primary" data-action="new-listing">${ic('plus','sm')} Novo anúncio</button>`)}<div class="filterbar"><label class="searchbox">${ic('search','sm')}<input data-search placeholder="Buscar produto, loja ou canal..." value="${escapeHtml(state.search)}" /></label><select class="select" data-filter><option>Todos</option><option ${state.filter==='Shopee'?'selected':''}>Shopee</option><option ${state.filter==='Mercado Livre'?'selected':''}>Mercado Livre</option><option ${state.filter==='TikTok Shop'?'selected':''}>TikTok Shop</option><option ${state.filter==='Outro'?'selected':''}>Outro</option></select></div>${ls.length?`<div class="listing-grid">${ls.map(l=>{const ex=listingExps(l.id),active=ex.filter(x=>!x.reviewed_at);return `<article class="card listing-card" data-action="detail" data-id="${l.id}"><div class="listing-top">${pic(l.image_path)}<div><h3>${escapeHtml(l.title)}</h3><div class="market">${escapeHtml(l.store)} · ${escapeHtml(l.marketplace)}</div></div></div><div class="list-stat"><div><small>Últimas visitas</small><b>${fmt(latestMetric(l.id))}</b></div><div><small>Acompanhamentos</small><b>${ex.length}</b></div><div><small>Em curso</small><b>${active.length}</b></div></div><footer><span>${ex.length?badge(ex[0]):'<span class="tag neutral">Ainda sem testes</span>'}</span><span>Ver histórico ${ic('arrow','sm')}</span></footer></article>`}).join('')}</div>`:empty('Nenhum anúncio encontrado','Cadastre um produto para começar a acompanhar seu desempenho.','Adicionar anúncio','new-listing')}`}
function detailPage(){const l=listingBy(state.detail);if(!l){state.route='listings';return listingsPage()}const ex=listingExps(l.id);return `<button class="backlink" data-action="route" data-id="listings">${ic('arrowleft','sm')} Voltar aos anúncios</button><div class="details-head"><div class="detail-top">${pic(l.image_path)}<div><span class="page-eyebrow"><i class="dot"></i> HISTÓRICO DO PRODUTO</span><h1>${escapeHtml(l.title)}</h1><small>${escapeHtml(l.store)} · ${escapeHtml(l.marketplace)} · Criado em ${dt(l.created_at)}</small></div></div><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn soft" data-action="edit-listing" data-id="${l.id}">Editar cadastro</button>${l.link?`<a class="btn outline" href="${escapeHtml(safeUrl(l.link))}" target="_blank" rel="noopener noreferrer">${ic('ext','sm')} Abrir anúncio</a>`:''}<button class="btn primary" data-action="new-experiment" data-id="${l.id}">${ic('plus','sm')} Novo teste</button></div></div><div class="panel-heading" style="margin:22px 0 15px"><div><b class="section-title">Linha do tempo das mudanças</b><p class="section-sub">Guarde os dados iniciais e compare no dia da revisão.</p></div><span class="secondary-pill">${ex.length} teste(s)</span></div><div class="timeline">${ex.length?ex.map(x=>`<div class="card experiment"><div class="exp-top"><div><h3 class="exp-title">${escapeHtml(x.label)}</h3><div class="exp-note">${escapeHtml(x.changes||'Sem detalhes adicionais.')}</div><div class="exp-meta"><span>${escapeHtml(x.change_type)}</span><span>${ic('calendar','sm')} Início: ${dt(x.started_at)}</span><span>Responsável: ${escapeHtml(memberName(x.created_by))}</span></div></div>${badge(x)}</div>${x.image_path?`<img class="exp-snap" alt="Imagem registrada no teste" data-photo="${escapeHtml(x.image_path)}" data-action="open-photo"/>`:''}<div class="exp-bottom"><div class="exp-metric"><small>Visitas iniciais</small><b>${fmt(x.before_visits)}</b></div><div class="exp-metric"><small>Visitas na revisão</small><b>${x.after_visits==null?'—':fmt(x.after_visits)}</b></div><div class="exp-metric"><small>Variação nas visitas</small><b style="color:${pct(x)!=null?(pct(x)>=0?'#86e8c9':'#ffb1b8'):'#f4f6fd'}">${pct(x)==null?'—':`${pct(x)>0?'+':''}${pct(x)}%`}</b></div></div>${x.reviewed_at?`<p class="tiny-txt" style="margin:14px 0 0">Pedidos: ${fmt(x.before_sales)} → ${fmt(x.after_sales)} ${x.notes_after?' · '+escapeHtml(x.notes_after):''}</p>`:''}<div class="exp-controls"><span class="timer ${x.reviewed_at?'done':Date.now()>=new Date(x.review_at)?'over':''}" data-timer="${x.id}">${ic('clock','sm')} ${timerText(x)}</span>${!x.reviewed_at?`<button class="btn ${Date.now()>=new Date(x.review_at)?'primary':'soft'} sm" data-action="review" data-id="${x.id}">${ic('chart','sm')} Registrar resultado</button>`:'<span class="tag done">'+ic('check','sm')+' Resultado salvo</span>'}</div></div>`).join(''):empty('Nenhuma alteração registrada','Anote a mudança feita, as visitas atuais e escolha quando comparar novamente.','Criar primeiro teste','new-experiment')}</div>`}
function chatPage(){const messages=[...state.data.messages].sort((a,b)=>new Date(a.created_at)-new Date(b.created_at));let lastDay='';return `${pageHead('MENSAGENS DA EQUIPE','Conversas em tempo real','Compartilhem orientações, ideias e imagens sem perder o contexto.',`<a href="${escapeHtml(links.meet)}" target="_blank" rel="noopener noreferrer" class="btn primary">${ic('video','sm')} Abrir Google Meet</a>`)}<div class="card chat-layout"><div class="chat-side"><h3>Mensagens</h3><div class="chat-channel"><div class="action-symbol">${ic('team')}</div><div><b>Equipe ESSO</b><small>Canal de trabalho</small></div></div><div class="insight-box" style="margin-top:21px"><div class="lead">${ic('shield','sm')} Privacidade</div><p>${state.mode==='demo'?'Simulação no seu navegador. O chat online depende do modo privado com Supabase.':'Somente as contas autorizadas da equipe podem ler e enviar mensagens.'}</p></div></div><div class="chat-main"><div class="chat-header"><div class="avatar">MM</div><div><h3>Equipe ESSO · Geral</h3><p>Seu espaço para resolver tudo sobre a loja</p></div><a class="btn soft sm" href="${escapeHtml(links.meet)}" target="_blank" rel="noopener noreferrer">${ic('video','sm')} Iniciar reunião</a></div><div class="chat-scroll">${messages.map(m=>{let day=new Date(m.created_at).toDateString();let stamp='';if(day!==lastDay){stamp=`<div class="message-day">${dt(m.created_at)}</div>`;lastDay=day}const isMine=m.author===state.user.id;return `${stamp}<div class="message ${isMine?'mine':''}"><div class="avatar ${isMine?'':'partner'}">${initials(memberName(m.author))}</div><div class="bubble"><b>${escapeHtml(memberName(m.author))}</b>${m.body?escapeHtml(m.body):''}${m.attachment_path?`<img alt="Imagem enviada" data-photo="${escapeHtml(m.attachment_path)}" data-action="open-photo"/>`:''}<time>${tm(m.created_at)}</time></div></div>`}).join('')||'<div class="empty">Mande a primeira mensagem da equipe.</div>'}</div><form id="chat-form" class="chat-compose"><div id="chat-file-preview"></div><div class="compose-box"><label class="emoji-btn" title="Anexar imagem">${ic('paperclip')}<input id="chat-attachment" type="file" accept="image/*" hidden /></label><textarea id="chat-text" rows="1" placeholder="Escreva uma mensagem para sua equipe..."></textarea><button class="btn primary icon-only" type="submit" title="Enviar mensagem">${ic('send')}</button></div><div class="compose-hint">Enter para enviar · Shift + Enter para quebrar linha · Envie prints dos anúncios</div></form></div></div>`}
function ideasPage(){const groups=['A fazer','Em andamento','Concluída'];return `${pageHead('CRIE • TESTE • APRENDA','Banco de ideias','Nada se perde. Toda ideia vira oportunidade de teste.',`<button class="btn primary" data-action="new-idea">${ic('plus','sm')} Nova ideia</button>`)}<div class="idea-board">${groups.map(group=>{const ideas=byTime(state.data.ideas).filter(i=>i.status===group);return `<div class="card idea-col"><div class="idea-col-head">${group}<small>${ideas.length}</small></div>${ideas.map(i=>`<div class="idea-card"><span class="tag ${i.priority==='Alta'?'due':'neutral'}" style="margin-bottom:12px">${escapeHtml(i.priority)} · ${escapeHtml(i.platform)}</span><h4>${escapeHtml(i.title)}</h4><p>${escapeHtml(i.description)}</p><footer><span>Por ${escapeHtml(memberName(i.created_by))}<br/>${dt(i.created_at)}</span><select data-idea-status data-id="${i.id}" aria-label="Mudar status da ideia">${groups.map(s=>`<option ${s===i.status?'selected':''}>${s}</option>`).join('')}</select></footer></div>`).join('')||'<div class="tiny-txt" style="padding:17px">Nenhuma ideia nesta etapa.</div>'}</div>`}).join('')}</div>`}
function learningPage(){const rows=lessons(), done=state.data.experiments.filter(x=>x.reviewed_at&&pct(x)!=null).sort((a,b)=>(pct(b)||0)-(pct(a)||0));const winner=done[0];return `${pageHead('CONHECIMENTO DA EQUIPE','Aprendizados da loja','O que mudou, o que funcionou e o que vale repetir.',`<button class="btn soft" data-action="new-experiment">${ic('plus','sm')} Novo experimento</button>`)}<div class="learning-grid"><div class="card learning-card"><h3>${ic('trend')} Alterações que mais geram visitas</h3><p>Média da variação percentual de visitas por tipo de alteração. Baseada nos resultados que vocês registrarem.</p>${rows.length?rows.map(r=>`<div class="learning-line"><span>${escapeHtml(r.label)}</span><span class="tiny-txt">${r.count} teste(s)</span><b style="color:${r.avg<0?'#ffb1b8':'#89eac8'}">${r.avg>0?'+':''}${r.avg}%</b></div>`).join(''):'<div class="tiny-txt">Finalize ao menos um teste para gerar aprendizados.</div>'}<div class="learning-footer">${ic('spark','sm')} O painel identifica padrões nos resultados registrados, mas não atribui causalidade: preço, tráfego, sazonalidade e campanhas também podem influenciar as visitas.</div></div><div class="card learning-card"><h3>${ic('target')} Próximo melhor passo</h3>${winner?`<p>O experimento com maior crescimento de visitas até agora foi <b>${escapeHtml(winner.label)}</b> no anúncio <b>${escapeHtml(listingBy(winner.listing_id)?.title||'')}</b>.</p><div class="insight-box"><div class="lead">${ic('spark','sm')} Hipótese para testar</div><p>Considere testar um ajuste semelhante em outro produto comparável, sem alterar tudo ao mesmo tempo. Registre visitas e pedidos antes da mudança.</p></div>`:`<p>Você ainda não possui testes comparados. Crie um acompanhamento, espere o prazo e registre os resultados.</p><button class="btn primary sm" data-action="new-experiment">Criar acompanhamento</button>`}<div class="divider"></div><h3>${ic('box')} Histórico pesquisável</h3><p>${state.data.experiments.length} alteração(ões) documentada(s), incluindo o que foi feito, datas e medições.</p><button class="btn soft sm" data-action="route" data-id="listings">Ver o histórico completo ${ic('arrow','sm')}</button></div></div>${done.length?`<div class="card panel" style="margin-top:18px"><div class="panel-heading"><b class="section-title">Resultados registrados</b><span class="tiny-txt">Ordenados pela variação de visitas</span></div>${done.map(x=>`<div class="project-row" data-action="detail" data-id="${x.listing_id}">${pic(listingBy(x.listing_id)?.image_path)}<div><div class="project-title">${escapeHtml(x.label)}</div><div class="project-info">${escapeHtml(listingBy(x.listing_id)?.title||'')} · ${fmt(x.before_visits)} → ${fmt(x.after_visits)} visitas</div></div><div class="project-meta"><strong style="color:${pct(x)>=0?'#81dec5':'#ffa8b4'}">${pct(x)>0?'+':''}${pct(x)}%</strong></div></div>`).join('')}</div>`:''}${assistantPanel()}`}
function normalizeWords(s){return String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()}
function answerFromHistory(question){
  const query=normalizeWords(question).trim();
  const done=state.data.experiments.filter(x=>x.reviewed_at&&x.after_visits!==null), ranked=lessons();
  const stop=new Set(['qual','quais','como','para','mais','menos','minha','nossa','sobre','anuncio','anuncios','produto','produtos','visitas','vendas','resultado','resultados','pode','ajuda','ajudar','melhor','melhorar','estao','estou','devo','fazer','tive','funcionou','funciona','tipo','alteracao','teste','testes','depois','antes','esse','essa','algum','alguma','historico']);
  const terms=query.split(/[^a-z0-9]+/).filter(w=>w.length>=4&&!stop.has(w)).map(w=>w.endsWith('s')?w.slice(0,-1):w);
  const found=terms.length?state.data.experiments.filter(x=>{
    const l=listingBy(x.listing_id)||{};
    const hay=normalizeWords([l.title,l.store,l.marketplace,x.label,x.changes,x.change_type].join(' '));
    return terms.some(w=>hay.includes(w));
  }):[];
  if(found.length){
    const rec=found.filter(x=>x.reviewed_at && x.after_visits!==null);
    if(rec.length){const best=[...rec].sort((a,b)=>(pct(b)||0)-(pct(a)||0))[0];return `Encontrei ${found.length} acompanhamento(s) relacionado(s) à sua pergunta, com ${rec.length} avaliação(ões) concluída(s). Melhor variação registrada: ${best.label} (${listingBy(best.listing_id)?.title||'produto'}), de ${fmt(best.before_visits)} para ${fmt(best.after_visits)} visitas (${pct(best)>0?'+':''}${pct(best)}%). Confira se as condições dos testes são semelhantes antes de repetir.`}
    return `Encontrei ${found.length} acompanhamento(s) relacionado(s), mas ainda sem medição final. Quando a revisão chegar, registre novas visitas e pedidos para identificar o efeito da mudança.`;
  }
  if(ranked.length){const top=ranked[0];return `Nos testes já avaliados, a alteração com maior crescimento médio de visitas foi “${top.label}”: ${top.avg>0?'+':''}${top.avg}% em ${top.count} teste(s). Sugestão: experimente uma mudança semelhante em outro anúncio, registre visitas e pedidos antes e depois e evite alterar várias variáveis ao mesmo tempo. Isso é uma tendência observada, não garantia de resultado.`}
  return 'Ainda não existem medições suficientes para recomendar uma mudança com base no histórico. Registre um teste com a foto, o tipo de ajuste e as visitas iniciais; depois preencha o resultado na data da revisão. Assim o painel poderá comparar estratégias.';
}
function playbooksPage(){
  const docs=byTime(state.data.playbooks,'updated_at');
  return `${pageHead('PROCESSOS DA OPERAÇÃO','Passo a passo da ESSO','Registre o que vocês aprendem com o tempo e editem sempre que o processo evoluir.',`<button class="btn primary" data-action="new-playbook">${ic('plus','sm')} Novo passo a passo</button>`)}
  <div class="card panel playbook-hero"><div class="panel-heading"><div><b class="section-title">Biblioteca viva de processos</b><p class="section-sub">Checklists, rotinas, boas práticas e aprendizados da equipe.</p></div></div><div class="glass-note">Use esta área para salvar processos como <b>como criar uma capa melhor</b>, <b>como revisar um anúncio em 7 dias</b> ou <b>quais dados anotar antes de mudar uma oferta</b>. Tudo fica editável.</div></div>
  ${docs.length?`<div class="playbook-grid">${docs.map(p=>`<article class="card playbook-card"><span class="step-chip">${ic('copy','sm')} ${escapeHtml(p.section||'Geral')}</span><h4>${escapeHtml(p.title)}</h4><p>${escapeHtml(p.content)}</p><div class="playbook-meta"><span>Atualizado em ${dt(p.updated_at||p.created_at)} · por ${escapeHtml(memberName(p.created_by))}</span><button class="btn soft sm" data-action="edit-playbook" data-id="${p.id}">${ic('settings','sm')} Editar</button></div></article>`).join('')}</div>`:empty('Nenhum passo a passo salvo','Crie seu primeiro guia editável para registrar tudo que a operação aprender ao longo do tempo.','Novo passo a passo','new-playbook')}`
}

const brl=value=>Number(value||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const prn=x=>Number(x||0).toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2});
function priceInput(label,key,opts={}){const x=state.pricing,v=x[key];return `<label class="pr-field"><span>${escapeHtml(label)}</span><div class="pr-input-wrap">${opts.prefix?`<small>${opts.prefix}</small>`:''}<input type="number" inputmode="decimal" min="0" max="${opts.max??1000000}" step="0.01" data-price-field="${key}" value="${escapeHtml(v===null?'':v)}" ${opts.placeholder?`placeholder="${escapeHtml(opts.placeholder)}"`:''}/>${opts.suffix?`<small>${opts.suffix}</small>`:''}</div></label>`}
function priceSelect(label,key,choices){return `<label class="pr-field"><span>${escapeHtml(label)}</span><select data-price-field="${key}">${choices.map(c=>`<option value="${escapeHtml(c)}" ${state.pricing[key]===c?'selected':''}>${escapeHtml(c)}</option>`).join('')}</select></label>`}
function priceResultHtml(){const x=state.pricing,r=priceEngine.calc(x);return `<div class="pr-result-head"><span class="step-chip">${ic('spark','sm')} PREÇO DE VENDA</span><h3>Preço recomendado</h3>${r.valid?`<strong class="pr-amount">${brl(r.price)}</strong><p>Preço que busca a margem de ${prn(x.marginPct)}% com as taxas configuradas.</p>`:`<strong class="pr-amount pr-empty">—</strong><p>${escapeHtml(r.error)}</p>`}</div>${r.valid?`<div class="pr-metrics"><div><span>Preço em análise</span><strong>${brl(r.applied)}</strong></div><div><span>Repasse estimado após tarifas e frete</span><strong>${brl(r.payout)}</strong></div><div><span>Lucro por unidade</span><strong class="${r.profit<0?'negative':'positive'}">${brl(r.profit)}</strong></div><div><span>Margem real da venda</span><strong class="${r.margin<0?'negative':'positive'}">${prn(r.margin)}%</strong></div><div><span>Tarifas + envio + imposto</span><strong>${brl(r.fees)}</strong></div><div><span>Produto + embalagem + outros custos</span><strong>${brl(r.totalCost)}</strong></div></div><div class="pr-details"><b>Detalhamento</b><span>Comissão proporcional <em>${brl(r.feeValue)}</em></span><span>Tarifa fixa <em>${brl(r.fixed)}</em></span><span>Impostos <em>${brl(r.taxValue)}</em></span><span>Envio pago por você <em>${brl(r.ship)}</em></span>${r.cpf?`<span>Adicional CPF <em>${brl(r.cpf)}</em></span>`:''}${r.freight?`<span>Coparticipação cupom <em>${brl(r.freight)}</em></span>`:''}${r.other?`<span>Outras tarifas de marketplace <em>${brl(r.other)}</em></span>`:''}<span class="pr-zone">${escapeHtml(r.band)}</span></div><button type="button" class="btn primary rainbow pr-save" data-action="save-price">${ic('check','sm')} Salvar cálculo no histórico</button><button type="button" class="btn outline pr-copy" data-action="copy-price">${ic('copy','sm')} Copiar resultado</button>`:`<p class="tiny-txt">Quando informar o custo e as taxas, a simulação aparecerá aqui automaticamente.</p>`}`}
function pricePage(){const x=state.pricing,r=priceEngine.calc(x);const history=byTime(state.data.price_calculations).slice(0,12);return `${pageHead('FINANÇAS • SHOPEE • MERCADO LIVRE','Calculadora de preços','Modelo baseado nas fórmulas da sua planilha. Custos, taxas, frete e margem editáveis.',`<button class="btn soft" data-action="reset-price">${ic('trash','sm')} Limpar simulação</button>`)}<div class="pr-tabs"><button class="pr-tab ${x.market==='Shopee'?'selected':''}" type="button" data-action="price-market" data-id="Shopee">Shopee</button><button class="pr-tab ${x.market==='Mercado Livre'?'selected':''}" type="button" data-action="price-market" data-id="Mercado Livre">Mercado Livre</button><span class="step-chip">Tarifas editáveis • conforme sua planilha</span></div><div class="pr-grid"><section class="card pr-box"><div class="pr-title">${ic('box')} Dados do produto</div><label class="pr-field"><span>Identificação do produto (opcional)</span><input type="text" maxlength="160" data-price-field="name" value="${escapeHtml(x.name)}" placeholder="Para identificar no histórico"/></label><div class="pr-two">${priceInput('Custo de compra','cost',{prefix:'R$'})}${priceInput('Embalagem','packaging',{prefix:'R$'})}</div>${priceInput('Outros custos por venda','otherCost',{prefix:'R$'})}<div class="pr-two">${priceInput('Imposto sobre a venda','taxPct',{suffix:'%'})}${priceInput('Margem desejada sobre venda','marginPct',{suffix:'%'})}</div><div class="pr-toggle"><label><input type="checkbox" data-price-field="customPrice" ${x.customPrice?'checked':''}/> Testar preço diferente do recomendado</label></div>${x.customPrice?priceInput('Preço de teste','testPrice',{prefix:'R$'}):'<div class="pr-inline-note">O preço de teste acompanha o recomendado automaticamente.</div>'}</section><section class="card pr-box"><div class="pr-title">${ic('chart')} Taxas da ${x.market==='Shopee'?'Shopee':'Mercado Livre'}</div>${x.market==='Shopee'?`${priceSelect('Tipo de conta','account',['CPF','CNPJ'])}${priceSelect('Modalidade de envio','delivery',['Shopee Envios','Logística própria'])}<div class="pr-two">${priceInput('Adicional CPF / item','cpfExtra',{prefix:'R$'})}${priceInput('Taxa fixa manual (opcional)','fixedOverride',{prefix:'R$'})}</div><div class="pr-two">${priceInput('Cupom de frete usado','voucher',{prefix:'R$'})}${priceInput('Frete extra pago por você','shipExtra',{prefix:'R$'})}</div><p class="tiny-txt">Se usar logística própria, o modelo estima coparticipação de 25% do cupom, limitada a R$ 10. Confirme no seu painel.</p><div class="pr-rates-head">Comissões e taxas por faixa <span>editáveis</span></div><div class="pr-rates"><div class="pr-rate-row rate-header"><span>Faixa</span><span>Comissão %</span><span>Fixo R$</span></div>${priceEngine.bands.map((b,i)=>`<div class="pr-rate-row"><span>${escapeHtml(b.label)}</span><input aria-label="Comissão para ${escapeHtml(b.label)}" type="number" min="0" max="100" step="0.1" data-price-fee="pct" data-index="${i}" value="${x.shopeePct[i]}"/><input aria-label="Taxa fixa para ${escapeHtml(b.label)}" type="number" min="0" step="0.01" data-price-fee="fixed" data-index="${i}" value="${x.shopeeFixed[i]}"/></div>`).join('')}</div><p class="tiny-txt">Para conta CNPJ abaixo de R$ 9, a planilha considera fixo de 50% do preço. O valor manual tem prioridade.</p>`:`${priceSelect('Tipo de anúncio','listingType',['Clássico','Premium'])}<div class="pr-two">${priceInput('Tarifa da categoria / anúncio','mlPct',{suffix:'%'})}${priceInput('Tarifa fixa por item','mlFixed',{prefix:'R$'})}</div>${priceInput('Custo de envio pago por você','mlShip',{prefix:'R$'})}${priceInput('Outras taxas do Mercado Livre','mlOther',{prefix:'R$'})}<div class="glass-note">Informe a tarifa da sua categoria e o custo de envio que o simulador do Mercado Livre mostra para o anúncio. Clássico/Premium é apenas uma identificação; a tarifa não é presumida automaticamente.</div>`}</section><aside class="card pr-box pr-summary"><div id="price-output" aria-live="polite">${priceResultHtml()}</div></aside></div><div class="card panel pr-history"><div class="panel-heading"><div><b class="section-title">Histórico de preços salvos</b><p class="section-sub">${state.mode==='demo'?'Salvo neste navegador.':'Compartilhado entre as duas contas autorizadas.'}</p></div><span class="tiny-txt">${history.length} registro(s) recente(s)</span></div>${history.length?history.map(h=>`<div class="project-row"><div class="action-symbol">${ic('chart')}</div><div class="pr-history-text"><strong>${escapeHtml(h.name||'Sem nome')}</strong><small>${escapeHtml(h.marketplace)} · ${dt(h.created_at)} · por ${escapeHtml(memberName(h.created_by))}</small></div><b>${brl(h.price)}</b><button class="btn soft sm" data-action="price-load" data-id="${h.id}">Reabrir</button></div>`).join(''):`<div class="glass-note">Nenhum cálculo salvo. Preencha o custo, confira as taxas e clique em <b>Salvar cálculo</b>.</div>`}</div><p class="pr-disclaimer">Os percentuais iniciais reproduzem sua planilha de referência de outubro/2026 e podem não corresponder às tarifas atuais. Confirme sempre com o painel da Shopee ou Mercado Livre; o cálculo não lê automaticamente os dados das plataformas.</p>`}
function refreshPriceOutput(){const box=$('#price-output');if(box)box.innerHTML=priceResultHtml()}

function assistantPanel(){return `<section class="card panel" style="margin-top:18px"><div class="panel-heading"><div><b class="section-title">${ic('spark','sm')} Pergunte ao seu histórico</b><p class="section-sub">Busca contextual simples nos testes da loja. Não é um chatbot de IA.</p></div></div><form id="ask-form" class="filterbar" style="margin-bottom:11px"><label class="searchbox" style="max-width:none">${ic('search','sm')}<input name="question" required minlength="4" maxlength="250" placeholder="Ex.: O que funcionou para meus chinelos?" value="${escapeHtml(state.askQuestion||'')}" /></label><button class="btn primary" type="submit">Consultar testes ${ic('arrow','sm')}</button></form>${state.askAnswer?`<div class="insight-box"><div class="lead">${ic('spark','sm')} Resposta baseada no histórico</div><p>${escapeHtml(state.askAnswer)}</p></div>`:`<p class="tiny-txt">Experimente perguntar “Qual mudança aumentou mais as visitas?” ou “O que fizemos nas camisetas?”. O resultado usa apenas as informações cadastradas.</p>`}</section>`}
function settingsPage(){return `${pageHead('PREFERÊNCIAS','Configurações','Acesso, identidade visual e detalhes do ambiente.')}<div class="settings-grid"><div class="card setting-card"><h3>${ic('team')} Pessoas com acesso</h3><p>${state.mode==='demo'?'Na demonstração, é possível alternar entre dois perfis para testar a conversa e o chat em tempo real entre abas do navegador.':'Os membros são autorizados pelo administrador do Supabase. Não existe cadastro público.'}</p>${state.data.members.map(m=>`<div class="member-row"><div class="avatar ${m.role==='partner'?'partner':''}">${initials(m.display_name)}</div><div><strong style="font-size:12px">${escapeHtml(m.display_name)}</strong><div class="tiny-txt">${m.role==='owner'?'Administrador':'Sócio'}</div></div><span class="right">${state.mode==='demo'?'Exemplo':'Autorizado'}</span></div>`).join('')}${state.mode==='demo'?`<button class="btn soft sm" data-action="switch-user">${ic('team','sm')} Alternar para ${state.user.id==='demo-owner'?'Daka':'João'}</button>`:`<div class="learning-footer">Para adicionar ou remover usuários, use o painel do Supabase (Authentication + tabela members). Nunca compartilhe sua senha.</div>`}</div><div class="card setting-card"><h3>${ic('shield')} Segurança e sincronização</h3><p>${state.mode==='demo'?'Modo local: a demonstração salva os dados no navegador e sincroniza entre abas abertas no mesmo browser. Para uso privado entre dois dispositivos, configure o modo online com Supabase.':'Modo privado online: login individual, banco protegido por políticas RLS, imagens em armazenamento privado e mensagens sincronizadas.'}</p><div class="divider"></div><p><b style="color:white">Identidade visual</b><br/>A identidade padrão já vem com uma marca ESSO estilizada em gelo esfumaçado 3D. Se quiser trocar depois, você pode apontar um <code>brandLogo</code> em <code>config.js</code>.</p><p class="tiny-txt">Marca atual: ${escapeHtml(cfg.brandName||'ESSO')}</p>${signature(state.data.members.map(m=>m.display_name).join(' & ')||cfg.brandName)}${state.mode==='cloud'?`<button class="btn outline sm" data-action="logout">${ic('log','sm')} Sair da conta</button>`:`<button class="btn outline sm" data-action="reset-demo">${ic('trash','sm')} Restaurar dados de teste</button>`}</div><div class="card setting-card"><h3>${ic('ext')} Integrações rápidas</h3><p>Links oficiais. A conexão com dados internos desses serviços não está incluída.</p><div class="action-list">${[['upseller','UpSeller'],['dogama','Dogama'],['meet','Google Meet']].map(([k,n])=>`<a class="action-tile" href="${escapeHtml(links[k])}" target="_blank" rel="noopener noreferrer"><div><b>${n}</b><small>Abre em nova aba</small></div>${ic('ext','sm')}</a>`).join('')}</div></div><div class="card setting-card"><h3>${ic('spark')} Como o painel aprende</h3><p>O sistema organiza seus testes e mostra quais ajustes tiveram aumento ou queda de visitas. É uma inteligência estatística simples e transparente.</p><p>O painel já compara históricos e facilita a consulta dos aprendizados. Se quiser uma IA avançada no futuro, ela pode ser integrada com backend seguro.</p><div class="learning-footer">Recomendação: mudar uma variável por teste e guardar tanto visitas quanto pedidos, para comparar melhor.</div></div></div>`}
function modalShell(title,sub,body,save='Salvar'){return `<div class="modal-shade" id="modal-shade"><div class="modal" role="dialog" aria-modal="true" aria-label="${escapeHtml(title)}"><div class="modal-head"><div><h2>${escapeHtml(title)}</h2><p>${escapeHtml(sub)}</p></div><button class="close-btn" data-action="close-modal" aria-label="Fechar">×</button></div>${body}</div></div>`}
function photoField(name='photo'){return `<label class="file-drop">${ic('photo')} <span class="fd-text"><b data-file-label>Adicionar imagem do produto ou print do anúncio</b><small>Arraste e solte aqui ou clique para escolher</small></span><input type="file" name="${name}" accept="image/*" data-upload /></label><img class="file-drop-preview hidden" id="file-preview" alt="Prévia da imagem"/>`}
function formActions(label){return `<div class="modal-actions"><button type="button" class="btn outline" data-action="close-modal">Cancelar</button><button type="submit" class="btn primary">${ic('check','sm')} ${label}</button></div>`}
function modalHtml(){if(!state.modal)return'';const m=state.modal;
  if(m.type==='listing'){const e=m.id?listingBy(m.id):{};return modalShell(m.id?'Editar anúncio':'Adicionar anúncio','Identifique o produto para acompanhar todos os testes.',`<form data-form="listing" data-id="${m.id||''}"><div class="form-grid"><div class="field full"><label>Nome do produto *</label><input name="title" required maxlength="180" placeholder="Ex.: Chinelo Nuvem Masculino" value="${escapeHtml(e.title||'')}"/></div><div class="field"><label>Marketplace *</label><select name="marketplace">${['Shopee','Mercado Livre','TikTok Shop','Outro'].map(x=>`<option ${x===e.marketplace?'selected':''}>${x}</option>`).join('')}</select></div><div class="field"><label>Nome da loja *</label><input name="store" required maxlength="100" value="${escapeHtml(e.store||cfg.brandName||'ESSO')}" /></div><div class="field full"><label>Link do anúncio (opcional)</label><input type="url" name="link" placeholder="https://..." value="${escapeHtml(e.link||'')}" /></div><div class="field full"><label>Foto do produto</label>${photoField()}</div></div>${formActions(m.id?'Salvar alterações':'Cadastrar anúncio')}</form>`)}
  if(m.type==='experiment'){const chosen=m.id||state.detail||state.data.listings[0]?.id;return modalShell('Novo acompanhamento','Registre a mudança e marque a data para comparar resultados.',`<form data-form="experiment"><div class="form-grid"><div class="field full"><label>Qual anúncio foi alterado? *</label><select name="listing_id" required>${state.data.listings.map(l=>`<option value="${l.id}" ${l.id===chosen?'selected':''}>${escapeHtml(l.title)} — ${escapeHtml(l.marketplace)}</option>`).join('')}</select></div><div class="field full"><label>Nome da alteração *</label><input name="label" required maxlength="160" placeholder="Ex.: Troquei a foto da capa e otimizei o título"/></div><div class="field"><label>Tipo de alteração</label><select name="change_type">${['Fotos','Título e SEO','Fotos e SEO','Descrição','Preço','Promoção','Outros'].map(x=>`<option>${x}</option>`).join('')}</select></div><div class="field"><label>Revisar em quantos dias?</label><select name="days">${[1,3,7,14,30].map(d=>`<option value="${d}" ${d===7?'selected':''}>${d} dia${d>1?'s':''}</option>`).join('')}</select></div><div class="field"><label>Visitas de agora *</label><input type="number" min="0" step="1" required name="before_visits" placeholder="124"/></div><div class="field"><label>Vendas/pedidos de agora</label><input type="number" min="0" step="1" name="before_sales" value="0"/></div><div class="field full"><label>O que você mudou? *</label><textarea name="changes" required maxlength="3000" placeholder="Descreva as imagens, preço, título, palavras-chave, antes/depois..."></textarea></div><div class="field full"><label>Print ou imagem da alteração</label>${photoField()}</div></div>${formActions('Iniciar acompanhamento')}</form>`)}
  if(m.type==='review'){const x=state.data.experiments.find(e=>e.id===m.id),l=listingBy(x.listing_id);return modalShell('Registrar resultado','Compare os números do mesmo anúncio após a alteração.',`<form data-form="review" data-id="${m.id}"><div class="insight-box" style="margin-bottom:19px"><div class="lead">${escapeHtml(l?.title||'Anúncio')}</div><p>${escapeHtml(x.label)} · ${dt(x.started_at)}<br/>Antes: ${fmt(x.before_visits)} visitas e ${fmt(x.before_sales)} pedidos.</p></div><div class="form-grid"><div class="field"><label>Visitas atuais *</label><input name="after_visits" type="number" min="0" step="1" required placeholder="Ex.: 200" /></div><div class="field"><label>Vendas/pedidos atuais *</label><input name="after_sales" type="number" min="0" step="1" required value="0" /></div><div class="field full"><label>Conclusão / o que percebeu?</label><textarea name="notes_after" maxlength="2000" placeholder="Ex.: Visitas cresceram após a nova capa, mas ainda sem novos pedidos..."></textarea></div></div>${formActions('Salvar comparação')}</form>`)}
  if(m.type==='idea')return modalShell('Nova ideia','Registre uma proposta para discutir ou colocar em prática.',`<form data-form="idea"><div class="form-grid"><div class="field full"><label>Título da ideia *</label><input name="title" required maxlength="150" placeholder="Ex.: Criar kit de 3 camisetas"/></div><div class="field full"><label>Descrição / próximos passos</label><textarea name="description" maxlength="3000" placeholder="O que você quer testar? Por quê?"></textarea></div><div class="field"><label>Plataforma</label><select name="platform">${['Shopee','Mercado Livre','TikTok Shop','Todas','Outra'].map(x=>`<option>${x}</option>`).join('')}</select></div><div class="field"><label>Prioridade</label><select name="priority"><option>Alta</option><option selected>Média</option><option>Baixa</option></select></div></div>${formActions('Guardar ideia')}</form>`);
if(m.type==='playbook'){const e=m.id?state.data.playbooks.find(p=>p.id===m.id):{};return modalShell(m.id?'Editar passo a passo':'Novo passo a passo','Guarde processos, checklists e aprendizados editáveis da operação.',`<form data-form="playbook" data-id="${m.id||''}"><div class="form-grid"><div class="field full"><label>Título *</label><input name="title" required maxlength="160" placeholder="Ex.: Como revisar um anúncio depois de 7 dias" value="${escapeHtml(e?.title||'')}"/></div><div class="field full"><label>Seção / categoria</label><input name="section" maxlength="80" placeholder="Ex.: Shopee, Mercado Livre, SEO, Fotos" value="${escapeHtml(e?.section||'')}"/></div><div class="field full"><label>Passo a passo *</label><textarea name="content" required maxlength="8000" placeholder="Escreva o processo em etapas, aprendizados e observações...">${escapeHtml(e?.content||'')}</textarea></div></div>${formActions(m.id?'Salvar passo a passo':'Criar passo a passo')}</form>`)}
  if(m.type==='alerts'){const alerts=experiments().filter(x=>!x.reviewed_at);return modalShell('Seus prazos','Acompanhe os testes que estão perto da data de revisão.',`<div class="timeline">${alerts.length?alerts.map(x=>`<div class="project-row" data-action="detail" data-id="${x.listing_id}"><div><b class="project-title">${escapeHtml(listingBy(x.listing_id)?.title||'')}</b><div class="project-info">${escapeHtml(x.label)}</div></div><div class="project-meta">${badge(x)}<div class="countdown-small" data-timer="${x.id}">${timerText(x)}</div></div></div>`).join(''):'<p class="muted">Nenhuma revisão pendente.</p>'}</div>`)}
  if(m.type==='profile')return modalShell('Minha conta','Informações sobre este acesso.',`<div class="member-row"><div class="avatar">${initials(displayName())}</div><div><strong>${escapeHtml(displayName())}</strong><p class="tiny-txt">${state.mode==='demo'?'Acesso de demonstração':'Acesso individual autenticado'}</p></div></div>${state.mode==='demo'?`<button class="btn soft" data-action="switch-user">${ic('team','sm')} Simular outro integrante</button><button class="btn outline" data-action="demo-logout">${ic('log','sm')} Sair da demonstração</button>`:`<button class="btn outline" data-action="logout">${ic('log','sm')} Encerrar sessão</button>`}`);
  return '';
}
function demoLoginPage() {
  return `
    <div class="login-screen">
      <div class="login-card">

        ${brand()}

        <h1 class="breathing">Bem-vindo ao ESSO.</h1>

        <p>
          Seu espaço privado de colaboração.
          Selecione seu perfil e informe a palavra-chave de acesso.
        </p>

        <div class="field">
          <label for="esso-password">Palavra-chave</label>

          <input
            id="esso-password"
            type="password"
            placeholder="Digite a palavra-chave"
            autocomplete="off"
          />
        </div>

        <button
          class="btn primary rainbow"
          data-action="demo-login"
          data-id="demo-owner"
        >
          Entrar como João
        </button>

        <button
          class="btn soft"
          data-action="demo-login"
          data-id="demo-partner"
          style="margin-top:12px;"
        >
          Entrar como Daka
        </button>

        <p
          id="esso-login-error"
          class="notice"
          aria-live="polite"
          style="margin-top:16px;"
        ></p>

        ${signature(cfg.brandName)}
        <div class="demo-note">
          Acesso de demonstração.
          O bloqueio de tentativas funciona neste navegador.
        </div>

      </div>
    </div>
  `;
}
function loginPage(){return `<div class="login-screen"><div class="login-card">${brand()}<h1 class="breathing">Seu workspace privado.</h1><p>Entre com a conta autorizada para conversar, compartilhar imagens e acompanhar as mudanças dos seus anúncios.</p><form id="login-form"><div class="field"><label>E-mail</label><input type="email" name="email" required autocomplete="email" placeholder="voce@exemplo.com" /></div><div class="field"><label>Senha</label><input type="password" name="password" required autocomplete="current-password" placeholder="Sua senha" /></div><button class="btn primary rainbow" type="submit">${ic('shield','sm')} Entrar no ESSO</button></form>${state.authError?`<div class="notice">${escapeHtml(state.authError)}</div>`:''}${signature(cfg.brandName)}<div class="demo-note">${ic('shield','sm')} Acesso restrito: apenas as duas contas cadastradas pelo administrador podem visualizar os dados. Não há cadastro público.</div></div></div>`}
function canRender(){const a=document.activeElement;return !state.modal&&!(a&&/^(INPUT|SELECT|TEXTAREA)$/.test(a.tagName)&&a.id!=='chat-text')}
function render(){
  const ct=$('#chat-text'),keep=ct?{v:ct.value,f:document.activeElement===ct,a:ct.selectionStart,b:ct.selectionEnd}:null;
  renderBase();
  if(keep&&!state.chatSent){const n=$('#chat-text');if(n&&!n.value&&keep.v){n.value=keep.v;if(keep.f){n.focus();try{n.setSelectionRange(keep.a,keep.b)}catch{}}}}
  try{mountEffects()}catch(err){console.error('fx',err)}
}
function renderBase(){
  const root=$('#app');
  const oldSidebarScroll=$('.sidebar')?.scrollTop||0;
  if(state.mode==='demo'&&!state.user){root.innerHTML=demoLoginPage();return}
  if(state.mode==='cloud' && (!state.user||!state.data)){root.innerHTML=state.loading&&state.user?'<div class="login-screen"><div class="login-card">Carregando ambiente privado...</div></div>':loginPage();return}
  if(!state.data)return;
  let content='';try{content=({dashboard:home,listings:listingsPage,chat:chatPage,pricing:pricePage,ideas:ideasPage,playbooks:playbooksPage,learning:learningPage,settings:settingsPage,detail:detailPage}[state.route]||home)()}catch(err){console.error(err);content=`<div class="empty"><h3>Erro ao abrir tela</h3><p>${escapeHtml(err.message)}</p></div>`}
  root.innerHTML=`<div class="shell"><div class="mobile-backdrop ${state.sideOpen?'visible':''}" data-action="menu"></div>${nav()}<main class="main">${topbar()}<div class="page">${demoBanner()}${content}</div></main>${footer()}</div>${modalHtml()}`;
  resolvePhotos();
  const sidebar=$('.sidebar');if(sidebar)sidebar.scrollTop=oldSidebarScroll;
  if(state.route==='chat')scrollChat();
}
function scrollChat(){requestAnimationFrame(()=>{const x=$('.chat-scroll');if(x)x.scrollTop=x.scrollHeight})}
function navigate(route,id){state.route=route;state.detail=id||null;state.modal=null;state.sideOpen=false;state.search='';state.filter='Todos';render();window.scrollTo({top:0,behavior:'instant'})}
function openModal(type,id=null){if(type==='experiment'&&!state.data.listings.length){notify('Cadastre um anúncio antes de criar o teste.',true);openModal('listing');return}state.modal={type,id};state.file=null;state.filePreview='';render()}
function safeUrl(u){try{const url=new URL(u);return ['https:','http:'].includes(url.protocol)?url.href:'#'}catch{return '#'}}
async function handleSubmit(e){const form=e.target;if(form.id==='login-form'){e.preventDefault();if(!client)return;const btn=$('button[type=submit]',form);btn.disabled=true;const values=Object.fromEntries(new FormData(form));const {data,error}=await client.auth.signInWithPassword({email:values.email,password:values.password});if(error){state.authError='E-mail ou senha inválidos. Verifique o acesso com o administrador.';render();return}state.user=data.user;await loadCloud();return}
  if(form.id==='ask-form'){e.preventDefault();const q=$('input[name=question]',form)?.value.trim()||'';if(q){state.askQuestion=q;state.askAnswer=answerFromHistory(q);render()}return}
  if(form.id==='chat-form'){e.preventDefault();const text=$('#chat-text')?.value.trim()||'',f=$('#chat-attachment')?.files[0];if(!text&&!f)return;const btn=$('button[type=submit]',form);btn.disabled=true;try{const img=await uploadImage(f);await insert('messages',{...(state.mode==='demo'?{id:uid()}:{}),body:text,attachment_path:img||null,listing_id:null,author:state.user.id,created_at:new Date().toISOString()});state.chatSent=true;render();state.chatSent=false;scrollChat();notify('Mensagem enviada')}catch(ex){notify(ex.message||'Falha ao enviar',true);btn.disabled=false}return}
  if(form.matches('[data-form]')){e.preventDefault();const kind=form.dataset.form,values=Object.fromEntries(new FormData(form));const btn=$('button[type=submit]',form);btn.disabled=true;try{
    if(kind==='listing'){
      const picture=await uploadImage(values.photo);
      const row={title:String(values.title).trim(),store:String(values.store).trim(),marketplace:values.marketplace,link:safeUrl(values.link)==='#'?'':safeUrl(values.link),...(picture?{image_path:picture}:{})};
      if(form.dataset.id){await update('listings',form.dataset.id,row)}else{await insert('listings',{...(state.mode==='demo'?{id:uid()}:{}),...row,image_path:picture||null,created_by:state.user.id,created_at:new Date().toISOString()})}
      notify('Anúncio salvo com sucesso!');state.modal=null;state.route='listings';
    }else if(kind==='experiment'){
      const picture=await uploadImage(values.photo);
      const days=Number(values.days)||7;
      const row={listing_id:values.listing_id,label:String(values.label).trim(),change_type:values.change_type,changes:String(values.changes).trim(),before_visits:Number(values.before_visits),before_sales:Number(values.before_sales||0),after_visits:null,after_sales:null,image_path:picture||null,started_at:new Date().toISOString(),review_at:daysAhead(days),reviewed_at:null,notes_after:'',created_by:state.user.id};
      await insert('experiments',{...(state.mode==='demo'?{id:uid()}:{}),...row});state.route='detail';state.detail=values.listing_id;state.modal=null;notify(`Teste criado! Revisão em ${days} dia(s).`);
    }else if(kind==='review'){
      await update('experiments',form.dataset.id,{after_visits:Number(values.after_visits),after_sales:Number(values.after_sales),notes_after:String(values.notes_after||'').trim(),reviewed_at:new Date().toISOString()});state.modal=null;notify('Comparação salva! Novo aprendizado disponível.');
    }else if(kind==='idea'){
      await insert('ideas',{...(state.mode==='demo'?{id:uid()}:{}),title:String(values.title).trim(),description:String(values.description||'').trim(),platform:values.platform,priority:values.priority,status:'A fazer',created_by:state.user.id,created_at:new Date().toISOString()});state.modal=null;state.route='ideas';notify('Ideia registrada!');
    }else if(kind==='playbook'){
      const row={title:String(values.title).trim(),section:String(values.section).trim()||'Geral',content:String(values.content||'').trim(),updated_at:new Date().toISOString(),created_by:state.user.id};
      if(form.dataset.id){await update('playbooks',form.dataset.id,row);notify('Passo a passo atualizado!')}else{await insert('playbooks',{...(state.mode==='demo'?{id:uid()}:{}),...row,created_at:new Date().toISOString()});notify('Passo a passo criado!')}
      state.modal=null;state.route='playbooks';
    }
    render();
  }catch(ex){console.error(ex);notify(ex.message||'Não foi possível salvar.',true);btn.disabled=false}return}
}
/* ===== ESSO · efeitos visuais v9 =====
   Spell UI: blur-reveal, label-input, animated-checkbox, animated-gradient, fallback-avatar, signature
   Inspira UI: silk-background, file-upload, breathing-text, border-beam, floating-card, rainbow-button, interactive-hover-button
   Estilo base: Refero · Superhuman (tokens no styles.css) */
let fxKey='';
const reduceMotion=()=>false;

/* Signature (Spell): assinatura desenhada à mão */
function signature(text){const t=escapeHtml(text||cfg.brandName||'ESSO');return `<svg class="signature" viewBox="0 0 320 96" role="img" aria-label="Assinatura ${t}"><text class="sig-text" x="6" y="64">${t}</text><path class="sig-line" pathLength="1" d="M8 80 C 70 70, 130 90, 200 78 S 290 72, 312 78"/></svg>`}

/* Ponto único chamado depois de todo render() */
function mountEffects(){
  const key=[state.mode,state.user?.id||'',state.route,state.detail||''].join('|');
  const changed=key!==fxKey;fxKey=key;
  $$('.hero-actions .btn.primary,.modal-actions .btn.primary,.pr-save').forEach(b=>b.classList.add('rainbow'));
  $$('.brand strong,.side-plan b').forEach(e=>e.classList.add('breathing'));
  $$('.stat-num').forEach(e=>e.classList.add('ag-text'));
  const pg=$('.page');if(pg&&!pg.querySelector('.page-sign'))pg.insertAdjacentHTML('beforeend','<div class="page-sign">'+signature(cfg.brandName)+'</div>');
  enhanceBeams();enhanceFloatCards();enhanceHoverButtons();enhanceFloatingLabels();enhanceAvatars();mountSilk();
  if(changed){window.scrollTo(0,0);blurReveal()}
}

/* Blur Reveal (Spell): palavras surgem de desfocado para nítido */
function blurReveal(){
  if(reduceMotion())return;
  $$('.hero h2,.page-head h1,.login-card h1,.sh-hero h1,.sh-hero p,.section-title,.pr-title,.learning-card h3,.setting-card h3,.idea-col-head').forEach(el=>{
    if(el.dataset.br)return;el.dataset.br='1';let i=0;
    const walk=node=>[...node.childNodes].forEach(ch=>{
      if(ch.nodeType===3){
        const frag=document.createDocumentFragment();
        ch.textContent.split(/(\s+)/).forEach(p=>{
          if(!p)return;
          if(/^\s+$/.test(p)){frag.append(p);return}
          const s=document.createElement('span');s.className='br-word';s.style.setProperty('--i',i++);s.textContent=p;frag.append(s);
        });
        ch.replaceWith(frag);
      }else if(ch.nodeType===1&&ch.tagName!=='BR'&&!ch.classList.contains('ag-text'))walk(ch);
    });
    walk(el);
  });
}

/* Border Beam (Inspira): feixe de luz percorrendo a borda */
function enhanceBeams(){
  $$('.sh-float,.hero,.login-card,.pr-summary,.insight-box,.modal,.chat-layout,.setting-card,.learning-card').forEach(h=>{
    if(h.querySelector(':scope>.beam-line'))return;
    const i=document.createElement('i');i.className='beam-line';i.setAttribute('aria-hidden','true');h.append(i);
  });
}

/* Floating Card (Inspira): cards flutuam e inclinam com o mouse */
function enhanceFloatCards(){
  $$('.sh-float,.listing-card,.playbook-card,.idea-card,.setting-card,.learning-card,.action-tile,.project-row').forEach((c,i)=>{
    if(c.classList.contains('float-card'))return;
    c.classList.add('float-card');c.style.setProperty('--fi',i%7);
  });
}
let fxTilt=null;
function resetTilt(c){c.style.setProperty('--rx','0deg');c.style.setProperty('--ry','0deg')}
document.addEventListener('pointermove',e=>{
  if(e.pointerType!=='mouse'||reduceMotion())return;
  const c=e.target.closest?.('.float-card');
  if(fxTilt&&fxTilt!==c){resetTilt(fxTilt);fxTilt=null}
  if(!c)return;
  const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
  c.style.setProperty('--ry',(x*7).toFixed(2)+'deg');c.style.setProperty('--rx',(-y*7).toFixed(2)+'deg');fxTilt=c;
});
document.addEventListener('pointerleave',()=>{if(fxTilt){resetTilt(fxTilt);fxTilt=null}},true);

/* Interactive Hover Button (Inspira): ponto que expande e revela seta */
function enhanceHoverButtons(){
  $$('.btn.soft,.btn.outline').filter(b=>!b.closest('.sidebar,.chat-compose')&&!b.classList.contains('icon-only')).forEach(b=>{
    if(b.classList.contains('ihb'))return;
    b.classList.add('ihb');
    const s=document.createElement('span');s.className='ihb-arrow';s.setAttribute('aria-hidden','true');s.innerHTML=ic('arrow','sm');b.append(s);
  });
}

/* Label Input (Spell): rótulo flutuante em campos de texto (login e formulários) */
function enhanceFloatingLabels(){
  $$('.login-card .field:not(.fl-field),.modal .field:not(.fl-field)').forEach(f=>{
    const ctl=[...f.children].filter(c=>/^(INPUT|SELECT|TEXTAREA)$/.test(c.tagName));
    if(ctl.length!==1)return;
    const input=ctl[0];
    if(input.tagName!=='INPUT'||!/^(text|number|url|email|password)$/.test(input.type))return;
    const label=[...f.children].find(c=>c.tagName==='LABEL');
    if(!label)return;
    if(!input.placeholder)input.placeholder=' ';
    f.classList.add('fl-field');f.append(label);
  });
}

/* Fallback Avatar (Spell): cor estável por nome + reserva quando a imagem falha */
function enhanceAvatars(){
  $$('.avatar:not(.fa)').forEach(a=>{
    const txt=(a.textContent||'').trim()||'ES';let h=0;
    for(const ch of txt)h=(h*31+ch.charCodeAt(0))%360;
    a.style.setProperty('--fa-h',h);a.classList.add('fa');
  });
}
document.addEventListener('error',e=>{
  const t=e.target;if(!t||t.tagName!=='IMG')return;
  if(t.closest('.avatar')){t.remove();return}
  if(t.closest('.brand-mark')){const s=document.createElement('span');s.className='esso-s';s.textContent='S';t.replaceWith(s);return}
  if(t.closest('.thumb')){t.outerHTML=ic('box','lg')}
},true);

/* File Upload (Inspira): arrastar e soltar imagens */
['dragenter','dragover'].forEach(t=>document.addEventListener(t,e=>{
  const z=e.target.closest?.('.file-drop');if(!z)return;e.preventDefault();z.classList.add('drag');
}));
['dragleave','dragend'].forEach(t=>document.addEventListener(t,e=>{
  const z=e.target.closest?.('.file-drop');if(z&&!z.contains(e.relatedTarget))z.classList.remove('drag');
}));
document.addEventListener('drop',e=>{
  const z=e.target.closest?.('.file-drop');if(!z)return;
  e.preventDefault();z.classList.remove('drag');
  const f=[...(e.dataTransfer?.files||[])].find(x=>x.type.startsWith('image/')),input=$('input[type=file]',z);
  if(!f||!input){notify('Solte um arquivo de imagem (JPG, PNG ou WebP).',true);return}
  const dt=new DataTransfer();dt.items.add(f);input.files=dt.files;input.dispatchEvent(new Event('change',{bubbles:true}));
});
document.addEventListener('change',e=>{
  if(e.target.matches?.('[data-upload]'))e.target.closest('.file-drop')?.classList.toggle('has-file',!!e.target.files[0]);
});

/* Silk Background (Inspira): seda animada em WebGL atrás da tela de login */
function mountSilk(){
  if($('#silk-canvas'))return;
  const canvas=document.createElement('canvas');canvas.id='silk-canvas';canvas.setAttribute('aria-hidden','true');
  const gl=canvas.getContext('webgl',{antialias:false,alpha:false,powerPreference:'low-power'});
  if(!gl)return;
  const vs='attribute vec2 p;varying vec2 vUv;void main(){vUv=p*.5+.5;gl_Position=vec4(p,0.,1.);}';
  const fs=`#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
varying vec2 vUv;uniform float uTime;uniform vec2 uRes;uniform vec3 uA;uniform vec3 uB;
float noise(vec2 t){float G=2.71828;vec2 r=G*sin(G*t);return fract(r.x*r.y*(1.0+t.x));}
vec2 rot(vec2 uv,float a){float c=cos(a),s=sin(a);return mat2(c,-s,s,c)*uv;}
void main(){
  vec2 uv=vUv;uv.x*=uRes.x/uRes.y;
  float a=uTime;
  vec2 p=rot(uv*1.5,0.45);
  p.y+=0.05*sin(6.0*p.x+a);
  float w=sin(4.0*(p.x+p.y)+cos(2.0*p.x+3.0*p.y)+a)+0.5*sin(9.0*(p.x+p.y)-2.0*a);
  float q=clamp(0.5+0.33*w,0.0,1.0);
  gl_FragColor=vec4(mix(uA,uB,q*.85),1.0);
}`;
  const sh=(type,src)=>{const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);return gl.getShaderParameter(s,gl.COMPILE_STATUS)?s:null};
  const v=sh(gl.VERTEX_SHADER,vs),f=sh(gl.FRAGMENT_SHADER,fs);if(!v||!f)return;
  const prog=gl.createProgram();gl.attachShader(prog,v);gl.attachShader(prog,f);gl.linkProgram(prog);
  if(!gl.getProgramParameter(prog,gl.LINK_STATUS))return;
  gl.useProgram(prog);
  const buf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buf);
  gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
  const loc=gl.getAttribLocation(prog,'p');gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
  const uT=gl.getUniformLocation(prog,'uTime'),uR=gl.getUniformLocation(prog,'uRes'),uA=gl.getUniformLocation(prog,'uA'),uB=gl.getUniformLocation(prog,'uB');
  const setCols=()=>{if(document.documentElement.dataset.theme==='light'){gl.uniform3f(uA,.96,.94,.9);gl.uniform3f(uB,.78,.7,.98)}else{gl.uniform3f(uA,.03,.055,.1);gl.uniform3f(uB,.22,.19,.43)}};
  const size=()=>{canvas.width=Math.max(2,Math.floor(innerWidth*.5));canvas.height=Math.max(2,Math.floor(innerHeight*.5));gl.viewport(0,0,canvas.width,canvas.height);gl.uniform2f(uR,canvas.width,canvas.height)};
  size();document.body.prepend(canvas);
  const t0=performance.now(),still=reduceMotion();
  const frame=now=>{
    if(!canvas.isConnected){removeEventListener('resize',size);gl.getExtension('WEBGL_lose_context')?.loseContext();return}
    setCols();gl.uniform1f(uT,((now-t0)/1000*.5)%6.2831853);gl.drawArrays(gl.TRIANGLES,0,3);
    if(!still)requestAnimationFrame(frame);
  };
  addEventListener('resize',size);
  requestAnimationFrame(frame);
}


/* Sincronização de segurança: mesmo que o realtime caia, o sócio recebe as mensagens sem recarregar */
async function pollMessages(){
  if(state.mode!=='cloud'||!client||!state.data||document.hidden)return;
  try{
    const last=state.data.messages.reduce((m,x)=>x.created_at>m?x.created_at:m,'1970-01-01');
    const {data,error}=await client.from('messages').select('*').gt('created_at',last).order('created_at');
    if(error||!data?.length)return;
    let added=0;data.forEach(r=>{if(!state.data.messages.some(x=>x.id===r.id)){state.data.messages.push(r);added++}});
    if(added&&canRender()){const sc=$('.chat-scroll'),atBottom=sc?sc.scrollHeight-sc.scrollTop-sc.clientHeight<140:false;render();if(state.route==='chat'&&atBottom)scrollChat()}
  }catch{}
}
async function syncCloud(){
  if(state.mode!=='cloud'||!client||!state.data||document.hidden)return;
  try{
    const names=['members','listings','experiments','messages','ideas','playbooks','price_calculations'];
    const res=await Promise.all(names.map(n=>client.from(n).select('*')));
    if(res.some(r=>r.error))return;
    const norm=a=>JSON.stringify([...a].sort((p,q)=>String(p.id||p.user_id).localeCompare(String(q.id||q.user_id))));
    let changed=false;names.forEach((n,i)=>{if(norm(res[i].data)!==norm(state.data[n])){state.data[n]=res[i].data;changed=true}});
    if(changed&&canRender()){const sc=$('.chat-scroll'),atBottom=sc?sc.scrollHeight-sc.scrollTop-sc.clientHeight<140:false;render();if(state.route==='chat'&&atBottom)scrollChat()}
  }catch{}
}
setInterval(pollMessages,3000);setInterval(syncCloud,20000);
document.addEventListener('visibilitychange',()=>{if(!document.hidden){pollMessages();syncCloud()}});
addEventListener('focus',()=>{pollMessages();syncCloud()});addEventListener('online',()=>{if(state.realtime&&state.data)subscribeRealtime();syncCloud()});

/* Tema claro / escuro */
function themeIcon(){const dk=document.documentElement.dataset.theme!=='light';return dk?'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>':'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>'}
function toggleTheme(){const d=document.documentElement,n=d.dataset.theme==='light'?'dark':'light';d.dataset.theme=n;try{localStorage.setItem('esso-theme',n)}catch{}const m=document.querySelector('meta[name=theme-color]');if(m)m.content=n==='dark'?'#0a111d':'#f2f0eb';render()}
document.addEventListener('click',e=>{const b=e.target.closest?.('[data-action="theme"]');if(!b)return;e.stopImmediatePropagation();e.preventDefault();toggleTheme()},true);

document.addEventListener('submit',handleSubmit);
document.addEventListener('click',async e=>{
  const a=e.target.closest('[data-action]');if(!a){if(e.target.id==='modal-shade'){state.modal=null;render()}return}const act=a.dataset.action,id=a.dataset.id;
if (act === 'demo-login' && state.mode === 'demo') {
  const passwordInput = document.getElementById('esso-password');
  const errorElement = document.getElementById('esso-login-error');

  const password = passwordInput?.value || '';
  const result = checkAccess(id, password);

  if (!result.allowed) {
    if (errorElement) {
      errorElement.textContent = result.message;
    }

    if (passwordInput) {
      passwordInput.value = '';
    }

    return;
  }

  state.user = {
    id: id === 'demo-partner' ? 'demo-partner' : 'demo-owner',
    email: 'demonstracao@local'
  };

  sessionStorage.setItem(demoUserKey, state.user.id);
  state.route = 'dashboard';

  render();
  return;
}
  if(act==='price-market'){state.pricing.market=id==='Mercado Livre'?'Mercado Livre':'Shopee';state.pricing.marginPct=id==='Mercado Livre'?16:8;state.pricing.customPrice=false;savePriceDraft();render();return}
  if(act==='reset-price'){state.pricing=structuredClone(priceEngine.defaults);savePriceDraft();render();notify('Simulação zerada.');return}
  if(act==='price-load'){const row=state.data.price_calculations.find(y=>y.id===id);if(row&&row.inputs){state.pricing={...structuredClone(priceEngine.defaults),...row.inputs};savePriceDraft();navigate('pricing');notify('Cálculo recuperado.')}return}
  if(act==='save-price'){const r=priceEngine.calc(state.pricing);if(!r.valid){notify(r.error,true);return}a.disabled=true;try{await insert('price_calculations',{...(state.mode==='demo'?{id:uid()}:{}),name:state.pricing.name.trim().slice(0,160)||'Cálculo sem nome',marketplace:state.pricing.market,inputs:structuredClone(state.pricing),price:r.price,profit:r.profit,created_by:state.user.id,created_at:new Date().toISOString()});notify('Cálculo salvo no histórico.');render()}catch(e){notify(e.message||'Erro ao salvar cálculo',true);a.disabled=false}return}
  if(act==='copy-price'){const r=priceEngine.calc(state.pricing);if(r.valid){const t=`ESSO • ${state.pricing.market} • ${state.pricing.name||'Produto'}\nPreço recomendado: ${brl(r.price)}\nRepasse estimado: ${brl(r.payout)}\nLucro: ${brl(r.profit)}\nMargem: ${prn(r.margin)}%`;try{await navigator.clipboard.writeText(t);notify('Resultado copiado.')}catch{notify('Não foi possível copiar neste navegador.',true)}}return}
  if(act==='route'){navigate(id);return}
  if(act==='detail'){navigate('detail',id);return}
  if(act==='menu'){state.sideOpen=!state.sideOpen;render();return}
  if(act==='new-listing'){openModal('listing');return}
  if(act==='edit-listing'){openModal('listing',id);return}
  if(act==='new-experiment'){openModal('experiment',id);return}
  if(act==='new-idea'){openModal('idea');return}
  if(act==='new-playbook'){openModal('playbook');return}
  if(act==='edit-playbook'){openModal('playbook',id);return}
  if(act==='review'){openModal('review',id);return}
  if(act==='alerts'){openModal('alerts');return}
  if(act==='profile'){openModal('profile');return}
  if(act==='close-modal'){state.modal=null;render();return}
if (act === 'switch-user' && state.mode === 'demo') {
  sessionStorage.removeItem(demoUserKey);

  state.user = null;
  state.modal = null;

  render();
  return;
}  if(act==='reset-demo'&&state.mode==='demo'){if(confirm('Restaurar a demonstração? Isso apaga as alterações locais.')){state.data=seed();persistDemo();navigate('dashboard');notify('Demonstração restaurada.')}return}
  if(act==='logout'&&client){await client.auth.signOut();return}
  if(act==='demo-logout'&&state.mode==='demo'){sessionStorage.removeItem(demoUserKey);state.user=null;state.modal=null;render();return}
  if(act==='open-photo'){const src=a.src||'';if(src&&src.startsWith('data:')||src&&src.startsWith('https:'))window.open(src,'_blank','noopener');return}
});
document.addEventListener('change',async e=>{
  if(e.target.matches('[data-filter]')){state.filter=e.target.value;render();return}
  if(e.target.matches('[data-idea-status]')){try{await update('ideas',e.target.dataset.id,{status:e.target.value});notify('Etapa da ideia atualizada.');render()}catch(ex){notify(ex.message,true)}return}
  if(e.target.matches('[data-upload]')){const f=e.target.files[0];const label=$('[data-file-label]');if(label)label.textContent=f?f.name:'Adicionar imagem do produto ou print';const preview=$('#file-preview');if(preview){if(f){preview.src=URL.createObjectURL(f);preview.classList.remove('hidden')}else{preview.classList.add('hidden')}}return}
  if(e.target.id==='chat-attachment'){const f=e.target.files[0],area=$('#chat-file-preview');if(area){area.innerHTML=f?`<div class="preview-file">${ic('photo','sm')} ${escapeHtml(f.name)} <span style="color:#97a9bf">pronto para enviar</span></div>`:''}return}
});
document.addEventListener('input',e=>{if(e.target.matches('[data-price-field]')||e.target.matches('[data-price-fee]')){const el=e.target;if(el.matches('[data-price-field]')){const k=el.dataset.priceField;state.pricing[k]=el.type==='checkbox'?el.checked:el.tagName==='SELECT'||el.type==='text'?el.value:el.value===''?(k==='fixedOverride'?'':0):Number(el.value)}else{const i=Number(el.dataset.index), k=el.dataset.priceFee==='pct'?'shopeePct':'shopeeFixed';state.pricing[k][i]=Math.max(0,Number(el.value)||0)}savePriceDraft();if(el.dataset.priceField==='customPrice'){render()}else refreshPriceOutput();return}if(e.target.matches('[data-search]')){state.search=e.target.value;const pos=e.target.selectionStart;render();const input=$('[data-search]');input?.focus();input?.setSelectionRange(pos,pos)}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&state.sideOpen){state.sideOpen=false;render();return}if(e.key==='Escape'&&state.modal){state.modal=null;render()}if(e.target?.id==='chat-text'&&e.key==='Enter'&&!e.shiftKey){e.preventDefault();$('#chat-form')?.requestSubmit()}});
setInterval(()=>{if(!state.data)return;$$('[data-timer]').forEach(el=>{const x=state.data.experiments.find(y=>y.id===el.dataset.timer);if(!x)return;const val=timerText(x);if(el.classList.contains('timer')){el.innerHTML=ic('clock','sm')+' '+escapeHtml(val);el.classList.toggle('over',!x.reviewed_at&&Date.now()>=new Date(x.review_at))}else el.textContent=val})},1000);
if(demoChannel){demoChannel.onmessage=(event)=>{if(state.mode!=='demo')return; if(event?.data?.type==='sync'){try{const incoming=JSON.parse(localStorage.getItem(demoKey)); if(incoming){state.data=incoming; if(!state.data.playbooks)state.data.playbooks=[]; render()}}catch{}}}}
window.addEventListener('storage',e=>{if(state.mode!=='demo')return; if(e.key===demoKey && e.newValue){try{state.data=JSON.parse(e.newValue); if(!state.data.playbooks)state.data.playbooks=[]; render()}catch{}}});
init();
})();
