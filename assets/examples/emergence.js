function createFigure(scene,actors){
const orbit=Array.from({length:4},()=>primitive(scene,'rect',{x:-6.5,y:-21,width:13,height:42,rx:6.5}));
function drawEmergence(t,intensity){
 const open=ramp(t,1.0,2.5)*(1-ramp(t,5.5,7.05));
 const radius=(18.8+1.2*intensity)*open;
 const turn=90*ramp(t,3.1,4.5);
 const breathe=.6*intensity*Math.sin(TAU*(t-4.5)/1.0)*Math.sin(Math.PI*clamp((t-4.5)/1.0))**2;
 orbit.forEach((p,i)=>{const a=i*90+turn,rad=a*Math.PI/180,r=radius+breathe;const x=Math.cos(rad)*r,y=Math.sin(rad)*r;
   both(p,{transform:`translate(${x.toFixed(5)} ${y.toFixed(5)}) rotate(${a.toFixed(5)})`});
 });
 return t<1?'Overlapping parts':t<2.5?'Making room':t<5.5?'An opening belongs to the whole':t<7.05?'Reorganizing':'Overlapping parts';
}
return{draw:drawEmergence};
}
