// Shared popovers keep the same surface and motion. Keyboard actions are immediate.
const uiRoot=document.documentElement;
document.addEventListener('pointerdown',()=>{uiRoot.dataset.input='pointer';},true);
document.addEventListener('keydown',()=>{uiRoot.dataset.input='keyboard';},true);
function updateIntensityUI(){
 const value=Math.round(intensity*100);
 $('#intensity-value').textContent=value;
 $('#intensity-fill').style.transform=`scaleX(${intensity})`;
 $('#intensity').setAttribute('aria-valuetext',value+' percent');
}
const panels=[['settings','settings-toggle'],['speed-picker','speed-toggle'],['finish-picker','finish-toggle']];
function positionPanel(panel,trigger){
 const dock=$('#dock').getBoundingClientRect(),box=trigger.getBoundingClientRect();
 const ratio=window.devicePixelRatio||1,snap=value=>Math.round(value*ratio)/ratio;
 const width=parseFloat(getComputedStyle(panel).width);
 const left=snap(Math.max(16,Math.min(box.right-width,innerWidth-width-16)));
 panel.style.left=left+'px';
 panel.style.bottom=snap(innerHeight-dock.top+12)+'px';
 panel.style.maxHeight=Math.max(48,dock.top-28)+'px';
 panel.style.setProperty('--origin-x',snap(box.left+box.width/2-left)+'px');
}
function positionControls(){
 const dock=$('#dock'),ratio=window.devicePixelRatio||1;
 dock.style.left=(Math.round((innerWidth-dock.offsetWidth)/2*ratio)/ratio)+'px';
 for(const [id,trigger] of panels)if($('#'+id).matches(':popover-open'))positionPanel($('#'+id),$('#'+trigger));
}
for(const [id,triggerId] of panels){
 const panel=$('#'+id),trigger=$('#'+triggerId);
 panel.addEventListener('beforetoggle',event=>{
  const open=event.newState==='open';
  if(open)positionPanel(panel,trigger);
  trigger.dataset.open=String(open);
  trigger.setAttribute('aria-expanded',String(open));
 });
}
function syncPicker(name){
 const select=$('#'+name),panel=$('#'+name+'-picker');
 $('#'+name+'-label').textContent=select.selectedOptions[0].textContent;
 for(const option of panel.children){
  const selected=option.dataset.value===select.value;
  option.setAttribute('aria-selected',String(selected));
  option.tabIndex=selected?0:-1;
 }
}
for(const name of ['speed','finish']){
 const select=$('#'+name),panel=$('#'+name+'-picker'),trigger=$('#'+name+'-toggle');
 for(const item of select.options){
  const option=document.createElement('div');
  option.className='picker-option';option.setAttribute('role','option');option.dataset.value=item.value;
  const label=document.createElement('span');label.textContent=item.textContent;option.append(label);
  const check=document.createElementNS(NS,'svg');check.setAttribute('viewBox','0 0 16 16');check.setAttribute('aria-hidden','true');
  const path=document.createElementNS(NS,'path');path.setAttribute('d','m3 8 3 3 7-7');check.append(path);option.append(check);
  option.addEventListener('click',()=>choose(option));
  panel.append(option);
 }
 const options=Array.from(panel.children);
 let search='',searchAt=0,openAt=null;
 function focusOption(index){
  const option=options[(index+options.length)%options.length];
  for(const row of options)row.tabIndex=row===option?0:-1;
  option.focus({preventScroll:true});option.scrollIntoView({block:'nearest'});
 }
 function choose(option){
  select.value=option.dataset.value;
  select.dispatchEvent(new Event('change',{bubbles:true}));
  syncPicker(name);panel.hidePopover();trigger.focus({preventScroll:true});
 }
 select.addEventListener('change',()=>syncPicker(name));
 panel.addEventListener('toggle',event=>{
  if(event.newState==='open'){
   focusOption(openAt??options.findIndex(option=>option.dataset.value===select.value));
   openAt=null;
  }
 });
 trigger.addEventListener('keydown',event=>{
  if(['ArrowDown','ArrowUp','Home','End'].includes(event.key)){
   event.preventDefault();
   openAt=event.key==='Home'?0:event.key==='End'?options.length-1:null;
   if(panel.matches(':popover-open'))focusOption(openAt??options.findIndex(option=>option.dataset.value===select.value));
   else panel.showPopover();
  }
 });
 panel.addEventListener('keydown',event=>{
  const index=options.indexOf(document.activeElement);
  if(['ArrowDown','ArrowUp','Home','End'].includes(event.key)){
   event.preventDefault();
   focusOption(event.key==='Home'?0:event.key==='End'?options.length-1:index+(event.key==='ArrowDown'?1:-1));
  }else if(event.key==='Enter'||event.key===' '){
   event.preventDefault();if(index>=0)choose(options[index]);
  }else if(event.key==='Escape'){
   event.preventDefault();event.stopPropagation();panel.hidePopover();trigger.focus({preventScroll:true});
  }else if(event.key==='Tab'){
   event.preventDefault();panel.hidePopover();
   const controls=Array.from($('#dock').querySelectorAll('button,input:not([hidden])'));
   const next=controls[controls.indexOf(trigger)+(event.shiftKey?-1:1)];
   (next||trigger).focus({preventScroll:true});
  }else if(event.key.length===1&&!event.ctrlKey&&!event.metaKey&&!event.altKey){
   event.preventDefault();
   const now=performance.now();search=now-searchAt>600?event.key.toLowerCase():search+event.key.toLowerCase();searchAt=now;
   const letters=Array.from(search);const query=letters.every(letter=>letter===letters[0])?letters[0]:search;
   for(let step=1;step<=options.length;step++){
    const candidate=(index+step)%options.length;
    if(options[candidate].textContent.toLowerCase().startsWith(query)){focusOption(candidate);break;}
   }
  }
 });
 syncPicker(name);
}
window.addEventListener('resize',positionControls);
window.visualViewport?.addEventListener('resize',positionControls);
updateIntensityUI();
