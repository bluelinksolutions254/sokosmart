/* SOKO Smart admin: post listings directly (Products, Jobs, Services, Free Things).
   Needs admin.html globals: sb, $, esc, toast, SEC, sec, refresh, COUNTIES.
   Listings posted here go live immediately (status "approved") and belong to the admin account. */
(()=>{
const KINDS=["Giveaway","Charity","Donation","Free to collect"];
const JT=["Full-time","Part-time","Contract","Internship","Casual"],JM=["On-site","Remote","Hybrid"],JX=["Entry-level","Mid-level","Senior"];
const AV=["Available now","Weekdays","Weekends","By appointment"],CO=["New","Used","Refurbished"];
const CAN=["products","shops","jobs","services","free"];
const LBLS={products:"product",shops:"shop",jobs:"job",services:"service",free:"free item"};
let CATS=[];

const opt=(a,v="")=>a.map(x=>`<option ${x===v?"selected":""}>${esc(x)}</option>`).join("");
const selF=(l,n,a,rq="")=>`<label>${l}<select name="${n}" ${rq}><option value="">Choose</option>${opt(a)}</select></label>`;
const inF=(l,n,t="text",x="")=>`<label>${l}<input name="${n}" type="${t}" ${x}></label>`;
const taF=(l,n,r=3,x="")=>`<label>${l}<textarea name="${n}" rows="${r}" ${x}></textarea></label>`;
const ck=(l,n,on=false)=>`<label style="display:flex;gap:8px;align-items:center"><input type="checkbox" name="${n}" ${on?"checked":""} style="width:auto"> ${l}</label>`;
const two=(...a)=>`<div class="two" style="display:grid;grid-template-columns:1fr 1fr;gap:10px">${a.join("")}</div>`;

/* extra fields an admin defined for a product category (Categories > Form fields) */
function attrHTML(fs){return fs.map(f=>{const n="a_"+f.key,rq=f.required?"required":"",L=esc(f.label)+(f.required?" *":"");
 if(f.type==="textarea")return `<label style="grid-column:1/-1">${L}<textarea name="${n}" rows="2" ${rq}></textarea></label>`;
 if(f.type==="select"||f.type==="yesno"){const o=f.type==="yesno"?["Yes","No"]:(f.options||[]);return `<label>${L}<select name="${n}" ${rq}><option value="">Choose</option>${opt(o)}</select></label>`}
 return `<label>${L}<input name="${n}" type="${f.type==="number"?"number":f.type==="date"?"date":"text"}" ${f.type==="number"?'min="0" step="any"':'maxlength="200"'} ${rq}></label>`}).join("")}
const readAttrs=(f,fs)=>{const o={};fs.forEach(x=>{const el=f.elements["a_"+x.key];if(!el)return;const v=el.value.trim();if(v==="")return;o[x.key]=x.type==="number"?+v:v});return o};
const fieldsOf=id=>{const c=CATS.find(x=>String(x.id)===String(id));return Array.isArray(c&&c.fields)?c.fields:[]};

async function loadCats(k){if(k==="services"){const sr=await sb.from("sh_categories").select("id,name").eq("active",true).order("sort_order").order("name");CATS=sr.data||[];return}let r=await sb.from("categories").select("id,name,fields").eq("section",k).order("sort_order");
 if(r.error)r=await sb.from("categories").select("id,name").eq("section",k).order("sort_order");CATS=r.data||[]}

function formHTML(k){
 const catSel=(l="Category *")=>`<label>${l}<select name="category_id" required><option value="">Choose</option>${CATS.map(c=>`<option value="${c.id}">${esc(c.name)}</option>`).join("")}</select></label>`;
 const img=two(inF("Photo (upload)","img","file",'accept="image/*"'),inF("…or image link (optional)","img_url","url",'placeholder="https://…"'));
 const feat=ck("Feature on the homepage","is_featured");
 const badge=`<div class="apv"><img class="apv-i" src="logo.png" alt="Soko Smart"><div><b>Shop: Soko Smart</b> <i class="vbd" title="Verified"><svg viewBox="0 0 24 24" width="16" height="16"><path fill="#3897F0" d="M12 1.8l2.6 1.9 3.2-.1 1 3 2.6 1.9-1 3.1 1 3.1-2.6 1.9-1 3-3.2-.1L12 22.2l-2.6-1.9-3.2.1-1-3-2.6-1.9 1-3.1-1-3.1 2.6-1.9 1-3 3.2.1z"/><path d="M8 12.2l2.6 2.6L16 9.4" fill="none" stroke="#fff" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"/></svg></i><div class="m">Products you post here are sold by Soko Smart.</div></div></div>`;
 /* same fields, same order as Shop Manager > Add product on the website */
 if(k==="products")return badge+inF("Product name *","title","text",'required maxlength="120"')
  +two(catSel(),selF("Condition (optional)","condition",CO))+`<div id="ax" class="axg"></div>`
  +two(inF("Price (KSh) *","price","number",'min="0" required'),inF("Opening stock *","stock","number",'min="0" value="1" required'))
  +two(selF("County *","county",COUNTIES,"required"),inF("Town","town"))
  +img+taF("Description","description",4)+ck("Price is negotiable","negotiable")+feat;
 if(k==="shops")return badge.replace("Products you post here are sold by Soko Smart.","Shops you create here are marked verified.").replace("Shop: Soko Smart","Verified shop")+inF("Shop name *","name","text",'required maxlength="80"')
  +taF("About the shop","description",3)+two(selF("County *","county",COUNTIES,"required"),inF("Town","town"))+inF("Neighbourhood","neighbourhood")
  +img;
 if(k==="services")return `<p class="m" style="margin:0">This adds a service to the Services page (servicehub.html), where approved providers sign up to offer it.</p>`+two(inF("Service title *","title","text",'required maxlength="120"'),catSel())
  +two(inF("Lowest price (KSh)","base_price","number",'min="0"'),inF("Highest price (KSh)","max_price","number",'min="0"'))
  +`<label>Price is<select name="price_unit"><option>per job</option><option>per hour</option><option>per day</option></select></label>`
  +taF("Description","description",3)+img;
 if(k==="free")return inF("What is being given? *","title","text",'required maxlength="120"')+two(selF("Type *","kind",KINDS,"required"),selF("County *","county",COUNTIES,"required"))
  +inF("Town","town")+img+taF("Details (condition, how to collect…) *","description",4,"required");
 /* jobs: same fields, same order as Profile > Post a job on the website */
 return `<p class="m" style="margin:0">Fields marked * are required.</p>`
  +two(inF("Job title *","title","text",'required maxlength="120" placeholder="e.g. Digital Marketing Executive"'),inF("Company name *","company","text",'required maxlength="120"'))
  +two(inF("Company logo","img","file",'accept="image/*"'),catSel("Job category *"))
  +two(selF("Employment type *","employment_type",JT,"required"),selF("Work arrangement","work_mode",JM))
  +two(selF("Experience level","experience_level",JX),selF("County *","county",COUNTIES,"required"))
  +two(inF("Town / city","town"),inF("Number of vacancies","vacancies","number",'min="1" value="1"'))
  +two(inF("Minimum salary (KSh)","salary_min","number",'min="0"'),inF("Maximum salary (KSh)","salary_max","number",'min="0"'))
  +ck("Salary is negotiable","salary_negotiable")
  +taF("Job description *","description",4,"required")+taF("Responsibilities (one per line)","responsibilities",4)+taF("Requirements (one per line)","requirements",4)
  +inF("Application deadline","deadline","date")
  +`<label>How should people apply? *<select name="application_method" required><option value="Easy Apply">Easy Apply on SOKO Smart</option><option value="Email">By email</option><option value="Website">External website link</option></select></label>`
  +`<label id="jae" hidden>Application email *<input name="apply_email" type="email"></label><label id="jau" hidden>Application link *<input name="apply_url" type="url" placeholder="https://…"></label>`
  +two(inF("Contact person","contact_name"),inF("Contact phone","contact_phone","tel"))+inF("Contact email","contact_email","email")
  +ck("Urgently hiring","is_urgent")+feat}

/* look of the form: same as the forms on the website (labels above bordered fields, orange focus, green button) */
function formCSS(){if(document.getElementById("apcss"))return;const s=document.createElement("style");s.id="apcss";s.textContent=`
#dlg.postwide{max-width:780px;width:calc(100% - 24px);max-height:94vh;padding:18px 20px;overflow-x:hidden;overflow-y:auto}
#dlg.postwide #dc{width:100%;min-width:0}#apf *{min-width:0;box-sizing:border-box}
#apf{display:grid;gap:12px}#apf label{display:grid;gap:5px;font-size:13px;font-weight:600;color:#5b534b;text-align:left}
#apf input:not([type=checkbox]),#apf select,#apf textarea{width:100%;box-sizing:border-box;border:1px solid #e6dccd;border-radius:8px;padding:9px 10px;font:inherit;font-weight:400;background:#fff;color:#1d1a16}
#apf input:focus,#apf select:focus,#apf textarea:focus{outline:0;border-color:#F58E20;box-shadow:0 0 0 3px rgba(245,142,32,.18)}
#apf .two,#apf .axg{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}#apf .axg:empty{display:none}
#apf label[style*="flex"]{font-weight:600}
@media(max-width:560px){#apf .two,#apf .axg{grid-template-columns:minmax(0,1fr)}}
.apv{display:flex;gap:10px;align-items:center;background:#F3F8FE;border:1px solid #d6e6fb;border-radius:12px;padding:10px 12px}
.apv-i{width:44px;height:44px;border-radius:50%;background:#fff;border:1px solid #d6e6fb;object-fit:contain;padding:3px;flex:none}
.apv .vbd{display:inline-flex;vertical-align:middle}.apv .m{font-size:13px;color:#6b625a;font-weight:400}`;document.head.appendChild(s)}

async function open(){const k=sec;if(!CAN.includes(k))return;formCSS();
 await loadCats(k);
 const dl=$("#dlg");dl.classList.add("postwide");if(!dl._pw){dl._pw=1;dl.addEventListener("close",()=>dl.classList.remove("postwide"))}
 $("#dc").innerHTML=`<h3 style="margin:0 0 4px">Post a ${LBLS[k]}</h3><p class="m" style="margin:0 0 12px">It goes live straight away and is listed under your admin account.</p>
 <form id="apf" data-k="${k}">${formHTML(k)}
 <div style="display:flex;gap:8px;justify-content:flex-end;position:sticky;bottom:-18px;background:#fff;padding:10px 0;border-top:1px solid #eee"><button type="button" class="btn" id="ec">Cancel</button><button class="btn p" id="apgo">Publish ${LBLS[k]}</button></div></form>`;
 $("#dlg").showModal()}

async function upload(file,uid,tag){if(!file)return null;
 if(!/^image\//.test(file.type)||file.size>3e6)throw new Error("The photo must be an image under 3 MB");
 const ext=(file.name.split(".").pop()||"png").toLowerCase().replace(/[^a-z0-9]/g,"")||"png",path=`${uid}/${tag}-${Date.now()}.${ext}`;
 const up=await sb.storage.from("listing-images").upload(path,file,{contentType:file.type});if(up.error)throw up.error;
 return sb.storage.from("listing-images").getPublicUrl(path).data.publicUrl}

async function build(f,k,uid){
 const v=n=>f.elements[n]?f.elements[n].value.trim():"",num=n=>v(n)===""?null:+v(n),on=n=>!!(f.elements[n]&&f.elements[n].checked);
 const file=f.elements.img&&f.elements.img.files&&f.elements.img.files[0];
 const url=await upload(file,uid,k==="jobs"?"logo":"admin")||(v("img_url")||null);
 if(k==="shops")return{owner_id:uid,status:"approved",name:v("name"),description:v("description")||null,county:v("county"),town:v("town")||null,neighbourhood:v("neighbourhood")||null,logo_url:url,cover_url:url,seller_verified:true};
 const base={owner_id:uid,status:"approved",title:v("title"),county:v("county"),town:v("town")||null};
 if(k==="free")return{...base,kind:v("kind"),description:v("description"),cover_url:url};
 if(k==="products"){const fs=fieldsOf(v("category_id"));
  return{...base,neighbourhood:v("neighbourhood")||null,category_id:+v("category_id"),price:num("price"),stock:Math.max(0,num("stock")||0),condition:v("condition")||null,negotiable:on("negotiable"),
   attributes:readAttrs(f,fs),description:v("description")||null,cover_url:url,is_featured:on("is_featured"),seller_verified:true,shop_name:"Soko Smart"}}
 if(k==="services")return{title:v("title"),category_id:v("category_id")||null,description:v("description")||null,base_price:num("base_price"),max_price:num("max_price"),price_unit:v("price_unit")||"per job",active:true,image_url:url};
 const mn=num("salary_min"),mx=num("salary_max"),m=v("application_method");
 if(mn!=null&&mx!=null&&mn>mx)throw new Error("Maximum salary must be higher than the minimum");
 if(m==="Email"&&!v("apply_email"))throw new Error("Enter the application email");
 if(m==="Website"&&!/^https?:\/\//i.test(v("apply_url")))throw new Error("Enter the application link starting with https://");
 return{...base,company:v("company"),company_logo_url:url,category_id:+v("category_id"),employment_type:v("employment_type"),work_mode:v("work_mode")||null,experience_level:v("experience_level")||null,
  salary_min:mn,salary_max:mx,salary_negotiable:on("salary_negotiable"),price:mn??mx,description:v("description"),responsibilities:v("responsibilities")||null,requirements:v("requirements")||null,
  deadline:v("deadline")||null,vacancies:Math.max(1,num("vacancies")||1),application_method:m,apply_email:m==="Email"?v("apply_email"):null,apply_url:m==="Website"?v("apply_url"):null,
  contact_name:v("contact_name")||null,contact_phone:v("contact_phone")||null,contact_email:v("contact_email")||null,is_urgent:on("is_urgent"),seller_verified:true,is_featured:on("is_featured")}}

document.addEventListener("click",async e=>{if(e.target.closest("#addL")){try{await open()}catch(err){toast("Could not open the form: "+(err.message||err),"error")}}},true);
document.addEventListener("change",e=>{const t=e.target,f=t.form;if(!f||f.id!=="apf")return;
 if(t.name==="category_id"&&f.dataset.k==="products"){const fs=fieldsOf(t.value),box=f.querySelector("#ax");if(box)box.innerHTML=fs.length?attrHTML(fs):""}
 if(t.name==="application_method"){f.querySelector("#jae").hidden=t.value!=="Email";f.querySelector("#jau").hidden=t.value!=="Website";f.apply_email.required=t.value==="Email";f.apply_url.required=t.value==="Website"}});
document.addEventListener("submit",async e=>{const f=e.target;if(f.id!=="apf")return;e.preventDefault();
 const k=f.dataset.k,btn=$("#apgo");btn.disabled=true;
 try{const uid=(await sb.auth.getSession()).data.session?.user.id;if(!uid)throw new Error("Please log in again");
  const row=await build(f,k,uid),T=k==="services"?"sh_services":SEC[k][1];
  let warn=0,{error}=await sb.from(T).insert(row);
  for(let n=0;error&&n<5;n++){const m=String(error.message||"").match(/'([a-z_]+)' column|column "?([a-z_]+)"?/i),c=m&&(m[1]||m[2]);
   if(!c||!(c in row)||["owner_id","status","title","name"].includes(c))break;delete row[c];warn=1;({error}=await sb.from(T).insert(row))}
  if(error)throw error;
  $("#dlg").close();warn?toast("Published, but some optional details were skipped because the table is missing those columns.","error"):toast(k==="services"?"Service added. It now shows on the Services page (servicehub.html).":"Published. It is live on the marketplace.");refresh()}
 catch(err){toast(/row-level|policy/i.test(err.message||"")?"Your account is not allowed to post here yet. Run supabase-payments.sql (admin posting policies) in Supabase.":(err.message||String(err)),"error")}
 btn.disabled=false});
})();