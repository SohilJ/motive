function createFigure(scene,actors){
 const foundation=primitive(scene,'path',{d:'M-34 24H34',fill:'none',stroke:'white','stroke-width':10,'stroke-linecap':'round'});
 const deck=primitive(scene,'path',{fill:'none',stroke:'white','stroke-width':10,'stroke-linecap':'round','stroke-linejoin':'round'});
 const supports=Array.from({length:3},()=>primitive(scene,'path',{fill:'none',stroke:'white','stroke-width':8,'stroke-linecap':'round'}));
 const load=node('rect',{width:18,height:7,rx:3.5},actors);
 function draw(t,intensity){
  // Alternating loads keep adaptation meaningful at the loop seam:
  // support stays where it was useful, then moves to meet a new demand.
  const half=4,side=t<half?1:-1,u=t%half;
  const pressure=ramp(u,.25,.85)*(1-ramp(u,2.1,2.65));
  const adapted=ramp(u,.6,1.5),bias=side*(2*adapted-1);
  const travel=ramp(u,2.65,3.85),loadX=side*mix(24,-24,travel);
  const strain=(3+4*intensity)*pressure*(1-adapted);
  const height=x=>-13+strain*Math.exp(-(((x-side*24)/23)**2));
  // A cubic Hermite spline puts the same continuous deck curve under each support.
  const slope=x=>strain*Math.exp(-(((x-side*24)/23)**2))*(-2*(x-side*24)/(23*23));
  let d=`M-34 ${height(-34).toFixed(5)}`;
  for(const a of [-34,-17,0,17]){
   const b=a+17,h=17/3;
   d+=`C${(a+h).toFixed(5)} ${(height(a)+slope(a)*h).toFixed(5)} ${(b-h).toFixed(5)} ${(height(b)-slope(b)*h).toFixed(5)} ${b} ${height(b).toFixed(5)}`;
  }
  both(deck,{d});
  const left=[-27,-12,2],right=[-2,12,27],feet=[-27,0,27];
  supports.forEach((p,i)=>{
   const x=mix(left[i],right[i],(bias+1)/2),top=height(x)+1;
   both(p,{d:`M${feet[i]} 24C${feet[i]} 10 ${x.toFixed(5)} 1 ${x.toFixed(5)} ${top.toFixed(5)}`});
  });
  // Keep the load separate from the deformable material, with a clear contact gap.
  set(load,{x:loadX-9,y:height(loadX)-5-7-(1+12*(1-pressure))});
  return u<.6?'Pressure arrives':u<1.5?'Support moves toward demand':u<2.1?'Stable under the same load':'The next demand moves elsewhere';
 }
 return{draw};
}
