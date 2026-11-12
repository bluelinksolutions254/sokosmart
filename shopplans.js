/* SOKO Smart website: "choose a plan and pay with M-Pesa" gate for opening a shop.
   Usage (openshop page, before showing the shop form or submitting it):
     if(!await ShopPlans.gate(sb,{onLogin:()=>showLogin()})) return;   // true = has an active plan (already, or just paid)
   Pass your page's Supabase client as the first argument. */
(()=>{
const KEY="shop_plans";
const DEF=[{id:"basic",name:"Basic",price:1500,yearly:15000,features:["Open a shop on Soko Smart"]},{id:"premium",name:"Premium",price:2200,yearly:22000,features:["Everything in Basic"]},{id:"golden",name:"Golden",price:5000,yearly:50000,features:["Everything in Premium"]}];
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const money=n=>"KSh "+Number(n||0).toLocaleString("en-KE");
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const phone=v=>{let d=String(v||"").replace(/[^\d]/g,"");if(/^0[17]\d{8}$/.test(d))d="254"+d.slice(1);else if(/^[17]\d{8}$/.test(d))d="254"+d;return /^254[17]\d{8}$/.test(d)?d:""};

async function plans(sb){let a=null;try{const r=await sb.from("site_content").select("value").eq("key",KEY).maybeSingle();a=r.data&&r.data.value&&r.data.value.plans}catch(e){}
 return DEF.map(d=>{const s=(Array.isArray(a)&&a.find(x=>x&&x.id===d.id))||{},pr=Math.round(+s.price),yr=Math.round(+s.yearly);
  return {id:d.id,name:s.name||d.name,price:pr>0?pr:d.price,yearly:yr>0?yr:d.yearly,active:s.active!==false,features:Array.isArray(s.features)&&s.features.length?s.features:d.features}}).filter(p=>p.active)}

async function hasPlan(sb,uid){try{const r=await sb.from("shop_subscriptions").select("id,expires_at").eq("user_id",uid).eq("status","paid").order("paid_at",{ascending:false}).limit(5);
 return (r.data||[]).some(s=>!s.expires_at||new Date(s.expires_at)>new Date())}catch(e){return false}}

async function poll(sb,id){for(let i=0;i<30;i++){await sleep(3000);const r=await sb.from("shop_subscriptions").select("status,result_desc").eq("id",id).maybeSingle();if(r.data&&r.data.status!=="pending")return r.data}return null}

function css(){if(document.getElementById("spmcss"))return;document.head.insertAdjacentHTML("beforeend",`<style id="spmcss">
.spm{position:fixed;inset:0;z-index:99999;background:rgba(15,23,20,.55);display:grid;place-items:center;padding:16px;font-family:Inter,system-ui,sans-serif}
.spm-b{background:#fff;border-radius:20px;width:min(720px,100%);max-height:92vh;overflow:auto;padding:24px;box-shadow:0 20px 60px rgba(0,0,0,.3);color:#17201b}
.spm-b h2{margin:0 0 4px;font:700 22px Poppins,Inter,sans-serif}.spm-b p{margin:0 0 16px;color:#667068}
.spm-t{display:inline-flex;background:#f3f4f1;border-radius:999px;padding:4px;margin-bottom:14px}.spm-t label{margin:0;display:block}.spm-t input{position:absolute;opacity:0}.spm-t span{display:block;padding:7px 18px;border-radius:999px;font:600 14px Inter,sans-serif;color:#667068;cursor:pointer}.spm-t input:checked+span{background:#16A34A;color:#fff}.spm-t input:focus-visible+span{outline:3px solid #86efac}
.spm-g{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;margin-bottom:16px}
.spm-c{border:2px solid #e7e9e4;border-radius:16px;padding:14px;cursor:pointer;display:grid;gap:6px;align-content:start;position:relative}
.spm-c:has(input:checked){border-color:#16A34A;background:#f0fdf4}.spm-c input{position:absolute;opacity:0}.spm-c:focus-within{outline:3px solid #86efac}
.spm-c b{font-size:16px}.spm-c .pr{font:700 22px Poppins,Inter,sans-serif;color:#16A34A}.spm-c ul{margin:0;padding-left:18px;font-size:13px;color:#667068}
.spm-b label{display:grid;gap:4px;font-size:13px;color:#667068;margin-bottom:14px}.spm-b input[type=tel]{border:1px solid #d6dad3;border-radius:12px;padding:11px 12px;font:inherit;width:100%;box-sizing:border-box}
.spm-r{display:flex;gap:10px;justify-content:flex-end;flex-wrap:wrap}.spm-r button{border-radius:12px;padding:11px 18px;font:600 15px Inter,sans-serif;border:1.5px solid #16A34A;background:#fff;color:#16A34A;cursor:pointer}
.spm-r button.p{background:#16A34A;color:#fff}.spm-r button:disabled{opacity:.5;cursor:default}.spm-s{min-height:22px;margin:0 0 12px;font-size:14px}.spm-s.e{color:#d3261e}.spm-s.o{color:#15803d;font-weight:600}
</style>`)}

async function gate(sb,o){o=o||{};css();
 const s=(await sb.auth.getSession()).data.session,u=s&&s.user;
 if(!u){if(o.onLogin)o.onLogin();else alert("Please log in or create an account first.");return false}
 if(await hasPlan(sb,u.id))return true;
 const list=await plans(sb);if(!list.length){alert("Shop plans are not available right now. Please try again later.");return false}
 return new Promise(done=>{
  const el=document.createElement("div");el.className="spm";el.setAttribute("role","dialog");el.setAttribute("aria-modal","true");
  el.innerHTML=`<div class="spm-b"><h2>Choose a plan to open your shop</h2><p>Pay with M-Pesa and your shop can go live. Plans renew every month, or pay yearly.</p>
   <div class="spm-t" role="radiogroup" aria-label="Billing period"><label><input type="radio" name="spmper" value="monthly" checked><span>Monthly</span></label><label><input type="radio" name="spmper" value="yearly"><span>Yearly</span></label></div>
   <div class="spm-g">${list.map((p,i)=>`<label class="spm-c"><input type="radio" name="spmp" value="${esc(p.id)}" ${i===0?"checked":""}><b>${esc(p.name)}</b><span class="pr" data-m="${p.price}" data-y="${p.yearly}">${esc(money(p.price))}<small style="font:500 13px Inter,sans-serif;color:#667068"> / month</small></span><ul>${p.features.map(f=>`<li>${esc(f)}</li>`).join("")}</ul></label>`).join("")}</div>
   <label>M-Pesa phone number<input type="tel" id="spmph" inputmode="tel" placeholder="0712 345 678" autocomplete="tel"></label>
   <div class="spm-s" id="spms" aria-live="polite"></div>
   <div class="spm-r"><button type="button" id="spmx">Cancel</button><button type="button" class="p" id="spmgo">Pay with M-Pesa</button></div></div>`;
  document.body.appendChild(el);
  const per=()=>(el.querySelector("input[name=spmper]:checked")||{}).value||"monthly";
  el.querySelectorAll("input[name=spmper]").forEach(i=>i.onchange=()=>{const y=per()==="yearly";el.querySelectorAll(".pr").forEach(n=>{n.innerHTML=esc(money(y?n.dataset.y:n.dataset.m))+`<small style="font:500 13px Inter,sans-serif;color:#667068"> / ${y?"year":"month"}</small>`})});
  const st=(t,c)=>{const n=el.querySelector("#spms");n.textContent=t;n.className="spm-s "+(c||"")},go=el.querySelector("#spmgo"),end=v=>{el.remove();done(v)};
  el.querySelector("#spmx").onclick=()=>end(false);
  go.onclick=async()=>{const ph=phone(el.querySelector("#spmph").value),pid=(el.querySelector("input[name=spmp]:checked")||{}).value;
   if(!ph){st("Enter a valid Safaricom number, e.g. 0712 345 678.","e");return}
   go.disabled=true;st("Sending the payment request to your phone…");
   try{const r=await sb.functions.invoke("mpesa-stk",{body:{plan_id:pid,phone:ph,period:per()}});
    let d=r.data;if(r.error){try{d=await r.error.context.json()}catch(x){}}
    if(!d||!d.subscription_id)throw new Error((d&&d.error)||"We couldn’t start the payment. Please try again.");
    st("Check your phone and enter your M-Pesa PIN to approve the payment.");
    const res=await poll(sb,d.subscription_id);
    if(res&&res.status==="paid"){st("Payment received. Thank you!","o");setTimeout(()=>end(true),1200);return}
    if(res){st(res.status==="cancelled"?"The payment was cancelled on your phone.":(res.result_desc||"The payment did not go through."),"e")}
    else st("We haven’t received confirmation yet. If M-Pesa charged you, your plan will activate on its own within a few minutes; otherwise try again.","e");
    go.disabled=false;go.textContent="Try again"}
   catch(e){st(e.message||"Something went wrong.","e");go.disabled=false}};
 })}
window.ShopPlans={gate,plans,hasPlan};
})();