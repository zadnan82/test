import React from 'react';

export default function RegisterFormTestComponent() {
  return (
<>
  <form className="max-w-md mx-auto p-6">
  <h1 className="text-xl font-bold mb-4">Create Your Account</h1>
  <div className="flex flex-col gap-4">
    <label className="block">
      <span className="mb-1 block">Full Name</span>
      <input id="rf-name" name="name" className="border rounded px-3 py-2 w-full" placeholder="Enter your full name" />
    </label>
    <label className="block">
      <span className="mb-1 block">Email</span>
      <input id="rf-email" name="email" className="border rounded px-3 py-2 w-full" type="email" placeholder="Enter your email" />
    </label>
    <label className="block">
      <span className="mb-1 block">Password</span>
      <input id="rf-password" name="password" className="border rounded px-3 py-2 w-full" type="password" placeholder="Enter your password" />
    </label>
    <label className="block">
      <span className="mb-1 block">Confirm Password</span>
      <input id="rf-confirm" name="confirmPassword" className="border rounded px-3 py-2 w-full" type="password" placeholder="Confirm your password" />
    </label>
    <div className="flex flex-col gap-2 mt-4">
      <button className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded" onClick={() => window.sevdoAct('api:POST /api/echo|' + JSON.stringify({name: document.getElementById('rf-name').value, email: document.getElementById('rf-email').value, password: document.getElementById('rf-password').value, confirmPassword: document.getElementById('rf-confirm').value}))}>Register</button>
      <button className="bg-gray-500 hover:bg-gray-600 text-white font-medium px-4 py-2 rounded text-sm" onClick={() => window.sevdoAct('alert:Go to login')}>Already have an account? Login</button>
    </div>
  </div>
</form>
  <form className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow p-8">
  <h1 className="text-xl font-bold mb-4 text-2xl">Login to Your Account</h1>
  <div className="flex flex-col gap-4 gap-6">
    <label className="block">
      <span className="mb-1 block">Email</span>
      <input id="lf-email" name="email" className="border rounded px-3 py-2 w-full ring-2 ring-blue-200 focus:ring-blue-400" placeholder="Enter your email" />
    </label>
    <label className="block">
      <span className="mb-1 block">Password</span>
      <input id="lf-password" name="password" className="border rounded px-3 py-2 w-full ring-2 ring-blue-200 focus:ring-blue-400" type="password" placeholder="Enter your password" />
    </label>
    <div className="flex flex-row gap-2 mt-4 mt-6">
      <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded bg-indigo-600 text-lg px-6 py-3 rounded-xl shadow">Sign In</button>
      <button className="bg-gray-500 hover:bg-gray-600 text-white font-medium px-4 py-2 rounded bg-slate-500">Forgot Password?</button>
    </div>
  </div>
</form>
  <form className="max-w-md mx-auto p-6 bg-emerald-50 rounded-xl p-8">
  <h1 className="text-xl font-bold mb-4 text-2xl text-emerald-800">Create Your Account</h1>
  <div className="flex flex-col gap-4">
    <label className="block">
      <span className="mb-1 block">Full Name</span>
      <input id="rf-name" name="name" className="border rounded px-3 py-2 w-full border-emerald-200 focus:ring-emerald-300" placeholder="Enter your full name" />
    </label>
    <label className="block">
      <span className="mb-1 block">Email</span>
      <input id="rf-email" name="email" className="border rounded px-3 py-2 w-full border-emerald-200 focus:ring-emerald-300" type="email" placeholder="Enter your email" />
    </label>
    <label className="block">
      <span className="mb-1 block">Password</span>
      <input id="rf-password" name="password" className="border rounded px-3 py-2 w-full border-emerald-200 focus:ring-emerald-300" type="password" placeholder="Enter your password" />
    </label>
    <label className="block">
      <span className="mb-1 block">Confirm Password</span>
      <input id="rf-confirm" name="confirmPassword" className="border rounded px-3 py-2 w-full border-emerald-200 focus:ring-emerald-300" type="password" placeholder="Confirm your password" />
    </label>
    <div className="flex flex-col gap-2 mt-4 gap-3">
      <button className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded bg-emerald-600 px-6 py-3 rounded-lg">Register</button>
      <button className="bg-gray-500 hover:bg-gray-600 text-white font-medium px-4 py-2 rounded text-sm bg-slate-600">Already have an account? Login</button>
    </div>
  </div>
</form>
</>
  );
}
