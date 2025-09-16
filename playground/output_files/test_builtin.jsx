import React from 'react';

export default function TestBuiltinComponent() {
  return (
<>
  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-left">Header</h1>
  <p>This tests all built-in components</p>
  <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded px-4 py-2 text-sm" onClick={() => window.sevdoAct('alert:Button clicked!')}>Click Me</button>
</>
  );
}
