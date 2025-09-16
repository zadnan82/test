import React from 'react';

export default function TestInlineStylesComponent() {
  return (
<>
  <form style="max-width: 400px; margin: 0 auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #dbeafe; border-radius: 8px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); border: 1px solid #bfdbfe; padding: 32px">
  <h1 style="font-weight: bold; text-align: center; margin-bottom: 24px; color: #1f2937; font-size: 30px">Login to Your Account</h1>
  <div style="display: flex; flex-direction: column; gap: 24px">
    <label style="display: block; margin-bottom: 16px;">
      <span style="display: block; margin-bottom: 4px; font-weight: 500; color: #374151; font-size: 16px">Email</span>
      <input style="width: 100%; border-radius: 4px; border: 1px solid #d1d5db; background-color: white; box-sizing: border-box; padding: 12px 16px; font-size: 18px; outline: none" placeholder="Enter your email" type="email" />
    </label>
    <label style="display: block; margin-bottom: 16px;">
      <span style="display: block; margin-bottom: 4px; font-weight: 500; color: #374151; font-size: 16px">Password</span>
      <input style="width: 100%; border-radius: 4px; border: 1px solid #d1d5db; background-color: white; box-sizing: border-box; padding: 12px 16px; font-size: 18px; outline: none" type="password" placeholder="Enter your password" />
    </label>
    <div style="display: flex; flex-direction: row; gap: 16px; margin-top: 24px">
      <button style="font-weight: 500; border-radius: 4px; border: none; cursor: pointer; color: white; transition: background-color 0.2s; padding: 12px 24px; font-size: 18px; background-color: #059669" type="submit">Sign In</button>
      <button style="font-weight: 500; border-radius: 4px; border: none; cursor: pointer; color: white; background-color: #6b7280; transition: background-color 0.2s; padding: 12px 24px; font-size: 18px" type="button">Forgot Password?</button>
    </div>
  </div>
</form>
</>
  );
}
