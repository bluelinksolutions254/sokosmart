/* SOKO Smart admin: Wallet Management (deposits, withdrawals, escrow orders, wallets, card renewals, all transactions).
   Needs admin.html globals: sb, $, esc, toast, ic, fmt, askConfirm, badges, I. Needs supabase-escrow.sql and supabase-wallet-admin.sql. */
(()=>{
if(typeof I==="object"&&!I.wallet)I.wallet='<path d="M3 7a2 2 0 0 1 2-2h13v4"/><path d="M3 7v11a2 2 0 0 0 2 2h15V9H5a2 2 0 0 1-2-2z"/><circle cx="16.5" cy="14.5" r="1"/>';
const css=`<style>
.wa .tabs button i{font-style:normal;background:var(--r);color:#fff;border-radius:10px;font-size:11px;padding:0 6px;margin-left:6px}
.wa .wrap table{min-width:760px}.wa .bt{display:flex;gap:6px;flex-wrap:wrap}
.wa .pill.rv{background:#e8f0fb;color:#1d4f91}.wa .pill.pz{background:#eee;color:#555}.wa .in{color:#14633F;font-weight:700}.wa .out{color:#d63a2f;font-weight:700}
.wa code{font-family:ui-monospace,Menlo,Consolas,monospace;font-size:13px}
</style>`;
const kes=n=>"KSh "+Number(n||0).toLocaleString("en-KE",{minimumFractionDigits:2,maximumFractionDigits:2});
const dt=t=>t?new Date(t).toLocaleString("en-KE",{day:"numeric",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"}):"";
const d0=t=>t?new Date(t).toLocaleDateString("en-KE",{day:"numeric",month:"short",year:"numeric"}):"";
const grp=n=>String(n||"").replace(/(\d{4})(?=\d)/g,"$1 ");
const ERR={admin_only:"Only the admin can do this.",not_pending:"That request was already handled.",not_held:"These funds are no longer held.",seller_wallet_missing:"The seller has not activated their wallet yet.",wallet_missing:"The buyer's wallet could not be found.",insufficient_funds:"That wallet has too little balance for this."};
const err=e=>{const m=String(e&&e.message||e),k=Object.keys(ERR).find(x=>m.includes(x));
 return k?ERR[k]:/function|schema cache|does not exist|relation/i.test(m)?"Wallet Management is not set up yet. Run supabase-escrow.sql and supabase-wallet-admin.sql in Supabase. ("+m+")":m};
let D={pend:[],esc:[],wal:[],tx:[],ev:[],fl:[],shops:{}},T="req",Q="",ERRS=[];
const empty=(c,m)=>`<tr><td colspan="${c}" class="empty">${m}</td></tr>`;

async function load(){
 const [p,o,w,t,e,s,f]=await Promise.all([
  sb.rpc("wallet_admin_pending"),
  sb.from("orders").select("*,order_items(*)").in("pay_status",["held","released","refunded"]).order("created_at",{ascending:false}).limit(300),
  sb.rpc("wallet_admin_wallets"),sb.rpc("wallet_admin_tx",{p_limit:300}),sb.rpc("wallet_admin_events",{p_limit:150}),
  sb.from("shops").select("id,name").limit(1000),sb.from("freelance_orders").select("*").order("created_at",{ascending:false}).limit(200)]);
 ERRS=[p,o,w,t,e].filter(x=>x.error).map(x=>err(x.error));
 D.pend=p.data||[];D.esc=o.data||[];D.wal=w.data||[];D.tx=t.data||[];D.ev=e.data||[];D.fl=f&&!f.error?f.data||[]:[];
 D.shops={};(s.data||[]).forEach(x=>D.shops[String(x.id)]=x.name);
 PEND.wallets=D.pend.length+D.esc.filter(x=>x.pay_status==="held").length+D.fl.filter(x=>x.status==="disputed").length;try{buildNav()}catch(x){}}

function stats(){const bal=D.wal.reduce((a,w)=>a+ +w.balance,0),held=D.esc.filter(o=>o.pay_status==="held"),hs=held.reduce((a,o)=>a+ +(o.escrow_amount||o.total),0),
 exp=D.wal.filter(w=>w.expires_at&&new Date(w.expires_at)<=Date.now()).length;
 return [["Wallets",D.wal.length],["Total in wallets",kes(bal)],["Pending requests",D.pend.length],["Held in escrow",kes(hs)+" ("+held.length+")"],["Expired cards",exp]].map(x=>`<div class="st"><b>${x[1]}</b><span>${x[0]}</span></div>`).join("")}

function shopName(o){return o.shop_id?(D.shops[String(o.shop_id)]||"Shop"):"Soko Smart (admin)"}
const match=(arr)=>!Q||arr.join(" ").toLowerCase().includes(Q);

function tab(){
 const held=D.esc.filter(o=>o.pay_status==="held").length,soon=D.wal.filter(w=>w.expires_at&&new Date(w.expires_at)-Date.now()<30*864e5).length;
 const tabs=[["req","Deposits & Withdrawals",D.pend.length],["esc","Escrow Orders",held],["wal","Wallets",0],["fl","Freelance",D.fl.filter(x=>x.status==="disputed").length],["ren","Card Renewals",soon],["tx","All Transactions",0]];
 $("#wa-tabs").innerHTML=tabs.map(([k,l,n])=>`<button data-wt="${k}" class="${k===T?"on":""}">${l}${n?`<i>${n}</i>`:""}</button>`).join("");
 $("#wa-st").innerHTML=stats();
 const b=$("#wa-body");
 if(T==="req"){const r=D.pend.filter(x=>match([x.holder,x.tx_kind,x.tx_ref,x.tx_party]));
  b.innerHTML=`<p class="m" style="margin:0 0 8px">Approve a deposit once the M-Pesa payment has arrived: the wallet is credited. For a withdrawal, send the money by M-Pesa first, then approve. Declining a withdrawal returns the money to the wallet.</p><div class="wrap"><table><thead><tr><th>Type</th><th>Wallet holder</th><th>Amount</th><th>Details</th><th>Requested</th><th>Action</th></tr></thead><tbody>${r.map(x=>{const dep=x.tx_kind==="deposit";return `<tr><td><span class="pill ${dep?"approved":"rv"}">${dep?"Deposit":"Withdrawal"}</span></td><td><b>${esc(x.holder)}</b></td><td><b>${kes(x.tx_amount)}</b></td><td class="m">${esc(dep?"M-Pesa code "+x.tx_ref:"Send to "+x.tx_party)}</td><td class="m">${esc(dt(x.tx_at))}</td><td><div class="bt"><button class="btn s p" data-rq="${esc(x.tx_id)}" data-ok="1" data-k="${esc(x.tx_kind)}" data-amt="${esc(x.tx_amount)}" data-h="${esc(x.holder)}">Approve</button><button class="btn s" data-rq="${esc(x.tx_id)}" data-ok="0" data-k="${esc(x.tx_kind)}" data-amt="${esc(x.tx_amount)}" data-h="${esc(x.holder)}">Decline</button></div></td></tr>`}).join("")||empty(6,"No pending deposits or withdrawals.")}</tbody></table></div>`}
 else if(T==="esc"){const r=D.esc.filter(o=>match([o.buyer_name,o.buyer_phone,shopName(o),String(o.id).slice(0,8),o.pay_status]));
  const ST={held:["Held in escrow","pz"],released:["Released to seller","approved"],refunded:["Refunded to buyer","rejected"]};
  b.innerHTML=`<p class="m" style="margin:0 0 8px">Money customers paid for orders. Normally the buyer releases it. <b>Release to seller</b> pays the seller's wallet; <b>Refund buyer</b> returns it to the wallet the buyer paid with and puts the items back in stock.</p><div class="wrap"><table><thead><tr><th>Order</th><th>Buyer</th><th>Seller</th><th>Items</th><th>Amount</th><th>Status</th><th>Action</th></tr></thead><tbody>${r.map(o=>{const s=ST[o.pay_status];return `<tr><td>#${esc(String(o.id).slice(0,8))}<div class="m">${esc(d0(o.created_at))}</div></td><td><b>${esc(o.buyer_name||"Customer")}</b><div class="m">${esc(o.buyer_phone||"")}</div></td><td>${esc(shopName(o))}</td><td class="m">${(o.order_items||[]).map(i=>esc(i.title)+" × "+i.qty).join("<br>")||"—"}</td><td><b>${kes(o.escrow_amount||o.total)}</b></td><td><span class="pill ${s[1]}">${s[0]}</span><div class="m">Order: ${esc(o.status)}</div></td><td>${o.pay_status==="held"?`<div class="bt"><button class="btn s p" data-eo="${esc(o.id)}" data-a="release">Release to seller</button><button class="btn s d" data-eo="${esc(o.id)}" data-a="refund">Refund buyer</button></div>`:`<span class="m">${esc(d0(o.released_at||o.refunded_at))}</span>`}</td></tr>`}).join("")||empty(7,"No orders paid through the wallet yet.")}</tbody></table></div>`}
 else if(T==="fl"){const r=D.fl.filter(c=>match([c.service_title,c.client_name,c.freelancer_name,c.status,String(c.id).slice(0,8)]));
  const ST={pending_acceptance:["Waiting for freelancer","pz"],in_progress:["In progress · funds held","rv"],delivered:["Delivered · funds held","rv"],disputed:["Dispute","rejected"],completed:["Paid to freelancer","approved"],declined:["Declined · refunded","pz"],cancelled:["Cancelled · refunded","pz"],refunded:["Refunded","rejected"]},LIVE=["pending_acceptance","in_progress","delivered","disputed"];
  const fee=D.fl.filter(c=>c.status==="completed").reduce((a,c)=>a+(+c.platform_fee||0),0);
  b.innerHTML=`<p class="m" style="margin:0 0 8px"><b>Platform commission earned:</b> ${kes(fee)}. Freelance orders paid into escrow. The client normally releases the money. For a dispute, read the reason and choose <b>Release to freelancer</b> (they receive the price minus the commission) or <b>Refund client</b>.</p><div class="wrap"><table><thead><tr><th>Order</th><th>Client</th><th>Freelancer</th><th>Amount</th><th>Status</th><th>Action</th></tr></thead><tbody>${r.map(c=>{const s=ST[c.status]||["",""],live=LIVE.includes(c.status);return `<tr><td><b>${esc(c.service_title||"Service")}</b> <span class="m">${esc(c.package_name||"")}</span><div class="m">#${esc(String(c.id).slice(0,8))} · ${esc(d0(c.created_at))}</div>${c.dispute_reason?`<div class="m" style="color:#b3261e">Dispute: ${esc(c.dispute_reason)}</div>`:""}</td><td>${esc(c.client_name||"")}</td><td>${esc(c.freelancer_name||"")}<div class="m">Payout ${kes(c.payout)}</div></td><td><b>${kes(c.total)}</b><div class="m">Fee ${kes(c.platform_fee)}</div></td><td><span class="pill ${s[1]}">${s[0]}</span></td><td>${live?`<div class="bt">${c.status!=="pending_acceptance"?`<button class="btn s p" data-fl="${esc(c.id)}" data-a="release">Release to freelancer</button>`:""}<button class="btn s d" data-fl="${esc(c.id)}" data-a="refund">Refund client</button></div>`:""}</td></tr>`}).join("")||empty(6,"No freelance orders yet.")}</tbody></table></div>`}
 else if(T==="wal"){const r=D.wal.filter(w=>match([w.holder,w.email,w.phone,w.card_number,w.kind]));
  b.innerHTML=`<div class="wrap"><table><thead><tr><th>Holder</th><th>Type</th><th>Card number</th><th>Balance</th><th>Valid until</th><th>Contact</th></tr></thead><tbody>${r.map(w=>{const ex=w.expires_at&&new Date(w.expires_at)<=Date.now();return `<tr><td><b>${esc(w.holder)}</b></td><td><span class="pill ${w.kind==="shop"?"rv":""}">${w.kind==="shop"?"Shop":"Personal"}</span></td><td><code>${esc(grp(w.card_number))}</code></td><td><b>${kes(w.balance)}</b></td><td>${ex?'<span class="pill rejected">Expired</span> ':""}${esc(d0(w.expires_at))}</td><td class="m">${esc([w.email,w.phone].filter(Boolean).join(" · "))}</td></tr>`}).join("")||empty(6,"No wallets yet.")}</tbody></table></div>`}
 else if(T==="ren"){const due=D.wal.filter(w=>w.expires_at&&new Date(w.expires_at)-Date.now()<30*864e5&&match([w.holder,w.email,w.card_number])).sort((a,c)=>new Date(a.expires_at)-new Date(c.expires_at));
  const ev=D.ev.filter(x=>match([x.holder,x.kind,x.note]));
  b.innerHTML=`<h3 style="margin:0 0 8px">Expired or expiring within 30 days</h3><div class="wrap"><table><thead><tr><th>Holder</th><th>Card number</th><th>Balance</th><th>Valid until</th><th>Action</th></tr></thead><tbody>${due.map(w=>{const ex=new Date(w.expires_at)<=Date.now();return `<tr><td><b>${esc(w.holder)}</b><div class="m">${w.kind==="shop"?"Shop":"Personal"}</div></td><td><code>${esc(grp(w.card_number))}</code></td><td>${kes(w.balance)}</td><td>${ex?'<span class="pill rejected">Expired</span> ':'<span class="pill pz">Expiring</span> '}${esc(d0(w.expires_at))}</td><td><button class="btn s p" data-rn="${esc(w.wallet_id)}" data-h="${esc(w.holder)}">Renew 2 years</button></td></tr>`}).join("")||empty(5,"No cards need renewal right now.")}</tbody></table></div>
  <h3 style="margin:18px 0 8px">Renewal history</h3><div class="wrap"><table><thead><tr><th>When</th><th>Holder</th><th>Event</th></tr></thead><tbody>${ev.map(x=>`<tr><td class="m">${esc(dt(x.created_at))}</td><td><b>${esc(x.holder)}</b></td><td>Card renewed · <span class="m">${esc(x.note||"")}</span></td></tr>`).join("")||empty(3,"No renewals yet.")}</tbody></table></div>`}
 else{const r=D.tx.filter(x=>match([x.holder,x.tx_kind,x.counterparty,x.reference,x.note,x.status]));
  b.innerHTML=`<div class="wrap"><table><thead><tr><th>When</th><th>Wallet holder</th><th>Type</th><th>Amount</th><th>Status</th><th>Details</th></tr></thead><tbody>${r.map(x=>{const inn=x.tx_kind==="receive"||x.tx_kind==="deposit";return `<tr><td class="m">${esc(dt(x.created_at))}</td><td><b>${esc(x.holder)}</b></td><td>${esc(x.tx_kind)}</td><td class="${inn?"in":"out"}">${inn?"+":"−"}${kes(x.amount)}</td><td><span class="pill ${x.status==="completed"?"approved":x.status==="rejected"?"rejected":"pz"}">${esc(x.status)}</span></td><td class="m">${esc([x.counterparty,x.reference&&"Ref "+x.reference,x.note].filter(Boolean).join(" · "))}</td></tr>`}).join("")||empty(6,"No transactions yet.")}</tbody></table></div>`}
}

async function reload(){await load();tab();if(ERRS.length)$("#wa-err").innerHTML=[...new Set(ERRS)].map(m=>`<div class="msg">${esc(m)}</div>`).join("");else $("#wa-err").innerHTML=""}

window.walletAdmin=async function(){const el=$("#vw");
 if(!el.dataset.w){el.dataset.w=1;el.classList.add("wa");el.innerHTML=css+`<div class="ph"><h1>Wallet Management</h1><p>Review deposits, withdrawals, escrow payments, wallets and card renewals. Approving a request updates the wallet straight away.</p></div><div id="wa-err"></div><div class="stats" id="wa-st"></div><div class="tb"><input id="wa-q" type="search" placeholder="Search holder, order, code or card…" aria-label="Search wallet records"><button class="btn" id="wa-rf">Refresh</button></div><div class="tabs" id="wa-tabs"></div><div id="wa-body"></div>`;
  $("#wa-q").oninput=e=>{Q=e.target.value.trim().toLowerCase();tab()};$("#wa-rf").onclick=reload;
  el.addEventListener("click",async e=>{const t=e.target,wt=t.closest("[data-wt]");if(wt){T=wt.dataset.wt;tab();return}
   const rq=t.closest("[data-rq]");if(rq){const ok=rq.dataset.ok==="1",dep=rq.dataset.k==="deposit";
    if(!await askConfirm({title:ok?(dep?"Approve this deposit?":"Approve this withdrawal?"):"Decline this request?",msg:ok?(dep?`Only approve after the M-Pesa payment of ${kes(rq.dataset.amt)} has reached SOKO Smart. ${rq.dataset.h}'s wallet will be credited.`:`Only approve after you have sent ${kes(rq.dataset.amt)} to ${rq.dataset.h} by M-Pesa.`):(dep?"The deposit is rejected and the wallet is not credited.":"The money returns to the wallet."),ok:ok?"Yes, approve":"Yes, decline"}))return;
    rq.disabled=true;const r=await sb.rpc("wallet_admin_resolve",{p_tx:rq.dataset.rq,p_approve:ok});if(r.error){toast(err(r.error),"error");rq.disabled=false;return}toast(ok?"Approved. Wallet updated.":"Declined");await reload();try{badges()}catch(x){}return}
   const eo=t.closest("[data-eo]");if(eo){const rel=eo.dataset.a==="release";
    if(!await askConfirm({title:rel?"Release funds to the seller?":"Refund the buyer?",msg:rel?"The held money is paid into the seller's wallet. This cannot be undone.":"The held money returns to the buyer's wallet, the order is cancelled and the items go back in stock.",ok:rel?"Yes, release":"Yes, refund"}))return;
    eo.disabled=true;const r=await sb.rpc(rel?"escrow_release":"escrow_refund",{p_order:eo.dataset.eo});if(r.error){toast(err(r.error),"error");eo.disabled=false;return}toast(rel?"Released to the seller":"Refunded to the buyer");await reload();try{badges()}catch(x){}return}
   const fl=t.closest("[data-fl]");if(fl){const rel=fl.dataset.a==="release";
    if(!await askConfirm({title:rel?"Release funds to the freelancer?":"Refund the client?",msg:rel?"The freelancer is paid the price minus the platform commission. This cannot be undone.":"The held money returns to the client's wallet and the contract ends.",ok:rel?"Yes, release":"Yes, refund"}))return;
    fl.disabled=true;const r=await sb.rpc(rel?"freelance_complete_order":"freelance_refund_order",rel?{p_order:fl.dataset.fl,p_rating:null,p_review:null}:{p_order:fl.dataset.fl});if(r.error){toast(err(r.error),"error");fl.disabled=false;return}toast(rel?"Released to the freelancer":"Refunded to the client");await reload();try{badges()}catch(x){}return}
   const rn=t.closest("[data-rn]");if(rn){if(!await askConfirm({title:"Renew this card?",msg:`${rn.dataset.h}'s wallet card is extended by 2 years.`,ok:"Yes, renew"}))return;
    rn.disabled=true;const r=await sb.rpc("wallet_admin_renew",{p_wallet:rn.dataset.rn});if(r.error){toast(err(r.error),"error");rn.disabled=false;return}toast("Card renewed for 2 years");await reload()}});
 }
 $("#wa-body").innerHTML='<div class="empty">Loading…</div>';await reload();try{badges()}catch(x){}};
})();