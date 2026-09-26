document.body.style.overflow='hidden';
  const intro=document.getElementById('intro');
  setTimeout(()=>{intro.classList.add('hide');document.body.style.overflow='';},1500);

  // Small amount of ambient motion; animations use transform/opacity for smoother scrolling.
  const driftLayer=document.getElementById('drift');
  if(driftLayer && !matchMedia('(prefers-reduced-motion: reduce)').matches){
    for(let i=0;i<6;i++){
      const b=document.createElement('div'); b.className='drift-block';
      b.style.left=(Math.random()*100)+'vw'; b.style.animationDuration=(18+Math.random()*10)+'s';
      b.style.animationDelay=(-Math.random()*20)+'s'; driftLayer.appendChild(b);
    }
  }

  const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in-view');io.unobserve(e.target)}}),{rootMargin:'0px 0px -10% 0px',threshold:.08});
  document.querySelectorAll('.feature-row,.step').forEach(el=>io.observe(el));

  const progress=document.createElement('div');progress.id='progress';document.body.appendChild(progress);
  let ticking=false;
  function updateProgress(){
    const max=document.documentElement.scrollHeight-innerHeight;
    progress.style.width=(max>0?(scrollY/max)*100:0)+'%'; ticking=false;
  }
  addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(updateProgress);ticking=true}},{passive:true}); updateProgress();

  function copyIP(text){
    navigator.clipboard?.writeText(text).catch(()=>{});
    document.querySelectorAll('.btn').forEach(btn=>{
      if(btn.innerText.includes(text.split(':')[0])){
        const old=btn.innerHTML;btn.innerHTML='<strong>Copied ✓</strong>';
        setTimeout(()=>btn.innerHTML=old,1100);
      }
    });
  }
