import React from 'react';

export default function ChatTestComponent() {
  return (
<>
  <div className="max-w-2xl mx-auto p-4 border rounded-lg">
  <h2 className="text-xl font-bold mb-4">Chat</h2>
  <div className="chat-container" style={{height: '400px'}}>
    <div id="ch-messages" className="chat-messages bg-gray-50 p-4 rounded-lg mb-4 overflow-y-auto" style={{height: 'calc(400px - 100px)'}}>
      <div className="message mb-2">
        <div className="bg-blue-500 text-white p-2 rounded-lg max-w-xs">
          Hello! How can I help you today?
        </div>
      </div>
      <div className="message mb-2 flex justify-end">
        <div className="bg-gray-300 text-black p-2 rounded-lg max-w-xs">
          Hi there! I'm looking for some information.
        </div>
      </div>
    </div>
    <div className="chat-input flex gap-2">
      <input id="ch-input" className="flex-1 border rounded-lg px-3 py-2" placeholder="Type your message..." type="text" />
      <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg" onClick={() => {const inp=document.getElementById('ch-input'); if(!inp) return;const v=(inp.value||'').trim(); if(!v) return;const list=document.getElementById('ch-messages');const d=document.createElement('div'); d.className='message mb-2 flex justify-end'; const b=document.createElement('div'); b.className='bg-gray-300 text-black p-2 rounded-lg max-w-xs'; b.textContent=v; d.appendChild(b); if(list){list.appendChild(d); list.scrollTop=list.scrollHeight;}window.sevdoAct('api:POST /api/echo|' + JSON.stringify({message: v}));inp.value='';}}>
        Send
      </button>
    </div>
  </div>
</div>
</>
  );
}
