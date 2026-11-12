/* Admin → Blog Management. Needs: blogmd.js, and admin.html globals (sb, $, esc, ic, toast, askConfirm) */
(function(){
const T="blog_posts",CT="blog_categories",CATS=["News","Selling Tips","Buying Guides","Shop Stories","Jobs & Careers","Freelance","Updates"];
const ICN={edit:'<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>',del:'<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>',view:'<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 3h7v7"/><path d="M10 14L21 3"/><path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"/></svg>',up:'<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5"/><path d="M5 12l7-7 7 7"/></svg>',down:'<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 5v14"/><path d="M5 12l7 7 7-7"/></svg>'};
let ROWS=[],Q="",FS="",EDIT=null,CATD=[],CATOK=false,TAB="posts";
const dt=d=>d?new Date(d).toLocaleDateString("en-KE",{day:"numeric",month:"short",year:"numeric"}):"—";

function css(){if(document.getElementById("blgcss"))return;
 document.head.insertAdjacentHTML("beforeend",`<style id="blgcss">
#blgd{border:0;border-radius:16px;padding:0;width:min(940px,calc(100% - 24px));max-width:none;max-height:92vh;overflow-y:auto;background:#fff;color:var(--tx);box-shadow:0 18px 50px rgba(0,0,0,.3)}
#blgd::backdrop{background:rgba(0,0,0,.45)}
#blgd form{display:grid;gap:14px;padding:22px 26px 0}#blgd form>*{min-width:0}
#blgd h3{font-size:21px;margin:0;padding-bottom:12px;border-bottom:1px solid var(--bd)}#blgd label{font-weight:600;color:#4a4f4b}#blgd label .m{font-weight:400}#blgd input:focus,#blgd select:focus,#blgd textarea:focus{outline:0;border-color:var(--g2);box-shadow:0 0 0 3px rgba(46,139,79,.18)}
.bg2{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.bgtb{display:flex;gap:6px;flex-wrap:wrap;align-items:center}
.bgtb button{border:1px solid var(--bd);background:var(--bg);border-radius:8px;padding:5px 10px;font-weight:700;min-width:36px}
.bgtb button:hover{background:var(--ot)}.bgtb .sp{flex:1}
#blgd textarea{min-height:280px;resize:vertical;font-family:ui-monospace,Menlo,Consolas,monospace;font-size:13.5px;line-height:1.55}
.bgpv{border:1px solid var(--bd);border-radius:10px;padding:14px 18px;min-height:280px;max-height:55vh;overflow:auto;line-height:1.7}
.bgpv img{max-width:100%;border-radius:8px}.bgpv blockquote{margin:10px 0;padding:4px 14px;border-left:4px solid var(--a);color:var(--mut)}
.bgcv{display:flex;gap:12px;align-items:center;flex-wrap:wrap}
.bgcv .th{width:120px;height:68px;border-radius:8px;background:var(--bg2);border:1px solid var(--bd);overflow:hidden;display:grid;place-items:center;color:var(--mut);font-size:12px}
.bgcv .th img{width:100%;height:100%;object-fit:cover}
.bgft{display:flex;gap:10px;justify-content:flex-end;align-items:center;flex-wrap:wrap;position:sticky;bottom:0;background:#fff;padding:14px 0;margin-top:4px;border-top:1px solid #eee}
.bgth{width:64px;height:44px;border-radius:8px;object-fit:cover;background:var(--bg2);display:block}
.chk{display:flex;align-items:center;gap:8px;color:var(--tx)}.chk input{width:auto}
.bg3{display:grid;grid-template-columns:1.2fr 1fr 1fr;gap:12px}
.bcadd{display:flex;gap:8px;margin-bottom:14px}.bcadd input{flex:1;min-width:0}
.bcc{background:var(--bg);border-radius:14px;box-shadow:0 1px 3px rgba(20,40,30,.07);padding:14px 16px;margin-bottom:12px}
.bch{display:flex;gap:10px;align-items:center;flex-wrap:wrap}.bch b{font-size:16px}.bch .acts{margin-left:auto}
.bcs{display:flex;gap:8px;flex-wrap:wrap;margin:12px 0}
.bcsub{display:inline-flex;gap:4px;align-items:center;background:var(--bg2);border:1px solid var(--bd);border-radius:999px;padding:3px 6px 3px 12px;font-weight:600}
.bcsub small{color:var(--mut);font-weight:400;margin-right:4px}
.bcsub button,.bch .ib{border:0;background:none;padding:3px 7px;border-radius:6px;color:var(--mut);font-weight:700}
.bcsub button:hover,.bch .ib:hover{background:var(--ot);color:var(--tx)}.bcsub .x:hover,.bch .ib.x:hover{background:#fde8e6;color:var(--r)}
.bcc .bcadd{margin:0}.bcc .bcadd input{height:38px}
.ibn{display:inline-grid;place-items:center;width:34px;height:34px;padding:0;border:1.5px solid var(--g);background:var(--bg);color:var(--g);border-radius:9px;cursor:pointer;text-decoration:none}.ibn:hover{background:var(--g);color:#fff}.ibn.d{border-color:var(--r);color:var(--r)}.ibn.d:hover{background:var(--r);color:#fff}.ibn svg{display:block}
.ib svg{display:block}
.bch .ib{display:inline-grid;place-items:center;width:34px;height:34px;padding:0;border:1.5px solid var(--bd);color:var(--g)}
.bch .ib:hover{border-color:var(--g);background:var(--g);color:#fff}
.bch .ib.x{color:var(--r);border-color:#f3c9c6}.bch .ib.x:hover{background:var(--r);border-color:var(--r);color:#fff}
.bcsub .ib{display:inline-grid;place-items:center;width:26px;height:26px;padding:0}.bcsub .ib svg{width:14px;height:14px}
.bcsub .ib.x{color:var(--r)}
@media(max-width:640px){.bg3{grid-template-columns:1fr}.bcadd{flex-wrap:wrap}.bch .acts{margin-left:0}.bg2{grid-template-columns:1fr}#blgd form{padding:18px 16px 0}#blgd{width:calc(100% - 16px)}}
</style>`)}

async function loadCats(){
 const r=await sb.from(CT).select("id,name,parent_id,sort_order").order("sort_order").order("name");
 CATOK=!r.error;CATD=r.data||[]}

async function load(){
 let cols="id,title,slug,excerpt,category,subcategory,cover_url,status,is_featured,views,published_at,created_at";
 const q=c=>sb.from(T).select(c).order("created_at",{ascending:false}).limit(300);
 let r=await q(cols);
 if(r.error&&/subcategory/i.test(r.error.message||""))r=await q(cols.replace("subcategory,",""));
 await loadCats();
 if(r.error){const miss=/relation|does not exist|schema cache|404/i.test(r.error.message||"");
  $("#blrows").innerHTML=`<tr><td colspan="6" class="empty">${miss?"The blog table does not exist yet. Run <b>blog_setup.sql</b> in Supabase → SQL Editor, then reload.":esc(r.error.message)}</td></tr>`;return}
 ROWS=r.data||[];paint();if(TAB==="cats")drawCats()}

/* ---- categories & subcategories ---- */
const kids=id=>CATD.filter(x=>x.parent_id===id);
const cnt=(n,sub,par)=>ROWS.filter(r=>sub?(r.subcategory===n&&r.category===par):r.category===n).length;
const ib=(act,id,t,l,x)=>`<button type="button" class="ib${x?" x":""}" data-ca="${act}" data-id="${id}" title="${t}" aria-label="${t}">${l}</button>`;
function drawCats(){
 const box=$("#blcc");
 if(!CATOK){box.innerHTML='<div class="empty">The category tables do not exist yet. Run <b>blog_categories.sql</b> in Supabase → SQL Editor, then reload.</div>';return}
 const tops=CATD.filter(x=>!x.parent_id);
 box.innerHTML=`<form class="bcadd" data-par=""><input name="name" required maxlength="60" placeholder="New category, e.g. Agriculture & Food" aria-label="New category name"><button class="btn p" type="submit">Add category</button></form>`+
 (tops.map((c,i)=>{const ks=kids(c.id);return `<section class="bcc"><div class="bch"><b>${esc(c.name)}</b><span class="m">${cnt(c.name)} post${cnt(c.name)===1?"":"s"} · ${ks.length} subcategor${ks.length===1?"y":"ies"}</span>
  <div class="acts">${i?ib("up",c.id,"Move up",ICN.up):""}${i<tops.length-1?ib("down",c.id,"Move down",ICN.down):""}${ib("ren",c.id,"Rename category",ICN.edit)}${ib("del",c.id,"Delete category",ICN.del,1)}</div></div>
  <div class="bcs">${ks.map((k,j)=>`<span class="bcsub">${esc(k.name)}<small>${cnt(k.name,1,c.name)}</small>${j?ib("up",k.id,"Move left","←"):""}${j<ks.length-1?ib("down",k.id,"Move right","→"):""}${ib("ren",k.id,"Rename subcategory",ICN.edit)}${ib("del",k.id,"Delete subcategory",ICN.del,1)}</span>`).join("")||'<span class="m">No subcategories yet.</span>'}</div>
  <form class="bcadd" data-par="${c.id}"><input name="name" required maxlength="60" placeholder="Add a subcategory to ${esc(c.name)}" aria-label="New subcategory name"><button class="btn" type="submit">Add</button></form></section>`}).join("")||'<div class="empty">No categories yet. Add your first one above.</div>')}

const dup=e=>e&&e.code==="23505"?"That name already exists here.":e.message;
async function catAdd(f){
 const name=f.name.value.trim(),par=f.dataset.par||null;if(!name)return;
 const sib=CATD.filter(x=>(x.parent_id||null)===par),so=sib.length?Math.max(...sib.map(x=>x.sort_order||0))+1:1;
 const r=await sb.from(CT).insert({name,parent_id:par,sort_order:so});
 if(r.error)return toast(dup(r.error),"error");toast(par?"Subcategory added":"Category added","ok");await loadCats();drawCats()}
async function catAct(act,id){
 const c=CATD.find(x=>x.id===id);if(!c)return;const par=c.parent_id?CATD.find(x=>x.id===c.parent_id):null;
 if(act==="ren"){const n=prompt("Rename "+(par?"subcategory":"category"),c.name);if(n===null)return;const name=n.trim();if(!name||name===c.name)return;
  const r=await sb.from(CT).update({name}).eq("id",id);if(r.error)return toast(dup(r.error),"error");
  const pu=par?await sb.from(T).update({subcategory:name}).eq("category",par.name).eq("subcategory",c.name):await sb.from(T).update({category:name}).eq("category",c.name);
  if(pu.error)toast("Renamed, but existing posts could not be updated: "+pu.error.message,"error");else toast("Renamed. Posts were updated too.","ok");
  await loadCats();await load();drawCats();return}
 if(act==="del"){const n=cnt(c.name,!!par,par&&par.name);
  if(!await askConfirm({title:"Delete this "+(par?"subcategory":"category")+"?",msg:"“"+c.name+"” will be removed"+(par?"":" together with its subcategories")+". "+(n?n+" post"+(n===1?"":"s")+" will be left "+(par?"without a subcategory.":"uncategorised."):"No posts use it."),ok:"Yes, delete"}))return;
  const r=await sb.from(CT).delete().eq("id",id);if(r.error)return toast(r.error.message,"error");
  if(par)await sb.from(T).update({subcategory:null}).eq("category",par.name).eq("subcategory",c.name);else await sb.from(T).update({category:null,subcategory:null}).eq("category",c.name);
  toast("Deleted","ok");await loadCats();await load();drawCats();return}
 if(act==="up"||act==="down"){const sib=CATD.filter(x=>(x.parent_id||null)===(c.parent_id||null)),i=sib.findIndex(x=>x.id===id),j=act==="up"?i-1:i+1;if(j<0||j>=sib.length)return;
  [sib[i],sib[j]]=[sib[j],sib[i]];
  const rs=await Promise.all(sib.map((x,k)=>x.sort_order===k+1?null:sb.from(CT).update({sort_order:k+1}).eq("id",x.id)));
  const bad=rs.find(x=>x&&x.error);if(bad)return toast(bad.error.message,"error");await loadCats();drawCats()}}
function setTab(t){TAB=t;$("#blpp").hidden=t!=="posts";$("#blcc").hidden=t!=="cats";$("#blnew").hidden=t!=="posts";
 document.querySelectorAll("#bltabs button").forEach(b=>b.classList.toggle("on",b.dataset.tab===t));if(t==="cats")drawCats()}

function paint(){
 const q=Q.toLowerCase(),rows=ROWS.filter(x=>(!FS||x.status===FS)&&(!q||(x.title+" "+(x.category||"")).toLowerCase().includes(q)));
 const pub=ROWS.filter(x=>x.status==="published").length,dr=ROWS.length-pub,vw=ROWS.reduce((a,b)=>a+(b.views||0),0);
 $("#blsum").textContent=`${ROWS.length} posts · ${pub} published · ${dr} drafts · ${vw.toLocaleString("en-KE")} views`;
 $("#blrows").innerHTML=rows.map(r=>`<tr>
  <td>${r.cover_url?`<img class="bgth" alt="" src="${esc(r.cover_url)}">`:'<span class="bgth"></span>'}</td>
  <td><b>${esc(r.title)}</b>${r.is_featured?' <span class="pill">Featured</span>':""}<div class="m">${esc(r.category||"Uncategorised")}${r.subcategory?" › "+esc(r.subcategory):""}</div></td>
  <td><span class="pill ${r.status==="published"?"approved":""}">${r.status==="published"?"Published":"Draft"}</span></td>
  <td class="m">${dt(r.published_at||r.created_at)}</td><td>${r.views||0}</td>
  <td><div class="acts" style="display:flex;gap:6px;flex-wrap:wrap">
   <button class="ibn" data-bl="edit" data-id="${r.id}" title="Edit post" aria-label="Edit post">${ICN.edit}</button>
   <button class="ibn" data-bl="tog" data-id="${r.id}" title="${r.status==="published"?"Unpublish (move to drafts)":"Publish"}" aria-label="${r.status==="published"?"Unpublish":"Publish"}">${r.status==="published"?ICN.down:ICN.up}</button>
   ${r.status==="published"?`<a class="ibn" target="_blank" rel="noopener" href="blog.html?p=${encodeURIComponent(r.slug)}" title="View on website" aria-label="View on website">${ICN.view}</a>`:""}
   <button class="ibn d" data-bl="del" data-id="${r.id}" title="Delete post" aria-label="Delete post">${ICN.del}</button></div></td></tr>`).join("")||`<tr><td colspan="6" class="empty">${ROWS.length?"No posts match.":"No posts yet. Click “+ New post” to write your first one."}</td></tr>`}

function shell(){
 $("#vbl").innerHTML=`<div class="ph" style="display:flex;gap:12px;justify-content:space-between;align-items:flex-start;flex-wrap:wrap"><div><h1>Blog Management</h1><p id="blsum">Loading…</p></div><button class="btn p" id="blnew" type="button">+ New post</button></div>
 <div class="subtabs" id="bltabs"><button type="button" data-tab="posts" class="on">Posts</button><button type="button" data-tab="cats">Categories</button></div>
 <div id="blpp"><div class="tb"><input id="blq" type="search" placeholder="Search posts…" aria-label="Search posts"><select id="blfs" aria-label="Status"><option value="">All statuses</option><option value="published">Published</option><option value="draft">Drafts</option></select></div>
 <div class="wrap"><table><thead><tr><th></th><th>Post</th><th>Status</th><th>Date</th><th>Views</th><th>Actions</th></tr></thead><tbody id="blrows"><tr><td colspan="6" class="empty">Loading…</td></tr></tbody></table></div></div><div id="blcc" hidden></div>`;
 $("#blq").oninput=e=>{Q=e.target.value;paint()};$("#blfs").onchange=e=>{FS=e.target.value;paint()};
 $("#blnew").onclick=()=>edit(null);
 $("#bltabs").onclick=e=>{const b=e.target.closest("[data-tab]");if(b)setTab(b.dataset.tab)};
 $("#blcc").onclick=e=>{const b=e.target.closest("[data-ca]");if(b)catAct(b.dataset.ca,b.dataset.id)};
 $("#blcc").onsubmit=e=>{e.preventDefault();catAdd(e.target);e.target.reset()};
 $("#vbl").onclick=async e=>{const b=e.target.closest("[data-bl]");if(!b)return;const id=b.dataset.id,r=ROWS.find(x=>x.id===id);
  if(b.dataset.bl==="edit")edit(id);
  else if(b.dataset.bl==="tog"&&r){const pub=r.status!=="published";
   const u=await sb.from(T).update({status:pub?"published":"draft",published_at:pub?(r.published_at||new Date().toISOString()):r.published_at,updated_at:new Date().toISOString()}).eq("id",id);
   if(u.error)return toast(u.error.message,"error");toast(pub?"Post published":"Post moved to drafts","ok");load()}
  else if(b.dataset.bl==="del"&&r){if(!await askConfirm({title:"Delete this post?",msg:"“"+r.title+"” will be permanently removed.",ok:"Yes, delete"}))return;
   const d=await sb.from(T).delete().eq("id",id);if(d.error)return toast(d.error.message,"error");toast("Post deleted","ok");load()}}}

async function edit(id){
 css();let p={title:"",slug:"",excerpt:"",content:"",cover_url:"",category:"",author_name:(typeof NAME!=="undefined"&&NAME?NAME:"")||"SOKO Smart Team",status:"draft",is_featured:false};
 if(id){const r=await sb.from(T).select("*").eq("id",id).maybeSingle();if(r.error||!r.data)return toast(r.error?r.error.message:"Post not found","error");p=r.data}
 const tops=CATD.filter(x=>!x.parent_id);
 let catNames=CATOK?tops.map(x=>x.name):CATS;if(p.category&&!catNames.includes(p.category))catNames=[...catNames,p.category];
 const subsFor=n=>{const t=tops.find(x=>x.name===n);let a=t?kids(t.id).map(x=>x.name):[];if(n===p.category&&p.subcategory&&!a.includes(p.subcategory))a=[...a,p.subcategory];return a};
 const opt=(arr,sel,none)=>`<option value="">${none}</option>`+arr.map(n=>`<option ${n===sel?"selected":""}>${esc(n)}</option>`).join("");
 EDIT=id;let d=document.getElementById("blgd");if(!d){d=document.createElement("dialog");d.id="blgd";document.body.appendChild(d)}
 d.innerHTML=`<form id="blf"><h3>${id?"Edit post":"New post"}</h3>
  <label>Title<input name="title" required maxlength="140" value="${esc(p.title)}" placeholder="e.g. 5 tips to sell faster on SOKO Smart"></label>
  <div class="bg3"><label>Web address (slug)<input name="slug" maxlength="90" value="${esc(p.slug)}" placeholder="auto-filled from title"></label>
   <label>Category<select name="category">${opt(catNames,p.category,"— None —")}</select></label>
   <label>Subcategory<select name="subcategory">${opt(subsFor(p.category),p.subcategory,"— None —")}</select></label></div>
  <label>Short summary <span class="m">(shown on cards and in search results)</span><textarea name="excerpt" rows="2" maxlength="260" style="min-height:0;font-family:inherit;font-size:14px">${esc(p.excerpt||"")}</textarea></label>
  <div class="bgcv"><div class="th" id="blth">${p.cover_url?`<img alt="" src="${esc(p.cover_url)}">`:"No cover"}</div>
   <div style="flex:1;min-width:220px;display:grid;gap:6px"><label>Cover image <span class="m">(upload, under 3 MB)</span><input type="file" name="cover" accept="image/*"></label>
   <input name="cover_url" value="${esc(p.cover_url||"")}" placeholder="…or paste an image link" aria-label="Cover image link"></div></div>
  <div><div class="bgtb" style="margin-bottom:6px"><b style="margin-right:6px">Article</b>
   <button type="button" data-f="b" title="Bold"><b>B</b></button><button type="button" data-f="i" title="Italic"><i>I</i></button>
   <button type="button" data-f="h" title="Heading">H</button><button type="button" data-f="l" title="Bullet list">• List</button><button type="button" data-f="q" title="Quote">❝</button>
   <button type="button" data-f="a" title="Link">Link</button><button type="button" data-f="im" title="Insert image">Image</button><input type="file" id="blim" accept="image/*" hidden>
   <span class="sp"></span><button type="button" id="blpv">Preview</button></div>
   <textarea name="content" required placeholder="Write your article here. Leave a blank line between paragraphs.">${esc(p.content||"")}</textarea>
   <div class="bgpv" id="blpvb" hidden></div></div>
  <div class="bg2"><label>Author name<input name="author_name" maxlength="60" value="${esc(p.author_name||"")}"></label>
   <label>Status<select name="status"><option value="draft" ${p.status!=="published"?"selected":""}>Draft (only you can see it)</option><option value="published" ${p.status==="published"?"selected":""}>Published (live on the website)</option></select></label></div>
  <label class="chk"><input type="checkbox" name="is_featured" ${p.is_featured?"checked":""}> Feature this post at the top of the blog page</label>
  <div class="bgft"><button type="button" class="btn" id="blcx">Cancel</button><button class="btn p" id="blsv">${id?"Save changes":"Save post"}</button></div></form>`;
 const f=d.querySelector("#blf"),ta=f.content,ft=f.title;let slugTouched=!!p.slug;
 const syncSub=()=>{const a=subsFor(f.category.value);f.subcategory.innerHTML=opt(a,f.category.value===p.category?p.subcategory:"","— None —");f.subcategory.disabled=!a.length};
 f.category.onchange=syncSub;syncSub();
 f.slug.oninput=()=>slugTouched=true;ft.oninput=()=>{if(!slugTouched&&!id)f.slug.value=blogSlug(ft.value)};
 f.cover_url.oninput=()=>$("#blth").innerHTML=f.cover_url.value.trim()?`<img alt="" src="${esc(f.cover_url.value.trim())}">`:"No cover";
 f.cover.onchange=()=>{const x=f.cover.files[0];if(x)$("#blth").innerHTML=`<img alt="" src="${URL.createObjectURL(x)}">`};
 d.querySelector("#blcx").onclick=()=>d.close();
 const wrap=(a,b)=>{const s=ta.selectionStart,e=ta.selectionEnd,sel=ta.value.slice(s,e)||"text";ta.value=ta.value.slice(0,s)+a+sel+b+ta.value.slice(e);ta.focus();ta.setSelectionRange(s+a.length,s+a.length+sel.length)};
 const pre=x=>{const s=ta.selectionStart,ls=ta.value.lastIndexOf("\n",s-1)+1;ta.value=ta.value.slice(0,ls)+x+ta.value.slice(ls);ta.focus();ta.setSelectionRange(s+x.length,s+x.length)};
 const ins=x=>{const s=ta.selectionStart;ta.value=ta.value.slice(0,s)+x+ta.value.slice(ta.selectionEnd);ta.focus();ta.setSelectionRange(s+x.length,s+x.length)};
 let uid=null;const getUid=async()=>{if(uid)return uid;const {data:{session}}=await sb.auth.getSession();uid=session&&session.user.id;return uid};
 d.querySelector(".bgtb").onclick=async e=>{const b=e.target.closest("[data-f]");if(!b){return}
  const k=b.dataset.f;if(k==="b")wrap("**","**");else if(k==="i")wrap("*","*");else if(k==="h")pre("## ");else if(k==="l")pre("- ");else if(k==="q")pre("> ");
  else if(k==="a"){const u=prompt("Link address (https://…)");if(u)wrap("[","]("+u.trim()+")")}
  else if(k==="im")d.querySelector("#blim").click()};
 d.querySelector("#blim").onchange=async e=>{const x=e.target.files[0];e.target.value="";if(!x)return;
  try{const u=await up(x,await getUid(),"blog-body");ins("\n\n![](" + u + ")\n\n")}catch(err){toast(err.message||String(err),"error")}};
 d.querySelector("#blpv").onclick=e=>{const pv=d.querySelector("#blpvb"),on=pv.hidden;pv.hidden=!on;ta.hidden=on;e.target.textContent=on?"Edit":"Preview";if(on)pv.innerHTML=blogMd(ta.value)||'<span class="m">Nothing to preview yet.</span>'};
 f.onsubmit=async e=>{e.preventDefault();const sv=d.querySelector("#blsv");sv.disabled=true;const old=sv.textContent;sv.textContent="Saving…";
  try{const u=await getUid(),file=f.cover.files[0];let cover=f.cover_url.value.trim()||null;if(file)cover=await up(file,u,"blog");
   const pubNow=f.status.value==="published",row={title:f.title.value.trim(),excerpt:f.excerpt.value.trim()||null,content:ta.value,cover_url:cover,category:f.category.value||null,subcategory:f.subcategory.value||null,author_name:f.author_name.value.trim()||null,status:f.status.value,is_featured:f.is_featured.checked,updated_at:new Date().toISOString()};
   if(!row.title||!row.content.trim())throw new Error("Please add a title and some article text.");
   if(pubNow&&!p.published_at)row.published_at=new Date().toISOString();
   let base=blogSlug(f.slug.value||row.title),res;
   for(let n=0;n<4;n++){row.slug=n?base+"-"+Math.random().toString(36).slice(2,6):base;
    res=EDIT?await sb.from(T).update(row).eq("id",EDIT):await sb.from(T).insert({...row,author_id:u});
    if(!res.error||res.error.code!=="23505")break}
   if(res.error)throw res.error;
   d.close();toast(pubNow?"Post saved and live on the website":"Draft saved","ok");load()}
  catch(err){toast(/subcategory/i.test(err.message||"")?"Run blog_categories.sql in Supabase first. It adds the subcategory column.":(err.message||String(err)),"error")}finally{sv.disabled=false;sv.textContent=old}};
 d.showModal()}

async function up(file,uid,tag){
 if(!/^image\//.test(file.type)||file.size>3e6)throw new Error("The image must be a picture under 3 MB");
 const ext=(file.name.split(".").pop()||"png").toLowerCase().replace(/[^a-z0-9]/g,"")||"png",path=`${uid}/${tag}-${Date.now()}.${ext}`;
 const r=await sb.storage.from("listing-images").upload(path,file,{contentType:file.type});if(r.error)throw r.error;
 return sb.storage.from("listing-images").getPublicUrl(path).data.publicUrl}

window.blogAdmin=function(){TAB="posts";css();shell();load()};
})();