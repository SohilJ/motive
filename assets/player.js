const NS='http://www.w3.org/2000/svg',$=s=>document.querySelector(s);
const DURATION=FIGURE.duration||8,TAU=Math.PI*2,clamp=x=>Math.max(0,Math.min(1,x)),mix=(a,b,t)=>a+(b-a)*t;
/*HELPERS*/
/*VECTOR_CONTOUR*/
const params=new URLSearchParams(location.search),reduced=matchMedia('(prefers-reduced-motion: reduce)');
const finishes={
 drawing:{name:'Construction',ground:'#f2f3f0',fill:'#b5b7b6',edge:'#5d6263',grid:'#a6afac',raw:'#485356'},
 flat:{name:'Graphite',ground:'#f2f3f0',fill:'#626968',edge:'#626968',grid:'#a6afac',raw:'#485356'},
 light:{name:'Light',ground:'#ffffff',fill:'#ffffff',edge:'#a4a4ac',lo:'#e0e0e4',hi:'#232327',grid:'#e0e0e4'},
 dark:{name:'Dark',ground:'#08090a',fill:'#08090a',edge:'#5b5d64',lo:'#29292d',hi:'#d0d6e0',grid:'#29292d'}
};
let finish=Object.hasOwn(finishes,params.get('finish'))?params.get('finish'):(FIGURE.finish||'drawing');
let seconds=params.has('pose')?clamp(+params.get('pose')||0)*DURATION:(FIGURE.pose??DURATION*.54);
let intensity=.6,speed=1,playing=!reduced.matches&&!params.has('paused'),previous=0,raf=0,lastDraw=-1;
const guideChoices={drawing:true,flat:false,light:false,dark:false};
let emphasis=true;
const svg=$('#art'),defs=node('defs',{},svg);
// Graphite keeps its original filled filter; Construction has a single vector edge.
function makeFilter(id){
 const f=node('filter',{id,filterUnits:'userSpaceOnUse',x:-65,y:-65,width:130,height:130,'color-interpolation-filters':'sRGB'},defs);
 node('feGaussianBlur',{stdDeviation:2.8,result:'blur'},f);
 node('feColorMatrix',{in:'blur',type:'matrix',values:'1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 22 -8.3',result:'goo'},f);
 const fill=node('feFlood',{'flood-color':'#b5b7b6',result:'paper'},f);
 node('feComposite',{in:'paper',in2:'goo',operator:'in',result:'body'},f);
 node('feMorphology',{in:'goo',operator:'erode',radius:.4,result:'inset'},f);
 node('feComposite',{in:'goo',in2:'inset',operator:'out',result:'edge'},f);
 const edge=node('feFlood',{'flood-color':'#5d6263',result:'edgeColor'},f);
 node('feComposite',{in:'edgeColor',in2:'edge',operator:'in',result:'outline'},f);
 const merge=node('feMerge',{},f);for(const n of ['body','outline'])node('feMergeNode',{in:n},merge);
 return{f,fill,edge};
}
const base=makeFilter('body-filter');
const grid=node('g',{class:'grid-guides',fill:'none',stroke:'#a6afac','stroke-width':.25},svg);
node('rect',{x:-50,y:-50,width:100,height:100},grid);
node('path',{d:'M-54 0H54M0-54V54','stroke-dasharray':'1.5 2'},grid);
for(let a=-40;a<=40;a+=10)node('path',{d:`M${a}-50v1.5M${a} 50v-1.5M-50 ${a}h1.5M50 ${a}h-1.5`},grid);
const ink=node('g',{id:'geometry',class:'ink',fill:'white'},defs);
const filteredView=node('use',{href:'#geometry',filter:'url(#body-filter)'},svg);
const construction=constructionFinish(svg,defs,'art-construction',finishes.drawing);
const vector=vectorFinish(svg,defs,'art-vector',finishes.light);
const raw=node('g',{class:'primitive-guides',fill:'none',stroke:'#485356','stroke-width':.25,opacity:.48,'clip-path':`url(#${construction.clipId})`},svg);
const actors=node('g',{class:'external-actors'},svg);
const scene={svg,ink,raw};
function primitive(scene,tag,attrs){return{shape:node(tag,attrs,scene.ink),guide:node(tag,{...attrs,fill:'none',stroke:'#485356','stroke-width':.25},scene.raw)};}
function both(p,attrs){set(p.shape,attrs);set(p.guide,attrs);}
/*FIGURE_CODE*/
const model=createFigure(scene,actors);
const drawMotion=t=>model.draw(t,intensity);
function isOutlineFinish(){return finish==='light'||finish==='dark';}
function resizeContour(){vector.resize();}
function showGuides(){
 const on=guideChoices[finish];grid.style.display=on?'':'none';raw.style.display=on&&finish==='drawing'?'':'none';$('#guides').checked=on;
}
function showEmphasis(){vector.setContrast(emphasis);$('#emphasis-row').hidden=!isOutlineFinish();$('#emphasis').checked=emphasis;}
function applyFinish(){
 const p=finishes[finish],outline=isOutlineFinish();
 document.documentElement.dataset.finish=finish;
 document.documentElement.style.setProperty('--canvas',p.ground);
 document.documentElement.style.colorScheme=finish==='dark'?'dark':'light';
 set(base.fill,{'flood-color':p.fill});set(base.edge,{'flood-color':p.edge,'flood-opacity':finish==='flat'?0:1});
 set(grid,{stroke:p.grid});
 for(const shape of actors.children)set(shape,{fill:outline?p.ground:p.fill,stroke:outline?p.hi:finish==='drawing'?p.edge:'none','stroke-width':outline?1.5:1,'vector-effect':'non-scaling-stroke'});
 model.theme?.(p,finish);
 filteredView.style.display=finish==='flat'?'':'none';
 construction.group.style.display=finish==='drawing'?'':'none';vector.group.style.display=outline?'':'none';
 if(outline)vector.theme(p);
 $('#finish').value=finish;syncPicker('finish');showGuides();showEmphasis();resizeContour();render();
}
function render(){
 const t=seconds>=DURATION?0:seconds;
 drawMotion(t);
 const contourKey=FIGURE.id+':'+t+':'+intensity;
 if(finish==='drawing')construction.draw(ink,contourKey);
 if(isOutlineFinish())vector.draw(ink,contourKey);
 $('#position').value=Math.round(seconds*100);$('#time').textContent=seconds.toFixed(1)+' / '+DURATION+' s';
}
function playUI(){
 $('#play').setAttribute('aria-label',playing?'Pause animation':'Play animation');$('#play').title=playing?'Pause animation':'Play animation';
 $('#play').dataset.playing=String(playing);$('#status').textContent=reduced.matches&&!playing?'Animation paused. Reduced motion is enabled.':playing?'Animation playing.':'Animation paused.';
}
function stop(){if(raf)cancelAnimationFrame(raf);raf=0;previous=0;lastDraw=-1;}
function tick(now){raf=0;const dt=previous?Math.min((now-previous)/1000,.08):0;previous=now;if(playing&&!document.hidden)seconds=(seconds+dt*speed)%DURATION;if(now-lastDraw>=1000/45){render();lastDraw=now;}if(playing&&!document.hidden)raf=requestAnimationFrame(tick);}
function start(){previous=0;if(playing&&!document.hidden&&!raf)raf=requestAnimationFrame(tick);}
function pause(){playing=false;stop();playUI();}
/*TOOLBAR_UI*/
$('#play').addEventListener('click',()=>{playing=!playing;playUI();playing?start():stop();});
$('#intensity').addEventListener('input',()=>{intensity=+$('#intensity').value/100;updateIntensityUI();render();});
$('#speed').addEventListener('change',()=>{speed=+$('#speed').value;previous=0;});
$('#finish').addEventListener('change',()=>{finish=$('#finish').value;applyFinish();});
$('#restart').addEventListener('click',()=>{seconds=0;previous=0;render();});
$('#guides').addEventListener('change',()=>{guideChoices[finish]=$('#guides').checked;showGuides();});
$('#emphasis').addEventListener('change',()=>{emphasis=$('#emphasis').checked;showEmphasis();});
$('#position').addEventListener('input',()=>{pause();seconds=+$('#position').value/100;render();});
document.addEventListener('visibilitychange',()=>document.hidden?stop():start());
reduced.addEventListener('change',e=>{if(e.matches)pause();else playUI();});
const dockObserver=new ResizeObserver(()=>{document.documentElement.style.setProperty('--dock-height',$('#dock').offsetHeight+'px');positionControls();});
dockObserver.observe($('#dock'));
new ResizeObserver(resizeContour).observe(svg);
$('#position').max=DURATION*100;
applyFinish();playUI();start();
