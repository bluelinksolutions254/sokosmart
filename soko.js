const CFG={url:"https://xalatowgjhwayrncrfbq.supabase.co",key:"sb_publishable_CfY5JZTUXpx51pkfbwey7w_jZtrYwog"};
const sb=window.supabase&&CFG.url.startsWith("http")?supabase.createClient(CFG.url,CFG.key):null;
const $=s=>document.querySelector(s),esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const fmt=n=>"KSh "+Number(n).toLocaleString("en-KE");
const COUNTIES="Baringo,Bomet,Bungoma,Busia,Elgeyo-Marakwet,Embu,Garissa,Homa Bay,Isiolo,Kajiado,Kakamega,Kericho,Kiambu,Kilifi,Kirinyaga,Kisii,Kisumu,Kitui,Kwale,Laikipia,Lamu,Machakos,Makueni,Mandera,Marsabit,Meru,Migori,Mombasa,Murang'a,Nairobi,Nakuru,Nandi,Narok,Nyamira,Nyandarua,Nyeri,Samburu,Siaya,Taita-Taveta,Tana River,Tharaka-Nithi,Trans Nzoia,Turkana,Uasin Gishu,Vihiga,Wajir,West Pokot".split(",");
const IC={bell:'<path d="M6 17V11a6 6 0 0 1 12 0v6l1.5 2h-15z"/><path d="M10 21a2 2 0 0 0 4 0"/>',flag:'<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',megaphone:'<path d="M3 11v3a1 1 0 0 0 1 1h2l5 4V6L6 10H4a1 1 0 0 0-1 1z"/><path d="M15 9a4 4 0 0 1 0 6M18 6.5a8 8 0 0 1 0 11"/>',phone:'<rect x="6" y="2" width="12" height="20" rx="2"/><path d="M11 18h2"/>',laptop:'<rect x="4" y="5" width="16" height="11" rx="1.5"/><path d="M2 20h20"/>',sofa:'<path d="M5 11V8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3"/><path d="M3 13a2 2 0 0 1 4 0v2h10v-2a2 2 0 0 1 4 0v5H3z"/><path d="M5 18v2M19 18v2"/>',shirt:'<path d="M8 3 3 6l2 4 3-1v11h8V9l3 1 2-4-5-3a4 4 0 0 1-8 0z"/>',car:'<path d="M4 17v-5l2-5h12l2 5v5z"/><circle cx="7.5" cy="17" r="1.5"/><circle cx="16.5" cy="17" r="1.5"/>',home:'<path d="M3 11l9-8 9 8v10H3z"/><path d="M9 21v-6h6v6"/>',leaf:'<path d="M5 19C5 9 11 4 20 4c0 9-5 15-15 15z"/><path d="M5 19 14 10"/>',basket:'<path d="M3 9h18l-2 11H5z"/><path d="M8 9l3-5M16 9l-3-5"/>',baby:'<circle cx="12" cy="12" r="9"/><path d="M9 10h.01M15 10h.01M9 15a4 4 0 0 0 6 0"/>',wrench:'<path d="M15 4a4 4 0 0 0-4 5l-7 7 4 4 7-7a4 4 0 0 0 5-4l-3 2-2-2 2-3z"/>',beauty:'<path d="M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2z"/>',sports:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',book:'<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 5v16"/>',paw:'<circle cx="7" cy="10" r="2"/><circle cx="17" cy="10" r="2"/><circle cx="10" cy="5.5" r="2"/><circle cx="14" cy="5.5" r="2"/><path d="M12 11c-3 0-5 3-5 5.5a2.5 2.5 0 0 0 3 2c1-.4 1.5-.5 2-.5s1 .1 2 .5a2.5 2.5 0 0 0 3-2c0-2.5-2-5.5-5-5.5z"/>',watch:'<rect x="7" y="6" width="10" height="12" rx="3"/><path d="M9 6l1-3h4l1 3M9 18l1 3h4l1-3M12 10v2l1.5 1"/>',plug:'<path d="M9 3v5M15 3v5M6 8h12v3a6 6 0 0 1-12 0zM12 17v4"/>',briefcase:'<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5h6v2M3 13h18"/>',user:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',eye:'<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',eyeoff:'<path d="M17.9 17.9A10.4 10.4 0 0 1 12 19C5.6 19 2 12 2 12a18 18 0 0 1 5.1-5.9M9.9 5.2A9.7 9.7 0 0 1 12 5c6.4 0 10 7 10 7a18 18 0 0 1-2.2 3.2M1 1l22 22"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/>',box:'<path d="M3 8l9-5 9 5v8l-9 5-9-5z"/><path d="M3 8l9 5 9-5M12 13v8"/>',truck:'<path d="M2 6h11v10H2zM13 9h4l4 4v3h-8z"/><circle cx="6.5" cy="17.5" r="1.8"/><circle cx="17.5" cy="17.5" r="1.8"/>',shield:'<path d="M12 3l8 3v6c0 4.5-3.2 8-8 9-4.8-1-8-4.5-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>',headset:'<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="3" y="14" width="4" height="6" rx="1.5"/><rect x="17" y="14" width="4" height="6" rx="1.5"/><path d="M19 20c0 1-2 2-5 2"/>',lock:'<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',tag:'<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8.5" r="1.5"/>',star:'<path d="M12 3l2.8 5.8 6.2.9-4.5 4.4 1.1 6.2L12 17.3l-5.6 3 1.1-6.2L3 9.7l6.2-.9z"/>',heart:'<path d="M12 20s-8-5-8-11a4.5 4.5 0 0 1 8-2.5A4.5 4.5 0 0 1 20 9c0 6-8 11-8 11z"/>',cart:'<circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h3l2.5 12h11L21 7H6"/>',search:'<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',left:'<path d="M15 5l-7 7 7 7"/>',right:'<path d="M9 5l7 7-7 7"/>',down:'<path d="M6 9l6 6 6-6"/>',check:'<path d="M5 12.5l4.5 4.5L19 7.5"/>',mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',gift:'<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13M5 12v8h14v-8M8 8a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8s1-5 4-5a2.5 2.5 0 0 1 0 5"/>',msg:'<path d="M4 4h16v12H9l-5 4z"/><path d="M8 9h8M8 12h5"/>',clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',undo:'<path d="M9 14L4 9l5-5"/><path d="M4 9h10a6 6 0 0 1 0 12h-3"/>',pin:'<path d="M12 21s7-6.2 7-11a7 7 0 0 0-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>',filter:'<path d="M3 5h18l-7 8v6l-4-2v-4z"/>',close:'<path d="M6 6l12 12M18 6 6 18"/>',grid:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>'};
const ic=(n,z=24,f)=>`<svg viewBox="0 0 24 24" width="${z}" height="${z}" fill="${f?"currentColor":"none"}" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[n]||""}</svg>`;
Object.assign(IC,{wallet:'<path d="M3 7a2 2 0 0 1 2-2h13v4"/><path d="M3 7v11a2 2 0 0 0 2 2h15V9H5a2 2 0 0 1-2-2z"/><circle cx="16.5" cy="14.5" r="1"/>',facebook:'<path d="M14 8h3V4h-3a4 4 0 0 0-4 4v2H7v4h3v8h4v-8h3l1-4h-4V8z"/>',instagram:'<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/>',x:'<path d="M4 4l16 16M20 4L4 20"/>',tiktok:'<path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5M14 3c.4 2.6 2 4.2 5 4.5"/>',youtube:'<rect x="2" y="6" width="20" height="12" rx="4"/><path d="M10 9.5l5 2.5-5 2.5z"/>',whatsapp:'<path d="M3 21l1.6-4.8A8.5 8.5 0 1 1 8 19.6z"/><path d="M9 9c0 3 3 6 6 6l1.2-1.4-2-1-1 .6c-1-.4-2-1.4-2.4-2.4l.6-1-1-2z"/>',linkedin:'<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 11v6M8 7.5v.01M12 17v-6M12 13.5a3 3 0 0 1 6 0V17"/>',telegram:'<path d="M21 4L3 11l6 2 2 6 3-4 5 4z"/>',link:'<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>'});
const SOCN={facebook:"Facebook",instagram:"Instagram",x:"X (Twitter)",tiktok:"TikTok",youtube:"YouTube",whatsapp:"WhatsApp",linkedin:"LinkedIn",telegram:"Telegram",link:"Other link"};
const socKey=s=>{const k=String(s.icon||"").toLowerCase();if(SOCN[k])return k;const n=String(s.name||"").toLowerCase();return Object.keys(SOCN).find(x=>x!=="link"&&n.includes(x))||(/twitter/.test(n)?"x":"link")};
const CATS=[["phone","Phones"],["laptop","Computers"],["sofa","Home & Furniture"],["shirt","Fashion"],["leaf","Agriculture"],["basket","Food & Groceries"],["baby","Baby & Kids"],["wrench","Tools"],["beauty","Beauty & Health"],["sports","Sports & Fitness"],["book","Books & Education"],["paw","Pets"],["watch","Watches & Jewellery"],["plug","Appliances"]];
function toast(t){const e=$("#toast");e.textContent=t;e.classList.add("s");clearTimeout(toast.t);toast.t=setTimeout(()=>e.classList.remove("s"),2000)}
const openD=h=>{$("#dc").innerHTML=h;if(!$("#dlg").open)$("#dlg").showModal()};
/* ---------- confirmation pop-up (replaces the browser's plain confirm box) ---------- */
function askConfirm(o){o=typeof o==="string"?{msg:o}:(o||{});
 return new Promise(res=>{let d=document.getElementById("cfm");
  if(!d){document.head.insertAdjacentHTML("beforeend",'<style>#cfm{border:0;border-radius:16px;padding:24px 22px 18px;max-width:380px;width:calc(100% - 40px);text-align:center;background:#fff;color:#1d1a16;box-shadow:0 18px 50px rgba(0,0,0,.3)}#cfm::backdrop{background:rgba(0,0,0,.45)}#cfm .cfi{width:54px;height:54px;border-radius:50%;margin:0 auto 10px;display:grid;place-items:center;font-size:28px;font-weight:800;color:#fff;background:#F58E20}#cfm.dg .cfi{background:#d3261e}#cfm h3{margin:0 0 6px;font-size:19px}#cfm p{margin:0 0 18px;color:#6b625a;overflow-wrap:anywhere;font-size:14.5px}#cfm .cfb{display:flex;gap:10px;justify-content:center;flex-wrap:wrap}#cfm button{font:inherit;font-weight:700;border-radius:10px;padding:10px 20px;cursor:pointer;border:1.5px solid #d8d2ca;background:#fff;color:#1d1a16}#cfm .cfy{background:#0B4A2E;border-color:#0B4A2E;color:#fff}#cfm.dg .cfy{background:#d3261e;border-color:#d3261e}#cfm button:focus-visible{outline:3px solid #F58E20;outline-offset:2px}</style>');
   d=document.createElement("dialog");d.id="cfm";d.setAttribute("role","alertdialog");document.body.appendChild(d)}
  const danger=o.danger!==false&&o.danger!==0;d.className=danger?"dg":"";
  d.innerHTML='<div class="cfi"></div><h3></h3><p></p><div class="cfb"><button type="button" class="cfn"></button><button type="button" class="cfy"></button></div>';
  d.querySelector(".cfi").textContent=danger?"!":"?";d.querySelector("h3").textContent=o.title||"Are you sure?";d.querySelector("p").textContent=o.msg||"";
  d.querySelector(".cfn").textContent=o.cancel||"Cancel";d.querySelector(".cfy").textContent=o.ok||"Yes, continue";
  let done=false;const fin=v=>{if(done)return;done=true;if(d.open)d.close();res(v)};
  d.querySelector(".cfn").onclick=()=>fin(false);d.querySelector(".cfy").onclick=()=>fin(true);
  d.oncancel=e=>{e.preventDefault();fin(false)};d.onclick=e=>{if(e.target===d)fin(false)};
  d.showModal();d.querySelector(".cfn").focus()})}

const fld=(l,n,t="text",x="")=>t==="password"?`<label>${l}<div class="pwf"><input name="${n}" type="password" required ${x}><button type="button" class="eye" data-eye aria-label="Show password" aria-pressed="false">${ic("eye",20)}</button></div></label>`:`<label>${l}<input name="${n}" type="${t}" ${x.includes("opt")?"":"required"} ${x.replace("opt","")}></label>`;
const sel=(l,n,o,v="",req="required")=>`<label>${l}<select name="${n}" ${req}><option value="">Choose</option>${o.map(x=>`<option ${x===v?"selected":""}>${esc(x)}</option>`).join("")}</select></label>`;
async function user(){if(!sb)return null;const {data:{session}}=await sb.auth.getSession();return session?session.user:null}
const logView=()=>openD(`<h3>Welcome back</h3><form id="lg">${fld("Email","em","email","autocomplete=username")}${fld("Password","pw","password","autocomplete=current-password")}<button class="btn p">Login</button><p class="m" style="margin:0">New here? <button type="button" class="lnk" id="toSign">Create an account</button></p></form>`);
const signView=()=>openD(`<h3>Create your account</h3><form id="su">${fld("Name","nm","text","autocomplete=name")}${fld("Email","em","email")}${fld("Phone number","ph","tel",'pattern="(254|0|[+]254)[17][0-9]{8}" placeholder="0712 345 678"')}${sel("How you heard about us","hh",["Facebook","Instagram","TikTok","WhatsApp","Friend or family","Google search","Other"])}${fld("Password","pw","password","minlength=8")}${fld("Confirm password","pc","password","minlength=8")}<button class="btn p">Sign up</button></form>`);
let CURU=null;
function needLogin(why){openD(`<div class="gate"><h3>Please log in first</h3><p>${esc(why||"You need an account to do this.")}</p><p>Log in, or create a free account if you are new.</p><button class="btn p" id="nl">Login</button><button class="btn" id="ns">Create an account</button></div>`);$("#nl").onclick=logView;$("#ns").onclick=signView}
async function needUser(why){const u=await user();if(!u)needLogin(why);return u}
const GATED=[["profile.html","view your profile"],["shopmanager.html","use the Shop Manager"],["openshop.html","open a shop"]];
document.addEventListener("click",e=>{const a=e.target.closest("a[href]");if(!a||CURU)return;const h=a.getAttribute("href")||"",g=GATED.find(x=>h.startsWith(x[0]));if(g){e.preventDefault();needLogin("Log in or create an account to "+g[1]+".")}});
document.addEventListener("click",e=>{const b=e.target.closest("[data-eye]");
 if(b){const i=b.previousElementSibling,show=i.type==="password";i.type=show?"text":"password";b.innerHTML=ic(show?"eyeoff":"eye",20);b.setAttribute("aria-pressed",show);b.setAttribute("aria-label",show?"Hide password":"Show password")}
 else if(e.target.id==="toSign")signView();else if(e.target.id==="dx"||e.target===$("#dlg"))$("#dlg").close()});
document.addEventListener("submit",async e=>{const f=e.target;
 if(f.id==="lg"){e.preventDefault();if(!sb){toast("Connect Supabase to enable login");return}const {error}=await sb.auth.signInWithPassword({email:f.em.value.trim(),password:f.pw.value});if(error){toast(error.message);return}$("#dlg").close();toast("Logged in");who()}
 if(f.id==="su"){e.preventDefault();if(f.pw.value!==f.pc.value){toast("Passwords do not match");return}
  if(sb){const {error}=await sb.auth.signUp({email:f.em.value.trim(),password:f.pw.value,options:{data:{full_name:f.nm.value,phone:f.ph.value,heard_from:f.hh.value}}});if(error){toast(error.message);return}}
  $("#dlg").close();toast("Welcome to SOKO Smart, "+f.nm.value);who()}});

/* ---------- site content (homepage controlled from admin) ---------- */
const HOME_DEF={
 services:{navOn:true,navLabel:"Services",bandOn:true,bandTitle:"Need a plumber, cleaner or ",bandHi:"casual worker?",bandText:"Browse approved service providers near you, message them directly, or post a request and let them apply.",bandBtn:"Browse services",bandAlt:"Offer your services"},
 topbar:[{icon:"truck",text:"Chat with sellers before you buy"},{icon:"shield",text:"Verified sellers across all 47 counties"},{icon:"tag",text:"List products for free"}],
 headerLinks:[{label:"Sell Your Vehicle",url:"",icon:"car",newTab:true,on:true},{label:"Sell Your Land/Property",url:"",icon:"pin",newTab:true,on:true}],
 sidebar:{enabled:true,title:"Shop by Category"},
 hero:{slides:[
  {title:"Upgrade Your Everyday",sub:"Smart products from trusted Kenyan sellers, delivered to your county.",btn:"Shop Now",link:"shop.html",img:"",bg:"#FFF3E3",theme:"light"},
  {title:"Open Your Shop",sub:"Get a storefront link, a chat inbox and a dashboard to manage products.",btn:"Open a Shop",link:"openshop.html",img:"",bg:"#0B4A2E",theme:"dark"}]},
 features:[{icon:"truck",title:"Delivery by seller",sub:"Agree the details in chat"},{icon:"shield",title:"Verified sellers",sub:"Look for the green tick"},{icon:"headset",title:"Chat support",sub:"The SOKO Smart team"},{icon:"lock",title:"Safe meet-ups",sub:"Pay on delivery or collect"}],
 sections:[
  {id:"s1",type:"products",source:"latest",title:"New Arrivals",link:"shop.html?sort=latest",count:5,badge:"New",on:true},
  {id:"s2",type:"banners",on:true,items:[
   {tag:"",title:"Style That Moves With You",sub:"Fashion from local shops",btn:"Shop Fashion",link:"shop.html?k=Fashion",img:"",color:"#FDE3DC"},
   {tag:"",title:"Smart Living for Modern Homes",sub:"Furniture and appliances near you",btn:"Shop Home",link:"shop.html?k=Home",img:"",color:"#E3F0E7"}]},
  {id:"s3",type:"products",source:"featured",title:"Featured Products",link:"shop.html?feat=1",count:5,badge:"",on:true},
  {id:"s4",type:"products",source:"trending",title:"Trending Now",link:"shop.html?sort=popular",count:5,badge:"Hot",on:true},
  {id:"s5",type:"shops",title:"Top Rated Shops",link:"shop.html?section=shops",count:8,on:true},
  {id:"s6",type:"jobs",title:"Hiring Now",link:"jobs.html",count:6,on:true},
  {id:"s7",type:"blog",title:"From Our Blog",link:"blog.html",count:3,on:true,items:[]},
  {id:"s8",type:"community",title:"Join the SOKO Smart Community",text:"Get new arrivals and selling tips straight to your inbox.",btn:"Subscribe",on:true},
  {id:"s9",type:"brands",title:"Shop Top Brands",link:"",on:false,items:[]},
  {id:"s10",type:"cta",on:true}],
 menu:[],searchHint:"",
 footer:{copyright:"",contact:{},columns:[],tagline:"Kenya’s smart marketplace for products, shops, jobs and services.",socials:[{name:"Facebook",icon:"facebook",url:""},{name:"Instagram",icon:"instagram",url:""},{name:"TikTok",icon:"tiktok",url:""},{name:"WhatsApp",icon:"whatsapp",url:""}]}};
let SITE=null;
const mergeSite=v=>{const o=JSON.parse(JSON.stringify(HOME_DEF));if(v&&typeof v==="object")for(const k of Object.keys(o))if(v[k]!==undefined&&v[k]!==null)o[k]=v[k];o.services=Object.assign({},HOME_DEF.services,v&&typeof v.services==="object"&&v.services||{});o.footer=Object.assign({},HOME_DEF.footer,v&&typeof v.footer==="object"&&v.footer||{});if(!Array.isArray(o.menu))o.menu=[];return o};
async function siteCfg(){if(SITE)return SITE;
 /* always read the latest saved homepage; the session copy is only a fallback if the database cannot be reached */
 let v=null,ok=false;
 if(sb){try{const {data,error}=await sb.from("site_content").select("value").eq("key","homepage").maybeSingle();if(!error){v=data&&data.value||null;ok=true}}catch(e){}}
 if(ok){try{sessionStorage.sokoSite=JSON.stringify({t:Date.now(),v})}catch(e){}}
 else{try{const s=JSON.parse(sessionStorage.sokoSite||"null");if(s)v=s.v}catch(e){}}
 SITE=mergeSite(v);return SITE}
/* short, friendly name for greetings: first name, else the part of the email before @ (never the whole address) */
const dispName=(u,max=14)=>{if(!u)return"";let n=String((u.user_metadata&&u.user_metadata.full_name)||"").trim().split(/\s+/)[0];
 if(!n)n=String(u.email||"").split("@")[0].replace(/[._-]+/g," ").trim().split(" ")[0];
 n=n||"there";n=n.charAt(0).toUpperCase()+n.slice(1);return n.length>max?n.slice(0,max-1)+"…":n};
/* ---------- payments: buyers pay the SOKO Smart Wallet; funds are held until the buyer releases them ---------- */
const payHTML=()=>`<div class="payb"><b>${ic("shield",16)} Pay safely with SOKO Smart Wallet</b><div class="payi"><span>Your money is held by SOKO Smart and only goes to the seller when you release it after receiving your order.</span></div></div>`;
const payText=()=>"";
const safeUrl=u=>/^(https?:\/\/|[a-z0-9_\-./?=&%#]+$)/i.test(String(u||""))?u:"#";

/* ---------- wishlist + cart ---------- */
let FAV=new Set();const RECS={};
const CK="soko_cart";let CART={};try{CART=JSON.parse(localStorage.getItem(CK)||"{}")}catch(e){}
function cartCount(){const n=Object.values(CART).reduce((a,b)=>a+b.qty,0),e=$("#cN");if(e){e.textContent=n;e.hidden=!n}}
function cartSave(){try{localStorage.setItem(CK,JSON.stringify(CART))}catch(e){}cartCount()}
function addCart(k,qty=1){const r=RECS[k];if(!r)return;const x=CART[k];CART[k]={id:r.id,s:r._s,title:r.title||r.name,price:r.price,img:r.cover_url||"",owner:r.owner_id||null,shop:r.shop_id||null,qty:(x?x.qty:0)+qty};cartSave();toast("Added to cart")}
function cartView(){const ks=Object.keys(CART),tot=ks.reduce((a,k)=>a+(CART[k].price||0)*CART[k].qty,0);
 openD("<h3>Your cart</h3>"+(ks.length?`<div style="display:grid;gap:10px;max-height:50vh;overflow:auto">${ks.map(k=>{const x=CART[k];return `<div class="ci"><div class="ci-i">${x.img?`<img alt="" src="${esc(x.img)}">`:ic("box",24)}</div><div style="flex:1;min-width:0"><b class="ci-t">${esc(x.title)}</b><div class="m">${x.price!=null?fmt(x.price):"Contact for price"}</div><div class="qty"><button data-q="${esc(k)}" data-d="-1" aria-label="Less">−</button><span>${x.qty}</span><button data-q="${esc(k)}" data-d="1" aria-label="More">+</button><button class="lnk" data-rm="${esc(k)}" style="margin-left:10px">Remove</button></div></div></div>`}).join("")}</div><p class="price" style="margin:12px 0 4px">Total ${fmt(tot)}</p><p class="m" style="margin:0 0 10px">You pay into the SOKO Smart Wallet. Your money is held until you release it to the seller.</p><button class="btn p" data-co style="width:100%">Checkout in chat</button>`:'<div class="empty">Your cart is empty.<br><br><a class="btn p" href="shop.html">Start shopping</a></div>'))}
async function checkout(){const u=await needUser("Log in or create an account to place your order.");if(!u)return;
 if(!window.SokoChat){toast("Chat is still loading, please try again");return}
 const ADM="__admin";let admId=null;const g={};Object.values(CART).forEach(x=>{const k=x.owner||ADM;(g[k]=g[k]||{shop:x.shop,items:[]}).items.push(x)});
 if(g[ADM]){try{const r=await sb.from("profiles").select("id").eq("role","admin").limit(1);admId=r.data&&r.data[0]?r.data[0].id:null}catch(e){}}
 const mine=Object.keys(g).some(o=>o===u.id||(o===ADM&&admId===u.id)),ids=Object.keys(g).filter(o=>o!==u.id&&!(o===ADM&&admId===u.id));
 if(!ids.length){toast(mine?"This is your own listing. Log in with a customer account to buy it.":"These items have no reachable seller","error");return}
 let WL=[];try{const w=await sb.rpc("wallet_ensure",{p_shop_id:null});if(!w.error&&w.data)WL.push({id:w.data.id,name:"Personal wallet",bal:+w.data.balance});
  const sh=await sb.from("shops").select("id,name").eq("owner_id",u.id);const ws=(sh.data||[]).length?await sb.from("wallets").select("id,shop_id,balance").in("shop_id",sh.data.map(x=>String(x.id))):{data:[]};
  (ws.data||[]).forEach(x=>{const n=(sh.data.find(y=>String(y.id)===String(x.shop_id))||{}).name||"Shop";WL.push({id:x.id,name:"Shop wallet: "+n,bal:+x.balance})})}catch(e){}
 const curW=()=>{const el=document.getElementById("payw");return WL.find(x=>String(x.id)===(el?el.value:""))||WL[0]||null},bal=()=>{const w=curW();return w?w.bal:null};
 const tot=o=>g[o].items.reduce((a,x)=>a+(x.price||0)*x.qty,0),priced=o=>g[o].items.every(x=>x.price!=null&&(x.s||"products")==="products");
 const card=(o,i)=>`<div class="pan" style="border:1px solid var(--bd);border-radius:12px;padding:12px;display:grid;gap:6px"><b>${ids.length>1?"Seller "+(i+1)+" · ":""}${g[o].items.length} item${g[o].items.length>1?"s":""}</b>${g[o].items.map(x=>`<div class="m">${esc(x.title)} × ${x.qty}${x.price!=null?" · "+fmt(x.price*x.qty):""}</div>`).join("")}<div class="price" style="margin:2px 0">Total ${fmt(tot(o))}</div>
  <div style="display:flex;gap:8px;flex-wrap:wrap">${priced(o)?`<button class="btn p" data-pay="${esc(o)}">Pay ${fmt(tot(o))} to SOKO Smart Wallet</button>`:""}${o===ADM&&!admId?"":`<button class="btn" data-seller="${esc(o)}">Chat with seller</button>`}</div>${priced(o)?"":'<div class="m">This seller has items without a fixed price. Chat to agree the price first.</div>'}</div>`;
 openD(`<h3>Checkout</h3><p class="m" style="margin:0 0 4px">Pay into the <b>SOKO Smart Wallet</b>. Your money is <b>held safely</b> and is only sent to the seller when <b>you release it</b> after receiving your order.</p>
 ${WL.length>1?`<label style="display:grid;gap:4px;font-weight:600;font-size:13px;margin:0 0 6px">Pay from<select id="payw" style="border:1px solid var(--bd);border-radius:8px;padding:9px 10px;font:inherit">${WL.map(x=>`<option value="${esc(x.id)}">${esc(x.name)} · ${fmt(x.bal)}</option>`).join("")}</select></label>`:`<p class="m" style="margin:0 0 6px">Paying from: <b>${WL[0]?esc(WL[0].name):"your wallet"}</b></p>`}<p class="m" style="margin:0 0 10px">Balance: <b id="payb">${bal()==null?"unavailable":fmt(bal())}</b> · <a href="wallet.html">Top up wallet</a></p><div style="display:grid;gap:10px;max-height:55vh;overflow:auto">${ids.map(card).join("")}</div>`);
 const hello=o=>"Hi, I would like to order:\n"+g[o].items.map(x=>`• ${x.title} × ${x.qty}${x.price!=null?" ("+fmt(x.price)+")":""}`).join("\n")+"\nIs everything available?";
 const pw=document.getElementById("payw");if(pw)pw.onchange=()=>{document.getElementById("payb").textContent=fmt(bal())};
 document.querySelectorAll("[data-seller]").forEach(b=>b.onclick=()=>{const o=b.dataset.seller;$("#dlg").close();SokoChat.chatWith(o===ADM?admId:o,g[o].shop||null,hello(o))});
 document.querySelectorAll("[data-pay]").forEach(b=>b.onclick=async()=>{const o=b.dataset.pay;
  if(bal()!=null&&bal()<tot(o)){toast("Your wallet balance is too low. Top up your wallet first.","error");return}
  b.disabled=true;
  const r=await sb.rpc("escrow_place_order",{p_seller:o===ADM?null:o,p_shop:g[o].shop?String(g[o].shop):null,p_items:g[o].items.map(x=>({product_id:String(x.id),qty:x.qty})),p_wallet:curW()?curW().id:null});
  if(r.error){b.disabled=false;const m=String(r.error.message||""),E={insufficient_funds:"Your wallet balance is too low. Top up your wallet first.",seller_wallet_missing:"This seller has not activated their wallet yet. Chat with them first.",out_of_stock:"One of the items is out of stock.",bad_item:"One of the items can no longer be ordered.",wallet_missing:"Open your wallet first so it can be created.",card_expired:"Your wallet card has expired. Renew it first."},k=Object.keys(E).find(x=>m.includes(x));
   toast(k?E[k]:/function|schema cache/i.test(m)?"Escrow is not set up yet. Run supabase-escrow.sql in Supabase.":m,"error");return}
  Object.keys(CART).forEach(k=>{if(String(CART[k].owner||ADM)===o)delete CART[k]});cartSave();
  let sid=o===ADM?admId:o;if(!sid){try{const q=await sb.from("orders").select("seller_id").eq("id",r.data).maybeSingle();sid=q.data&&q.data.seller_id}catch(e){}}
  $("#dlg").close();toast("Paid. Your money is held until you release it.");
  if(sid)SokoChat.chatWith(sid,g[o].shop||null,`Hi, I have paid ${fmt(tot(o))} for order #${String(r.data).slice(0,6)} into the SOKO Smart Wallet. The money is held until I confirm I received the order. Please prepare it for delivery.`)})}
/* Chat Seller + Checkout Now for one product (used by the cards and the product page) */
async function chatSeller(k){const r=RECS[k];if(!r)return;const u=await needUser("Log in or create an account to chat with the seller.");if(!u)return;
 if(u.id===r.owner_id){toast("This is your own listing");return}
 if(!window.SokoChat){toast("Chat is still loading, please try again");return}
 SokoChat.chatWith(r.owner_id,r._s==="shops"?r.id:(r.shop_id||null),`Hi, I am interested in "${r.title||r.name}". Is it still available?`)}
async function buyNow(k){const r=RECS[k];if(!r)return;const keep=CART;CART={[k]:{id:r.id,s:r._s,title:r.title||r.name,price:r.price,img:r.cover_url||"",owner:r.owner_id||null,shop:r.shop_id||null,qty:1}};
 try{await checkout()}finally{CART=keep}}
async function loadFavs(u){FAV=new Set();if(u&&sb){const {data}=await sb.from("favorites").select("listing_type,listing_id").eq("user_id",u.id);(data||[]).forEach(x=>FAV.add(x.listing_type+":"+x.listing_id))}
 paintFavs()}
function paintFavs(){document.querySelectorAll("[data-f]").forEach(b=>{const on=FAV.has(b.dataset.f);b.classList.toggle("on",on);b.innerHTML=ic("heart",18,on)});const w=$("#wlN");if(w){w.textContent=FAV.size;w.hidden=!FAV.size}}
document.addEventListener("click",async e=>{let b;
 if(b=e.target.closest("[data-f]")){e.preventDefault();const u=await needUser("Log in or create an account to save items to your wishlist.");if(!u)return;const k=b.dataset.f,[ty,...r]=k.split(":"),id=r.join(":"),on=!FAV.has(k);on?FAV.add(k):FAV.delete(k);paintFavs();toast(on?"Saved to wishlist":"Removed from wishlist");
  const {error}=await(on?sb.from("favorites").upsert({user_id:u.id,listing_type:ty,listing_id:id}):sb.from("favorites").delete().eq("user_id",u.id).eq("listing_type",ty).eq("listing_id",id));if(error){on?FAV.delete(k):FAV.add(k);paintFavs();toast(/favorites|schema cache|does not exist|policy/i.test(error.message||"")?"Wishlist is not set up yet. Run supabase-favorites.sql in Supabase.":error.message,"error")}}
 else if(b=e.target.closest("[data-c]")){e.preventDefault();addCart(b.dataset.c)}
 else if(b=e.target.closest("[data-chat]")){e.preventDefault();chatSeller(b.dataset.chat)}
 else if(b=e.target.closest("[data-buy]")){e.preventDefault();buyNow(b.dataset.buy)}
 else if(e.target.closest("#cartBtn"))cartView();
 else if(b=e.target.closest("[data-q]")){const k=b.dataset.q;CART[k].qty=Math.max(1,CART[k].qty+ +b.dataset.d);cartSave();cartView()}
 else if(b=e.target.closest("[data-rm]")){delete CART[b.dataset.rm];cartSave();cartView()}
 else if(e.target.closest("[data-co]"))checkout()});

/* ---------- auth state in header ---------- */
async function who(){const u=await user();CURU=u;const p=$("#pfBtn");
 if(p){p.classList.toggle("on",!!u);p.title=u?"My profile":"Log in to view your profile";p.innerHTML=u?esc(String(u.user_metadata?.full_name||u.email||"?").trim()[0].toUpperCase()):ic("user",22)}
 const s=$("#acS");if(s){s.textContent=u?"Hello, "+dispName(u):"Account";s.title=u?String(u.email||""):""}
 const b=$("#logBtn");if(!b)return;
 if(u){b.textContent="Logout";b.onclick=async()=>{if(!await askConfirm({title:"Log out?",msg:"Are you sure you want to log out of SOKO Smart?",ok:"Yes, log out",cancel:"Stay logged in",danger:false}))return;await sb.auth.signOut();toast("Logged out");who()};$("#signBtn").hidden=true}
 else{b.textContent="Sign in";b.onclick=logView;$("#signBtn").hidden=false}
 notifLoad(u);loadFavs(u)}

/* ---------- shell: header + footer ---------- */
const NAV=[["index.html","Home"],["shop.html","Shop"],["shop.html?sort=latest","New Arrivals"],["shop.html?sort=popular","Best Sellers"],["shop.html?feat=1","Featured"],["shop.html?section=shops","Shops"],["jobs.html","Jobs"],["freelance.html","Freelance"],["blog.html","Blog"]];
const cachedCfg=()=>{try{const x=JSON.parse(sessionStorage.sokoSite||"null");return mergeSite(x&&x.v)}catch(e){return mergeSite(null)}};
const navItems=c=>{const L=c.services.navOn===false?NAV.slice():NAV.concat([["servicehub.html",String(c.services.navLabel||"").trim()||"Services"]]);(c.menu||[]).forEach(m=>{if(m&&m.on!==false&&m.label&&m.url)L.push([safeUrl(m.url),m.label])});return L};
const navHTML=(c,on)=>{const here=location.pathname.split("/").pop()||"index.html",cur=here+location.search,L=navItems(c);let act=L.findIndex(n=>n[0]===cur);if(act<0)act=L.findIndex(n=>n[0]===(on||here));return L.map((n,i)=>`<a href="${esc(n[0])}" class="${i===act?"on":""}">${esc(n[1])}</a>`).join("")+'<a class="nshop" href="openshop.html">Open a Shop</a>'};
const hlinks=c=>(c.headerLinks||[]).filter(x=>x&&x.on!==false&&x.label&&!/^\s*(ksh|kes)\b/i.test(x.label)).map(x=>{const u=String(x.url||"").trim();return u?`<a href="${esc(safeUrl(u))}" ${x.newTab!==false?'target="_blank" rel="noopener"':""}>${ic(x.icon||"tag",14)}${esc(x.label)}</a>`:`<a href="#" data-soon>${ic(x.icon||"tag",14)}${esc(x.label)}</a>`}).join("");
const topHTML=c=>c.topbar.filter(x=>x&&x.text&&!/^\s*(ksh|kes)\s*$/i.test(x.text)).map(x=>`<li>${ic(x.icon||"check",15)}<span>${esc(x.text)}</span></li>`).join("");
/* ---------- admin-controlled header, footer and per-page settings ---------- */
function applySite(c){
 if(!document.getElementById("sokoXs"))document.head.insertAdjacentHTML("beforeend",'<style id="sokoXs">footer .fx{grid-template-columns:repeat(auto-fit,minmax(150px,1fr));margin-top:24px}footer #fct{margin-top:10px;display:grid;gap:2px;color:#cfe3d8}.pgn{text-align:center;padding:10px 16px;font-weight:600;color:#17201b}.pgn a{text-decoration:underline;display:inline}.pgi{display:block;width:100%;max-height:260px;object-fit:cover;border-radius:16px;margin:12px 0}.pgb{padding:14px 0}.pgb p{margin:6px 0 10px}</style>');
 const q=$("#q");if(q&&c.searchHint)q.placeholder=c.searchHint;
 const f=c.footer||{},fc=$("#fcopy");if(fc&&f.copyright)fc.textContent=f.copyright;
 const k=f.contact||{},ct=$("#fct");if(ct)ct.innerHTML=[k.email?`<a href="mailto:${esc(k.email)}">${esc(k.email)}</a>`:"",k.phone?`<a href="tel:${esc(String(k.phone).replace(/[^+\d]/g,""))}">${esc(k.phone)}</a>`:"",k.address?`<span>${esc(k.address)}</span>`:""].join("");
 const cols=(f.columns||[]).filter(x=>x&&x.title).map(x=>`<div><h4>${esc(x.title)}</h4>${String(x.links||"").split(/\r?\n/).map(l=>{const i=l.indexOf("|");if(i<1)return"";const t=l.slice(0,i).trim(),u=l.slice(i+1).trim();return t&&u?`<a href="${esc(safeUrl(u))}">${esc(t)}</a>`:""}).join("")}</div>`).join(""),fx=$("#fcols");
 if(fx){fx.innerHTML=cols;fx.hidden=!cols}}
async function applyPage(){if(!sb)return;const slug=(location.pathname.split("/").pop()||"index.html").replace(/\.html$/,"");if(!slug||slug==="index")return;
 let p=null;try{const {data,error}=await sb.from("site_content").select("value").eq("key","pages").maybeSingle();p=!error&&data&&data.value&&data.value[slug]}catch(e){}
 const main=document.querySelector("main");if(!p||typeof p!=="object"||!main)return;
 if(p.seoTitle)document.title=p.seoTitle;
 if(p.seoDesc){let m=document.querySelector("meta[name=description]");if(!m){m=document.createElement("meta");m.name="description";document.head.appendChild(m)}m.content=p.seoDesc}
 if(p.on===false){main.hidden=true;main.style.display="none";main.insertAdjacentHTML("afterend",`<div class="w"><div class="msg" style="padding:80px 16px;font-size:17px">${esc(p.closedMsg||"This page is temporarily closed. Please check back soon.")}</div></div>`);return}
 let h="";
 if(p.noteOn&&p.note){const bg=/^#[0-9a-f]{3,8}$/i.test(p.noteColor||"")?p.noteColor:"#FDE3DC",t=esc(p.note);h+=`<div class="pgn" style="background:${bg}">${p.noteLink?`<a href="${esc(safeUrl(p.noteLink))}">${t}</a>`:t}</div>`}
 if(p.img)h+=`<div class="w"><img class="pgi" alt="" src="${esc(p.img)}"></div>`;
 h+=(p.blocks||[]).filter(b=>b&&b.on!==false&&(b.title||b.text)).map(b=>`<section class="w pgb">${b.title?`<h2>${esc(b.title)}</h2>`:""}${b.text?`<p>${esc(b.text)}</p>`:""}${b.btn?`<a class="btn g" href="${esc(safeUrl(b.link))}">${esc(b.btn)}</a>`:""}</section>`).join("");
 if(h)main.insertAdjacentHTML("beforebegin",`<div id="pgx">${h}</div>`);
 const fix=()=>{const h1=main.querySelector("h1");if(!h1)return false;if(p.title)h1.textContent=p.title;if(p.sub){let e=h1.nextElementSibling;if(!e||e.tagName!=="P"){e=document.createElement("p");e.className="m";h1.after(e)}e.textContent=p.sub}return true};
 if(p.title||p.sub){if(!fix()){let n=0;const t=setInterval(()=>{if(fix()||++n>20)clearInterval(t)},300)}}}

/* ---------- sign customers out after the idle time chosen in the admin (Settings > Security) ---------- */
async function idleGuard(){if(!sb)return;
 let u=null;try{const r=await sb.auth.getSession();u=r.data&&r.data.session&&r.data.session.user}catch(e){}
 if(!u)return;
 let m=0;try{const r=await sb.from("site_content").select("value").eq("key","security").maybeSingle();m=Math.max(0,+(r.data&&r.data.value&&r.data.value.customerIdleMinutes)||0)}catch(e){}
 if(!m)return;const lim=m*60000,K="soko_last_active";
 const out=async()=>{try{await sb.auth.signOut()}catch(e){}try{localStorage.removeItem(K)}catch(e){}toast("You were signed out because you were inactive for a while.");setTimeout(()=>location.reload(),1500)};
 let last=+(()=>{try{return localStorage.getItem(K)}catch(e){return 0}})()||Date.now();
 if(Date.now()-last>=lim){out();return}
 let w=0;const mark=()=>{last=Date.now();if(Date.now()-w>10000){w=Date.now();try{localStorage.setItem(K,String(last))}catch(e){}}};
 ["mousemove","mousedown","keydown","scroll","touchstart","click"].forEach(ev=>addEventListener(ev,mark,{passive:true}));mark();
 setInterval(()=>{let l=last;try{l=Math.max(last,+localStorage.getItem(K)||0)}catch(e){}if(Date.now()-l>=lim)out()},15000)}

/* ---------- opening a shop is paid: choose a plan, then pay with M-Pesa ---------- */
const KESF=n=>"KES "+Number(n).toLocaleString("en-KE");
/* any accepted format (0740757592, 0740 757 592, +254740757592, 254740757592) -> 254740757592, the form Safaricom needs */
const msisdn=v=>{let d=String(v||"").replace(/\D/g,"");if(/^0/.test(d))d="254"+d.slice(1);else if(/^[17]\d{8}$/.test(d))d="254"+d;return d};
/* the Supabase function that sends the M-Pesa prompt (the one that worked before) */
const PAY_FN="mpesa-stk";
function payState(el,kind,title,sub,retry){
 if(!document.getElementById("pgacss"))document.head.insertAdjacentHTML("beforeend",'<style id="pgacss">'+'#pgate .pgst{max-width:460px;text-align:center;padding:30px 24px}#pgate .pgst h2{margin:14px 0 6px;font-size:22px}#pgate .pgst .pgs{margin:0 0 16px}#pgate .pga{display:grid;place-items:center}#pgate .pgst.ok h2{color:#15803d}#pgate .pgst.cancel h2,#pgate .pgst.fail h2{color:#d3261e}#pgate .pgst.wait h2{color:#0B4A2E}#pgate .rg{fill:none;stroke:#F58E20;stroke-width:3;opacity:0;transform-box:fill-box;transform-origin:center;animation:pgring 1.8s ease-out infinite}#pgate .r2{animation-delay:.9s}@keyframes pgring{0%{transform:scale(.6);opacity:.9}100%{transform:scale(2.1);opacity:0}}#pgate .pd{fill:#0B4A2E;opacity:.15;animation:pgdot 1.2s infinite}#pgate .pd:nth-of-type(2){animation-delay:.2s}#pgate .pd:nth-of-type(3){animation-delay:.4s}#pgate .pd:nth-of-type(4){animation-delay:.6s}@keyframes pgdot{0%,60%,100%{opacity:.15}30%{opacity:1}}#pgate .okc{transform-box:fill-box;transform-origin:center;animation:pgpop .5s cubic-bezier(.2,1.6,.4,1) both}@keyframes pgpop{from{transform:scale(0)}to{transform:scale(1)}}#pgate .smile{stroke-dasharray:70;stroke-dashoffset:70;animation:pgdraw .5s .4s ease-out forwards}#pgate .frown{stroke-dasharray:70;stroke-dashoffset:70;animation:pgdraw .5s .4s ease-out forwards}@keyframes pgdraw{to{stroke-dashoffset:0}}#pgate .eye{transform-box:fill-box;transform-origin:center;animation:pgblink 3s 1s infinite}@keyframes pgblink{0%,92%,100%{transform:scaleY(1)}96%{transform:scaleY(.1)}}#pgate .badge{transform-box:fill-box;transform-origin:center;animation:pgpop .4s .7s cubic-bezier(.2,1.6,.4,1) both}#pgate .cf{opacity:0;transform-box:fill-box;transform-origin:center;animation:pgcf 1.2s .5s ease-out both}@keyframes pgcf{0%{opacity:0;transform:translate(0,0) scale(.3)}20%{opacity:1}100%{opacity:0;transform:translate(var(--x),var(--y)) scale(1) rotate(180deg)}}#pgate .sadg{transform-box:fill-box;transform-origin:center;animation:pgpop .5s cubic-bezier(.2,1.6,.4,1) both,pgshake .6s .6s}@keyframes pgshake{0%,100%{transform:translateX(0)}20%{transform:translateX(-6px)}40%{transform:translateX(6px)}60%{transform:translateX(-4px)}80%{transform:translateX(4px)}}#pgate .tear{opacity:0;animation:pgtear 1.6s 1s ease-in infinite}@keyframes pgtear{0%{transform:translateY(0);opacity:0}15%{opacity:1}100%{transform:translateY(26px);opacity:0}}@media(prefers-reduced-motion:reduce){#pgate *{animation:none!important}#pgate .smile,#pgate .frown{stroke-dashoffset:0}}'+'</style>');
 const art={wait:'<svg viewBox="0 0 120 120" width="120" height="120" aria-hidden="true"><circle class="rg" cx="60" cy="60" r="30"/><circle class="rg r2" cx="60" cy="60" r="30"/><rect x="45" y="28" width="30" height="62" rx="7" fill="#0B4A2E"/><rect x="49" y="35" width="22" height="42" rx="2" fill="#fff"/><circle cx="60" cy="83" r="2.6" fill="#fff"/><circle class="pd" cx="52" cy="56" r="3"/><circle class="pd" cx="58" cy="56" r="3"/><circle class="pd" cx="64" cy="56" r="3"/><circle class="pd" cx="70" cy="56" r="3"/></svg>',ok:'<svg viewBox="0 0 120 120" width="120" height="120" aria-hidden="true"><rect class="cf" x="58" y="58" width="6" height="6" rx="1.5" fill="#F58E20" style="--x:-52px;--y:-44px"/><rect class="cf" x="58" y="58" width="6" height="6" rx="1.5" fill="#facc15" style="--x:50px;--y:-48px"/><rect class="cf" x="58" y="58" width="6" height="6" rx="1.5" fill="#22c55e" style="--x:-58px;--y:6px"/><rect class="cf" x="58" y="58" width="6" height="6" rx="1.5" fill="#F58E20" style="--x:58px;--y:12px"/><rect class="cf" x="58" y="58" width="6" height="6" rx="1.5" fill="#16a34a" style="--x:-30px;--y:-60px"/><rect class="cf" x="58" y="58" width="6" height="6" rx="1.5" fill="#facc15" style="--x:30px;--y:-62px"/><rect class="cf" x="58" y="58" width="6" height="6" rx="1.5" fill="#22c55e" style="--x:-40px;--y:50px"/><rect class="cf" x="58" y="58" width="6" height="6" rx="1.5" fill="#F58E20" style="--x:36px;--y:52px"/><circle class="okc" cx="60" cy="60" r="44" fill="#16A34A"/><ellipse class="eye" cx="46" cy="52" rx="5" ry="6" fill="#fff"/><ellipse class="eye" cx="74" cy="52" rx="5" ry="6" fill="#fff"/><path class="smile" d="M38 66 Q60 94 82 66" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round"/><g class="badge"><circle cx="94" cy="94" r="14" fill="#fff"/><path d="M87 94l5 5 9-10" fill="none" stroke="#16A34A" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></g></svg>',cancel:'<svg viewBox="0 0 120 120" width="120" height="120" aria-hidden="true"><g class="sadg"><circle cx="60" cy="60" r="44" fill="#DC2626"/><ellipse class="eye" cx="46" cy="52" rx="5" ry="6" fill="#fff"/><ellipse class="eye" cx="74" cy="52" rx="5" ry="6" fill="#fff"/><path d="M36 48 L54 41" stroke="#fff" stroke-width="4" stroke-linecap="round"/><path d="M84 48 L66 41" stroke="#fff" stroke-width="4" stroke-linecap="round"/><path class="frown" d="M40 84 Q60 62 80 84" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round"/><path class="tear" d="M41 62 q-6 9 0 13 q6 -4 0 -13z" fill="#BFE3FF"/></g></svg>'}[kind==="fail"?"cancel":kind];
 el.innerHTML='<div class="pgp pgst '+kind+'" role="status" aria-live="polite"><div class="pga">'+art+'</div><h2>'+esc(title)+'</h2><p class="pgs">'+esc(sub||"")+'</p>'+(retry?'<button type="button" class="pgb" id="pgretry">Try again</button>':"")+'</div>';
 const b=el.querySelector("#pgretry");if(b)b.onclick=retry}
async function planOptions(){const pl=await sb.from("shop_plans").select("*").eq("active",true).order("sort_order");
 if(pl.error||!(pl.data||[]).length){const none=[];none.err=pl.error?pl.error.message:"no active plans";console.warn("SOKO plans: "+none.err);return none}return pl.data}
async function planNeeded(u){
 if(u){try{const pe=await sb.from("shop_payments").select("id").eq("user_id",u.id).eq("status","pending").gte("created_at",new Date(Date.now()-36e5).toISOString()).limit(3);for(const x of pe.data||[])await sb.functions.invoke(PAY_FN,{body:{action:"status",payment_id:x.id}})}catch(e){}}
 if(u){const have=await sb.from("shop_payments").select("id").eq("user_id",u.id).eq("status","paid").is("shop_id",null).eq("kind","open").limit(1);
  if(have.error)console.warn("SOKO plans: run supabase-shop-plans.sql ("+have.error.message+")");else if((have.data||[]).length)return null}
 const pl=await sb.from("shop_plans").select("*").eq("active",true).order("sort_order");
 if(pl.error||!(pl.data||[]).length){const none=[];none.err=pl.error?pl.error.message:"no active plans";console.warn("SOKO plans: "+none.err+" (admin: run supabase-mpesa-fix.sql, then Save the packages in Settings > Payment Plans and tick Available to customers)");return none}
 return pl.data}
async function planGate(o){o=o||{};
 if(!sb||document.getElementById("pgate"))return;
 const onPage=/openshop(\.html)?$/.test(location.pathname);if(!onPage&&!o.go)return;
 const u=await user();
 const plans=o.plans||await planOptions();
 let sel=null;
 if(!document.getElementById("pgcss"))document.head.insertAdjacentHTML("beforeend",'<style id="pgcss">#pgate{position:fixed;inset:0;z-index:80;background:rgba(7,40,25,.78);overflow:auto;padding:24px 14px;display:grid;place-items:start center}#pgate .pgp{background:#fff;color:#17201b;border-radius:20px;max-width:980px;width:100%;padding:26px 24px;box-shadow:0 20px 60px rgba(0,0,0,.35)}#pgate h2{margin:0 0 4px;font-size:24px}#pgate .pgs{color:#5b665f;margin:0 0 18px}#pgate .pgg{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:14px}#pgate .pgc{border:2px solid #dfe5e0;border-radius:16px;padding:18px;text-align:left;background:#fff;cursor:pointer;font:inherit;color:inherit;display:grid;gap:8px;align-content:start}#pgate .pgc:hover{border-color:#10613A}#pgate .pgc.on{border-color:#F58E20;box-shadow:0 0 0 3px rgba(245,142,32,.25)}#pgate .pgc b{font-size:18px}#pgate .pgc .pr{font-size:28px;font-weight:800;color:#0B4A2E}#pgate .pgc ul{margin:0;padding:0;list-style:none;display:grid;gap:6px;font-size:14px}#pgate .pgc li:before{content:"✓ ";color:#10613A;font-weight:800}#pgate .pgf{margin-top:18px;display:grid;gap:10px;max-width:440px}#pgate .pgf input[type=tel]{width:100%;padding:12px;border:1.5px solid #cfd6d0;border-radius:10px;font:inherit}#pgate .pgk{display:flex;gap:10px;align-items:flex-start;font-size:14px;line-height:1.4;background:#f3f8f4;border-radius:10px;padding:10px 12px}#pgate .pgk input{width:18px;height:18px;margin-top:2px;flex:none}#pgate .pgb{background:#F58E20;color:#fff;font-weight:800;border:0;border-radius:12px;padding:13px 20px;cursor:pointer;font-size:16px}#pgate .pgb:disabled{opacity:.5;cursor:default}#pgate .pgm{min-height:22px;font-weight:600}#pgate .pgm.e{color:#c0392b}#pgate .pgx{color:#5b665f;text-decoration:underline;margin-top:6px;display:inline-block}</style>');
 const el=document.createElement("div");el.id="pgate";el.setAttribute("role","dialog");el.setAttribute("aria-modal","true");el.setAttribute("aria-label","Choose a shop plan");document.body.appendChild(el);document.body.style.overflow="hidden";
 const close=()=>{el.remove();document.body.style.overflow=""};
 const per=x=>+x.duration_days?"every "+x.duration_days+" days":"one-time payment";
 const paint=(msg,err,busy)=>{if(!plans.length){el.innerHTML='<div class="pgp"><h2>Shop packages are not available</h2><p class="pgs">There are no shop packages to choose from right now. Please check back soon.</p><a class="pgx" href="'+esc(o.back||"index.html")+'">Go back</a></div>';return}const p=plans.find(x=>x.id===sel),renew=p&&+p.duration_days>0;
  el.innerHTML=`<div class="pgp"><h2>Choose a plan to open your shop</h2><p class="pgs">Pay with M-Pesa and start selling right away.</p>
  <div class="pgg">${plans.map(x=>`<button type="button" class="pgc ${x.id===sel?"on":""}" data-pl="${esc(x.id)}" ${busy?"disabled":""}><b>${esc(x.name)}</b><span class="pr">${KESF(x.price)}</span><span style="color:#5b665f;font-size:13px">${per(x)}</span><ul>${(Array.isArray(x.features)?x.features:[]).map(f=>`<li>${esc(f)}</li>`).join("")}</ul></button>`).join("")}</div>
  <div class="pgf"><label style="display:grid;gap:6px;font-weight:600">M-Pesa phone number<input id="pgph" type="tel" inputmode="tel" placeholder="0712 345 678" autocomplete="tel" value="${esc(el.dataset.ph||"")}" ${busy?"disabled":""}></label>
  ${renew?`<label class="pgk"><input type="checkbox" id="pgar" ${el.dataset.ar==="1"?"checked":""} ${busy?"disabled":""}><span><b>Renew automatically</b> every ${p.duration_days} days, taking ${KESF(p.price)} from my SOKO Smart wallet. I can turn this off any time.</span></label>`:""}
  <button type="button" class="pgb" id="pgpay" ${p&&!busy?"":"disabled"}>${p?"Pay "+KESF(p.price)+" with M-Pesa":"Choose a plan first"}</button><div class="pgm ${err?"e":""}" role="status">${esc(msg||"")}</div>${busy?"":`<a class="pgx" href="${esc(o.back||"index.html")}">Not now, go back</a>`}</div></div>`};
 el.dataset.ph=(u&&u.user_metadata&&u.user_metadata.phone)||"";el.dataset.ar="0";paint();
 const keep=()=>{const v=el.querySelector("#pgph"),a=el.querySelector("#pgar");if(v)el.dataset.ph=v.value.replace(/[^\d+]/g,"");if(a)el.dataset.ar=a.checked?"1":"0"};
 const status=async id=>{try{const r=await sb.functions.invoke(PAY_FN,{body:{action:"status",payment_id:id}});if(r.data&&r.data.status){if(r.data.status==="pending")console.info("payment check",r.data);return r.data}}catch(x){}
  const q=await sb.from("shop_payments").select("status,mpesa_receipt,result_desc").eq("id",id).maybeSingle();return q.data||{status:"pending"}};
 el.addEventListener("click",async e=>{
  const c=e.target.closest("[data-pl]");if(c){keep();sel=c.dataset.pl;paint();return}
  if(!e.target.closest("#pgpay")||!sel)return;
  keep();const phone=el.dataset.ph.trim(),p=plans.find(x=>x.id===sel),ar=el.dataset.ar==="1"&&+p.duration_days>0;
  if(!/^(\+?254|0)[17]\d{8}$/.test(phone.replace(/\s+/g,""))){paint("Enter a valid Safaricom number, e.g. 0712 345 678.",true);return}

  if(el._pay)return;el._pay=1; /* one payment request at a time: a double tap must not send two */
  const again=()=>{el._pay=0;paint()};
  const au=await needUser("Log in or create an account to pay for your shop plan.");if(!au){el._pay=0;return}
  paint("Sending the request to your phone…",false,true);
  const since=new Date(Date.now()-5000).toISOString();
  let r;try{r=await sb.functions.invoke(PAY_FN,{body:{plan_id:sel,phone:msisdn(phone),auto_renew:ar,application_id:o.application||null}})}catch(x){r={error:x}}
  let d=r&&r.data;if(r&&r.error&&!d){try{d=await r.error.context.json()}catch(x){}}
  console.error("mpesa-stk",r,d);if(d&&d.ok===false){payState(el,"fail","We could not start the payment",d.error||d.message||(r&&r.error&&r.error.message)||"Please try again.",again);return}
  let pid=d&&(d.payment_id||d.id||(d.payment&&d.payment.id));
  /* the prompt can already be on the phone even if the reply looked unusual: find the payment just created */
  if(!pid){try{const q=await sb.from("shop_payments").select("id").eq("user_id",au.id).gte("created_at",since).order("created_at",{ascending:false}).limit(1);pid=q.data&&q.data[0]&&q.data[0].id}catch(x){}}
  if(!pid){console.error("mpesa-stk (no payment id)",r,d);payState(el,"fail","We could not start the payment",(d&&(d.error||d.message))||(r&&r.error&&r.error.message)||(d&&typeof d==="object"?"The payment service sent an unexpected reply ("+Object.keys(d).join(", ")+"). The payment function on Supabase sent a reply this page does not understand.":"The payment service did not respond. Check that the "+PAY_FN+" function is deployed."),again);return}
  payState(el,"wait","Enter your M-Pesa PIN to complete payment",(d&&d.amount?"A prompt for "+KESF(d.amount)+" has been sent to your phone."+(+d.amount!==+p.price?" Note: the package price is "+KESF(p.price)+", so the payment function is not using the admin price. Tell the site admin.":"")+" Waiting for confirmation…":"A prompt has been sent to your phone. Waiting for confirmation…"));
  let res={status:"timeout"},last=null;
  for(let i=0;i<60;i++){await new Promise(z=>setTimeout(z,4000));const s=await status(pid);last=s;if(s.status&&s.status!=="pending"){res=s;break}}
  const why=String(res.result_desc||"");
  if(res.status==="paid"){payState(el,"ok","Payment successful",(res.mpesa_receipt?"M-Pesa receipt "+res.mpesa_receipt+". ":"")+(ar?"Your plan will renew automatically from your wallet. ":"")+(res.approved?"Your shop has been approved and is now live. Taking you to your Shop Manager…":"Your shop is being approved. Taking you to your Shop Manager…"));setTimeout(()=>{close();if(o.go)location.href=o.go;else toast("Payment received. You can open your shop now.")},2600)}
  else if(res.status==="cancelled"||(res.status==="failed"&&/cancel/i.test(why)))payState(el,"cancel","Payment has been cancelled","You cancelled the request on your phone. Nothing was charged.",again);
  else if(res.status==="failed")payState(el,"fail","The payment did not go through",why||"Please try again.",again);
  else payState(el,"fail","We have not received the payment yet","If you paid, wait a minute and tap Try again to check. "+(last&&last.note?last.note+" ":"")+(last&&last.safaricom?"Safaricom says: "+String(last.safaricom.errorMessage||last.safaricom.ResultDesc||JSON.stringify(last.safaricom))+". ":"")+"Your shop is saved and will be approved as soon as the payment is confirmed.",again)});
 }


/* ---------- shop owners: see the plan, turn automatic renewal on or off ---------- */
async function planPanel(){
 if(!sb||!/shopmanager(\.html)?$/.test(location.pathname)||document.getElementById("plpanel"))return;
 const u=await user();if(!u)return;
 const r=await sb.from("shops").select("id,name,plan,plan_expires_at,auto_renew,renew_note").eq("owner_id",u.id);
 if(r.error)return;const shops=(r.data||[]).filter(x=>x.plan);if(!shops.length)return;
 const pl=await sb.from("shop_plans").select("id,name,price,duration_days"),P={};(pl.data||[]).forEach(x=>P[x.id]=x);
 let bal=null;try{const w=await sb.rpc("wallet_ensure",{p_shop_id:null});if(!w.error&&w.data)bal=+w.data.balance}catch(x){}
 const host=document.querySelector("main")||document.body.firstElementChild;
 const sec=document.createElement("section");sec.id="plpanel";sec.className="w";host.before(sec);
 const note={insufficient_funds:"Your wallet balance was too low to renew. Top up your wallet.",wallet_missing:"Open your wallet first so it can be created.",wallet_unavailable:"The wallet is not available right now.",wallet_ledger_unavailable:"The wallet could not be charged right now. Please contact support."};
 const paint=()=>{sec.innerHTML=`<div style="background:#fff;border:1px solid #dfe5e0;border-radius:16px;padding:16px 18px;margin:14px 0;display:grid;gap:12px"><div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap"><b style="font-size:17px">Your shop plan</b><span class="m">Wallet balance: <b>${bal==null?"unavailable":KESF(bal)}</b> · <a href="wallet.html">Top up wallet</a></span></div>
  ${shops.map(s=>{const p=P[s.plan]||{name:s.plan,price:0,duration_days:0},per=+p.duration_days>0,exp=s.plan_expires_at?new Date(s.plan_expires_at):null,late=exp&&exp<new Date();
  return `<div style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;border-top:1px solid #eef2ee;padding-top:10px"><div><b>${esc(s.name)}</b> · ${esc(p.name)} plan${per?` (${KESF(p.price)} every ${p.duration_days} days)`:" (paid once)"}<div class="m">${exp?(late?"Expired on ":"Active until ")+exp.toLocaleDateString("en-KE",{day:"numeric",month:"short",year:"numeric"}):"No expiry date"}</div>${s.renew_note?`<div style="color:#c0392b;font-weight:600">${esc(note[s.renew_note]||s.renew_note)}</div>`:""}</div>
  ${per?`<div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap"><label style="display:flex;gap:8px;align-items:center;font-weight:600"><input type="checkbox" data-ar="${esc(s.id)}" style="width:18px;height:18px" ${s.auto_renew?"checked":""}> Renew automatically from my wallet</label><button class="btn" data-rn="${esc(s.id)}" type="button">Renew now</button></div>`:""}</div>`}).join("")}<div class="m" id="plmsg" role="status"></div></div>`};
 paint();
 sec.addEventListener("change",async e=>{const c=e.target.closest("[data-ar]");if(!c)return;const on=c.checked;
  const {error}=await sb.rpc("set_shop_auto_renew",{p_shop:c.dataset.ar,p_on:on});
  if(error){c.checked=!on;toast(error.message);return}
  shops.find(x=>String(x.id)===c.dataset.ar).auto_renew=on;toast(on?"Automatic renewal is on.":"Automatic renewal is off.")});
 sec.addEventListener("click",async e=>{const b=e.target.closest("[data-rn]");if(!b)return;b.disabled=true;
  const {data,error}=await sb.rpc("renew_shop_now",{p_shop:b.dataset.rn});b.disabled=false;
  if(error){toast(error.message);return}
  if(data!=="ok"){toast(note[data]||"Could not renew: "+data);return}
  const f=await sb.from("shops").select("id,plan_expires_at,renew_note").eq("id",b.dataset.rn).maybeSingle();const s=shops.find(x=>String(x.id)===b.dataset.rn);if(f.data&&s){s.plan_expires_at=f.data.plan_expires_at;s.renew_note=null}
  try{const w=await sb.rpc("wallet_ensure",{p_shop_id:null});if(!w.error&&w.data)bal=+w.data.balance}catch(x){}
  paint();toast("Your plan has been renewed.")})}


/* ---------- wallet: deposit money with M-Pesa ---------- */
async function walletDeposit(){
 if(!sb||!/wallet(\.html)?$/.test(location.pathname)||document.getElementById("wdpanel"))return;
 const u=await user();if(!u)return;
 const host=document.querySelector("main")||document.body.firstElementChild;
 const sec=document.createElement("section");sec.id="wdpanel";sec.className="w";host.before(sec);
 let amt="",ph=(u.user_metadata&&u.user_metadata.phone)||"";
 const paint=(msg,err,busy)=>{sec.innerHTML=`<div style="background:#fff;border:1px solid #dfe5e0;border-radius:16px;padding:16px 18px;margin:14px 0;display:grid;gap:12px;max-width:560px"><b style="font-size:17px">Deposit with M-Pesa</b>
  <div style="display:flex;gap:8px;flex-wrap:wrap">${[500,1000,2000,5000].map(v=>`<button type="button" class="btn ${String(v)===amt?"p":""}" data-wa="${v}" ${busy?"disabled":""}>${KESF(v)}</button>`).join("")}</div>
  <label style="display:grid;gap:6px;font-weight:600">Amount (KES)<input id="wda" type="number" inputmode="numeric" min="10" max="150000" step="1" placeholder="e.g. 1500" value="${esc(amt)}" ${busy?"disabled":""}></label>
  <label style="display:grid;gap:6px;font-weight:600">M-Pesa phone number<input id="wdp" type="tel" inputmode="tel" placeholder="0712 345 678" autocomplete="tel" value="${esc(ph)}" ${busy?"disabled":""}></label>
  <button type="button" class="btn p" id="wdgo" ${busy?"disabled":""}>Deposit ${amt?KESF(amt):""} with M-Pesa</button><div class="m" role="status" style="min-height:20px;font-weight:600;${err?"color:#c0392b":""}">${esc(msg||"")}</div></div>`};
 paint();
 const keep=()=>{const a=sec.querySelector("#wda"),p=sec.querySelector("#wdp");if(a)amt=a.value;if(p)ph=p.value.replace(/[^\d+]/g,"")};
 const status=async id=>{try{const r=await sb.functions.invoke("mpesa-status",{body:{payment_id:id,type:"deposit"}});if(r.data&&r.data.status)return r.data}catch(x){}
  const q=await sb.from("wallet_deposits").select("status,mpesa_receipt,result_desc,credited,credit_note").eq("id",id).maybeSingle();return q.data||{status:"pending"}};
 sec.addEventListener("input",e=>{if(e.target.id==="wda"){amt=e.target.value;const b=sec.querySelector("#wdgo");if(b)b.textContent="Deposit "+(amt?KESF(amt):"")+" with M-Pesa"}});
 sec.addEventListener("click",async e=>{
  const c=e.target.closest("[data-wa]");if(c){keep();amt=c.dataset.wa;paint();return}
  if(!e.target.closest("#wdgo"))return;keep();const n=Math.round(+amt);
  if(!(n>=10&&n<=150000)){paint("Enter an amount between KES 10 and KES 150,000.",true);return}
  if(!/^(\+?254|0)[17]\d{8}$/.test(ph.replace(/\s+/g,""))){paint("Enter a valid Safaricom number, e.g. 0712 345 678.",true);return}
  paint("Sending the request to your phone…",false,true);
  try{await sb.rpc("wallet_ensure",{p_shop_id:null})}catch(x){}
  let r;try{r=await sb.functions.invoke("mpesa-deposit",{body:{amount:n,phone:msisdn(ph)}})}catch(x){r={error:x}}
  let d=r&&r.data;if(r&&r.error&&!d){try{d=await r.error.context.json()}catch(x){}}
  if(!d||!d.ok){console.error("mpesa-deposit",r,d);paint((d&&d.error)||(r&&r.error&&r.error.message)||"We could not start the deposit. Please try again.",true);return}
  paint("Check your phone and enter your M-Pesa PIN. Waiting for confirmation…",false,true);
  let res={status:"timeout"};
  for(let i=0;i<45;i++){await new Promise(z=>setTimeout(z,4000));const st=await status(d.payment_id);if(st.status&&st.status!=="pending"){res=st;break}}
  if(res.status==="paid"&&res.credited){paint(KESF(n)+" has been added to your wallet"+(res.mpesa_receipt?" (M-Pesa "+res.mpesa_receipt+")":"")+".");toast("Deposit received.");setTimeout(()=>location.reload(),2000)}
  else if(res.status==="paid")paint("Your payment was received"+(res.mpesa_receipt?" (M-Pesa "+res.mpesa_receipt+")":"")+" but your wallet could not be updated yet. We will add it shortly. Please contact support if it takes long.",true);
  else if(res.status==="cancelled")paint("The deposit was cancelled. You can try again.",true);
  else if(res.status==="failed")paint((res.result_desc||"The deposit did not go through")+". You can try again.",true);
  else paint("We have not received the payment yet. If you paid, wait a minute and reload this page.",true)})}

function shell(on){
 const here=location.pathname.split("/").pop()||"index.html",cur=here+location.search;
 $("#hd").innerHTML=`<div class="tbar"><div class="w"><ul id="tbl">${topHTML(HOME_DEF)}</ul><span class="hdl" id="hdl"></span></div></div><header><div class="w"><div class="top"><a class="logo" href="index.html" aria-label="SOKO Smart home"><img alt="SOKO Smart" src="logo.png"></a><form class="search" id="sf" role="search"><input id="q" type="search" placeholder="Search for products, shops, jobs and freelancers…" aria-label="Search"><button aria-label="Search">${ic("search",20)}</button></form>
 <div class="hbs"><div class="hb"><a class="ava" id="pfBtn" href="profile.html" aria-label="My profile" title="Log in to view your profile">${ic("user",22)}</a><div class="hbt"><small id="acS">Account</small><span><button class="lk" id="logBtn">Sign in</button><button class="lk" id="signBtn">Sign up</button></span></div></div>
 <button class="hb" id="bellBtn" aria-label="Notifications"><span class="hi">${ic("bell",24)}<em id="bN" hidden>0</em></span><div class="hbt"><small>Alerts</small></div></button>
 <a class="hb" href="profile.html#saved" aria-label="Wishlist"><span class="hi">${ic("heart",24)}<em id="wlN" hidden>0</em></span><div class="hbt"><small>Wishlist</small></div></a>
 <a class="hb" href="wallet.html" aria-label="Wallet"><span class="hi">${ic("wallet",24)}</span><div class="hbt"><small>Wallet</small></div></a>
 <button class="hb" id="cartBtn" aria-label="Cart"><span class="hi">${ic("cart",24)}<em id="cN" hidden>0</em></span><div class="hbt"><small>Cart</small></div></button></div></div>
 <nav id="mnav">${navHTML(cachedCfg(),on)}</nav></div></header>`;
 $("#ft").innerHTML=`<footer><div class="w"><div class="fg"><div class="fbr"><a class="logo wl" href="index.html" aria-label="SOKO Smart home"><img alt="SOKO Smart" src="logo.png"></a><p id="ftag">${esc(HOME_DEF.footer.tagline)}</p><div class="soc" id="soc"></div></div><div><h4>Shop</h4><a href="shop.html">All products</a><a href="shop.html?sort=latest">New arrivals</a><a href="shop.html?sort=popular">Best sellers</a><a href="shop.html?section=shops">Shops</a><a href="jobs.html">Jobs</a><a href="freelance.html">Freelance</a><a href="blog.html">Blog</a><a href="servicehub.html" id="ftsv" ${cachedCfg().services.navOn===false?"hidden":""}>${esc(cachedCfg().services.navLabel||"Services")}</a></div><div><h4>Account</h4><a href="profile.html">My Profile</a><a href="profile.html#jobs">Post a job</a><a href="freelance.html#talent">Hire a freelancer</a><a href="profile.html#freelance">My freelance work</a><a href="profile.html#free">List a free item</a><a href="openshop.html">Open a Shop</a><a href="shopmanager.html">Shop Manager</a></div><div><h4>Help &amp; Company</h4><a href="complaint.html">File a complaint</a><a href="#" data-support>Chat with the SOKO Smart Team</a><div id="fct"></div></div></div><div class="fg fx" id="fcols" hidden></div><div class="fbt"><span id="fcopy">© 2026 SOKO Smart. All prices in KSh.</span><span><a href="complaint.html">File a complaint</a> · Made for Kenya</span></div></div></footer>`;
 document.body.insertAdjacentHTML("beforeend",'<dialog id="dlg"><button class="x" id="dx" aria-label="Close">&times;</button><div id="dc"></div></dialog><div id="toast" role="status"></div>');
 $("#signBtn").onclick=signView;$("#sf").onsubmit=e=>{e.preventDefault();location.href="shop.html?q="+encodeURIComponent($("#q").value.trim())};
 const qq=new URLSearchParams(location.search).get("q");if(qq&&here==="shop.html")$("#q").value=qq;
 cartCount();who();if(sb)sb.auth.onAuthStateChange(()=>setTimeout(who,0));
 siteCfg().then(c=>{$("#mnav").innerHTML=navHTML(c,on);const fs=$("#ftsv");if(fs){fs.hidden=c.services.navOn===false;fs.textContent=String(c.services.navLabel||"").trim()||"Services"}$("#tbl").innerHTML=topHTML(c);$("#hdl").innerHTML=hlinks(c);$("#ftag").textContent=c.footer.tagline;$("#soc").innerHTML=(c.footer.socials||[]).filter(s=>s&&/^https?:\/\//i.test(s.url||"")).map(s=>{const k=socKey(s),n=s.name||SOCN[k];return `<a class="si" target="_blank" rel="noopener noreferrer" href="${esc(s.url)}" aria-label="${esc(n)}" title="${esc(n)}">${ic(k,20)}</a>`}).join("");applySite(c)});applyPage();idleGuard();planGate();planPanel();walletDeposit();if(sb&&!window.__pg){window.__pg=1;sb.auth.onAuthStateChange(ev=>{if(ev==="SIGNED_IN")setTimeout(()=>{planGate();planPanel();walletDeposit()},500)})}}

/* ---------- shared cards ---------- */
const loc=r=>[r.town,r.county].filter(Boolean).join(", ");
const stars=(v,n)=>{v=Number(v)||0;if(!v)return"";return `<div class="rt" title="${v.toFixed(1)} out of 5"><span class="st">${"★".repeat(Math.round(v))}${"☆".repeat(5-Math.round(v))}</span>${n?` <span class="m">(${n})</span>`:""}</div>`};
const VB='<svg viewBox="0 0 24 24" width="15" height="15" aria-label="Verified" role="img"><path fill="#3897F0" d="M12 1.8l2.6 1.9 3.2-.1 1 3 2.6 1.9-1 3.1 1 3.1-2.6 1.9-1 3-3.2-.1L12 22.2l-2.6-1.9-3.2.1-1-3-2.6-1.9 1-3.1-1-3.1 2.6-1.9 1-3 3.2.1z"/><path d="M8 12.2l2.6 2.6L16 9.4" fill="none" stroke="#fff" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"/></svg>';
/* who sells a product: the shop, or "Soko Smart" (always verified) when it was posted by the admin */
/* fills in the shop name (and blue tick) on cards that only know the shop id */
const SHN={};let shT;
function fillShops(){clearTimeout(shT);shT=setTimeout(async()=>{const els=[...document.querySelectorAll(".shn[data-sid]")];if(!els.length||!sb)return;
 const ids=[...new Set(els.map(e=>e.dataset.sid).filter(i=>!(i in SHN)))];
 if(ids.length){try{const {data}=await sb.from("shops").select("id,name,seller_verified").in("id",ids);(data||[]).forEach(x=>SHN[String(x.id)]=x)}catch(e){}ids.forEach(i=>{if(!(i in SHN))SHN[i]=null})}
 els.forEach(e=>{const x=SHN[e.dataset.sid];e.removeAttribute("data-sid");if(!x||!x.name){e.remove();return}e.querySelector("span").textContent=x.name;if(x.seller_verified)e.insertAdjacentHTML("beforeend",`<i class="vbd" title="Verified">${VB}</i>`)})},60)}
const soldBy=r=>{const nm=String(r.shop_name||r._shop||"").trim();if(/^soko\s*smart$/i.test(nm)||(!nm&&!r.shop_id))return{name:"Soko Smart",ver:true,soko:true};return{name:nm,ver:!!r.seller_verified}};
const pcard=(r,s,col="title",bdg="")=>{const k=s+":"+r.id;RECS[k]={...r,_s:s};const href=`product.html?s=${s}&id=${encodeURIComponent(r.id)}`,fav=FAV.has(k),old=r.old_price&&r.price&&+r.old_price>+r.price?+r.old_price:0,pct=old?Math.round((1-r.price/old)*100):0,
 b=pct?`<span class="bdg r">-${pct}%</span>`:bdg?`<span class="bdg">${esc(bdg)}</span>`:r.is_featured?'<span class="bdg">Featured</span>':"",prod=s==="products",sb2=prod?soldBy(r):{name:"",ver:!!r.seller_verified};
 return `<div class="card pc"><a class="img" href="${href}" tabindex="-1" aria-hidden="true">${r.cover_url?`<img loading="lazy" alt="" src="${esc(r.cover_url)}">`:ic(s==="shops"?"home":"box",56)}${b}</a><button class="fav ${fav?"on":""}" data-f="${esc(k)}" aria-label="Save to wishlist">${ic("heart",18,fav)}</button><a class="cb" href="${href}"><h3>${esc(r[col])}</h3>${stars(r.rating,r.reviews_count||r.review_count)}${s==="shops"?"":`<div class="price">${r.price!=null?fmt(r.price):"Contact for price"}${old?` <s class="was">${fmt(old)}</s>`:""}</div>`}${prod&&sb2.name?`<div class="shn">${sb2.soko?'<img class="sml" alt="" src="logo.png">':ic("home",14)}<span>${esc(sb2.name)}</span>${sb2.ver?`<i class="vbd" title="Verified">${VB}</i>`:""}</div>`:prod&&r.shop_id?(fillShops(),`<div class="shn" data-sid="${esc(r.shop_id)}">${ic("home",14)}<span></span></div>`):!prod&&sb2.ver?'<div class="m ver">✓ Verified</div>':""}<div class="m lc">${ic("pin",13)} ${esc(loc(r)||"Kenya")}</div></a>${prod?`<div class="pca"><button class="btn ic" data-chat="${esc(k)}" aria-label="Chat Seller" title="Chat Seller">${ic("msg",18)}</button><button class="btn ic" data-c="${esc(k)}" aria-label="Add to Catalogue" title="Add to Catalogue">${ic("cart",18)}</button><button class="btn p" data-buy="${esc(k)}">Checkout Now</button></div>`:""}</div>`};
const salTxt=r=>{const a=r.salary_min,b=r.salary_max;if(a!=null&&b!=null&&a!==b)return fmt(a)+" – "+Number(b).toLocaleString("en-KE");if(a!=null||b!=null)return fmt(a??b);if(r.salary_negotiable)return"Negotiable";return r.price!=null?fmt(r.price):""};
const jcard=r=>`<a class="job" href="jobs.html?id=${encodeURIComponent(r.id)}"><div class="av">${r.company_logo_url?`<img alt="" loading="lazy" src="${esc(r.company_logo_url)}">`:ic("briefcase",24)}</div><div><strong>${esc(r.title)}</strong>${r.seller_verified?' <span class="ver" title="Verified employer">✓</span>':""}<div class="m">${esc([r.company,loc(r)].filter(Boolean).join(" · "))}</div><div class="m">${esc([r.employment_type,r.work_mode,r.experience_level].filter(Boolean).join(" · "))}</div>${salTxt(r)?`<div class="price" style="font-size:14px">${esc(salTxt(r))}</div>`:""}<div>${r.is_urgent?'<span class="tag urg">Urgently hiring</span> ':""}${r.is_featured?'<span class="tag">Featured</span>':""}</div></div></a>`;
/* ---------- notifications (bell in the header) ---------- */
let NF=[],NFch=null,NFuid=null;
const ago=d=>{const t=(Date.now()-new Date(d))/1000;if(t<60)return"Just now";if(t<3600)return Math.floor(t/60)+" min ago";if(t<86400)return Math.floor(t/3600)+" h ago";return new Date(d).toLocaleDateString("en-KE",{day:"numeric",month:"short"})};
function notifPaint(){const n=NF.filter(x=>!x.read).length,e=$("#bN");if(e){e.textContent=n>99?"99+":n;e.hidden=!n}}
async function notifLoad(u){
 if(!u||!sb){NF=[];if(NFch){sb.removeChannel(NFch);NFch=null}NFuid=null;notifPaint();return}
 const {data,error}=await sb.from("notifications").select("*").eq("user_id",u.id).order("created_at",{ascending:false}).limit(30);
 if(!error){NF=data||[];notifPaint()}
 if(NFuid!==u.id){if(NFch)sb.removeChannel(NFch);NFuid=u.id;
  NFch=sb.channel("nf-"+u.id).on("postgres_changes",{event:"INSERT",schema:"public",table:"notifications",filter:"user_id=eq."+u.id},p=>{NF.unshift(p.new);notifPaint();toast(p.new.title)}).subscribe()}}
function notifView(){
 openD(`<h3>Notifications</h3>${NF.length?`<div class="nfl">${NF.map(n=>`<a class="nfi ${n.read?"":"un"}" href="${esc(safeUrl(n.link||"#"))}"><b>${esc(n.title)}</b>${n.body?`<span>${esc(n.body)}</span>`:""}<small>${ago(n.created_at)}</small></a>`).join("")}</div><p style="margin:12px 0 0"><button class="btn s" data-support>Message the SOKO Smart Team</button></p>`:'<div class="empty">No notifications yet. We will tell you here when an order changes, an ad is reviewed or we reply to a complaint.</div>'}`);
 const un=NF.filter(n=>!n.read).map(n=>n.id);
 if(un.length){NF.forEach(n=>n.read=true);notifPaint();sb.from("notifications").update({read:true}).in("id",un).then(()=>{})}}
document.addEventListener("click",e=>{
 if(e.target.closest("#bellBtn")){if(!CURU){needLogin("Log in or create an account to see your notifications.");return}notifView();return}
 const s=e.target.closest("[data-support]");if(s){e.preventDefault();if($("#dlg").open)$("#dlg").close();if(window.SokoChat)SokoChat.support();else toast("Chat is still loading, please try again")}});

document.addEventListener("click",e=>{const s=e.target.closest("[data-soon]");if(s){e.preventDefault();toast("This link is coming soon")}});


/* ===== Chat ===== */
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

/* ===== Ads ===== */
/* SOKO Smart ads – pop-up engine for the storefront + the campaign builder used by
   Shop Manager (sellers) and the admin (house ads). Needs the global `sb` (Supabase client). */
(()=>{
if(window.SokoAds)return;
const DB=()=>typeof sb!=="undefined"?sb:null;
const E=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const safe=u=>{u=String(u||"").trim();return /^(https?:\/\/|[a-z0-9_\-./?=&%#]+$)/i.test(u)?u:"#"};
const K=n=>"KSh "+Number(n||0).toLocaleString("en-KE");
const N=n=>Number(n||0).toLocaleString("en-KE");
const say=(t,ty)=>typeof toast==="function"?toast(t,ty):alert(t);

const FORMATS={popup:{n:"Pop-up card",d:"A centred card over the page. Gets the most attention."},slide:{n:"Corner slide-in",d:"Slides up in the bottom-left corner. Gentler on visitors."},banner:{n:"Bottom banner",d:"A slim bar along the bottom of the screen."}};
const THEMES={green:["Forest green","#0B4A2E","#14633F"],orange:["Sunset orange","#F58E20","#D9740A"],light:["Soft cream","#FFF3E3","#FDE3DC"]};
const CTAS=["Shop now","Learn more","View offer","Order now","Contact us","Visit shop","See more"];
const PAGES={home:"Homepage",shop:"Shop and search results",product:"Product and shop pages",jobs:"Jobs page"};
const OBJ={shop:["Visit my shop","Send people to your shop page"],product:["Promote a product","Send people to one of your products"],link:["Custom link","Send people to any page or web address"]};
const AUD={all:"Everyone",members:"Logged-in members only",guests:"Visitors who are not logged in"};
const DEFC={enabled:true,cpm:50,cpc:5,min_budget:200,max_per_session:2,first_delay:8,min_gap:60,scroll_pct:25};

const ANIN={default:"Default pop",fade:"Fade in",up:"Slide up",down:"Slide down",left:"Slide in from the left",right:"Slide in from the right",zoom:"Zoom in",bounce:"Bounce",flip:"Flip",none:"No animation"};
const ANOUT={default:"Default",fade:"Fade out",down:"Slide down",up:"Slide up",left:"Slide out to the left",right:"Slide out to the right",zoom:"Zoom out",none:"Disappear instantly"};
const isVideo=u=>/\.(mp4|webm|mov|m4v|ogv)(\?|#|$)/i.test(String(u||""));
const PIN='<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s7-6.2 7-11a7 7 0 0 0-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>';
const SHOPI='<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 9l1.5-5h15L21 9"/><path d="M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0"/><path d="M5 12v8h14v-8"/></svg>';
const ICON='<svg viewBox="0 0 24 24" width="38" height="38" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 9h18l-2 11H5z"/><path d="M8 9l3-5M16 9l-3-5"/></svg>';
const ARROW='<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

/* ---------------------------------------------------------------- styles */
function css(){if(document.getElementById("ad-css"))return;const s=document.createElement("style");s.id="ad-css";s.textContent=`
.adov{position:fixed;inset:0;z-index:80;display:grid;place-items:center;padding:16px;background:rgba(11,20,16,.55);-webkit-backdrop-filter:blur(3px);backdrop-filter:blur(3px);opacity:0;transition:opacity .25s}
.adov.in{opacity:1}
.adw-slide{position:fixed;z-index:70;left:16px;bottom:calc(16px + env(safe-area-inset-bottom,0px));width:min(340px,calc(100vw - 32px));transform:translateY(30px);opacity:0;transition:transform .4s cubic-bezier(.2,.8,.2,1),opacity .35s}
.adw-slide.in{transform:none;opacity:1}
.adw-banner{position:fixed;z-index:70;left:0;right:0;bottom:0;padding:0 0 calc(12px + env(safe-area-inset-bottom,0px)) 12px;transform:translateY(110%);transition:transform .4s cubic-bezier(.2,.8,.2,1);pointer-events:none}
.adw-banner.in{transform:none}
.adw-banner .adin{width:min(880px,calc(100vw - 92px));pointer-events:auto}
.adc{position:relative;background:#fff;color:#1d1a16;border-radius:20px;overflow:hidden;box-shadow:0 24px 70px rgba(0,0,0,.35),0 2px 8px rgba(0,0,0,.12);font:14px/1.45 "Segoe UI",system-ui,sans-serif;text-align:left}
.adc *{box-sizing:border-box}
.adov .adc{width:min(420px,100%);transform:translateY(20px) scale(.95);transition:transform .4s cubic-bezier(.2,.9,.3,1.15)}
.adov.in .adc{transform:none}
.adm{position:relative;aspect-ratio:16/9;display:grid;place-items:center;overflow:hidden;background:var(--ab,#0B4A2E)}
.adm img{width:100%;height:100%;object-fit:cover;display:block}
.adm.noimg{background:linear-gradient(135deg,var(--ab,#0B4A2E),var(--ab2,#14633F));color:#fff}
.adm.noimg::before,.adm.noimg::after{content:"";position:absolute;border-radius:50%;background:rgba(255,255,255,.1)}
.adm.noimg::before{width:150px;height:150px;right:-40px;top:-50px}
.adm.noimg::after{width:90px;height:90px;left:-24px;bottom:-34px}
.adi{position:relative;width:76px;height:76px;border-radius:50%;background:rgba(255,255,255,.2);display:grid;place-items:center}
.t-light .adm.noimg{color:#0B4A2E}.t-light .adi{background:rgba(11,74,46,.1)}.t-light .adm.noimg::before,.t-light .adm.noimg::after{background:rgba(245,142,32,.18)}
.adb{padding:16px 18px 18px;display:grid;gap:6px}
.adt{min-width:0}
.adsp{display:block;font-size:11px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:#7a7066;margin-bottom:3px}
.adb h3{margin:0;font-size:21px;line-height:1.2;letter-spacing:-.01em;color:#1d1a16}
.adb p{margin:6px 0 0;color:#5b534b}
.ada{display:grid;gap:2px;justify-items:stretch}
.adcta{display:flex;justify-content:center;align-items:center;gap:7px;margin-top:8px;background:#F58E20;color:#fff!important;font-weight:800;border-radius:12px;padding:12px 16px;text-decoration:none!important;box-shadow:0 6px 16px rgba(245,142,32,.4);transition:transform .15s,background .15s}
.adcta:hover{background:#D9740A;transform:translateY(-1px)}
.adno{border:0;background:none;color:#8a8076;font:inherit;font-size:13px;padding:6px;cursor:pointer;text-decoration:underline}
.adx{position:absolute;top:10px;right:10px;z-index:2;width:32px;height:32px;border-radius:50%;border:0;background:rgba(0,0,0,.55);color:#fff;font-size:22px;line-height:1;cursor:pointer;display:grid;place-items:center;padding:0}
.adx:hover{background:rgba(0,0,0,.75)}
.adx:focus-visible,.adcta:focus-visible,.adno:focus-visible{outline:3px solid #F58E20;outline-offset:2px}
.adc.f-slide{border-radius:18px}.adc.f-slide .adm{aspect-ratio:2/1}.adc.f-slide .adb h3{font-size:18px}.adc.f-slide .adb{padding:13px 15px 14px}
.adc.f-banner{display:flex;align-items:stretch;border-radius:16px}
.adc.f-banner .adm{width:104px;aspect-ratio:auto;flex:none}.adc.f-banner .adi{width:52px;height:52px}.adc.f-banner .adi svg{width:26px;height:26px}
.adc.f-banner .adb{flex:1;display:flex;align-items:center;gap:14px;padding:10px 46px 10px 14px;min-width:0}
.adc.f-banner .adt{flex:1}.adc.f-banner h3{font-size:16px}.adc.f-banner p{margin:2px 0 0;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.adc.f-banner .ada{flex:none}.adc.f-banner .adcta{margin-top:0;padding:9px 16px;white-space:nowrap}.adc.f-banner .adno{display:none}
.adc.f-banner .adx{top:50%;transform:translateY(-50%);right:10px}
@media(max-width:600px){
 .adw-slide{left:10px;right:10px;width:auto}
 .adc.f-banner .adm,.adc.f-banner p{display:none}.adc.f-banner .adb{padding:10px 44px 10px 14px}
}
.adstage{background:#ece7de;border-radius:14px;padding:16px;display:grid;place-items:center;overflow:hidden}
.adstage .adc{width:100%;max-width:400px;box-shadow:0 10px 30px rgba(0,0,0,.2)}
.adstage .adc.f-banner{max-width:100%}
/* campaign builder */
#adw{border:0;border-radius:18px;padding:0;width:min(940px,calc(100% - 20px));max-width:none;max-height:92vh;overflow:hidden;background:#fff;color:#1d1a16;font:14px/1.45 "Segoe UI",system-ui,sans-serif}
#adw::backdrop{background:rgba(0,0,0,.5)}
#adw[open]{display:flex;flex-direction:column}
#adw *{box-sizing:border-box}
#adw input,#adw select,#adw textarea{border:1px solid #e6dccd;border-radius:10px;padding:10px 11px;font:inherit;background:#fff;color:#1d1a16;width:100%}
#adw label{display:grid;gap:4px;font-size:13px;color:#6b625a;font-weight:600}
#adw .adwh{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:16px 20px 8px}
#adw .adwh h3{margin:0;font-size:19px}
#adw .adwc{border:0;background:#f4eee6;width:34px;height:34px;border-radius:50%;font-size:22px;cursor:pointer;line-height:1;color:#1d1a16}
#adw .adws{display:flex;gap:6px;padding:0 20px 10px;overflow-x:auto}
#adw .adws span{display:flex;align-items:center;gap:7px;white-space:nowrap;font-size:12.5px;color:#8a8076;font-weight:700;padding:5px 11px;border-radius:20px;background:#f7f2ea}
#adw .adws span b{width:20px;height:20px;border-radius:50%;background:#e2d8c9;color:#fff;display:grid;place-items:center;font-size:11px}
#adw .adws .on{background:#0B4A2E;color:#fff}#adw .adws .on b{background:#F58E20}#adw .adws .done b{background:#14633F}
#adw .adwb{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,1fr);gap:18px;padding:6px 20px 14px;overflow:auto;flex:1}
@media(max-width:780px){#adw .adwb{grid-template-columns:1fr}}
#adw .adwf{display:grid;gap:12px;align-content:start}
#adw .adwf h4{margin:0;font-size:15px}
#adw .adwp{display:grid;gap:8px;align-content:start}
@media(min-width:781px){#adw .adwp{position:sticky;top:0}}
#adw .adwp small{color:#8a8076}
#adw .adwn{display:flex;gap:8px;justify-content:space-between;align-items:center;flex-wrap:wrap;padding:12px 20px 16px;border-top:1px solid #f0e4d4;background:#fffaf4}
#adw .adwn div{display:flex;gap:8px;flex-wrap:wrap}
#adw .b{border:1.5px solid #0B4A2E;background:#fff;color:#0B4A2E;border-radius:10px;padding:9px 18px;font:inherit;font-weight:700;cursor:pointer}
#adw .b.p{background:#0B4A2E;color:#fff}#adw .b.o{background:#F58E20;border-color:#F58E20;color:#fff}
#adw .b:disabled{opacity:.55;cursor:wait}
#adw .cards{display:grid;gap:8px}
#adw .oc{display:flex;gap:12px;align-items:flex-start;text-align:left;border:2px solid #eee3d3;background:#fff;border-radius:14px;padding:12px 14px;cursor:pointer;font:inherit;color:inherit;width:100%}
#adw .oc:hover{border-color:#f5c58f}
#adw .oc.on{border-color:#F58E20;background:#fff7ec}
#adw .oc i{flex:none;width:18px;height:18px;margin-top:2px;border-radius:50%;border:2px solid #cfc4b4;position:relative}
#adw .oc.on i{border-color:#F58E20}#adw .oc.on i::after{content:"";position:absolute;inset:3px;border-radius:50%;background:#F58E20}
#adw .oc b{display:block;color:#1d1a16}#adw .oc span{font-size:13px;color:#6b625a}
#adw .ck{display:flex;gap:9px;align-items:center;font-weight:500;color:#1d1a16;font-size:14px}
#adw .ck input{width:auto}
#adw .two{display:grid;grid-template-columns:1fr 1fr;gap:10px}
#adw .est{background:#eef7f1;border:1px solid #cfe6d7;border-radius:12px;padding:12px 14px;color:#0B4A2E}
#adw .est b{font-size:18px}
#adw .tn{display:flex;gap:8px;flex-wrap:wrap}
#adw .tn button{border:2px solid #eee3d3;background:#fff;border-radius:10px;padding:6px 10px;cursor:pointer;display:flex;gap:7px;align-items:center;font:inherit;font-size:13px}
#adw .tn button.on{border-color:#F58E20}#adw .tn s{display:block;width:16px;height:16px;border-radius:50%;text-decoration:none}
#adw .rv{display:grid;gap:0;border:1px solid #eee3d3;border-radius:12px;overflow:hidden}
#adw .rv div{display:flex;justify-content:space-between;gap:12px;padding:9px 12px;border-bottom:1px solid #f3eadc}
#adw .rv div:last-child{border:0}#adw .rv span{color:#6b625a}#adw .rv b{text-align:right;overflow-wrap:anywhere}
#adw .cnt{font-size:12px;color:#8a8076;text-align:right}
/* refreshed look */
.adc{border-radius:22px;box-shadow:0 28px 80px rgba(11,74,46,.4),0 2px 10px rgba(0,0,0,.14)}
.adc::before{content:"";position:absolute;left:0;right:0;top:0;height:5px;z-index:3;background:linear-gradient(90deg,#F58E20,#FFC46B 50%,#0B4A2E)}
.adm:not(.noimg)::after{content:"";position:absolute;left:0;right:0;bottom:0;height:45%;background:linear-gradient(transparent,rgba(11,40,26,.38));pointer-events:none}
.adm.noimg{background:radial-gradient(circle at 80% 15%,rgba(255,255,255,.22),transparent 45%),linear-gradient(135deg,var(--ab,#0B4A2E),var(--ab2,#14633F))}
.adi{width:84px;height:84px;box-shadow:0 0 0 10px rgba(255,255,255,.1)}
.adb{padding:18px 20px 20px;gap:8px}
.adsp{display:inline-block;background:#FFF3E3;color:#D9740A;border-radius:20px;padding:3px 11px;margin-bottom:8px;font-size:10.5px}
.adb h3{font-size:23px;font-weight:800;line-height:1.15}
.adb p{font-size:14.5px;line-height:1.5}
.adcta{background:linear-gradient(135deg,#F58E20,#E27610);border-radius:999px;padding:13px 20px;font-size:15px;box-shadow:0 8px 20px rgba(245,142,32,.45)}
.adcta:hover{background:linear-gradient(135deg,#FF9E33,#D9740A);transform:translateY(-2px)}
.adcta svg{transition:transform .2s}.adcta:hover svg{transform:translateX(4px)}
.adx{background:rgba(255,255,255,.95);color:#1d1a16;box-shadow:0 2px 10px rgba(0,0,0,.25)}
.adx:hover{background:#fff;color:#b3261e}
.adc.f-banner .adcta{padding:10px 18px}
.adc.f-slide .adb h3{font-size:19px}
@media(prefers-reduced-motion:reduce){.adov,.adov .adc,.adw-slide,.adw-banner{transition:none!important}}
/* v10: video media, product cards, animations */
.adm video{width:100%;height:100%;object-fit:cover;display:block;background:#000}
.adc{max-height:calc(100vh - 32px);max-height:calc(100dvh - 32px);overflow-y:auto;overscroll-behavior:contain}
.adc.f-banner{overflow:hidden;max-height:none}
.adc.hp .adm{aspect-ratio:3/1}.adc.hp .adb{padding:14px 16px 16px;gap:6px}.adc.hp .adsp{margin-bottom:4px}.adc.hp .adb h3{font-size:20px}
.adp{display:grid;gap:8px;margin-top:4px}
.adpt{display:flex;overflow-x:auto;scroll-snap-type:x mandatory;gap:10px;scrollbar-width:none}.adpt::-webkit-scrollbar{display:none}
.adpc{flex:0 0 100%;scroll-snap-align:start;border:1px solid #eee3d3;border-radius:16px;padding:10px;display:grid;gap:6px;background:#fff;align-content:start}
.adpi{aspect-ratio:16/10;background:#F6F4F0;border-radius:12px;overflow:hidden;display:grid;place-items:center;color:#F58E20}
.adpi img{width:100%;height:100%;object-fit:contain;background:#F6F4F0}
.adpn{font-weight:800;font-size:17px;line-height:1.2;color:#1d1a16;overflow-wrap:anywhere}
.adps{font-size:13px;color:#5b534b}.adps span{color:#F58E20;letter-spacing:1px}
.adpr b{color:#F58E20;font-size:22px;font-weight:800}.adpr s{color:#8a8076;margin-left:6px;font-size:14px}
.adpm{display:flex;gap:6px;align-items:center;font-size:13px;color:#5b534b}.adpm svg{flex:none;color:#0B4A2E}
.adv{font-style:normal;background:#0B4A2E;color:#fff;border-radius:50%;width:16px;height:16px;display:inline-grid;place-items:center;font-size:10px;flex:none}
.adpb2{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:4px}
.adbtn{border:0;border-radius:999px;padding:11px 8px;font:inherit;font-weight:800;font-size:13px;cursor:pointer;color:#fff;line-height:1.1}
.adbtn.o{background:#F58E20}.adbtn.o:hover{background:#D9740A}
.adbtn.d{background:#0B4A2E;grid-column:1/-1;text-transform:uppercase;letter-spacing:.02em;font-size:14px;padding:13px}.adbtn.d:hover{background:#14633F}
.adbtn.l{background:#fff;color:#0B4A2E;border:1.5px solid #0B4A2E}.adbtn.l:hover{background:#E8F3EC}
.adbtn:focus-visible{outline:3px solid #F58E20;outline-offset:2px}
.adpn2{display:flex;justify-content:center;align-items:center;gap:12px}.adpn2 button{width:32px;height:32px;border-radius:50%;border:1px solid #e6dccd;background:#fff;font-size:18px;cursor:pointer;line-height:1}.adpn2 span{font-size:13px;color:#6b625a}
.ax.adw-slide,.ax.adw-banner{opacity:1;transform:none;transition:none}
.ax.adov{opacity:1;background:rgba(11,20,16,0);transition:background .35s}
.ax.adov.in{background:rgba(11,20,16,.55)}
.ax.adov .adc,.ax.adov.in .adc{transform:none;transition:none}
@keyframes aiFade{from{opacity:0}to{opacity:1}}
@keyframes aiUp{from{opacity:0;transform:translateY(70px)}to{opacity:1;transform:none}}
@keyframes aiDown{from{opacity:0;transform:translateY(-70px)}to{opacity:1;transform:none}}
@keyframes aiLeft{from{opacity:0;transform:translateX(-90px)}to{opacity:1;transform:none}}
@keyframes aiRight{from{opacity:0;transform:translateX(90px)}to{opacity:1;transform:none}}
@keyframes aiZoom{from{opacity:0;transform:scale(.6)}to{opacity:1;transform:none}}
@keyframes aiBounce{0%{opacity:0;transform:translateY(-70px)}50%{opacity:1;transform:translateY(16px)}70%{transform:translateY(-9px)}88%{transform:translateY(4px)}100%{transform:none}}
@keyframes aiFlip{from{opacity:0;transform:perspective(700px) rotateY(-80deg)}to{opacity:1;transform:none}}
@keyframes aoFade{from{opacity:1}to{opacity:0}}
@keyframes aoDown{from{opacity:1;transform:none}to{opacity:0;transform:translateY(70px)}}
@keyframes aoUp{from{opacity:1;transform:none}to{opacity:0;transform:translateY(-70px)}}
@keyframes aoLeft{from{opacity:1;transform:none}to{opacity:0;transform:translateX(-90px)}}
@keyframes aoRight{from{opacity:1;transform:none}to{opacity:0;transform:translateX(90px)}}
@keyframes aoZoom{from{opacity:1;transform:none}to{opacity:0;transform:scale(.6)}}
.adc.ai-fade{animation:aiFade .5s ease both}.adc.ai-up{animation:aiUp .55s cubic-bezier(.2,.8,.2,1) both}.adc.ai-down{animation:aiDown .55s cubic-bezier(.2,.8,.2,1) both}
.adc.ai-left{animation:aiLeft .55s cubic-bezier(.2,.8,.2,1) both}.adc.ai-right{animation:aiRight .55s cubic-bezier(.2,.8,.2,1) both}.adc.ai-zoom{animation:aiZoom .45s cubic-bezier(.2,.9,.3,1.2) both}
.adc.ai-bounce{animation:aiBounce .9s ease both}.adc.ai-flip{animation:aiFlip .65s ease both}
.adc.ao-fade{animation:aoFade .4s ease both}.adc.ao-down{animation:aoDown .4s ease-in both}.adc.ao-up{animation:aoUp .4s ease-in both}
.adc.ao-left{animation:aoLeft .4s ease-in both}.adc.ao-right{animation:aoRight .4s ease-in both}.adc.ao-zoom{animation:aoZoom .35s ease-in both}
#adw .plist{max-height:190px;overflow:auto;border:1px solid #eee3d3;border-radius:10px;padding:6px 10px;display:grid;gap:2px}
#adw .plist label{font-weight:500;color:#1d1a16}
#adw .adhint{font-size:12.5px;color:#8a8076;margin:0}
@media(prefers-reduced-motion:reduce){.adc[class*=" ai-"],.adc[class*=" ao-"]{animation-duration:.01s!important}}
`;document.head.appendChild(s)}

/* ---------------------------------------------------------------- card markup (live + preview) */
const mediaHTML=img=>{if(!img)return `<span class="adi">${ICON}</span>`;const u=E(safe(img));return isVideo(img)?`<video src="${u}" autoplay muted loop playsinline preload="metadata"></video>`:`<img alt="" src="${u}">`};
const prodCard=p=>{const old=p.old_price&&p.price&&+p.old_price>+p.price?+p.old_price:0,loc=[p.neighbourhood,p.town,p.county].filter(Boolean).join(", "),rt=+p.rating>0?Math.max(1,Math.min(5,Math.round(+p.rating))):0,rc=p.review_count||p.reviews_count||0,shop=p._shop||p.shop_name||"";
 return `<div class="adpc"><div class="adpi">${p.cover_url?`<img alt="" loading="lazy" src="${E(safe(p.cover_url))}">`:ICON}</div>`+
  `<div class="adpn">${E(p.title)}</div>`+
  (rt?`<div class="adps"><span>${"★".repeat(rt)+"☆".repeat(5-rt)}</span> <b>${(+p.rating).toFixed(1)}</b>${rc?` (${N(rc)})`:""}</div>`:"")+
  `<div class="adpr"><b>${p.price!=null?K(p.price):"Contact for price"}</b>${old?`<s>${K(old)}</s>`:""}</div>`+
  (shop?`<div class="adpm">${SHOPI}<span>${E(shop)}</span>${p._sv?'<i class="adv" title="Verified">✓</i>':""}</div>`:"")+
  (loc?`<div class="adpm">${PIN}<span>${E(loc)}</span></div>`:"")+
  `<div class="adpb2"><button type="button" class="adbtn l" data-adchat="${E(p.id)}">Chat seller</button><button type="button" class="adbtn o" data-adcart="${E(p.id)}">Add to Catalogue</button><button type="button" class="adbtn d" data-adbuy="${E(p.id)}">Checkout now</button></div></div>`};
const prodsHTML=a=>{const L=(a._prods||[]).slice(0,4);if(!L.length||a.format==="banner")return"";
 return `<div class="adp"><div class="adpt" data-adpt>${L.map(prodCard).join("")}</div>${L.length>1?`<div class="adpn2"><button type="button" data-adpp="-1" aria-label="Previous product">‹</button><span data-adpc>1 / ${L.length}</span><button type="button" data-adpp="1" aria-label="Next product">›</button></div>`:""}</div>`};
function card(a){
 const f=FORMATS[a.format]?a.format:"popup",th=THEMES[a.theme]?a.theme:"green",t=THEMES[th],img=a.image_url,pr=prodsHTML(a);
 return `<div class="adc f-${f} t-${th}${pr?" hp":""}" style="--ab:${t[1]};--ab2:${t[2]}"><button type="button" class="adx" data-adx aria-label="Close advertisement">&times;</button>`+
 `<div class="adm ${img?"":"noimg"}">${mediaHTML(img)}</div>`+
 `<div class="adb"><div class="adt"><span class="adsp">Sponsored${a.shop_name?" · "+E(a.shop_name):""}</span><h3>${E(a.headline||"Your headline goes here")}</h3>${a.body||!a.headline?`<p>${E(a.body||"Describe your offer in a few words.")}</p>`:""}</div>${pr}`+
 `<div class="ada"><a class="adcta" href="${E(safe(a.cta_url))}" data-adcta>${E(a.cta_label||"Learn more")}${ARROW}</a><button type="button" class="adno" data-adno>No thanks</button></div></div></div>`}

/* products inside ads: shop names, verified badge and payment options come from the shops table */
async function hydrate(rows){const d=DB();rows=rows||[];const ids=[...new Set(rows.map(r=>r.shop_id).filter(Boolean))];let m={};
 if(ids.length&&d){try{const r=await d.from("shops").select("id,name,seller_verified,payment_methods").in("id",ids);(r.data||[]).forEach(x=>m[String(x.id)]=x)}catch(e){}}
 return rows.map(p=>{const s=m[String(p.shop_id)];return {...p,_shop:s?s.name:(p.shop_name||""),_sv:!!(p.seller_verified||(s&&s.seller_verified)),_pm:s&&s.payment_methods||null}})}
async function prep(ad){const ids=Array.isArray(ad.product_ids)?ad.product_ids.slice(0,4):[];ad._prods=[];if(!ids.length||ad.format==="banner")return;
 try{const r=await DB().from("products").select("*").in("id",ids).eq("status","approved"),by={};(r.data||[]).forEach(p=>by[String(p.id)]=p);
  ad._prods=await hydrate(ids.map(i=>by[String(i)]).filter(p=>p&&!(p.stock!=null&&+p.stock<=0)))}catch(e){}}
function bindCar(root){if(root._car)return;root._car=1;
 root.addEventListener("click",e=>{const b=e.target.closest("[data-adpp]");if(!b)return;const box=b.closest(".adp").querySelector("[data-adpt]");box.scrollBy({left:(+b.dataset.adpp)*box.clientWidth,behavior:"smooth"})});
 root.addEventListener("scroll",e=>{const box=e.target;if(!box||!box.matches||!box.matches("[data-adpt]"))return;const n=box.children.length,i=Math.min(n-1,Math.round(box.scrollLeft/Math.max(1,box.clientWidth))),c=box.closest(".adp").querySelector("[data-adpc]");if(c)c.textContent=(i+1)+" / "+n},true)}

/* ---------------------------------------------------------------- storefront engine */
const ST={started:false,cfg:DEFC,ads:[],uid:null,page:"",shown:0,last:0,lastY:0,live:null,t0:Date.now()};
const PAGEMAP={"index.html":"home","":"home","shop.html":"shop","product.html":"product","jobs.html":"jobs"};
const SEEN="soko_ads_seen";
const seen=()=>{try{return JSON.parse(localStorage[SEEN]||"{}")}catch(e){return{}}};
const mark=(id,h)=>{try{const s=seen();s[id]=Date.now()+h*36e5;localStorage[SEEN]=JSON.stringify(s)}catch(e){}};
const muted=id=>{const t=seen()[id];return !!t&&t>Date.now()};
const nSess=()=>{try{return +sessionStorage.soko_ads_n||0}catch(e){return 0}};
const bumpSess=()=>{try{sessionStorage.soko_ads_n=nSess()+1}catch(e){}};
async function loadCfg(){const d=DB();let v=null;try{const r=await d.from("site_content").select("value").eq("key","ads").maybeSingle();v=r.data&&r.data.value}catch(e){}return Object.assign({},DEFC,v||{})}
function track(id,kind){const d=DB();return d?Promise.resolve(d.rpc("ad_track",{p_ad:id,p_kind:kind})).then(()=>{},()=>{}):Promise.resolve()}
const blocked=()=>{const a=document.activeElement;return !!(document.querySelector("dialog[open]")||document.querySelector(".sc-ov.on")||ST.live||ST.busy||(a&&/^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName)))};
const ext=h=>{try{return new URL(h,location.href).origin!==location.origin}catch(e){return false}};

function show(ad){
 const f=FORMATS[ad.format]?ad.format:"popup",el=document.createElement("div");
 if(f==="popup"){el.className="adov";el.setAttribute("role","dialog");el.setAttribute("aria-modal","true");el.innerHTML=card(ad)}
 else{el.className="adw-"+f;el.setAttribute("role","complementary");el.innerHTML=f==="banner"?`<div class="adin">${card(ad)}</div>`:card(ad)}
 el.setAttribute("aria-label","Advertisement");
 el.querySelectorAll("[data-adcta]").forEach(a=>{if(ext(a.getAttribute("href"))){a.target="_blank";a.rel="noopener noreferrer"}});
 const ai=ad.anim_in&&ANIN[ad.anim_in]&&ad.anim_in!=="default"?ad.anim_in:"",ao0=ad.anim_out&&ANOUT[ad.anim_out]&&ad.anim_out!=="default"?ad.anim_out:"",ao=ao0||(ai&&ai!=="none"?"fade":""),cd=el.querySelector(".adc");
 if(ai||ao0)el.classList.add("ax");
 if(ai&&ai!=="none")cd.classList.add("ai-"+ai);
 bindCar(el);
 document.body.appendChild(el);ST.live={el,ad};ST.shown++;ST.last=Date.now();ST.lastY=scrollY;bumpSess();mark(ad.id,6);track(ad.id,"impression");
 requestAnimationFrame(()=>requestAnimationFrame(()=>el.classList.add("in")));
 let auto=null;
 const close=h=>{if(!ST.live||ST.live.el!==el)return;clearTimeout(auto);document.removeEventListener("keydown",key);mark(ad.id,h||24);el.classList.remove("in");ST.live=null;
  if(ao&&ao!=="none"){el.classList.add("ax");if(ai)cd.classList.remove("ai-"+ai);cd.classList.add("ao-"+ao);setTimeout(()=>el.remove(),480)}
  else setTimeout(()=>el.remove(),ao0==="none"?0:380)};
 const key=e=>{if(e.key==="Escape")close(24)};
 document.addEventListener("keydown",key);
 const pAct=async(kind,id)=>{const p=(ad._prods||[]).find(x=>String(x.id)===String(id));if(!p)return;
  if(kind==="cart"){if(typeof RECS==="undefined"||typeof addCart!=="function")return;const k="products:"+p.id;RECS[k]={...p,_s:"products"};addCart(k);track(ad.id,"click");return}
  if(typeof needUser!=="function")return;
  const u=await needUser(kind==="chat"?"Log in or create an account to chat with the seller.":"Log in or create an account to place your order.");if(!u)return;
  if(u.id===p.owner_id){say("This is your own product");return}
  if(!window.SokoChat){say("Chat is still loading, please try again");return}
  track(ad.id,"click");mark(ad.id,72);
  const draft=kind==="chat"?`Hi, I am interested in "${p.title}". Is it still available?`:`Hi, I would like to order:\n• ${p.title} × 1${p.price!=null?" ("+K(p.price)+")":""}\nIs it available?${typeof payText==="function"?payText(p._pm):""}`;
  close(72);window.SokoChat.chatWith(p.owner_id,p.shop_id||null,draft)};
 el.addEventListener("click",async e=>{
  if(e.target.closest("[data-adpp]"))return;
  let pb;if(pb=e.target.closest("[data-adchat],[data-adcart],[data-adbuy]")){e.preventDefault();pAct(pb.hasAttribute("data-adchat")?"chat":pb.hasAttribute("data-adcart")?"cart":"buy",pb.dataset.adchat||pb.dataset.adcart||pb.dataset.adbuy);return}
  if(e.target.closest("[data-adx],[data-adno]")){close(24);return}
  const a=e.target.closest("[data-adcta]");
  if(a){const href=a.getAttribute("href");mark(ad.id,72);
   if(ext(href)){track(ad.id,"click");close(72);return}
   e.preventDefault();await Promise.race([track(ad.id,"click"),new Promise(r=>setTimeout(r,700))]);close(72);if(href&&href!=="#")location.href=href;return}
  if(f==="popup"&&e.target===el)close(24)});
 if(f==="popup"){const x=el.querySelector("[data-adx]");if(x)setTimeout(()=>x.focus({preventScroll:true}),350)}
 else auto=setTimeout(()=>close(6),ad._prods&&ad._prods.length?60000:22000)}

function tick(){
 const c=ST.cfg;if(ST.shown>=(+c.max_per_session||2)||nSess()>=(+c.max_per_session||2)){clearInterval(ST.iv);return}
 if(blocked()||document.visibilityState!=="visible")return;
 const now=Date.now();if(now-ST.t0<(+c.first_delay||8)*1000)return;
 if(ST.shown&&now-ST.last<(+c.min_gap||60)*1000)return;
 const max=document.documentElement.scrollHeight-innerHeight,pct=max<=80?100:scrollY/max*100;
 if(ST.shown===0){if(pct<(+c.scroll_pct||25)&&!(max<=80&&now-ST.t0>12000))return}
 else if(Math.abs(scrollY-ST.lastY)<400)return;
 const pool=ST.ads.filter(a=>!muted(a.id));if(!pool.length)return;
 const w=pool.map(a=>a.is_house?1:2),tot=w.reduce((x,y)=>x+y,0);let r=Math.random()*tot,i=0;while(i<pool.length-1&&(r-=w[i])>0)i++;
 const pick=pool[i];ST.busy=1;prep(pick).then(()=>show(pick)).catch(()=>{}).finally(()=>{ST.busy=0})}

async function start(){
 const d=DB();if(!d||ST.started)return;ST.started=true;
 ST.page=PAGEMAP[location.pathname.split("/").pop()||""];if(!ST.page)return;
 ST.cfg=await loadCfg();if(ST.cfg.enabled===false)return;
 css();
 let session=null,rows=[];
 try{session=(await d.auth.getSession()).data.session;const r=await d.from("ads").select("*").eq("status","active").limit(40);rows=r.error?[]:(r.data||[])}catch(e){return}
 ST.uid=session?session.user.id:null;
 ST.ads=rows.filter(a=>{
  const pl=a.placements&&a.placements.length?a.placements:Object.keys(PAGES);if(!pl.includes(ST.page))return false;
  if(a.audience==="members"&&!ST.uid)return false;if(a.audience==="guests"&&ST.uid)return false;
  if(ST.uid&&a.owner_id===ST.uid)return false;
  if(a.start_date&&a.start_date>new Date().toISOString().slice(0,10))return false;return true});
 if(!ST.ads.length)return;
 ST.iv=setInterval(tick,1500)}

/* ---------------------------------------------------------------- campaign builder */
async function wizard(o){
 css();const d=DB(),cf=Object.assign({},DEFC,o.cfg||await loadCfg()),A=o.ad||null,admin=!!o.admin;
 const today=new Date().toISOString().slice(0,10),plus=n=>new Date(Date.now()+n*864e5).toISOString().slice(0,10);
 let shops=o.shops||[],prods=o.products||[];const g=(k,df)=>A&&A[k]!=null?A[k]:df;
 if(admin){if(!shops.length){try{const r=await d.from("shops").select("id,name,seller_verified").eq("status","approved").order("name").limit(300);shops=r.data||[]}catch(e){}}
  if(!prods.length){try{const r=await d.from("products").select("*").eq("status","approved").order("created_at",{ascending:false}).limit(200);prods=r.data||[]}catch(e){}}}
 prods=await hydrate(prods);
 const S={name:g("name",""),objective:g("objective",admin?"link":"shop"),shop_id:g("shop_id",shops[0]?String(shops[0].id):null),product_id:g("product_id",""),
  link_url:A&&A.objective==="link"?A.cta_url:"",format:g("format","popup"),placements:g("placements",Object.keys(PAGES)).slice(),audience:g("audience","all"),
  headline:g("headline",""),body:g("body",""),image_url:g("image_url",""),cta_label:g("cta_label","Shop now"),cta_url:g("cta_url",""),theme:g("theme","green"),
  budget_total:g("budget_total",admin?"":Math.max(500,+cf.min_budget||200)),start_date:g("start_date",today),end_date:g("end_date",admin?"":plus(7)),goLive:"active"};
 S.anim_in=g("anim_in","default");S.anim_out=g("anim_out","default");S.product_ids=(Array.isArray(A&&A.product_ids)?A.product_ids:[]).map(String);
 const shopOf=()=>shops.find(x=>String(x.id)===String(S.shop_id));
 const dest=()=>{if(S.objective==="shop")return S.shop_id?`product.html?s=shops&id=${encodeURIComponent(S.shop_id)}`:"";if(S.objective==="product")return S.product_id?`product.html?s=products&id=${encodeURIComponent(S.product_id)}`:"";return S.link_url.trim()};
 const sync=()=>{S.cta_url=dest();const sh=shopOf();S.shop_name=admin&&S.objective!=="shop"?"":(sh?sh.name:"")};
 const STEPS=["Goal","Audience","Creative","Budget","Review"];let step=0;
 const dlg=document.getElementById("adw")||(()=>{const x=document.createElement("dialog");x.id="adw";document.body.appendChild(x);return x})();
 const prv=()=>{const e=document.getElementById("adpv");if(e){sync();S._prods=S.product_ids.map(id=>prods.find(p=>String(p.id)===id)).filter(Boolean);e.innerHTML=card(S);e.querySelectorAll("a").forEach(a=>a.removeAttribute("target"))}};
 const est=()=>{const B=+S.budget_total||0,per=cf.cpm/1000+0.02*cf.cpc,im=per>0?Math.floor(B/per):0,days=Math.max(1,Math.round((new Date(S.end_date)-new Date(S.start_date))/864e5)+1);
  return {im,cl:Math.round(im*0.02),days,perDay:Math.round(B/days)}};
 const animUI=()=>`<h4>Animation</h4><div class="two"><label>How it appears<select data-s="anim_in">${Object.entries(ANIN).map(([k,v])=>`<option value="${k}" ${S.anim_in===k?"selected":""}>${v}</option>`).join("")}</select></label><label>How it leaves<select data-s="anim_out">${Object.entries(ANOUT).map(([k,v])=>`<option value="${k}" ${S.anim_out===k?"selected":""}>${v}</option>`).join("")}</select></label></div><button type="button" class="b" data-w="replay">▶ Play the animation in the preview</button>`;
 const pickHTML=()=>`<h4>Products shown in the ad <span class="adhint">(optional, up to 4)</span></h4>${prods.length?`<input type="search" data-pq placeholder="Search products…" aria-label="Search products"><div class="plist">${prods.map(p=>`<label class="ck" data-prow="${E((p.title+" "+(p._shop||"")).toLowerCase())}"><input type="checkbox" data-pp="${E(p.id)}" ${S.product_ids.includes(String(p.id))?"checked":""}> ${E(p.title)}${p.price!=null?" · "+K(p.price):""}${p._shop?" · "+E(p._shop):""}</label>`).join("")}</div><p class="adhint" id="pcnt">${S.product_ids.length} of 4 chosen</p><p class="adhint">Each product shows as a card with its price, shop, location and the Chat seller, Add to Catalogue and Checkout now buttons. Product cards use the Pop-up or Corner slide style.</p>`:'<p class="adhint">There are no approved products to show yet.</p>'}`;
 const replay=()=>{const c=document.querySelector("#adpv .adc");if(!c)return;const ai0=S.anim_in==="default"?"up":S.anim_in,ao0=S.anim_out==="default"?"fade":S.anim_out,strip=()=>{c.className=c.className.replace(/\s*\b(ai|ao)-\w+/g,"")};
  strip();void c.offsetWidth;if(ai0!=="none")c.classList.add("ai-"+ai0);clearTimeout(replay.t);
  replay.t=setTimeout(()=>{strip();if(ao0!=="none")c.classList.add("ao-"+ao0);else c.style.visibility="hidden";
   replay.t=setTimeout(()=>{strip();c.style.visibility=""},900)},1600)};
 const ctaOpts=()=>CTAS.map(x=>`<option ${x===S.cta_label?"selected":""}>${E(x)}</option>`).join("");

 function body(){
  if(step===0){
   const objs=admin?["link","shop","product"]:["shop","product"];
   return `<label>Ad name (only you see this)<input data-s="name" maxlength="60" value="${E(S.name)}" placeholder="e.g. November sale – shoes"></label>
   <h4>What do you want people to do?</h4><div class="cards">${objs.map(k=>`<button type="button" class="oc ${S.objective===k?"on":""}" data-obj="${k}"><i></i><span><b>${OBJ[k][0]}</b>${OBJ[k][1]}</span></button>`).join("")}</div>
   ${S.objective==="shop"&&(shops.length>1||(admin&&shops.length))?`<label>Which shop<select data-s="shop_id">${shops.map(x=>`<option value="${E(x.id)}" ${String(x.id)===String(S.shop_id)?"selected":""}>${E(x.name)}</option>`).join("")}</select></label>`:""}
   ${S.objective==="product"?`<label>Which product<select data-s="product_id"><option value="">Choose an approved product</option>${prods.map(p=>`<option value="${E(p.id)}" ${String(p.id)===String(S.product_id)?"selected":""}>${E(p.title)}</option>`).join("")}</select></label>${prods.length?"":'<p style="margin:0;color:#b3261e">You have no approved products yet. Products appear here after review.</p>'}`:""}
   ${S.objective==="link"?`<label>Where should the button go?<input data-s="link_url" value="${E(S.link_url)}" placeholder="https://… or shop.html?feat=1"></label>`:""}`}
  if(step===1){
   return `<h4>Where should it appear?</h4>${Object.entries(PAGES).map(([k,l])=>`<label class="ck"><input type="checkbox" data-pl="${k}" ${S.placements.includes(k)?"checked":""}> ${l}</label>`).join("")}
   <h4>Who should see it?</h4>${Object.entries(AUD).map(([k,l])=>`<label class="ck"><input type="radio" name="aud" data-s="audience" value="${k}" ${S.audience===k?"checked":""}> ${l}</label>`).join("")}
   <h4>Ad style</h4><div class="cards">${Object.entries(FORMATS).map(([k,v])=>`<button type="button" class="oc ${S.format===k?"on":""}" data-fmt="${k}"><i></i><span><b>${v.n}</b>${v.d}</span></button>`).join("")}</div>
   ${animUI()}
   <p class="cnt" style="text-align:left">Ads appear while visitors scroll, never while they are typing or chatting, and at most ${+cf.max_per_session||2} per visit.</p>`}
  if(step===2){
   return `<label>Headline<input data-s="headline" maxlength="40" value="${E(S.headline)}" placeholder="e.g. 20% off all sneakers"></label><div class="cnt"><span id="c1">${S.headline.length}</span>/40</div>
   <label>Short text<textarea data-s="body" rows="2" maxlength="110" placeholder="Say why people should tap">${E(S.body)}</textarea></label><div class="cnt"><span id="c2">${S.body.length}</span>/110</div>
   <label>Image or video link from ImageKit.io<input data-s="image_url" value="${E(S.image_url)}" placeholder="https://ik.imagekit.io/your_id/ad.jpg  or  …/promo.mp4"></label><p class="adhint">Paste your ImageKit link. Links ending in .mp4 or .webm play as a muted, looping video; .jpg, .png and .webp show as a picture. Landscape works best.</p><label>…or upload an image (under 2 MB)<input type="file" accept="image/*" data-up></label>${pickHTML()}
   <label>Button text<select data-s="cta_label">${ctaOpts()}</select></label>
   <label>Colour when there is no image</label><div class="tn">${Object.entries(THEMES).map(([k,v])=>`<button type="button" class="${S.theme===k?"on":""}" data-th="${k}"><s style="background:${v[1]}"></s>${v[0]}</button>`).join("")}</div>`}
  if(step===3){
   const e=est();
   if(admin)return `<p style="margin:0;color:#6b625a">Ads you create here are free. Leave the budget empty to run without a limit.</p><div class="two"><label>Start date<input type="date" data-s="start_date" value="${E(S.start_date||"")}"></label><label>End date (optional)<input type="date" data-s="end_date" value="${E(S.end_date||"")}"></label></div><label>Budget cap in KSh (optional)<input type="number" min="0" data-s="budget_total" value="${E(S.budget_total)}"></label>
    <h4>After saving</h4><label class="ck"><input type="radio" name="gl" data-s="goLive" value="active" ${S.goLive==="active"?"checked":""}> Publish now</label><label class="ck"><input type="radio" name="gl" data-s="goLive" value="draft" ${S.goLive==="draft"?"checked":""}> Keep as draft</label>`;
   return `<label>Total budget (KSh, minimum ${N(cf.min_budget)})<input type="number" min="${+cf.min_budget||200}" step="50" data-s="budget_total" value="${E(S.budget_total)}"></label>
   <div class="two"><label>Start date<input type="date" min="${today}" data-s="start_date" value="${E(S.start_date)}"></label><label>End date<input type="date" min="${today}" data-s="end_date" value="${E(S.end_date)}"></label></div>
   <div class="est" id="est">${estHTML(e)}</div>
   <p class="cnt" style="text-align:left">Your ad stops by itself when the budget is used up or the end date passes. You pay for views (${K(cf.cpm)} per 1,000) and taps (${K(cf.cpc)} each). Real results vary.</p>`}
  const e=est();
  return `<div class="rv"><div><span>Ad name</span><b>${E(S.name||"Untitled ad")}</b></div><div><span>Goal</span><b>${OBJ[S.objective][0]}</b></div><div><span>Style</span><b>${FORMATS[S.format].n}</b></div><div><span>Shown on</span><b>${S.placements.map(k=>PAGES[k]).join(", ")}</b></div><div><span>Audience</span><b>${AUD[S.audience]}</b></div><div><span>Button leads to</span><b>${E(S.cta_url||"—")}</b></div>${admin?(S.budget_total?`<div><span>Budget cap</span><b>${K(S.budget_total)}</b></div>`:""):`<div><span>Budget</span><b>${K(S.budget_total)} (about ${K(e.perDay)} a day)</b></div>`}<div><span>Runs</span><b>${E(S.start_date||"now")}${S.end_date?" to "+E(S.end_date):""}</b></div></div>
  ${admin?"":'<p class="cnt" style="text-align:left">Every ad is reviewed by the SOKO Smart team before it goes live. You will get a notification when it is approved or needs changes.</p>'}`}
 const estHTML=e=>`<b>About ${N(e.im)} views and ${N(e.cl)} taps</b><br>over ${e.days} day${e.days===1?"":"s"} · around ${K(e.perDay)} a day`;

 function draw(){
  sync();
  const last=step===STEPS.length-1,isNew=!A,canDraft=!A||["draft","rejected"].includes(A.status);
  dlg.innerHTML=`<div class="adwh"><h3>${A?"Edit ad":(admin?"New ad":"Create ad")}</h3><button type="button" class="adwc" data-w="x" aria-label="Close">&times;</button></div>
  <div class="adws">${STEPS.map((x,i)=>`<span class="${i===step?"on":i<step?"done":""}"><b>${i<step?"✓":i+1}</b>${x}</span>`).join("")}</div>
  <div class="adwb"><div class="adwf">${body()}</div><aside class="adwp"><b>Live preview</b><div class="adstage" id="adpv"></div><small>This is how your ad will look to visitors.</small></aside></div>
  <div class="adwn"><button type="button" class="b" data-w="back" ${step?"":"hidden"}>Back</button><span></span><div>${last?`${admin||canDraft?`<button type="button" class="b" data-w="draft">Save as draft</button>`:""}<button type="button" class="b o" data-w="submit">${admin?(S.goLive==="active"?"Publish now":"Save"):(A&&["active","paused"].includes(A.status)?"Save changes":"Submit for review")}</button>`:`<button type="button" class="b p" data-w="next">Continue</button>`}</div></div>`;
  prv()}

 function valid(){
  if(step===0){if(!S.name.trim()){say("Give your ad a name","error");return false}
   if(S.objective==="product"&&!S.product_id){say("Choose the product to promote","error");return false}
   if(S.objective==="shop"&&!S.shop_id){say("No shop found for this ad","error");return false}
   if(S.objective==="link"&&(!S.link_url.trim()||safe(S.link_url)==="#")){say("Enter a valid link, starting with https:// or a page like shop.html","error");return false}}
  if(step===1&&!S.placements.length){say("Choose at least one place to show the ad","error");return false}
  if(step===2){if(S.headline.trim().length<3){say("Add a headline","error");return false}
   if(S.image_url.trim()&&safe(S.image_url)==="#"){say("The image or video link must start with https://","error");return false}}
  if(step===3&&!admin){const B=+S.budget_total;if(!(B>=(+cf.min_budget||200))){say("The minimum budget is "+K(cf.min_budget),"error");return false}
   if(!S.start_date||!S.end_date||S.end_date<S.start_date){say("Choose a start date and an end date after it","error");return false}
   if((new Date(S.end_date)-new Date(S.start_date))/864e5>90){say("Ads can run for up to 90 days","error");return false}}
  if(step===3&&admin&&S.end_date&&S.start_date&&S.end_date<S.start_date){say("End date must be after the start date","error");return false}
  return true}

 async function save(asDraft){
  sync();if(!d)return;
  const btns=dlg.querySelectorAll("[data-w]");btns.forEach(b=>b.disabled=true);
  const keep=A&&["active","paused"].includes(A.status);
  let status;if(admin)status=asDraft?"draft":S.goLive;else status=asDraft?"draft":(keep?A.status:"pending");
  const p={name:S.name.trim()||"Untitled ad",objective:S.objective,shop_id:(S.objective==="shop"||(S.objective==="product"&&!admin))?S.shop_id:null,shop_name:S.shop_name||null,product_id:S.objective==="product"?S.product_id:null,
   format:S.format,placements:S.placements,audience:S.audience,headline:S.headline.trim(),body:S.body.trim()||null,image_url:S.image_url.trim()||null,
   cta_label:S.cta_label,cta_url:S.cta_url,theme:S.theme,budget_total:S.budget_total===""?null:+S.budget_total,start_date:S.start_date||null,end_date:S.end_date||null,status};
  const ex={anim_in:S.anim_in,anim_out:S.anim_out,product_ids:S.product_ids.length?S.product_ids:null};
  if(!A){p.owner_id=o.userId;if(admin)p.is_house=true}
  const run=q=>A?d.from("ads").update(q).eq("id",A.id).select().single():d.from("ads").insert(q).select().single();
  let r=await run({...p,...ex}),warn="";
  if(r.error&&/anim_in|anim_out|product_ids/i.test(r.error.message)){r=await run(p);warn=" Animations and products were not saved yet: run supabase-ads-reviews.sql in Supabase."}
  btns.forEach(b=>b.disabled=false);
  if(r.error){say(/relation .*ads|schema cache/i.test(r.error.message)?"Ads are not set up yet. Run supabase-complaints-ads.sql in Supabase.":r.error.message,"error");return}
  dlg.close();if(warn)say("Ad saved."+warn,"error");else say(status==="pending"?"Ad submitted. We will notify you once it is reviewed.":status==="active"&&admin?"Ad published.":"Ad saved.");o.onDone&&o.onDone(r.data)}

 async function upload(file){
  if(!/^image\//.test(file.type)||file.size>2e6){say("Choose an image under 2 MB","error");return}
  const ext=(file.name.split(".").pop()||"png").toLowerCase().replace(/[^a-z0-9]/g,"")||"png",path=`${o.userId}/ad-${Date.now()}.${ext}`;
  const up=await d.storage.from("listing-images").upload(path,file,{contentType:file.type});if(up.error){say(up.error.message,"error");return}
  S.image_url=d.storage.from("listing-images").getPublicUrl(path).data.publicUrl;draw();say("Image added")}

 dlg.onclick=e=>{const b=e.target.closest("[data-w],[data-obj],[data-fmt],[data-th]");if(!b)return;
  if(b.dataset.obj){S.objective=b.dataset.obj;draw();return}
  if(b.dataset.fmt){S.format=b.dataset.fmt;draw();return}
  if(b.dataset.th){S.theme=b.dataset.th;draw();return}
  const w=b.dataset.w;
  if(w==="x")dlg.close();else if(w==="back"){step--;draw()}
  else if(w==="next"){if(valid()){step++;draw()}}
  else if(w==="replay")replay();
  else if(w==="draft"){if(!S.name.trim()){say("Give your ad a name","error");return}save(true)}
  else if(w==="submit"){if(valid())save(false)}};
 dlg.oninput=e=>{const t=e.target;
  if(t.dataset.pl){const k=t.dataset.pl;S.placements=t.checked?[...new Set([...S.placements,k])]:S.placements.filter(x=>x!==k);return}
  if(t.dataset.pq!==undefined){const q=t.value.toLowerCase();dlg.querySelectorAll("[data-prow]").forEach(r=>r.hidden=!r.dataset.prow.includes(q));return}
  if(t.dataset.pp){const id=t.dataset.pp;if(t.checked){if(S.product_ids.length>=4){t.checked=false;say("You can show up to 4 products","error");return}S.product_ids.push(id)}else S.product_ids=S.product_ids.filter(x=>x!==id);if(S.product_ids.length&&S.format==="banner")S.format="popup";prv();const c=dlg.querySelector("#pcnt");if(c)c.textContent=S.product_ids.length+" of 4 chosen";return}
  const k=t.dataset.s;if(!k)return;
  S[k]=t.type==="number"?t.value:t.value;
  if(k==="headline"){const c=dlg.querySelector("#c1");if(c)c.textContent=S.headline.length}
  if(k==="body"){const c=dlg.querySelector("#c2");if(c)c.textContent=S.body.length}
  if(step===3){const x=dlg.querySelector("#est");if(x)x.innerHTML=estHTML(est())}
  if(k==="product_id"||k==="audience"||k==="goLive"){if(k==="goLive")draw();return}
  prv();if(k==="anim_in"||k==="anim_out")replay()};
 dlg.onchange=e=>{const t=e.target;if(t.matches("[data-up]")&&t.files[0])upload(t.files[0])};
 bindCar(dlg);draw();if(!dlg.open)dlg.showModal()}

window.SokoAds={start,card,wizard,css,loadCfg,FORMATS,THEMES,PAGES,DEFC,isVideo,ANIN,ANOUT};
if(!window.SOKO_NO_ADS){const go=()=>{if(typeof sb!=="undefined"&&sb)start()};document.readyState==="loading"?document.addEventListener("DOMContentLoaded",go):go()}
})();