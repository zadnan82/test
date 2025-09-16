import React from 'react';

export default function HellowWorldComponent() {
  return (
<>
  <form className="max-w-md mx-auto p-6">
  <h1 className="text-xl font-bold mb-4">Login to Your Account</h1>
  <div className="flex flex-col gap-4">
    <label className="block">
      <span className="mb-1 block">Email</span>
      <input id="lf-email" name="email" className="border rounded px-3 py-2 w-full" placeholder="Enter your email" />
    </label>
    <label className="block">
      <span className="mb-1 block">Password</span>
      <input id="lf-password" name="password" className="border rounded px-3 py-2 w-full" type="password" placeholder="Enter your password" />
    </label>
    <div className="flex flex-row gap-2 mt-4">
      <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded">Sign In</button>
      <button className="bg-gray-500 hover:bg-gray-600 text-white font-medium px-4 py-2 rounded">Forgot Password?</button>
    </div>
  </div>
</form>
  <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded px-4 py-2 text-sm">Click</button>
  <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded px-4 py-2 text-sm">Click</button>
  <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded px-4 py-2 text-sm">Click</button>
  <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded px-4 py-2 text-sm">Click</button>
  <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded px-4 py-2 text-sm">The last button</button>
</>
  );
}
