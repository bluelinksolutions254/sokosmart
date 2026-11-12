/* SOKO Smart wallet (with order escrow: buyers pay the wallet, funds are held until the buyer releases them): bank-card account, Send / Withdraw / Deposit, recent transactions.
   Needs soko.js globals (sb, $, esc, toast, user, needLogin, openD) and supabase-wallet.sql.
   SokoWallet.mount(element,{mode:"auto"|"personal"|"shop", layout:"app"|"embed"})
   Deposit details: set window.SOKO_PAY={name:"M-Pesa Till",number:"123456",account:"SOKO Smart"} before this file loads. */
(()=>{
const PAY=Object.assign({name:"M-Pesa",number:"",account:""},window.SOKO_PAY||{});
const kes=n=>"KSh "+Number(n||0).toLocaleString("en-KE",{minimumFractionDigits:2,maximumFractionDigits:2});
const svg=(d,z=22)=>`<svg viewBox="0 0 24 24" width="${z}" height="${z}" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const G={send:'<path d="M22 2 11 13"/><path d="m22 2-7 20-4-9-9-4z"/>',dep:'<path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/>',wd:'<path d="M12 21V9"/><path d="m7 14 5-5 5 5"/><path d="M5 3h14"/>',
 eye:'<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',off:'<path d="M3 3l18 18"/><path d="M10.6 5.1A10 10 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.2 4.2M6.6 6.6A17 17 0 0 0 2 12s3.5 7 10 7a9.7 9.7 0 0 0 4-.9"/>',
 copy:'<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/>',in:'<path d="M17 7 7 17"/><path d="M17 17H7V7"/>',out:'<path d="M7 17 17 7"/><path d="M7 7h10v10"/>',
 nfc:'<path d="M8 6a8 8 0 0 1 0 12"/><path d="M12 8.5a4.5 4.5 0 0 1 0 7"/><path d="M16 11a1.5 1.5 0 0 1 0 2"/>',store:'<path d="M3 9l1.5-5h15L21 9"/><path d="M4 9v11h16V9"/><path d="M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0"/>',user:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>'};
const CSS=`
.wl-sw{display:flex;gap:10px;align-items:center;padding:2px 0 14px;flex-wrap:wrap}.wl-sw label{display:flex;gap:8px;align-items:center;font-weight:700;font-size:14px;width:100%;max-width:440px}.wl-sw select{flex:1;min-width:0;border:2px solid var(--o);border-radius:10px;padding:9px 12px;font:inherit;font-weight:700;background:var(--bg);color:var(--tx)}
.wl-hold{background:#FFF8EF;border:1px solid #F0E4D4;border-radius:12px;padding:10px 12px;margin-top:12px;font-size:13.5px;display:flex;justify-content:space-between;gap:10px;align-items:center}.wl-hold b{color:var(--od)}
.wl-es{display:flex;gap:12px;align-items:center;justify-content:space-between;padding:12px 0;border-bottom:1px solid var(--bd);flex-wrap:wrap}.wl-es:last-of-type{border-bottom:0}.wl-es .bt{display:flex;gap:6px;flex-wrap:wrap}.wl-es .btn{padding:7px 14px}
.wl-tabs{display:flex;gap:8px;overflow-x:auto;padding:2px 0 14px}.wl-tabs button{display:flex;gap:7px;align-items:center;border:1px solid var(--bd);background:var(--bg);color:var(--tx);border-radius:999px;padding:8px 16px;font-weight:700;white-space:nowrap;cursor:pointer}
.wl-tabs .on{background:var(--g);border-color:var(--g);color:#fff}
.wl-grid{display:grid;grid-template-columns:minmax(0,440px) minmax(0,1fr);gap:26px;align-items:start}.wl-embed .wl-grid{grid-template-columns:minmax(0,1fr)}
@media(max-width:900px){.wl-grid{grid-template-columns:minmax(0,1fr)}}
.bc{position:relative;overflow:hidden;border-radius:22px;padding:20px 22px;color:#fff;min-height:250px;display:grid;gap:16px;align-content:space-between;background:linear-gradient(135deg,#0B4A2E 0%,#14633F 55%,#0B4A2E 100%);box-shadow:0 18px 40px rgba(11,74,46,.32)}
.bc.shop{background:linear-gradient(135deg,#B85F08 0%,#F58E20 55%,#D9740A 100%);box-shadow:0 18px 40px rgba(217,116,10,.35)}
.bc::before,.bc::after{content:"";position:absolute;border-radius:50%;pointer-events:none}.bc::before{width:260px;height:260px;right:-90px;top:-110px;background:rgba(255,255,255,.09)}.bc::after{width:200px;height:200px;left:-70px;bottom:-110px;background:rgba(245,142,32,.28)}
.bc.shop::after{background:rgba(11,74,46,.35)}
.bc>*{position:relative;z-index:1}.bc small{display:block;font-size:11px;letter-spacing:.08em;text-transform:uppercase;opacity:.78;font-weight:600}
.bc-t{display:flex;justify-content:space-between;align-items:center;gap:10px}.bc-logo{background:#fff;border-radius:10px;padding:3px 8px;display:flex}.bc-logo img{height:26px;width:auto;display:block}
.bc-k{display:flex;gap:6px;align-items:center;font-size:12px;font-weight:700;background:rgba(255,255,255,.18);border-radius:999px;padding:5px 11px}
.bc-b b{display:block;font-size:32px;line-height:1.1;font-weight:800;margin-top:3px;word-break:break-word}
.bc-n{display:flex;align-items:center;gap:12px}.bc-chip{width:42px;height:31px;border-radius:7px;background:linear-gradient(135deg,#f3d98a,#c9a33c);flex:none;box-shadow:inset 0 0 0 1px rgba(0,0,0,.18)}
.bc-n code{font:600 18px/1.2 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;letter-spacing:.1em;white-space:nowrap}.bc-n .sp{flex:1}
.bc-i{width:32px;height:32px;border-radius:50%;border:0;background:rgba(255,255,255,.18);color:#fff;display:grid;place-items:center;cursor:pointer;padding:0;flex:none}.bc-i:hover{background:rgba(255,255,255,.3)}
.bc-f{display:flex;justify-content:space-between;gap:12px;align-items:flex-end}.bc-f b{display:block;font-size:15px;letter-spacing:.06em;text-transform:uppercase;margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:230px}
.bc-f>div:last-child{text-align:right;flex:none}
@media(max-width:420px){.bc-n code{font-size:15px}.bc-b b{font-size:27px}}
.bc.exp{filter:grayscale(.9) brightness(.85)}.wl-act.off button{opacity:.45}
.wl-warn{display:flex;gap:12px;align-items:center;justify-content:space-between;flex-wrap:wrap;background:#FFF1E0;border:1px solid #F5C98E;border-radius:12px;padding:10px 12px;margin-top:12px;font-size:13.5px}.wl-warn .btn{padding:7px 14px}
.wl-note{margin:10px 2px 0;font-size:13px;color:var(--mut)}
.wl-act{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-top:16px}
.wl-act button{display:grid;justify-items:center;gap:8px;border:1px solid var(--bd);background:var(--bg);border-radius:16px;padding:14px 6px;font-weight:700;font-size:14px;color:var(--tx);cursor:pointer}
.wl-act button span{width:46px;height:46px;border-radius:50%;display:grid;place-items:center;background:#E8F3EC;color:var(--g)}
.wl-act button[data-act=wd] span{background:#FFF1E0;color:var(--od)}.wl-act button:hover{border-color:var(--g);box-shadow:0 4px 14px rgba(0,0,0,.08)}
.wl-st{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px}.wl-st>div{border:1px solid var(--bd);background:var(--bg);border-radius:14px;padding:14px 16px}
.wl-st small{color:var(--mut);font-weight:600}.wl-st b{display:block;font-size:20px;margin-top:2px}.wl-st .i b{color:#14633F}.wl-st .o b{color:#d63a2f}
.wl-p{border:1px solid var(--bd);background:var(--bg);border-radius:16px;padding:16px 18px;margin-bottom:16px}.wl-p h3{margin:0 0 6px;font-size:18px}
.wl-tx{display:flex;gap:12px;align-items:center;padding:12px 0;border-bottom:1px solid var(--bd)}.wl-tx:last-of-type{border-bottom:0}
.wl-ti{width:42px;height:42px;border-radius:50%;display:grid;place-items:center;flex:none}.wl-ti.i{background:#DDF3E4;color:#14633F}.wl-ti.o{background:#FDE3DC;color:#d63a2f}
.wl-tm{flex:1;min-width:0}.wl-tm b{display:block;font-size:15px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.wl-tm small{color:var(--mut)}
.wl-ta{text-align:right;flex:none}.wl-ta b{display:block;font-size:15px}.wl-ta .i{color:#14633F}.wl-ta .o{color:#d63a2f}.wl-ta .x{text-decoration:line-through;color:var(--mut)}
.wl-pill{display:inline-block;font-size:11px;font-weight:700;border-radius:999px;padding:2px 8px;margin-top:3px}.wl-pill.p{background:#FFF1E0;color:var(--od)}.wl-pill.r{background:#FDE3DC;color:#b3271c}
.wl-em{padding:26px 8px;text-align:center;color:var(--mut)}
.wl-gate{max-width:520px;margin:30px auto;text-align:center;border:1px solid var(--bd);background:var(--bg);border-radius:18px;padding:30px 22px;display:grid;gap:12px;justify-items:center}.wl-gate h3{margin:0}
.wl-ad{display:flex;gap:10px;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--bd);flex-wrap:wrap}.wl-ad .bt{display:flex;gap:6px}
.wl-ad .btn{padding:6px 12px}
.wl-f{display:grid;gap:10px}.wl-f label{display:grid;gap:4px;font-weight:600;font-size:13px}.wl-f .ok{color:#14633F;font-weight:700}.wl-f .no{color:#b3271c}.wl-f .nt{background:#FFF8EF;border:1px solid #F0E4D4;border-radius:10px;padding:10px 12px;font-size:13px;color:#5b534b}
`;
let S=null;
const acc=()=>S.ACC.find(a=>a.key===S.key)||S.ACC[0];
const holder=a=>String(a.shopId?a.name:(S.ME.full_name||S.U.user_metadata?.full_name||String(S.U.email||"member").split("@")[0])).trim();
const ERR={login_required:"Please log in again.",bad_amount:"Enter a valid amount.",not_your_wallet:"That account is not yours.",recipient_not_found:"No SOKO Smart account matches that card number or phone.",self_transfer:"You cannot send money to your own account.",insufficient_funds:"Your balance is too low for this amount.",bad_reference:"Enter the M-Pesa confirmation code (at least 6 characters).",duplicate_reference:"That M-Pesa code has already been used.",bad_phone:"Enter a valid M-Pesa number, e.g. 0712 345 678.",admin_only:"Only the admin can do this.",not_pending:"That request was already handled.",card_expired:"Your card has expired. Renew it first.",not_buyer:"Only the buyer can release these funds.",not_held:"These funds are no longer held.",out_of_stock:"One of the items is out of stock.",bad_item:"One of the items can no longer be ordered.",seller_wallet_missing:"This seller has not activated their wallet yet. Chat with them first.",wallet_missing:"Open your wallet first so it can be created.",too_early:"You can renew your card in the last 30 days before it expires."};
const errTxt=e=>{const m=String(e&&e.message||e);const k=Object.keys(ERR).find(x=>m.includes(x));return k?ERR[k]:m};
const setupMissing=m=>/function|relation|schema cache|does not exist|wallet_/i.test(m)&&!/phone_required|login_required/.test(m);

function mount(host,opts){if(!host)return;if(!document.getElementById("wlcss")){const s=document.createElement("style");s.id="wlcss";s.textContent=CSS;document.head.appendChild(s)}
 S={host,opts:opts||{},U:null,ME:{},ACC:[],key:"personal",tx:[],admin:[],eo:[],show:false,more:15};host.className=(opts&&opts.layout==="embed")?"wl-embed":"";host.innerHTML='<div class="msg">Loading your wallet…</div>';
 host.onclick=onClick;host.onchange=e=>{const s=e.target.closest("[data-accsel]");if(s){S.key=s.value;S.more=15;try{localStorage.sokoWalletAcc=S.key}catch(x){}S.host.innerHTML='<div class="msg">Loading…</div>';load()}};init()}
async function init(){const host=S.host;
 if(typeof sb==="undefined"||!sb){host.innerHTML='<div class="msg">Connect Supabase (CFG in soko.js) to use the wallet.</div>';return}
 const u=await user();
 if(!u){host.innerHTML=`<div class="wl-gate"><h3>Log in to open your wallet</h3><p class="m" style="margin:0">Your SOKO Smart bank card is created for you as soon as you are logged in.</p><button class="btn p" id="wlLog">Log in or sign up</button></div>`;
  $("#wlLog").onclick=()=>needLogin("Log in or create an account to use your wallet.");return}
 S.U=u;
 try{const r=await sb.from("profiles").select("full_name,phone,role").eq("id",u.id).maybeSingle();S.ME=r.data||{}}catch(e){S.ME={}}
 let shops=[];try{const r=await sb.from("shops").select("id,name").eq("owner_id",u.id).order("created_at");shops=r.data||[]}catch(e){}
 S.ACC=[{key:"personal",shopId:null,name:"",w:null},...shops.map(s=>({key:"s:"+s.id,shopId:String(s.id),name:s.name||"My shop",w:null}))];
 let k="personal";try{const v=localStorage.sokoWalletAcc;if(S.ACC.some(a=>a.key===v))k=v}catch(e){}
 if(S.opts.mode==="shop"&&shops.length)k=S.ACC[1].key;if(S.opts.mode==="personal")k="personal";S.key=k;
 load()}
async function load(){const a=acc();
 if(!a.w){const r=await sb.rpc("wallet_ensure",{p_shop_id:a.shopId});if(r.error)return fail(r.error);a.w=r.data}
 else{const r=await sb.from("wallets").select("*").eq("id",a.w.id).maybeSingle();if(r.data)a.w=r.data}
 const t=await sb.from("wallet_tx").select("*").eq("wallet_id",a.w.id).order("created_at",{ascending:false}).limit(100);S.tx=t.data||[];
 S.eo=[];try{let q=sb.from("orders").select("*,order_items(*)").in("pay_status",["held","released","refunded"]).order("created_at",{ascending:false}).limit(30);q=a.shopId?q.eq("shop_id",a.shopId):q.or(`buyer_id.eq.${S.U.id},and(seller_id.eq.${S.U.id},shop_id.is.null)`);const eo=await q;S.eo=eo.error?[]:(eo.data||[])}catch(e){S.eo=[]}
 S.admin=[];if(S.ME.role==="admin"){try{const p=await sb.rpc("wallet_admin_pending");S.admin=p.data||[]}catch(e){}}
 render()}
function fail(e){const m=String(e.message||e),h=S.host;
 if(/phone_required/.test(m)){h.innerHTML=`<div class="wl-gate"><h3>Add your mobile number</h3><p class="m" style="margin:0">Your card number is built from your mobile number, so we need it once to create your card.</p>
  <form id="wlPh" class="wl-f" style="width:100%;max-width:320px"><label>Mobile number<input name="p" type="tel" required placeholder="0712 345 678" autocomplete="tel"></label><button class="btn p">Create my card</button></form></div>`;
  $("#wlPh").onsubmit=async ev=>{ev.preventDefault();const p=ev.target.elements.p.value.trim();if(!/^(\+?254|0)?[17][0-9]{8}$/.test(p.replace(/\s/g,""))){toast("Enter a valid Kenyan mobile number","error");return}
   let r=await sb.from("profiles").update({phone:p}).eq("id",S.U.id).select("id");if(!r.error&&!(r.data||[]).length)r=await sb.from("profiles").upsert({id:S.U.id,phone:p});
   if(r.error){toast(r.error.message,"error");return}S.ME.phone=p;load()};return}
 h.innerHTML=setupMissing(m)?'<div class="wl-gate"><h3>Wallet not set up yet</h3><p class="m" style="margin:0">Run <b>supabase-wallet.sql</b> in the Supabase SQL Editor, then refresh this page.</p></div>':`<div class="wl-gate"><h3>Something went wrong</h3><p class="m" style="margin:0">${esc(errTxt(e))}</p><button class="btn p" id="wlRe">Try again</button></div>`;
 const b=$("#wlRe");if(b)b.onclick=load}
const dt=t=>new Date(t).toLocaleString("en-KE",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"});
function txRow(t){const inn=t.kind==="receive"||t.kind==="deposit",p=t.status==="pending",r=t.status==="rejected";
 const ti=t.kind==="send"?"Sent to "+(t.counterparty||"member"):t.kind==="receive"?"Received from "+(t.counterparty||"member"):t.kind==="deposit"?"Deposit":"Withdrawal"+(t.counterparty?" to "+t.counterparty:"");
 const sub=[dt(t.created_at),t.reference&&"Ref "+t.reference,t.note].filter(Boolean).join(" · ");
 return `<div class="wl-tx"><span class="wl-ti ${inn?"i":"o"}">${svg(inn?G.in:G.out,20)}</span><div class="wl-tm"><b>${esc(ti)}</b><small>${esc(sub)}</small></div><div class="wl-ta"><b class="${r?"x":inn?"i":"o"}">${inn?"+":"−"}${kes(t.amount)}</b>${p?'<span class="wl-pill p">Pending approval</span>':r?'<span class="wl-pill r">Declined</span>':""}</div></div>`}
function render(){const a=acc(),w=a.w,shop=!!a.shopId,num=String(w.card_number),grp=num.replace(/(\d{4})(?=\d)/g,"$1 "),mask=num.slice(0,4)+" •••• •••• "+num.slice(12);
 const ex=new Date(w.expires_at||new Date(new Date(w.created_at).setFullYear(new Date(w.created_at).getFullYear()+2))),exp=String(ex.getMonth()+1).padStart(2,"0")+"/"+String(ex.getFullYear()).slice(2),days=Math.ceil((ex-Date.now())/864e5),expired=days<=0,soon=!expired&&days<=30;
 const now=new Date(),mo=S.tx.filter(t=>{const d=new Date(t.created_at);return d.getMonth()===now.getMonth()&&d.getFullYear()===now.getFullYear()});
 const mi=mo.filter(t=>(t.kind==="receive"||t.kind==="deposit")&&t.status==="completed").reduce((s,t)=>s+ +t.amount,0),mout=mo.filter(t=>(t.kind==="send"||t.kind==="withdraw")&&t.status!=="rejected").reduce((s,t)=>s+ +t.amount,0);
 const pend=S.tx.filter(t=>t.status==="pending").length;
 const tabs=S.ACC.length>1?`<div class="wl-sw"><label>Account<select data-accsel aria-label="Choose wallet account">${S.ACC.map(x=>`<option value="${esc(x.key)}" ${x.key===S.key?"selected":""}>${x.shopId?"Shop: "+esc(x.name):"Personal"}</option>`).join("")}</select></label></div>`:"";
 const held=S.eo.filter(o=>o.pay_status==="held"),heldSum=held.reduce((s,o)=>s+ +(o.escrow_amount||o.total),0);
 const esRow=o=>{const it=(o.order_items||[]).map(i=>i.title+" × "+i.qty).join(", "),id="#"+String(o.id).slice(0,6),h=o.pay_status==="held",st=h?"Held in escrow":o.pay_status==="released"?"Released":"Refunded";
  return `<div class="wl-es"><div style="min-width:0;flex:1"><b>Order ${esc(id)} · ${kes(o.escrow_amount||o.total)}</b><div class="m">${esc(it||"Order")} · ${esc(dt(o.created_at))}</div><span class="wl-pill ${h?"p":o.pay_status==="refunded"?"r":""}">${st}</span></div>${h&&o.buyer_id===S.U.id?`<div class="bt"><button class="btn p" data-rel="${esc(o.id)}">Release funds</button><a class="btn" href="complaint.html?type=order&ref=${encodeURIComponent("Order "+id)}">Report a problem</a></div>`:""}</div>`};
 const esc2=S.eo.length?`<div class="wl-p"><h3>${shop?"Orders paid to SOKO Smart":"Orders in escrow"}</h3><p class="m" style="margin:0 0 4px">${shop?"Buyers pay into the SOKO Smart Wallet. The money reaches your shop wallet when the buyer releases it.":"Orders you paid for show a Release button: release only after you receive your order. Orders customers paid to you reach this wallet when they release."}</p>${S.eo.slice(0,10).map(esRow).join("")}</div>`:"";
 const adm=S.admin.length?`<div class="wl-p"><h3>Pending requests <small class="m">(admin)</small></h3>${S.admin.map(x=>`<div class="wl-ad"><div><b>${x.tx_kind==="deposit"?"Deposit":"Withdrawal"} ${kes(x.tx_amount)}</b><div class="m">${esc(x.holder)} · ${esc(x.tx_kind==="deposit"?"M-Pesa code "+x.tx_ref:"Send to "+x.tx_party)} · ${esc(dt(x.tx_at))}</div></div><div class="bt"><button class="btn p" data-ad="${esc(x.tx_id)}" data-ok="1">Approve</button><button class="btn" data-ad="${esc(x.tx_id)}" data-ok="0">Decline</button></div></div>`).join("")}</div>`:"";
 S.host.innerHTML=`${tabs}<div class="wl-grid"><div>
 <div class="bc ${shop?"shop":""} ${expired?"exp":""}" id="wlCard"><div class="bc-t"><span class="bc-logo"><img src="logo.png" alt="SOKO Smart"></span><span class="bc-k">${svg(shop?G.store:G.user,14)} ${shop?"Shop account":"Personal account"}</span></div>
  <div class="bc-b"><small>Available balance</small><b id="wlBal">${kes(w.balance)}</b></div>
  <div class="bc-n"><span class="bc-chip"></span>${svg(G.nfc,22)}<code id="wlNum">${S.show?grp:mask}</code><span class="sp"></span><button class="bc-i" data-eye aria-label="${S.show?"Hide":"Show"} card number" title="${S.show?"Hide":"Show"} card number">${svg(S.show?G.off:G.eye,17)}</button><button class="bc-i" data-cp aria-label="Copy card number" title="Copy card number">${svg(G.copy,16)}</button></div>
  <div class="bc-f"><div><small>${shop?"Shop name":"Card holder"}</small><b>${esc(holder(a))}</b></div><div><small>${expired?"Expired":"Valid thru"}</small><b>${exp}</b></div></div></div>
 ${expired||soon?`<div class="wl-warn"><span>${expired?`This card expired on ${esc(ex.toLocaleDateString("en-KE",{day:"numeric",month:"short",year:"numeric"}))}. Renew it to send, withdraw or deposit. You can still receive money.`:`This card expires in ${days} day${days>1?"s":""}. You can renew it now.`}</span><button class="btn p" data-renew>Renew card · 2 years</button></div>`:""}
 ${held.length?`<div class="wl-hold"><span>${shop?"On hold until buyers release":"Held in escrow for your orders"} (${held.length})</span><b>${kes(heldSum)}</b></div>`:""}
 ${pend?`<p class="wl-note">${pend} request${pend>1?"s":""} waiting for approval by the SOKO Smart team.</p>`:""}
 <div class="wl-act ${expired?"off":""}"><button data-act="send"><span>${svg(G.send)}</span>Send</button><button data-act="wd"><span>${svg(G.wd)}</span>Withdraw</button><button data-act="dep"><span>${svg(G.dep)}</span>Deposit</button></div></div>
 <div><div class="wl-st"><div class="i"><small>Money in · this month</small><b>${kes(mi)}</b></div><div class="o"><small>Money out · this month</small><b>${kes(mout)}</b></div></div>
 ${adm}${esc2}<div class="wl-p"><h3>Recent transactions</h3>${S.tx.length?S.tx.slice(0,S.more).map(txRow).join("")+(S.tx.length>S.more?'<p style="text-align:center;margin:10px 0 0"><button class="btn" data-more>Show more</button></p>':""):'<div class="wl-em">No transactions yet. Deposit money or receive a transfer to get started.</div>'}</div></div></div>`}
function onClick(e){const t=e.target,b=t.closest("[data-acc]");
 if(b){S.key=b.dataset.acc;S.more=15;try{localStorage.sokoWalletAcc=S.key}catch(x){}S.host.innerHTML='<div class="msg">Loading…</div>';load();return}
 if(t.closest("[data-eye]")){S.show=!S.show;render();return}
 if(t.closest("[data-cp]")){const n=acc().w.card_number;(navigator.clipboard?navigator.clipboard.writeText(n):Promise.reject()).then(()=>toast("Card number copied"),()=>toast("Could not copy"));return}
 if(t.closest("[data-more]")){S.more+=15;render();return}
 if(t.closest("[data-renew]")){renew(t.closest("[data-renew]"));return}
 const ab=t.closest("[data-act]");if(ab){if(new Date(acc().w.expires_at||0)<=Date.now()){toast("Your card has expired. Renew it first.","error");return}({send:sendDlg,wd:wdDlg,dep:depDlg})[ab.dataset.act]();return}
 const rl=t.closest("[data-rel]");if(rl){release(rl.dataset.rel,rl);return}
 const ad=t.closest("[data-ad]");if(ad)resolve(ad.dataset.ad,ad.dataset.ok==="1",ad)}
async function release(id,btn){if(!await askConfirm({title:"Release the funds?",msg:"Only release when you have received your order. The money goes to the seller and cannot be taken back.",ok:"Yes, release funds",cancel:"Not yet"}))return;btn.disabled=true;
 const r=await sb.rpc("escrow_release",{p_order:id});if(r.error){toast(errTxt(r.error),"error");btn.disabled=false;return}toast("Funds released to the seller");load()}
async function renew(btn){btn.disabled=true;const r=await sb.rpc("wallet_renew",{p_wallet:acc().w.id});if(r.error){toast(errTxt(r.error),"error");btn.disabled=false;return}toast("Card renewed for 2 more years");load()}
async function resolve(id,ok,btn){btn.disabled=true;const r=await sb.rpc("wallet_admin_resolve",{p_tx:id,p_approve:ok});if(r.error){toast(errTxt(r.error),"error");btn.disabled=false;return}toast(ok?"Approved":"Declined");load()}
const done=m=>{$("#dlg").close();toast(m);load()};
function sendDlg(){const a=acc();
 openD(`<h3 style="margin:0 0 4px">Send money</h3><p class="m" style="margin:0 0 10px">From ${esc(holder(a))} · Balance ${kes(a.w.balance)}</p>
 <form id="wsf" class="wl-f"><label>Recipient card number or phone<input name="to" required autocomplete="off" inputmode="numeric" placeholder="16-digit card number or 0712 345 678"></label><div id="wsw" class="m" aria-live="polite"></div>
 <label>Amount (KSh)<input name="amt" type="number" min="1" step="0.01" required></label><label>Note (optional)<input name="note" maxlength="80"></label><button class="btn p">Send money</button></form>`);
 const f=$("#wsf");let tm,seq=0;
 f.elements.to.addEventListener("input",()=>{clearTimeout(tm);const el=$("#wsw"),dg=f.elements.to.value.replace(/\D/g,"");el.textContent="";if(dg.length<9)return;
  tm=setTimeout(async()=>{const my=++seq,r=await sb.rpc("wallet_lookup",{p_to:f.elements.to.value});if(my!==seq)return;const x=(r.data||[])[0];
   el.innerHTML=x?`<span class="ok">✓ ${esc(x.w_name)} <small>(${x.w_kind==="shop"?"Shop":"Personal"})</small></span>`:'<span class="no">No account found for that number</span>'},350)});
 f.onsubmit=async ev=>{ev.preventDefault();const btn=f.querySelector("button"),amt=+f.elements.amt.value;if(!(amt>0)){toast("Enter an amount","error");return}btn.disabled=true;
  const r=await sb.rpc("wallet_send",{p_from:a.w.id,p_to:f.elements.to.value,p_amount:amt,p_note:f.elements.note.value.trim()||null});btn.disabled=false;
  if(r.error){toast(errTxt(r.error),"error");return}done("Sent "+kes(amt))}}
function wdDlg(){const a=acc();
 openD(`<h3 style="margin:0 0 4px">Withdraw to M-Pesa</h3><p class="m" style="margin:0 0 10px">Available: ${kes(a.w.balance)}</p>
 <form id="wwf" class="wl-f"><label>Amount (KSh)<input name="amt" type="number" min="10" step="0.01" max="${+a.w.balance}" required></label><label>M-Pesa number<input name="ph" type="tel" required value="${esc(S.ME.phone||"")}" placeholder="0712 345 678"></label>
 <div class="nt">The amount is held right away. The SOKO Smart team sends it to your M-Pesa and approves the request. If it is declined, the money returns to your balance.</div><button class="btn p">Request withdrawal</button></form>`);
 const f=$("#wwf");f.onsubmit=async ev=>{ev.preventDefault();const btn=f.querySelector("button");btn.disabled=true;
  const r=await sb.rpc("wallet_withdraw_request",{p_wallet:a.w.id,p_amount:+f.elements.amt.value,p_phone:f.elements.ph.value});btn.disabled=false;
  if(r.error){toast(errTxt(r.error),"error");return}done("Withdrawal requested")}}
function depDlg(){const a=acc();
 const how=PAY.number?`Send the money by <b>${esc(PAY.name)}</b> to <b>${esc(PAY.number)}</b>${PAY.account?` (account: <b>${esc(PAY.account)}</b>)`:""}, then enter the amount and the M-Pesa confirmation code below.`:`Pay by M-Pesa using the deposit details from the SOKO Smart team, then enter the amount and the M-Pesa confirmation code below.`;
 openD(`<h3 style="margin:0 0 4px">Deposit money</h3><p class="m" style="margin:0 0 10px">Into ${esc(holder(a))}</p>
 <form id="wdf" class="wl-f"><div class="nt">${how}</div><label>Amount you paid (KSh)<input name="amt" type="number" min="10" step="0.01" required></label>
 <label>M-Pesa confirmation code<input name="ref" required maxlength="20" autocomplete="off" placeholder="e.g. SJK4X8Q2LM" style="text-transform:uppercase"></label>
 <div class="nt">Your balance is credited once the team confirms the payment. Instant M-Pesa payment prompts (STK push) are coming soon.</div><button class="btn p">Submit deposit</button></form>`);
 const f=$("#wdf");f.onsubmit=async ev=>{ev.preventDefault();const btn=f.querySelector("button");btn.disabled=true;
  const r=await sb.rpc("wallet_deposit_request",{p_wallet:a.w.id,p_amount:+f.elements.amt.value,p_ref:f.elements.ref.value});btn.disabled=false;
  if(r.error){toast(errTxt(r.error),"error");return}done("Deposit submitted for approval")}}
document.addEventListener("visibilitychange",()=>{if(!document.hidden&&S&&S.U&&document.body.contains(S.host)&&S.ACC.length&&acc().w&&!($("#dlg")&&$("#dlg").open))load()});
window.SokoWallet={mount};
})();