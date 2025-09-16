import React from 'react';

export default function Restaurant_SiteReservationsPage() {
  return (
<>
  <nav className="bg-white shadow-sm border-b border-gray-200">
  <div className="max-w-6xl mx-auto px-4">
    <div className="flex justify-between items-center py-4">
      <div className="flex items-center">
        <h1 className="text-xl font-bold text-gray-800">Brand</h1>
      </div>
      <div className="hidden md:flex space-x-1">
        <a href="#" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">Home</a>
        <a href="#" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">About</a>
        <a href="#" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">Services</a>
        <a href="#" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">Contact</a>
      </div>
      <div className="md:hidden">
        <button className="text-gray-700 hover:text-blue-600 focus:outline-none">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>
    </div>
  </div>
</nav>
  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-left">Header</h1>
  <p>Secure your dining experience at Bella Vista. We recommend booking in advance, especially for weekend evenings.</p>
  <section className="py-12 bg-gray-50">
  <div className="max-w-2xl mx-auto px-4">
    <div className="text-center mb-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-4">Make a Reservation</h2>
      <p className="text-gray-600">We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
    </div>
    
    <form className="bg-white rounded-lg shadow-md p-8">
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
          <input 
            id="cf-name"
            name="name"
            type="text" 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your full name" 
            required 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
          <input 
            id="cf-email"
            name="email"
            type="email" 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your email address" 
            required 
          />
        </div>
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
        <input 
          id="cf-subject"
          name="subject"
          type="text" 
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="What is this about?" 
          required 
        />
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
        <textarea 
          id="cf-message"
          name="message"
          rows="5" 
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
          placeholder="Tell us more about your inquiry..." 
          required
        ></textarea>
      </div>
      
      <button 
        type="button" 
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition-colors duration-200"
         onClick={() => {const formData = {name: document.getElementById('cf-name').value, email: document.getElementById('cf-email').value, subject: document.getElementById('cf-subject').value, message: document.getElementById('cf-message').value}; window.sevdoAct('api:POST /api/echo|' + JSON.stringify(formData));}}
      >
        Send Message
      </button>
    </form>
  </div>
</section>
  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-left">Header</h1>
  <p>Tables are held for 15 minutes past reservation time. For parties of 8 or more, please call directly at (555) 123-4567. Cancellations must be made at least 2 hours in advance.</p>
  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-left">Header</h1>
  <div className="bg-white border border-gray-200 rounded-lg p-6">
    <h3 className="text-xl font-bold text-gray-900 mb-4">Hours of Operation</h3>
    
    
    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
            <span className="font-semibold text-green-900">Currently Open</span>
            <span className="text-green-700 ml-2">• Closes at 11:00 PM</span>
        </div>
    </div>
    
    <div className="space-y-3">
        
        <div className="bg-white border-gray-200 border rounded-lg p-4 flex justify-between items-center">
            <span className="font-medium text-gray-900">Monday</span>
            <span className="text-gray-700 font-medium">11:00 AM - 10:00 PM</span>
        </div>
        <div className="bg-white border-gray-200 border rounded-lg p-4 flex justify-between items-center">
            <span className="font-medium text-gray-900">Tuesday</span>
            <span className="text-gray-700 font-medium">11:00 AM - 10:00 PM</span>
        </div>
        <div className="bg-white border-gray-200 border rounded-lg p-4 flex justify-between items-center">
            <span className="font-medium text-gray-900">Wednesday</span>
            <span className="text-gray-700 font-medium">11:00 AM - 10:00 PM</span>
        </div>
        <div className="bg-white border-gray-200 border rounded-lg p-4 flex justify-between items-center">
            <span className="font-medium text-gray-900">Thursday</span>
            <span className="text-gray-700 font-medium">11:00 AM - 10:00 PM</span>
        </div>
        <div className="bg-blue-50 border-blue-200 border rounded-lg p-4 flex justify-between items-center">
            <span className="font-semibold text-blue-900">Friday</span>
            <span className="text-gray-700 font-medium">11:00 AM - 11:00 PM</span>
        </div>
        <div className="bg-white border-gray-200 border rounded-lg p-4 flex justify-between items-center">
            <span className="font-medium text-gray-900">Saturday</span>
            <span className="text-gray-700 font-medium">10:00 AM - 11:00 PM</span>
        </div>
        <div className="bg-white border-gray-200 border rounded-lg p-4 flex justify-between items-center">
            <span className="font-medium text-gray-900">Sunday</span>
            <span className="text-gray-700 font-medium">10:00 AM - 9:00 PM</span>
        </div>
    </div>
    
    <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600 flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            All times are in EST
        </p>
        <p className="text-sm text-gray-600 mt-2">
            Kitchen closes 30 minutes before closing time
        </p>
    </div>
    
    
</div>
  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-left">Header</h1>
  <p>Bella Vista offers private dining rooms for special occasions and full catering services. Our private dining room accommodates up to 30 guests and features a custom menu designed by Chef Marco.</p>
  <p>Private dining room fee: $200 (credited toward food and beverage minimum of $1,500). Contact us for catering quotes and availability.</p>
  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-left">Header</h1>
  <p>For parties of 6 or more, we offer special group menus featuring our most popular dishes. A 20% service charge will be added to parties of 8 or more.</p>
  <section className="py-20 bg-blue-50">
  <div className="max-w-4xl mx-auto px-4 text-center">
    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Ready to Transform Your Business?</h2>
    <p className="text-xl text-gray-600 mb-4">Join 10,000+ companies already using our platform</p>
    <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">Start your free trial today. No credit card required. Cancel anytime.</p>
    
        <div className="flex items-center justify-center space-x-6 mb-8 text-sm">
            <div className="flex items-center text-green-600">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                14-day free trial
            </div>
            <div className="flex items-center text-green-600">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                No credit card required
            </div>
            <div className="flex items-center text-green-600">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Cancel anytime
            </div>
        </div>
    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
      <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-xl text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
        Start Free Trial
      </button>
      <button className="border-2 border-gray-300 text-gray-700 hover:bg-white font-semibold px-8 py-4 rounded-xl text-lg transition-all duration-300">
        Book a Demo
      </button>
    </div>
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-center mb-4">
          <div className="flex text-yellow-400">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
            </svg>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
            </svg>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
            </svg>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
            </svg>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
            </svg>
          </div>
        </div>
        <p className="text-gray-700 italic mb-3">"This platform increased our productivity by 300%"</p>
        <p className="text-gray-600 font-semibold">Sarah Chen, CEO at TechCorp</p>
      </div>
    </div>
  </div>
</section>
</>
  );
}
