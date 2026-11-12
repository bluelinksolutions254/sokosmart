/* SOKO Smart ads – pop-up engine for the storefront + the campaign builder used by
   Shop Manager (sellers) and the admin (house ads). Needs the global `sb` (Supabase client). */
(()=>{
if(window.SokoAds)return;
const DB=()=>typeof sb!=="undefined"?sb:null;
const E=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const safe=u=>{u=String(u||"").trim();return /^(https?:\/\/|[a-z0-9_\-./?=&%#]+$)/i.test(u)?u:"#"};
const K=n=>"KSh "+Number(n||0).toLocaleString("en-KE");
const N=n=>Number(n||0).toLocaleString("en-KE");
const say=(t,ty)=>typeof toast==="function"?toast(t,ty):alert(t);

const FORMATS={popup:{n:"Pop-up card",d:"A centred card over the page. Gets the most attention."},slide:{n:"Corner slide-in",d:"Slides up in the bottom-left corner. Gentler on visitors."},banner:{n:"Bottom banner",d:"A slim bar along the bottom of the screen."}};
const THEMES={green:["Forest green","#0B4A2E","#14633F"],orange:["Sunset orange","#F58E20","#D9740A"],light:["Soft cream","#FFF3E3","#FDE3DC"]};
const CTAS=["Shop now","Learn more","View offer","Order now","Contact us","Visit shop","See more"];
const PAGES={home:"Homepage",shop:"Shop and search results",product:"Product and shop pages",jobs:"Jobs page"};
const OBJ={shop:["Visit my shop","Send people to your shop page"],product:["Promote a product","Send people to one of your products"],link:["Custom link","Send people to any page or web address"]};
const AUD={all:"Everyone",members:"Logged-in members only",guests:"Visitors who are not logged in"};
const DEFC={enabled:true,cpm:50,cpc:5,min_budget:200,max_per_session:2,first_delay:8,min_gap:60,scroll_pct:25};

const ANIN={default:"Default pop",fade:"Fade in",up:"Slide up",down:"Slide down",left:"Slide in from the left",right:"Slide in from the right",zoom:"Zoom in",bounce:"Bounce",flip:"Flip",none:"No animation"};
const ANOUT={default:"Default",fade:"Fade out",down:"Slide down",up:"Slide up",left:"Slide out to the left",right:"Slide out to the right",zoom:"Zoom out",none:"Disappear instantly"};
const isVideo=u=>/\.(mp4|webm|mov|m4v|ogv)(\?|#|$)/i.test(String(u||""));
const PIN='<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s7-6.2 7-11a7 7 0 0 0-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>';
const SHOPI='<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 9l1.5-5h15L21 9"/><path d="M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0"/><path d="M5 12v8h14v-8"/></svg>';
const ICON='<svg viewBox="0 0 24 24" width="38" height="38" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 9h18l-2 11H5z"/><path d="M8 9l3-5M16 9l-3-5"/></svg>';
const ARROW='<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

/* ---------------------------------------------------------------- styles */
function css(){if(document.getElementById("ad-css"))return;const s=document.createElement("style");s.id="ad-css";s.textContent=`
.adov{position:fixed;inset:0;z-index:80;display:grid;place-items:center;padding:16px;background:rgba(11,20,16,.55);-webkit-backdrop-filter:blur(3px);backdrop-filter:blur(3px);opacity:0;transition:opacity .25s}
.adov.in{opacity:1}
.adw-slide{position:fixed;z-index:70;left:16px;bottom:calc(16px + env(safe-area-inset-bottom,0px));width:min(340px,calc(100vw - 32px));transform:translateY(30px);opacity:0;transition:transform .4s cubic-bezier(.2,.8,.2,1),opacity .35s}
.adw-slide.in{transform:none;opacity:1}
.adw-banner{position:fixed;z-index:70;left:0;right:0;bottom:0;padding:0 0 calc(12px + env(safe-area-inset-bottom,0px)) 12px;transform:translateY(110%);transition:transform .4s cubic-bezier(.2,.8,.2,1);pointer-events:none}
.adw-banner.in{transform:none}
.adw-banner .adin{width:min(880px,calc(100vw - 92px));pointer-events:auto}
.adc{position:relative;background:#fff;color:#1d1a16;border-radius:20px;overflow:hidden;box-shadow:0 24px 70px rgba(0,0,0,.35),0 2px 8px rgba(0,0,0,.12);font:14px/1.45 "Segoe UI",system-ui,sans-serif;text-align:left}
.adc *{box-sizing:border-box}
.adov .adc{width:min(420px,100%);transform:translateY(20px) scale(.95);transition:transform .4s cubic-bezier(.2,.9,.3,1.15)}
.adov.in .adc{transform:none}
.adm{position:relative;aspect-ratio:16/9;display:grid;place-items:center;overflow:hidden;background:var(--ab,#0B4A2E)}
.adm img{width:100%;height:100%;object-fit:cover;display:block}
.adm.noimg{background:linear-gradient(135deg,var(--ab,#0B4A2E),var(--ab2,#14633F));color:#fff}
.adm.noimg::before,.adm.noimg::after{content:"";position:absolute;border-radius:50%;background:rgba(255,255,255,.1)}
.adm.noimg::before{width:150px;height:150px;right:-40px;top:-50px}
.adm.noimg::after{width:90px;height:90px;left:-24px;bottom:-34px}
.adi{position:relative;width:76px;height:76px;border-radius:50%;background:rgba(255,255,255,.2);display:grid;place-items:center}
.t-light .adm.noimg{color:#0B4A2E}.t-light .adi{background:rgba(11,74,46,.1)}.t-light .adm.noimg::before,.t-light .adm.noimg::after{background:rgba(245,142,32,.18)}
.adb{padding:16px 18px 18px;display:grid;gap:6px}
.adt{min-width:0}
.adsp{display:block;font-size:11px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:#7a7066;margin-bottom:3px}
.adb h3{margin:0;font-size:21px;line-height:1.2;letter-spacing:-.01em;color:#1d1a16}
.adb p{margin:6px 0 0;color:#5b534b}
.ada{display:grid;gap:2px;justify-items:stretch}
.adcta{display:flex;justify-content:center;align-items:center;gap:7px;margin-top:8px;background:#F58E20;color:#fff!important;font-weight:800;border-radius:12px;padding:12px 16px;text-decoration:none!important;box-shadow:0 6px 16px rgba(245,142,32,.4);transition:transform .15s,background .15s}
.adcta:hover{background:#D9740A;transform:translateY(-1px)}
.adno{border:0;background:none;color:#8a8076;font:inherit;font-size:13px;padding:6px;cursor:pointer;text-decoration:underline}
.adx{position:absolute;top:10px;right:10px;z-index:2;width:32px;height:32px;border-radius:50%;border:0;background:rgba(0,0,0,.55);color:#fff;font-size:22px;line-height:1;cursor:pointer;display:grid;place-items:center;padding:0}
.adx:hover{background:rgba(0,0,0,.75)}
.adx:focus-visible,.adcta:focus-visible,.adno:focus-visible{outline:3px solid #F58E20;outline-offset:2px}
.adc.f-slide{border-radius:18px}.adc.f-slide .adm{aspect-ratio:2/1}.adc.f-slide .adb h3{font-size:18px}.adc.f-slide .adb{padding:13px 15px 14px}
.adc.f-banner{display:flex;align-items:stretch;border-radius:16px}
.adc.f-banner .adm{width:104px;aspect-ratio:auto;flex:none}.adc.f-banner .adi{width:52px;height:52px}.adc.f-banner .adi svg{width:26px;height:26px}
.adc.f-banner .adb{flex:1;display:flex;align-items:center;gap:14px;padding:10px 46px 10px 14px;min-width:0}
.adc.f-banner .adt{flex:1}.adc.f-banner h3{font-size:16px}.adc.f-banner p{margin:2px 0 0;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.adc.f-banner .ada{flex:none}.adc.f-banner .adcta{margin-top:0;padding:9px 16px;white-space:nowrap}.adc.f-banner .adno{display:none}
.adc.f-banner .adx{top:50%;transform:translateY(-50%);right:10px}
@media(max-width:600px){
 .adw-slide{left:10px;right:10px;width:auto}
 .adc.f-banner .adm,.adc.f-banner p{display:none}.adc.f-banner .adb{padding:10px 44px 10px 14px}
}
.adstage{background:#ece7de;border-radius:14px;padding:16px;display:grid;place-items:center;overflow:hidden}
.adstage .adc{width:100%;max-width:400px;box-shadow:0 10px 30px rgba(0,0,0,.2)}
.adstage .adc.f-banner{max-width:100%}
/* campaign builder */
#adw{border:0;border-radius:18px;padding:0;width:min(940px,calc(100% - 20px));max-width:none;max-height:92vh;overflow:hidden;background:#fff;color:#1d1a16;font:14px/1.45 "Segoe UI",system-ui,sans-serif}
#adw::backdrop{background:rgba(0,0,0,.5)}
#adw[open]{display:flex;flex-direction:column}
#adw *{box-sizing:border-box}
#adw input,#adw select,#adw textarea{border:1px solid #e6dccd;border-radius:10px;padding:10px 11px;font:inherit;background:#fff;color:#1d1a16;width:100%}
#adw label{display:grid;gap:4px;font-size:13px;color:#6b625a;font-weight:600}
#adw .adwh{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:16px 20px 8px}
#adw .adwh h3{margin:0;font-size:19px}
#adw .adwc{border:0;background:#f4eee6;width:34px;height:34px;border-radius:50%;font-size:22px;cursor:pointer;line-height:1;color:#1d1a16}
#adw .adws{display:flex;gap:6px;padding:0 20px 10px;overflow-x:auto}
#adw .adws span{display:flex;align-items:center;gap:7px;white-space:nowrap;font-size:12.5px;color:#8a8076;font-weight:700;padding:5px 11px;border-radius:20px;background:#f7f2ea}
#adw .adws span b{width:20px;height:20px;border-radius:50%;background:#e2d8c9;color:#fff;display:grid;place-items:center;font-size:11px}
#adw .adws .on{background:#0B4A2E;color:#fff}#adw .adws .on b{background:#F58E20}#adw .adws .done b{background:#14633F}
#adw .adwb{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,1fr);gap:18px;padding:6px 20px 14px;overflow:auto;flex:1}
@media(max-width:780px){#adw .adwb{grid-template-columns:1fr}}
#adw .adwf{display:grid;gap:12px;align-content:start}
#adw .adwf h4{margin:0;font-size:15px}
#adw .adwp{display:grid;gap:8px;align-content:start}
@media(min-width:781px){#adw .adwp{position:sticky;top:0}}
#adw .adwp small{color:#8a8076}
#adw .adwn{display:flex;gap:8px;justify-content:space-between;align-items:center;flex-wrap:wrap;padding:12px 20px 16px;border-top:1px solid #f0e4d4;background:#fffaf4}
#adw .adwn div{display:flex;gap:8px;flex-wrap:wrap}
#adw .b{border:1.5px solid #0B4A2E;background:#fff;color:#0B4A2E;border-radius:10px;padding:9px 18px;font:inherit;font-weight:700;cursor:pointer}
#adw .b.p{background:#0B4A2E;color:#fff}#adw .b.o{background:#F58E20;border-color:#F58E20;color:#fff}
#adw .b:disabled{opacity:.55;cursor:wait}
#adw .cards{display:grid;gap:8px}
#adw .oc{display:flex;gap:12px;align-items:flex-start;text-align:left;border:2px solid #eee3d3;background:#fff;border-radius:14px;padding:12px 14px;cursor:pointer;font:inherit;color:inherit;width:100%}
#adw .oc:hover{border-color:#f5c58f}
#adw .oc.on{border-color:#F58E20;background:#fff7ec}
#adw .oc i{flex:none;width:18px;height:18px;margin-top:2px;border-radius:50%;border:2px solid #cfc4b4;position:relative}
#adw .oc.on i{border-color:#F58E20}#adw .oc.on i::after{content:"";position:absolute;inset:3px;border-radius:50%;background:#F58E20}
#adw .oc b{display:block;color:#1d1a16}#adw .oc span{font-size:13px;color:#6b625a}
#adw .ck{display:flex;gap:9px;align-items:center;font-weight:500;color:#1d1a16;font-size:14px}
#adw .ck input{width:auto}
#adw .two{display:grid;grid-template-columns:1fr 1fr;gap:10px}
#adw .est{background:#eef7f1;border:1px solid #cfe6d7;border-radius:12px;padding:12px 14px;color:#0B4A2E}
#adw .est b{font-size:18px}
#adw .tn{display:flex;gap:8px;flex-wrap:wrap}
#adw .tn button{border:2px solid #eee3d3;background:#fff;border-radius:10px;padding:6px 10px;cursor:pointer;display:flex;gap:7px;align-items:center;font:inherit;font-size:13px}
#adw .tn button.on{border-color:#F58E20}#adw .tn s{display:block;width:16px;height:16px;border-radius:50%;text-decoration:none}
#adw .rv{display:grid;gap:0;border:1px solid #eee3d3;border-radius:12px;overflow:hidden}
#adw .rv div{display:flex;justify-content:space-between;gap:12px;padding:9px 12px;border-bottom:1px solid #f3eadc}
#adw .rv div:last-child{border:0}#adw .rv span{color:#6b625a}#adw .rv b{text-align:right;overflow-wrap:anywhere}
#adw .cnt{font-size:12px;color:#8a8076;text-align:right}
/* refreshed look */
.adc{border-radius:22px;box-shadow:0 28px 80px rgba(11,74,46,.4),0 2px 10px rgba(0,0,0,.14)}
.adc::before{content:"";position:absolute;left:0;right:0;top:0;height:5px;z-index:3;background:linear-gradient(90deg,#F58E20,#FFC46B 50%,#0B4A2E)}
.adm:not(.noimg)::after{content:"";position:absolute;left:0;right:0;bottom:0;height:45%;background:linear-gradient(transparent,rgba(11,40,26,.38));pointer-events:none}
.adm.noimg{background:radial-gradient(circle at 80% 15%,rgba(255,255,255,.22),transparent 45%),linear-gradient(135deg,var(--ab,#0B4A2E),var(--ab2,#14633F))}
.adi{width:84px;height:84px;box-shadow:0 0 0 10px rgba(255,255,255,.1)}
.adb{padding:18px 20px 20px;gap:8px}
.adsp{display:inline-block;background:#FFF3E3;color:#D9740A;border-radius:20px;padding:3px 11px;margin-bottom:8px;font-size:10.5px}
.adb h3{font-size:23px;font-weight:800;line-height:1.15}
.adb p{font-size:14.5px;line-height:1.5}
.adcta{background:linear-gradient(135deg,#F58E20,#E27610);border-radius:999px;padding:13px 20px;font-size:15px;box-shadow:0 8px 20px rgba(245,142,32,.45)}
.adcta:hover{background:linear-gradient(135deg,#FF9E33,#D9740A);transform:translateY(-2px)}
.adcta svg{transition:transform .2s}.adcta:hover svg{transform:translateX(4px)}
.adx{background:rgba(255,255,255,.95);color:#1d1a16;box-shadow:0 2px 10px rgba(0,0,0,.25)}
.adx:hover{background:#fff;color:#b3261e}
.adc.f-banner .adcta{padding:10px 18px}
.adc.f-slide .adb h3{font-size:19px}
@media(prefers-reduced-motion:reduce){.adov,.adov .adc,.adw-slide,.adw-banner{transition:none!important}}
/* v10: video media, product cards, animations */
.adm video{width:100%;height:100%;object-fit:cover;display:block;background:#000}
.adc{max-height:calc(100vh - 32px);max-height:calc(100dvh - 32px);overflow-y:auto;overscroll-behavior:contain}
.adc.f-banner{overflow:hidden;max-height:none}
.adc.hp .adm{aspect-ratio:3/1}.adc.hp .adb{padding:14px 16px 16px;gap:6px}.adc.hp .adsp{margin-bottom:4px}.adc.hp .adb h3{font-size:20px}
.adp{display:grid;gap:8px;margin-top:4px}
.adpt{display:flex;overflow-x:auto;scroll-snap-type:x mandatory;gap:10px;scrollbar-width:none}.adpt::-webkit-scrollbar{display:none}
.adpc{flex:0 0 100%;scroll-snap-align:start;border:1px solid #eee3d3;border-radius:16px;padding:10px;display:grid;gap:6px;background:#fff;align-content:start}
.adpi{aspect-ratio:16/10;background:#F6F4F0;border-radius:12px;overflow:hidden;display:grid;place-items:center;color:#F58E20}
.adpi img{width:100%;height:100%;object-fit:contain;background:#F6F4F0}
.adpn{font-weight:800;font-size:17px;line-height:1.2;color:#1d1a16;overflow-wrap:anywhere}
.adps{font-size:13px;color:#5b534b}.adps span{color:#F58E20;letter-spacing:1px}
.adpr b{color:#F58E20;font-size:22px;font-weight:800}.adpr s{color:#8a8076;margin-left:6px;font-size:14px}
.adpm{display:flex;gap:6px;align-items:center;font-size:13px;color:#5b534b}.adpm svg{flex:none;color:#0B4A2E}
.adv{font-style:normal;background:#0B4A2E;color:#fff;border-radius:50%;width:16px;height:16px;display:inline-grid;place-items:center;font-size:10px;flex:none}
.adpb2{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:4px}
.adbtn{border:0;border-radius:999px;padding:11px 8px;font:inherit;font-weight:800;font-size:13px;cursor:pointer;color:#fff;line-height:1.1}
.adbtn.o{background:#F58E20}.adbtn.o:hover{background:#D9740A}
.adbtn.d{background:#0B4A2E;grid-column:1/-1;text-transform:uppercase;letter-spacing:.02em;font-size:14px;padding:13px}.adbtn.d:hover{background:#14633F}
.adbtn.l{background:#fff;color:#0B4A2E;border:1.5px solid #0B4A2E}.adbtn.l:hover{background:#E8F3EC}
.adbtn:focus-visible{outline:3px solid #F58E20;outline-offset:2px}
.adpn2{display:flex;justify-content:center;align-items:center;gap:12px}.adpn2 button{width:32px;height:32px;border-radius:50%;border:1px solid #e6dccd;background:#fff;font-size:18px;cursor:pointer;line-height:1}.adpn2 span{font-size:13px;color:#6b625a}
.ax.adw-slide,.ax.adw-banner{opacity:1;transform:none;transition:none}
.ax.adov{opacity:1;background:rgba(11,20,16,0);transition:background .35s}
.ax.adov.in{background:rgba(11,20,16,.55)}
.ax.adov .adc,.ax.adov.in .adc{transform:none;transition:none}
@keyframes aiFade{from{opacity:0}to{opacity:1}}
@keyframes aiUp{from{opacity:0;transform:translateY(70px)}to{opacity:1;transform:none}}
@keyframes aiDown{from{opacity:0;transform:translateY(-70px)}to{opacity:1;transform:none}}
@keyframes aiLeft{from{opacity:0;transform:translateX(-90px)}to{opacity:1;transform:none}}
@keyframes aiRight{from{opacity:0;transform:translateX(90px)}to{opacity:1;transform:none}}
@keyframes aiZoom{from{opacity:0;transform:scale(.6)}to{opacity:1;transform:none}}
@keyframes aiBounce{0%{opacity:0;transform:translateY(-70px)}50%{opacity:1;transform:translateY(16px)}70%{transform:translateY(-9px)}88%{transform:translateY(4px)}100%{transform:none}}
@keyframes aiFlip{from{opacity:0;transform:perspective(700px) rotateY(-80deg)}to{opacity:1;transform:none}}
@keyframes aoFade{from{opacity:1}to{opacity:0}}
@keyframes aoDown{from{opacity:1;transform:none}to{opacity:0;transform:translateY(70px)}}
@keyframes aoUp{from{opacity:1;transform:none}to{opacity:0;transform:translateY(-70px)}}
@keyframes aoLeft{from{opacity:1;transform:none}to{opacity:0;transform:translateX(-90px)}}
@keyframes aoRight{from{opacity:1;transform:none}to{opacity:0;transform:translateX(90px)}}
@keyframes aoZoom{from{opacity:1;transform:none}to{opacity:0;transform:scale(.6)}}
.adc.ai-fade{animation:aiFade .5s ease both}.adc.ai-up{animation:aiUp .55s cubic-bezier(.2,.8,.2,1) both}.adc.ai-down{animation:aiDown .55s cubic-bezier(.2,.8,.2,1) both}
.adc.ai-left{animation:aiLeft .55s cubic-bezier(.2,.8,.2,1) both}.adc.ai-right{animation:aiRight .55s cubic-bezier(.2,.8,.2,1) both}.adc.ai-zoom{animation:aiZoom .45s cubic-bezier(.2,.9,.3,1.2) both}
.adc.ai-bounce{animation:aiBounce .9s ease both}.adc.ai-flip{animation:aiFlip .65s ease both}
.adc.ao-fade{animation:aoFade .4s ease both}.adc.ao-down{animation:aoDown .4s ease-in both}.adc.ao-up{animation:aoUp .4s ease-in both}
.adc.ao-left{animation:aoLeft .4s ease-in both}.adc.ao-right{animation:aoRight .4s ease-in both}.adc.ao-zoom{animation:aoZoom .35s ease-in both}
#adw .plist{max-height:190px;overflow:auto;border:1px solid #eee3d3;border-radius:10px;padding:6px 10px;display:grid;gap:2px}
#adw .plist label{font-weight:500;color:#1d1a16}
#adw .adhint{font-size:12.5px;color:#8a8076;margin:0}
@media(prefers-reduced-motion:reduce){.adc[class*=" ai-"],.adc[class*=" ao-"]{animation-duration:.01s!important}}
`;document.head.appendChild(s)}

/* ---------------------------------------------------------------- card markup (live + preview) */
const mediaHTML=img=>{if(!img)return `<span class="adi">${ICON}</span>`;const u=E(safe(img));return isVideo(img)?`<video src="${u}" autoplay muted loop playsinline preload="metadata"></video>`:`<img alt="" src="${u}">`};
const prodCard=p=>{const old=p.old_price&&p.price&&+p.old_price>+p.price?+p.old_price:0,loc=[p.neighbourhood,p.town,p.county].filter(Boolean).join(", "),rt=+p.rating>0?Math.max(1,Math.min(5,Math.round(+p.rating))):0,rc=p.review_count||p.reviews_count||0,shop=p._shop||p.shop_name||"";
 return `<div class="adpc"><div class="adpi">${p.cover_url?`<img alt="" loading="lazy" src="${E(safe(p.cover_url))}">`:ICON}</div>`+
  `<div class="adpn">${E(p.title)}</div>`+
  (rt?`<div class="adps"><span>${"★".repeat(rt)+"☆".repeat(5-rt)}</span> <b>${(+p.rating).toFixed(1)}</b>${rc?` (${N(rc)})`:""}</div>`:"")+
  `<div class="adpr"><b>${p.price!=null?K(p.price):"Contact for price"}</b>${old?`<s>${K(old)}</s>`:""}</div>`+
  (shop?`<div class="adpm">${SHOPI}<span>${E(shop)}</span>${p._sv?'<i class="adv" title="Verified">✓</i>':""}</div>`:"")+
  (loc?`<div class="adpm">${PIN}<span>${E(loc)}</span></div>`:"")+
  `<div class="adpb2"><button type="button" class="adbtn l" data-adchat="${E(p.id)}">Chat seller</button><button type="button" class="adbtn o" data-adcart="${E(p.id)}">Add to Catalogue</button><button type="button" class="adbtn d" data-adbuy="${E(p.id)}">Checkout now</button></div></div>`};
const prodsHTML=a=>{const L=(a._prods||[]).slice(0,4);if(!L.length||a.format==="banner")return"";
 return `<div class="adp"><div class="adpt" data-adpt>${L.map(prodCard).join("")}</div>${L.length>1?`<div class="adpn2"><button type="button" data-adpp="-1" aria-label="Previous product">‹</button><span data-adpc>1 / ${L.length}</span><button type="button" data-adpp="1" aria-label="Next product">›</button></div>`:""}</div>`};
function card(a){
 const f=FORMATS[a.format]?a.format:"popup",th=THEMES[a.theme]?a.theme:"green",t=THEMES[th],img=a.image_url,pr=prodsHTML(a);
 return `<div class="adc f-${f} t-${th}${pr?" hp":""}" style="--ab:${t[1]};--ab2:${t[2]}"><button type="button" class="adx" data-adx aria-label="Close advertisement">&times;</button>`+
 `<div class="adm ${img?"":"noimg"}">${mediaHTML(img)}</div>`+
 `<div class="adb"><div class="adt"><span class="adsp">Sponsored${a.shop_name?" · "+E(a.shop_name):""}</span><h3>${E(a.headline||"Your headline goes here")}</h3>${a.body||!a.headline?`<p>${E(a.body||"Describe your offer in a few words.")}</p>`:""}</div>${pr}`+
 `<div class="ada"><a class="adcta" href="${E(safe(a.cta_url))}" data-adcta>${E(a.cta_label||"Learn more")}${ARROW}</a><button type="button" class="adno" data-adno>No thanks</button></div></div></div>`}

/* products inside ads: shop names, verified badge and payment options come from the shops table */
async function hydrate(rows){const d=DB();rows=rows||[];const ids=[...new Set(rows.map(r=>r.shop_id).filter(Boolean))];let m={};
 if(ids.length&&d){try{const r=await d.from("shops").select("id,name,seller_verified,payment_methods").in("id",ids);(r.data||[]).forEach(x=>m[String(x.id)]=x)}catch(e){}}
 return rows.map(p=>{const s=m[String(p.shop_id)];return {...p,_shop:s?s.name:(p.shop_name||""),_sv:!!(p.seller_verified||(s&&s.seller_verified)),_pm:s&&s.payment_methods||null}})}
async function prep(ad){const ids=Array.isArray(ad.product_ids)?ad.product_ids.slice(0,4):[];ad._prods=[];if(!ids.length||ad.format==="banner")return;
 try{const r=await DB().from("products").select("*").in("id",ids).eq("status","approved"),by={};(r.data||[]).forEach(p=>by[String(p.id)]=p);
  ad._prods=await hydrate(ids.map(i=>by[String(i)]).filter(p=>p&&!(p.stock!=null&&+p.stock<=0)))}catch(e){}}
function bindCar(root){if(root._car)return;root._car=1;
 root.addEventListener("click",e=>{const b=e.target.closest("[data-adpp]");if(!b)return;const box=b.closest(".adp").querySelector("[data-adpt]");box.scrollBy({left:(+b.dataset.adpp)*box.clientWidth,behavior:"smooth"})});
 root.addEventListener("scroll",e=>{const box=e.target;if(!box||!box.matches||!box.matches("[data-adpt]"))return;const n=box.children.length,i=Math.min(n-1,Math.round(box.scrollLeft/Math.max(1,box.clientWidth))),c=box.closest(".adp").querySelector("[data-adpc]");if(c)c.textContent=(i+1)+" / "+n},true)}

/* ---------------------------------------------------------------- storefront engine */
const ST={started:false,cfg:DEFC,ads:[],uid:null,page:"",shown:0,last:0,lastY:0,live:null,t0:Date.now()};
const PAGEMAP={"index.html":"home","":"home","shop.html":"shop","product.html":"product","jobs.html":"jobs"};
const SEEN="soko_ads_seen";
const seen=()=>{try{return JSON.parse(localStorage[SEEN]||"{}")}catch(e){return{}}};
const mark=(id,h)=>{try{const s=seen();s[id]=Date.now()+h*36e5;localStorage[SEEN]=JSON.stringify(s)}catch(e){}};
const muted=id=>{const t=seen()[id];return !!t&&t>Date.now()};
const nSess=()=>{try{return +sessionStorage.soko_ads_n||0}catch(e){return 0}};
const bumpSess=()=>{try{sessionStorage.soko_ads_n=nSess()+1}catch(e){}};
async function loadCfg(){const d=DB();let v=null;try{const r=await d.from("site_content").select("value").eq("key","ads").maybeSingle();v=r.data&&r.data.value}catch(e){}return Object.assign({},DEFC,v||{})}
function track(id,kind){const d=DB();return d?Promise.resolve(d.rpc("ad_track",{p_ad:id,p_kind:kind})).then(()=>{},()=>{}):Promise.resolve()}
const blocked=()=>{const a=document.activeElement;return !!(document.querySelector("dialog[open]")||document.querySelector(".sc-ov.on")||ST.live||ST.busy||(a&&/^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName)))};
const ext=h=>{try{return new URL(h,location.href).origin!==location.origin}catch(e){return false}};

function show(ad){
 const f=FORMATS[ad.format]?ad.format:"popup",el=document.createElement("div");
 if(f==="popup"){el.className="adov";el.setAttribute("role","dialog");el.setAttribute("aria-modal","true");el.innerHTML=card(ad)}
 else{el.className="adw-"+f;el.setAttribute("role","complementary");el.innerHTML=f==="banner"?`<div class="adin">${card(ad)}</div>`:card(ad)}
 el.setAttribute("aria-label","Advertisement");
 el.querySelectorAll("[data-adcta]").forEach(a=>{if(ext(a.getAttribute("href"))){a.target="_blank";a.rel="noopener noreferrer"}});
 const ai=ad.anim_in&&ANIN[ad.anim_in]&&ad.anim_in!=="default"?ad.anim_in:"",ao0=ad.anim_out&&ANOUT[ad.anim_out]&&ad.anim_out!=="default"?ad.anim_out:"",ao=ao0||(ai&&ai!=="none"?"fade":""),cd=el.querySelector(".adc");
 if(ai||ao0)el.classList.add("ax");
 if(ai&&ai!=="none")cd.classList.add("ai-"+ai);
 bindCar(el);
 document.body.appendChild(el);ST.live={el,ad};ST.shown++;ST.last=Date.now();ST.lastY=scrollY;bumpSess();mark(ad.id,6);track(ad.id,"impression");
 requestAnimationFrame(()=>requestAnimationFrame(()=>el.classList.add("in")));
 let auto=null;
 const close=h=>{if(!ST.live||ST.live.el!==el)return;clearTimeout(auto);document.removeEventListener("keydown",key);mark(ad.id,h||24);el.classList.remove("in");ST.live=null;
  if(ao&&ao!=="none"){el.classList.add("ax");if(ai)cd.classList.remove("ai-"+ai);cd.classList.add("ao-"+ao);setTimeout(()=>el.remove(),480)}
  else setTimeout(()=>el.remove(),ao0==="none"?0:380)};
 const key=e=>{if(e.key==="Escape")close(24)};
 document.addEventListener("keydown",key);
 const pAct=async(kind,id)=>{const p=(ad._prods||[]).find(x=>String(x.id)===String(id));if(!p)return;
  if(kind==="cart"){if(typeof RECS==="undefined"||typeof addCart!=="function")return;const k="products:"+p.id;RECS[k]={...p,_s:"products"};addCart(k);track(ad.id,"click");return}
  if(typeof needUser!=="function")return;
  const u=await needUser(kind==="chat"?"Log in or create an account to chat with the seller.":"Log in or create an account to place your order.");if(!u)return;
  if(u.id===p.owner_id){say("This is your own product");return}
  if(!window.SokoChat){say("Chat is still loading, please try again");return}
  track(ad.id,"click");mark(ad.id,72);
  const draft=kind==="chat"?`Hi, I am interested in "${p.title}". Is it still available?`:`Hi, I would like to order:\n• ${p.title} × 1${p.price!=null?" ("+K(p.price)+")":""}\nIs it available?${typeof payText==="function"?payText(p._pm):""}`;
  close(72);window.SokoChat.chatWith(p.owner_id,p.shop_id||null,draft)};
 el.addEventListener("click",async e=>{
  if(e.target.closest("[data-adpp]"))return;
  let pb;if(pb=e.target.closest("[data-adchat],[data-adcart],[data-adbuy]")){e.preventDefault();pAct(pb.hasAttribute("data-adchat")?"chat":pb.hasAttribute("data-adcart")?"cart":"buy",pb.dataset.adchat||pb.dataset.adcart||pb.dataset.adbuy);return}
  if(e.target.closest("[data-adx],[data-adno]")){close(24);return}
  const a=e.target.closest("[data-adcta]");
  if(a){const href=a.getAttribute("href");mark(ad.id,72);
   if(ext(href)){track(ad.id,"click");close(72);return}
   e.preventDefault();await Promise.race([track(ad.id,"click"),new Promise(r=>setTimeout(r,700))]);close(72);if(href&&href!=="#")location.href=href;return}
  if(f==="popup"&&e.target===el)close(24)});
 if(f==="popup"){const x=el.querySelector("[data-adx]");if(x)setTimeout(()=>x.focus({preventScroll:true}),350)}
 else auto=setTimeout(()=>close(6),ad._prods&&ad._prods.length?60000:22000)}

function tick(){
 const c=ST.cfg;if(ST.shown>=(+c.max_per_session||2)||nSess()>=(+c.max_per_session||2)){clearInterval(ST.iv);return}
 if(blocked()||document.visibilityState!=="visible")return;
 const now=Date.now();if(now-ST.t0<(+c.first_delay||8)*1000)return;
 if(ST.shown&&now-ST.last<(+c.min_gap||60)*1000)return;
 const max=document.documentElement.scrollHeight-innerHeight,pct=max<=80?100:scrollY/max*100;
 if(ST.shown===0){if(pct<(+c.scroll_pct||25)&&!(max<=80&&now-ST.t0>12000))return}
 else if(Math.abs(scrollY-ST.lastY)<400)return;
 const pool=ST.ads.filter(a=>!muted(a.id));if(!pool.length)return;
 const w=pool.map(a=>a.is_house?1:2),tot=w.reduce((x,y)=>x+y,0);let r=Math.random()*tot,i=0;while(i<pool.length-1&&(r-=w[i])>0)i++;
 const pick=pool[i];ST.busy=1;prep(pick).then(()=>show(pick)).catch(()=>{}).finally(()=>{ST.busy=0})}

async function start(){
 const d=DB();if(!d||ST.started)return;ST.started=true;
 ST.page=PAGEMAP[location.pathname.split("/").pop()||""];if(!ST.page)return;
 ST.cfg=await loadCfg();if(ST.cfg.enabled===false)return;
 css();
 let session=null,rows=[];
 try{session=(await d.auth.getSession()).data.session;const r=await d.from("ads").select("*").eq("status","active").limit(40);rows=r.error?[]:(r.data||[])}catch(e){return}
 ST.uid=session?session.user.id:null;
 ST.ads=rows.filter(a=>{
  const pl=a.placements&&a.placements.length?a.placements:Object.keys(PAGES);if(!pl.includes(ST.page))return false;
  if(a.audience==="members"&&!ST.uid)return false;if(a.audience==="guests"&&ST.uid)return false;
  if(ST.uid&&a.owner_id===ST.uid)return false;
  if(a.start_date&&a.start_date>new Date().toISOString().slice(0,10))return false;return true});
 if(!ST.ads.length)return;
 ST.iv=setInterval(tick,1500)}

/* ---------------------------------------------------------------- campaign builder */
async function wizard(o){
 css();const d=DB(),cf=Object.assign({},DEFC,o.cfg||await loadCfg()),A=o.ad||null,admin=!!o.admin;
 const today=new Date().toISOString().slice(0,10),plus=n=>new Date(Date.now()+n*864e5).toISOString().slice(0,10);
 let shops=o.shops||[],prods=o.products||[];const g=(k,df)=>A&&A[k]!=null?A[k]:df;
 if(admin){if(!shops.length){try{const r=await d.from("shops").select("id,name,seller_verified").eq("status","approved").order("name").limit(300);shops=r.data||[]}catch(e){}}
  if(!prods.length){try{const r=await d.from("products").select("*").eq("status","approved").order("created_at",{ascending:false}).limit(200);prods=r.data||[]}catch(e){}}}
 prods=await hydrate(prods);
 const S={name:g("name",""),objective:g("objective",admin?"link":"shop"),shop_id:g("shop_id",shops[0]?String(shops[0].id):null),product_id:g("product_id",""),
  link_url:A&&A.objective==="link"?A.cta_url:"",format:g("format","popup"),placements:g("placements",Object.keys(PAGES)).slice(),audience:g("audience","all"),
  headline:g("headline",""),body:g("body",""),image_url:g("image_url",""),cta_label:g("cta_label","Shop now"),cta_url:g("cta_url",""),theme:g("theme","green"),
  budget_total:g("budget_total",admin?"":Math.max(500,+cf.min_budget||200)),start_date:g("start_date",today),end_date:g("end_date",admin?"":plus(7)),goLive:"active"};
 S.anim_in=g("anim_in","default");S.anim_out=g("anim_out","default");S.product_ids=(Array.isArray(A&&A.product_ids)?A.product_ids:[]).map(String);
 const shopOf=()=>shops.find(x=>String(x.id)===String(S.shop_id));
 const dest=()=>{if(S.objective==="shop")return S.shop_id?`product.html?s=shops&id=${encodeURIComponent(S.shop_id)}`:"";if(S.objective==="product")return S.product_id?`product.html?s=products&id=${encodeURIComponent(S.product_id)}`:"";return S.link_url.trim()};
 const sync=()=>{S.cta_url=dest();const sh=shopOf();S.shop_name=admin&&S.objective!=="shop"?"":(sh?sh.name:"")};
 const STEPS=["Goal","Audience","Creative","Budget","Review"];let step=0;
 const dlg=document.getElementById("adw")||(()=>{const x=document.createElement("dialog");x.id="adw";document.body.appendChild(x);return x})();
 const prv=()=>{const e=document.getElementById("adpv");if(e){sync();S._prods=S.product_ids.map(id=>prods.find(p=>String(p.id)===id)).filter(Boolean);e.innerHTML=card(S);e.querySelectorAll("a").forEach(a=>a.removeAttribute("target"))}};
 const est=()=>{const B=+S.budget_total||0,per=cf.cpm/1000+0.02*cf.cpc,im=per>0?Math.floor(B/per):0,days=Math.max(1,Math.round((new Date(S.end_date)-new Date(S.start_date))/864e5)+1);
  return {im,cl:Math.round(im*0.02),days,perDay:Math.round(B/days)}};
 const animUI=()=>`<h4>Animation</h4><div class="two"><label>How it appears<select data-s="anim_in">${Object.entries(ANIN).map(([k,v])=>`<option value="${k}" ${S.anim_in===k?"selected":""}>${v}</option>`).join("")}</select></label><label>How it leaves<select data-s="anim_out">${Object.entries(ANOUT).map(([k,v])=>`<option value="${k}" ${S.anim_out===k?"selected":""}>${v}</option>`).join("")}</select></label></div><button type="button" class="b" data-w="replay">▶ Play the animation in the preview</button>`;
 const pickHTML=()=>`<h4>Products shown in the ad <span class="adhint">(optional, up to 4)</span></h4>${prods.length?`<input type="search" data-pq placeholder="Search products…" aria-label="Search products"><div class="plist">${prods.map(p=>`<label class="ck" data-prow="${E((p.title+" "+(p._shop||"")).toLowerCase())}"><input type="checkbox" data-pp="${E(p.id)}" ${S.product_ids.includes(String(p.id))?"checked":""}> ${E(p.title)}${p.price!=null?" · "+K(p.price):""}${p._shop?" · "+E(p._shop):""}</label>`).join("")}</div><p class="adhint" id="pcnt">${S.product_ids.length} of 4 chosen</p><p class="adhint">Each product shows as a card with its price, shop, location and the Chat seller, Add to Catalogue and Checkout now buttons. Product cards use the Pop-up or Corner slide style.</p>`:'<p class="adhint">There are no approved products to show yet.</p>'}`;
 const replay=()=>{const c=document.querySelector("#adpv .adc");if(!c)return;const ai0=S.anim_in==="default"?"up":S.anim_in,ao0=S.anim_out==="default"?"fade":S.anim_out,strip=()=>{c.className=c.className.replace(/\s*\b(ai|ao)-\w+/g,"")};
  strip();void c.offsetWidth;if(ai0!=="none")c.classList.add("ai-"+ai0);clearTimeout(replay.t);
  replay.t=setTimeout(()=>{strip();if(ao0!=="none")c.classList.add("ao-"+ao0);else c.style.visibility="hidden";
   replay.t=setTimeout(()=>{strip();c.style.visibility=""},900)},1600)};
 const ctaOpts=()=>CTAS.map(x=>`<option ${x===S.cta_label?"selected":""}>${E(x)}</option>`).join("");

 function body(){
  if(step===0){
   const objs=admin?["link","shop","product"]:["shop","product"];
   return `<label>Ad name (only you see this)<input data-s="name" maxlength="60" value="${E(S.name)}" placeholder="e.g. November sale – shoes"></label>
   <h4>What do you want people to do?</h4><div class="cards">${objs.map(k=>`<button type="button" class="oc ${S.objective===k?"on":""}" data-obj="${k}"><i></i><span><b>${OBJ[k][0]}</b>${OBJ[k][1]}</span></button>`).join("")}</div>
   ${S.objective==="shop"&&(shops.length>1||(admin&&shops.length))?`<label>Which shop<select data-s="shop_id">${shops.map(x=>`<option value="${E(x.id)}" ${String(x.id)===String(S.shop_id)?"selected":""}>${E(x.name)}</option>`).join("")}</select></label>`:""}
   ${S.objective==="product"?`<label>Which product<select data-s="product_id"><option value="">Choose an approved product</option>${prods.map(p=>`<option value="${E(p.id)}" ${String(p.id)===String(S.product_id)?"selected":""}>${E(p.title)}</option>`).join("")}</select></label>${prods.length?"":'<p style="margin:0;color:#b3261e">You have no approved products yet. Products appear here after review.</p>'}`:""}
   ${S.objective==="link"?`<label>Where should the button go?<input data-s="link_url" value="${E(S.link_url)}" placeholder="https://… or shop.html?feat=1"></label>`:""}`}
  if(step===1){
   return `<h4>Where should it appear?</h4>${Object.entries(PAGES).map(([k,l])=>`<label class="ck"><input type="checkbox" data-pl="${k}" ${S.placements.includes(k)?"checked":""}> ${l}</label>`).join("")}
   <h4>Who should see it?</h4>${Object.entries(AUD).map(([k,l])=>`<label class="ck"><input type="radio" name="aud" data-s="audience" value="${k}" ${S.audience===k?"checked":""}> ${l}</label>`).join("")}
   <h4>Ad style</h4><div class="cards">${Object.entries(FORMATS).map(([k,v])=>`<button type="button" class="oc ${S.format===k?"on":""}" data-fmt="${k}"><i></i><span><b>${v.n}</b>${v.d}</span></button>`).join("")}</div>
   ${animUI()}
   <p class="cnt" style="text-align:left">Ads appear while visitors scroll, never while they are typing or chatting, and at most ${+cf.max_per_session||2} per visit.</p>`}
  if(step===2){
   return `<label>Headline<input data-s="headline" maxlength="40" value="${E(S.headline)}" placeholder="e.g. 20% off all sneakers"></label><div class="cnt"><span id="c1">${S.headline.length}</span>/40</div>
   <label>Short text<textarea data-s="body" rows="2" maxlength="110" placeholder="Say why people should tap">${E(S.body)}</textarea></label><div class="cnt"><span id="c2">${S.body.length}</span>/110</div>
   <label>Image or video link from ImageKit.io<input data-s="image_url" value="${E(S.image_url)}" placeholder="https://ik.imagekit.io/your_id/ad.jpg  or  …/promo.mp4"></label><p class="adhint">Paste your ImageKit link. Links ending in .mp4 or .webm play as a muted, looping video; .jpg, .png and .webp show as a picture. Landscape works best.</p><label>…or upload an image (under 2 MB)<input type="file" accept="image/*" data-up></label>${pickHTML()}
   <label>Button text<select data-s="cta_label">${ctaOpts()}</select></label>
   <label>Colour when there is no image</label><div class="tn">${Object.entries(THEMES).map(([k,v])=>`<button type="button" class="${S.theme===k?"on":""}" data-th="${k}"><s style="background:${v[1]}"></s>${v[0]}</button>`).join("")}</div>`}
  if(step===3){
   const e=est();
   if(admin)return `<p style="margin:0;color:#6b625a">Ads you create here are free. Leave the budget empty to run without a limit.</p><div class="two"><label>Start date<input type="date" data-s="start_date" value="${E(S.start_date||"")}"></label><label>End date (optional)<input type="date" data-s="end_date" value="${E(S.end_date||"")}"></label></div><label>Budget cap in KSh (optional)<input type="number" min="0" data-s="budget_total" value="${E(S.budget_total)}"></label>
    <h4>After saving</h4><label class="ck"><input type="radio" name="gl" data-s="goLive" value="active" ${S.goLive==="active"?"checked":""}> Publish now</label><label class="ck"><input type="radio" name="gl" data-s="goLive" value="draft" ${S.goLive==="draft"?"checked":""}> Keep as draft</label>`;
   return `<label>Total budget (KSh, minimum ${N(cf.min_budget)})<input type="number" min="${+cf.min_budget||200}" step="50" data-s="budget_total" value="${E(S.budget_total)}"></label>
   <div class="two"><label>Start date<input type="date" min="${today}" data-s="start_date" value="${E(S.start_date)}"></label><label>End date<input type="date" min="${today}" data-s="end_date" value="${E(S.end_date)}"></label></div>
   <div class="est" id="est">${estHTML(e)}</div>
   <p class="cnt" style="text-align:left">Your ad stops by itself when the budget is used up or the end date passes. You pay for views (${K(cf.cpm)} per 1,000) and taps (${K(cf.cpc)} each). Real results vary.</p>`}
  const e=est();
  return `<div class="rv"><div><span>Ad name</span><b>${E(S.name||"Untitled ad")}</b></div><div><span>Goal</span><b>${OBJ[S.objective][0]}</b></div><div><span>Style</span><b>${FORMATS[S.format].n}</b></div><div><span>Shown on</span><b>${S.placements.map(k=>PAGES[k]).join(", ")}</b></div><div><span>Audience</span><b>${AUD[S.audience]}</b></div><div><span>Button leads to</span><b>${E(S.cta_url||"—")}</b></div>${admin?(S.budget_total?`<div><span>Budget cap</span><b>${K(S.budget_total)}</b></div>`:""):`<div><span>Budget</span><b>${K(S.budget_total)} (about ${K(e.perDay)} a day)</b></div>`}<div><span>Runs</span><b>${E(S.start_date||"now")}${S.end_date?" to "+E(S.end_date):""}</b></div></div>
  ${admin?"":'<p class="cnt" style="text-align:left">Every ad is reviewed by the SOKO Smart team before it goes live. You will get a notification when it is approved or needs changes.</p>'}`}
 const estHTML=e=>`<b>About ${N(e.im)} views and ${N(e.cl)} taps</b><br>over ${e.days} day${e.days===1?"":"s"} · around ${K(e.perDay)} a day`;

 function draw(){
  sync();
  const last=step===STEPS.length-1,isNew=!A,canDraft=!A||["draft","rejected"].includes(A.status);
  dlg.innerHTML=`<div class="adwh"><h3>${A?"Edit ad":(admin?"New ad":"Create ad")}</h3><button type="button" class="adwc" data-w="x" aria-label="Close">&times;</button></div>
  <div class="adws">${STEPS.map((x,i)=>`<span class="${i===step?"on":i<step?"done":""}"><b>${i<step?"✓":i+1}</b>${x}</span>`).join("")}</div>
  <div class="adwb"><div class="adwf">${body()}</div><aside class="adwp"><b>Live preview</b><div class="adstage" id="adpv"></div><small>This is how your ad will look to visitors.</small></aside></div>
  <div class="adwn"><button type="button" class="b" data-w="back" ${step?"":"hidden"}>Back</button><span></span><div>${last?`${admin||canDraft?`<button type="button" class="b" data-w="draft">Save as draft</button>`:""}<button type="button" class="b o" data-w="submit">${admin?(S.goLive==="active"?"Publish now":"Save"):(A&&["active","paused"].includes(A.status)?"Save changes":"Submit for review")}</button>`:`<button type="button" class="b p" data-w="next">Continue</button>`}</div></div>`;
  prv()}

 function valid(){
  if(step===0){if(!S.name.trim()){say("Give your ad a name","error");return false}
   if(S.objective==="product"&&!S.product_id){say("Choose the product to promote","error");return false}
   if(S.objective==="shop"&&!S.shop_id){say("No shop found for this ad","error");return false}
   if(S.objective==="link"&&(!S.link_url.trim()||safe(S.link_url)==="#")){say("Enter a valid link, starting with https:// or a page like shop.html","error");return false}}
  if(step===1&&!S.placements.length){say("Choose at least one place to show the ad","error");return false}
  if(step===2){if(S.headline.trim().length<3){say("Add a headline","error");return false}
   if(S.image_url.trim()&&safe(S.image_url)==="#"){say("The image or video link must start with https://","error");return false}}
  if(step===3&&!admin){const B=+S.budget_total;if(!(B>=(+cf.min_budget||200))){say("The minimum budget is "+K(cf.min_budget),"error");return false}
   if(!S.start_date||!S.end_date||S.end_date<S.start_date){say("Choose a start date and an end date after it","error");return false}
   if((new Date(S.end_date)-new Date(S.start_date))/864e5>90){say("Ads can run for up to 90 days","error");return false}}
  if(step===3&&admin&&S.end_date&&S.start_date&&S.end_date<S.start_date){say("End date must be after the start date","error");return false}
  return true}

 async function save(asDraft){
  sync();if(!d)return;
  const btns=dlg.querySelectorAll("[data-w]");btns.forEach(b=>b.disabled=true);
  const keep=A&&["active","paused"].includes(A.status);
  let status;if(admin)status=asDraft?"draft":S.goLive;else status=asDraft?"draft":(keep?A.status:"pending");
  const p={name:S.name.trim()||"Untitled ad",objective:S.objective,shop_id:(S.objective==="shop"||(S.objective==="product"&&!admin))?S.shop_id:null,shop_name:S.shop_name||null,product_id:S.objective==="product"?S.product_id:null,
   format:S.format,placements:S.placements,audience:S.audience,headline:S.headline.trim(),body:S.body.trim()||null,image_url:S.image_url.trim()||null,
   cta_label:S.cta_label,cta_url:S.cta_url,theme:S.theme,budget_total:S.budget_total===""?null:+S.budget_total,start_date:S.start_date||null,end_date:S.end_date||null,status};
  const ex={anim_in:S.anim_in,anim_out:S.anim_out,product_ids:S.product_ids.length?S.product_ids:null};
  if(!A){p.owner_id=o.userId;if(admin)p.is_house=true}
  const run=q=>A?d.from("ads").update(q).eq("id",A.id).select().single():d.from("ads").insert(q).select().single();
  let r=await run({...p,...ex}),warn="";
  if(r.error&&/anim_in|anim_out|product_ids/i.test(r.error.message)){r=await run(p);warn=" Animations and products were not saved yet: run supabase-ads-reviews.sql in Supabase."}
  btns.forEach(b=>b.disabled=false);
  if(r.error){say(/relation .*ads|schema cache/i.test(r.error.message)?"Ads are not set up yet. Run supabase-complaints-ads.sql in Supabase.":r.error.message,"error");return}
  dlg.close();if(warn)say("Ad saved."+warn,"error");else say(status==="pending"?"Ad submitted. We will notify you once it is reviewed.":status==="active"&&admin?"Ad published.":"Ad saved.");o.onDone&&o.onDone(r.data)}

 async function upload(file){
  if(!/^image\//.test(file.type)||file.size>2e6){say("Choose an image under 2 MB","error");return}
  const ext=(file.name.split(".").pop()||"png").toLowerCase().replace(/[^a-z0-9]/g,"")||"png",path=`${o.userId}/ad-${Date.now()}.${ext}`;
  const up=await d.storage.from("listing-images").upload(path,file,{contentType:file.type});if(up.error){say(up.error.message,"error");return}
  S.image_url=d.storage.from("listing-images").getPublicUrl(path).data.publicUrl;draw();say("Image added")}

 dlg.onclick=e=>{const b=e.target.closest("[data-w],[data-obj],[data-fmt],[data-th]");if(!b)return;
  if(b.dataset.obj){S.objective=b.dataset.obj;draw();return}
  if(b.dataset.fmt){S.format=b.dataset.fmt;draw();return}
  if(b.dataset.th){S.theme=b.dataset.th;draw();return}
  const w=b.dataset.w;
  if(w==="x")dlg.close();else if(w==="back"){step--;draw()}
  else if(w==="next"){if(valid()){step++;draw()}}
  else if(w==="replay")replay();
  else if(w==="draft"){if(!S.name.trim()){say("Give your ad a name","error");return}save(true)}
  else if(w==="submit"){if(valid())save(false)}};
 dlg.oninput=e=>{const t=e.target;
  if(t.dataset.pl){const k=t.dataset.pl;S.placements=t.checked?[...new Set([...S.placements,k])]:S.placements.filter(x=>x!==k);return}
  if(t.dataset.pq!==undefined){const q=t.value.toLowerCase();dlg.querySelectorAll("[data-prow]").forEach(r=>r.hidden=!r.dataset.prow.includes(q));return}
  if(t.dataset.pp){const id=t.dataset.pp;if(t.checked){if(S.product_ids.length>=4){t.checked=false;say("You can show up to 4 products","error");return}S.product_ids.push(id)}else S.product_ids=S.product_ids.filter(x=>x!==id);if(S.product_ids.length&&S.format==="banner")S.format="popup";prv();const c=dlg.querySelector("#pcnt");if(c)c.textContent=S.product_ids.length+" of 4 chosen";return}
  const k=t.dataset.s;if(!k)return;
  S[k]=t.type==="number"?t.value:t.value;
  if(k==="headline"){const c=dlg.querySelector("#c1");if(c)c.textContent=S.headline.length}
  if(k==="body"){const c=dlg.querySelector("#c2");if(c)c.textContent=S.body.length}
  if(step===3){const x=dlg.querySelector("#est");if(x)x.innerHTML=estHTML(est())}
  if(k==="product_id"||k==="audience"||k==="goLive"){if(k==="goLive")draw();return}
  prv();if(k==="anim_in"||k==="anim_out")replay()};
 dlg.onchange=e=>{const t=e.target;if(t.matches("[data-up]")&&t.files[0])upload(t.files[0])};
 bindCar(dlg);draw();if(!dlg.open)dlg.showModal()}

window.SokoAds={start,card,wizard,css,loadCfg,FORMATS,THEMES,PAGES,DEFC,isVideo,ANIN,ANOUT};
if(!window.SOKO_NO_ADS){const go=()=>{if(typeof sb!=="undefined"&&sb)start()};document.readyState==="loading"?document.addEventListener("DOMContentLoaded",go):go()}
})();