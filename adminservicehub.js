/* SOKO Smart admin: Services Hub (service providers, casual workers, requests).
   Defines window.serviceHubAdmin. Uses admin.html globals: sb, $, esc, ic, toast, askConfirm, COUNTIES. */
(()=>{
const D=s=>document.querySelector(s),kes=n=>"KSh "+Number(n||0).toLocaleString("en-KE");
const A=x=>Array.isArray(x)?x:[];
const dt=d=>d?new Date(d).toLocaleDateString("en-KE",{day:"numeric",month:"short",year:"numeric"}):"";
const st=document.createElement("style");st.textContent=`
#vsh .ph{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;flex-wrap:wrap}
#vsh .kpis{grid-template-columns:repeat(4,minmax(0,1fr))}@media(max-width:900px){#vsh .kpis{grid-template-columns:repeat(2,minmax(0,1fr))}}
#vsh .card{margin-bottom:16px}#vsh .ch{display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:10px}#vsh .ch h3{margin:0;font-size:18px}
#vsh .tabs{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px}#vsh .tabs button{border:1px solid var(--bd);background:#fff;border-radius:999px;padding:7px 16px;font-weight:700;cursor:pointer}#vsh .tabs .on{background:var(--g);color:#fff;border-color:var(--g)}
#vsh td{vertical-align:middle}#vsh td:last-child{white-space:nowrap}
#vsh .sl{display:flex;align-items:center;gap:10px}
#vsh .av2,#dc .av2{width:42px;height:42px;border-radius:50%;background:var(--g);color:#fff;display:grid;place-items:center;font-weight:700;overflow:hidden;flex:none}#vsh .av2 img,#dc .av2 img{width:100%;height:100%;object-fit:cover}
#vsh .pill.suspended,#vsh .pill.rejected,#vsh .pill.closed{background:#fde8e6;color:var(--r)}#vsh .pill.hired{background:#e3f4ea;color:var(--g)}
#dlg.shwide{max-width:760px}
#dc .fm-h{display:flex;justify-content:space-between;align-items:center;margin:0 0 12px}#dc .fm-h h3{margin:0;font-size:18px}#dc .fm-h button{background:none;border:0;font-size:24px;line-height:1;padding:0 4px;cursor:pointer}
#dc .fm{display:grid;gap:12px}#dc .two{display:grid;grid-template-columns:1fr 1fr;gap:10px}@media(max-width:560px){#dc .two{grid-template-columns:1fr}}
#dc .fa2{display:flex;gap:8px;justify-content:flex-end;flex-wrap:wrap;margin-top:6px}
#dc .pg{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:10px}#dc .pg .it{position:relative;border-radius:10px;overflow:hidden;background:#111;aspect-ratio:1}#dc .pg img,#dc .pg video{width:100%;height:100%;object-fit:cover}
#dc .pg .bar{position:absolute;left:0;right:0;bottom:0;display:flex;gap:4px;justify-content:center;padding:4px;background:rgba(0,0,0,.55)}#dc .pg .bar button{font-size:11px;padding:2px 7px}
#dc .pg .tg{position:absolute;left:5px;top:5px;font-size:11px}
#dc .bnr{width:100%;max-height:180px;object-fit:cover;border-radius:12px}
#dc .box{border:1px solid var(--bd);border-radius:10px;padding:10px 12px;font-size:13px;line-height:1.7;background:#f6f7f4}
#dc .chk{display:grid;gap:6px;max-height:200px;overflow:auto;border:1px solid var(--bd);border-radius:10px;padding:10px}#dc .chk label{display:flex;gap:8px;align-items:center;font-weight:500}#dc .chk input{width:auto}
#dc .gh{font-weight:800;font-size:12px;text-transform:uppercase;color:var(--g);margin-top:4px}
`;document.head.appendChild(st);

let S=null,V="overview",ERRS=[],bound=false;
const q=(p,t)=>p.then(r=>{if(r.error){console.error("service hub admin: "+t,r.error);ERRS.push(t+": "+r.error.message)}return r.data||[]},e=>{ERRS.push(t+": "+(e&&e.message||e));return[]});
const open=h=>{D("#dc").innerHTML=h;const d=D("#dlg");d.classList.add("shwide");if(!d._sw){d._sw=1;d.addEventListener("close",()=>d.classList.remove("shwide"))}if(!d.open)d.showModal();D("#dc").querySelectorAll("[data-x]").forEach(b=>b.onclick=()=>d.close())};
const mh=t=>`<div class="fm-h"><h3>${t}</h3><button data-x type="button" aria-label="Close">×</button></div>`;
const nm=(a,id)=>(a.find(x=>x.id===id)||{}).name||(a.find(x=>x.id===id)||{}).title||"";
const av=f=>`<span class="av2">${f.avatar_url?`<img alt="" src="${esc(f.avatar_url)}">`:esc((f.name||"?")[0].toUpperCase())}</span>`;
const place=f=>[f.town,f.county].filter(Boolean).join(", ")||"-";
const price=s=>{const a=+s.base_price||0,b=+s.max_price||0;return a&&b&&a!==b?kes(a)+" – "+kes(b):a||b?kes(a||b):"-"};
const spOf=id=>S.ps.filter(x=>x.provider_id===id).map(x=>nm(S.sv,x.service_id)).filter(Boolean);
const pend=()=>S.pr.filter(p=>p.status==="pending");

async function load(){ERRS=[];
 const [cat,sv,pr,ps,pf,pv,rq,ap]=await Promise.all([
  q(sb.from("sh_categories").select("*").order("sort_order").order("name"),"categories"),q(sb.from("sh_services").select("*").order("sort_order").order("title"),"services"),
  q(sb.from("sh_providers").select("*").order("created_at",{ascending:false}),"providers"),q(sb.from("sh_provider_services").select("provider_id,service_id"),"provider services"),
  q(sb.from("sh_portfolio").select("*").order("created_at",{ascending:false}).limit(1000),"portfolio"),q(sb.from("sh_provider_private").select("*"),"contact details"),
  q(sb.from("sh_requests").select("*").order("created_at",{ascending:false}).limit(300),"requests"),q(sb.from("sh_applications").select("id,request_id,provider_id,status").limit(2000),"applications")]);
 S={cat,sv,pr,ps,pf,pv,rq,ap}}

function paint(){const e=D("#vsh");if(!S){e.innerHTML='<div class="card">Loading…</div>';return}
 const ok=S.pr.filter(p=>p.status==="approved"),pf=S.pf.filter(p=>p.status==="pending");
 const SECS=[["overview","Overview",pend().length+pf.length||null],["services","Services",S.sv.length],["providers","Service providers",S.pr.length],["portfolio","Work gallery",pf.length||null],["requests","Requests",S.rq.length]];
 e.innerHTML=`<div class="ph"><div><h1>Services Hub</h1><p>Service providers, casual workers and the services clients can hire them for.</p></div><button class="btn p" data-a="newsv">+ Add a service</button></div>
 ${ERRS.length?`<div class="card" style="border-color:var(--r)"><b>Some data could not load.</b><div class="m">${esc(ERRS[0])}${/relation|schema cache|does not exist/i.test(ERRS[0])?" — run supabase-servicehub.sql in Supabase first.":""}</div></div>`:""}
 <div class="tabs">${SECS.map(s=>`<button data-a="tab" data-id="${s[0]}" class="${V===s[0]?"on":""}">${s[1]}${s[2]?` (${s[2]})`:""}</button>`).join("")}</div><div id="shbody"></div>`;
 body(ok,pf)}

function provRow(p){return `<tr><td><div class="sl">${av(p)}<span><b data-a="pdet" data-id="${esc(p.user_id)}" style="cursor:pointer">${esc(p.name)}</b><br><small class="m">${esc(p.title||"")}</small></span></div></td><td>${esc(spOf(p.user_id).join(", ")||"-")}</td><td>${esc(place(p))}</td><td><span class="pill ${esc(p.status)}">${esc(p.status)}</span></td><td>${esc(dt(p.created_at))}</td>
 <td><button class="btn s" data-a="pdet" data-id="${esc(p.user_id)}">View full profile</button> ${p.status==="pending"?`<button class="btn s p" data-a="pok" data-id="${esc(p.user_id)}">Approve</button> <button class="btn s d" data-a="pno" data-id="${esc(p.user_id)}">Reject</button>`:""}</td></tr>`}

function body(ok,pf){const b=D("#shbody");
 if(V==="overview"){const pn=pend();
  b.innerHTML=`<div class="kpis"><div class="kp"><div><b>${S.sv.length}</b><span>Services</span></div></div><div class="kp"><div><b>${ok.length}</b><span>Approved providers</span></div></div><div class="kp"><div><b>${pn.length}</b><span>Waiting for approval</span></div></div><div class="kp"><div><b>${S.rq.filter(r=>r.status==="open").length}</b><span>Open requests</span></div></div></div>
  <section class="card"><div class="ch"><h3>Applications waiting</h3></div><div class="wrap"><table><tr><th>Provider</th><th>Services</th><th>Location</th><th>Status</th><th>Applied</th><th></th></tr>${pn.map(provRow).join("")||'<tr><td colspan="6" class="empty">No applications waiting.</td></tr>'}</table></div></section>
  <section class="card"><div class="ch"><h3>Gallery items to review</h3><span class="pill">${pf.length} pending</span></div><div class="m">${pf.length?`<button class="btn s p" data-a="tab" data-id="portfolio">Review gallery items</button>`:"Nothing waiting."}</div></section>`}
 else if(V==="services"){
  b.innerHTML=`<section class="card"><div class="ch"><h3>Categories</h3><button class="btn s" data-a="newcat">+ Add category</button></div><div class="wrap"><table><tr><th>Name</th><th>Services</th><th>Status</th><th></th></tr>${S.cat.map(c=>`<tr><td><b>${esc(c.name)}</b></td><td>${S.sv.filter(s=>s.category_id===c.id).length}</td><td><span class="pill ${c.active?"approved":"closed"}">${c.active?"active":"hidden"}</span></td><td><button class="btn s" data-a="editcat" data-id="${esc(c.id)}">Edit</button> <button class="btn s d" data-a="delcat" data-id="${esc(c.id)}">Delete</button></td></tr>`).join("")||'<tr><td colspan="4" class="empty">No categories yet.</td></tr>'}</table></div></section>
  <section class="card"><div class="ch"><h3>Services</h3><button class="btn s p" data-a="newsv">+ Add a service</button></div><div class="wrap"><table><tr><th>Service</th><th>Category</th><th>Price guide</th><th>Providers</th><th>Status</th><th></th></tr>${S.sv.map(s=>`<tr><td><b>${esc(s.title)}</b></td><td>${esc(nm(S.cat,s.category_id)||"-")}</td><td>${esc(price(s))} ${esc(s.price_unit||"")}</td><td>${S.ps.filter(x=>x.service_id===s.id).length}</td><td><span class="pill ${s.active?"approved":"closed"}">${s.active?"active":"hidden"}</span></td><td><button class="btn s" data-a="editsv" data-id="${esc(s.id)}">Edit</button> <button class="btn s d" data-a="delsv" data-id="${esc(s.id)}">Delete</button></td></tr>`).join("")||'<tr><td colspan="6" class="empty">No services yet. Click “Add a service”.</td></tr>'}</table></div></section>`}
 else if(V==="providers"){
  b.innerHTML=`<section class="card"><div class="ch"><h3>Service providers</h3><select id="pfl"><option value="">All statuses</option>${["pending","approved","rejected","suspended"].map(x=>`<option>${x}</option>`).join("")}</select></div><div class="wrap"><table id="ptb"><tr><th>Provider</th><th>Services</th><th>Location</th><th>Status</th><th>Applied</th><th></th></tr>${S.pr.map(provRow).join("")||'<tr><td colspan="6" class="empty">No providers yet.</td></tr>'}</table></div></section>`;
  D("#pfl").onchange=e=>{const v=e.target.value;D("#ptb").innerHTML='<tr><th>Provider</th><th>Services</th><th>Location</th><th>Status</th><th>Applied</th><th></th></tr>'+(S.pr.filter(p=>!v||p.status===v).map(provRow).join("")||'<tr><td colspan="6" class="empty">None.</td></tr>')}}
 else if(V==="portfolio"){
  b.innerHTML=`<section class="card"><div class="ch"><h3>Gallery items waiting for review</h3></div><div class="wrap"><table><tr><th>Preview</th><th>Provider</th><th>Title</th><th></th></tr>${pf.map(x=>{const p=S.pr.find(z=>z.user_id===x.provider_id)||{name:"Provider"};return `<tr><td>${x.media_type==="video"?`<a href="${esc(x.media_url)}" target="_blank" rel="noopener">▶ Video</a>`:`<a href="${esc(x.media_url)}" target="_blank" rel="noopener"><img alt="" src="${esc(x.media_url)}" style="width:64px;height:64px;object-fit:cover;border-radius:8px"></a>`}</td><td><b data-a="pdet" data-id="${esc(x.provider_id)}" style="cursor:pointer">${esc(p.name)}</b></td><td>${esc(x.title||"")}</td><td><button class="btn s p" data-a="gok" data-id="${esc(x.id)}">Approve</button> <button class="btn s d" data-a="gno" data-id="${esc(x.id)}">Reject</button></td></tr>`}).join("")||'<tr><td colspan="4" class="empty">Nothing to review.</td></tr>'}</table></div></section>`}
 else{b.innerHTML=`<section class="card"><div class="ch"><h3>Client requests</h3></div><div class="wrap"><table><tr><th>Request</th><th>Service</th><th>Client</th><th>Budget</th><th>Applicants</th><th>Status</th><th></th></tr>${S.rq.map(r=>`<tr><td><b>${esc(r.title)}</b><br><small class="m">${esc(dt(r.created_at))} · ${esc([r.town,r.county].filter(Boolean).join(", ")||"Anywhere")}</small></td><td>${esc(nm(S.sv,r.service_id)||"-")}</td><td>${esc(r.client_name||"Client")}</td><td>${r.budget?kes(r.budget):"-"}</td><td>${r.applicants_count||0}</td><td><span class="pill ${esc(r.status)}">${esc(r.status)}</span></td><td><button class="btn s" data-a="rview" data-id="${esc(r.id)}">View</button> <button class="btn s d" data-a="rdel" data-id="${esc(r.id)}">Delete</button></td></tr>`).join("")||'<tr><td colspan="7" class="empty">No requests yet.</td></tr>'}</table></div></section>`}}

/* ---------- full provider profile ---------- */
function pDet(id){const p=S.pr.find(x=>x.user_id===id);if(!p)return;const pv=S.pv.find(x=>x.user_id===id)||{},mine=S.ps.filter(x=>x.provider_id===id).map(x=>x.service_id),items=S.pf.filter(x=>x.provider_id===id),apps=S.ap.filter(x=>x.provider_id===id);
 const groups={};S.sv.forEach(s=>{(groups[nm(S.cat,s.category_id)||"Other"]=groups[nm(S.cat,s.category_id)||"Other"]||[]).push(s)});
 open(`${mh("Service provider · full profile")}<div class="fm">${p.banner_url?`<img class="bnr" alt="" src="${esc(p.banner_url)}">`:""}
 <div class="sl">${av(p)}<span><b style="font-size:18px">${esc(p.name)}</b> <span class="pill ${esc(p.status)}">${esc(p.status)}</span><br><small class="m">${esc(p.title||"")} · ${esc(place(p))}</small></span></div>
 <div class="box"><b>Account</b><br>Applied: ${esc(dt(p.created_at))} · User ID: <code>${esc(p.user_id)}</code><br>Applications sent: ${apps.length} · Jobs done: ${p.jobs_done||0} · Available: ${p.available===false?"No":"Yes"}${p.status_note?`<br>Admin note: ${esc(p.status_note)}`:""}</div>
 <div class="two"><label>Phone (private)<input readonly value="${esc(pv.phone||"")}"></label><label>Email (private)<input readonly value="${esc(pv.email||"")}"></label></div>
 <div class="two"><label>Experience<input readonly value="${esc(p.years_experience??"")} years"></label><label>Usual rate<input readonly value="${p.rate?esc(kes(p.rate)+" "+(p.rate_unit||"")):"Not set"}"></label></div>
 <label>About<textarea readonly rows="4">${esc(p.bio||"")}</textarea></label><label>Skills<input readonly value="${esc(A(p.skills).join(", "))}"></label>
 <div><b style="font-size:13px">Services offered (you can change these)</b><div class="chk" id="psv">${Object.entries(groups).map(([g,a])=>`<div class="gh">${esc(g)}</div>${a.map(s=>`<label><input type="checkbox" value="${esc(s.id)}" ${mine.includes(s.id)?"checked":""}> ${esc(s.title)}</label>`).join("")}`).join("")}</div></div>
 <div><b style="font-size:13px">Work gallery (${items.length})</b><div class="pg" style="margin-top:6px">${items.map(x=>`<div class="it">${x.media_type==="video"&&/\.(mp4|webm|mov|m4v|ogg)(\?|$)/i.test(x.media_url)?`<video src="${esc(x.media_url)}" preload="metadata" controls></video>`:x.media_type==="video"?`<a href="${esc(x.media_url)}" target="_blank" rel="noopener" style="color:#fff;display:grid;place-items:center;height:100%">▶ Video</a>`:`<a href="${esc(x.media_url)}" target="_blank" rel="noopener"><img loading="lazy" alt="" src="${esc(x.media_url)}"></a>`}<span class="pill tg ${x.status==="approved"?"approved":x.status==="rejected"?"rejected":""}">${esc(x.status)}</span><div class="bar">${x.status!=="approved"?`<button class="btn s p" data-g="ok|${esc(x.id)}">Approve</button>`:""}${x.status!=="rejected"?`<button class="btn s d" data-g="no|${esc(x.id)}">Reject</button>`:""}</div></div>`).join("")||'<div class="m">No gallery items.</div>'}</div></div>
 <label>Note to the provider (shown when rejected or suspended)<input id="pnote" maxlength="200" value="${esc(p.status_note||"")}"></label>
 <div class="fa2"><button class="btn" data-x>Close</button><button class="btn p" id="psave">Save services</button>${p.status!=="approved"?'<button class="btn p" id="pa1">Approve</button>':'<button class="btn d" id="pa2">Suspend</button>'}${p.status==="pending"?'<button class="btn d" id="pa3">Reject</button>':""}<button class="btn d" id="pdel">Delete provider</button></div></div>`);
 D("#psave").onclick=async()=>{const ids=[...D("#psv").querySelectorAll("input:checked")].map(c=>c.value);const d=await sb.from("sh_provider_services").delete().eq("provider_id",id);if(d.error){toast(d.error.message,"error");return}
  if(ids.length){const i=await sb.from("sh_provider_services").insert(ids.map(s=>({provider_id:id,service_id:s})));if(i.error){toast(i.error.message,"error");return}}toast("Services saved");D("#dlg").close();window.serviceHubAdmin()};
 const set=(sel,status)=>{const b=D(sel);if(b)b.onclick=async()=>{if(await upd("sh_providers","user_id",id,{status,status_note:D("#pnote").value.trim()||null},"Updated"))D("#dlg").close()}};set("#pa1","approved");set("#pa2","suspended");set("#pa3","rejected");
 D("#dc").querySelectorAll("[data-g]").forEach(b=>b.onclick=async()=>{const [a,gid]=b.dataset.g.split("|");if(await upd("sh_portfolio","id",gid,{status:a==="ok"?"approved":"rejected"},"Gallery item "+(a==="ok"?"approved":"rejected"),true))pDet(id)});
 D("#pdel").onclick=async()=>{if(!await askConfirm({title:"Delete this provider?",msg:"Their profile, services and gallery are removed permanently.",ok:"Yes, delete"}))return;const r=await sb.from("sh_providers").delete().eq("user_id",id);if(r.error){toast(r.error.message,"error");return}D("#dlg").close();toast("Provider deleted");window.serviceHubAdmin()}}

const upd=async(t,col,id,v,msg,keep)=>{const{error}=await sb.from(t).update(v).eq(col,id);if(error){toast(error.message,"error");return false}toast(msg);if(keep){await load();paint()}else await window.serviceHubAdmin();return true};

/* ---------- categories & services ---------- */
function catForm(c){c=c||{};open(`${mh(c.id?"Edit category":"Add category")}<form class="fm" id="cf"><label>Name *<input name="n" required maxlength="60" value="${esc(c.name||"")}"></label><div class="two"><label>Order<input name="o" type="number" value="${esc(c.sort_order??0)}"></label><label>Status<select name="a"><option value="1" ${c.active===false?"":"selected"}>Active</option><option value="0" ${c.active===false?"selected":""}>Hidden</option></select></label></div><div class="fa2"><button type="button" class="btn" data-x>Cancel</button><button class="btn p">Save</button></div></form>`);
 D("#cf").onsubmit=async e=>{e.preventDefault();const f=e.target,v={name:f.n.value.trim(),sort_order:+f.o.value||0,active:f.a.value==="1"},r=c.id?await sb.from("sh_categories").update(v).eq("id",c.id):await sb.from("sh_categories").insert(v);if(r.error){toast(r.error.message,"error");return}D("#dlg").close();toast("Category saved");window.serviceHubAdmin()}}
function svForm(s){s=s||{};open(`${mh(s.id?"Edit service":"Add a service")}<form class="fm" id="sf"><label>Service name *<input name="t" required maxlength="80" value="${esc(s.title||"")}" placeholder="e.g. Plumbing, Casual labour, House cleaning"></label>
 <div class="two"><label>Category<select name="c"><option value="">Choose</option>${S.cat.map(c=>`<option value="${esc(c.id)}" ${c.id===s.category_id?"selected":""}>${esc(c.name)}</option>`).join("")}</select></label><label>…or create a new category<input name="nc" maxlength="60" placeholder="New category name"></label></div>
 <label>Description<textarea name="d" rows="3" maxlength="500">${esc(s.description||"")}</textarea></label>
 <div class="two"><label>Guide price from (KSh)<input name="p" type="number" min="0" value="${esc(s.base_price??"")}"></label><label>Guide price up to (KSh)<input name="m" type="number" min="0" value="${esc(s.max_price??"")}"></label></div>
 <div class="two"><label>Price is<select name="u">${["per job","per hour","per day"].map(x=>`<option ${(s.price_unit||"per job")===x?"selected":""}>${x}</option>`).join("")}</select></label><label>Status<select name="a"><option value="1" ${s.active===false?"":"selected"}>Active</option><option value="0" ${s.active===false?"selected":""}>Hidden</option></select></label></div>
 <label>Cover image ${s.image_url?"(leave empty to keep the current one)":"(optional)"}<input name="img" type="file" accept="image/*"></label>${s.image_url?`<img class="bnr" alt="" src="${esc(s.image_url)}">`:""}
 <div class="fa2"><button type="button" class="btn" data-x>Cancel</button><button class="btn p" id="svg">Save service</button></div></form>`);
 D("#sf").onsubmit=async e=>{e.preventDefault();const f=e.target,b=D("#svg");b.disabled=true;
  try{let cid=f.c.value||null;if(f.nc.value.trim()){const r=await sb.from("sh_categories").insert({name:f.nc.value.trim()}).select().single();if(r.error)throw r.error;cid=r.data.id}
   if(f.p.value!==""&&f.m.value!==""&&+f.m.value<+f.p.value)throw new Error("“Up to” price must be the same as or more than “from”");
   let img=s.image_url||null;const file=f.img.files[0];if(file){if(!/^image\//.test(file.type)||file.size>3e6)throw new Error("The cover must be an image under 3 MB");const uid=(await sb.auth.getSession()).data.session?.user.id,ext=(file.name.split(".").pop()||"png").toLowerCase().replace(/[^a-z0-9]/g,"")||"png",path=`${uid}/shsvc-${Date.now()}.${ext}`,u=await sb.storage.from("listing-images").upload(path,file,{contentType:file.type});if(u.error)throw u.error;img=sb.storage.from("listing-images").getPublicUrl(path).data.publicUrl}
   const v={title:f.t.value.trim(),category_id:cid,description:f.d.value.trim()||null,base_price:f.p.value===""?null:+f.p.value,max_price:f.m.value===""?null:+f.m.value,price_unit:f.u.value,active:f.a.value==="1",image_url:img},
    r=s.id?await sb.from("sh_services").update(v).eq("id",s.id):await sb.from("sh_services").insert(v);if(r.error)throw r.error;D("#dlg").close();toast(s.id?"Service saved":"Service added");window.serviceHubAdmin()}
  catch(x){b.disabled=false;toast(x.message||String(x),"error")}}}

window.serviceHubAdmin=async function(){const e=D("#vsh");if(!S)e.innerHTML='<div class="card">Loading…</div>';await load();paint();if(bound)return;bound=true;
 e.addEventListener("click",async ev=>{const b=ev.target.closest("[data-a]");if(!b)return;const a=b.dataset.a,id=b.dataset.id;
  if(a==="tab"){V=id;paint();scrollTo(0,0)}
  else if(a==="newsv")svForm();else if(a==="editsv")svForm(S.sv.find(x=>x.id===id));
  else if(a==="delsv"){if(await askConfirm({title:"Delete this service?",msg:"Providers who offered it lose it from their profile. Existing requests keep their text.",ok:"Yes, delete"})){const r=await sb.from("sh_services").delete().eq("id",id);if(r.error)toast(r.error.message,"error");else{toast("Service deleted");window.serviceHubAdmin()}}}
  else if(a==="newcat")catForm();else if(a==="editcat")catForm(S.cat.find(x=>x.id===id));
  else if(a==="delcat"){if(await askConfirm({title:"Delete this category?",msg:"Services in it stay but will have no category.",ok:"Yes, delete"})){const r=await sb.from("sh_categories").delete().eq("id",id);if(r.error)toast(r.error.message,"error");else{toast("Category deleted");window.serviceHubAdmin()}}}
  else if(a==="pdet")pDet(id);
  else if(a==="pok")upd("sh_providers","user_id",id,{status:"approved",status_note:null},"Provider approved");
  else if(a==="pno"){const n=prompt("Reason for rejecting (shown to the applicant, optional):","");if(n===null)return;upd("sh_providers","user_id",id,{status:"rejected",status_note:n.trim()||null},"Application rejected")}
  else if(a==="gok")upd("sh_portfolio","id",id,{status:"approved"},"Approved");else if(a==="gno")upd("sh_portfolio","id",id,{status:"rejected"},"Rejected");
  else if(a==="rview"){const r=S.rq.find(x=>x.id===id);if(!r)return;open(`${mh("Request")}<div class="fm">${r.banner_url?`<img class="bnr" alt="" src="${esc(r.banner_url)}">`:""}<b style="font-size:18px">${esc(r.title)}</b><div class="m">${esc(nm(S.sv,r.service_id))} · ${esc(r.client_name||"Client")} · ${esc(dt(r.created_at))} · ${r.budget?esc(kes(r.budget)):"Open budget"}</div><p style="white-space:pre-wrap;margin:0">${esc(r.description||"")}</p><div class="fa2"><button class="btn" data-x>Close</button></div></div>`)}
  else if(a==="rdel"){if(await askConfirm({title:"Delete this request?",msg:"It and its applications are removed permanently.",ok:"Yes, delete"})){const r=await sb.from("sh_requests").delete().eq("id",id);if(r.error)toast(r.error.message,"error");else{toast("Request deleted");window.serviceHubAdmin()}}}})}
})();