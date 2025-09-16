import React from 'react';

export default function Real_Estate_SiteHemPage() {
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
      Din lokala expertis för drömhemmet
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
  <p>Aktuella siffror från Stockholms fastighetsmarknad</p>
  <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 transition-all duration-300 hover:shadow-xl hover:border-blue-300">
  <div className="text-xs text-blue-600 font-medium mb-1">Stockholm</div>
  <div className="flex justify-between items-start mb-2">
    <h3 className="text-lg font-semibold text-gray-900 flex-1">Genomsnittspris</h3>
    <div className="flex items-center text-green-600 text-sm font-semibold"><span className="mr-1">↗</span>+5.2%</div>
  </div>
  
  <div className="flex items-baseline mb-1">
    <span className="text-3xl font-bold text-blue-600">8 500 000</span>
    <span className="text-lg text-gray-600 ml-1">kr</span>
  </div>
  
  <div className="text-xs text-gray-500">senaste månaden</div>
  
</div>
  <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 transition-all duration-300 hover:shadow-xl hover:border-blue-300">
  <div className="text-xs text-blue-600 font-medium mb-1">Stockholm</div>
  <div className="flex justify-between items-start mb-2">
    <h3 className="text-lg font-semibold text-gray-900 flex-1">Pris per kvm</h3>
    <div className="flex items-center text-green-600 text-sm font-semibold"><span className="mr-1">↗</span>+3.8%</div>
  </div>
  
  <div className="flex items-baseline mb-1">
    <span className="text-3xl font-bold text-blue-600">85 000</span>
    <span className="text-lg text-gray-600 ml-1">kr/kvm</span>
  </div>
  
  <div className="text-xs text-gray-500">senaste månaden</div>
  
</div>
  <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 transition-all duration-300 hover:shadow-xl hover:border-blue-300">
  <div className="text-xs text-blue-600 font-medium mb-1">Stockholm</div>
  <div className="flex justify-between items-start mb-2">
    <h3 className="text-lg font-semibold text-gray-900 flex-1">Sålda objekt</h3>
    <div className="flex items-center text-green-600 text-sm font-semibold"><span className="mr-1">↗</span>+12%</div>
  </div>
  
  <div className="flex items-baseline mb-1">
    <span className="text-3xl font-bold text-blue-600">1 247</span>
    <span className="text-lg text-gray-600 ml-1">st</span>
  </div>
  
  <div className="text-xs text-gray-500">denna månad</div>
  
</div>
  <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 transition-all duration-300 hover:shadow-xl hover:border-blue-300">
  <div className="text-xs text-blue-600 font-medium mb-1">Stockholm</div>
  <div className="flex justify-between items-start mb-2">
    <h3 className="text-lg font-semibold text-gray-900 flex-1">Tid på marknaden</h3>
    <div className="flex items-center text-red-600 text-sm font-semibold"><span className="mr-1">↘</span>-15%</div>
  </div>
  
  <div className="flex items-baseline mb-1">
    <span className="text-3xl font-bold text-blue-600">28</span>
    <span className="text-lg text-gray-600 ml-1">dagar</span>
  </div>
  
  <div className="text-xs text-gray-500">genomsnitt</div>
  
</div>
  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-left">Header</h1>
  <p>Handplockade fastigheter från vårt sortiment</p>
  <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
  <div className="relative">
    <img src="/images/properties/ostermalm-apt.jpg" alt="Lyxig 4:a på Östermalm" 
         className="w-full h-48 object-cover"
         onError="this.src='https://via.placeholder.com/400x300?text=Property'" />
    <div className="absolute top-3 left-3 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold">FEATURED</div>
    <div className="absolute bottom-3 right-3 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm">
      Bostadsrätt
    </div>
  </div>
  
  <div className="p-6">
    <div className="flex justify-between items-start mb-3">
      <h3 className="text-xl font-bold text-gray-900 flex-1">Lyxig 4:a på Östermalm</h3>
      <div className="text-right ml-4">
        <div className="text-2xl font-bold text-blue-600">12 500 000 kr</div>
        
      </div>
    </div>
    
    <p className="text-gray-600 mb-3">Strandvägen 45</p>
    
    <div className="grid grid-cols-3 gap-4 mb-3 text-center">
      <div>
        <div className="text-lg font-semibold text-gray-900">4</div>
        <div className="text-xs text-gray-500">rum</div>
      </div>
      <div>
        <div className="text-lg font-semibold text-gray-900">125</div>
        <div className="text-xs text-gray-500">kvm</div>
      </div>
      <div>
        <div className="text-lg font-semibold text-gray-900">100 000</div>
        <div className="text-xs text-gray-500">kr/kvm</div>
      </div>
    </div>
    
    
    
    
    
    
    
    <div className="flex space-x-2">
      <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300">
        Se detaljer
      </button>
      <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors duration-300">Boka visning</button>
    </div>
  </div>
</div>
  <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
  <div className="relative">
    <img src="/images/properties/danderyd-villa.jpg" alt="Charmig villa i Danderyd" 
         className="w-full h-48 object-cover"
         onError="this.src='https://via.placeholder.com/400x300?text=Property'" />
    <div className="absolute top-3 left-3 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold">FEATURED</div>
    <div className="absolute bottom-3 right-3 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm">
      Villa
    </div>
  </div>
  
  <div className="p-6">
    <div className="flex justify-between items-start mb-3">
      <h3 className="text-xl font-bold text-gray-900 flex-1">Charmig villa i Danderyd</h3>
      <div className="text-right ml-4">
        <div className="text-2xl font-bold text-blue-600">18 900 000 kr</div>
        
      </div>
    </div>
    
    <p className="text-gray-600 mb-3">Enebybergsvägen 12</p>
    
    <div className="grid grid-cols-3 gap-4 mb-3 text-center">
      <div>
        <div className="text-lg font-semibold text-gray-900">7</div>
        <div className="text-xs text-gray-500">rum</div>
      </div>
      <div>
        <div className="text-lg font-semibold text-gray-900">220</div>
        <div className="text-xs text-gray-500">kvm</div>
      </div>
      <div>
        <div className="text-lg font-semibold text-gray-900">85 909</div>
        <div className="text-xs text-gray-500">kr/kvm</div>
      </div>
    </div>
    
    
    
    
    
    
    
    <div className="flex space-x-2">
      <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300">
        Se detaljer
      </button>
      <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors duration-300">Boka visning</button>
    </div>
  </div>
</div>
  <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
  <div className="relative">
    <img src="/images/properties/sodermalm-apt.jpg" alt="Modern lägenhet Södermalm" 
         className="w-full h-48 object-cover"
         onError="this.src='https://via.placeholder.com/400x300?text=Property'" />
    <div className="absolute top-3 left-3 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold">FEATURED</div>
    <div className="absolute bottom-3 right-3 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm">
      Bostadsrätt
    </div>
  </div>
  
  <div className="p-6">
    <div className="flex justify-between items-start mb-3">
      <h3 className="text-xl font-bold text-gray-900 flex-1">Modern lägenhet Södermalm</h3>
      <div className="text-right ml-4">
        <div className="text-2xl font-bold text-blue-600">6 750 000 kr</div>
        
      </div>
    </div>
    
    <p className="text-gray-600 mb-3">Götgatan 78</p>
    
    <div className="grid grid-cols-3 gap-4 mb-3 text-center">
      <div>
        <div className="text-lg font-semibold text-gray-900">3</div>
        <div className="text-xs text-gray-500">rum</div>
      </div>
      <div>
        <div className="text-lg font-semibold text-gray-900">85</div>
        <div className="text-xs text-gray-500">kvm</div>
      </div>
      <div>
        <div className="text-lg font-semibold text-gray-900">79 411</div>
        <div className="text-xs text-gray-500">kr/kvm</div>
      </div>
    </div>
    
    
    
    
    
    
    
    <div className="flex space-x-2">
      <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300">
        Se detaljer
      </button>
      <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors duration-300">Boka visning</button>
    </div>
  </div>
</div>
  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-left">Header</h1>
  <section className="py-16 bg-gray-50">
  <div className="max-w-7xl mx-auto px-4">
    <div className="text-center mb-12">
      <h2 className="text-4xl font-bold text-gray-900 mb-4">Lokal expertis</h2>
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
  <section className="py-16 bg-gray-50">
  <div className="max-w-7xl mx-auto px-4">
    <div className="text-center mb-12">
      <h2 className="text-4xl font-bold text-gray-900 mb-4">Personlig service</h2>
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
  <section className="py-16 bg-gray-50">
  <div className="max-w-7xl mx-auto px-4">
    <div className="text-center mb-12">
      <h2 className="text-4xl font-bold text-gray-900 mb-4">Marknadsledande resultat</h2>
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
  <section className="py-16 bg-gray-50">
  <div className="max-w-7xl mx-auto px-4">
    <div className="text-center mb-12">
      <h2 className="text-4xl font-bold text-gray-900 mb-4">Digital innovation</h2>
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
  <section className="py-16 bg-gray-50">
  <div className="max-w-7xl mx-auto px-4">
    <div className="text-center mb-12">
      <h2 className="text-4xl font-bold text-gray-900 mb-4">Köpstöd</h2>
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
  <section className="py-16 bg-gray-50">
  <div className="max-w-7xl mx-auto px-4">
    <div className="text-center mb-12">
      <h2 className="text-4xl font-bold text-gray-900 mb-4">Säljstöd</h2>
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
  <section className="py-16 bg-gray-50">
  <div className="max-w-7xl mx-auto px-4">
    <div className="text-center mb-12">
      <h2 className="text-4xl font-bold text-gray-900 mb-4">Värdering</h2>
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
  <section className="py-16 bg-gray-50">
  <div className="max-w-7xl mx-auto px-4">
    <div className="text-center mb-12">
      <h2 className="text-4xl font-bold text-gray-900 mb-4">Marknadsanalys</h2>
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
  <p>Våra framgångsrika affärer den senaste månaden</p>
  <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
  <div className="relative">
    <img src="/images/properties/property-placeholder.jpg" alt="Såld: Vasastan 3:a" 
         className="w-full h-48 object-cover"
         onError="this.src='https://via.placeholder.com/400x300?text=Property'" />
    <div className="absolute top-3 left-3 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">SÅLD</div>
    <div className="absolute bottom-3 right-3 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm">
      Bostadsrätt
    </div>
  </div>
  
  <div className="p-6">
    <div className="flex justify-between items-start mb-3">
      <h3 className="text-xl font-bold text-gray-900 flex-1">Såld: Vasastan 3:a</h3>
      <div className="text-right ml-4">
        <div className="text-2xl font-bold text-blue-600">7 200 000 kr</div>
        <div className="text-green-600 font-semibold">Såld för: 7 450 000 kr</div><div className="text-sm text-gray-600">På marknaden: 22 dagar</div>
      </div>
    </div>
    
    <p className="text-gray-600 mb-3">Upplandsgatan 15</p>
    
    <div className="grid grid-cols-3 gap-4 mb-3 text-center">
      <div>
        <div className="text-lg font-semibold text-gray-900">3</div>
        <div className="text-xs text-gray-500">rum</div>
      </div>
      <div>
        <div className="text-lg font-semibold text-gray-900">95</div>
        <div className="text-xs text-gray-500">kvm</div>
      </div>
      <div>
        <div className="text-lg font-semibold text-gray-900">75 789</div>
        <div className="text-xs text-gray-500">kr/kvm</div>
      </div>
    </div>
    
    
    
    
    
    
    
    <div className="flex space-x-2">
      <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300">
        Se slutpris
      </button>
      
    </div>
  </div>
</div>
  <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
  <div className="relative">
    <img src="/images/properties/property-placeholder.jpg" alt="Såld: Södermalm 2:a" 
         className="w-full h-48 object-cover"
         onError="this.src='https://via.placeholder.com/400x300?text=Property'" />
    <div className="absolute top-3 left-3 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">SÅLD</div>
    <div className="absolute bottom-3 right-3 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm">
      Bostadsrätt
    </div>
  </div>
  
  <div className="p-6">
    <div className="flex justify-between items-start mb-3">
      <h3 className="text-xl font-bold text-gray-900 flex-1">Såld: Södermalm 2:a</h3>
      <div className="text-right ml-4">
        <div className="text-2xl font-bold text-blue-600">5 500 000 kr</div>
        <div className="text-green-600 font-semibold">Såld för: 5 650 000 kr</div><div className="text-sm text-gray-600">På marknaden: 18 dagar</div>
      </div>
    </div>
    
    <p className="text-gray-600 mb-3">Folkungagatan 89</p>
    
    <div className="grid grid-cols-3 gap-4 mb-3 text-center">
      <div>
        <div className="text-lg font-semibold text-gray-900">2</div>
        <div className="text-xs text-gray-500">rum</div>
      </div>
      <div>
        <div className="text-lg font-semibold text-gray-900">68</div>
        <div className="text-xs text-gray-500">kvm</div>
      </div>
      <div>
        <div className="text-lg font-semibold text-gray-900">80 882</div>
        <div className="text-xs text-gray-500">kr/kvm</div>
      </div>
    </div>
    
    
    
    
    
    
    
    <div className="flex space-x-2">
      <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300">
        Se slutpris
      </button>
      
    </div>
  </div>
</div>
  <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
  <div className="relative">
    <img src="/images/properties/property-placeholder.jpg" alt="Såld: Villa Lidingö" 
         className="w-full h-48 object-cover"
         onError="this.src='https://via.placeholder.com/400x300?text=Property'" />
    <div className="absolute top-3 left-3 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">SÅLD</div>
    <div className="absolute bottom-3 right-3 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm">
      Villa
    </div>
  </div>
  
  <div className="p-6">
    <div className="flex justify-between items-start mb-3">
      <h3 className="text-xl font-bold text-gray-900 flex-1">Såld: Villa Lidingö</h3>
      <div className="text-right ml-4">
        <div className="text-2xl font-bold text-blue-600">15 000 000 kr</div>
        <div className="text-green-600 font-semibold">Såld för: 15 800 000 kr</div><div className="text-sm text-gray-600">På marknaden: 35 dagar</div>
      </div>
    </div>
    
    <p className="text-gray-600 mb-3">Herserudsvägen 23</p>
    
    <div className="grid grid-cols-3 gap-4 mb-3 text-center">
      <div>
        <div className="text-lg font-semibold text-gray-900">6</div>
        <div className="text-xs text-gray-500">rum</div>
      </div>
      <div>
        <div className="text-lg font-semibold text-gray-900">180</div>
        <div className="text-xs text-gray-500">kvm</div>
      </div>
      <div>
        <div className="text-lg font-semibold text-gray-900">83 333</div>
        <div className="text-xs text-gray-500">kr/kvm</div>
      </div>
    </div>
    
    
    
    
    
    
    
    <div className="flex space-x-2">
      <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300">
        Se slutpris
      </button>
      
    </div>
  </div>
</div>
  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-left">Header</h1>
  <section className="py-12 bg-gray-50">
  <div className="max-w-6xl mx-auto px-4">
    <div className="flex items-center justify-between mb-8">
      <h2 className="text-3xl font-bold text-gray-900">Vad våra kunder säger</h2>
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
  <section className="py-20 bg-blue-50">
  <div className="max-w-4xl mx-auto px-4 text-center">
    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Redo att köpa eller sälja?</h2>
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
