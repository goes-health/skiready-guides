// Replaces the build-time NWS snapshot with the live forecast + alerts when online (api.weather.gov, no key).
(function(){function esc(s){return String(s==null?"":s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
document.querySelectorAll(".forecast[data-forecast-url]").forEach(function(box){var u=box.getAttribute("data-forecast-url"),st=box.querySelector(".status");if(!u||!window.fetch)return;
fetch(u,{headers:{Accept:"application/geo+json"}}).then(function(r){if(!r.ok)throw 0;return r.json()}).then(function(d){
var rows=d.properties.periods.slice(0,8).map(function(p){return'<tr><td data-label="Period">'+esc(p.name)+'</td><td data-label="Temp">'+p.temperature+"°"+esc(p.temperatureUnit)+'</td><td data-label="Forecast">'+esc(p.shortForecast)+'</td><td data-label="Wind">'+esc(p.windSpeed)+" "+esc(p.windDirection)+"</td></tr>"}).join("");
box.querySelector("tbody").innerHTML=rows;var t=d.properties.generatedAt||d.properties.updateTime;st.textContent="Live from the National Weather Service"+(t?" (issued "+new Date(t).toLocaleString()+")":"")+".";st.classList.add("live")}).catch(function(){});
var la=box.getAttribute("data-lat"),lo=box.getAttribute("data-lon");
fetch("https://api.weather.gov/alerts/active?point="+la+","+lo,{headers:{Accept:"application/geo+json"}}).then(function(r){if(!r.ok)throw 0;return r.json()}).then(function(d){
var el=box.querySelector(".wx-alerts");var f=d.features||[];el.innerHTML=f.length?f.map(function(a){return'<div class="alert-box"><strong>'+esc(a.properties.event)+"</strong>: "+esc(a.properties.headline)+"</div>"}).join(""):'<div class="ok-box">No active National Weather Service alerts for this point right now.</div>'}).catch(function(){})})})();
