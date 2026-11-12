/* SOKO Smart admin: Reports & Complaints and Promotions & Ads.
   Needs admin.html globals: sb, $, esc, toast, ic, fmt, num, askConfirm, badges. Also ads.js (SokoAds). */
(()=>{
const css=`<style>
.pill.rv{background:#e8f0fb;color:#1d4f91}.pill.pz{background:#eee;color:#555}.pill.live{background:#e3f4ea;color:var(--g)}
.xr .wrap table{min-width:760px}.xr td,.xr th{padding:10px 12px;text-align:left;border-bottom:1px solid var(--bd);vertical-align:middle}
.xr th{font-size:12px;text-transform:uppercase;letter-spacing:.04em;color:var(--mut);background:var(--bg2)}
.xr .bar{height:6px;border-radius:3px;background:var(--bd);overflow:hidden;margin-top:4px;min-width:90px}.xr .bar i{display:block;height:100%;background:var(--a)}
.xr .kv{display:grid;grid-template-columns:130px 1fr;gap:6px 12px;margin:10px 0;font-size:14px}.xr .kv span{color:var(--mut)}
.xr .msgbox{background:var(--bg2);border-radius:10px;padding:10px 12px;white-space:pre-wrap;overflow-wrap:anywhere;margin:6px 0 12px}
.xr .two{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.xr .frm{display:grid;gap:12px;background:var(--bg);border-radius:14px;padding:18px;box-shadow:0 1px 3px rgba(20,40,30,.07);max-width:620px}
.xr .thx{width:56px;height:42px;border-radius:8px;object-fit:cover;display:block}
</style>`;
const sh=(el)=>{if(!el.dataset.css){el.insertAdjacentHTML("afterbegin",css);el.dataset.css=1}};
const when=d=>d?new Date(d).toLocaleDateString("en-KE",{day:"numeric",month:"short",year:"numeric"}):"";
const dlg=h=>{$("#dc").innerHTML=h;if(!$("#dlg").open)$("#dlg").showModal()};
const ticket=c=>c.ticket||"SC-"+String(c.id).replace(/-/g,"").slice(0,6).toUpperCase();
const needSql=m=>/relation .*(complaints|ads)|schema cache|does not exist/i.test(m||"")?"This feature is not set up yet. Run supabase-complaints-ads.sql in the Supabase SQL editor, then reload. ("+m+")":m;

/* =========================================================== COMPLAINTS */
const CST={open:["New","" ],in_review:["In review","rv"],resolved:["Resolved","approved"],dismissed:["Closed","rejected"]};
let CR=[],CF="",CQ="";
window.complaintsAdmin=async function(){
 const el=$("#vr");sh(el);el.classList.add("xr");
 if(!el.dataset.w){el.insertAdjacentHTML("beforeend",`<div class="ph"><h1>Reports &amp; Complaints</h1><p>Complaints sent from the “File a complaint” form in the website footer.</p></div><div class="stats" id="cst"></div><div class="tb"><input id="cq" type="search" placeholder="Search by reference, name, email or subject…" aria-label="Search complaints"><select id="cf" aria-label="Status"><option value="">All statuses</option><option value="open">New</option><option value="in_review">In review</option><option value="resolved">Resolved</option><option value="dismissed">Closed</option></select></div><div class="wrap"><table><thead><tr><th>Ref</th><th>From</th><th>Problem</th><th>Date</th><th>Status</th><th></th></tr></thead><tbody id="crow"><tr><td colspan="6" class="empty">Loading…</td></tr></tbody></table></div>`);
  $("#cf").onchange=e=>{CF=e.target.value;draw()};let t;$("#cq").oninput=e=>{clearTimeout(t);t=setTimeout(()=>{CQ=e.target.value.trim().toLowerCase();draw()},250)};
  el.addEventListener("click",e=>{const b=e.target.closest("[data-cv]");if(b)open(b.dataset.cv)});el.dataset.w=1}
 const {data,error}=await sb.from("complaints").select("*").order("created_at",{ascending:false}).limit(300);
 if(error){$("#crow").innerHTML=`<tr><td colspan="6" class="empty">${esc(needSql(error.message))}</td></tr>`;return}
 CR=data||[];draw()};
function draw(){
 const n=s=>CR.filter(c=>c.status===s).length;
 $("#cst").innerHTML=[["New",n("open")],["In review",n("in_review")],["Resolved",n("resolved")],["Closed",n("dismissed")]].map(x=>`<div class="st"><b>${num(x[1])}</b><span>${x[0]}</span></div>`).join("");
 const rows=CR.filter(c=>(!CF||c.status===CF)&&(!CQ||[ticket(c),c.full_name,c.email,c.subject,c.reference].join(" ").toLowerCase().includes(CQ)));
 $("#crow").innerHTML=rows.map(c=>{const s=CST[c.status]||CST.open;return `<tr><td><b>${esc(ticket(c))}</b></td><td>${esc(c.full_name)}<div class="m">${esc(c.email)}${c.user_id?" · member":" · guest"}</div></td><td><b>${esc(c.subject)}</b><div class="m">${esc(c.category)}</div></td><td class="m">${when(c.created_at)}</td><td><span class="pill ${s[1]}">${s[0]}</span></td><td><button class="btn s" data-cv="${esc(c.id)}">Open</button></td></tr>`}).join("")||'<tr><td colspan="6" class="empty">No complaints found.</td></tr>'}
function open(id){
 const c=CR.find(x=>String(x.id)===id);if(!c)return;
 dlg(`<div class="xr"><h3>${esc(ticket(c))} · ${esc(c.subject)}</h3>
 <div class="kv"><span>Type</span><b>${esc(c.category)}</b><span>From</span><b>${esc(c.full_name)}${c.user_id?" (member)":" (guest)"}</b><span>Email</span><a href="mailto:${esc(c.email)}">${esc(c.email)}</a>${c.phone?`<span>Phone</span><a href="tel:${esc(c.phone)}">${esc(c.phone)}</a>`:""}${c.reference?`<span>About</span><b style="overflow-wrap:anywhere">${/^https?:\/\//i.test(c.reference)?`<a target="_blank" rel="noopener" href="${esc(c.reference)}">${esc(c.reference)}</a>`:esc(c.reference)}</b>`:""}<span>Sent</span><b>${when(c.created_at)}</b></div>
 <b>What happened</b><div class="msgbox">${esc(c.message)}</div>${c.evidence_url?`<p><a target="_blank" rel="noopener" href="${esc(c.evidence_url)}"><img alt="Evidence" src="${esc(c.evidence_url)}" style="max-width:100%;max-height:200px;border-radius:10px"></a></p>`:""}
 <form id="cfr" data-id="${esc(c.id)}" style="display:grid;gap:10px"><label>Status<select name="st">${Object.entries(CST).map(([k,v])=>`<option value="${k}" ${k===c.status?"selected":""}>${v[0]}</option>`).join("")}</select></label>
 <label>Reply to the customer<textarea name="rp" rows="5" maxlength="1500" placeholder="Write what we found or what happens next. Members receive it in Messages and as a notification.">${esc(c.admin_reply||"")}</textarea></label>
 <div style="display:flex;gap:8px;justify-content:flex-end;flex-wrap:wrap"><button type="button" class="btn" id="ec">Close</button><button class="btn p">Save &amp; notify</button></div></form></div>`)}
document.addEventListener("submit",async e=>{const f=e.target;if(f.id!=="cfr")return;e.preventDefault();
 const c=CR.find(x=>String(x.id)===f.dataset.id),st=f.st.value,rp=f.rp.value.trim(),btn=f.querySelector(".btn.p");btn.disabled=true;
 const p={status:st,admin_reply:rp||null,resolved_at:["resolved","dismissed"].includes(st)?new Date().toISOString():null};
 const {error}=await sb.from("complaints").update(p).eq("id",c.id);
 if(error){btn.disabled=false;toast(error.message,"error");return}
 let note="";
 if(rp&&rp!==(c.admin_reply||"")){
  if(c.user_id){const body=`Reply to your complaint ${ticket(c)} (“${c.subject}”):\n\n${rp}\n\nStatus: ${CST[st][0]}`;const r=await sb.rpc("admin_notify_user",{p_user:c.user_id,p_body:body});note=r.error?" (saved, but the message could not be sent: "+r.error.message+")":" The customer was notified in Messages."}
  else note=" This customer was a guest, so please also email "+c.email+"."}
 else if(c.user_id)note=" The customer was notified.";
 $("#dlg").close();toast("Complaint updated."+note);window.complaintsAdmin();if(typeof badges==="function")badges()});

/* =========================================================== ADS */
const AST={draft:["Draft",""],pending:["Needs review","rv"],active:["Live","live"],paused:["Paused","pz"],rejected:["Rejected","rejected"],completed:["Completed","pz"]};
let AR=[],AT="queue",AUID=null,ACFG=null;
window.adsAdmin=async function(){
 const el=$("#vpr");sh(el);el.classList.add("xr");
 if(!el.dataset.w){
  el.insertAdjacentHTML("beforeend",`<div class="ph"><h1>Promotions &amp; Ads</h1><p>Review seller ads, run your own house promotions and control how pop-ups behave.</p></div><div class="tabs" id="atabs"><button data-at="queue" class="on">Review queue</button><button data-at="all">All ads</button><button data-at="set">Settings</button></div><div id="abody"></div>`);
  el.addEventListener("click",onClick);el.addEventListener("submit",onSubmit);el.dataset.w=1}
 const {data:{session}}=await sb.auth.getSession();AUID=session&&session.user.id;
 await load()};
async function load(){
 $("#abody").innerHTML='<div class="empty">Loading…</div>';
 const {data,error}=await sb.from("ads").select("*").order("created_at",{ascending:false}).limit(300);
 if(error){$("#abody").innerHTML=`<div class="empty">${esc(needSql(error.message))}</div>`;return}
 AR=data||[];ACFG=await SokoAds.loadCfg();view()}
function view(){
 document.querySelectorAll("#atabs button").forEach(b=>b.classList.toggle("on",b.dataset.at===AT));
 if(AT==="set")return settings();
 const rows=AT==="queue"?AR.filter(a=>a.status==="pending"):AR;
 const tot=AR.filter(a=>!a.is_house).reduce((s,a)=>s+ +a.spend,0),live=AR.filter(a=>a.status==="active").length,pend=AR.filter(a=>a.status==="pending").length;
 const imp=AR.reduce((s,a)=>s+ +a.impressions,0),clk=AR.reduce((s,a)=>s+ +a.clicks,0);
 $("#abody").innerHTML=`<div class="stats"><div class="st"><b>${num(pend)}</b><span>Waiting for review</span></div><div class="st"><b>${num(live)}</b><span>Live now</span></div><div class="st"><b>${num(imp)}</b><span>Views</span></div><div class="st"><b>${num(clk)}</b><span>Taps</span></div><div class="st"><b>${fmt(Math.round(tot))}</b><span>Seller ad spend</span></div></div>
 <div class="tb"><button class="btn p" data-ahouse>+ New house ad (free promo)</button></div>
 <div class="wrap"><table><thead><tr><th></th><th>Ad</th><th>Owner</th><th>Status</th><th>Budget</th><th>Results</th><th>Actions</th></tr></thead><tbody>${rows.map(row).join("")||`<tr><td colspan="7" class="empty">${AT==="queue"?"Nothing waiting for review.":"No ads yet."}</td></tr>`}</tbody></table></div>`}
function row(a){
 const s=AST[a.status]||AST.draft,pc=a.budget_total?Math.min(100,Math.round(+a.spend/+a.budget_total*100)):0,th=(SokoAds.THEMES[a.theme]||SokoAds.THEMES.green)[1];
 const acts=[`<button class="btn s" data-apv="${esc(a.id)}">Preview</button>`];
 if(a.status==="pending"||a.status==="rejected")acts.push(`<button class="btn s p" data-aok="${esc(a.id)}">Approve</button>`);
 if(a.status==="pending")acts.push(`<button class="btn s d" data-ano="${esc(a.id)}">Reject</button>`);
 if(a.status==="active")acts.push(`<button class="btn s" data-aset="${esc(a.id)}" data-to="paused">Pause</button>`);
 if(a.status==="paused"||(a.status==="draft"&&a.is_house))acts.push(`<button class="btn s" data-aset="${esc(a.id)}" data-to="active">${a.status==="paused"?"Resume":"Publish"}</button>`);
 if(a.is_house)acts.push(`<button class="btn s" data-aed="${esc(a.id)}">Edit</button>`);
 acts.push(`<button class="btn s d" data-adel="${esc(a.id)}">Delete</button>`);
 return `<tr><td>${a.image_url&&!SokoAds.isVideo(a.image_url)?`<img class="thx" alt="" src="${esc(a.image_url)}">`:`<div class="thx" style="background:${th};display:grid;place-items:center;color:#fff">${a.image_url?"▶":""}</div>`}</td><td><b>${esc(a.headline)}</b><div class="m">${esc(a.name)} · ${esc((SokoAds.FORMATS[a.format]||{}).n||"")}</div></td>
 <td>${a.is_house?'<span class="pill approved">House ad</span>':esc(a.shop_name||"Seller")}</td><td><span class="pill ${s[1]}">${s[0]}</span>${a.reject_reason?`<div class="m">${esc(a.reject_reason)}</div>`:""}<div class="m">${esc(a.start_date||"")}${a.end_date?" → "+esc(a.end_date):""}</div></td>
 <td>${a.is_house?(a.budget_total?fmt(+a.budget_total)+" cap":"No cap"):`${fmt(Math.round(+a.spend))} / ${fmt(+a.budget_total||0)}<div class="bar"><i style="width:${pc}%"></i></div>`}</td>
 <td>${num(a.impressions)} views<div class="m">${num(a.clicks)} taps${+a.impressions?" · "+(a.clicks/a.impressions*100).toFixed(1)+"%":""}</div></td><td><div class="acts">${acts.join("")}</div></td></tr>`}

function settings(){
 const c=ACFG;
 $("#abody").innerHTML=`<form class="frm" id="aset"><h3>Ad settings</h3>
 <label class="hc-ck" style="display:flex;gap:8px;align-items:center;flex-direction:row"><input type="checkbox" name="enabled" style="width:auto" ${c.enabled!==false?"checked":""}> Show pop-up ads on the website</label>
 <div class="two"><label>Price per 1,000 views (KSh)<input name="cpm" type="number" min="0" step="1" value="${+c.cpm}"></label><label>Price per tap (KSh)<input name="cpc" type="number" min="0" step="1" value="${+c.cpc}"></label></div>
 <label>Minimum seller budget (KSh)<input name="min_budget" type="number" min="0" step="50" value="${+c.min_budget}"></label>
 <h3 style="margin-top:6px">How pop-ups behave</h3>
 <div class="two"><label>Max ads per visit<input name="max_per_session" type="number" min="1" max="6" value="${+c.max_per_session}"></label><label>First ad after (seconds)<input name="first_delay" type="number" min="0" max="120" value="${+c.first_delay}"></label></div>
 <div class="two"><label>Gap between ads (seconds)<input name="min_gap" type="number" min="10" max="600" value="${+c.min_gap}"></label><label>First ad after scrolling (% of page)<input name="scroll_pct" type="number" min="0" max="90" value="${+c.scroll_pct}"></label></div>
 <p class="m" style="margin:0">Visitors who close an ad do not see that same ad again for 24 hours. Ads never show while someone is typing or chatting, or on the profile, Shop Manager, sign-up and complaint pages.</p>
 <div><button class="btn p">Save settings</button></div></form>`}

async function onSubmit(e){const f=e.target;
 if(f.id==="aset"){e.preventDefault();const n=k=>Number(f[k].value)||0;
  const v={enabled:f.enabled.checked,cpm:n("cpm"),cpc:n("cpc"),min_budget:n("min_budget"),max_per_session:n("max_per_session")||2,first_delay:n("first_delay"),min_gap:n("min_gap")||60,scroll_pct:n("scroll_pct")};
  const {data,error}=await sb.from("site_content").upsert({key:"ads",value:v,updated_at:new Date().toISOString()},{onConflict:"key"}).select("key");
  if(error||!data||!data.length){toast(error?error.message:"The settings were not saved. Run supabase-complaints-ads.sql in Supabase.","error");return}
  ACFG=Object.assign({},ACFG,v);toast("Ad settings saved.")}
 if(f.id==="arj"){e.preventDefault();const id=f.dataset.id,r=f.rs.value.trim();
  const {error}=await sb.from("ads").update({status:"rejected",reject_reason:r||"Please review the ad and resubmit."}).eq("id",id);
  if(error){toast(error.message,"error");return}$("#dlg").close();toast("Ad rejected. The seller was notified.");load();if(typeof badges==="function")badges()}}

async function onClick(e){const g=s=>e.target.closest(s);let b;
 if(b=g("[data-at]")){AT=b.dataset.at;view();return}
 if(g("[data-ahouse]")){SokoAds.wizard({admin:true,userId:AUID,cfg:ACFG,onDone:()=>{load();if(typeof badges==="function")badges()}});return}
 if(b=g("[data-aed]")){SokoAds.wizard({admin:true,ad:AR.find(a=>String(a.id)===b.dataset.aed),userId:AUID,cfg:ACFG,onDone:()=>load()});return}
 if(b=g("[data-apv]")){const a=AR.find(x=>String(x.id)===b.dataset.apv);SokoAds.css();
  dlg(`<h3>Preview</h3><div class="adstage" id="apvs">${SokoAds.card(a)}</div><div class="kv"><span>Button leads to</span><b style="overflow-wrap:anywhere">${esc(a.cta_url)}</b><span>Shown on</span><b>${esc((a.placements||[]).map(k=>SokoAds.PAGES[k]).join(", "))}</b><span>Audience</span><b>${esc(a.audience)}</b></div><div style="text-align:right"><button class="btn" id="ec">Close</button></div>`);
  $("#apvs").onclick=ev=>{ev.preventDefault()};return}
 if(b=g("[data-aok]")){const {error}=await sb.from("ads").update({status:"active",reject_reason:null}).eq("id",b.dataset.aok);error?toast(error.message,"error"):(toast("Ad approved and live. The seller was notified."),load(),typeof badges==="function"&&badges());return}
 if(b=g("[data-ano]")){dlg(`<h3>Reject this ad</h3><form id="arj" data-id="${esc(b.dataset.ano)}" style="display:grid;gap:10px"><label>Tell the seller what to change<textarea name="rs" rows="4" maxlength="300" placeholder="e.g. The image is blurry, please upload a clearer photo."></textarea></label><div style="display:flex;gap:8px;justify-content:flex-end"><button type="button" class="btn" id="ec">Cancel</button><button class="btn d">Reject ad</button></div></form>`);return}
 if(b=g("[data-aset]")){const {error}=await sb.from("ads").update({status:b.dataset.to}).eq("id",b.dataset.aset);error?toast(error.message,"error"):(toast("Ad updated"),load());return}
 if(b=g("[data-adel]")){if(!await askConfirm({title:"Delete this ad?",msg:"The ad and its results are removed for good.",ok:"Yes, delete"}))return;const {error}=await sb.from("ads").delete().eq("id",b.dataset.adel);error?toast(error.message,"error"):(toast("Ad deleted"),load(),typeof badges==="function"&&badges())}}
})();