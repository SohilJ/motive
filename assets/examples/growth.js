function createFigure(scene,actors){
const stem=primitive(scene,'path',{d:'M0 23V-9',fill:'none',stroke:'white','stroke-width':13,'stroke-linecap':'round'});
const arms=[-1,1].map(()=>primitive(scene,'path',{fill:'none',stroke:'white','stroke-width':13,'stroke-linecap':'round'}));
const pulse=node('circle',{r:5},scene.ink),tips=[-1,1].map(()=>node('circle',{r:5},scene.ink));
function drawGrowth(t,intensity){
 const open=ramp(t,.85,2.35)*(1-ramp(t,6.1,7.4));
 const spread=(24+4*intensity)*open,top=mix(-9,-24,open);
 both(stem,{d:'M0 23V-9'});
 arms.forEach((p,i)=>both(p,{d:`M0 -9L${((i?1:-1)*spread).toFixed(5)} ${top.toFixed(5)}`}));
 // A pulse grows while contained in the stem, divides at the fork, then settles inside both ends.
 const rise=ramp(t,2.55,3.5),flow=ramp(t,3.5,4.65),strength=ramp(t,2.3,2.7)*(1-ramp(t,3.45,3.75));
 set(pulse,{cx:0,cy:mix(23,-9,rise),r:5+(2.4+3*intensity)*strength});
 const tipStrength=ramp(t,3.45,3.75)*(1-ramp(t,4.6,5.1));
 tips.forEach((p,i)=>set(p,{cx:(i?1:-1)*spread*flow,cy:mix(-9,top,flow),r:5+(2.4+3*intensity)*tipStrength}));
 return t<.85?'One shared source':t<2.35?'Opening two paths':t<3.5?'Building from the base':t<5.1?'One impulse, two directions':t<6.1?'New capacity':t<7.4?'Returning to the whole':'One shared source';
}
return{draw:drawGrowth};
}
