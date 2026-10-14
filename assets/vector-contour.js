// Trace the blurred UNION once, then let the SVG stroker draw its boundary.
// A rectangular morphology kernel is unsuitable for a constant-width outline.
const gooContours=(()=>{
 const step=.25,size=520,origin=-65,count=size*size;
 const canvas=document.createElement('canvas');canvas.width=canvas.height=size;
 const ctx=canvas.getContext('2d',{willReadFrequently:true});
 const field=new Float32Array(count),scratch=new Float32Array(count);
 let lastKey='',lastPaths=null;
 function box(source,target,r,horizontal){
  const stride=horizontal?1:size,line=horizontal?size:1,denom=2*r+1;
  for(let a=0;a<size;a++){
   const base=a*line;let sum=0;
   for(let k=0;k<=r;k++)sum+=source[base+k*stride];
   for(let b=0;b<size;b++){
    target[base+b*stride]=sum/denom;
    if(b-r>=0)sum-=source[base+(b-r)*stride];
    if(b+r+1<size)sum+=source[base+(b+r+1)*stride];
   }
  }
 }
 function raster(ink){
  ctx.resetTransform();ctx.clearRect(0,0,size,size);
  ctx.scale(1/step,1/step);ctx.translate(-origin,-origin);
  ctx.fillStyle=ctx.strokeStyle='#fff';ctx.lineCap=ctx.lineJoin='round';
  for(const el of ink.children){
   ctx.save();const m=el.transform.baseVal.consolidate()?.matrix;
   if(m)ctx.transform(m.a,m.b,m.c,m.d,m.e,m.f);
   const n=(key,fallback=0)=>+(el.getAttribute(key)??fallback);
   if(el.tagName==='rect'){
    ctx.beginPath();ctx.roundRect(n('x'),n('y'),n('width'),n('height'),n('rx'));ctx.fill();
   }else if(el.tagName==='circle'){
    ctx.beginPath();ctx.arc(n('cx'),n('cy'),n('r'),0,Math.PI*2);ctx.fill();
   }else if(el.tagName==='path'){
    ctx.lineWidth=n('stroke-width',13);ctx.stroke(new Path2D(el.getAttribute('d')));
   }
   ctx.restore();
  }
  const rgba=ctx.getImageData(0,0,size,size).data;
  for(let i=0;i<count;i++)field[i]=rgba[i*4+3]/255;
  // Three separable box passes approximate sigma 2.8 in floating point.
  // Keep fractional alpha until tracing: 8-bit blur causes visible stair steps.
  for(const r of [10,11,11]){box(field,scratch,r,true);box(scratch,field,r,false);}
 }
 function trace(level){
  const vertices=new Map();
  function vertex(x,y,vertical){
   const index=y*size+x,key=index*2+vertical;
   if(vertices.has(key))return vertices.get(key);
   const a=field[index],b=field[index+(vertical?size:1)],u=(level-a)/(b-a);
   const v={x:origin+(x+.5+(vertical?0:u))*step,y:origin+(y+.5+(vertical?u:0))*step,next:[],seen:false};
   vertices.set(key,v);return v;
  }
  function join(a,b){a.next.push(b);b.next.push(a);}
  for(let y=0;y<size-1;y++)for(let x=0;x<size-1;x++){
   const i=y*size+x,a=field[i],b=field[i+1],c=field[i+size+1],d=field[i+size];
   const bits=(a>=level?1:0)|(b>=level?2:0)|(c>=level?4:0)|(d>=level?8:0);
   if(bits===0||bits===15)continue;
   const edges=[];
   if((a>=level)!==(b>=level))edges.push(vertex(x,y,0));
   if((b>=level)!==(c>=level))edges.push(vertex(x+1,y,1));
   if((d>=level)!==(c>=level))edges.push(vertex(x,y+1,0));
   if((a>=level)!==(d>=level))edges.push(vertex(x,y,1));
   if(edges.length===2)join(edges[0],edges[1]);
   else if(edges.length===4){
    const center=(a+b+c+d)/4>=level;
    if((bits===5&&center)||(bits===10&&!center)){join(edges[0],edges[1]);join(edges[2],edges[3]);}
    else{join(edges[0],edges[3]);join(edges[1],edges[2]);}
   }
  }
  const fmt=n=>n.toFixed(4);let path='';
  for(const start of vertices.values()){
   if(start.seen)continue;
   const loop=[];let current=start,previous=null;
   do{current.seen=true;loop.push(current);const next=current.next.find(v=>v!==previous);previous=current;current=next;}while(current&&current!==start&&!current.seen);
   if(current!==start||loop.length<3)continue;
   // Uniform sampling avoids a crowded cluster of segments at cell corners.
   const distances=[0];let length=0;
   for(let i=0;i<loop.length;i++){const a=loop[i],b=loop[(i+1)%loop.length];length+=Math.hypot(b.x-a.x,b.y-a.y);distances.push(length);}
   const n=Math.max(8,Math.ceil(length/.55)),points=[];let j=0;
   for(let i=0;i<n;i++){
    const s=i*length/n;while(j<loop.length-1&&distances[j+1]<s)j++;
    const a=loop[j],b=loop[(j+1)%loop.length],t=(s-distances[j])/(distances[j+1]-distances[j]);
    points.push({x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t});
   }
   // Remove subpixel raster-grid ripples before fitting the vector boundary.
   for(let pass=0;pass<2;pass++){
    const smooth=points.map((p,i)=>{let x=0,y=0;for(let j=-2;j<=2;j++){const q=points[(i+j+n)%n],w=[1,4,6,4,1][j+2]/16;x+=q.x*w;y+=q.y*w;}return{x,y};});
    points.splice(0,n,...smooth);
   }
   // Smooth interpolating cubics. Closed paths preserve holes via even-odd fill.
   path+=`M${fmt(points[0].x)} ${fmt(points[0].y)}`;
   for(let i=0;i<n;i++){
    const a=points[(i+n-1)%n],b=points[i],c=points[(i+1)%n],d=points[(i+2)%n];
    path+=`C${fmt(b.x+(c.x-a.x)/6)} ${fmt(b.y+(c.y-a.y)/6)} ${fmt(c.x-(d.x-b.x)/6)} ${fmt(c.y-(d.y-b.y)/6)} ${fmt(c.x)} ${fmt(c.y)}`;
   }
   path+='Z';
  }
  return path;
 }
 return{get(ink,key){if(key===lastKey)return lastPaths;raster(ink);lastKey=key;return lastPaths={outer:trace(.4),inner:trace(.6)};}};
})();
// Both contours are complete, opaque strokes. No mask, overpaint, or clipping
// participates in their rendering. The inset follows a second closed isoline.
function vectorFinish(svg,defs,id,palette){
 const group=node('g',{'data-vector-contour':'true'},svg);
 const common={fill:'none','stroke-width':1.5,'stroke-linejoin':'round','stroke-linecap':'round','vector-effect':'non-scaling-stroke','stroke-opacity':1,opacity:1};
 const path=node('path',{id:id+'-contour','fill-rule':'evenodd',fill:palette.ground},group);
 const crease=node('path',{...common,id:id+'-inner',stroke:palette.edge},group);
 const outer=node('path',{...common,id:id+'-outer',stroke:palette.hi},group);
 let colors=palette,contrast=true;
 function theme(p){colors=p;set(path,{fill:p.ground});set(crease,{stroke:p.edge});set(outer,{stroke:contrast?p.hi:p.edge});}
 function setContrast(on){contrast=on;theme(colors);}
 function resize(){} // Non-scaling strokes handle viewport changes directly.
 return{group,path,outer,crease,resize,theme,setContrast,draw(ink,key){
  const contours=gooContours.get(ink,key);
  set(path,{d:contours.outer});set(outer,{d:contours.outer});set(crease,{d:contours.inner});
 }};
}

// Construction has one opaque silhouette stroke. Its original primitive
// outlines are diagram guides, clipped inside the inset contour so they
// cannot double the outer edge or protrude when parts merge and separate.
function constructionFinish(svg,defs,id,palette){
 const group=node('g',{'data-construction-contour':'true'},svg);
 const path=node('path',{id:id+'-outline',fill:palette.fill,'fill-rule':'evenodd',stroke:palette.edge,'stroke-width':1.5,'vector-effect':'non-scaling-stroke','stroke-linejoin':'round','stroke-linecap':'round','stroke-opacity':1,opacity:1},group);
 const clipId=id+'-guides';
 const clip=node('clipPath',{id:clipId,clipPathUnits:'userSpaceOnUse'},defs);
 const interior=node('path',{'clip-rule':'evenodd'},clip);
 return{group,path,interior,clipId,draw(ink,key){
  const contours=gooContours.get(ink,key);
  set(path,{d:contours.outer});set(interior,{d:contours.inner});
 }};
}
