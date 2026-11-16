const planetInfo={
Mercury:["Terrestrial","58.6 Earth days","88 Earth days","The smallest planet and the closest to the Sun. Its cratered surface preserves a record of the early solar system."],
Venus:["Terrestrial","243 Earth days","225 Earth days","A rocky world with a dense carbon-dioxide atmosphere. Its runaway greenhouse effect makes it the hottest planet."],
Earth:["Terrestrial","24 hours","365.25 days","Our home is the only world currently known to support life. Liquid water and a protective atmosphere make Earth extraordinary."],
Mars:["Terrestrial","24.6 hours","687 Earth days","A cold desert world with giant volcanoes, ancient river channels, and polar ice."],
Jupiter:["Gas giant","9.9 hours","11.9 Earth years","The largest planet, with powerful storms including the Great Red Spot and a diverse family of moons."],
Saturn:["Gas giant","10.7 hours","29.4 Earth years","Saturn's spectacular rings are made mostly of countless particles of ice and rock."],
Uranus:["Ice giant","17.2 hours","84 Earth years","An ice giant that rotates on its side, giving it extreme seasons. Methane gives it a blue-green colour."],
Neptune:["Ice giant","16.1 hours","165 Earth years","The most distant recognized planet, swept by supersonic winds and powerful storms."]
};
const $=id=>document.getElementById(id);let filter="all";
document.querySelectorAll(".planet-card").forEach(card=>card.addEventListener("click",()=>{
 const n=card.dataset.name,p=planetInfo[n];document.querySelectorAll(".planet-card").forEach(c=>c.classList.toggle("selected",c===card));
 $("planetName").textContent=n;$("planetDescription").textContent=p[3];
 $("facts").innerHTML=[["TYPE",p[0]],["DAY LENGTH",p[1]],["YEAR LENGTH",p[2]]].map(x=>`<div><small>${x[0]}</small><b>${x[1]}</b></div>`).join("");
}));
function applyFilter(){let q=$("search").value.toLowerCase();document.querySelectorAll(".planet-card").forEach(c=>c.hidden=!(c.dataset.name.toLowerCase().includes(q)&&(filter==="all"||c.dataset.type===filter)));}
$("search").addEventListener("input",applyFilter);document.querySelectorAll("#filters button").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll("#filters button").forEach(x=>x.classList.remove("active"));b.classList.add("active");filter=b.dataset.filter;applyFilter();}));
$("menu").addEventListener("click",()=>$("nav").classList.toggle("open"));document.querySelectorAll("nav a").forEach(a=>a.addEventListener("click",()=>$("nav").classList.remove("open")));
const safe=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
async function loadMissions(){try{let r=await fetch("orbit.php?action=missions");if(!r.ok)throw 0;let d=await r.json();$("missionsList").innerHTML=d.missions.map(m=>`<article class="mission-item"><time>${safe(m.year)}</time><div><h4>${safe(m.name)}</h4><p>${safe(m.description)}</p></div><span>${safe(m.status)}</span></article>`).join("");}catch{$("missionsList").textContent="Mission data unavailable. Open this site through XAMPP at localhost."}}
let questions=[],idx=0,points=0,answered=false;
async function loadQuiz(){try{let r=await fetch("orbit.php?action=quiz");if(!r.ok)throw 0;questions=(await r.json()).questions;render();}catch{$("question").textContent="Quiz unavailable. Open the project through your XAMPP localhost server."}}
function render(){answered=false;let q=questions[idx];$("progress").textContent=`QUESTION ${String(idx+1).padStart(2,"0")} / ${String(questions.length).padStart(2,"0")}`;$("score").textContent=`SCORE ${points}`;$("question").textContent=q.question;$("feedback").textContent="";$("next").disabled=true;$("next").textContent=idx===questions.length-1?"Finish challenge →":"Next question →";$("options").innerHTML=q.options.map((o,i)=>`<button class="option" data-i="${i}">${String.fromCharCode(65+i)}. ${safe(o)}</button>`).join("");document.querySelectorAll(".option").forEach(b=>b.addEventListener("click",()=>answer(+b.dataset.i)));}
function answer(n){if(answered)return;answered=true;let q=questions[idx],ok=n===q.answer;if(ok)points++;document.querySelectorAll(".option").forEach((b,i)=>{b.disabled=true;if(i===q.answer)b.classList.add("correct");else if(i===n)b.classList.add("wrong");});$("feedback").textContent=ok?"Correct! Nice work, space explorer.":`Not quite. ${q.explanation}`;$("score").textContent=`SCORE ${points}`;$("next").disabled=false;}
$("next").addEventListener("click",async()=>{if(!answered)return;if(idx<questions.length-1){idx++;render();return;}$("question").textContent=`Mission complete — you scored ${points} out of ${questions.length}!`;$("options").innerHTML='<button class="option" id="restart">↻ Try again</button>';$("feedback").textContent=points===questions.length?"Perfect orbit. You know your cosmos!":"Every great explorer keeps learning.";$("next").disabled=true;try{await fetch("orbit.php?action=score",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({score:points,total:questions.length})});}catch{}$("restart").addEventListener("click",()=>{idx=0;points=0;render();});});
loadMissions();loadQuiz();
