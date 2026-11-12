/* SOKO Smart admin: "+ Add new user" on User Management.
   Uses admin.html globals: sb, $, esc, toast, users(). Needs the button #addU (already in admin.html).
   The new account is created with a separate, non-persistent Supabase client so the admin stays logged in. */
(()=>{
const D=s=>document.querySelector(s);
const ROLES=["user","admin"];
let st=document.getElementById("auCss");if(!st){st=document.createElement("style");st.id="auCss";st.textContent=`
#dlg.auwide{max-width:520px}
#dc .au{display:grid;gap:12px}#dc .au label{display:grid;gap:5px;font-size:13px;font-weight:600;text-align:left}
#dc .au input,#dc .au select{width:100%;box-sizing:border-box;border:1px solid var(--bd);border-radius:8px;padding:9px 10px;font:inherit;font-weight:400}
#dc .au .two{display:grid;grid-template-columns:1fr 1fr;gap:10px}@media(max-width:520px){#dc .au .two{grid-template-columns:1fr}}
#dc .au .pw{display:flex;gap:6px}#dc .au .pw input{flex:1}
#dc .au .m{font-size:12.5px;color:var(--mut);font-weight:400}
#dc .au .fa{display:flex;gap:8px;justify-content:flex-end;flex-wrap:wrap}`;document.head.appendChild(st)}

const genPw=()=>{const c="ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789",a=new Uint32Array(12);crypto.getRandomValues(a);return [...a].map(n=>c[n%c.length]).join("")+"7a"};
const normPhone=v=>{const p=String(v||"").replace(/[\s\-().]/g,"").replace(/^\+/,"");return p?p:""};

function openForm(){const d=D("#dlg");d.classList.add("auwide");if(!d._au){d._au=1;d.addEventListener("close",()=>d.classList.remove("auwide"))}
 D("#dc").innerHTML=`<div style="display:flex;justify-content:space-between;align-items:center;margin:0 0 12px"><h3 style="margin:0;font-size:18px">Add new user</h3><button type="button" data-x aria-label="Close" style="background:none;border:0;font-size:24px;line-height:1;cursor:pointer">×</button></div>
 <form class="au" id="auf"><label>Full name *<input name="n" required maxlength="80" autocomplete="off"></label>
 <div class="two"><label>Email *<input name="e" type="email" required autocomplete="off"></label><label>Phone<input name="p" type="tel" placeholder="0712 345 678" autocomplete="off"></label></div>
 <div class="two"><label>Password * (min 8 characters)<span class="pw"><input name="w" type="text" required minlength="8" autocomplete="new-password"><button type="button" class="btn" id="aug">Generate</button></span></label><label>Role<select name="r">${ROLES.map(r=>`<option>${r}</option>`).join("")}</select></label></div>
 <p class="m" style="margin:0">Share the email and password with the person. They can change the password after logging in. If email confirmation is switched on in Supabase, they must confirm their email before the first login.</p>
 <div class="fa"><button type="button" class="btn" data-x>Cancel</button><button class="btn p" id="aus">Create user</button></div></form>`;
 D("#dc").querySelectorAll("[data-x]").forEach(b=>b.onclick=()=>d.close());
 D("#aug").onclick=()=>{D("#auf").w.value=genPw()};
 D("#auf").onsubmit=submit;if(!d.open)d.showModal();D("#auf").n.focus()}

async function submit(e){e.preventDefault();const f=e.target,btn=D("#aus"),name=f.n.value.trim(),email=f.e.value.trim().toLowerCase(),phone=normPhone(f.p.value),pw=f.w.value,role=f.r.value;
 if(phone&&!/^(254|0)[17][0-9]{8}$/.test(phone)){toast("Enter a valid Kenyan phone number, e.g. 0712 345 678","error");f.p.focus();return}
 if(pw.length<8){toast("The password must be at least 8 characters","error");return}
 btn.disabled=true;btn.textContent="Creating…";
 try{const mk=window.supabase&&window.supabase.createClient;if(!mk)throw new Error("Supabase library is not loaded");
  const tmp=mk(sb.supabaseUrl,sb.supabaseKey,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false,storageKey:"soko-admin-newuser"}});
  const r=await tmp.auth.signUp({email,password:pw,options:{data:{full_name:name,name,phone:phone||null}}});
  if(r.error)throw r.error;const u=r.data&&r.data.user;if(!u)throw new Error("The account could not be created");
  if(Array.isArray(u.identities)&&u.identities.length===0)throw new Error("An account with this email already exists");
  /* make sure the profile row has the details and the chosen role (a database trigger usually creates the row) */
  const row={full_name:name,name,email,phone:phone||null,role};let warn="";
  const save=async()=>{const list=Object.assign({},row);for(let i=0;i<6;i++){let x=await sb.from("profiles").update(list).eq("id",u.id).select("id");
    if(!x.error&&(x.data||[]).length)return null;
    if(!x.error&&!(x.data||[]).length){x=await sb.from("profiles").insert({id:u.id,...list}).select("id");if(!x.error)return null}
    const m=String(x.error&&x.error.message||"").match(/'([a-z_]+)' column|column "?([a-z_]+)"?/i),c=m&&(m[1]||m[2]);
    if(!c||!(c in list)||c==="role"&&role==="admin")return x.error;delete list[c]}return null};
  await new Promise(r=>setTimeout(r,700));const err=await save();if(err)warn=" The account exists, but the profile details could not be saved ("+err.message+").";
  D("#dlg").close();toast((warn?"User created.":"User created. They can log in now.")+warn,warn?"error":undefined);
  if(typeof users==="function")users()}
 catch(x){btn.disabled=false;btn.textContent="Create user";toast(/already|registered/i.test(x.message||"")?"An account with this email already exists":(x.message||String(x)),"error")}}

document.addEventListener("click",e=>{if(e.target.closest("#addU"))openForm()});
})();