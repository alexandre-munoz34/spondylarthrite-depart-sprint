document.documentElement.classList.add('js');
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
const menuToggle=$('#menuToggle'),sidebar=$('#sidebar'),scrim=$('#scrim'),topbar=$('.topbar');

/* ---------- Menu latéral ---------- */
function setMenu(open){sidebar.classList.toggle('open',open);scrim.classList.toggle('show',open);menuToggle.setAttribute('aria-expanded',String(open))}
const closeMenu=()=>setMenu(false);
menuToggle.addEventListener('click',()=>setMenu(!sidebar.classList.contains('open')));
scrim.addEventListener('click',closeMenu);
$$('.nav-link').forEach(l=>l.addEventListener('click',closeMenu));

/* ---------- Accordéons fluides (une seule sous-rubrique ouverte) ---------- */
const EASE='cubic-bezier(.22,1,.36,1)';
function animatePanel(panel,opening){
  panel._anim&&panel._anim.cancel();
  if(reduce){panel.hidden=!opening;return}
  panel.style.overflow='hidden';
  if(opening)panel.hidden=false;
  const h=panel.scrollHeight+'px';
  const closed={height:'0px',paddingBottom:'0px',opacity:0},open={height:h,paddingBottom:getComputedStyle(panel).paddingBottom,opacity:1};
  const a=panel._anim=panel.animate(opening?[closed,open]:[open,closed],{duration:opening?650:450,easing:EASE});
  a.onfinish=()=>{panel.style.overflow='';if(!opening)panel.hidden=true;panel._anim=null};
}
function setItem(item,open){
  item.classList.toggle('is-open',open);
  $('.accordion-trigger',item).setAttribute('aria-expanded',String(open));
  animatePanel($('.accordion-panel',item),open);
}
$$('.accordion-trigger').forEach(t=>t.addEventListener('click',()=>{
  const item=t.closest('.accordion-item'),was=item.classList.contains('is-open');
  $$('.accordion-item.is-open').forEach(o=>setItem(o,false));
  if(!was){setItem(item,true);setTimeout(()=>{const r=item.getBoundingClientRect();if(r.top<90||r.top>innerHeight*.55)scrollTo({top:scrollY+r.top-100,behavior:reduce?'auto':'smooth'})},120)}
}));

/* ---------- Révélations au scroll avec cascade ---------- */
const groups=['.overview-grid>*','.accordion-list>*','.hero-art','.question-inner','.question-index','.section-head','.section-top','.section-lead','footer'];
const seen=new Set();
groups.forEach(sel=>$$(sel).forEach((el,i)=>{if(seen.has(el)||el.closest('.hero-art')&&sel!=='.hero-art')return;seen.add(el);if(sel==='.hero-art')return;el.classList.add('reveal');el.style.setProperty('--d',(sel.includes('>*')?i%4*90:0)+'ms')}));
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12,rootMargin:'0px 0px -6% 0px'});
$$('.reveal').forEach(el=>io.observe(el));

/* ---------- Barre de progression, topbar, parallaxe ---------- */
const bar=document.createElement('div');bar.className='progress';document.body.appendChild(bar);
const heroImg=$('.hero-image img');let ticking=false;
function onScroll(){
  const max=document.documentElement.scrollHeight-innerHeight;
  bar.style.transform=`scaleX(${max>0?scrollY/max:0})`;
  topbar.classList.toggle('scrolled',scrollY>20);
  if(heroImg&&!reduce&&scrollY<1000)heroImg.style.transform=`scale(1.1) translateY(${scrollY*.07}px)`;
  ticking=false;
}
addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(onScroll)}},{passive:true});onScroll();

/* ---------- Rubrique active dans le menu ---------- */
const links=$$('.nav-link'),ids=links.map(l=>l.getAttribute('href').slice(1));
const spy=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){links.forEach(l=>l.classList.toggle('active',l.getAttribute('href')==='#'+e.target.id))}}),{rootMargin:'-45% 0px -50% 0px'});
ids.forEach(id=>{const s=document.getElementById(id);s&&spy.observe(s)});

/* ---------- Zoom plein écran sur les images ---------- */
const lb=document.createElement('div');lb.className='lightbox';lb.innerHTML='<figure><img alt=""><figcaption></figcaption></figure>';document.body.appendChild(lb);
const lbImg=$('img',lb),lbCap=$('figcaption',lb);
function closeLb(){lb.classList.remove('show')}
document.addEventListener('click',e=>{
  const img=e.target.closest('.accordion-panel img');
  if(img){lbImg.src=img.src;lbImg.alt=img.alt;const c=img.closest('figure')?.querySelector('figcaption');lbCap.textContent=c?c.textContent:img.alt;lb.classList.add('show')}
});
lb.addEventListener('click',closeLb);
addEventListener('keydown',e=>{if(e.key==='Escape'){closeLb();closeMenu()}});
