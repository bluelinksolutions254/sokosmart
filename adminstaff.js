/* SOKO Smart admin: add / edit / delete users (customers, staff with limited sections, admins).
   Needs admin.html globals: sb, CFG, NAV, EYE, IBN, $, esc, toast, page, users, UROWS. Run supabase-staff-users.sql once in Supabase. */
(()=>{
const DOM="@sokosmart.co.ke",NIL="00000000-0000-0000-0000-000000000000",MISSING=/could not find|does not exist|schema cache/i;
const refreshUsers=()=>{if(page==="users")users();else if(page==="customers")customers()};
const HEARD=["Facebook","Instagram","TikTok","WhatsApp","Friend or family","Google search","Other"];
const hsel=(v,req)=>`<label>How they heard about us<select name="hh" ${req?"required":""}><option value="">Choose…</option>${HEARD.map(o=>`<option ${o===v?"selected":""}>${o}</option>`).join("")}</select></label>`;
const full=()=>typeof ALLOWED==="undefined"||!ALLOWED;
const typeOf=u=>Array.isArray(u.admin_sections)&&u.admin_sections.length?"staff":u.role==="admin"?"admin":"customer";
const pw=(n,l,ac,req)=>`<label>${l}<div class="pwf"><input name="${n}" type="password" ${req?"required":""} minlength="8" autocomplete="${ac}"><button type="button" class="eye" data-eye aria-label="Show password" aria-pressed="false">${EYE}</button></div></label>`;
const ck="display:flex;flex-direction:row;gap:8px;align-items:center;color:var(--tx);font-size:14px";
const tmpClient=()=>window.supabase.createClient(CFG.url,CFG.key,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false,storageKey:"soko-staff-tmp"}});
const setup="Not set up yet: run supabase-staff-users.sql in the Supabase SQL editor, then try again.";
const open=h=>{$("#dc").innerHTML=h;if(!$("#dlg").open)$("#dlg").showModal()};

/* ---------- add / edit form ---------- */
function openForm(u){
 if(!full()){toast("Only a full administrator can do this.","error");return}
 const ed=!!u,cu=ed&&u._kind==="customer",ty=ed&&!cu?typeOf(u):"staff",mine=ed&&u.id===ADMIN_ID,secs=ed&&Array.isArray(u.admin_sections)?u.admin_sections:[];
 open(`<h3>${cu?"Edit customer":ed?"Edit user":"Add new user"}</h3><form id="stf" data-kind="${cu?"customer":"staff"}" ${ed?`data-id="${esc(u.id)}" data-type0="${ty}"`:""} novalidate style="display:grid;gap:12px">
  <label>Full name<input name="nm" required maxlength="80" autocomplete="off" value="${esc(ed?(u.full_name||u.name||""):"")}"></label>
  <label>Email<input name="em" type="email" required placeholder="name${DOM}" autocomplete="off" value="${esc(ed?(u.email||""):"")}" ${ed?"readonly":""}><span class="m">${cu?"The sign-in email cannot be changed here.":ed?"The sign-in email cannot be changed here. Staff and admins must use "+DOM:"Must end with "+DOM}</span></label>
  ${ed?`<label>Phone<input name="ph" maxlength="30" autocomplete="off" value="${esc(u.phone||"")}"></label>`:""}${cu?hsel(u.heard_from||"",false):""}
  ${cu?"":`<label>Account type<select name="ty" ${mine?"disabled":""}><option value="staff" ${ty==="staff"?"selected":""}>Staff (only the sections I choose)</option><option value="admin" ${ty==="admin"?"selected":""}>Admin (full access, can manage users)</option></select>${mine?'<span class="m">You cannot change your own access.</span>':""}</label>`}
  ${cu?"":`<fieldset id="stSecs" ${ty==="staff"?"":"hidden"} style="border:1px solid var(--bd);border-radius:12px;padding:10px 12px;margin:0;min-width:0"><legend style="font-size:13px;color:var(--mut);padding:0 6px">Sections this person can open</legend>
   <label style="${ck};margin-bottom:8px;font-weight:700"><input type="checkbox" id="stAll" style="width:auto"> Select all</label>
   <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:6px">${NAV.map(([k,l])=>`<label style="${ck}"><input type="checkbox" name="sec" value="${esc(k)}" style="width:auto" ${secs.includes(k)?"checked":""}> ${esc(l)}</label>`).join("")}</div></fieldset>`}
  ${ed?'<p class="m" style="margin:0">Leave both password boxes empty to keep the current password.</p>':""}
  ${pw("pw",ed?"New password":"Password","new-password",!ed)}${pw("pc",ed?"Confirm new password":"Confirm password","new-password",!ed)}
  <div class="err" id="stErr" role="alert" style="color:var(--r);font-size:14px;min-height:20px"></div>
  <div style="display:flex;gap:8px;justify-content:flex-end;flex-wrap:wrap"><button type="button" class="btn" data-stx>Cancel</button><button class="btn p" id="stGo">${ed?"Save changes":"Create user"}</button></div></form>`);
 syncAll();$("#stf").nm.focus()}
const syncAll=()=>{const a=[...document.querySelectorAll("#stf [name=sec]")],b=$("#stAll");if(b)b.checked=a.length>0&&a.every(c=>c.checked)};

/* ---------- delete (own password three times) ---------- */
function openDelete(u){
 if(!full()){toast("Only a full administrator can delete users.","error");return}
 if(u.id===ADMIN_ID){toast("You cannot delete your own account.","error");return}
 open(`<h3>Delete user</h3><form id="sdf" data-id="${esc(u.id)}" novalidate style="display:grid;gap:12px">
  <p style="margin:0">You are about to delete <b>${esc(u.full_name||u.name||u.email||"this user")}</b>${u.email?` (${esc(u.email)})`:""}. They will no longer be able to sign in. This cannot be undone.</p>
  <p class="m" style="margin:0">To confirm, type <b>your own</b> password three times.</p>
  ${pw("p1","Your password (1 of 3)","current-password",true)}${pw("p2","Your password (2 of 3)","current-password",true)}${pw("p3","Your password (3 of 3)","current-password",true)}
  <div class="err" id="sdErr" role="alert" style="color:var(--r);font-size:14px;min-height:20px"></div>
  <div style="display:flex;gap:8px;justify-content:flex-end;flex-wrap:wrap"><button type="button" class="btn" data-stx>Cancel</button><button class="btn d" id="sdGo">Delete user</button></div></form>`);
 $("#sdf").p1.focus()}

document.addEventListener("click",e=>{
 if(e.target.closest("#addC")){e.preventDefault();openCustomer();return}
 if(e.target.closest("#addU")){e.preventDefault();e.stopImmediatePropagation();openForm();return}
 let b;
 if(b=e.target.closest("[data-ued]")){const u=(window.UROWS||[]).find(x=>String(x.id)===b.dataset.ued);if(u)openForm(u);return}
 if(b=e.target.closest("[data-udel]")){const u=(window.UROWS||[]).find(x=>String(x.id)===b.dataset.udel);if(u)openDelete(u);return}
 if(e.target.closest("[data-stx]"))$("#dlg").close()},true);
document.addEventListener("change",e=>{
 if(e.target.id==="stAll")document.querySelectorAll("#stf [name=sec]").forEach(c=>c.checked=e.target.checked);
 else if(e.target.name==="sec")syncAll();
 else if(e.target.name==="ty"&&e.target.closest("#stf"))$("#stSecs").hidden=e.target.value!=="staff"});

document.addEventListener("submit",async e=>{const f=e.target;
 if(f.id==="stf"){e.preventDefault();return save(f)}
 if(f.id==="sdf"){e.preventDefault();return remove(f)}
 if(f.id==="scf"){e.preventDefault();return saveCustomer(f)}});

/* ---------- register a customer ---------- */
function openCustomer(){
 if(!full()){toast("Only a full administrator can do this.","error");return}
 open(`<h3>Register a customer</h3><form id="scf" novalidate style="display:grid;gap:12px">
  <label>Name<input name="nm" required maxlength="80" autocomplete="off"></label>
  <label>Email<input name="em" type="email" required autocomplete="off"></label>
  <label>Phone number<input name="ph" type="tel" required autocomplete="off" placeholder="0712 345 678"></label>
  ${hsel("",true)}
  ${pw("pw","Password","new-password",true)}${pw("pc","Confirm password","new-password",true)}
  <div class="err" id="scErr" role="alert" style="color:var(--r);font-size:14px;min-height:20px"></div>
  <div style="display:flex;gap:8px;justify-content:flex-end;flex-wrap:wrap"><button type="button" class="btn" data-stx>Cancel</button><button class="btn p" id="scGo">Register customer</button></div></form>`);
 $("#scf").nm.focus()}
async function saveCustomer(f){
 const err=m=>{$("#scErr").textContent=m||""},go=$("#scGo");err("");
 const name=f.nm.value.trim(),email=f.em.value.trim().toLowerCase(),phone=f.ph.value.replace(/\s+/g,""),heard=f.hh.value,p=f.pw.value;
 if(name.length<2)return err("Enter the customer's name.");
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return err("Enter a valid email address.");
 if(!/^(254|0|\+254)[17]\d{8}$/.test(phone))return err("Enter a valid Kenyan phone number, e.g. 0712 345 678.");
 if(!heard)return err("Choose how they heard about us.");
 if(p.length<8)return err("The password must be at least 8 characters.");
 if(p!==f.pc.value)return err("The passwords do not match.");
 go.disabled=true;go.textContent="Registering…";
 const fail=m=>{err(m);go.disabled=false;go.textContent="Register customer"};
 try{
  const pre=await sb.rpc("admin_register_customer",{p_user:NIL,p_name:name,p_phone:phone,p_heard:heard});
  if(pre.error&&MISSING.test(pre.error.message))return fail(setup);
  if(pre.error&&/full administrator/i.test(pre.error.message))return fail(pre.error.message);
  const {data,error}=await tmpClient().auth.signUp({email,password:p,options:{data:{full_name:name,phone,heard_from:heard}}});
  if(error)return fail(error.message);
  if(!data.user||(data.user.identities&&!data.user.identities.length))return fail("That email already has an account.");
  const r=await sb.rpc("admin_register_customer",{p_user:data.user.id,p_name:name,p_phone:phone,p_heard:heard});
  if(r.error)return fail("The account was created but its details could not be saved: "+r.error.message);
  $("#dlg").close();toast(name+" is registered and can sign in on the website.");refreshUsers()
 }catch(x){fail(x.message||"Something went wrong.")}}


async function save(f){
 const ed=!!f.dataset.id,err=m=>{$("#stErr").textContent=m||""},go=$("#stGo"),label=go.textContent;err("");
 const name=f.nm.value.trim(),email=f.em.value.trim().toLowerCase(),cu=f.dataset.kind==="customer",ty=cu?"customer":(f.ty.disabled?f.dataset.type0:f.ty.value),
  secs=ty==="staff"?[...f.querySelectorAll("[name=sec]:checked")].map(c=>c.value):[],p=f.pw.value;
 if(name.length<2)return err("Enter the full name.");
 if(ty!=="customer"&&!/^[^\s@]+@sokosmart\.co\.ke$/.test(email))return err("Staff and admin emails must end with "+DOM);
 if(!ed&&!/^[^\s@]+@sokosmart\.co\.ke$/.test(email))return err("The email must end with "+DOM);
 if(ty==="staff"&&!secs.length)return err("Choose at least one section.");
 if(!ed||p||f.pc.value){if(p.length<8)return err("The password must be at least 8 characters.");if(p!==f.pc.value)return err("The passwords do not match.")}
 go.disabled=true;go.textContent=ed?"Saving…":"Creating…";
 const fail=m=>{err(m);go.disabled=false;go.textContent=label};
 try{
  if(ed){
   const r=cu?await sb.rpc("admin_update_customer",{p_user:f.dataset.id,p_name:name,p_phone:f.ph.value.trim(),p_heard:f.hh.value||null,p_password:p||null}):await sb.rpc("admin_update_staff",{p_user:f.dataset.id,p_name:name,p_phone:f.ph.value.trim(),p_type:ty,p_sections:secs,p_password:p||null});
   if(r.error)return fail(MISSING.test(r.error.message)?setup:r.error.message);
   $("#dlg").close();toast(cu?"Customer updated.":"User updated.");refreshUsers();return}
  /* check the database is ready before an account is created */
  const pre=await sb.rpc("admin_set_account",{p_user:NIL,p_name:name,p_type:ty,p_sections:secs});
  if(pre.error&&MISSING.test(pre.error.message))return fail(setup);
  if(pre.error&&/full administrator/i.test(pre.error.message))return fail(pre.error.message);
  /* separate client so the current admin stays signed in */
  const {data,error}=await tmpClient().auth.signUp({email,password:p,options:{data:{full_name:name}}});
  if(error)return fail(error.message);
  if(!data.user||(data.user.identities&&!data.user.identities.length))return fail("That email already has an account.");
  const r=await sb.rpc("admin_set_account",{p_user:data.user.id,p_name:name,p_type:ty,p_sections:secs});
  if(r.error)return fail("The account was created but access could not be set: "+r.error.message);
  $("#dlg").close();toast(name+" can now sign in to the admin area.");refreshUsers()
 }catch(x){fail(x.message||"Something went wrong.")}}

async function remove(f){
 const err=m=>{$("#sdErr").textContent=m||""},go=$("#sdGo");err("");
 const a=f.p1.value,b=f.p2.value,c=f.p3.value;
 if(!a||!b||!c)return err("Type your password in all three boxes.");
 if(a!==b||b!==c)return err("The three passwords are not the same.");
 go.disabled=true;go.textContent="Checking…";
 const fail=m=>{err(m);go.disabled=false;go.textContent="Delete user"};
 try{
  const {data:{session}}=await sb.auth.getSession(),em=session&&session.user.email;
  if(!em)return fail("Please sign in again.");
  const chk=await tmpClient().auth.signInWithPassword({email:em,password:a});
  if(chk.error)return fail("That is not your password.");
  const r=await sb.rpc("admin_delete_user",{p_user:f.dataset.id});
  if(r.error)return fail(MISSING.test(r.error.message)?setup:/foreign key|violates/i.test(r.error.message)?"This user still owns listings, orders or messages, so they cannot be deleted. Change them to a Customer instead.":r.error.message);
  $("#dlg").close();toast("User deleted.");refreshUsers()
 }catch(x){fail(x.message||"Something went wrong.")}}
})();