function ease(x){x=clamp(x);if(x===0||x===1)return x;let lo=0,hi=1,t=x;for(let i=0;i<16;i++){t=(lo+hi)/2;const q=1-t,px=3*q*q*t*.77+3*q*t*t*.175+t*t*t;if(px<x)lo=t;else hi=t;}return 3*(1-t)*t*t+t*t*t;}
const ramp=(t,a,b)=>ease((t-a)/(b-a));
function node(tag,attrs={},parent){const n=document.createElementNS(NS,tag);set(n,attrs);if(parent)parent.append(n);return n;}
function set(n,attrs){for(const[k,v]of Object.entries(attrs))n.setAttribute(k,typeof v==='number'?(Math.abs(v)<.000005?0:v).toFixed(5):v);}
