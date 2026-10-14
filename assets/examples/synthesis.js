function createFigure(scene,actors){
const bars=Array.from({length:3},()=>primitive(scene,'rect',{x:-6.5,width:13,rx:6.5}));
function drawSynthesis(t,intensity){
 // Inputs merge before their dimensions change. New equal forms divide from that shared body.
 const gather=ramp(t,.65,1.85),turn=ramp(t,2.05,2.95),divide=ramp(t,3.1,4.2),rejoin=ramp(t,5.15,6.05),unturn=ramp(t,6.1,6.9),reseed=ramp(t,6.95,7.75);
 const input=(1-gather)+reseed,output=divide*(1-rejoin),regular=ramp(t,1.45,2.05)*(1-ramp(t,6.8,7.15));
 const angle=90*turn*(1-unturn),span=25+3*intensity;
 const shared=42+2*intensity;
 const breathe=1+intensity*.04*Math.sin(TAU*(t-4.2)/.95)*Math.sin(Math.PI*clamp((t-4.2)/.95))**2;
 bars.forEach((p,i)=>{const j=i-1,heights=[24,44,32],offsets=[6,-3,3];const h=mix(heights[i],shared,regular)*breathe;const x=j*span*input,y=j*22*output+offsets[i]*input;
   both(p,{x:-6.5,y:-h/2,height:h,transform:`translate(${x.toFixed(5)} ${y.toFixed(5)}) rotate(${angle.toFixed(5)})`});
 });
 return t<.65?'Different inputs':t<1.85?'Joining':t<3.1?'One shared body':t<5.15?'A common rhythm':t<6.95?'Recombining':'Different inputs';
}
return{draw:drawSynthesis};
}
