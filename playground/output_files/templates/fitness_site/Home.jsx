import React from 'react';

export default function Fitness_SiteHomePage() {
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
  <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white min-h-screen flex items-center">
  <div className="absolute inset-0 bg-black opacity-20"></div>
  <div className="relative z-10 max-w-6xl mx-auto px-4 py-20 text-center">
    <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
      Transform Your Body, Transform Your Life
    </h1>
    <h2 className="text-xl md:text-2xl font-light mb-8 text-blue-100 max-w-3xl mx-auto">
      Powerful Solutions for Modern Challenges
    </h2>
    <p className="text-lg md:text-xl mb-12 text-blue-100 max-w-4xl mx-auto leading-relaxed">
      Join thousands of companies who trust our platform to grow their business. Get started with our comprehensive suite of tools designed for success.
    </p>
    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
      <button className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-4 rounded-lg text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
        Get Started Free
      </button>
      <button className="border-2 border-white text-white hover:bg-white hover:text-blue-600 font-semibold px-8 py-4 rounded-lg text-lg transition-all duration-300">
        Learn More
      </button>
    </div>
    <div className="mt-16 text-blue-200 text-sm">
      <p>Trusted by 10,000+ companies worldwide</p>
    </div>
  </div>
  <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
    </svg>
  </div>
</section>
  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-left">Header</h1>
  <p>Popular workouts that deliver real results</p>
  <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 transition-all duration-300 hover:shadow-xl hover:border-blue-300">
  <div className="flex justify-between items-start mb-4">
    <div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">HIIT Intensity</h3>
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        Intermediate
      </span>
    </div>
    <div className="text-right">
      <div className="text-sm text-gray-500">Available Spots</div>
      <div className="text-lg font-bold text-blue-600">12</div>
    </div>
  </div>
  
  <div className="space-y-3 mb-4">
    <div className="flex items-center text-sm text-gray-600">
      <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      6:00 AM • 45 minutes
    </div>
    
    <div className="flex items-center text-sm text-gray-600">
      <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
      </svg>
      Instructor: Sarah Johnson
    </div>
    
    
  </div>
  
  
  
  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300">
    Book Class
  </button>
</div>
  <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 transition-all duration-300 hover:shadow-xl hover:border-blue-300">
  <div className="flex justify-between items-start mb-4">
    <div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">Strength & Conditioning</h3>
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        All Levels
      </span>
    </div>
    <div className="text-right">
      <div className="text-sm text-gray-500">Available Spots</div>
      <div className="text-lg font-bold text-blue-600">8</div>
    </div>
  </div>
  
  <div className="space-y-3 mb-4">
    <div className="flex items-center text-sm text-gray-600">
      <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      7:30 AM • 60 minutes
    </div>
    
    <div className="flex items-center text-sm text-gray-600">
      <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
      </svg>
      Instructor: Mike Rodriguez
    </div>
    
    
  </div>
  
  
  
  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300">
    Book Class
  </button>
</div>
  <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 transition-all duration-300 hover:shadow-xl hover:border-blue-300">
  <div className="flex justify-between items-start mb-4">
    <div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">Power Yoga Flow</h3>
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
        Beginner
      </span>
    </div>
    <div className="text-right">
      <div className="text-sm text-gray-500">Available Spots</div>
      <div className="text-lg font-bold text-blue-600">15</div>
    </div>
  </div>
  
  <div className="space-y-3 mb-4">
    <div className="flex items-center text-sm text-gray-600">
      <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      12:00 PM • 75 minutes
    </div>
    
    <div className="flex items-center text-sm text-gray-600">
      <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
      </svg>
      Instructor: Emma Chen
    </div>
    
    
  </div>
  
  
  
  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300">
    Book Class
  </button>
</div>
  <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 transition-all duration-300 hover:shadow-xl hover:border-blue-300">
  <div className="flex justify-between items-start mb-4">
    <div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">CrossFit Challenge</h3>
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
        Advanced
      </span>
    </div>
    <div className="text-right">
      <div className="text-sm text-gray-500">Available Spots</div>
      <div className="text-lg font-bold text-blue-600">10</div>
    </div>
  </div>
  
  <div className="space-y-3 mb-4">
    <div className="flex items-center text-sm text-gray-600">
      <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      6:00 PM • 50 minutes
    </div>
    
    <div className="flex items-center text-sm text-gray-600">
      <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
      </svg>
      Instructor: Jake Thompson
    </div>
    
    
  </div>
  
  
  
  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300">
    Book Class
  </button>
</div>
  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-left">Header</h1>
  <p>Certified professionals dedicated to your fitness goals</p>
  <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 transition-all duration-300 hover:shadow-xl hover:border-blue-300">
  <div className="flex flex-col items-center text-center mb-4">
    <div className="w-24 h-24 rounded-full bg-gray-200 mb-4 overflow-hidden">
      <img src="/images/sarah-trainer.jpg" alt="Sarah Johnson" className="w-full h-full object-cover" 
           onError="this.src='https://via.placeholder.com/96x96?text=Trainer'" />
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-1">Sarah Johnson</h3>
    <p className="text-blue-600 font-semibold mb-2">Fitness Instructor</p>
    <div className="flex items-center text-sm text-gray-600 mb-2">
      <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
      </svg>
      HIIT & Cardio
    </div>
    <div className="flex items-center text-sm text-gray-600 mb-3">
      <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      8 years experience
    </div>
  </div>
  
  
  
  
        <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Certifications</h4>
            <div className="flex flex-wrap">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2 mb-2">[NASM-CPT</span>
            </div>
        </div>
  
  <div className="text-center border-t border-gray-200 pt-4">
    <div className="text-lg font-bold text-green-600 mb-3">$75/hour</div>
    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300">
      Book Session
    </button>
  </div>
</div>
  <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 transition-all duration-300 hover:shadow-xl hover:border-blue-300">
  <div className="flex flex-col items-center text-center mb-4">
    <div className="w-24 h-24 rounded-full bg-gray-200 mb-4 overflow-hidden">
      <img src="/images/mike-trainer.jpg" alt="Mike Rodriguez" className="w-full h-full object-cover" 
           onError="this.src='https://via.placeholder.com/96x96?text=Trainer'" />
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-1">Mike Rodriguez</h3>
    <p className="text-blue-600 font-semibold mb-2">Fitness Instructor</p>
    <div className="flex items-center text-sm text-gray-600 mb-2">
      <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
      </svg>
      Strength Training
    </div>
    <div className="flex items-center text-sm text-gray-600 mb-3">
      <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      12 years experience
    </div>
  </div>
  
  
  
  
        <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Certifications</h4>
            <div className="flex flex-wrap">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2 mb-2">[CSCS</span>
            </div>
        </div>
  
  <div className="text-center border-t border-gray-200 pt-4">
    <div className="text-lg font-bold text-green-600 mb-3">$75/hour</div>
    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300">
      Book Session
    </button>
  </div>
</div>
  <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 transition-all duration-300 hover:shadow-xl hover:border-blue-300">
  <div className="flex flex-col items-center text-center mb-4">
    <div className="w-24 h-24 rounded-full bg-gray-200 mb-4 overflow-hidden">
      <img src="/images/emma-trainer.jpg" alt="Emma Chen" className="w-full h-full object-cover" 
           onError="this.src='https://via.placeholder.com/96x96?text=Trainer'" />
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-1">Emma Chen</h3>
    <p className="text-blue-600 font-semibold mb-2">Fitness Instructor</p>
    <div className="flex items-center text-sm text-gray-600 mb-2">
      <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
      </svg>
      Yoga & Flexibility
    </div>
    <div className="flex items-center text-sm text-gray-600 mb-3">
      <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      6 years experience
    </div>
  </div>
  
  
  
  
        <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Certifications</h4>
            <div className="flex flex-wrap">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2 mb-2">[RYT-500</span>
            </div>
        </div>
  
  <div className="text-center border-t border-gray-200 pt-4">
    <div className="text-lg font-bold text-green-600 mb-3">$75/hour</div>
    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300">
      Book Session
    </button>
  </div>
</div>
  <section className="py-16 bg-gray-50">
  <div className="max-w-7xl mx-auto px-4">
    <div className="text-center mb-12">
      <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose PowerFit</h2>
      <p className="text-xl text-gray-600 max-w-3xl mx-auto">Everything you need to succeed, built for modern teams</p>
    </div>
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-blue-200 transition-all duration-300">
            <div className="text-3xl mb-4">⚡</div>
            <h3 className="font-bold text-gray-900 mb-2">Lightning Fast</h3>
            <p className="text-gray-600 text-sm mb-4 leading-relaxed">Load times under 200ms with our global CDN network</p>
            <div className="text-blue-600 font-semibold text-sm">3x faster</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-blue-200 transition-all duration-300">
            <div className="text-3xl mb-4">🔒</div>
            <h3 className="font-bold text-gray-900 mb-2">Enterprise Security</h3>
            <p className="text-gray-600 text-sm mb-4 leading-relaxed">SOC 2 compliant with end-to-end encryption</p>
            <div className="text-blue-600 font-semibold text-sm">99.9% secure</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-blue-200 transition-all duration-300">
            <div className="text-3xl mb-4">🚀</div>
            <h3 className="font-bold text-gray-900 mb-2">Auto-Scaling</h3>
            <p className="text-gray-600 text-sm mb-4 leading-relaxed">Handle millions of requests without breaking a sweat</p>
            <div className="text-blue-600 font-semibold text-sm">10M+ requests</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-blue-200 transition-all duration-300">
            <div className="text-3xl mb-4">📊</div>
            <h3 className="font-bold text-gray-900 mb-2">Real-time Analytics</h3>
            <p className="text-gray-600 text-sm mb-4 leading-relaxed">Live dashboards with actionable insights</p>
            <div className="text-blue-600 font-semibold text-sm">Live data</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-blue-200 transition-all duration-300">
            <div className="text-3xl mb-4">🔄</div>
            <h3 className="font-bold text-gray-900 mb-2">Zero Downtime</h3>
            <p className="text-gray-600 text-sm mb-4 leading-relaxed">Continuous deployment with instant rollbacks</p>
            <div className="text-blue-600 font-semibold text-sm">99.99% uptime</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-blue-200 transition-all duration-300">
            <div className="text-3xl mb-4">🤝</div>
            <h3 className="font-bold text-gray-900 mb-2">24/7 Support</h3>
            <p className="text-gray-600 text-sm mb-4 leading-relaxed">Expert human support when you need it most</p>
            <div className="text-blue-600 font-semibold text-sm">5min response</div>
        </div>
    </div>
  </div>
</section>
  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-left">Header</h1>
  <section className="py-12 bg-gray-50">
  <div className="max-w-6xl mx-auto px-4">
    <div className="flex items-center justify-between mb-8">
      <h2 className="text-3xl font-bold text-gray-900">What Our Members Say</h2>
      <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded text-sm" onClick={() => {window.sevdoAct('api:POST /api/echo|' + JSON.stringify({event:'testimonials_refresh', ts: Date.now()}));}}>
        Refresh
      </button>
    </div>
    <div className="grid md:grid-cols-3 gap-8">
    <div className="bg-white p-6 rounded-lg shadow-md">
      <p className="text-gray-600 mb-4">"This product has transformed our workflow completely."</p>
      <div className="flex items-center">
        <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
        <div>
          <h4 className="font-semibold text-gray-900">Sarah Johnson</h4>
          <p className="text-gray-600 text-sm">CEO, TechCorp</p>
        </div>
      </div>
    </div>
    <div className="bg-white p-6 rounded-lg shadow-md">
      <p className="text-gray-600 mb-4">"Amazing experience, highly recommended!"</p>
      <div className="flex items-center">
        <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
        <div>
          <h4 className="font-semibold text-gray-900">Mike Chen</h4>
          <p className="text-gray-600 text-sm">Developer</p>
        </div>
      </div>
    </div>
    <div className="bg-white p-6 rounded-lg shadow-md">
      <p className="text-gray-600 mb-4">"The best tool I've used in years."</p>
      <div className="flex items-center">
        <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
        <div>
          <h4 className="font-semibold text-gray-900">Anna Smith</h4>
          <p className="text-gray-600 text-sm">Designer</p>
        </div>
      </div>
    </div>
    </div>
  </div>
</section>
  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-left">Header</h1>
  <p>Find the perfect plan for your lifestyle</p>
  <div className="relative bg-white rounded-2xl shadow-xl border-2 border-blue-500 p-6 transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1">
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <div className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                Most Popular
            </div>
        </div>
  <div className="text-center mb-6">
    <h3 className="text-2xl font-bold text-gray-900 mb-2">Basic</h3>
    <div className="mb-2">
      <span className="text-4xl font-bold text-gray-900">$49</span>
      <span className="text-gray-600">/month</span>
    </div>
    
    <div className="text-sm text-blue-600 font-medium">No Contract</div>
  </div>
  
  <ul className="mb-8 space-y-3">
                <li className="flex items-center text-gray-600 mb-3">
                    <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    [Gym Access
                </li>
  </ul>
  
  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105">
    Choose Plan
  </button>
</div>
  <div className="relative bg-white rounded-2xl shadow-xl border-2 border-blue-500 p-6 transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1">
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <div className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                Most Popular
            </div>
        </div>
  <div className="text-center mb-6">
    <h3 className="text-2xl font-bold text-gray-900 mb-2">Premium</h3>
    <div className="mb-2">
      <span className="text-4xl font-bold text-gray-900">$79</span>
      <span className="text-gray-600">/month</span>
    </div>
    
    <div className="text-sm text-blue-600 font-medium">No Contract</div>
  </div>
  
  <ul className="mb-8 space-y-3">
                <li className="flex items-center text-gray-600 mb-3">
                    <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    [All Basic Features
                </li>
  </ul>
  
  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105">
    Choose Plan
  </button>
</div>
  <div className="relative bg-white rounded-2xl shadow-xl border-2 border-blue-500 p-6 transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1">
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <div className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                Most Popular
            </div>
        </div>
  <div className="text-center mb-6">
    <h3 className="text-2xl font-bold text-gray-900 mb-2">VIP</h3>
    <div className="mb-2">
      <span className="text-4xl font-bold text-gray-900">$129</span>
      <span className="text-gray-600">/month</span>
    </div>
    
    <div className="text-sm text-blue-600 font-medium">No Contract</div>
  </div>
  
  <ul className="mb-8 space-y-3">
                <li className="flex items-center text-gray-600 mb-3">
                    <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    [All Premium Features
                </li>
  </ul>
  
  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105">
    Choose Plan
  </button>
</div>
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
  <section className="py-20 bg-blue-50">
  <div className="max-w-4xl mx-auto px-4 text-center">
    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Ready to Transform?</h2>
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
