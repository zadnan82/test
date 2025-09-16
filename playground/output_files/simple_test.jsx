import React from 'react';

export default function SimpleTestComponent() {
  return (
<>
  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-left">Header</h1>
  <p>This is a simple test</p>
  <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded px-4 py-2 text-sm" onClick={() => window.sevdoAct('alert:Hello')}>Click Me</button>
</>
  );
}
