(function(){
  const fishing=document.getElementById('tab-fishing'),lab=document.getElementById('tab-fishing-lab'),mainButton=document.querySelector('[data-tab="tab-fishing-lab"]');
  mainButton.closest('li').remove();
  const play=document.createElement('section');play.id='fishing-play-view';play.setAttribute('role','tabpanel');
  while(fishing.firstChild)play.appendChild(fishing.firstChild);
  lab.classList.remove('prototypePane');lab.hidden=true;
  const nav=document.createElement('div');nav.className='fishingSubtabs';nav.setAttribute('role','tablist');nav.setAttribute('aria-label','Fishing');
  const views={play,simulation:lab};
  for(const [key,title] of [['play','Chơi thử'],['simulation','Mô phỏng 7 ngày']]){const button=document.createElement('button');button.type='button';button.textContent=title;button.dataset.fishingView=key;button.id='fishing-subtab-'+key;button.setAttribute('role','tab');button.setAttribute('aria-controls',views[key].id);views[key].setAttribute('aria-labelledby',button.id);nav.append(button);}
  function select(key){for(const [id,view] of Object.entries(views)){view.hidden=id!==key;const b=nav.querySelector('[data-fishing-view="'+id+'"]');b.setAttribute('aria-selected',String(id===key));b.tabIndex=id===key?0:-1;}if(key==='play')window.dispatchEvent(new Event('resize'));}
  nav.addEventListener('click',event=>{const b=event.target.closest('button');if(b)select(b.dataset.fishingView);});
  nav.addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();const key=event.key==='Home'?'play':event.key==='End'?'simulation':document.activeElement.dataset.fishingView==='play'?'simulation':'play';select(key);nav.querySelector('[data-fishing-view="'+key+'"]').focus();});
  fishing.append(nav,play,lab);select('play');
})();
