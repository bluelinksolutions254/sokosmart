/* SOKO Smart chat – WhatsApp-style messaging (shops, people, Soko Smart Team + admin inbox).
   Needs: global `sb` (Supabase client). Uses needLogin()/toast() from the page when present. */
(()=>{
if(window.SokoChat)return;
const q=(s,r=document)=>r.querySelector(s);
const E=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const DB=()=>typeof sb!=="undefined"?sb:null;
const say=(t,ty)=>typeof toast==="function"?toast(t,ty):alert(t);
const askLogin=w=>typeof needLogin==="function"?needLogin(w):alert(w);
const getUser=async()=>{const d=DB();if(!d)return null;const {data:{session}}=await d.auth.getSession();return session?session.user:null};
const svg=(p,z=24,f)=>`<svg viewBox="0 0 24 24" width="${z}" height="${z}" fill="${f?"currentColor":"none"}" stroke="${f?"none":"currentColor"}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
const P={
 bubble:'<path d="M12 3C6.5 3 2 6.9 2 11.7c0 2.1.9 4 2.3 5.5L3.5 21l4.1-1.6c1.4.5 2.9.7 4.4.7 5.5 0 10-3.9 10-8.4S17.5 3 12 3z"/>',
 send:'<path d="M3 20.5 21.5 12 3 3.5l.01 6.6L15 12 3.01 13.9z"/>',
 back:'<path d="M19 12H5M12 5l-7 7 7 7"/>',
 x:'<path d="M6 6l12 12M18 6 6 18"/>',
 plus:'<path d="M12 5v14M5 12h14"/>'
};
const VER='<span class="sc-ver"><svg viewBox="0 0 24 24" width="16" height="16"><circle cx="12" cy="12" r="10" fill="#14633F"/><path d="M7.5 12.5l3 3 6-6.5" stroke="#fff" fill="none" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>';
const TK='<svg viewBox="0 0 18 12" width="17" height="12" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">';
const T1=TK+'<polyline points="3,6.5 6.5,10 14,2"/></svg>';
const T2=TK+'<polyline points="1,6.5 4.5,10 12,2"/><polyline points="7,8.5 8.5,10 16,2"/></svg>';
const CLK='<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>';
const COL=["#0B4A2E","#F58E20","#14633F","#D9740A","#2E8B57","#B85C00","#1F7A4D","#E07B00"];
const hash=s=>[...String(s||"")].reduce((a,c)=>a+c.charCodeAt(0),0);
const tm=d=>new Date(d).toLocaleTimeString("en-KE",{hour:"numeric",minute:"2-digit"});
const dayKey=d=>new Date(d).toDateString();
function dlabel(d){const t=new Date(),x=new Date(d);if(x.toDateString()===t.toDateString())return"Today";const y=new Date(t.getTime()-864e5);if(x.toDateString()===y.toDateString())return"Yesterday";return x.toLocaleDateString("en-KE",{day:"numeric",month:"long",year:"numeric"})}
function stamp(d){const t=new Date(),x=new Date(d);if(x.toDateString()===t.toDateString())return tm(d);const y=new Date(t.getTime()-864e5);if(x.toDateString()===y.toDateString())return"Yesterday";return x.toLocaleDateString("en-KE",{day:"2-digit",month:"2-digit",year:"numeric"})}
const link=t=>E(t).replace(/(https?:\/\/[^\s<]+)/g,u=>`<a href="${u}" target="_blank" rel="noopener noreferrer">${u}</a>`);

function make(host,o){
 o=o||{};const sup=!!o.support;
 let me=null,list=[],cur=null,msgs=[],rt=null,tch=null,tsent=0,tclear=0,filter="",loaded=false,lt=0,nt=0,started=false;
 const R=s=>q(s,host);
 const visible=()=>host.getClientRects().length>0&&document.visibilityState==="visible";
 if(sup)host.classList.add("sc-host");
 host.innerHTML=`<div class="sc"><aside class="sc-l"><div class="sc-h"><b>${sup?"Support inbox":"Chats"}</b><span class="sc-sp"></span>${sup?"":`<button class="sc-ib" data-a="new" title="New chat" aria-label="New chat">${svg(P.plus,22)}</button>`}${o.close?`<button class="sc-ib" data-a="close" title="Close" aria-label="Close">${svg(P.x,22)}</button>`:""}</div><div class="sc-s"><input class="sc-f" type="search" placeholder="Search chats" aria-label="Search chats"></div><div class="sc-list"></div><div class="sc-new" hidden></div></aside><section class="sc-r"></section></div>`;
 const root=R(".sc");

 const av=(c,sm)=>c.kind==="support"&&!sup?`<span class="sc-av ${sm?"sm":""}"><img src="logo.png" alt=""></span>`:`<span class="sc-av ${sm?"sm":""}" style="background:${COL[hash(c.title)%COL.length]}">${E(String(c.title||"?").trim().charAt(0).toUpperCase()||"?")}</span>`;
 const subOf=c=>c.kind==="support"?(sup?"Customer":"Official support"):(c.shop_id?"Shop":"");
 const mine=m=>m.sender_id===me||(sup&&m.is_staff);

 function drawList(){const el=R(".sc-list");if(!el)return;const f=filter.toLowerCase();
  const rows=list.filter(c=>!f||String(c.title).toLowerCase().includes(f));
  el.innerHTML=rows.map(c=>`<button class="sc-i ${cur&&cur.id===c.id?"on":""}" data-a="conv" data-id="${c.id}">${av(c)}<span class="sc-im"><span class="sc-r1"><b>${E(c.title)}${c.kind==="support"&&!sup?VER:""}</b><span class="sc-tm ${c.unread>0?"g":""}">${c.last_body?stamp(c.last_at):""}</span></span><span class="sc-r1"><span class="sc-lb">${c.last_body?E(c.last_body):"No messages yet"}</span>${c.unread>0?`<span class="sc-u">${c.unread}</span>`:""}</span></span></button>`).join("")||`<div class="sc-em">${!loaded?"Loading…":f?"No chats match your search.":sup?"No customer messages yet.":"No chats yet. Tap + to message a shop, a person or the Soko Smart Team."}</div>`}
 function drawEmpty(){R(".sc-r").innerHTML=`<div class="sc-e"><span class="sc-eic">${svg(P.bubble,52,1)}</span><h3>SOKO Smart Chat</h3><p>${sup?"Select a customer chat to read and reply.":"Send and receive messages with shops, other members and the Soko Smart Team."}</p></div>`}
 function setMode(){root.classList.toggle("c",!!cur)}

 function tick(m){if(m.failed)return`<span class="sc-k f" title="Not sent">!</span>`;if(m.pending)return`<span class="sc-k">${CLK}</span>`;if(m.read_at)return`<span class="sc-k r">${T2}</span>`;if(m.delivered_at)return`<span class="sc-k">${T2}</span>`;return`<span class="sc-k">${T1}</span>`}
 function drawMsgs(force){const box=R(".sc-m");if(!box)return;const near=box.scrollHeight-box.scrollTop-box.clientHeight<140;let last="",prev=null,h="";
  msgs.forEach(m=>{const d=dayKey(m.created_at);if(d!==last){h+=`<div class="sc-d"><span>${dlabel(m.created_at)}</span></div>`;last=d;prev=null}
   const mi=mine(m),first=!prev||prev.mi!==mi;prev={mi};
   h+=`<div class="sc-row ${mi?"o":"i"}"><div class="sc-b ${first?"t":""}">${!mi&&cur.kind==="support"&&!sup?'<div class="sc-n">Soko Smart Team</div>':""}<span class="sc-t">${link(m.body)}</span><span class="sc-x">${tm(m.created_at)}${mi?tick(m):""}</span></div></div>`});
  box.innerHTML=h;if(force||near)box.scrollTop=box.scrollHeight}
 function drawConv(){const c=cur;
  R(".sc-r").innerHTML=`<div class="sc-rh"><button class="sc-ib sc-bk" data-a="back" aria-label="Back">${svg(P.back,22)}</button>${av(c,1)}<span class="sc-hm"><b>${E(c.title)}${c.kind==="support"&&!sup?VER:""}</b><small class="sc-sub">${E(subOf(c))}</small></span></div><div class="sc-m"></div><div class="sc-c"><textarea class="sc-in" rows="1" placeholder="Type a message" maxlength="2000" aria-label="Type a message"></textarea><button class="sc-sd" data-a="send" aria-label="Send">${svg(P.send,22,1)}</button></div>`}
 const grow=t=>{t.style.height="42px";t.style.height=Math.min(t.scrollHeight,120)+"px"};

 async function loadList(){const d=DB();if(!d||!me)return;
  const {data,error}=await d.rpc("chat_list",{p_support:sup});loaded=true;
  if(error){drawList();return}
  list=data||[];list.forEach(c=>{c.unread=Number(c.unread||0)});
  if(cur){const n=list.find(x=>x.id===cur.id);if(n){if(visible())n.unread=0;Object.assign(cur,n)}}
  drawList();emitUnread()}
 const lazy=()=>{clearTimeout(lt);lt=setTimeout(loadList,250)};
 function emitUnread(){const tot=list.reduce((a,c)=>a+c.unread,0);o.onUnread&&o.onUnread(tot)}
 const ack=(id,read)=>DB().rpc("chat_ack",{p_conv:id,p_read:read});

 async function openConv(id,draft){const c=list.find(x=>x.id===id);if(!c)return;cur=c;msgs=[];setMode();drawConv();drawList();
  const {data,error}=await DB().from("messages").select("*").eq("conversation_id",id).order("created_at",{ascending:false}).limit(200);
  if(!cur||cur.id!==id)return;if(error){say(error.message,"error");return}
  msgs=(data||[]).reverse();drawMsgs(true);c.unread=0;drawList();emitUnread();
  await ack(id,true);listenTyping(id);
  const ta=R(".sc-in");if(ta){if(draft){ta.value=draft;grow(ta)}if(matchMedia("(min-width:761px)").matches)ta.focus()}}
 function closeConv(){cur=null;msgs=[];if(tch){DB().removeChannel(tch);tch=null}setMode();drawEmpty();drawList()}

 async function send(){const ta=R(".sc-in");if(!ta||!cur)return;const body=ta.value.trim();if(!body)return;ta.value="";grow(ta);
  const tmp={id:"t"+Date.now()+Math.random(),conversation_id:cur.id,sender_id:me,body,created_at:new Date().toISOString(),pending:1,is_staff:sup};
  msgs.push(tmp);drawMsgs(true);
  const {data,error}=await DB().from("messages").insert({conversation_id:cur.id,sender_id:me,body}).select().single();
  const i=msgs.findIndex(x=>x.id===tmp.id);
  if(error){if(i>-1){msgs[i].pending=0;msgs[i].failed=1}drawMsgs();say(error.message,"error");return}
  if(msgs.some(x=>x.id===data.id)){if(i>-1)msgs.splice(i,1)}else if(i>-1)msgs[i]=data;
  drawMsgs();
  if(cur){cur.last_body=body.slice(0,120);cur.last_at=data.created_at;list.sort((a,b)=>new Date(b.last_at)-new Date(a.last_at));drawList()}}

 async function onIns(m){
  if(!m||!list)return;
  const isMe=m.sender_id===me||(sup&&m.is_staff);
  if(cur&&cur.id===m.conversation_id){
   if(!msgs.some(x=>x.id===m.id)){msgs.push(m);drawMsgs()}
   if(!isMe){await ack(m.conversation_id,visible())}
  }else if(!isMe){await ack(m.conversation_id,false)}
  lazy()}
 function onUpd(m){if(!cur||!m||cur.id!==m.conversation_id)return;const i=msgs.findIndex(x=>x.id===m.id);if(i>-1){Object.assign(msgs[i],m);drawMsgs()}}
 function subscribe(){const d=DB();if(!d||rt)return;
  rt=d.channel("chat-"+Math.random().toString(36).slice(2))
   .on("postgres_changes",{event:"INSERT",schema:"public",table:"messages"},p=>onIns(p.new))
   .on("postgres_changes",{event:"UPDATE",schema:"public",table:"messages"},p=>onUpd(p.new))
   .subscribe()}
 function listenTyping(id){const d=DB();if(tch){d.removeChannel(tch);tch=null}
  tch=d.channel("typing-"+id,{config:{broadcast:{self:false}}}).on("broadcast",{event:"typing"},({payload})=>{
   if(!payload||payload.u===me)return;const s=R(".sc-sub");if(!s)return;s.textContent="typing…";s.classList.add("ty");
   clearTimeout(tclear);tclear=setTimeout(()=>{if(cur){s.textContent=subOf(cur);s.classList.remove("ty")}},3000)}).subscribe()}
 function sendTyping(){const n=Date.now();if(!tch||n-tsent<2000)return;tsent=n;tch.send({type:"broadcast",event:"typing",payload:{u:me}})}

 /* ---- new chat panel ---- */
 function showNew(){const p=R(".sc-new");p.hidden=false;
  p.innerHTML=`<div class="sc-h"><button class="sc-ib" data-a="nback" aria-label="Back">${svg(P.back,22)}</button><b>New chat</b></div><div class="sc-s"><input class="sc-nq" type="search" placeholder="Search shops or people" aria-label="Search shops or people"></div><div class="sc-nl"></div>`;
  findNew("");R(".sc-nq").focus()}
 const hideNew=()=>{const p=R(".sc-new");if(p){p.hidden=true;p.innerHTML=""}};
 async function findNew(t){const el=R(".sc-nl");if(!el)return;const my=++nt;
  const {data,error}=await DB().rpc("chat_find",{p_q:t});if(my!==nt||!R(".sc-nl"))return;
  const rows=data||[],shops=rows.filter(r=>r.kind==="shop"),users=rows.filter(r=>r.kind==="user");
  const item=(r,a)=>`<button class="sc-o" data-a="${a}" data-uid="${r.uid}" data-ref="${E(r.ref||"")}"><span class="sc-av" style="background:${COL[hash(r.name)%COL.length]}">${E(String(r.name||"?").charAt(0).toUpperCase())}</span><span><b>${E(r.name)}</b><small>${E(r.sub||"")}</small></span></button>`;
  const showSup=!t||"soko smart team support help".includes(t.toLowerCase());
  el.innerHTML=(error?`<div class="sc-em">${E(error.message)}</div>`:"")+
   (showSup?`<div class="sc-sec">SOKO SMART</div><button class="sc-o" data-a="sup"><span class="sc-av"><img src="logo.png" alt=""></span><span><b>Soko Smart Team ${VER}</b><small>Ask us anything – we reply here</small></span></button>`:"")+
   (shops.length?`<div class="sc-sec">SHOPS</div>`+shops.map(r=>item(r,"shop")).join(""):"")+
   (users.length?`<div class="sc-sec">PEOPLE</div>`+users.map(r=>item(r,"user")).join(""):"")+
   (!shops.length&&!users.length&&t?`<div class="sc-em">No shops or people found. Type at least 2 letters of a name.</div>`:"")}
 async function startWith(fn){const {data,error}=await fn();if(error){say(error.message,"error");return}
  await loadList();hideNew();if(data)openConv(data)}

 /* ---- events ---- */
 host.addEventListener("click",e=>{const b=e.target.closest("[data-a]");if(!b||!host.contains(b))return;const a=b.dataset.a,d=DB();
  if(a==="conv")openConv(b.dataset.id);
  else if(a==="back")closeConv();
  else if(a==="send"){send()}
  else if(a==="new")showNew();
  else if(a==="nback")hideNew();
  else if(a==="close"){o.close&&o.close()}
  else if(a==="sup")startWith(()=>d.rpc("chat_start_support"));
  else if(a==="shop")startWith(()=>d.rpc("chat_start_direct",{p_other:b.dataset.uid,p_shop:b.dataset.ref||null}));
  else if(a==="user")startWith(()=>d.rpc("chat_start_direct",{p_other:b.dataset.uid,p_shop:null}))});
 host.addEventListener("input",e=>{const t=e.target;
  if(t.classList.contains("sc-in")){grow(t);if(t.value)sendTyping()}
  else if(t.classList.contains("sc-f")){filter=t.value.trim();drawList()}
  else if(t.classList.contains("sc-nq")){clearTimeout(host._nt);host._nt=setTimeout(()=>findNew(t.value.trim()),300)}});
 host.addEventListener("keydown",e=>{if(e.target.classList&&e.target.classList.contains("sc-in")&&e.key==="Enter"&&!e.shiftKey&&matchMedia("(min-width:761px)").matches){e.preventDefault();send()}});

 /* ---- lifecycle ---- */
 const api={
  async start(){const u=await getUser();if(!u){api.stop();return}
   if(me===u.id&&started)return;me=u.id;started=true;await loadList();subscribe()},
  stop(){me=null;started=false;list=[];cur=null;msgs=[];loaded=false;const d=DB();if(rt&&d){d.removeChannel(rt)}rt=null;if(tch&&d){d.removeChannel(tch)}tch=null;setMode();drawList();drawEmpty();hideNew();o.onUnread&&o.onUnread(0)},
  async refresh(){await loadList();if(cur){const id=cur.id;await openConv(id)}},
  async open(id,draft){if(!list.some(x=>x.id===id))await loadList();await openConv(id,draft)},
  reload:loadList
 };
 drawList();drawEmpty();
 return api}

/* ---- floating widget ---- */
const W={inst:null,ov:null,fab:null,badge:null};
function setBadge(n){if(!W.badge)return;W.badge.hidden=!n;W.badge.textContent=n>99?"99+":n}
function openW(){if(!W.ov)return;W.ov.classList.add("on");document.documentElement.classList.add("sc-lock");W.inst.refresh()}
function closeW(){if(!W.ov)return;W.ov.classList.remove("on");document.documentElement.classList.remove("sc-lock")}
function init(){
 if(W.ov||window.SOKO_NO_FAB||!DB())return;
 const fab=document.createElement("button");fab.className="sc-fab";fab.setAttribute("aria-label","Open chats");fab.title="Chats";
 fab.innerHTML=svg(P.bubble,30,1)+'<em hidden>0</em>';
 const ov=document.createElement("div");ov.className="sc-ov";ov.innerHTML='<div class="sc-win"></div>';
 document.body.append(fab,ov);W.fab=fab;W.ov=ov;W.badge=q("em",fab);
 W.inst=make(q(".sc-win",ov),{close:closeW,onUnread:setBadge});
 fab.addEventListener("click",async()=>{const u=await getUser();if(!u){askLogin("Log in or create an account to chat with shops, other members and the Soko Smart Team.");return}await W.inst.start();openW()});
 ov.addEventListener("click",e=>{if(e.target===ov)closeW()});
 document.addEventListener("keydown",e=>{if(e.key==="Escape"&&ov.classList.contains("on"))closeW()});
 const d=DB();d.auth.onAuthStateChange(()=>setTimeout(()=>W.inst.start(),0));
 W.inst.start()}
async function ensure(){if(!W.ov)init();return !!W.ov}
window.SokoChat={
 init,
 async open(){const u=await getUser();if(!u){askLogin("Log in or create an account to chat.");return}await ensure();await W.inst.start();openW()},
 async chatWith(uid,shopId,draft){
  const u=await getUser();if(!u){askLogin("Log in or create an account to chat with sellers.");return}
  if(!uid){say("This seller cannot be messaged right now.","error");return}
  if(u.id===uid){say("This is your own listing.","error");return}
  if(!(await ensure())){say("Chat is not available on this page.","error");return}
  const {data,error}=await DB().rpc("chat_start_direct",{p_other:uid,p_shop:shopId?String(shopId):null});
  if(error){say(error.message,"error");return}
  await W.inst.start();openW();await W.inst.open(data,draft)},
 async support(draft){
  const u=await getUser();if(!u){askLogin("Log in or create an account to message the Soko Smart Team.");return}
  if(!(await ensure()))return;
  const {data,error}=await DB().rpc("chat_start_support");if(error){say(error.message,"error");return}
  await W.inst.start();openW();await W.inst.open(data,draft)},
 mount(el,opts){const i=make(el,Object.assign({support:true},opts||{}));i.start();return i}
};
if(!window.SOKO_NO_FAB&&typeof sb!=="undefined"&&sb){if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init()}
})();