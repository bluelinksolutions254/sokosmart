/* SOKO Smart admin: Homepage Control. Needs admin.html globals: sb, $, esc, toast, ic. Saves to site_content (key "homepage"). */
(()=>{
const DEF={services:{},headerLinks:[],topbar:[{icon:"truck",text:""},{icon:"shield",text:""},{icon:"tag",text:""}],sidebar:{enabled:true,title:"Shop by Category"},hero:{slides:[]},features:[],sections:[],footer:{tagline:"",socials:[]}};
const HICONS=["pin","car","home","tag","star","gift"];
const ICONS=["truck","shield","headset","lock","tag","star","heart","cart","gift","clock","undo","pin","msg","mail","check"];
const TYPES={products:"Product row",banners:"Promo banners",shops:"Top shops",jobs:"Hiring now",blog:"Blog posts",community:"Newsletter / community",brands:"Brand logos",cta:"Open-shop + jobs call-to-action"};
const HANIM={fade:"Fade",slide:"Slide from the right",up:"Slide up",zoom:"Zoom in",kenburns:"Fade with slow image zoom",flip:"Flip"},TANIM={none:"None",rise:"Rise up",left:"Slide in from the left",zoom:"Pop in"},PANIM={none:"None (always visible)",rise:"Rise up as it scrolls into view",zoom:"Pop in",left:"Slide in from the left",right:"Slide in from the right"},PHOV={none:"None",lift:"Lift with a shadow",zoom:"Zoom the image"};
const SOCN={facebook:"Facebook",instagram:"Instagram",x:"X (Twitter)",tiktok:"TikTok",youtube:"YouTube",whatsapp:"WhatsApp",linkedin:"LinkedIn",telegram:"Telegram",link:"Other link"};
const SRC={latest:"Newest products",featured:"Featured products",trending:"Most viewed"};
let C=null,box=null,R=null,P={},PG="home";
const PAGES=[["home","Homepage","index.html"],["header","Header (all pages)","index.html"],["footer","Footer (all pages)","index.html"],["shop","Shop / Products","shop.html"],["product","Product page","product.html"],["jobs","Jobs","jobs.html"],["free","Free Things","free.html"],["freelance","Freelance","freelance.html"],["servicehub","Services","servicehub.html"],["blog","Blog","blog.html"],["openshop","Open a Shop","openshop.html"]];
const SITE=()=>PG==="home"||PG==="header"||PG==="footer";
const pageDef=()=>({on:true,closedMsg:"",title:"",sub:"",img:"",noteOn:false,note:"",noteLink:"",noteColor:"#FDE3DC",seoTitle:"",seoDesc:"",blocks:[]});
const uid=()=>"s"+Math.random().toString(36).slice(2,8);
const val=(v,d="")=>esc(v==null?d:v);
const sel=(o,v)=>Object.entries(o).map(([k,l])=>`<option value="${k}" ${k===v?"selected":""}>${esc(l)}</option>`).join("");
const inp=(path,l,v,t="text",x="")=>`<label>${l}<input data-p="${path}" type="${t}" value="${val(v)}" ${x}></label>`;
const img=(path,l,v)=>`<label>${l}<div style="display:flex;gap:8px;align-items:center"><input data-p="${path}" value="${val(v)}" placeholder="https://… or upload"><label class="btn s" style="margin:0;cursor:pointer;white-space:nowrap">Upload<input type="file" accept="image/*" data-up="${path}" hidden></label></div>${v?`<img alt="" src="${val(v)}" style="height:54px;margin-top:6px;border-radius:8px;object-fit:cover;max-width:160px">`:""}</label>`;
const row=(h,b,extra="")=>`<div class="hc-i"><div class="hc-h"><b>${h}</b><span>${extra}</span></div><div class="hc-b">${b}</div></div>`;
const del=(p,i)=>`<button class="btn s d" data-del="${p}" data-i="${i}">Remove</button>`;
const get=(path)=>path.split(".").reduce((o,k)=>o==null?o:o[k],R);
function set(path,v){const ks=path.split("."),last=ks.pop();const o=ks.reduce((a,k)=>a[k],R);o[last]=v}

const heroAnim=()=>`<div class="hc-g"><label>Slide transition<select data-p="hero.anim">${sel(HANIM,C.hero.anim||"fade")}</select></label><label>Text animation<select data-p="hero.textAnim">${sel(TANIM,C.hero.textAnim||"none")}</select></label>${inp("hero.speed","Seconds per slide (3–15)",C.hero.speed||6,"number",'min="3" max="15"')}<label class="hc-ck"><input type="checkbox" data-p="hero.autoplay" ${C.hero.autoplay!==false?"checked":""}> Auto-play slides</label></div>`;
const bannerAnim=(s,i)=>`<label>Entrance animation<select data-p="sections.${i}.anim">${sel(PANIM,s.anim||"none")}</select></label><label>Hover effect<select data-p="sections.${i}.hover">${sel(PHOV,s.hover||"none")}</select></label><label class="hc-ck"><input type="checkbox" data-p="sections.${i}.float" ${s.float?"checked":""}> Slowly zoom the image in a loop</label>`;
function secEditor(s,i){const t=s.type;let b=`<div class="hc-g">${inp(`sections.${i}.title`,"Heading",s.title)}`;
 if(t==="products")b+=`<label>Show<select data-p="sections.${i}.source">${sel(SRC,s.source)}</select></label>${inp(`sections.${i}.count`,"How many (1–20)",s.count||5,"number",'min="1" max="20"')}${inp(`sections.${i}.badge`,"Badge on cards (optional)",s.badge)}${inp(`sections.${i}.link`,"“View all” link",s.link)}`;
 else if(t==="shops"||t==="jobs")b+=`${inp(`sections.${i}.count`,"How many (1–20)",s.count||6,"number",'min="1" max="20"')}${inp(`sections.${i}.link`,"“View all” link",s.link)}`;
 else if(t==="community")b+=`${inp(`sections.${i}.text`,"Text",s.text)}${inp(`sections.${i}.btn`,"Button label",s.btn)}`;
 else if(t==="blog"||t==="brands")b+=inp(`sections.${i}.link`,"“View all” link (optional)",s.link);
 if(t==="banners")b+=bannerAnim(s,i);
 b+="</div>";
 if(t==="banners")b+=(s.items||[]).map((x,k)=>row("Banner "+(k+1),`<div class="hc-g">${inp(`sections.${i}.items.${k}.title`,"Title",x.title)}${inp(`sections.${i}.items.${k}.sub`,"Subtitle",x.sub)}${inp(`sections.${i}.items.${k}.tag`,"Round tag e.g. UP TO 50% OFF",x.tag)}${inp(`sections.${i}.items.${k}.btn`,"Button label",x.btn)}${inp(`sections.${i}.items.${k}.link`,"Button link",x.link)}${inp(`sections.${i}.items.${k}.color`,"Background colour",x.color||"#FDE3DC","color")}</div>${img(`sections.${i}.items.${k}.img`,"Image",x.img)}`,del(`sections.${i}.items`,k))).join("")+`<button class="btn s" data-add="banner" data-i="${i}">+ Add banner</button>`;
 if(t==="blog")b+=(s.items||[]).map((x,k)=>row("Post "+(k+1),`<div class="hc-g">${inp(`sections.${i}.items.${k}.title`,"Title",x.title)}${inp(`sections.${i}.items.${k}.date`,"Date text",x.date)}${inp(`sections.${i}.items.${k}.link`,"Link",x.link)}</div>${img(`sections.${i}.items.${k}.img`,"Image",x.img)}`,del(`sections.${i}.items`,k))).join("")+`<button class="btn s" data-add="post" data-i="${i}">+ Add post</button>`;
 if(t==="brands")b+=(s.items||[]).map((x,k)=>row("Brand "+(k+1),`<div class="hc-g">${inp(`sections.${i}.items.${k}.name`,"Name",x.name)}${inp(`sections.${i}.items.${k}.link`,"Link",x.link)}</div>${img(`sections.${i}.items.${k}.img`,"Logo",x.img)}`,del(`sections.${i}.items`,k))).join("")+`<button class="btn s" data-add="brand" data-i="${i}">+ Add brand</button>`;
 return b}

const HCSS=`<style>.hc-c{background:var(--bg);border-radius:16px;padding:18px 20px;margin-bottom:16px;box-shadow:0 1px 3px rgba(20,40,30,.07)}.hc-c>h2{font-size:17px;margin-bottom:12px}.hc-g{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:10px;margin-bottom:10px}.hc-i{border:1px solid var(--bd);border-radius:12px;margin:10px 0;overflow:hidden}.hc-h{display:flex;justify-content:space-between;gap:8px;align-items:center;background:var(--bg2);padding:8px 12px;flex-wrap:wrap}.hc-h span{display:flex;gap:6px;flex-wrap:wrap}.hc-b{padding:12px}.hc-bar{position:sticky;bottom:0;background:var(--bg2);padding:12px 0;display:flex;gap:10px;align-items:center;flex-wrap:wrap;z-index:5}.hc-ck{display:flex;gap:8px;align-items:center;flex-direction:row}.hc-ck input{width:auto}</style>`;
function drawHome(){R=C;const S=C.sections||[];
 box.innerHTML=HCSS+`
 
   <div class="hc-c"><h2>Services area (menu link, footer link and homepage banner)</h2><p class="m" style="margin-top:0">Controls how the Services marketplace (servicehub.html) appears on the website. Approving providers and their work is done under Service Management.</p><div class="hc-g"><label class="hc-ck"><input type="checkbox" data-p="services.navOn" ${C.services.navOn!==false?"checked":""}> Show “Services” in the main menu and footer</label>${inp("services.navLabel","Menu label",C.services.navLabel)}</div><div class="hc-g"><label class="hc-ck"><input type="checkbox" data-p="services.bandOn" ${C.services.bandOn!==false?"checked":""}> Show the Services banner on the homepage</label></div><div class="hc-g">${inp("services.bandTitle","Banner heading (first part)",C.services.bandTitle)}${inp("services.bandHi","Banner heading (orange part)",C.services.bandHi)}${inp("services.bandText","Banner text",C.services.bandText)}${inp("services.bandBtn","Main button label",C.services.bandBtn)}${inp("services.bandAlt","Second link label",C.services.bandAlt)}</div></div>
  
 <div class="hc-c"><h2>Category sidebar</h2><label class="hc-ck"><input type="checkbox" data-p="sidebar.enabled" ${C.sidebar.enabled!==false?"checked":""}> Show “Shop by Category” list (categories come from Product Management → Categories)</label>${inp("sidebar.title","Sidebar title",C.sidebar.title)}</div>
 <div class="hc-c"><h2>Hero slider</h2>${heroAnim()}${C.hero.slides.map((x,i)=>row("Slide "+(i+1),`<div class="hc-g">${inp(`hero.slides.${i}.title`,"Headline",x.title)}${inp(`hero.slides.${i}.sub`,"Sub-headline",x.sub)}${inp(`hero.slides.${i}.btn`,"Button label",x.btn)}${inp(`hero.slides.${i}.link`,"Button link (e.g. shop.html?feat=1)",x.link)}${inp(`hero.slides.${i}.bg`,"Background colour",x.bg||"#FFF3E3","color")}<label>Text colour<select data-p="hero.slides.${i}.theme"><option value="light" ${x.theme!=="dark"?"selected":""}>Dark text (light background)</option><option value="dark" ${x.theme==="dark"?"selected":""}>White text (dark background)</option></select></label></div>${img(`hero.slides.${i}.img`,"Slide image (right side, about 800×760)",x.img)}`,`<button class="btn s" data-mv="hero.slides" data-i="${i}" data-d="-1">↑</button><button class="btn s" data-mv="hero.slides" data-i="${i}" data-d="1">↓</button>${del("hero.slides",i)}`)).join("")}<button class="btn s" data-add="slide">+ Add slide</button></div>
 <div class="hc-c"><h2>Feature strip (4 boxes under the hero)</h2><div class="hc-g">${C.features.map((x,i)=>`<div class="hc-i"><div class="hc-b"><label>Icon<select data-p="features.${i}.icon">${ICONS.map(o=>`<option ${o===x.icon?"selected":""}>${o}</option>`).join("")}</select></label>${inp(`features.${i}.title`,"Title",x.title)}${inp(`features.${i}.sub`,"Small text",x.sub)}${del("features",i)}</div></div>`).join("")}</div><button class="btn s" data-add="feature">+ Add box</button></div>
 <div class="hc-c"><h2>Homepage sections (top to bottom)</h2><p class="m" style="margin-top:0">Reorder, hide, edit or add blocks. Hidden blocks stay saved.</p>
 ${S.map((s,i)=>`<div class="hc-i ${s.on===false?"off":""}"><div class="hc-h"><b>${esc(TYPES[s.type]||s.type)}${s.title?" · "+esc(s.title):""}</b><span><label class="hc-ck"><input type="checkbox" data-p="sections.${i}.on" ${s.on!==false?"checked":""}> Visible</label><button class="btn s" data-mv="sections" data-i="${i}" data-d="-1">↑</button><button class="btn s" data-mv="sections" data-i="${i}" data-d="1">↓</button>${del("sections",i)}</span></div><div class="hc-b">${s.type==="cta"?'<p class="m" style="margin:0">Fixed “Open your shop / Post a job” cards. Use Visible to show or hide.</p>':secEditor(s,i)}</div></div>`).join("")}
 <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:end"><label style="min-width:240px">Add a block<select id="hcNew">${sel(TYPES,"products")}</select></label><button class="btn" id="hcAdd">+ Add section</button></div></div>
 
 <div class="hc-bar"><button class="btn p" id="hcSave">Save homepage</button><a class="btn" href="index.html" target="_blank" rel="noopener">View homepage</a><button class="btn d" id="hcReset">Reset to defaults</button><span class="m" id="hcMsg">Press Save, then reload the website to see the change.</span></div>`}

function drawPage(){const p=P[PG]=Object.assign(pageDef(),P[PG]||{});if(!Array.isArray(p.blocks))p.blocks=[];R=p;const pg=PAGES.find(x=>x[0]===PG);
 box.innerHTML=HCSS+`<div class="hc-c"><h2>${esc(pg[1])}: visibility</h2><p class="m" style="margin-top:0">Turn the page off to show visitors a “closed” message instead (useful while you work on it).</p><label class="hc-ck"><input type="checkbox" data-p="on" ${p.on!==false?"checked":""}> Page is open to visitors</label>${inp("closedMsg","Message shown when the page is closed",p.closedMsg)}</div>
 <div class="hc-c"><h2>Page heading</h2><p class="m" style="margin-top:0">Leave a box empty to keep the page’s built-in wording.</p><div class="hc-g">${inp("title","Heading",p.title)}${inp("sub","Sub-heading",p.sub)}</div>${img("img","Header image (optional)",p.img)}</div>
 <div class="hc-c"><h2>Announcement bar</h2><label class="hc-ck"><input type="checkbox" data-p="noteOn" ${p.noteOn?"checked":""}> Show an announcement at the top of this page</label><div class="hc-g">${inp("note","Message",p.note)}${inp("noteLink","Link (optional)",p.noteLink)}${inp("noteColor","Background colour",p.noteColor||"#FDE3DC","color")}</div></div>
 <div class="hc-c"><h2>Extra content blocks</h2><p class="m" style="margin-top:0">Add text blocks with an optional button. They show at the top of the page, in this order.</p>${p.blocks.map((x,k)=>row("Block "+(k+1),`<div class="hc-g">${inp(`blocks.${k}.title`,"Heading",x.title)}${inp(`blocks.${k}.text`,"Text",x.text)}${inp(`blocks.${k}.btn`,"Button label (optional)",x.btn)}${inp(`blocks.${k}.link`,"Button link",x.link)}</div>`,`<label class="hc-ck"><input type="checkbox" data-p="blocks.${k}.on" ${x.on!==false?"checked":""}> Visible</label><button class="btn s" data-mv="blocks" data-i="${k}" data-d="-1">↑</button><button class="btn s" data-mv="blocks" data-i="${k}" data-d="1">↓</button>${del("blocks",k)}`)).join("")}<button class="btn s" data-add="pblock">+ Add block</button></div>
 <div class="hc-c"><h2>Search engines (SEO)</h2><div class="hc-g">${inp("seoTitle","Browser tab / Google title",p.seoTitle)}${inp("seoDesc","Google description",p.seoDesc)}</div></div>
 <div class="hc-bar"><button class="btn p" id="hcSave">Save ${esc(pg[1])}</button><a class="btn" href="${esc(pg[2])}" target="_blank" rel="noopener">View page</a><button class="btn d" id="hcReset">Reset this page</button><span class="m" id="hcMsg">Press Save, then reload the website to see the change.</span></div>`}
function drawSite(){R=C;const hd=PG==="header",nm=hd?"header":"footer";
 if(!Array.isArray(C.menu))C.menu=[];if(!C.footer)C.footer={};if(!Array.isArray(C.footer.columns))C.footer.columns=[];if(!C.footer.contact)C.footer.contact={};if(!Array.isArray(C.headerLinks))C.headerLinks=[];if(!Array.isArray(C.topbar))C.topbar=[];
 box.innerHTML=HCSS+(hd?`<div class="hc-c"><h2>Header links (top strip: “Sell Your Vehicle”, “Sell Your Land/Property”)</h2><p class="m" style="margin-top:0">SOKO Smart does not list land, property or vehicles. These buttons at the very top of the website send visitors to your other system. Until you add an address, a button shows a “coming soon” message.</p>${(C.headerLinks||[]).map((x,i)=>`<div class="hc-i"><div class="hc-b"><div class="hc-g">${inp(`headerLinks.${i}.label`,"Button text",x.label)}${inp(`headerLinks.${i}.url`,"Where it goes (https://… or a page)",x.url)}<label>Icon<select data-p="headerLinks.${i}.icon">${HICONS.map(o=>`<option ${o===x.icon?"selected":""}>${o}</option>`).join("")}</select></label></div><div class="hc-g"><label class="hc-ck"><input type="checkbox" data-p="headerLinks.${i}.newTab" ${x.newTab!==false?"checked":""}> Open in a new tab</label><label class="hc-ck"><input type="checkbox" data-p="headerLinks.${i}.on" ${x.on!==false?"checked":""}> Visible</label>${del("headerLinks",i)}</div></div></div>`).join("")}<button class="btn s" data-add="hlink">+ Add link</button></div>
 <div class="hc-c"><h2>Top bar (green strip above the header)</h2><div class="hc-g">${C.topbar.map((x,i)=>`<div><label>Icon<select data-p="topbar.${i}.icon">${ICONS.map(o=>`<option ${o===x.icon?"selected":""}>${o}</option>`).join("")}</select></label>${inp(`topbar.${i}.text`,"Message",x.text)}</div>`).join("")}</div></div>
 <div class="hc-c"><h2>Main menu links</h2><p class="m" style="margin-top:0">Extra links in the website’s main menu, in this order.</p>${C.menu.map((x,i)=>`<div class="hc-i"><div class="hc-b"><div class="hc-g">${inp(`menu.${i}.label`,"Menu text",x.label)}${inp(`menu.${i}.url`,"Where it goes (page or https://…)",x.url)}</div><div class="hc-g"><label class="hc-ck"><input type="checkbox" data-p="menu.${i}.on" ${x.on!==false?"checked":""}> Visible</label><span style="display:flex;gap:6px"><button class="btn s" data-mv="menu" data-i="${i}" data-d="-1">↑</button><button class="btn s" data-mv="menu" data-i="${i}" data-d="1">↓</button>${del("menu",i)}</span></div></div></div>`).join("")}<button class="btn s" data-add="mlink">+ Add menu link</button></div>
 <div class="hc-c"><h2>Search box</h2>${inp("searchHint","Placeholder text in the search box",C.searchHint)}</div>`:`<div class="hc-c"><h2>Footer</h2>${inp("footer.tagline","Tagline under the logo",C.footer.tagline)}${inp("footer.copyright","Copyright line (bottom of the footer)",C.footer.copyright)}<p class="m" style="margin-top:0">Pick the platform and paste your page link. They show as icons in the website footer. A row with an empty link stays hidden.</p>${(C.footer.socials||[]).map((x,i)=>`<div class="hc-g"><label>Platform<select data-p="footer.socials.${i}.icon">${sel(SOCN,x.icon||String(x.name||"").toLowerCase())}</select></label>${inp(`footer.socials.${i}.url`,"Full link (https://…)",x.url)}${del("footer.socials",i)}</div>`).join("")}<button class="btn s" data-add="social">+ Add social link</button></div>
 <div class="hc-c"><h2>Footer link columns</h2><p class="m" style="margin-top:0">One link per line, written as <code>Label | page or https://…</code></p>${C.footer.columns.map((x,i)=>`<div class="hc-i"><div class="hc-b">${inp(`footer.columns.${i}.title`,"Column title",x.title)}<label>Links<textarea data-p="footer.columns.${i}.links" rows="4" placeholder="About us | about.html">${val(x.links)}</textarea></label>${del("footer.columns",i)}</div></div>`).join("")}<button class="btn s" data-add="fcol">+ Add column</button></div>
 <div class="hc-c"><h2>Contact details</h2><div class="hc-g">${inp("footer.contact.email","Email",C.footer.contact.email)}${inp("footer.contact.phone","Phone",C.footer.contact.phone)}${inp("footer.contact.address","Address",C.footer.contact.address)}</div></div>`)+`<div class="hc-bar"><button class="btn p" id="hcSave">Save ${nm}</button><a class="btn" href="index.html" target="_blank" rel="noopener">View website</a><button class="btn d" id="hcReset">Reset ${nm}</button><span class="m" id="hcMsg">Shows on every page. Press Save, then reload the website to see the change.</span></div>`}
function draw(){const a=$("#hcView");if(a)a.href=(PAGES.find(x=>x[0]===PG)||PAGES[0])[2];PG==="home"?drawHome():PG==="header"||PG==="footer"?drawSite():drawPage()}

const NEW={mlink:()=>({label:"New link",url:"",on:true}),fcol:()=>({title:"New column",links:""}),pblock:()=>({title:"",text:"",btn:"",link:"",on:true}),hlink:()=>({label:"New link",url:"",icon:"tag",newTab:true,on:true}),slide:()=>({title:"New slide",sub:"",btn:"Shop Now",link:"shop.html",img:"",bg:"#FFF3E3",theme:"light"}),feature:()=>({icon:"check",title:"Title",sub:""}),social:()=>({name:"Facebook",icon:"facebook",url:""}),banner:()=>({tag:"",title:"New banner",sub:"",btn:"Shop Now",link:"shop.html",img:"",color:"#FDE3DC"}),post:()=>({title:"New post",date:"",img:"",link:""}),brand:()=>({name:"",img:"",link:""})};
const NEWSEC={products:()=>({id:uid(),type:"products",source:"latest",title:"New products",link:"shop.html",count:5,badge:"",on:true}),banners:()=>({id:uid(),type:"banners",on:true,items:[NEW.banner(),NEW.banner()]}),shops:()=>({id:uid(),type:"shops",title:"Top Rated Shops",link:"shop.html?section=shops",count:8,on:true}),jobs:()=>({id:uid(),type:"jobs",title:"Hiring Now",link:"jobs.html",count:6,on:true}),blog:()=>({id:uid(),type:"blog",title:"From Our Blog",link:"",on:true,items:[NEW.post()]}),community:()=>({id:uid(),type:"community",title:"Join the community",text:"Get new arrivals and tips in your inbox.",btn:"Subscribe",on:true}),brands:()=>({id:uid(),type:"brands",title:"Shop Top Brands",link:"",on:true,items:[NEW.brand()]}),cta:()=>({id:uid(),type:"cta",on:true})};
const ADDTO={mlink:"menu",fcol:"footer.columns",pblock:"blocks",hlink:"headerLinks",slide:"hero.slides",feature:"features",social:"footer.socials"};

async function upload(path,file){if(!/^image\//.test(file.type)||file.size>3e6){toast("Image must be under 3 MB","error");return}
 const {data:{session}}=await sb.auth.getSession(),ext=(file.name.split(".").pop()||"png").toLowerCase().replace(/[^a-z0-9]/g,"")||"png",p=`${session.user.id}/site-${Date.now()}.${ext}`;
 const up=await sb.storage.from("listing-images").upload(p,file,{contentType:file.type});if(up.error){toast(up.error.message,"error");return}
 set(path,sb.storage.from("listing-images").getPublicUrl(p).data.publicUrl);draw();toast("Image uploaded. Remember to save.")}

function wire(){
 box.addEventListener("input",e=>{const el=e.target.closest("[data-p]");if(!el||el.type==="file")return;let v=el.type==="checkbox"?el.checked:el.type==="number"?(el.value===""?"":+el.value):el.value;set(el.dataset.p,v);if(el.type==="checkbox"||el.tagName==="SELECT")draw()});
 box.addEventListener("change",e=>{const f=e.target.closest("[data-up]");if(f&&f.files[0])upload(f.dataset.up,f.files[0])});
 box.addEventListener("click",async e=>{let b;
  if(b=e.target.closest("[data-del]")){if(!await askConfirm({title:"Remove this?",msg:"It will be removed from the homepage once you press Save homepage.",ok:"Yes, remove"}))return;const a=get(b.dataset.del);a.splice(+b.dataset.i,1);draw()}
  else if(b=e.target.closest("[data-mv]")){const a=get(b.dataset.mv),i=+b.dataset.i,j=i+ +b.dataset.d;if(j<0||j>=a.length)return;[a[i],a[j]]=[a[j],a[i]];draw()}
  else if(b=e.target.closest("[data-add]")){const k=b.dataset.add;if(ADDTO[k])get(ADDTO[k]).push(NEW[k]());else{const s=C.sections[+b.dataset.i];s.items=s.items||[];s.items.push(NEW[k]())}draw()}
  else if(e.target.id==="hcAdd"){C.sections.push(NEWSEC[$("#hcNew").value]());draw();toast("Section added at the bottom. Use ↑ to move it.")}
  else if(e.target.id==="hcReset"){if(await askConfirm({title:"Reset the homepage?",msg:"Everything on this page goes back to the default layout. Nothing changes on the website until you press Save homepage.",ok:"Yes, reset"})){if(PG==="home")C=defaults();else if(PG==="header"){const d=defaults();C.headerLinks=d.headerLinks;C.topbar=d.topbar;C.menu=[];C.searchHint=""}else if(PG==="footer")C.footer=defaults().footer;else P[PG]=pageDef();draw()}}
  else if(e.target.id==="hcSave"){const btn=e.target;btn.disabled=true;
   const {data,error}=await sb.from("site_content").upsert({key:SITE()?"homepage":"pages",value:SITE()?C:P,updated_at:new Date().toISOString()},{onConflict:"key"}).select("key,updated_at");btn.disabled=false;
   if(error){toast(error.message.includes("site_content")?"Run supabase-site-content.sql in Supabase first: "+error.message:error.message,"error");return}
   if(!data||!data.length){toast("The homepage was NOT saved: the database refused the change. Run supabase-site-content.sql in Supabase, then save again.","error");return}
   try{sessionStorage.removeItem("sokoSite")}catch(x){}toast((PG==="home"?"Homepage":PG==="header"?"Header":PG==="footer"?"Footer":"Page")+" saved. Reload the website to see it.")}})}

let defaults=()=>JSON.parse(JSON.stringify(window.__HOME_DEF));
window.homeAdmin=async function(){box=$("#vh");
 if(!window.__HOME_DEF){window.__HOME_DEF={
 services:{navOn:true,navLabel:"Services",bandOn:true,bandTitle:"Need a plumber, cleaner or ",bandHi:"casual worker?",bandText:"Browse approved service providers near you, message them directly, or post a request and let them apply.",bandBtn:"Browse services",bandAlt:"Offer your services"},
 headerLinks:[{label:"Sell Your Vehicle",url:"",icon:"car",newTab:true,on:true},{label:"Sell Your Land/Property",url:"",icon:"pin",newTab:true,on:true}],
 topbar:[{icon:"truck",text:"Chat with sellers before you buy"},{icon:"shield",text:"Verified sellers across all 47 counties"},{icon:"tag",text:"List products for free"}],
 sidebar:{enabled:true,title:"Shop by Category"},
 hero:{slides:[
  {title:"Upgrade Your Everyday",sub:"Smart products from trusted Kenyan sellers, delivered to your county.",btn:"Shop Now",link:"shop.html",img:"",bg:"#FFF3E3",theme:"light"},
  {title:"Open Your Shop for Free",sub:"Get a storefront link, a chat inbox and a dashboard to manage products.",btn:"Open a Shop",link:"openshop.html",img:"",bg:"#0B4A2E",theme:"dark"}]},
 features:[{icon:"truck",title:"Delivery by seller",sub:"Agree the details in chat"},{icon:"shield",title:"Verified sellers",sub:"Look for the green tick"},{icon:"headset",title:"Chat support",sub:"The SOKO Smart team"},{icon:"lock",title:"Safe meet-ups",sub:"Pay on delivery or collect"}],
 sections:[
  {id:"s1",type:"products",source:"latest",title:"New Arrivals",link:"shop.html?sort=latest",count:5,badge:"New",on:true},
  {id:"s2",type:"banners",on:true,items:[
   {tag:"",title:"Style That Moves With You",sub:"Fashion from local shops",btn:"Shop Fashion",link:"shop.html?k=Fashion",img:"",color:"#FDE3DC"},
   {tag:"",title:"Smart Living for Modern Homes",sub:"Furniture and appliances near you",btn:"Shop Home",link:"shop.html?k=Home",img:"",color:"#E3F0E7"}]},
  {id:"s3",type:"products",source:"featured",title:"Featured Products",link:"shop.html?feat=1",count:5,badge:"",on:true},
  {id:"s4",type:"products",source:"trending",title:"Trending Now",link:"shop.html?sort=popular",count:5,badge:"Hot",on:true},
  {id:"s5",type:"shops",title:"Top Rated Shops",link:"shop.html?section=shops",count:8,on:true},
  {id:"s6",type:"jobs",title:"Hiring Now",link:"jobs.html",count:6,on:true},
  {id:"s7",type:"blog",title:"From Our Blog",link:"",on:false,items:[]},
  {id:"s8",type:"community",title:"Join the SOKO Smart Community",text:"Get new arrivals and selling tips straight to your inbox.",btn:"Subscribe",on:true},
  {id:"s9",type:"brands",title:"Shop Top Brands",link:"",on:false,items:[]},
  {id:"s10",type:"cta",on:true}],
 footer:{tagline:"Kenya’s smart marketplace for products, shops, jobs and services.",socials:[{name:"Facebook",icon:"facebook",url:""},{name:"Instagram",icon:"instagram",url:""},{name:"TikTok",icon:"tiktok",url:""},{name:"WhatsApp",icon:"whatsapp",url:""}]}}}
 if(!box.dataset.w){box.innerHTML='<div class="ph"><h1>Homepage Control</h1><p>Choose a page from the list, then edit what visitors see on it.</p></div><div style="background:var(--bg);border-radius:16px;padding:14px 20px;margin-bottom:16px;box-shadow:0 1px 3px rgba(20,40,30,.07);display:flex;gap:12px;align-items:end;flex-wrap:wrap"><label style="flex:1;min-width:220px">Page to edit<select id="hcPg">'+PAGES.map(x=>`<option value="${x[0]}">${x[1]}</option>`).join("")+'</select></label><a class="btn" id="hcView" href="index.html" target="_blank" rel="noopener">View page</a></div><div id="hcRoot"><div class="empty">Loading…</div></div>';box.dataset.w=1}
 const root=$("#hcRoot");box=root;if(!root.dataset.w){wire();root.dataset.w=1}
 const pgSel=$("#hcPg");pgSel.value=PG;if(!pgSel.dataset.w){pgSel.onchange=e=>{PG=e.target.value;draw()};pgSel.dataset.w=1}
 let v=null;const {data,error}=await sb.from("site_content").select("value").eq("key","homepage").maybeSingle();
 if(error){root.innerHTML=`<div class="card"><b>Set up needed.</b><p class="m">Run <code>soko-homepage.sql</code> in the Supabase SQL editor, then reload this page. (${esc(error.message)})</p></div>`;return}
 v=data&&data.value;C=Object.assign(defaults(),v||{});for(const k of Object.keys(DEF))if(C[k]==null)C[k]=DEF[k];C.services=Object.assign({},defaults().services,C.services);
 try{const pr=await sb.from("site_content").select("value").eq("key","pages").maybeSingle();P=(pr.data&&pr.data.value)||{}}catch(x){P={}}
 draw()}
})();
/* SOKO Smart admin: Reports & Complaints and Promotions & Ads.
   Needs admin.html globals: sb, $, esc, toast, ic, fmt, num, askConfirm, badges. Also ads.js (SokoAds). */
(()=>{
const css=`<style>
.pill.rv{background:#e8f0fb;color:#1d4f91}.pill.pz{background:#eee;color:#555}.pill.live{background:#e3f4ea;color:var(--g)}
.xr .wrap table{min-width:760px}.xr td,.xr th{padding:10px 12px;text-align:left;border-bottom:1px solid var(--bd);vertical-align:middle}
.xr th{font-size:12px;text-transform:uppercase;letter-spacing:.04em;color:var(--mut);background:var(--bg2)}
.xr .bar{height:6px;border-radius:3px;background:var(--bd);overflow:hidden;margin-top:4px;min-width:90px}.xr .bar i{display:block;height:100%;background:var(--a)}
.xr .kv{display:grid;grid-template-columns:130px 1fr;gap:6px 12px;margin:10px 0;font-size:14px}.xr .kv span{color:var(--mut)}
.xr .msgbox{background:var(--bg2);border-radius:10px;padding:10px 12px;white-space:pre-wrap;overflow-wrap:anywhere;margin:6px 0 12px}
.xr .two{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.xr .frm{display:grid;gap:12px;background:var(--bg);border-radius:14px;padding:18px;box-shadow:0 1px 3px rgba(20,40,30,.07);max-width:620px}
.xr .thx{width:56px;height:42px;border-radius:8px;object-fit:cover;display:block}
</style>`;
const sh=(el)=>{if(!el.dataset.css){el.insertAdjacentHTML("afterbegin",css);el.dataset.css=1}};
const when=d=>d?new Date(d).toLocaleDateString("en-KE",{day:"numeric",month:"short",year:"numeric"}):"";
const dlg=h=>{$("#dc").innerHTML=h;if(!$("#dlg").open)$("#dlg").showModal()};
const ticket=c=>c.ticket||"SC-"+String(c.id).replace(/-/g,"").slice(0,6).toUpperCase();
const needSql=m=>/relation .*(complaints|ads)|schema cache|does not exist/i.test(m||"")?"This feature is not set up yet. Run supabase-complaints-ads.sql in the Supabase SQL editor, then reload. ("+m+")":m;

/* =========================================================== COMPLAINTS */
const CST={open:["New","" ],in_review:["In review","rv"],resolved:["Resolved","approved"],dismissed:["Closed","rejected"]};
let CR=[],CF="",CQ="";
window.complaintsAdmin=async function(){
 const el=$("#vr");sh(el);el.classList.add("xr");
 if(!el.dataset.w){el.insertAdjacentHTML("beforeend",`<div class="ph"><h1>Reports &amp; Complaints</h1><p>Complaints sent from the “File a complaint” form in the website footer.</p></div><div class="stats" id="cst"></div><div class="tb"><input id="cq" type="search" placeholder="Search by reference, name, email or subject…" aria-label="Search complaints"><select id="cf" aria-label="Status"><option value="">All statuses</option><option value="open">New</option><option value="in_review">In review</option><option value="resolved">Resolved</option><option value="dismissed">Closed</option></select></div><div class="wrap"><table><thead><tr><th>Ref</th><th>From</th><th>Problem</th><th>Date</th><th>Status</th><th></th></tr></thead><tbody id="crow"><tr><td colspan="6" class="empty">Loading…</td></tr></tbody></table></div>`);
  $("#cf").onchange=e=>{CF=e.target.value;draw()};let t;$("#cq").oninput=e=>{clearTimeout(t);t=setTimeout(()=>{CQ=e.target.value.trim().toLowerCase();draw()},250)};
  el.addEventListener("click",e=>{const b=e.target.closest("[data-cv]");if(b)open(b.dataset.cv)});el.dataset.w=1}
 const {data,error}=await sb.from("complaints").select("*").order("created_at",{ascending:false}).limit(300);
 if(error){$("#crow").innerHTML=`<tr><td colspan="6" class="empty">${esc(needSql(error.message))}</td></tr>`;return}
 CR=data||[];draw()};
function draw(){
 const n=s=>CR.filter(c=>c.status===s).length;
 $("#cst").innerHTML=[["New",n("open")],["In review",n("in_review")],["Resolved",n("resolved")],["Closed",n("dismissed")]].map(x=>`<div class="st"><b>${num(x[1])}</b><span>${x[0]}</span></div>`).join("");
 const rows=CR.filter(c=>(!CF||c.status===CF)&&(!CQ||[ticket(c),c.full_name,c.email,c.subject,c.reference].join(" ").toLowerCase().includes(CQ)));
 $("#crow").innerHTML=rows.map(c=>{const s=CST[c.status]||CST.open;return `<tr><td><b>${esc(ticket(c))}</b></td><td>${esc(c.full_name)}<div class="m">${esc(c.email)}${c.user_id?" · member":" · guest"}</div></td><td><b>${esc(c.subject)}</b><div class="m">${esc(c.category)}</div></td><td class="m">${when(c.created_at)}</td><td><span class="pill ${s[1]}">${s[0]}</span></td><td><button class="btn s" data-cv="${esc(c.id)}">Open</button></td></tr>`}).join("")||'<tr><td colspan="6" class="empty">No complaints found.</td></tr>'}
function open(id){
 const c=CR.find(x=>String(x.id)===id);if(!c)return;
 dlg(`<div class="xr"><h3>${esc(ticket(c))} · ${esc(c.subject)}</h3>
 <div class="kv"><span>Type</span><b>${esc(c.category)}</b><span>From</span><b>${esc(c.full_name)}${c.user_id?" (member)":" (guest)"}</b><span>Email</span><a href="mailto:${esc(c.email)}">${esc(c.email)}</a>${c.phone?`<span>Phone</span><a href="tel:${esc(c.phone)}">${esc(c.phone)}</a>`:""}${c.reference?`<span>About</span><b style="overflow-wrap:anywhere">${/^https?:\/\//i.test(c.reference)?`<a target="_blank" rel="noopener" href="${esc(c.reference)}">${esc(c.reference)}</a>`:esc(c.reference)}</b>`:""}<span>Sent</span><b>${when(c.created_at)}</b></div>
 <b>What happened</b><div class="msgbox">${esc(c.message)}</div>${c.evidence_url?`<p><a target="_blank" rel="noopener" href="${esc(c.evidence_url)}"><img alt="Evidence" src="${esc(c.evidence_url)}" style="max-width:100%;max-height:200px;border-radius:10px"></a></p>`:""}
 <form id="cfr" data-id="${esc(c.id)}" style="display:grid;gap:10px"><label>Status<select name="st">${Object.entries(CST).map(([k,v])=>`<option value="${k}" ${k===c.status?"selected":""}>${v[0]}</option>`).join("")}</select></label>
 <label>Reply to the customer<textarea name="rp" rows="5" maxlength="1500" placeholder="Write what we found or what happens next. Members receive it in Messages and as a notification.">${esc(c.admin_reply||"")}</textarea></label>
 <div style="display:flex;gap:8px;justify-content:flex-end;flex-wrap:wrap"><button type="button" class="btn" id="ec">Close</button><button class="btn p">Save &amp; notify</button></div></form></div>`)}
document.addEventListener("submit",async e=>{const f=e.target;if(f.id!=="cfr")return;e.preventDefault();
 const c=CR.find(x=>String(x.id)===f.dataset.id),st=f.st.value,rp=f.rp.value.trim(),btn=f.querySelector(".btn.p");btn.disabled=true;
 const p={status:st,admin_reply:rp||null,resolved_at:["resolved","dismissed"].includes(st)?new Date().toISOString():null};
 const {error}=await sb.from("complaints").update(p).eq("id",c.id);
 if(error){btn.disabled=false;toast(error.message,"error");return}
 let note="";
 if(rp&&rp!==(c.admin_reply||"")){
  if(c.user_id){const body=`Reply to your complaint ${ticket(c)} (“${c.subject}”):\n\n${rp}\n\nStatus: ${CST[st][0]}`;const r=await sb.rpc("admin_notify_user",{p_user:c.user_id,p_body:body});note=r.error?" (saved, but the message could not be sent: "+r.error.message+")":" The customer was notified in Messages."}
  else note=" This customer was a guest, so please also email "+c.email+"."}
 else if(c.user_id)note=" The customer was notified.";
 $("#dlg").close();toast("Complaint updated."+note);window.complaintsAdmin();if(typeof badges==="function")badges()});

/* =========================================================== ADS */
const AST={draft:["Draft",""],pending:["Needs review","rv"],active:["Live","live"],paused:["Paused","pz"],rejected:["Rejected","rejected"],completed:["Completed","pz"]};
let AR=[],AT="queue",AUID=null,ACFG=null,ASH=[],APR=[];
window.adsAdmin=async function(){
 const el=$("#vpr");sh(el);el.classList.add("xr");
 if(!el.dataset.w){
  el.insertAdjacentHTML("beforeend",`<div class="ph"><h1>Promotions &amp; Ads</h1><p>Review seller ads, run your own ads and control how pop-ups behave.</p></div><div class="tabs" id="atabs"><button data-at="queue" class="on">Review queue</button><button data-at="all">All ads</button><button data-at="set">Settings</button></div><div id="abody"></div>`);
  el.addEventListener("click",onClick);el.addEventListener("submit",onSubmit);el.dataset.w=1}
 const {data:{session}}=await sb.auth.getSession();AUID=session&&session.user.id;
 await load()};
async function load(){
 $("#abody").innerHTML='<div class="empty">Loading…</div>';
 const {data,error}=await sb.from("ads").select("*").order("created_at",{ascending:false}).limit(300);
 if(error){$("#abody").innerHTML=`<div class="empty">${esc(needSql(error.message))}</div>`;return}
 AR=data||[];ACFG=await SokoAds.loadCfg();
 try{const [sr,pr]=await Promise.all([sb.from("shops").select("id,name").eq("status","approved").limit(200),sb.from("products").select("id,title").eq("status","approved").order("created_at",{ascending:false}).limit(300)]);ASH=sr.data||[];APR=pr.data||[]}catch(e){}
 view()}
function view(){
 document.querySelectorAll("#atabs button").forEach(b=>b.classList.toggle("on",b.dataset.at===AT));
 if(AT==="set")return settings();
 const rows=AT==="queue"?AR.filter(a=>a.status==="pending"):AR;
 const tot=AR.filter(a=>!a.is_house).reduce((s,a)=>s+ +a.spend,0),live=AR.filter(a=>a.status==="active").length,pend=AR.filter(a=>a.status==="pending").length;
 const imp=AR.reduce((s,a)=>s+ +a.impressions,0),clk=AR.reduce((s,a)=>s+ +a.clicks,0);
 $("#abody").innerHTML=`<div class="stats"><div class="st"><b>${num(pend)}</b><span>Waiting for review</span></div><div class="st"><b>${num(live)}</b><span>Live now</span></div><div class="st"><b>${num(imp)}</b><span>Views</span></div><div class="st"><b>${num(clk)}</b><span>Taps</span></div><div class="st"><b>${fmt(Math.round(tot))}</b><span>Seller ad spend</span></div></div>
 <div class="tb"><button class="btn p" data-ahouse>+ New ad</button></div>
 <div class="wrap"><table><thead><tr><th></th><th>Ad</th><th>Owner</th><th>Status</th><th>Budget</th><th>Results</th><th>Actions</th></tr></thead><tbody>${rows.map(row).join("")||`<tr><td colspan="7" class="empty">${AT==="queue"?"Nothing waiting for review.":"No ads yet."}</td></tr>`}</tbody></table></div>`}
function row(a){
 const s=AST[a.status]||AST.draft,pc=a.budget_total?Math.min(100,Math.round(+a.spend/+a.budget_total*100)):0,th=(SokoAds.THEMES[a.theme]||SokoAds.THEMES.green)[1];
 const acts=[`<button class="btn s" data-apv="${esc(a.id)}">Preview</button>`];
 if(a.status==="pending"||a.status==="rejected")acts.push(`<button class="btn s p" data-aok="${esc(a.id)}">Approve</button>`);
 if(a.status==="pending")acts.push(`<button class="btn s d" data-ano="${esc(a.id)}">Reject</button>`);
 if(a.status==="active")acts.push(`<button class="btn s" data-aset="${esc(a.id)}" data-to="paused">Pause</button>`);
 if(a.status==="paused"||(a.status==="draft"&&a.is_house))acts.push(`<button class="btn s" data-aset="${esc(a.id)}" data-to="active">${a.status==="paused"?"Resume":"Publish"}</button>`);
 if(a.is_house)acts.push(`<button class="btn s" data-aed="${esc(a.id)}">Edit</button>`);
 acts.push(`<button class="btn s d" data-adel="${esc(a.id)}">Delete</button>`);
 return `<tr><td>${a.image_url?`<img class="thx" alt="" src="${esc(a.image_url)}">`:`<div class="thx" style="background:${th}"></div>`}</td><td><b>${esc(a.headline)}</b><div class="m">${esc(a.name)} · ${esc((SokoAds.FORMATS[a.format]||{}).n||"")}</div></td>
 <td>${a.is_house?'<span class="pill approved">Admin ad</span>':esc(a.shop_name||"Seller")}</td><td><span class="pill ${s[1]}">${s[0]}</span>${a.reject_reason?`<div class="m">${esc(a.reject_reason)}</div>`:""}<div class="m">${esc(a.start_date||"")}${a.end_date?" → "+esc(a.end_date):""}</div></td>
 <td>${a.is_house?(a.budget_total?fmt(+a.budget_total)+" cap":"No cap"):`${fmt(Math.round(+a.spend))} / ${fmt(+a.budget_total||0)}<div class="bar"><i style="width:${pc}%"></i></div>`}</td>
 <td>${num(a.impressions)} views<div class="m">${num(a.clicks)} taps${+a.impressions?" · "+(a.clicks/a.impressions*100).toFixed(1)+"%":""}</div></td><td><div class="acts">${acts.join("")}</div></td></tr>`}

function settings(){
 const c=ACFG;
 $("#abody").innerHTML=`<form class="frm" id="aset"><h3>Ad settings</h3>
 <label class="hc-ck" style="display:flex;gap:8px;align-items:center;flex-direction:row"><input type="checkbox" name="enabled" style="width:auto" ${c.enabled!==false?"checked":""}> Show pop-up ads on the website</label>
 <div class="two"><label>Price per 1,000 views (KSh)<input name="cpm" type="number" min="0" step="1" value="${+c.cpm}"></label><label>Price per tap (KSh)<input name="cpc" type="number" min="0" step="1" value="${+c.cpc}"></label></div>
 <label>Minimum seller budget (KSh)<input name="min_budget" type="number" min="0" step="50" value="${+c.min_budget}"></label>
 <h3 style="margin-top:6px">How pop-ups behave</h3>
 <div class="two"><label>Max ads per visit<input name="max_per_session" type="number" min="1" max="6" value="${+c.max_per_session}"></label><label>First ad after (seconds)<input name="first_delay" type="number" min="0" max="120" value="${+c.first_delay}"></label></div>
 <div class="two"><label>Gap between ads (seconds)<input name="min_gap" type="number" min="10" max="600" value="${+c.min_gap}"></label><label>First ad after scrolling (% of page)<input name="scroll_pct" type="number" min="0" max="90" value="${+c.scroll_pct}"></label></div>
 <p class="m" style="margin:0">Visitors who close an ad do not see that same ad again for 24 hours. Ads never show while someone is typing or chatting, or on the profile, Shop Manager, sign-up and complaint pages.</p>
 <div><button class="btn p">Save settings</button></div></form>`}

async function onSubmit(e){const f=e.target;
 if(f.id==="aset"){e.preventDefault();const n=k=>Number(f[k].value)||0;
  const v={enabled:f.enabled.checked,cpm:n("cpm"),cpc:n("cpc"),min_budget:n("min_budget"),max_per_session:n("max_per_session")||2,first_delay:n("first_delay"),min_gap:n("min_gap")||60,scroll_pct:n("scroll_pct")};
  const {data,error}=await sb.from("site_content").upsert({key:"ads",value:v,updated_at:new Date().toISOString()},{onConflict:"key"}).select("key");
  if(error||!data||!data.length){toast(error?error.message:"The settings were not saved. Run supabase-complaints-ads.sql in Supabase.","error");return}
  ACFG=Object.assign({},ACFG,v);toast("Ad settings saved.")}
 if(f.id==="arj"){e.preventDefault();const id=f.dataset.id,r=f.rs.value.trim();
  const {error}=await sb.from("ads").update({status:"rejected",reject_reason:r||"Please review the ad and resubmit."}).eq("id",id);
  if(error){toast(error.message,"error");return}$("#dlg").close();toast("Ad rejected. The seller was notified.");load();if(typeof badges==="function")badges()}}

async function onClick(e){const g=s=>e.target.closest(s);let b;
 if(b=g("[data-at]")){AT=b.dataset.at;view();return}
 if(g("[data-ahouse]")){SokoAds.wizard({admin:true,userId:AUID,cfg:ACFG,shops:ASH,products:APR,onDone:()=>{load();if(typeof badges==="function")badges()}});return}
 if(b=g("[data-aed]")){SokoAds.wizard({admin:true,ad:AR.find(a=>String(a.id)===b.dataset.aed),userId:AUID,cfg:ACFG,shops:ASH,products:APR,onDone:()=>load()});return}
 if(b=g("[data-apv]")){const a=AR.find(x=>String(x.id)===b.dataset.apv);SokoAds.css();
  dlg(`<h3>Preview</h3><div class="adstage" id="apvs">${SokoAds.card(a)}</div><div class="kv"><span>Button leads to</span><b style="overflow-wrap:anywhere">${esc(a.cta_url)}</b><span>Shown on</span><b>${esc((a.placements||[]).map(k=>SokoAds.PAGES[k]).join(", "))}</b><span>Audience</span><b>${esc(a.audience)}</b></div><div style="text-align:right"><button class="btn" id="ec">Close</button></div>`);
  $("#apvs").onclick=ev=>{ev.preventDefault()};return}
 if(b=g("[data-aok]")){const {error}=await sb.from("ads").update({status:"active",reject_reason:null}).eq("id",b.dataset.aok);error?toast(error.message,"error"):(toast("Ad approved and live. The seller was notified."),load(),typeof badges==="function"&&badges());return}
 if(b=g("[data-ano]")){dlg(`<h3>Reject this ad</h3><form id="arj" data-id="${esc(b.dataset.ano)}" style="display:grid;gap:10px"><label>Tell the seller what to change<textarea name="rs" rows="4" maxlength="300" placeholder="e.g. The image is blurry, please upload a clearer photo."></textarea></label><div style="display:flex;gap:8px;justify-content:flex-end"><button type="button" class="btn" id="ec">Cancel</button><button class="btn d">Reject ad</button></div></form>`);return}
 if(b=g("[data-aset]")){const {error}=await sb.from("ads").update({status:b.dataset.to}).eq("id",b.dataset.aset);error?toast(error.message,"error"):(toast("Ad updated"),load());return}
 if(b=g("[data-adel]")){if(!await askConfirm({title:"Delete this ad?",msg:"The ad and its results are removed for good.",ok:"Yes, delete"}))return;const {error}=await sb.from("ads").delete().eq("id",b.dataset.adel);error?toast(error.message,"error"):(toast("Ad deleted"),load(),typeof badges==="function"&&badges())}}
})();