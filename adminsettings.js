/* SOKO Smart admin: Settings & Configuration (9 platform-wide sections).
   Needs admin.html globals: sb, $, esc, toast, askConfirm, ic, EYE, page.
   Needs tables from settings.sql: platform_settings, settings_audit.
   Only global configuration lives here. Jobs, shops, products, wallets etc. keep their own admin pages. */
(()=>{
const VER="1.0.0",BUILD="2026-11-09";
const f=(k,l,type,o)=>({k,l,type:type||"text",...(o||{})});
const T=(k,l,o)=>f(k,l,"toggle",o),N=(k,l,o)=>f(k,l,"number",o),S=(k,l,opts,o)=>f(k,l,"select",{opts,...(o||{})});
const SK=(k,l,o)=>f(k,l,"secret",o),TA=(k,l,o)=>f(k,l,"textarea",{rows:3,...(o||{})}),IM=(k,l,o)=>f(k,l,"image",o);
const ROLES=["Super Admin","Finance","Moderator","Support"];
const MODS=["Users","Shops","Products","Jobs","Orders","Wallets","Support","Promotions","Settings"];
const ROLES_DEF={"Super Admin":Object.fromEntries(MODS.map(m=>[m,true])),
 Finance:{Orders:true,Wallets:true},Moderator:{Users:true,Shops:true,Products:true,Jobs:true,Support:true},Support:{Users:true,Orders:true,Support:true}};
const doc=(k,t,d)=>({t,f:[TA(k+"_body",t+" text",{rows:10,full:1,h:d}),f(k+"_version","Version"),f(k+"_date","Effective date","date"),T(k+"_accept","Require acceptance at sign-up",{def:k==="terms"||k==="privacy"})]});

const SC={
general:{t:"General Settings",d:"Platform identity and defaults",i:"gear",g:[
 {t:"Identity",f:[f("name","Platform name","text",{def:"Soko Smart",req:1}),f("tagline","Platform tagline","text",{def:"Shop Smart. Sell Smart"}),IM("logo","Platform logo",{h:"PNG or SVG, up to 2 MB"}),IM("favicon","Favicon",{h:"Square image, 64×64 or larger"}),f("url","Website URL","url",{def:"https://"})]},
 {t:"Contact",f:[f("email","Official contact email","email"),f("phone","Support phone number","tel",{h:"e.g. +254 700 000 000"})]},
 {t:"Regional defaults",f:[S("currency","Default currency",[["KES","Kenyan Shilling (KES)"],["USD","US Dollar (USD)"],["UGX","Ugandan Shilling (UGX)"],["TZS","Tanzanian Shilling (TZS)"]],{def:"KES"}),S("language","Default language",[["en","English"],["sw","Kiswahili"]],{def:"en"}),S("tz","Time zone",["Africa/Nairobi","Africa/Kampala","Africa/Dar_es_Salaam","UTC"],{def:"Africa/Nairobi"})]}]},
registration:{t:"Registration & Accounts",d:"Account creation and verification",i:"users",g:[
 {t:"Sign-up",f:[T("open","Allow new registrations",{def:true,h:"Turn off to close sign-up for everyone"}),T("email_verify","Require email verification",{def:true}),T("phone_verify","Require phone verification"),S("id_verify","National ID verification",[["off","Not required"],["sellers","Sellers and freelancers only"],["all","Everyone"]],{def:"sellers"}),S("default_status","Default status for new accounts",[["active","Active immediately"],["pending","Pending admin approval"]],{def:"active"})]},
 {t:"Suspension policy",f:[N("strikes","Confirmed complaints before auto-suspension",{def:3,min:1,max:20}),N("suspend_days","Default suspension length (days, 0 = until reviewed)",{def:7,min:0,max:365}),T("appeals","Let suspended users appeal",{def:true}),TA("suspend_text","Message shown to suspended users",{full:1})]},
 {t:"Password requirements",f:[N("pw_min","Minimum length",{def:8,min:6,max:64}),T("pw_upper","Require an uppercase letter",{def:true}),T("pw_number","Require a number",{def:true}),T("pw_symbol","Require a symbol"),N("pw_expiry","Force password change every (days, 0 = never)",{def:0,min:0,max:730})]},
 {t:"Account deletion",f:[T("del_self","Let users delete their own account",{def:true}),N("del_grace","Grace period before permanent deletion (days)",{def:14,min:0,max:90}),T("del_block_orders","Block deletion while orders are open",{def:true}),T("del_block_wallet","Block deletion while wallet has a balance",{def:true})]}]},
financial:{t:"Financial & Commission Settings",d:"Commissions and transaction rules",i:"dollar",g:[
 {t:"Commission & fees",f:[N("commission","Default platform commission (%)",{def:5,min:0,max:100,step:.1}),N("fee_pct","Transaction fee (%)",{def:0,min:0,max:100,step:.1}),N("fee_flat","Transaction fee, flat (KES)",{def:0,min:0})]},
 {t:"Withdrawals",f:[N("wd_min","Minimum withdrawal (KES)",{def:500,min:0}),N("wd_max","Maximum withdrawal (KES)",{def:150000,min:0}),N("wd_daily","Daily withdrawal limit per user (KES, 0 = none)",{def:0,min:0}),N("wd_hours","Processing time (hours)",{def:24,min:0,max:720})]},
 {t:"Escrow",f:[T("escrow","Hold buyer payments in escrow",{def:true}),N("escrow_days","Auto-release after delivery (days)",{def:3,min:0,max:60}),N("dispute_days","Dispute window (days)",{def:7,min:0,max:90})]},
 {t:"Refunds",f:[N("refund_days","Refund request window (days)",{def:7,min:0,max:90}),N("refund_auto","Auto-approve refunds under (KES, 0 = never)",{def:0,min:0}),S("refund_to","Refund destination",[["wallet","Buyer's wallet"],["original","Original payment method"]],{def:"wallet"})]},
 {t:"Tax",f:[T("vat_on","Charge VAT"),N("vat","VAT rate (%)",{def:16,min:0,max:100,step:.1}),T("vat_incl","Listed prices already include VAT",{def:true}),f("kra","KRA PIN"),N("wht","Withholding tax on payouts (%)",{def:0,min:0,max:100,step:.1})]}]},
payments:{t:"Payment Gateway Settings",d:"Payment integrations",i:"wallet",g:[
 {t:"M-Pesa (Daraja)",f:[T("mp_on","Enable M-Pesa"),S("mp_env","Environment",["sandbox","live"],{def:"sandbox"}),S("mp_type","Shortcode type",[["paybill","Paybill"],["till","Buy Goods (Till)"]],{def:"paybill"}),f("mp_code","Shortcode"),SK("mp_key","Consumer key"),SK("mp_secret","Consumer secret"),SK("mp_pass","Lipa na M-Pesa passkey"),f("mp_cb","Callback URL","url")]},
 {t:"Bank payments",f:[T("bk_on","Enable bank transfers"),f("bk_name","Bank name"),f("bk_acc_name","Account name"),f("bk_acc","Account number"),f("bk_branch","Branch"),TA("bk_note","Instructions shown to buyers",{full:1})]},
 {t:"Card payments",f:[T("cd_on","Enable card payments"),S("cd_prov","Provider",["Pesapal","Flutterwave","DPO Pay","Stripe"],{def:"Pesapal"}),S("cd_env","Environment",["sandbox","live"],{def:"sandbox"}),f("cd_pub","Public / consumer key"),SK("cd_secret","Secret key"),SK("cd_hook","Webhook secret")]},
 {t:"Redirects",f:[f("rd_ok","After successful payment","url"),f("rd_fail","After failed payment","url"),f("rd_cancel","After cancelled payment","url")]},
 {t:"Payment notifications",f:[T("pn_user","Notify buyer when payment succeeds",{def:true}),T("pn_fail","Alert admins when a payment fails",{def:true}),f("pn_email","Admin alert email","email")]}]},
notifications:{t:"Notifications & Communication",d:"Email, SMS and push configuration",i:"bell",g:[
 {t:"Email (SMTP)",f:[f("sm_host","SMTP host"),N("sm_port","Port",{def:587,min:1,max:65535}),S("sm_enc","Encryption",["TLS","SSL","None"],{def:"TLS"}),f("sm_user","Username"),SK("sm_pass","Password"),f("sm_from_name","From name"),f("sm_from","From email","email")]},
 {t:"SMS gateway",f:[T("sms_on","Enable SMS"),S("sms_prov","Provider",["Africa's Talking","Twilio","Other"],{def:"Africa's Talking"}),f("sms_user","Username / account ID"),SK("sms_key","API key"),f("sms_sender","Sender ID")]},
 {t:"WhatsApp",f:[T("wa_on","Enable WhatsApp"),f("wa_num","Business phone number","tel"),f("wa_id","Phone number ID"),SK("wa_token","Access token")]},
 {t:"Push notifications",f:[T("pu_on","Enable push notifications"),SK("pu_key","Server key (FCM)"),f("pu_vapid","Web push public (VAPID) key")]},
 {t:"Default notification preferences for new users",f:[T("dp_email_orders","Email: order updates",{def:true}),T("dp_sms_orders","SMS: order updates"),T("dp_push_msgs","Push: new messages",{def:true}),T("dp_promo","Marketing and promotions")]},
 {t:"Platform-wide announcement",f:[T("an_on","Show announcement to users"),S("an_aud","Audience",[["all","Everyone"],["buyers","Buyers"],["sellers","Sellers and shops"],["freelancers","Freelancers"]],{def:"all"}),f("an_until","Show until","date"),TA("an_text","Announcement text",{full:1})]}]},
security:{t:"Security & Access Control",d:"Admin permissions and protection",i:"shield",g:[
 {t:"Authentication",f:[T("tfa","Require two-factor authentication for admins"),S("tfa_m","Two-factor method",[["app","Authenticator app"],["sms","SMS code"],["email","Email code"]],{def:"app"}),N("fail_max","Failed login attempts before lockout",{def:5,min:1,max:50}),N("lock_min","Lockout duration (minutes)",{def:15,min:1,max:1440}),N("sess_min","Session timeout (minutes of inactivity)",{def:60,min:5,max:1440})]},
 {t:"IP restrictions",f:[T("ip_on","Restrict admin access to listed IPs"),TA("ip_list","Allowed IP addresses (one per line)",{rows:4,full:1,h:"Leave off unless you have fixed office IPs, or you can lock yourself out."})]}],x:"security"},
appearance:{t:"Website & Appearance",d:"Branding and website defaults",i:"layout",g:[
 {t:"Announcement bar",f:[T("bar_on","Show announcement bar"),f("bar_text","Text"),f("bar_link","Link","url"),f("bar_color","Background colour","color",{def:"#0d4630"})]},
 {t:"Promotional banner",f:[T("pb_on","Show homepage banner"),IM("pb_img","Banner image"),f("pb_title","Title"),f("pb_link","Link","url"),f("pb_until","Hide after","date")]},
 {t:"Theme",f:[S("theme","Default theme",[["light","Light"],["dark","Dark"],["system","Follow device"]],{def:"light"}),T("theme_switch","Let visitors switch between light and dark",{def:true})]},
 {t:"Footer & social links",f:[TA("ft_about","Footer text",{full:1}),f("ft_copy","Copyright line"),f("so_fb","Facebook","url"),f("so_ig","Instagram","url"),f("so_x","X (Twitter)","url"),f("so_tt","TikTok","url"),f("so_yt","YouTube","url"),f("so_in","LinkedIn","url"),f("so_wa","WhatsApp link","url")]},
 {t:"SEO defaults",f:[f("seo_title","Default page title",{full:1}),TA("seo_desc","Default meta description",{rows:2,full:1,max:200,h:"Keep under 160 characters"}),IM("seo_img","Default social share image")]},
 {t:"Maintenance page design",f:[f("mp_title","Heading","text",{def:"We’ll be right back"}),TA("mp_msg","Message",{full:1,def:"Soko Smart is undergoing scheduled maintenance. Please check back shortly."}),IM("mp_img","Image"),f("mp_eta","Expected back","datetime-local")]}]},
legal:{t:"Legal & Policies",d:"Platform-wide legal documents",i:"file",g:[
 doc("terms","Terms and Conditions"),doc("privacy","Privacy Policy"),doc("cookie","Cookie Policy"),doc("refund","Refund Policy"),doc("seller","Seller Agreement"),doc("guidelines","Community Guidelines"),
 {t:"Platform disclaimer",f:[TA("disclaimer","Disclaimer text",{rows:5,full:1})]}]},
system:{t:"System & Maintenance",d:"Backups and system health",i:"server",g:[
 {t:"Maintenance mode",f:[T("mm","Put the public site in maintenance mode",{h:"Visitors see the maintenance page. Admins can still sign in."}),T("mm_admin","Let signed-in admins browse normally",{def:true}),TA("mm_note","Internal note",{full:1})]},
 {t:"Backup policy",note:"These record your backup policy. The schedule itself must be enabled with your database host (Supabase → Database → Backups).",f:[T("bu_on","Backups are enabled",{def:true}),S("bu_freq","Frequency",["Daily","Weekly","Monthly"],{def:"Daily"}),N("bu_keep","Keep backups for (days)",{def:30,min:1,max:3650}),S("bu_dest","Destination",["Supabase","Cloud storage","Off-site server"],{def:"Supabase"}),f("bu_email","Notify on failure","email")]},
 {t:"Error monitoring",f:[T("em_on","Enable error monitoring"),S("em_prov","Provider",["Sentry","Other"],{def:"Sentry"}),SK("em_dsn","DSN / API key"),f("em_email","Alert email","email")]}],x:"system"}
};
const KEYS=Object.keys(SC);
window.SETTINGS_NAV=KEYS.map(k=>[k,SC[k].t.replace("Financial & Commission Settings","Financial Configuration").replace("Payment Gateway Settings","Payment Gateways").replace("Notifications & Communication","Notifications").replace("Security & Access Control","Security & Access").replace("General Settings","General Settings"),SC[k].d]);
let LAST="general";window.settingsLast=()=>LAST;

let ST={},ORIG={},LOADED=false,LOADERR="",MISSING=false,ERRS=0;
addEventListener("error",()=>ERRS++);
const clone=o=>JSON.parse(JSON.stringify(o));
const root=()=>document.getElementById("vset");
const opt=o=>Array.isArray(o)?o:[o,o];
function defaults(k){const o={};SC[k].g.forEach(g=>g.f.forEach(x=>{o[x.k]=x.def!==undefined?x.def:x.type==="toggle"?false:""}));if(k==="security")o.roles=clone(ROLES_DEF);return o}
async function load(){if(LOADED)return;
 const r=await sb.from("platform_settings").select("key,value");
 if(r.error){LOADERR=r.error.message;MISSING=/does not exist|schema cache|relation|42P01|PGRST205/i.test(r.error.message+(r.error.code||""))}
 const saved={};(r.data||[]).forEach(x=>saved[x.key]=x.value||{});
 KEYS.forEach(k=>{ST[k]={...defaults(k),...(saved[k]||{})};ORIG[k]=JSON.stringify(ST[k])});LOADED=true}

function css(){if(document.getElementById("setcss"))return;document.head.insertAdjacentHTML("beforeend",`<style id="setcss">
#vset .sgc{margin-bottom:16px}#vset .sgc>h2{margin-bottom:4px}#vset .sg{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:14px;margin-top:12px}
#vset .full{grid-column:1/-1}#vset .gn{margin:0;color:var(--mut);font-size:13px}
#vset .sw{display:flex;align-items:flex-start;gap:12px;cursor:pointer;color:var(--tx);font-size:14px}#vset .sw input{position:absolute;opacity:0;width:0;height:0}
#vset .sl{flex:none;width:42px;height:24px;border-radius:12px;background:#cfd3cc;position:relative;transition:background .15s;margin-top:1px}
#vset .sl:after{content:"";position:absolute;top:3px;left:3px;width:18px;height:18px;border-radius:50%;background:#fff;transition:transform .15s;box-shadow:0 1px 2px rgba(0,0,0,.3)}
#vset .sw input:checked+.sl{background:var(--g2)}#vset .sw input:checked+.sl:after{transform:translateX(18px)}#vset .sw input:focus-visible+.sl{outline:3px solid var(--a);outline-offset:2px}
#vset .sw b{display:block;font-weight:600}#vset .sw small{color:var(--mut);font-size:12.5px}
#vset .im{display:flex;gap:12px;align-items:center;flex-wrap:wrap}#vset .im img{width:64px;height:64px;object-fit:contain;border:1px solid var(--bd);border-radius:10px;background:var(--bg2)}
#vset .im .no{width:64px;height:64px;border:1px dashed var(--bd);border-radius:10px;display:grid;place-items:center;color:var(--mut);font-size:11px}
#vset input[type=color]{padding:3px;height:42px}#vset .banner{background:#fff4e0;border:1px solid var(--a);border-radius:12px;padding:12px 14px;margin-bottom:14px;color:var(--g)}
#vset .sbar{position:sticky;bottom:0;z-index:15;display:flex;gap:10px;align-items:center;justify-content:flex-end;background:var(--bg);border-top:1px solid var(--bd);border-radius:14px 14px 0 0;padding:12px 16px;box-shadow:0 -4px 14px rgba(20,40,30,.08)}
#vset .sbar span{margin-right:auto;font-weight:600;color:var(--mut)}#vset .sbar.dirty span{color:var(--od)}#vset .sbar .btn:disabled{opacity:.4;pointer-events:none}
#vset .mx td,#vset .mx th{text-align:center;padding:8px}#vset .mx td:first-child,#vset .mx th:first-child{text-align:left}#vset .mx input{width:auto}
#vset .kv{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;margin-top:12px}#vset .kv div{background:var(--bg2);border-radius:12px;padding:12px 14px}#vset .kv b{display:block;font-size:20px;color:var(--g)}#vset .kv span{font-size:13px;color:var(--mut)}
#vset .pill.ok{background:#e3f4ea;color:var(--g)}#vset .pill.off{background:#eceeea;color:var(--mut)}#vset .pill.warn{background:#fde8e6;color:var(--r)}
#vset .bc{font-size:13px;color:var(--mut);margin-bottom:2px}
.sub .nv small{display:block;font-weight:400;font-size:11.5px;opacity:.75;line-height:1.3}.sub .nv{align-items:flex-start;flex-direction:column;gap:0}
</style>`)}

function fld(k,x){const v=ST[k][x.k],a=`data-f="${x.k}"`,h=x.h?`<small class="m">${esc(x.h)}</small>`:"",cl=x.full?"full":"";
 if(x.type==="toggle")return `<label class="sw ${cl}"><input type="checkbox" ${a} ${v?"checked":""}><span class="sl"></span><span><b>${esc(x.l)}</b>${x.h?`<small>${esc(x.h)}</small>`:""}</span></label>`;
 if(x.type==="select")return `<label class="${cl}">${esc(x.l)}<select ${a}>${x.opts.map(o=>{o=opt(o);return `<option value="${esc(o[0])}" ${o[0]===v?"selected":""}>${esc(o[1])}</option>`}).join("")}</select>${h}</label>`;
 if(x.type==="textarea")return `<label class="${cl}">${esc(x.l)}<textarea ${a} rows="${x.rows}" ${x.max?`maxlength="${x.max}"`:""}>${esc(v)}</textarea>${h}</label>`;
 if(x.type==="secret")return `<label class="${cl}">${esc(x.l)}<div class="pwf"><input type="password" ${a} value="${esc(v)}" autocomplete="off"><button type="button" class="eye" data-eye aria-label="Show">${EYE}</button></div>${h}</label>`;
 if(x.type==="image")return `<div class="${cl}" style="display:grid;gap:4px"><span class="m">${esc(x.l)}</span><div class="im">${v?`<img src="${esc(v)}" alt="">`:'<div class="no">None</div>'}<input type="file" accept="image/*" data-up="${x.k}" style="width:auto"><button type="button" class="btn s" data-clr="${x.k}" ${v?"":"hidden"}>Remove</button></div>${h}</div>`;
 const t=x.type==="number"?"number":x.type;
 return `<label class="${cl}">${esc(x.l)}<input type="${t}" ${a} value="${esc(v)}" ${x.min!=null?`min="${x.min}"`:""} ${x.max!=null?`max="${x.max}"`:""} ${x.step?`step="${x.step}"`:""} ${x.type==="tel"?'inputmode="tel"':""}>${h}</label>`}

function draw(k){const s=SC[k],r=root();LAST=k;
 const ban=MISSING?`<div class="banner"><b>Settings tables not found.</b> Run <code>settings.sql</code> in the Supabase SQL editor, then reload. You can fill the form in, but it can’t be saved until then.</div>`:LOADERR?`<div class="banner">Couldn’t load saved settings: ${esc(LOADERR)}</div>`:"";
 r.innerHTML=`<div class="ph"><div class="bc">Settings &amp; Configuration</div><h1>${esc(s.t)}</h1><p>${esc(s.d)}</p></div>${ban}
 ${s.g.map(g=>`<section class="card sgc"><h2>${esc(g.t)}</h2>${g.note?`<p class="gn">${esc(g.note)}</p>`:""}<div class="sg">${g.f.map(x=>fld(k,x)).join("")}</div></section>`).join("")}
 <div id="sx"></div>
 <div class="sbar" id="sbar"><span id="sbm">All changes saved</span><button class="btn" id="sdisc" type="button">Discard</button><button class="btn p" id="ssave" type="button">Save changes</button></div>`;
 bar(k);bind(k);if(s.x==="security")secPanels();if(s.x==="system")sysPanels()}

const dirty=k=>JSON.stringify(ST[k])!==ORIG[k];
function bar(k){const d=dirty(k),b=document.getElementById("sbar");if(!b)return;b.classList.toggle("dirty",d);$("#sbm").textContent=d?"You have unsaved changes":"All changes saved";$("#ssave").disabled=!d;$("#sdisc").disabled=!d}
function find(k,key){for(const g of SC[k].g)for(const x of g.f)if(x.k===key)return x}
function bind(k){const r=root();
 const upd=e=>{const el=e.target.closest("[data-f]");if(!el)return;const x=find(k,el.dataset.f);ST[k][x.k]=x.type==="toggle"?el.checked:x.type==="number"?(el.value===""?"":Number(el.value)):el.value;bar(k)};
 r.oninput=upd;r.onchange=async e=>{upd(e);
  const m=e.target.closest("[data-m]");if(m){const [ro,mo]=m.dataset.m.split("|");(ST.security.roles[ro]=ST.security.roles[ro]||{})[mo]=m.checked;bar("security");return}
  const up=e.target.closest("[data-up]");if(up&&up.files[0])await upload(k,up.dataset.up,up.files[0])};
 r.onclick=async e=>{
  const c=e.target.closest("[data-clr]");if(c){ST[k][c.dataset.clr]="";draw(k);bar(k);return}
  if(e.target.closest("#sdisc")){ST[k]=JSON.parse(ORIG[k]);draw(k);return}
  if(e.target.closest("#ssave"))save(k)}}

async function upload(k,key,file){
 if(!file.type.startsWith("image/")){toast("Please choose an image file.","error");return}
 if(file.size>2*1024*1024){toast("Image must be 2 MB or smaller.","error");return}
 try{const ext=(file.name.split(".").pop()||"png").toLowerCase().replace(/[^a-z0-9]/g,""),path=`site/${k}-${key}-${Date.now()}.${ext}`;
  const up=await sb.storage.from("listing-images").upload(path,file,{contentType:file.type,upsert:true});if(up.error)throw up.error;
  ST[k][key]=sb.storage.from("listing-images").getPublicUrl(path).data.publicUrl;draw(k);bar(k)}catch(err){toast(err.message||"Upload failed","error")}}

function validate(k){const v=ST[k];
 for(const g of SC[k].g)for(const x of g.f){const val=v[x.k];
  if(x.req&&!String(val).trim())return `${x.l} is required.`;
  if(val===""||val==null)continue;
  if(x.type==="number"){if(isNaN(val))return `${x.l} must be a number.`;if(x.min!=null&&val<x.min)return `${x.l} can’t be less than ${x.min}.`;if(x.max!=null&&val>x.max)return `${x.l} can’t be more than ${x.max}.`}
  if(x.type==="email"&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val))return `${x.l} isn’t a valid email address.`;
  if(x.type==="url"&&val!=="https://"&&!/^https?:\/\/\S+\.\S+/.test(val))return `${x.l} must start with http:// or https://`}
 if(k==="financial"){if(v.wd_max!==""&&v.wd_min!==""&&v.wd_max<v.wd_min)return "Maximum withdrawal can’t be lower than the minimum withdrawal."}
 if(k==="security"&&v.ip_on&&!String(v.ip_list).trim())return "Add at least one IP address, or turn off IP restrictions."
 return ""}

async function save(k){const err=validate(k);if(err){toast(err,"error");return}
 const prev=JSON.parse(ORIG[k]),cur=ST[k],all=[];SC[k].g.forEach(g=>g.f.forEach(x=>all.push(x)));
 const ch=all.filter(x=>JSON.stringify(prev[x.k])!==JSON.stringify(cur[x.k])).map(x=>{const m=x.type==="secret";return {field:x.l,from:m?"•••":prev[x.k],to:m?"•••":cur[x.k]}});
 if(JSON.stringify(prev.roles)!==JSON.stringify(cur.roles))ch.push({field:"Roles & permissions",from:"changed",to:"changed"});
 if(!ch.length){toast("Nothing to save.","ok");return}
 if(k==="system"&&cur.mm&&!prev.mm&&!await askConfirm({title:"Turn on maintenance mode?",msg:"Visitors to the public site will see the maintenance page until you turn this off.",ok:"Yes, turn it on"}))return;
 if(k==="registration"&&!cur.open&&prev.open&&!await askConfirm({title:"Close registrations?",msg:"Nobody will be able to create a new account until you reopen sign-up.",ok:"Yes, close sign-up"}))return;
 const b=$("#ssave");b.disabled=true;b.textContent="Saving…";
 try{const u=(await sb.auth.getSession()).data.session?.user;
  const r=await sb.from("platform_settings").upsert({key:k,value:cur,updated_at:new Date().toISOString(),updated_by:u?.id||null});if(r.error)throw r.error;
  await sb.from("settings_audit").insert({section:SC[k].t,changes:ch,admin_id:u?.id||null,admin_email:u?.email||null});
  ORIG[k]=JSON.stringify(cur);toast("Settings saved.","ok");if(SC[k].x==="security")auditPanel()}
 catch(e){toast(e.message||"Couldn’t save settings.","error")}
 b.textContent="Save changes";bar(k)}

const when=d=>d?new Date(d).toLocaleString("en-KE",{dateStyle:"medium",timeStyle:"short"}):"—";
async function auditPanel(){const el=document.getElementById("aud");if(!el)return;
 const r=await sb.from("settings_audit").select("*").order("created_at",{ascending:false}).limit(30);
 el.innerHTML=r.error?`<p class="m">Audit log unavailable: ${esc(r.error.message)}</p>`:!(r.data||[]).length?'<p class="m">No settings changes recorded yet.</p>':
 `<div class="wrap"><table style="min-width:600px"><thead><tr><th>When</th><th>Admin</th><th>Section</th><th>Changed</th></tr></thead><tbody>${r.data.map(a=>`<tr><td>${esc(when(a.created_at))}</td><td>${esc(a.admin_email||"—")}</td><td>${esc(a.section)}</td><td>${esc((a.changes||[]).map(c=>c.field).join(", "))}</td></tr>`).join("")}</tbody></table></div>`}

async function secPanels(){const k="security",r=ST[k].roles||{};
 $("#sx").innerHTML=`<section class="card sgc"><h2>Admin roles &amp; permissions</h2><p class="gn">Choose which areas each role can open. Super Admin always has full access.</p>
  <div class="wrap" style="margin-top:12px"><table class="mx" style="min-width:640px"><thead><tr><th>Role</th>${MODS.map(m=>`<th>${m}</th>`).join("")}</tr></thead><tbody>
  ${ROLES.map(ro=>`<tr><td><b>${ro}</b></td>${MODS.map(m=>`<td><input type="checkbox" data-m="${ro}|${m}" aria-label="${ro} – ${m}" ${ro==="Super Admin"?"checked disabled":(r[ro]||{})[m]?"checked":""}></td>`).join("")}</tr>`).join("")}</tbody></table></div></section>
  <section class="card sgc"><h2>Admin accounts &amp; active session</h2><div id="adm" class="m" style="margin-top:10px">Loading…</div></section>
  <section class="card sgc"><h2>Audit log</h2><p class="gn">Every change saved on a Settings page is recorded here.</p><div id="aud" style="margin-top:10px">Loading…</div></section>`;
 auditPanel();
 const [a,s]=await Promise.all([sb.from("profiles").select("*").eq("role","admin").limit(50),sb.auth.getSession()]),u=s.data.session?.user,el=document.getElementById("adm");if(!el)return;
 el.innerHTML=`<p style="margin:0 0 10px;color:var(--tx)">Signed in as <b>${esc(u?.email||"—")}</b> · last sign-in ${esc(when(u?.last_sign_in_at))}</p>`+
 (a.error?`<p class="m">${esc(a.error.message)}</p>`:`<div class="wrap"><table style="min-width:520px"><thead><tr><th>Name</th><th>Email</th><th>Joined</th></tr></thead><tbody>${(a.data||[]).map(p=>`<tr><td>${esc(p.full_name||p.name||"—")}</td><td>${esc(p.email||"—")}</td><td>${esc(when(p.created_at))}</td></tr>`).join("")}</tbody></table></div>`)+
 `<p class="m" style="margin-top:8px">Add or remove admins from User Management. Detailed login history and remote session sign-out need server-side auth logs and aren’t available from the browser.</p>`}

async function bucketSize(path,depth,box){if(box.calls++>40){box.partial=true;return}
 const r=await sb.storage.from("listing-images").list(path,{limit:1000});if(r.error)throw r.error;
 for(const o of r.data||[]){if(o.id)box.bytes+=(o.metadata&&o.metadata.size)||0;else if(depth>0)await bucketSize((path?path+"/":"")+o.name,depth-1,box)}}
const mb=b=>b>1073741824?(b/1073741824).toFixed(2)+" GB":(b/1048576).toFixed(1)+" MB";

async function sysPanels(){
 $("#sx").innerHTML=`<section class="card sgc"><h2>System health</h2><div class="kv" id="hl"><div><b>…</b><span>Checking database</span></div></div></section>
 <section class="card sgc"><h2>API integration status</h2><p class="gn">Shows whether each integration has been enabled and filled in. It doesn’t test the live connection.</p><div class="kv" id="ap" style="margin-top:12px"></div></section>
 <section class="card sgc"><h2>Platform version</h2><div class="kv"><div><b>v${VER}</b><span>Admin Center · build ${BUILD}</span></div><div><b>${ERRS}</b><span>Browser errors this session</span></div></div></section>
 <section class="card sgc"><h2>System log</h2><p class="gn">Recent configuration changes across all Settings pages.</p><div id="aud" style="margin-top:10px">Loading…</div></section>`;
 const s=ST,ok=(on,...need)=>!on?["off","Disabled"]:need.every(x=>String(x||"").trim())?["ok","Configured"]:["warn","Incomplete"];
 const rows=[["M-Pesa",ok(s.payments.mp_on,s.payments.mp_code,s.payments.mp_key,s.payments.mp_secret,s.payments.mp_pass)],["Bank transfers",ok(s.payments.bk_on,s.payments.bk_acc)],["Card payments",ok(s.payments.cd_on,s.payments.cd_pub,s.payments.cd_secret)],
  ["Email (SMTP)",ok(!!s.notifications.sm_host,s.notifications.sm_host,s.notifications.sm_user,s.notifications.sm_pass,s.notifications.sm_from)],["SMS gateway",ok(s.notifications.sms_on,s.notifications.sms_key,s.notifications.sms_sender)],
  ["WhatsApp",ok(s.notifications.wa_on,s.notifications.wa_id,s.notifications.wa_token)],["Push notifications",ok(s.notifications.pu_on,s.notifications.pu_key)],["Error monitoring",ok(s.system.em_on,s.system.em_dsn)]];
 document.getElementById("ap").innerHTML=rows.map(([n,[c,l]])=>`<div><span>${n}</span><b style="font-size:15px"><span class="pill ${c}">${l}</span></b></div>`).join("");
 auditPanel();
 const t0=performance.now(),tabs=["profiles","shops","products","jobs","orders"],cnt=await Promise.all(tabs.map(t=>sb.from(t).select("id",{count:"exact",head:true}))),ms=Math.round(performance.now()-t0),bad=cnt.find(c=>c.error&&c.error.code!=="42P01"&&c.status!==404),box={bytes:0,calls:0,partial:false};
 try{await bucketSize("",2,box)}catch(e){box.err=true}
 const hl=document.getElementById("hl");if(!hl)return;
 hl.innerHTML=`<div><b>${bad?"Problem":"Connected"}</b><span>Database ${bad?esc(bad.error.message):"· "+ms+" ms"}</span></div>`+
 tabs.map((t,i)=>`<div><b>${cnt[i].error?"—":num(cnt[i].count||0)}</b><span>${t[0].toUpperCase()+t.slice(1)} records</span></div>`).join("")+
 `<div><b>${box.err?"—":(box.partial?"≥ ":"")+mb(box.bytes)}</b><span>Image storage used</span></div>`}

window.settingsAdmin=async function(k){css();k=SC[k]?k:"general";LAST=k;const r=root();r.innerHTML='<div class="empty">Loading settings…</div>';
 if(!sb){r.innerHTML='<div class="empty">Supabase isn’t configured.</div>';return}
 await load();if(page!=="set:"+k)return;draw(k)};
})();vv