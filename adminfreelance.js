/* SOKO Smart admin: Freelance Management (replaces window.freelanceAdmin). Uses admin.html globals: sb, $, esc, ic, toast, askConfirm, COUNTIES. */
(()=>{
const kes=n=>"KSh "+Number(n||0).toLocaleString("en-KE"),D=s=>document.querySelector(s);
const st=document.createElement("style");st.textContent=`
/* Freelance page: built from admin.html's own classes (.ph .kpis .kp .card .wrap .pill .btn). Only small extras live here. */
#vf .ph{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;flex-wrap:wrap}
#vf .kp .ico{width:44px;height:44px;border-radius:12px;background:var(--ot);color:var(--od);display:grid;place-items:center;flex:none}
#vf .kp b{font-size:26px}
#vf .g2{display:grid;grid-template-columns:minmax(0,1.6fr) minmax(0,1fr);gap:16px;margin-bottom:16px;align-items:start}
#vf .g2>.card{margin:0;min-width:0}
#vf .g2.stack{grid-template-columns:minmax(0,1fr)}
#vf [data-s]:not(.g2):not(.kpis)>.card{margin-bottom:16px}
#vf .kpis{grid-template-columns:repeat(3,minmax(0,1fr))}@media(max-width:700px){#vf .kpis{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:420px){#vf .kpis{grid-template-columns:minmax(0,1fr)}}
#vf .fhd{display:flex;gap:10px;align-items:center;flex-wrap:wrap}
#vf .fhd .pick{min-width:210px}
#vf .fhd select{width:100%}
@media(max-width:560px){#vf .fhd,#vf .fhd .pick{width:100%}#vf .fhd .btn{flex:1;justify-content:center}}
#vf td .btn,#vf .ap .btn{white-space:nowrap}
#vf td:last-child{white-space:nowrap}
@media(max-width:1180px){#vf .g2{grid-template-columns:minmax(0,1fr)}}
#vf>.card{margin-bottom:16px}
#vf .card .wrap{box-shadow:none;border:1px solid var(--bd);border-radius:12px}
#vf .card .ch h3{font-size:18px;font-weight:700;display:flex;align-items:center;gap:10px}#vf .card .ch h3 svg{color:var(--g)}
#vf td b{font-weight:600}
#vf .sl{display:flex;align-items:center;gap:10px}
#vf .sl i{width:36px;height:36px;border-radius:9px;background:var(--ot);color:var(--od);display:grid;place-items:center;font-style:normal;font-weight:700;flex:none}
#vf .pill.suspended,#vf .pill.closed,#vf .pill.cancelled{background:#fde8e6;color:var(--r)}
#vf .pill.completed,#vf .pill.open,#vf .pill.hired{background:#e3f4ea;color:var(--g)}
#vf .tg{width:42px;height:24px;border-radius:12px;border:0;background:#d4d7d1;position:relative;transition:background .2s;padding:0}
#vf .tg:after{content:"";position:absolute;left:3px;top:3px;width:18px;height:18px;border-radius:50%;background:#fff;transition:.2s;box-shadow:0 1px 3px rgba(0,0,0,.25)}
#vf .tg.on{background:var(--g)}#vf .tg.on:after{left:21px}
#vf .ap{display:flex;gap:12px;align-items:center;padding:10px 0;border-bottom:1px solid var(--bd)}#vf .ap:last-child{border:0}
#vf .ap .ai{flex:1;min-width:0}#vf .ap b{cursor:pointer;font-weight:600}#vf .ap small{display:block;color:var(--mut);font-size:13px}
#vf .av2{width:44px;height:44px;border-radius:50%;background:var(--g);color:#fff;display:grid;place-items:center;font-weight:700;overflow:hidden;flex:none;border:2px solid #fff;box-shadow:0 0 0 1px var(--bd)}
#vf .av2 img{width:100%;height:100%;object-fit:cover}
#vf .vbd,#dc .vbd{display:inline-flex;vertical-align:middle;margin-left:3px}#vf .vbd svg,#dc .vbd svg{width:16px;height:16px}
#vf .pj-d{display:block;max-width:340px;color:var(--mut);font-size:12.5px;font-weight:400;margin-top:2px;white-space:normal;line-height:1.4}
#vf .none{color:var(--mut);padding:22px 0;text-align:center}
#vf .rv-score{display:flex;align-items:center;gap:4px;font-size:13px;color:var(--mut);margin-top:2px}#vf .rv-score b{color:var(--od)}
#vf .rbars{display:grid;gap:10px}#vf .rbars div{display:grid;grid-template-columns:34px 1fr 34px;gap:10px;align-items:center;font-size:13px}
#vf .rbars em{font-style:normal;text-align:right;color:var(--mut)}#vf .rbars .b{height:9px;border-radius:6px;background:#ececec;overflow:hidden}#vf .rbars u{display:block;height:100%;background:var(--a)}
#vf .rtxt{max-width:340px;white-space:normal}
#vf .cm{display:flex;align-items:center;gap:8px;flex-wrap:wrap;font-size:13px;color:var(--mut)}#vf .cm input{width:72px;padding:6px 8px}
#vf .stars,#dc .stars{display:inline-block;letter-spacing:1px;line-height:1;background:linear-gradient(90deg,var(--a) var(--p,0%),#d9ddd6 var(--p,0%));-webkit-background-clip:text;background-clip:text;color:transparent;-webkit-text-fill-color:transparent;vertical-align:-1px}
/* dialogs: same plain look as the other admin dialogs */
#dlg.fwide{max-width:720px}
#dc .fm-h{display:flex;justify-content:space-between;align-items:center;margin:0 0 12px}
#dc .fm-h h3{margin:0;font-size:18px;font-weight:700}#dc .fm-h button{background:none;border:0;font-size:24px;line-height:1;color:var(--mut);padding:0 4px}
#dc .fm{display:grid;gap:12px}
#dc .two{display:grid;grid-template-columns:1fr 1fr;gap:10px}@media(max-width:560px){#dc .two{grid-template-columns:1fr}}
#dc .fa2{display:flex;gap:8px;justify-content:flex-end;flex-wrap:wrap;margin-top:6px}
#dc .pg{display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:10px}#dc .pg img{width:100%;aspect-ratio:1;object-fit:cover;border-radius:10px}
#dc .rvl{border-top:1px solid var(--bd);padding:8px 0;font-size:13px}
`;
document.head.appendChild(st);

let S,LERR=[],V="overview";const q=(p,t)=>p.then(r=>{if(r.error){console.error("freelance admin: "+(t||"query"),r.error);LERR.push((t||"data")+": "+r.error.message)}return r.data||[]},e=>{LERR.push((t||"data")+": "+(e&&e.message||e));return[]});
const nm=(c,id)=>(c.find(x=>x.id===id)||{}).name||"";
const av=f=>`<span class="av2">${f.avatar_url?`<img alt="" src="${esc(f.avatar_url)}">`:esc((f.name||"?")[0].toUpperCase())}</span>`;
const spec=id=>{const r=S.fs.find(x=>x.freelancer_id===id);return r?nm(S.sv,r.service_id):"-"},cntS=id=>S.fs.filter(x=>x.service_id===id).length;
const RT=f=>{const r=(S.rv||[]).filter(x=>x.freelancer_id===f.user_id&&+x.rating>=1);return r.length?{a:r.reduce((t,x)=>t+ +x.rating,0)/r.length,n:r.length}:{a:+f.rating_avg||0,n:+f.rating_count||0}};
const stars=a=>`<span class="stars" style="--p:${Math.max(0,Math.min(5,a))/5*100}%">★★★★★</span>`;
const rate=f=>{const r=RT(f);return r.n?`<div class="rv-score">${stars(r.a)} <b>${r.a.toFixed(1)}</b> (${r.n} review${r.n===1?"":"s"})</div>`:'<div class="rv-score">★ New</div>'};
const rateTxt=f=>{const r=RT(f);return r.n?`${r.a.toFixed(1)} / 5 (${r.n} review${r.n===1?"":"s"})`:"No reviews yet"};
/* Blue tick, same rule as the Freelance page: profile 2+ months old, rating 4.3+, over 20 completed projects */
const VSVG='<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path fill="#3897F0" d="M12 1.8l2.6 1.9 3.2-.1 1 3 2.6 1.9-1 3.1 1 3.1-2.6 1.9-1 3-3.2-.1L12 22.2l-2.6-1.9-3.2.1-1-3-2.6-1.9 1-3.1-1-3.1 2.6-1.9 1-3 3.2.1z"/><path d="M8 12.2l2.6 2.6L16 9.4" fill="none" stroke="#fff" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const vChk=f=>{const lim=new Date();lim.setMonth(lim.getMonth()-2);const d=f.created_at?new Date(f.created_at):null,r=RT(f).a,j=+f.jobs_done||0,age=!!d&&!isNaN(d)&&d<=lim;return{age,rate:r>=4.3,jobs:j>20,r,j,ok:age&&r>=4.3&&j>20}};
const vt=f=>vChk(f).ok?`<i class="vbd" title="Verified freelancer (automatic)">${VSVG}</i>`:"";
const pj$=s=>{const a=[+s.base_price,+s.max_price,...(s.packages||[]).map(p=>+p.price)].filter(n=>n>0);return a.length?{min:Math.min(...a),max:Math.max(...a)}:{min:0,max:0}};
const pjTxt=r=>r.min===r.max?r.min.toLocaleString():r.min.toLocaleString()+" – "+r.max.toLocaleString();
const dt=d=>d?new Date(d).toLocaleDateString("en-KE",{day:"numeric",month:"short",year:"numeric"}):"";
async function recalc(fid){const r=await sb.from("freelance_reviews").select("rating").eq("freelancer_id",fid).limit(5000);if(r.error)return r.error;const a=(r.data||[]).map(x=>+x.rating).filter(x=>x>=1),n=a.length;const u=await sb.from("freelancer_profiles").update({rating_avg:n?Math.round(a.reduce((t,x)=>t+x,0)/n*100)/100:0,rating_count:n}).eq("user_id",fid);return u.error}
const open=h=>{D("#dc").innerHTML=h;const d=D("#dlg");d.classList.add("fwide");if(!d._fw){d._fw=1;d.addEventListener("close",()=>d.classList.remove("fwide"))}if(!d.open)d.showModal();D("#dc").querySelectorAll("[data-x]").forEach(b=>b.onclick=()=>d.close())};
const mh=t=>`<div class="fm-h"><h3>${t}</h3><button data-x type="button" aria-label="Close">×</button></div>`;

async function load(){
 LERR=[];const[sc,sv,fp,pf,od,cm,fs,pv,pj,rv]=await Promise.all([
  q(sb.from("freelance_categories").select("*").order("sort_order").order("name")),
  q(sb.from("freelance_services").select("*").order("sort_order").order("title")),
  sb.from("freelancer_profiles").select("*").order("created_at",{ascending:false}).then(async r=>{if(r.error){console.error("freelancer_profiles",r.error);r=await sb.from("freelancer_profiles").select("*")}if(r.error){LERR.push("freelancer_profiles: "+r.error.message);return[]}return(r.data||[]).sort((x,y)=>String(y.created_at||"").localeCompare(String(x.created_at||"")))},e=>{LERR.push("freelancer_profiles: "+(e&&e.message||e));return[]}),
  q(sb.from("freelancer_portfolio").select("*").eq("status","pending").order("created_at",{ascending:false}).limit(60)),
  q(sb.from("freelance_orders").select("*").order("created_at",{ascending:false}).limit(200)),
  sb.from("freelance_settings").select("commission_percent").eq("id",1).maybeSingle().then(r=>r.data&&+r.data.commission_percent,()=>null),
  q(sb.from("freelancer_services").select("freelancer_id,service_id")),
  q(sb.from("freelancer_private").select("user_id,phone,email")),
  q(sb.from("freelance_projects").select("*").order("created_at",{ascending:false}).limit(50)),
  q(sb.from("freelance_reviews").select("*").order("created_at",{ascending:false}).limit(500))
 ]);
 S={cat:sc,sv,fp,pf,od,fs,pv,pj,rv,cm:cm==null?10:cm}
}
const gpay=p=>{const t=p.budget_type||"fixed",mn=+p.budget_min||0,mx=+p.budget_max||0,r=(a,b,u)=>a&&b&&a!==b?a.toLocaleString()+" – "+b.toLocaleString()+u:Number(a||b).toLocaleString()+u;return t==="hourly"?r(mn||+p.budget,mx,"/hr"):t==="negotiable"?(mn||mx?r(mn,mx,"")+" (neg.)":"Negotiable"):Number(p.budget).toLocaleString()};
const dur=s=>{const p=(s.packages||[])[0];return p&&p.delivery_days?p.delivery_days+(+p.delivery_days===1?" Day":" Days"):"-"};

const show=()=>{const e=D("#vf");if(!e)return;e.querySelectorAll("[data-s]").forEach(x=>x.hidden=x.dataset.s!==V);const sel=e.querySelector("#fsec");if(sel)sel.value=V};
function paint(){
 const e=D("#vf"),F=S.fp,ok=F.filter(f=>f.status==="approved"),pend=F.filter(f=>f.status==="pending"),done=S.od.filter(o=>o.status==="completed"),earn=done.reduce((a,o)=>a+(+o.payout||0),0),fee=done.reduce((a,o)=>a+(+o.total||0)-(+o.payout||0),0);
 const SECS=[["overview","Overview",pend.length+S.pf.length||null],["services","Services",S.sv.length],["freelancers","Freelancers",F.length],["reviews","Ratings & Reviews",S.rv.length],["projects","Client Projects",S.pj.length],["orders","Orders & Earnings",S.od.length]];
 const RR=S.rv.filter(x=>+x.rating>=1&&+x.rating<=5),RV={n:RR.length,a:RR.length?RR.reduce((t,x)=>t+ +x.rating,0)/RR.length:0},DIST=[5,4,3,2,1].map(n=>[n,RR.filter(x=>+x.rating===n).length]),TOP=ok.map(f=>({f,r:RT(f)})).filter(x=>x.r.n>0).sort((a,b)=>b.r.a-a.r.a||b.r.n-a.r.n).slice(0,6);
 
 e.innerHTML=(LERR.length?`<div class="unr" style="align-items:flex-start;flex-direction:column;gap:4px"><b>Some freelance data could not be loaded (likely a missing Supabase permission).</b><span class="m" style="font-weight:400">${LERR.map(esc).join("<br>")}<br>Run supabase-freelance-admin-access.sql in Supabase, then refresh.</span></div>`:"")+`<div class="ph"><div><h1>Freelance Management</h1><p>Manage freelance services, freelancers and portfolios</p></div><div class="fhd"><label class="pick" title="Choose a section"><select id="fsec" aria-label="Freelance section">${SECS.map(([k,l,n])=>`<option value="${k}" ${k===V?"selected":""}>${l}${n==null?"":" ("+n+")"}</option>`).join("")}</select><span class="cv">${ic("chev",16)}</span></label><button class="btn p" data-a="newsv">${ic("plus",16)} Create Service</button></div></div>
 
 <div class="kpis" data-s="overview">
  <div class="kp"><div class="ico">${ic("briefcase",24)}</div><div><b>${S.sv.filter(s=>s.active).length}</b><span>Active Services</span></div></div>
  <div class="kp"><div class="ico">${ic("users",24)}</div><div><b>${F.length}</b><span>Registered Freelancers</span></div></div>
  <div class="kp"><div class="ico">${ic("check",24)}</div><div><b>${ok.length}</b><span>Approved Freelancers</span></div></div>
  <div class="kp"><div class="ico">${ic("cart",24)}</div><div><b>${S.od.length}</b><span>Freelance Orders</span></div></div>
  <div class="kp"><div class="ico">${ic("star",24)}</div><div><b>${RV.n?RV.a.toFixed(1)+" / 5":"—"}</b><span>Average Rating</span></div></div>
  <div class="kp"><div class="ico">${ic("message",24)}</div><div><b>${RV.n}</b><span>Total Reviews</span></div></div>
 </div>

 <div data-s="overview" class="g2"><section class="card">
   <div class="ch"><h3>${ic("users",20)} Freelancer Applications</h3><span class="pill">${pend.length} pending</span></div>
   ${pend.map(f=>`<div class="ap">${av(f)}<div class="ai"><b data-a="fdet" data-id="${esc(f.user_id)}">${esc(f.name)}</b>${vt(f)}<small>${esc(spec(f.user_id))} · ${esc([f.town,f.county].filter(Boolean).join(", "))}</small>${rate(f)}</div><div class="actions"><button class="btn s p" data-a="fok" data-id="${esc(f.user_id)}">✓ Approve</button><button class="btn s d" data-a="fno" data-id="${esc(f.user_id)}">✕ Reject</button></div></div>`).join("")||'<div class="none">No pending applications.</div>'}
  </section><section class="card">
   <div class="ch"><h3>${ic("image",20)} Portfolio Reviews</h3><span class="pill">${S.pf.length} pending</span></div>
   ${S.pf.slice(0,8).map(p=>{const f=F.find(x=>x.user_id===p.freelancer_id)||{};return `<div class="ap">${av(f)}<div class="ai"><b data-a="prev" data-id="${esc(f.user_id||"")}">${esc(f.name||"Freelancer")}</b><small>${esc(p.title||p.media_type||"Portfolio item")}</small></div><button class="btn s p" data-a="pok" data-id="${esc(p.id)}">✓</button><button class="btn s d" data-a="pno" data-id="${esc(p.id)}">✕</button></div>`}).join("")||'<div class="none">No portfolio items waiting.</div>'}
  </section></div>
 <div data-s="services"><section class="card">
   <div class="ch"><h3>${ic("briefcase",20)} Freelance Services</h3></div>
   <div class="wrap"><table><tr><th>Service</th><th>Category</th><th>Price (KSh)</th><th>Client pay range (KSh)</th><th>Duration</th><th>Actions</th><th></th></tr>
   ${S.sv.map(s=>`<tr><td><div class="sl"><i>${esc((s.title||"S")[0])}</i>${esc(s.title)}</div></td><td>${esc(nm(S.cat,s.category_id))}</td><td>${Number(s.base_price||0).toLocaleString()}</td><td>${pjTxt(pj$(s))}</td><td>${dur(s)}</td><td><button class="btn s" data-a="editsv" data-id="${esc(s.id)}">Edit</button> <button class="btn s d" data-a="delsv" data-id="${esc(s.id)}">Delete</button></td><td><button class="tg ${s.active?"on":""}" data-a="togsv" data-id="${esc(s.id)}" aria-label="Active"></button></td></tr>`).join("")||'<tr><td colspan="7" class="none">No services yet. Create the first one.</td></tr>'}</table></div>
  </section></div>
 <div data-s="freelancers" class="g2"><section class="card">
   <div class="ch"><h3>${ic("users",20)} All Freelancers</h3></div>
   <div class="wrap"><table><tr><th>Freelancer</th><th>Specialty</th><th>Rating</th><th>Status</th><th></th></tr>${F.filter(f=>f.status!=="pending").map(f=>`<tr><td><div class="sl">${av(f)}<span><b data-a="fdet" data-id="${esc(f.user_id)}" style="cursor:pointer">${esc(f.name)}</b>${vt(f)}<br><small style="color:#667068">${esc(f.county||"")}</small></span></div></td><td>${esc(spec(f.user_id))}</td><td>${rate(f)}</td><td><span class="pill ${esc(f.status)}">${esc(f.status)}</span></td><td>${f.status==="suspended"?`<button class="btn s p" data-a="fok" data-id="${esc(f.user_id)}">Reactivate</button>`:f.status==="approved"?`<button class="btn s d" data-a="fsus" data-id="${esc(f.user_id)}">Suspend</button>`:`<button class="btn s p" data-a="fok" data-id="${esc(f.user_id)}">Approve</button>`}</td></tr>`).join("")||'<tr><td colspan="5" class="none">No freelancers yet.</td></tr>'}</table></div>
  </section><section class="card">
   <div class="ch"><h3>${ic("star",20)} Top Rated Freelancers</h3><span class="pill">${TOP.length}</span></div>
   ${TOP.map((x,i)=>`<div class="ap"><b style="width:22px;cursor:default">${i+1}</b>${av(x.f)}<div class="ai"><b data-a="fdet" data-id="${esc(x.f.user_id)}">${esc(x.f.name)}</b>${vt(x.f)}<small>${esc(spec(x.f.user_id))}</small>${rate(x.f)}</div></div>`).join("")||'<div class="none">No rated freelancers yet.</div>'}
  </section></div>
 <div data-s="reviews"><section class="card">
   <div class="ch"><h3>${ic("chart",20)} Rating Breakdown</h3><span class="pill">${RV.n?RV.a.toFixed(1)+" avg":"no ratings"}</span></div>
   <div class="rbars">${DIST.map(d=>`<div><span>${d[0]} ★</span><span class="b"><u style="width:${RV.n?d[1]/RV.n*100:0}%"></u></span><em>${d[1]}</em></div>`).join("")}</div>
  </section><section class="card">
  <div class="ch"><h3>${ic("message",20)} Ratings & Reviews</h3><button class="btn s" data-a="rcall" title="Re-sync every freelancer's average from their reviews">Recalculate averages</button></div>
  <div class="wrap"><table><tr><th>Freelancer</th><th>Client</th><th>Rating</th><th>Review</th><th>Date</th><th></th></tr>${S.rv.slice(0,25).map(r=>{const f=F.find(x=>x.user_id===r.freelancer_id)||{name:"Freelancer"};return `<tr><td><b data-a="fdet" data-id="${esc(r.freelancer_id)}" style="cursor:pointer">${esc(f.name)}</b></td><td>${esc(r.client_name||"Client")}<br><small style="color:#667068">${esc(r.service_title||"")}</small></td><td>${stars(+r.rating)} <b>${esc(r.rating)}</b></td><td class="rtxt">${esc(r.comment||"")||'<span style="color:#667068">No comment</span>'}</td><td>${esc(dt(r.created_at))}</td><td><button class="btn s d" data-a="rvd" data-id="${esc(r.id)}">Delete</button></td></tr>`}).join("")||'<tr><td colspan="6" class="none">No reviews yet.</td></tr>'}</table></div>
 </section></div>
 <div data-s="projects"><section class="card">
  <div class="ch"><h3>${ic("folder",20)} Gigs: Client Projects</h3><span class="pill">${S.pj.filter(p=>p.status==="open").length} open</span></div>
  <div class="wrap"><table><tr><th>Project</th><th>Client</th><th>Service</th><th>Budget</th><th>Details</th><th>Applicants</th><th>Status</th><th></th></tr>${S.pj.map(p=>`<tr><td><b>${esc(p.title)}</b><span class="pj-d">${esc(String(p.description||"").replace(/\s+/g," ").trim().slice(0,110))}${String(p.description||"").length>110?"…":""}</span></td><td>${esc(p.client_name||"")}</td><td>${esc(nm(S.sv,p.service_id))}</td><td>${gpay(p)}</td><td><span class="pj-d" style="margin:0">${esc([p.duration,p.work_mode,p.experience_level].filter(Boolean).join(" · "))||"-"}${(p.skills||[]).length?"<br>"+esc(p.skills.slice(0,4).join(", ")):""}</span></td><td>${p.applicants_count||0}</td><td><span class="pill ${esc(p.status)}">${esc(p.status)}</span></td><td>${p.status==="open"?`<button class="btn s" data-a="pjc" data-id="${esc(p.id)}">Close</button> `:""}<button class="btn s d" data-a="pjd" data-id="${esc(p.id)}">Delete</button></td></tr>`).join("")||'<tr><td colspan="8" class="none">No projects yet.</td></tr>'}</table></div>
 </section></div>
 <div data-s="orders"><section class="card">
  <div class="ch"><h3>${ic("dollar",20)} Orders & Earnings</h3><div class="cm"><span>Platform commission</span><input id="cmv" type="number" min="0" max="90" value="${S.cm}"><span>%</span><button class="btn s p" data-a="savecm">Save</button></div></div>
  <p class="m" style="margin:0 0 12px">Completed: ${done.length} · Freelancer payouts <b>${kes(earn)}</b> · SOKO Smart commission <b>${kes(fee)}</b></p>
  <div class="wrap"><table><tr><th>Service</th><th>Package</th><th>Client</th><th>Freelancer</th><th>Total</th><th>Payout</th><th>Status</th></tr>${S.od.slice(0,15).map(o=>`<tr><td><b>${esc(o.service_title)}</b></td><td>${esc(o.package_name)}</td><td>${esc(o.client_name)}</td><td>${esc(o.freelancer_name)}</td><td>${kes(o.total)}</td><td>${kes(o.payout)}</td><td><span class="pill ${esc(o.status)}">${esc(String(o.status).replace(/_/g," "))}</span></td></tr>`).join("")||'<tr><td colspan="7" class="none">No orders yet.</td></tr>'}</table></div>
 </section></div>`;

 show()
}
const upd=async(t,col,id,v,msg)=>{const{error}=await sb.from(t).update(v).eq(col,id);if(error){toast(error.message,"error");return false}toast(msg);await window.freelanceAdmin();return true};

function svForm(s){
 s=s||{};const p=(s.packages||[])[0]||{},P=S.cat.filter(c=>!c.parent_id);
 open(`${mh(s.id?"Edit Freelance Service":"Create Freelance Service")}<form class="fm" id="sf"><div class="two"><label>Service Name *<input name="t" required value="${esc(s.title||"")}"></label><label>Category *<select name="c" required><option value="">Select…</option>${P.map(c=>`<option value="${esc(c.id)}" ${c.id===s.category_id?"selected":""}>${esc(c.name)}</option>`).join("")}</select></label></div>
<label>Or add a new category<input name="nc" placeholder="e.g. Graphics & Design"></label><div class="two"><label>Price / lowest pay (KSh) *<input name="p" type="number" min="1" required value="${esc(s.base_price||"")}"></label><label>Highest pay (KSh)<input name="mx" type="number" min="1" placeholder="Same as price" value="${esc(s.max_price||"")}"></label></div><p class="m" style="margin:-2px 0 4px">Clients posting a project for this service must set a pay between the lowest and highest amount. Leave the highest blank to fix the pay at the price.</p><div class="two"><label>Delivery Time (days) *<input name="d" type="number" min="1" required value="${esc(p.delivery_days||2)}"></label></div>
<div class="two"><label>Revisions included<input name="r" type="number" min="0" value="${esc(p.revisions??1)}"></label><label>Status<select name="a"><option value="1" ${s.active!==false?"selected":""}>Active</option><option value="0" ${s.active===false?"selected":""}>Inactive</option></select></label></div>
<label>Description *<textarea name="ds" rows="3" required>${esc(s.description||"")}</textarea></label><label>Requirements from the client (one per line)<textarea name="rq" rows="3">${esc(s.requirements||"")}</textarea></label>
<label>Add-ons (one per line: Name | price)<textarea name="ad" rows="2">${esc((s.addons||[]).map(a=>a.name+" | "+a.price).join("\n"))}</textarea></label>
<div class="fa2"><button class="btn" type="button" data-x>Cancel</button><button class="btn p">${s.id?"Save Service":"Create Service"}</button></div></form>`);
 D("#sf").onsubmit=async e=>{e.preventDefault();const f=e.target,b=f.querySelector(".btn.p");b.disabled=true;let cid=f.c.value;
 try{if(f.nc.value.trim()){const r=await sb.from("freelance_categories").insert({name:f.nc.value.trim(),active:true}).select().single();if(r.error)throw r.error;cid=r.data.id}if(!cid)throw new Error("Choose a category");
 const pk=(s.packages||[]).slice();pk[0]={...(pk[0]||{name:"Standard",description:""}),price:+f.p.value,delivery_days:+f.d.value,revisions:+f.r.value};
 const ad=f.ad.value.split("\n").map(l=>l.split("|")).filter(x=>x[0].trim()&&+x[1]>0).map(x=>({name:x[0].trim(),price:+x[1]}));
 if(f.mx.value&&+f.mx.value<+f.p.value)throw new Error("Highest pay must be the same as or more than the price");
 const v={title:f.t.value.trim(),category_id:cid,base_price:+f.p.value,max_price:f.mx.value?+f.mx.value:null,description:f.ds.value.trim(),requirements:f.rq.value.trim(),active:f.a.value==="1",packages:pk,addons:ad};
 const sv$=v=>s.id?sb.from("freelance_services").update(v).eq("id",s.id):sb.from("freelance_services").insert(v);let r=await sv$(v);if(r.error&&/max_price/.test(r.error.message||"")){if(v.max_price!=null)throw new Error("Run supabase-freelance-project-pay.sql in Supabase first: it adds the Highest pay column.");delete v.max_price;r=await sv$(v)}if(r.error)throw r.error;
 D("#dlg").close();toast(s.id?"Service saved":"Service created");await window.freelanceAdmin()}catch(x){b.disabled=false;toast(x.message,"error")}}
}

function fDet(id){
 const f=S.fp.find(x=>x.user_id===id),pr=S.pv.find(x=>x.user_id===id)||{},cur=(S.fs.find(x=>x.freelancer_id===id)||{}).service_id||"";if(!f)return;
 open(`${mh("Freelancer Details")}<div class="fm"><div class="sl" style="margin-bottom:10px">${av(f)}<span><b style="font-size:18px;color:#0d4630">${esc(f.name)}</b>${vt(f)}<br><small style="color:#667068">${esc(f.title||"")} · ${esc([f.town,f.county].filter(Boolean).join(", "))}</small></span></div>
<div style="background:${vChk(f).ok?"#EAF4FF":"#f6f7f4"};border:1px solid ${vChk(f).ok?"#cfe3fb":"#e1e5dc"};border-radius:10px;padding:10px 12px;margin-bottom:10px;font-size:13px;line-height:1.7"><b>${vChk(f).ok?"Verified (blue tick shown automatically)":"Not verified yet"}</b><br>${vChk(f).age?"✅":"⬜"} Profile at least 2 months old (joined ${esc(dt(f.created_at)||"unknown")})<br>${vChk(f).rate?"✅":"⬜"} Rating 4.3 or higher (now ${vChk(f).r?vChk(f).r.toFixed(1):"none"})<br>${vChk(f).jobs?"✅":"⬜"} Over 20 completed projects (now ${vChk(f).j})</div><div class="two"><label>Phone<input readonly value="${esc(pr.phone||"")}"></label><label>Email<input readonly value="${esc(pr.email||"")}"></label></div><div class="two"><label>Experience<input readonly value="${esc(f.years_experience??"")} years"></label><label>Rating<input readonly value="${esc(rateTxt(f))}"></label></div>
<label>Specialty (one service per freelancer)<select id="fsp">${cur?"":'<option value="">Not set</option>'}${S.sv.filter(x=>x.active||x.id===cur).map(x=>`<option value="${esc(x.id)}" ${x.id===cur?"selected":""}>${esc(nm(S.cat,x.category_id))} › ${esc(x.title)}${x.active?"":" (inactive)"}</option>`).join("")}</select></label><label>About Me<textarea readonly rows="3">${esc(f.bio||"")}</textarea></label><label>Skills<input readonly value="${esc((f.skills||[]).join(", "))}"></label><label>Portfolio link<input readonly value="${esc(f.portfolio_url||"")}"></label>
<div><b style="font-size:13px;color:#0d4630">Recent reviews</b>${S.rv.filter(r=>r.freelancer_id===id).slice(0,5).map(r=>`<div class="rvl">${stars(+r.rating)} <b>${esc(r.rating)}</b> · ${esc(r.client_name||"Client")} · ${esc(dt(r.created_at))}<div>${esc(r.comment||"")}</div></div>`).join("")||'<div class="rvl" style="color:#667068">No reviews yet.</div>'}</div>
<div class="fa2"><button class="btn" data-x>Close</button><button class="btn p" id="fsv">Save specialty</button>${f.status==="approved"?'<button class="btn d" id="fs1">Suspend</button>':'<button class="btn p" id="fs2">Approve</button>'}</div></div>`);
 D("#fsv").onclick=async()=>{const v=D("#fsp").value;if(!v||v===cur)return;const d=await sb.from("freelancer_services").delete().eq("freelancer_id",id);if(d.error){toast(d.error.message,"error");return}const i=await sb.from("freelancer_services").insert({freelancer_id:id,service_id:v});if(i.error){toast(i.error.message,"error");return}toast("Specialty updated");D("#dlg").close();await window.freelanceAdmin()};
 const g=(a,b)=>{const x=D(a);if(x)x.onclick=async()=>{if(await upd("freelancer_profiles","user_id",id,{status:b},"Updated"))D("#dlg").close()}};g("#fs1","suspended");g("#fs2","approved")
}

async function pRev(id){
 const f=S.fp.find(x=>x.user_id===id)||{},items=S.pf.filter(p=>p.freelancer_id===id);
 open(`${mh("Portfolio Review")}<div class="fm"><div class="sl" style="margin-bottom:10px">${av(f)}<span><b style="font-size:18px;color:#0d4630">${esc(f.name||"Freelancer")}</b><br><small style="color:#667068">${esc(rateTxt(f))}</small></span></div><div class="pg">${items.map(p=>p.media_type==="video"?`<a target="_blank" rel="noopener" href="${esc(p.media_url)}" style="display:grid;place-items:center;background:#f5f5f5;border-radius:10px;color:#0d4630;font-weight:700">▶ Video</a>`:`<img alt="" src="${esc(p.media_url)}">`).join("")}</div><div class="fa2"><button class="btn" id="pr1">Reject Portfolio</button><button class="btn p" id="pr2">Approve Portfolio</button></div></div>`);
 const go=s=>async()=>{const ids=items.map(p=>p.id),{error}=await sb.from("freelancer_portfolio").update({status:s}).in("id",ids);if(error){toast(error.message,"error");return}D("#dlg").close();toast("Portfolio "+s);await window.freelanceAdmin()};D("#pr1").onclick=go("rejected");D("#pr2").onclick=go("approved")
}

let bound=false;
window.freelanceAdmin=async function(){const e=D("#vf");if(!S)e.innerHTML='<div class="card">Loading…</div>';await load();paint();if(bound)return;bound=true;
 e.addEventListener("change",ev=>{if(ev.target.id==="fsec"){V=ev.target.value;show();scrollTo(0,0)}});
 e.addEventListener("click",async ev=>{const b=ev.target.closest("[data-a]");if(!b)return;const a=b.dataset.a,id=b.dataset.id,sv=S.sv.find(x=>x.id===id);
  if(a==="newsv")svForm();else if(a==="editsv")svForm(sv);
  else if(a==="delsv"){if(await askConfirm({title:"Delete this service?",msg:"It will be removed permanently.",ok:"Yes, delete"})){const{error}=await sb.from("freelance_services").delete().eq("id",id);if(error)toast(error.message,"error");else{toast("Deleted");await window.freelanceAdmin()}}}
  else if(a==="togsv")upd("freelance_services","id",id,{active:!sv.active},sv.active?"Service deactivated":"Service activated");
  else if(a==="fok")upd("freelancer_profiles","user_id",id,{status:"approved"},"Freelancer approved");
  else if(a==="fno")upd("freelancer_profiles","user_id",id,{status:"rejected"},"Application rejected");
  else if(a==="fsus"){if(await askConfirm({title:"Suspend this freelancer?",msg:"They will be hidden and cannot take new orders.",ok:"Yes, suspend"}))upd("freelancer_profiles","user_id",id,{status:"suspended"},"Freelancer suspended")}
  else if(a==="fdet")fDet(id);else if(a==="prev")pRev(id);
  else if(a==="pok")upd("freelancer_portfolio","id",id,{status:"approved"},"Portfolio approved");else if(a==="pno")upd("freelancer_portfolio","id",id,{status:"rejected"},"Portfolio rejected");
  else if(a==="rvd"){const rv=S.rv.find(x=>String(x.id)===String(id));if(!rv)return;if(await askConfirm({title:"Delete this review?",msg:"It is removed permanently and the freelancer's average rating is recalculated.",ok:"Yes, delete"})){const{error}=await sb.from("freelance_reviews").delete().eq("id",id);if(error){toast(error.message,"error");return}const e2=await recalc(rv.freelancer_id);toast(e2?"Review deleted, but the average could not be updated: "+e2.message:"Review deleted",e2?"error":undefined);await window.freelanceAdmin()}}
  else if(a==="rcall"){b.disabled=true;const ids=[...new Set(S.rv.map(x=>x.freelancer_id))];let bad=null;for(const fid of ids){const e2=await recalc(fid);if(e2)bad=e2}toast(bad?bad.message:"Averages recalculated",bad?"error":undefined);await window.freelanceAdmin()}
  else if(a==="pjc")upd("freelance_projects","id",id,{status:"closed"},"Project closed");
  else if(a==="pjd"){if(await askConfirm({title:"Delete this project?",msg:"Its applications are removed too.",ok:"Yes, delete"})){const{error}=await sb.from("freelance_projects").delete().eq("id",id);if(error)toast(error.message,"error");else{toast("Deleted");await window.freelanceAdmin()}}}
  else if(a==="savecm"){const v=+D("#cmv").value;if(!(v>=0&&v<=90)){toast("Enter 0 to 90","error");return}const{error}=await sb.from("freelance_settings").update({commission_percent:v}).eq("id",1);toast(error?error.message:"Commission saved",error?"error":undefined);if(!error)S.cm=v}})}
})();