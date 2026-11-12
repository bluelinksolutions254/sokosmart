/* SOKO Smart admin: Settings > Security. Choose how long a person can be inactive before they are signed out.
   Stored in site_content under the key "security": {adminIdleMinutes, customerIdleMinutes}. 0 = never. */
(()=>{
const OPTS=[[0,"Never"],[5,"5 minutes"],[10,"10 minutes"],[15,"15 minutes"],[30,"30 minutes"],[60,"1 hour"],[120,"2 hours"],[240,"4 hours"],[480,"8 hours"],[1440,"24 hours"]];
const lab=m=>(OPTS.find(o=>o[0]===m)||[0,m+" minutes"])[1];
let CFG_SEC={adminIdleMinutes:0,customerIdleMinutes:0};
const norm=v=>({adminIdleMinutes:Math.max(0,+(v&&v.adminIdleMinutes)||0),customerIdleMinutes:Math.max(0,+(v&&v.customerIdleMinutes)||0)});
let LOADERR="";
const help=m=>/relation|does not exist|schema cache|row-level security|permission|policy/i.test(m||"")?"The database is not ready for this yet. Run supabase-security.sql in the Supabase SQL editor, then reload. ("+m+")":m;
async function load(){LOADERR="";try{const r=await sb.from("site_content").select("value").eq("key","security").maybeSingle();if(r.error)LOADERR=help(r.error.message);else CFG_SEC=norm(r.data&&r.data.value)}catch(e){LOADERR=e.message||"Could not load."}return CFG_SEC}

/* ---------- the Settings page ---------- */
function draw(){
 const sel=(id,v)=>`<select id="${id}" style="max-width:260px">${OPTS.map(o=>`<option value="${o[0]}" ${o[0]===v?"selected":""}>${o[1]}</option>`).join("")}</select>`;
 $("#vset").innerHTML=`<div class="ph"><h1>Security</h1><p>Choose how long someone can be inactive before they are signed out automatically.</p></div>
 ${pan("Admin area (admins and staff)",`<label style="display:grid;gap:6px;font-weight:600">Sign out after being inactive for${sel("secA",CFG_SEC.adminIdleMinutes)}</label><p class="m" style="margin:10px 0 0">A warning shows one minute before they are signed out.</p>`,"users")}
 ${pan("Website (customers)",`<label style="display:grid;gap:6px;font-weight:600">Sign out after being inactive for${sel("secC",CFG_SEC.customerIdleMinutes)}</label><p class="m" style="margin:10px 0 0">Applies to customers signed in on the shop website, including when they come back after closing the page.</p>`,"user")}
 <div style="display:flex;gap:10px;align-items:center;margin-top:6px"><button class="btn p" id="secSave" type="button">Save</button><span class="m" id="secMsg" style="color:${LOADERR?"var(--r)":"inherit"}">${esc(LOADERR)}</span></div>`}
document.addEventListener("click",async e=>{const b=e.target.closest("#secSave");if(!b)return;
 const msg=$("#secMsg"),v={adminIdleMinutes:+$("#secA").value,customerIdleMinutes:+$("#secC").value};b.disabled=true;msg.textContent="Saving…";
 const {error}=await sb.from("site_content").upsert({key:"security",value:v,updated_at:new Date().toISOString()},{onConflict:"key"});b.disabled=false;
 if(error){msg.style.color="var(--r)";msg.textContent="Could not save: "+help(error.message);return}msg.style.color="inherit";
 CFG_SEC=norm(v);lastAct=Date.now();warned=false;msg.textContent="Saved. Admin area: "+lab(CFG_SEC.adminIdleMinutes).toLowerCase()+" · Website: "+lab(CFG_SEC.customerIdleMinutes).toLowerCase()+".";toast("Security settings saved.")});

window.securityAdmin=()=>{load().then(draw)};

/* ---------- sign out the admin area when idle ---------- */
let lastAct=Date.now(),warned=false,loaded=false,wasOn=false;
["mousemove","mousedown","keydown","scroll","touchstart","click"].forEach(ev=>addEventListener(ev,()=>{lastAct=Date.now();warned=false},{passive:true}));
setInterval(async()=>{
 const app=document.getElementById("app"),on=!!app&&!app.hidden;
 if(!on){wasOn=false;loaded=false;return}
 if(!wasOn){wasOn=true;lastAct=Date.now();warned=false}
 if(!loaded){loaded=true;await load();return}
 const m=CFG_SEC.adminIdleMinutes;if(!m)return;
 const idle=Date.now()-lastAct,limit=m*60000;
 if(idle>=limit){loaded=false;wasOn=false;try{await sb.auth.signOut({scope:"local"})}catch(e){}
  app.hidden=true;if(typeof showLogin==="function")showLogin("You were signed out after "+lab(m).toLowerCase()+" of inactivity.");else location.reload()}
 else if(limit-idle<=60000&&!warned){warned=true;toast("You will be signed out in a minute because of inactivity.")}
},5000);
})();