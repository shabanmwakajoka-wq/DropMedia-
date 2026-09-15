const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
let downloads=JSON.parse(sessionStorage.getItem("md_downloads")||"[]");
let history=JSON.parse(sessionStorage.getItem("md_history")||"[]");
let saveHistory=sessionStorage.getItem("md_save")!=="false";

$("#menuBtn").onclick=()=>$("#side").classList.toggle("open");
$$(".nav").forEach(b=>b.onclick=()=>showPage(b.dataset.page));
function showPage(id){
  $$(".nav").forEach(b=>b.classList.toggle("active",b.dataset.page===id));
  $$(".page").forEach(p=>p.classList.toggle("active",p.id===id));
  $("#side").classList.remove("open"); render();
}
window.addEventListener("hashchange",()=>{const id=location.hash.slice(1);if(["home","downloads","history","premium","settings","privacy","terms"].includes(id))showPage(id)});
function status(t,err=false){const x=$("#status");x.textContent=t;x.classList.remove("hidden");x.style.borderColor=err?"var(--danger)":"var(--line)"}
function ext(url){try{const p=new URL(url).pathname.split("/").pop();const m=p.match(/\.([a-z0-9]{2,5})$/i);return m?m[1].toLowerCase():"bin"}catch{return"bin"}}
function safe(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
function size(n){if(!n)return"0 B";let i=Math.floor(Math.log(n)/Math.log(1024));return (n/1024**i).toFixed(i?1:0)+" "+["B","KB","MB","GB"][i]}
function addHistory(url,ok,msg){if(!saveHistory)return;history.unshift({url,ok,msg,time:new Date().toLocaleString()});history=history.slice(0,50);sessionStorage.setItem("md_history",JSON.stringify(history))}
async function doDownload(){
  const url=$("#url").value.trim(), type=$("#type").value;
  if(!url){status("Paste a direct media URL first.",true);return}
  let u;try{u=new URL(url)}catch{status("Please enter a valid URL.",true);return}
  if(!/^https?:$/.test(u.protocol)){status("Only HTTP/HTTPS URLs are supported.",true);return}
  status("Preparing download…");
  try{
    const r=await fetch(url,{mode:"cors"});if(!r.ok)throw Error("HTTP "+r.status);
    const blob=await r.blob(), e=ext(url);
    const map={image:"jpg",video:"mp4",audio:"mp3"};const out=(type==="auto"||type==="file"?e:map[type]||e);
    const name="mediadrop_"+Date.now()+"."+out, href=URL.createObjectURL(blob), a=document.createElement("a");
    a.href=href;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(href),1000);
    downloads.unshift({name,url,size:size(blob.size),time:new Date().toLocaleString()});downloads=downloads.slice(0,30);
    sessionStorage.setItem("md_downloads",JSON.stringify(downloads));addHistory(url,true,"Downloaded");status("Download started: "+name);$("#url").value="";render();
  }catch(e){addHistory(url,false,"Blocked/failed");status("The download failed. The source server may block browser requests (CORS) or require access. Use a direct URL from a server that permits browser downloads.",true);render()}
}
$("#download").onclick=doDownload;$("#url").onkeydown=e=>{if(e.key==="Enter")doDownload()};
function render(){
  $("#downloadCount").textContent=downloads.length;
  const dl=$("#downloadsList"),hi=$("#historyList");
  dl.className="list"+(downloads.length?"":" empty");dl.innerHTML=downloads.length?downloads.map(x=>`<div class="item"><div><div class="item-name">${safe(x.name)}</div><div class="item-url">${safe(x.url)}</div></div><small>${x.size} · ${x.time}</small></div>`).join(""):"No downloads yet.";
  hi.className="list"+(history.length?"":" empty");hi.innerHTML=history.length?history.map(x=>`<div class="item"><div><div class="item-name">${x.ok?"✓":"✕"} ${safe(x.msg)}</div><div class="item-url">${safe(x.url)}</div></div><small>${x.time}</small></div>`).join(""):"No history yet.";
}
function setDark(v){document.body.classList.toggle("light",!v);$("#dark").checked=v;sessionStorage.setItem("md_dark",v)}
$("#themeBtn").onclick=()=>setDark(document.body.classList.contains("light"));
$("#dark").onchange=e=>setDark(e.target.checked);$("#saveHistory").checked=saveHistory;
$("#saveHistory").onchange=e=>{saveHistory=e.target.checked;sessionStorage.setItem("md_save",saveHistory)};
$("#clear").onclick=()=>{downloads=[];history=[];sessionStorage.removeItem("md_downloads");sessionStorage.removeItem("md_history");render();status("Session data cleared.")};
$("#upgradeBtn").onclick=()=>showPage("premium");$("#payBtn").onclick=()=>alert("Payment integration placeholder. Connect your own verified payment provider before accepting money.");
setDark(sessionStorage.getItem("md_dark")!=="false");render();
