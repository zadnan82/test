import React from 'react';

export default function TestPrefabsComponent() {
  return (
<>
  <section className="py-6 bg-white rounded-lg border">
  <div className="max-w-5xl mx-auto px-4">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-bold text-gray-900">Book a Timeslot</h2>
      <div className="flex items-center gap-2">
        <button id="cal-prev" className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1.5 rounded text-sm">&larr; Prev</button>
        <div id="cal-week" className="text-sm text-gray-600 min-w-[220px] text-center"></div>
        <button id="cal-next" className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1.5 rounded text-sm">Next &rarr;</button>
      </div>
    </div>
    <div id="cal-root">
      <div id="cal-grid" className="rounded-md overflow-hidden border"></div>
    </div>
    <div className="mt-3 text-xs text-gray-500">Slot: 60m • Open: 08:00 • Close: 18:00</div>
    <img alt="" src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" className="hidden" onLoad={() => {var CFG={slot:60, open:'08:00', close:'18:00', start:'', key:'sevdoTimeslots'};var root=document.getElementById('cal-root'); if(!root) return;if(!window.sevdoCal){ window.sevdoCal={} };var ST=window.sevdoCal; if(!ST.state){ ST.state={weekOffset:0}; }function parseHM(s){ var parts=String(s).split(':'); var hh=parseInt(parts[0]||'0',10); var mm=parseInt(parts[1]||'0',10); return hh*60+mm; }function fmtHM(m){ var h=Math.floor(m/60); var mm=String(m%60).padStart(2,'0'); return (String(h).padStart(2,'0')+':'+mm); }function startOfWeek(d){ var dt=new Date(d.getFullYear(),d.getMonth(),d.getDate()); var wd=(dt.getDay()+6)%7; dt.setDate(dt.getDate()-wd); dt.setHours(0,0,0,0); return dt; }function weekKey(dt){ var y=dt.getFullYear(); var m=String(dt.getMonth()+1).padStart(2,'0'); var dd=String(dt.getDate()).padStart(2,'0'); return y+'-'+m+'-'+dd; }function load(){ try{ var raw=localStorage.getItem(CFG.key); return raw?JSON.parse(raw):{} }catch(e){ return {} } }function save(data){ try{ localStorage.setItem(CFG.key, JSON.stringify(data)); }catch(e){} }var days=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];var BOOK_ACT=''; var UNBOOK_ACT='';var BOOK_PATH='/api/echo'; var BOOK_METHOD='POST';var UNBOOK_PATH='/api/echo'; var UNBOOK_METHOD='POST';function echo(kind,payload){ if(kind==='book' && BOOK_ACT){ window.sevdoAct(BOOK_ACT); return; } if(kind==='unbook' && UNBOOK_ACT){ window.sevdoAct(UNBOOK_ACT); return; } var path=(kind==='book'?BOOK_PATH:UNBOOK_PATH); var method=(kind==='book'?BOOK_METHOD:UNBOOK_METHOD); window.sevdoAct('api:'+method+' '+path+'|'+JSON.stringify(payload)); }function render(delta){ ST.state.weekOffset += (delta||0); var grid=document.getElementById('cal-grid'); if(!grid) return; grid.innerHTML=''; var base = CFG.start ? new Date(CFG.start+'T00:00:00') : new Date(); var sow = startOfWeek(base); sow.setDate(sow.getDate()+7*ST.state.weekOffset); var wkLbl=document.getElementById('cal-week'); if(wkLbl){ var end=new Date(sow); end.setDate(end.getDate()+6); wkLbl.textContent = sow.toISOString().slice(0,10)+' - '+end.toISOString().slice(0,10); } var data=load(); var wkey=weekKey(sow); var week=data[wkey]||{}; var openM=parseHM(CFG.open), closeM=parseHM(CFG.close); var step=CFG.slot; var rows=Math.max(0, Math.floor((closeM-openM)/step)); for(var r=0; r<rows; r++){ var row=document.createElement('div'); row.className='grid grid-cols-8 gap-px bg-gray-100'; var tdiv=document.createElement('div'); tdiv.className='bg-white p-2 text-xs text-gray-500'; tdiv.textContent=fmtHM(openM+r*step); row.appendChild(tdiv); for(var d=0; d<7; d++){ var key='d'+d; var booked=(week[key]||[]).indexOf(r)>=0; var cell=document.createElement('button'); cell.className=(booked?'bg-green-600 text-white':'bg-white text-gray-700 hover:bg-gray-50')+' p-2 text-xs text-center'; cell.textContent=booked?'Booked':'Available'; (function(rr,dd,kk,cel){ cel.onclick=function(){ var data2=load(); var wk=data2[wkey]||{}; var arr=wk[kk]||[]; var idx=arr.indexOf(rr); if(idx>=0){ arr.splice(idx,1);} else { arr.push(rr);} wk[kk]=arr; data2[wkey]=wk; save(data2); cel.className=(idx>=0?'bg-white text-gray-700 hover:bg-gray-50':'bg-green-600 text-white')+' p-2 text-xs text-center'; cel.textContent=(idx>=0?'Available':'Booked'); var slotTime=fmtHM(openM+rr*step); var dayDate=new Date(sow); dayDate.setDate(sow.getDate()+dd); var payload={event:(idx>=0?'unbook':'book'), week:wkey, day:dd, time:slotTime, date:dayDate.toISOString().slice(0,10), ts:Date.now()}; echo(payload.event, payload); }; })(r,d,key,cell); row.appendChild(cell);} grid.appendChild(row);} }var prev=document.getElementById('cal-prev'); if(prev){ prev.onclick=function(){ render(-1); }; }var next=document.getElementById('cal-next'); if(next){ next.onclick=function(){ render(1); }; }render(0);}} />
  </div>
</section>
</>
  );
}
