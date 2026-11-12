/* SOKO Smart admin: turns text buttons into neat icon buttons (the label stays as a tooltip and for screen readers).
   Works on buttons created later too, so every admin area is covered. */
(()=>{
const P={
 plus:'<path d="M12 5v14M5 12h14"/>',
 save:'<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M17 21v-8H7v8M7 3v5h8"/>',
 send:'<path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4z"/>',
 trash:'<path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/>',
 reject:'<circle cx="12" cy="12" r="9"/><path d="M15 9l-6 6M9 9l6 6"/>',
 approve:'<circle cx="12" cy="12" r="9"/><path d="M8 12.5l3 3 5-6"/>',
 check:'<path d="M20 6L9 17l-5-5"/>',
 x:'<path d="M18 6L6 18M6 6l12 12"/>',
 edit:'<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
 eye:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
 open:'<path d="M14 3h7v7"/><path d="M10 14L21 3"/><path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"/>',
 reset:'<path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/>',
 pause:'<path d="M8 5v14M16 5v14"/>',
 play:'<path d="M7 4l13 8-13 8z"/>',
 up:'<path d="M12 19V5M6 11l6-6 6 6"/>',
 down:'<path d="M12 5v14M6 13l6 6 6-6"/>',
 more:'<path d="M6 9l6 6 6-6"/>',
 right:'<path d="M5 12h14M13 6l6 6-6 6"/>',
 fields:'<path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>'
};
const RULES=[
 [/^\s*↑/,"up"],[/^\s*↓/,"down"],
 [/notify|send|publish|broadcast/,"send"],
 [/^save|^update|^apply/,"save"],
 [/delete|remove|trash/,"trash"],
 [/reject|decline|deny/,"reject"],
 [/approve|accept/,"approve"],
 [/cancel|close|dismiss|^no$/,"x"],
 [/^edit|^rename/,"edit"],
 [/view all|see all/,"right"],
 [/preview|^view|^show/,"eye"],
 [/^open/,"open"],
 [/reset|restore|refresh|reload|retry|again/,"reset"],
 [/pause/,"pause"],[/resume|^play|activate/,"play"],
 [/load more|show more|more/,"more"],
 [/^\s*\+|^add|^new/,"plus"],
 [/create|register|confirm|submit|^ok$|^yes$/,"check"],
 [/form fields|fields/,"fields"]
];
const SEL='.btn,.cfn,.cfy,.va';
const iconFor=t=>{t=t.trim().toLowerCase();if(!t)return null;for(const [re,n] of RULES)if(re.test(t))return n;return null};
document.head.insertAdjacentHTML("beforeend",'<style>.ico{display:inline-grid!important;place-items:center;width:40px;min-width:0!important;height:40px;padding:0!important;line-height:1;gap:0}.ico.s{width:34px;height:34px}.ico .ico-svg{display:block;pointer-events:none}.ico .vh{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}.ico{position:relative}</style>');
function conv(b){
 if(b.closest("#login")||b.hasAttribute("data-keep")||b.querySelector(":scope>svg.ico-svg"))return;
 const lab=(b.textContent||"").replace(/\s+/g," ").trim(),n=iconFor(lab);if(!n)return;
 b.classList.add("ico");b.title=lab;b.setAttribute("aria-label",lab);
 b.innerHTML=`<svg class="ico-svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n]}</svg><span class="vh">${lab.replace(/[&<>]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;"}[c]))}</span>`}
function scan(root){if(root.nodeType!==1)return;if(root.matches&&root.matches(SEL))conv(root);root.querySelectorAll&&root.querySelectorAll(SEL).forEach(conv);const c=root.closest&&root.closest(SEL);if(c)conv(c)}
let q=new Set(),t=0;
const flush=()=>{t=0;const a=[...q];q.clear();a.forEach(scan)};
new MutationObserver(ms=>{ms.forEach(m=>{m.addedNodes.forEach(n=>q.add(n));if(m.type==="childList"&&m.target.nodeType===1)q.add(m.target)});if(!t)t=requestAnimationFrame(flush)}).observe(document.body,{childList:true,subtree:true});
scan(document.body);
})();