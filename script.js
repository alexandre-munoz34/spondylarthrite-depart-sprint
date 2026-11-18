const toggle=document.getElementById('menuToggle');
const sidebar=document.getElementById('sidebar');
const scrim=document.getElementById('scrim');
const links=document.querySelectorAll('.nav-link');
function menu(open){
  sidebar.classList.toggle('open',open);
  scrim.classList.toggle('show',open);
  toggle.setAttribute('aria-expanded',String(open));
  toggle.setAttribute('aria-label',open?'Fermer le menu':'Ouvrir le menu');
}
toggle.addEventListener('click',()=>menu(toggle.getAttribute('aria-expanded')!=='true'));
scrim.addEventListener('click',()=>menu(false));
links.forEach(link=>link.addEventListener('click',()=>menu(false)));
const sections=document.querySelectorAll('main section[id]');
const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(!entry.isIntersecting)return;
    links.forEach(link=>link.classList.toggle('active',link.getAttribute('href')==='#'+entry.target.id));
  });
},{rootMargin:'-25% 0px -65% 0px'});
sections.forEach(section=>observer.observe(section));
