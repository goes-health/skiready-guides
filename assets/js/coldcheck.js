// Wind chill quick check. NWS formula (weather.gov/safety/cold-wind-chill-chart): valid for T<=50°F and V>3 mph.
// Bands follow AAP (avoid outdoor play below -15°F) and Canadian Paediatric Society (cut back at 5°F or colder).
(function(){
  function wc(t,v){if(t>50||v<=3)return t;var p=Math.pow(v,0.16);return 35.74+0.6215*t-35.75*p+0.4275*t*p}
  function band(x){
    if(x<-15)return["band-stop","Below -15°F: pediatric guidance says skip outdoor play","AAP: exposed skin begins to freeze within minutes. Make it an indoor day for young kids."];
    if(x<=5)return["band-care","5°F to -15°F: shorter day, faces covered","Canadian Paediatric Society: cut back time outside at 5°F or colder. Plan frequent lodge breaks."];
    return["band-ok","Above 5°F: normal winter day","Layers, mittens, covered cheeks on the lift, and regular warm-up breaks."]}
  function render(el,t,v){var x=Math.round(wc(t,v)),b=band(x);
    el.querySelector(".big").innerHTML=x+"<small>°F</small>";var bd=el.querySelector(".band");bd.className="band "+b[0];bd.textContent=b[1];el.querySelector(".why").textContent=b[2]}
  document.querySelectorAll("[data-coldcheck]").forEach(function(box){
    var t=box.querySelector("[name=t]"),v=box.querySelector("[name=v]"),out=box.querySelector(".readout");
    function go(){var tv=parseFloat(t.value),vv=parseFloat(v.value);if(isNaN(tv)||isNaN(vv))return;render(out,tv,vv)}
    t.addEventListener("input",go);v.addEventListener("input",go);go()});
  // Resort picker: shows the NWS wind chill snapshot baked in at build time, then refreshes the hourly temp/wind live.
  document.querySelectorAll("[data-resort-check]").forEach(function(box){
    var sel=box.querySelector("select"),data=JSON.parse(box.querySelector("script[type='application/json']").textContent),out=box.querySelector(".readout"),st=box.querySelector(".status"),link=box.querySelector(".rlink");
    function show(){var r=data[sel.value];if(!r)return;
      out.querySelector(".big").innerHTML=(r.wc==null?"–":r.wc)+"<small>°F</small>";
      var b=band(r.wc==null?99:r.wc),bd=out.querySelector(".band");bd.className="band "+b[0];bd.textContent=r.wc==null?"No NWS wind chill in the next 48 hours":b[1];
      out.querySelector(".why").textContent="Lowest NWS wind chill forecast for "+r.name+" (base area, "+r.elev+" ft) in the next 48 hours. Now: "+r.now+".";
      st.textContent="National Weather Service data fetched "+r.fetched+"."; st.classList.remove("live");
      link.href=r.url;link.textContent=r.name+" family cold-safety page";
      if(!window.fetch||!r.hourly)return;
      fetch(r.hourly,{headers:{Accept:"application/geo+json"}}).then(function(x){if(!x.ok)throw 0;return x.json()}).then(function(d){
        var p=d.properties.periods[0];if(sel.value!==r.slug)return;var v=parseFloat(p.windSpeed)||0;var now=Math.round(wc(p.temperature,v));
        out.querySelector(".why").textContent="Lowest NWS wind chill forecast for "+r.name+" (base area, "+r.elev+" ft) in the next 48 hours. Live now: "+p.temperature+"°F, wind "+p.windSpeed+" ("+p.shortForecast+"), feels like about "+now+"°F.";
        st.textContent="Live from the National Weather Service.";st.classList.add("live")}).catch(function(){})}
    sel.addEventListener("change",show);show()});
})();
