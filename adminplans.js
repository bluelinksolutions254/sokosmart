/* SOKO Smart admin: Settings > Payment Plans (Basic / Premium / Golden) and the M-Pesa payments received.
   Needs supabase-shop-plans.sql. Prices here are what the website charges when someone opens a shop. */
(()=>{
const KES=n=>"KES "+Number(n||0).toLocaleString("en-KE");
const when=d=>d?new Date(d).toLocaleString("en-KE",{dateStyle:"medium",timeStyle:"short"}):"—";
let PLANS=[],ERR="",SAVED=new Set();
const help=m=>/relation|does not exist|schema cache|row-level security|permission|policy/i.test(m||"")?"Not set up yet: run supabase-shop-plans.sql in the Supabase SQL editor, then reload. ("+m+")":m;

async function load(){ERR="";
 const r=await sb.from("shop_plans").select("*").order("sort_order");
 if(r.error){ERR=help(r.error.message);PLANS=[]}else PLANS=r.data||[];SAVED=new Set(PLANS.map(p=>p.id))}

function card(p,i){
 const feats=(Array.isArray(p.features)?p.features:[]).join("\n");
 return `<section class="card" style="margin-bottom:16px" data-plan="${esc(p.id)}">
  <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap"><h2 style="margin:0">${esc(p.name||"New package")}${p.name?" plan":""}</h2>
   <label style="display:flex;flex-direction:row;gap:8px;align-items:center;font-weight:600"><input type="checkbox" data-k="active" style="width:auto" ${p.active?"checked":""}> Available to customers</label><button class="btn d" data-keep data-pdel="${esc(p.id)}" type="button">Delete package</button></div>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px;margin-top:12px">
   <label>Plan name<input data-k="name" maxlength="30" value="${esc(p.name)}"></label>
   <label>Price (KES)<input data-k="price" type="number" min="0" step="1" value="${esc(p.price)}"></label>
   <label>Billing period (days; 0 = one-time, no renewal)<input data-k="duration_days" type="number" min="0" max="3650" step="1" value="${esc(p.duration_days)}"></label>
  </div>
  <label style="margin-top:12px">What the customer gets (one line each). Customers can turn automatic renewal on or off; renewals are taken from their SOKO Smart wallet.<textarea data-k="features" rows="4">${esc(feats)}</textarea></label></section>`}

function draw(rows){
 const st={paid:"approved",pending:"pending",failed:"rejected",cancelled:"rejected"};
 $("#vset").innerHTML=`<div class="ph"><div class="m" style="margin-bottom:2px">Settings &amp; Configuration</div><h1>Payment Plans</h1><p>What people pay by M-Pesa when they open a shop. Set the price of each package, add new packages, hide them or delete them.</p></div>
 ${ERR?`<div style="background:#fff4e0;border:1px solid var(--a);border-radius:12px;padding:12px 14px;margin-bottom:14px;color:var(--g)">${esc(ERR)}</div>`:""}
 <section class="card" style="margin-bottom:16px"><div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap"><div><h2 style="margin:0">Is M-Pesa ready?</h2><p class="m" style="margin:4px 0 0">Checks the plans, the database tables, your M-Pesa details and the connection to Safaricom.</p></div><button class="btn p" data-keep id="plChk" type="button">Check M-Pesa setup</button></div><div id="plChkOut" style="margin-top:10px"></div></section>
 ${PLANS.map(card).join("")}
 ${ERR?"":(PLANS.length?"":'<p class="m" style="margin:0 0 14px">No packages yet. Add one so customers can open a shop.</p>')+`<div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:22px"><button class="btn" data-keep id="plAdd" type="button">+ Add package</button>${PLANS.length?'<button class="btn p" id="plSave" type="button">Save</button>':""}<span class="m" id="plMsg"></span></div>`}
 <section class="card"><div style="display:flex;justify-content:space-between;align-items:center"><h2 style="margin:0">Shop payments received</h2><button class="btn" id="plRef" type="button">Refresh</button></div>
  <p class="m">M-Pesa details (shortcode, keys, passkey) are entered in Settings → Payment Gateway Settings.</p><div id="plPay">Loading…</div></section>
 <section class="card" style="margin-top:16px"><h2 style="margin:0 0 4px">Wallet deposits received (M-Pesa)</h2><p class="m">A deposit marked “Not credited” was paid but could not be added to the wallet yet. Use the retry icon to try again.</p><div id="plDep">Loading…</div></section>`;
 payments();deposits()}

async function deposits(){const el=$("#plDep");if(!el)return;
 const r=await sb.from("wallet_deposits").select("*").order("created_at",{ascending:false}).limit(50);
 if(r.error){el.innerHTML=`<p class="m">${esc(/relation|does not exist|schema cache/i.test(r.error.message)?"Not set up yet: run supabase-wallet-deposits.sql in the Supabase SQL editor.":r.error.message)}</p>`;return}
 const st={paid:"approved",pending:"pending",failed:"rejected",cancelled:"rejected"},ok=(r.data||[]).filter(x=>x.status==="paid");
 el.innerHTML=(r.data||[]).length?`<p style="margin:0 0 10px"><b>${ok.length}</b> paid · <b>${KES(ok.reduce((a,x)=>a+x.amount,0))}</b> in the latest ${r.data.length} deposits</p><div class="wrap"><table style="min-width:640px"><thead><tr><th>When</th><th>Amount</th><th>Phone</th><th>Status</th><th>In wallet</th><th>M-Pesa receipt</th><th></th></tr></thead><tbody>${r.data.map(x=>`<tr><td>${esc(when(x.created_at))}</td><td>${KES(x.amount)}</td><td>${esc(x.phone||"—")}</td><td><span class="pill ${st[x.status]||""}">${esc(x.status)}</span></td><td>${x.credited?"Yes":x.status==="paid"?`<span style="color:var(--r)">Not credited</span>${x.credit_note?`<div class="m">${esc(x.credit_note)}</div>`:""}`:"—"}</td><td>${esc(x.mpesa_receipt||"—")}</td><td>${x.status==="paid"&&!x.credited?`<button class="btn s" data-cr="${esc(x.id)}" type="button">Retry</button>`:""}</td></tr>`).join("")}</tbody></table></div>`:'<p class="m">No deposits yet.</p>'}

async function payments(){const el=$("#plPay");if(!el)return;
 const r=await sb.from("shop_payments").select("*").order("created_at",{ascending:false}).limit(50);
 if(r.error){el.innerHTML=`<p class="m">${esc(help(r.error.message))}</p>`;return}
 const st={paid:"approved",pending:"pending",failed:"rejected",cancelled:"rejected"},nm={};PLANS.forEach(p=>nm[p.id]=p.name);
 const paid=(r.data||[]).filter(x=>x.status==="paid");
 el.innerHTML=(r.data||[]).length?`<p style="margin:0 0 10px"><b>${paid.length}</b> paid · <b>${KES(paid.reduce((a,x)=>a+x.amount,0))}</b> in the latest ${r.data.length} payments</p>
  <div class="wrap"><table style="min-width:640px"><thead><tr><th>When</th><th>Plan</th><th>Amount</th><th>Phone</th><th>Type</th><th>Status</th><th>M-Pesa receipt</th><th>Shop opened</th></tr></thead><tbody>${r.data.map(x=>`<tr><td>${esc(when(x.created_at))}</td><td>${esc(nm[x.plan_id]||x.plan_id)}</td><td>${KES(x.amount)}</td><td>${esc(x.phone||"—")}</td><td>${x.kind==="renew"?"Renewal (wallet)":"Opening (M-Pesa)"}</td><td><span class="pill ${st[x.status]||""}">${esc(x.status)}</span></td><td>${esc(x.mpesa_receipt||"—")}</td><td>${x.shop_id?"Yes":x.status==="paid"?"Not yet":"—"}</td></tr>`).join("")}</tbody></table></div>`:'<p class="m">No payments yet.</p>'}

/* keep what the admin has typed when the list is redrawn (add / delete) */
function snap(){document.querySelectorAll("#vset [data-plan]").forEach(c=>{const g=k=>c.querySelector(`[data-k="${k}"]`),p=PLANS.find(x=>x.id===c.dataset.plan);if(!p||!g("name"))return;
 p.name=g("name").value;p.price=g("price").value;p.duration_days=g("duration_days").value;p.active=g("active").checked;p.features=g("features").value.split(/\r?\n/).map(t=>t.trim()).filter(Boolean)})}
document.addEventListener("click",async e=>{
 if(e.target.closest("#plAdd")){snap();PLANS.push({id:"plan-"+Date.now().toString(36),name:"",price:"",duration_days:30,features:[],active:true,sort_order:PLANS.length+1});draw();
  const cs=document.querySelectorAll("#vset [data-plan]"),last=cs[cs.length-1];if(last){last.scrollIntoView({behavior:"smooth",block:"center"});const n=last.querySelector('[data-k="name"]');if(n)n.focus()}return}
 const dl=e.target.closest("[data-pdel]");if(dl){const id=dl.dataset.pdel;snap();const p=PLANS.find(x=>x.id===id);if(!p)return;const nm=(p.name||"").trim()||"new";
  const yes=typeof askConfirm==="function"?await askConfirm({title:"Delete the "+nm+" package?",msg:SAVED.has(id)?"Customers will no longer see it, and shops on this plan may not be able to renew. To only hide it, untick “Available to customers” instead. This cannot be undone.":"This package has not been saved yet.",ok:"Yes, delete"}):confirm("Delete the "+nm+" package?");
  if(!yes)return;
  if(SAVED.has(id)){dl.disabled=true;const {error}=await sb.from("shop_plans").delete().eq("id",id);
   if(error){dl.disabled=false;toast(/foreign key|violates|23503/i.test(error.message)?"This package already has payments, so it cannot be deleted. Untick “Available to customers” and Save to hide it instead.":help(error.message),"error");return}
   SAVED.delete(id);toast("Package deleted.")}
  PLANS=PLANS.filter(x=>x.id!==id);draw();return}
 if(e.target.closest("#plChk")){const b=e.target.closest("#plChk"),out=$("#plChkOut");b.disabled=true;out.innerHTML='<p class="m">Checking…</p>';
  let r;try{r=await sb.functions.invoke("mpesa-check")}catch(x){r={error:x}}
  let d=r&&r.data;if(r&&r.error&&!d){try{d=await r.error.context.json()}catch(x){}}
  b.disabled=false;
  if(!d||!d.checks){out.innerHTML=`<p style="color:var(--r);margin:0">${esc((d&&d.error)||"The check could not run. Deploy the function first: supabase functions deploy mpesa-check")}</p>`;return}
  out.innerHTML=d.checks.map(c=>`<div style="display:flex;gap:10px;align-items:flex-start;padding:6px 0;border-top:1px solid var(--bd)"><b style="color:${c.ok?"var(--g2)":"var(--r)"};min-width:18px">${c.ok?"✓":"✗"}</b><div><div style="font-weight:600">${esc(c.label)}</div>${c.hint&&!c.ok?`<div class="m">${esc(c.hint)}</div>`:c.hint?`<div class="m" style="word-break:break-all">${esc(c.hint)}</div>`:""}</div></div>`).join("");return}
 if(e.target.closest("#plRef")){payments();deposits();return}
 const cr=e.target.closest("[data-cr]");if(cr){cr.disabled=true;const {data,error}=await sb.rpc("admin_credit_deposit",{p_deposit:cr.dataset.cr});toast(error?error.message:data==="ok"?"Deposit added to the wallet.":"Not credited: "+data);deposits();return}
 const b=e.target.closest("#plSave");if(!b)return;
 const msg=$("#plMsg"),rows=[];let bad="";
 document.querySelectorAll("#vset [data-plan]").forEach((c,i)=>{const g=k=>c.querySelector(`[data-k="${k}"]`),p=PLANS.find(x=>x.id===c.dataset.plan),price=Math.round(+g("price").value),days=Math.round(+g("duration_days").value||0);
  if(!g("name").value.trim())bad="Every plan needs a name.";if(!(price>=0)||g("price").value==="")bad="Enter a price for every plan.";
  rows.push({id:p.id,name:g("name").value.trim(),price,duration_days:Math.max(0,days),active:g("active").checked,sort_order:i+1,features:g("features").value.split(/\r?\n/).map(s=>s.trim()).filter(Boolean)})});
 if(bad){msg.style.color="var(--r)";msg.textContent=bad;return}
 b.disabled=true;msg.style.color="inherit";msg.textContent="Saving…";
 const {error}=await sb.from("shop_plans").upsert(rows,{onConflict:"id"});b.disabled=false;
 if(error){msg.style.color="var(--r)";msg.textContent="Could not save: "+help(error.message);return}
 PLANS=rows;SAVED=new Set(rows.map(r=>r.id));msg.textContent=rows.some(r=>r.active)?"Saved. The website now charges these prices.":"Saved, but no package is switched on, so nobody can open a shop until you tick “Available to customers” on one.";toast("Payment plans saved.")});

window.plansAdmin=async()=>{$("#vset").innerHTML='<p class="m">Loading…</p>';await load();draw()};
})();