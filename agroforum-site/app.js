(function(){
"use strict";
const CFG=window.CFG||{};
const LANGS=[["kk","Қаз"],["ru","Рус"],["zh","中文"],["uz","Oʻz"],["ky","Кыр"]];
const LNAME={kk:"Қазақша",ru:"Русский",zh:"中文",uz:"Oʻzbekcha",ky:"Кыргызча"};
const FORMLANG={kk:"Қазақша",ru:"Русский",zh:"中文",uz:"Oʻzbekcha",ky:"Кыргызча"};
const PK={participant:["pkn1","5 000"],dinner:["pkn2","30 000"],exhibit:["pkn3","100 000"],speaker:["pkn4","150 000"]};
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
let L="kk",D=window.I18N.kk,okState=null,langTouched=false;

function track(name,data){try{if(window.va)window.va("event",{name:name,data:data||{}})}catch(e){}}

function waLink(extra){
 const n=(CFG.WA||"").replace(/\D/g,"");if(!n)return "";
 return "https://wa.me/"+n+"?text="+encodeURIComponent(D.msg+(extra?"\n"+extra:""));
}

function apply(l){
 L=window.I18N[l]?l:"kk";D=window.I18N[L];
 document.documentElement.lang=L;
 document.title=D.title;
 const md=$('meta[name="description"]');if(md)md.content=D.desc;
 $$("[data-i]").forEach(el=>{let v=D[el.dataset.i];if(v==null)return;
  if(v.indexOf("{n}")>-1){const p=el.dataset.pkg;v=v.replace("{n}",(CFG.LEFT&&CFG.LEFT[p]!=null)?CFG.LEFT[p]:"")}
  el.textContent=v});
 $$("[data-ia]").forEach(el=>{const [a,k]=el.dataset.ia.split(":");if(D[k]!=null)el.setAttribute(a,D[k])});
 $$("[data-ip]").forEach(el=>{if(D[el.dataset.ip]!=null)el.placeholder=D[el.dataset.ip]});
 $$("option[data-pk]").forEach(o=>{const p=PK[o.dataset.pk];o.textContent=D[p[0]]+" · "+p[1]+" ₸"});
 $("#lsel").innerHTML=LANGS.map(([c,t])=>`<button type="button" data-l="${c}" class="${c===L?"on":""}" aria-pressed="${c===L}" lang="${c}">${t}</button>`).join("");
 $("#dlang").innerHTML=LANGS.map(([c])=>`<button type="button" data-l="${c}" class="${c===L?"on":""}" aria-pressed="${c===L}" lang="${c}">${LNAME[c]}</button>`).join("");
 $("#lcur").textContent=LANGS.find(x=>x[0]===L)[1];
 $$("[data-l]").forEach(b=>b.onclick=()=>{apply(b.dataset.l);langTouched=false;try{localStorage.setItem("lang",L)}catch(e){}
  try{const u=new URL(location.href);u.searchParams.set("lang",L);history.replaceState(null,"",u)}catch(e){}track("lang_"+L)});
 const ls=$("#l");if(ls&&!langTouched){[...ls.options].forEach(o=>{if(o.text===FORMLANG[L])ls.value=o.value})}
 const w=$("#wa-link");const wl=waLink();if(w){if(wl){w.href=wl;w.parentElement.hidden=false}else w.parentElement.hidden=true}
 renderOk();
}
let start=new URLSearchParams(location.search).get("lang");
if(!start){try{start=localStorage.getItem("lang")}catch(e){}}
if(!start){const n=(navigator.language||"kk").slice(0,2);start={ru:"ru",zh:"zh",uz:"uz",ky:"ky"}[n]||"kk"}
$("#l").addEventListener("change",()=>{langTouched=true});

// drawer
const body=document.body,bg=$("#burger"),dr=$("#drawer");
function menu(o){body.classList.toggle("open",o);bg.setAttribute("aria-expanded",o);dr.setAttribute("aria-hidden",!o);if(o)$("#close").focus();else if(document.activeElement&&dr.contains(document.activeElement))bg.focus()}
bg.onclick=()=>menu(true);$("#lcur").onclick=()=>menu(true);$("#close").onclick=()=>menu(false);$("#ov").onclick=()=>menu(false);
dr.addEventListener("click",e=>{if(e.target.closest("a"))menu(false)});
addEventListener("keydown",e=>{if(e.key==="Escape")menu(false)});

// countdown
const T=new Date(CFG.START||"2026-12-03T09:30:00+05:00").getTime(),pad=v=>String(v).padStart(2,"0");
function tick(){const d=Math.max(0,T-Date.now())/1000;
 $("#cd-d").textContent=pad(Math.floor(d/86400));$("#cd-h").textContent=pad(Math.floor(d%86400/3600));
 $("#cd-m").textContent=pad(Math.floor(d%3600/60));$("#cd-s").textContent=pad(Math.floor(d%60))}
tick();setInterval(tick,1000);

// nav shadow + sticky CTA
const nav=$("#nav"),st=$("#sticky");let regVisible=false;
function onS(){nav.classList.toggle("sc",scrollY>20);st.classList.toggle("show",scrollY>innerHeight*.7&&!regVisible)}
addEventListener("scroll",onS,{passive:true});onS();
if("IntersectionObserver" in window){
 new IntersectionObserver(es=>{regVisible=es[0].isIntersecting;onS()},{threshold:.05}).observe($("#reg"));
 const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;const el=e.target;el.classList.add("in");
  if(el.dataset.n&&!el.dataset.pkg){const n=+el.dataset.n,t0=performance.now();const step=t=>{const k=Math.min(1,(t-t0)/1200);el.textContent=Math.round(n*(1-Math.pow(1-k,3)));if(k<1)requestAnimationFrame(step)};requestAnimationFrame(step)}
  io.unobserve(el)}),{threshold:.1});
 $$(".rv,[data-n]").forEach(el=>{if(el.dataset.n&&!el.dataset.pkg)el.textContent="0";io.observe(el)});
}else{$$(".rv").forEach(el=>el.classList.add("in"))}

// organiser links: URLs come from CFG.ORG (kaznaru is also hard-coded in the HTML)
$$("a[data-org]").forEach(a=>{const u=CFG.ORG&&CFG.ORG[a.dataset.org];if(u&&!a.getAttribute("href"))a.setAttribute("href",u)});
document.addEventListener("click",e=>{const o=e.target.closest("a[data-org][href]");if(o)track("org_"+o.dataset.org)});

// package buttons preselect
document.addEventListener("click",e=>{
 const a=e.target.closest("[data-pkg]");
 if(a&&a.tagName==="A"){const v=a.dataset.pkg,s=$("#pk");if(s&&PK[v])s.value=v}
 const t=e.target.closest("[data-track]");if(t)track(t.dataset.track,t.dataset.pkg?{package:t.dataset.pkg}:{});
});
$("#pk").addEventListener("change",e=>track("package_select",{package:e.target.value}));

// videos: one at a time
const vids=$$("video[data-v]");
function stopAll(ex){vids.forEach(v=>{if(v!==ex&&!v.paused)v.pause()})}
vids.forEach(v=>{
 v.addEventListener("play",()=>{stopAll(v);v.closest(".vbox").classList.add("playing")});
 v.addEventListener("pause",()=>v.closest(".vbox").classList.remove("playing"));
 v.addEventListener("ended",()=>v.closest(".vbox").classList.remove("playing"));
});
// tap or click on the video itself starts it (no play button); controls appear after the first start
vids.forEach(v=>{
 v.addEventListener("click",()=>{
  if(v.controls)return;
  stopAll(v);v.controls=true;
  const p=v.play();if(p&&p.catch)p.catch(()=>{});
  track("video_play",{video:v.querySelector("source").getAttribute("src")});
 });
});

// form
const form=$("#form");
function renderOk(){
 if(!okState)return;
 $("#ok-p").textContent=okState.pay?D.ok_p:D.ok_np;
 const pay=$("#ok-pay");pay.hidden=!okState.pay;if(okState.pay)pay.href=okState.pay;
 const wa=$("#ok-wa"),wl=waLink(okState.summary);wa.hidden=!wl;if(wl)wa.href=wl;
}
form.addEventListener("submit",ev=>{
 ev.preventDefault();
 if(form.elements.website.value)return;
 let ok=true,first=null;
 const chk=(id,c)=>{const f=document.getElementById(id).closest(".f");f.classList.toggle("bad",!c);if(!c){ok=false;if(!first)first=document.getElementById(id)}};
 const v=id=>document.getElementById(id).value.trim();
 chk("n",v("n").length>2);chk("p",v("p").replace(/\D/g,"").length>=10);chk("r",!!v("r"));chk("s",!!v("s"));chk("pk",!!v("pk"));
 if(!ok){first.focus();return}
 const kkText=id=>{const s=document.getElementById(id),o=s.options[s.selectedIndex];return o.dataset.kk||o.text};
 const pkg=v("pk"),link=(CFG.KASPI&&CFG.KASPI[pkg])||"";
 const payload={time:new Date().toISOString(),name:v("n"),phone:v("p"),region:kkText("r"),industry:kkText("s"),package:kkText("pk"),translation:v("l"),site_lang:L};
 if(link)window.open(link,"_blank","noopener");
 if(CFG.SHEET_URL){try{fetch(CFG.SHEET_URL,{method:"POST",mode:"no-cors",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify(payload)}).catch(()=>{})}catch(e){}}
 track("register_submit",{package:pkg});
 okState={pay:link,summary:payload.name+", "+payload.phone+", "+payload.package};
 $("#fbody").hidden=true;$("#ok").hidden=false;renderOk();
 $("#ok").scrollIntoView({block:"center"});
});

apply(start);
})();
