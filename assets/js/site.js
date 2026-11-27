// Header menu: disclosure button toggles #site-nav below 1200px. Nav stays visible without JS.
(function(){var b=document.querySelector(".nav-toggle");if(!b)return;var h=b.closest(".site-header");
function set(o){b.setAttribute("aria-expanded",o?"true":"false");b.setAttribute("aria-label",o?"Close menu":"Open menu");h.classList.toggle("menu-open",o)}
b.addEventListener("click",function(){set(b.getAttribute("aria-expanded")!=="true")});
document.addEventListener("keydown",function(e){if(e.key==="Escape"&&b.getAttribute("aria-expanded")==="true"){set(false);b.focus()}});
document.addEventListener("click",function(e){if(!h.contains(e.target))set(false)});
h.querySelectorAll("#site-nav a,.cta-pill").forEach(function(a){a.addEventListener("click",function(){set(false)})});
window.matchMedia("(min-width:1200px)").addEventListener("change",function(){set(false)})})();
// Hero resort picker (variant): keeps the Go link in sync with the select.
document.querySelectorAll("[data-go]").forEach(function(s){var a=s.parentElement.querySelector("[data-go-link]");s.addEventListener("change",function(){a.href=s.value})});
