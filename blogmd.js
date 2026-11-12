/* tiny, safe Markdown renderer for blog posts (escapes everything first) */
(function(){
const E=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const U=u=>/^(https?:\/\/|\/|[a-z0-9_\-./?=&%#;]+$)/i.test(u)?u:"#";
const inl=t=>t
 .replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g,(m,a,u)=>`<img alt="${a}" src="${U(u)}" loading="lazy">`)
 .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g,(m,a,u)=>`<a href="${U(u)}" target="_blank" rel="noopener noreferrer">${a}</a>`)
 .replace(/\*\*([^*]+)\*\*/g,"<strong>$1</strong>")
 .replace(/(^|[^*])\*([^*\n]+)\*/g,"$1<em>$2</em>");
window.blogMd=function(src){
 const L=E(src).replace(/\r/g,"").split("\n");let o="",list=null,p=[];
 const fp=()=>{if(p.length){o+="<p>"+inl(p.join("<br>"))+"</p>";p=[]}},fl=()=>{if(list){o+="</"+list+">";list=null}};
 for(const l of L){let m;
  if(!l.trim()){fp();fl();continue}
  if(m=l.match(/^(#{1,3})\s+(.*)$/)){fp();fl();const n=m[1].length+1;o+=`<h${n}>${inl(m[2])}</h${n}>`}
  else if(m=l.match(/^\s*[-*]\s+(.*)$/)){fp();if(list!=="ul"){fl();o+="<ul>";list="ul"}o+="<li>"+inl(m[1])+"</li>"}
  else if(m=l.match(/^\s*\d+\.\s+(.*)$/)){fp();if(list!=="ol"){fl();o+="<ol>";list="ol"}o+="<li>"+inl(m[1])+"</li>"}
  else if(m=l.match(/^&gt;\s?(.*)$/)){fp();fl();o+="<blockquote>"+inl(m[1])+"</blockquote>"}
  else{fl();p.push(l)}}
 fp();fl();return o};
window.blogRead=s=>Math.max(1,Math.round(String(s||"").trim().split(/\s+/).length/200));
window.blogSlug=s=>String(s||"").toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,80)||"post";
})();