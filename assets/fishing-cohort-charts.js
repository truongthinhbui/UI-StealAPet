(function(){
  const ns='http://www.w3.org/2000/svg',n=x=>x.toLocaleString('vi-VN',{maximumFractionDigits:2});
  const make=(tag,attrs={},text)=>{const el=document.createElementNS(ns,tag);for(const [k,v] of Object.entries(attrs))el.setAttribute(k,v);if(text!==undefined)el.textContent=text;return el;};
  window.FishingCohortCharts=function(host,r){
    const grid=document.createElement('div');grid.className='cohortChartGrid';host.append(grid);
    const card=title=>{const box=document.createElement('section');box.className='cohortChartCard';const h=document.createElement('h4');h.textContent=title;box.append(h);grid.append(box);return box;};
    const box=card('Người có Apex + Gen theo ngày (%)'),svg=make('svg',{viewBox:'0 0 620 310',role:'img','aria-label':'Tỷ lệ người có Apex + Gen theo ngày, so với mục tiêu 75 đến 80 phần trăm'}),x=d=>45+d/Math.max(1,r.settings.days)*550,y=p=>265-p*235;
    svg.append(make('rect',{x:45,y:y(.8),width:550,height:y(.75)-y(.8),fill:'#ffc83d',opacity:.25}));
    for(const p of [0,.25,.5,.75,1]){svg.append(make('line',{x1:45,x2:595,y1:y(p),y2:y(p),stroke:'#365366'}),make('text',{x:2,y:y(p)+4,fill:'#bcd1df','font-size':12},p*100+'%'));}
    const series=[{name:'Tất cả',color:'#58dbac',values:r.daily.map(d=>d.playersApexGen/r.completed)},...r.groups.map((g,i)=>({name:g.name,color:['#66baff','#ffcc55','#d296ff'][i],values:r.daily.map(d=>(d.groups?.[g.id]||0)/(g.players||1))}))];
    for(const s of series){const points=[[0,0],...s.values.map((v,i)=>[i+1,v])];svg.append(make('polyline',{points:points.map(([d,p])=>x(d)+','+y(p)).join(' '),fill:'none',stroke:s.color,'stroke-width':2.5}));for(const [d,p] of points.slice(1)){const dot=make('circle',{cx:x(d),cy:y(p),r:3.5,fill:s.color});dot.append(make('title',{},`${s.name} · ngày ${d}: ${n(p*100)}%`));svg.append(dot);}}
    for(let d=0;d<=r.settings.days;d+=Math.max(1,Math.ceil(r.settings.days/10)))svg.append(make('text',{x:x(d),y:290,fill:'#bcd1df','font-size':12,'text-anchor':'middle'},'N'+d));box.append(svg);const legend=document.createElement('p');legend.className='cohortLegend';for(const s of series){const item=document.createElement('span');item.style.color=s.color;item.textContent='● '+s.name;legend.append(item);}box.append(legend);
    function bars(title,rows){const box=card(title),max=Math.max(1,...rows.map(x=>x.value));for(const row of rows){const line=document.createElement('div');line.className='cohortDistribution';const label=document.createElement('span');label.textContent=row.label;const track=document.createElement('div'),bar=document.createElement('i');bar.style.width=row.value/max*100+'%';bar.style.background=row.color||'#57c7a6';track.append(bar);const count=document.createElement('strong');count.textContent=n(row.value);line.append(label,track,count);box.append(line);}}
    const colors={COMMON:'#57d398',RARE:'#54acff',EPIC:'#b07aff',LEGENDARY:'#ffd046',MYTHIC:'#ff6565',APEX:'#40e3ce'};
    bars('Pet xuất hiện theo rarity',Object.keys(colors).map(rarity=>({label:rarity,value:Object.values(r.petCounts).filter(p=>p.rarity===rarity).reduce((s,p)=>s+p.count,0),color:colors[rarity]})));
    bars('Người gặp Apex + từng Gen',Object.values(r.genCounts).sort((a,b)=>b.apexPlayers-a.apexPlayers).map(g=>({label:g.name,value:g.apexPlayers})));
    bars('10 tổ hợp pet + Gen xuất hiện nhiều nhất',Object.values(r.combos).filter(c=>c.gen!=='Không Gen').sort((a,b)=>b.count-a.count).slice(0,10).map(c=>({label:c.pet+' + '+c.gen,value:c.count,color:colors[c.rarity]})));
  };
})();
