import React from 'react';

export default function ButtonTestingComponent() {
  return (
<>
  <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded px-4 py-2 text-sm" onClick={() => window.sevdoAct('alert:Hello from button')}>Show Alert</button>
  <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded px-4 py-2 text-sm" onClick={() => window.sevdoAct('log:Logging from button')}>Log Message</button>
  <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded px-4 py-2 text-sm" onClick={() => window.sevdoAct('open:https://github.com|_blank')}>Open GitHub</button>
  <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded px-4 py-2 text-sm" onClick={() => window.sevdoAct('nav:/')}>Go Home</button>
  <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded px-4 py-2 text-sm" onClick={() => window.sevdoAct('back:')}>Back</button>
  <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded px-4 py-2 text-sm" onClick={() => window.sevdoAct('reload:')}>Reload Page</button>
  <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded px-4 py-2 text-sm" onClick={() => window.sevdoAct('copy:Copied via sevdoAct')}>Copy Text</button>
  <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded px-4 py-2 text-sm" onClick={() => window.sevdoAct('download:note.txt|This is a note')}>Download Note</button>
  <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded px-4 py-2 text-sm" onClick={() => window.sevdoAct('scroll:#root')}>Scroll to Root</button>
  <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded px-4 py-2 text-sm" onClick={() => window.sevdoAct('class:toggle .component-container|ring-2')}>Highlight Container</button>
  <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded px-4 py-2 text-sm" onClick={() => window.sevdoAct('store:set theme|dark')}>Set Theme</button>
  <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded px-4 py-2 text-sm" onClick={() => window.sevdoAct('store:get theme')}>Get Theme</button>
  <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded px-4 py-2 text-sm" onClick={() => window.sevdoAct('store:remove theme')}>Remove Theme</button>
  <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded px-4 py-2 text-sm" onClick={() => window.sevdoAct('api:/api/ping')}>Ping API</button>
  <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded px-4 py-2 text-sm" onClick={() => window.sevdoAct('api:POST /api/echo|{"msg":"hello"}')}>Echo JSON</button>
  <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded px-4 py-2 text-sm" onClick={() => window.sevdoAct('/api/ping')}>Shorthand GET</button>
  <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded px-4 py-2 text-sm" onClick={() => window.sevdoAct('nav:/hello_world/')}>Hello World Nav</button>
</>
  );
}
