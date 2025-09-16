import React from 'react';

export default function Real_Estate_SiteTillsaluPage() {
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
  <p>Utforska vårt utbud av fastigheter i Stockholm och omnejd</p>
  <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white min-h-screen flex items-center">
  <div className="absolute inset-0 bg-black opacity-20"></div>
  <div className="relative z-10 max-w-6xl mx-auto px-4 py-20 text-center">
    <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
      Hitta ditt drömhem
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
  <p>Anpassa din sökning efter dina behov</p>
  <section className="py-16 bg-gray-50">
  <div className="max-w-7xl mx-auto px-4">
    <div className="text-center mb-12">
      <h2 className="text-4xl font-bold text-gray-900 mb-4">Fastighetstyp</h2>
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
      <h2 className="text-4xl font-bold text-gray-900 mb-4">Prisintervall</h2>
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
      <h2 className="text-4xl font-bold text-gray-900 mb-4">Område</h2>
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
      <h2 className="text-4xl font-bold text-gray-900 mb-4">Storlek</h2>
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
  <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
  <div className="relative">
    <img src="/images/properties/penthouse-ostermalm.jpg" alt="Exklusiv penthouse Östermalm" 
         className="w-full h-48 object-cover"
         onError="this.src='https://via.placeholder.com/400x300?text=Property'" />
    
    <div className="absolute bottom-3 right-3 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm">
      Bostadsrätt
    </div>
  </div>
  
  <div className="p-6">
    <div className="flex justify-between items-start mb-3">
      <h3 className="text-xl font-bold text-gray-900 flex-1">Exklusiv penthouse Östermalm</h3>
      <div className="text-right ml-4">
        <div className="text-2xl font-bold text-blue-600">28 500 000 kr</div>
        
      </div>
    </div>
    
    <p className="text-gray-600 mb-3">Strandvägen 7A</p>
    
    <div className="grid grid-cols-3 gap-4 mb-3 text-center">
      <div>
        <div className="text-lg font-semibold text-gray-900">5</div>
        <div className="text-xs text-gray-500">rum</div>
      </div>
      <div>
        <div className="text-lg font-semibold text-gray-900">185</div>
        <div className="text-xs text-gray-500">kvm</div>
      </div>
      <div>
        <div className="text-lg font-semibold text-gray-900">154 054</div>
        <div className="text-xs text-gray-500">kr/kvm</div>
      </div>
    </div>
    
    <div className="mb-3"><div className="text-sm text-gray-600">Avgift: 8500 kr/mån</div><div className="text-sm text-gray-600">Våning: 7</div></div>
    
    <div className="mb-4"><span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded mr-1">Balkong</span><span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded mr-1">Hiss</span></div>
    
    <p className="text-gray-600 text-sm mb-4">Spektakulär takvåning med panoramautsikt över Stockholms skärgård</p>
    
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
    <img src="/images/properties/djursholm-villa.jpg" alt="Charmig sekelskiftesvilla Djursholm" 
         className="w-full h-48 object-cover"
         onError="this.src='https://via.placeholder.com/400x300?text=Property'" />
    
    <div className="absolute bottom-3 right-3 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm">
      Villa
    </div>
  </div>
  
  <div className="p-6">
    <div className="flex justify-between items-start mb-3">
      <h3 className="text-xl font-bold text-gray-900 flex-1">Charmig sekelskiftesvilla Djursholm</h3>
      <div className="text-right ml-4">
        <div className="text-2xl font-bold text-blue-600">22 000 000 kr</div>
        
      </div>
    </div>
    
    <p className="text-gray-600 mb-3">Stocksundsvägen 45</p>
    
    <div className="grid grid-cols-3 gap-4 mb-3 text-center">
      <div>
        <div className="text-lg font-semibold text-gray-900">8</div>
        <div className="text-xs text-gray-500">rum</div>
      </div>
      <div>
        <div className="text-lg font-semibold text-gray-900">280</div>
        <div className="text-xs text-gray-500">kvm</div>
      </div>
      <div>
        <div className="text-lg font-semibold text-gray-900">78 571</div>
        <div className="text-xs text-gray-500">kr/kvm</div>
      </div>
    </div>
    
    <div className="mb-3"><div className="text-sm text-gray-600">Byggår: 1905</div><div className="text-sm text-gray-600">Tomt: 1200 kvm</div></div>
    
    <div className="mb-4"><span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded mr-1">Trädgård</span><span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded mr-1">Öppen spis</span></div>
    
    <p className="text-gray-600 text-sm mb-4">Vacker sekelskiftesvilla med ursprungliga detaljer och modern komfort</p>
    
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
    <img src="/images/properties/hammarby-new.jpg" alt="Modern nyproduktion Hammarby Sjöstad" 
         className="w-full h-48 object-cover"
         onError="this.src='https://via.placeholder.com/400x300?text=Property'" />
    
    <div className="absolute bottom-3 right-3 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm">
      Bostadsrätt
    </div>
  </div>
  
  <div className="p-6">
    <div className="flex justify-between items-start mb-3">
      <h3 className="text-xl font-bold text-gray-900 flex-1">Modern nyproduktion Hammarby Sjöstad</h3>
      <div className="text-right ml-4">
        <div className="text-2xl font-bold text-blue-600">8 900 000 kr</div>
        
      </div>
    </div>
    
    <p className="text-gray-600 mb-3">Henriksdalsringen 8</p>
    
    <div className="grid grid-cols-3 gap-4 mb-3 text-center">
      <div>
        <div className="text-lg font-semibold text-gray-900">4</div>
        <div className="text-xs text-gray-500">rum</div>
      </div>
      <div>
        <div className="text-lg font-semibold text-gray-900">110</div>
        <div className="text-xs text-gray-500">kvm</div>
      </div>
      <div>
        <div className="text-lg font-semibold text-gray-900">80 909</div>
        <div className="text-xs text-gray-500">kr/kvm</div>
      </div>
    </div>
    
    <div className="mb-3"><div className="text-sm text-gray-600">Avgift: 4200 kr/mån</div><div className="text-sm text-gray-600">Våning: 3</div><div className="text-sm text-gray-600">Byggår: 2023</div></div>
    
    <div className="mb-4"><span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded mr-1">Balkong</span><span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded mr-1">Hiss</span></div>
    
    <p className="text-gray-600 text-sm mb-4">Nyrenoverad lägenhet med högt i tak och ljusa rum</p>
    
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
    <img src="/images/properties/nacka-villa.jpg" alt="Familjevänlig villa Nacka" 
         className="w-full h-48 object-cover"
         onError="this.src='https://via.placeholder.com/400x300?text=Property'" />
    
    <div className="absolute bottom-3 right-3 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm">
      Villa
    </div>
  </div>
  
  <div className="p-6">
    <div className="flex justify-between items-start mb-3">
      <h3 className="text-xl font-bold text-gray-900 flex-1">Familjevänlig villa Nacka</h3>
      <div className="text-right ml-4">
        <div className="text-2xl font-bold text-blue-600">16 500 000 kr</div>
        
      </div>
    </div>
    
    <p className="text-gray-600 mb-3">Värmdövägen 128</p>
    
    <div className="grid grid-cols-3 gap-4 mb-3 text-center">
      <div>
        <div className="text-lg font-semibold text-gray-900">6</div>
        <div className="text-xs text-gray-500">rum</div>
      </div>
      <div>
        <div className="text-lg font-semibold text-gray-900">195</div>
        <div className="text-xs text-gray-500">kvm</div>
      </div>
      <div>
        <div className="text-lg font-semibold text-gray-900">84 615</div>
        <div className="text-xs text-gray-500">kr/kvm</div>
      </div>
    </div>
    
    <div className="mb-3"><div className="text-sm text-gray-600">Byggår: 1987</div><div className="text-sm text-gray-600">Tomt: 800 kvm</div></div>
    
    <div className="mb-4"><span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded mr-1">Trädgård</span><span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded mr-1">Parkering</span></div>
    
    <p className="text-gray-600 text-sm mb-4">Perfekt familjevilla med närhet till skolor och kommunikationer</p>
    
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
    <img src="/images/properties/sodermalm-loft.jpg" alt="Trendig loft Södermalm" 
         className="w-full h-48 object-cover"
         onError="this.src='https://via.placeholder.com/400x300?text=Property'" />
    
    <div className="absolute bottom-3 right-3 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm">
      Bostadsrätt
    </div>
  </div>
  
  <div className="p-6">
    <div className="flex justify-between items-start mb-3">
      <h3 className="text-xl font-bold text-gray-900 flex-1">Trendig loft Södermalm</h3>
      <div className="text-right ml-4">
        <div className="text-2xl font-bold text-blue-600">9 200 000 kr</div>
        
      </div>
    </div>
    
    <p className="text-gray-600 mb-3">Hornsgatan 156</p>
    
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
        <div className="text-lg font-semibold text-gray-900">96 842</div>
        <div className="text-xs text-gray-500">kr/kvm</div>
      </div>
    </div>
    
    <div className="mb-3"><div className="text-sm text-gray-600">Avgift: 3800 kr/mån</div><div className="text-sm text-gray-600">Våning: 4</div><div className="text-sm text-gray-600">Byggår: 2020</div></div>
    
    
    
    <p className="text-gray-600 text-sm mb-4">Industriell charm möter modern design i hjärtat av Söder</p>
    
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
    <img src="/images/properties/vasastan-apt.jpg" alt="Elegant våning Vasastan" 
         className="w-full h-48 object-cover"
         onError="this.src='https://via.placeholder.com/400x300?text=Property'" />
    
    <div className="absolute bottom-3 right-3 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm">
      Bostadsrätt
    </div>
  </div>
  
  <div className="p-6">
    <div className="flex justify-between items-start mb-3">
      <h3 className="text-xl font-bold text-gray-900 flex-1">Elegant våning Vasastan</h3>
      <div className="text-right ml-4">
        <div className="text-2xl font-bold text-blue-600">11 500 000 kr</div>
        
      </div>
    </div>
    
    <p className="text-gray-600 mb-3">Upplandsgatan 42</p>
    
    <div className="grid grid-cols-3 gap-4 mb-3 text-center">
      <div>
        <div className="text-lg font-semibold text-gray-900">4</div>
        <div className="text-xs text-gray-500">rum</div>
      </div>
      <div>
        <div className="text-lg font-semibold text-gray-900">135</div>
        <div className="text-xs text-gray-500">kvm</div>
      </div>
      <div>
        <div className="text-lg font-semibold text-gray-900">85 185</div>
        <div className="text-xs text-gray-500">kr/kvm</div>
      </div>
    </div>
    
    <div className="mb-3"><div className="text-sm text-gray-600">Avgift: 5200 kr/mån</div><div className="text-sm text-gray-600">Våning: 2</div><div className="text-sm text-gray-600">Byggår: 1910</div></div>
    
    <div className="mb-4"><span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded mr-1">Balkong</span><span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded mr-1">Hiss</span></div>
    
    <p className="text-gray-600 text-sm mb-4">Klassisk sekelskifteslägenhet med bevarade originaldetaljer</p>
    
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
    <img src="/images/properties/varmdo-villa.jpg" alt="Havsnära villa Värmdö" 
         className="w-full h-48 object-cover"
         onError="this.src='https://via.placeholder.com/400x300?text=Property'" />
    
    <div className="absolute bottom-3 right-3 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm">
      Villa
    </div>
  </div>
  
  <div className="p-6">
    <div className="flex justify-between items-start mb-3">
      <h3 className="text-xl font-bold text-gray-900 flex-1">Havsnära villa Värmdö</h3>
      <div className="text-right ml-4">
        <div className="text-2xl font-bold text-blue-600">19 800 000 kr</div>
        
      </div>
    </div>
    
    <p className="text-gray-600 mb-3">Gustavsberg Hamn 15</p>
    
    <div className="grid grid-cols-3 gap-4 mb-3 text-center">
      <div>
        <div className="text-lg font-semibold text-gray-900">5</div>
        <div className="text-xs text-gray-500">rum</div>
      </div>
      <div>
        <div className="text-lg font-semibold text-gray-900">160</div>
        <div className="text-xs text-gray-500">kvm</div>
      </div>
      <div>
        <div className="text-lg font-semibold text-gray-900">123 750</div>
        <div className="text-xs text-gray-500">kr/kvm</div>
      </div>
    </div>
    
    <div className="mb-3"><div className="text-sm text-gray-600">Byggår: 1995</div><div className="text-sm text-gray-600">Tomt: 600 kvm</div></div>
    
    <div className="mb-4"><span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded mr-1">Trädgård</span></div>
    
    <p className="text-gray-600 text-sm mb-4">Unik läge vid havet med egen brygga och fantastisk utsikt</p>
    
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
    <img src="/images/properties/gamla-stan-apt.jpg" alt="Kompakt 1:a Gamla Stan" 
         className="w-full h-48 object-cover"
         onError="this.src='https://via.placeholder.com/400x300?text=Property'" />
    
    <div className="absolute bottom-3 right-3 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm">
      Bostadsrätt
    </div>
  </div>
  
  <div className="p-6">
    <div className="flex justify-between items-start mb-3">
      <h3 className="text-xl font-bold text-gray-900 flex-1">Kompakt 1:a Gamla Stan</h3>
      <div className="text-right ml-4">
        <div className="text-2xl font-bold text-blue-600">4 200 000 kr</div>
        
      </div>
    </div>
    
    <p className="text-gray-600 mb-3">Västerlånggatan 23</p>
    
    <div className="grid grid-cols-3 gap-4 mb-3 text-center">
      <div>
        <div className="text-lg font-semibold text-gray-900">1</div>
        <div className="text-xs text-gray-500">rum</div>
      </div>
      <div>
        <div className="text-lg font-semibold text-gray-900">42</div>
        <div className="text-xs text-gray-500">kvm</div>
      </div>
      <div>
        <div className="text-lg font-semibold text-gray-900">100 000</div>
        <div className="text-xs text-gray-500">kr/kvm</div>
      </div>
    </div>
    
    <div className="mb-3"><div className="text-sm text-gray-600">Avgift: 2100 kr/mån</div><div className="text-sm text-gray-600">Våning: 3</div><div className="text-sm text-gray-600">Byggår: 1650</div></div>
    
    
    
    <p className="text-gray-600 text-sm mb-4">Historisk charm i hjärtat av Stockholm med medeltida atmosfär</p>
    
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
    <img src="/images/properties/taby-townhouse.jpg" alt="Rymlig radhus Täby" 
         className="w-full h-48 object-cover"
         onError="this.src='https://via.placeholder.com/400x300?text=Property'" />
    
    <div className="absolute bottom-3 right-3 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm">
      Radhus
    </div>
  </div>
  
  <div className="p-6">
    <div className="flex justify-between items-start mb-3">
      <h3 className="text-xl font-bold text-gray-900 flex-1">Rymlig radhus Täby</h3>
      <div className="text-right ml-4">
        <div className="text-2xl font-bold text-blue-600">13 200 000 kr</div>
        
      </div>
    </div>
    
    <p className="text-gray-600 mb-3">Täby Park 67</p>
    
    <div className="grid grid-cols-3 gap-4 mb-3 text-center">
      <div>
        <div className="text-lg font-semibold text-gray-900">5</div>
        <div className="text-xs text-gray-500">rum</div>
      </div>
      <div>
        <div className="text-lg font-semibold text-gray-900">145</div>
        <div className="text-xs text-gray-500">kvm</div>
      </div>
      <div>
        <div className="text-lg font-semibold text-gray-900">91 034</div>
        <div className="text-xs text-gray-500">kr/kvm</div>
      </div>
    </div>
    
    <div className="mb-3"><div className="text-sm text-gray-600">Byggår: 2010</div><div className="text-sm text-gray-600">Tomt: 250 kvm</div></div>
    
    <div className="mb-4"><span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded mr-1">Trädgård</span><span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded mr-1">Parkering</span></div>
    
    <p className="text-gray-600 text-sm mb-4">Modern radhus i barnvänligt område med närhet till skolor</p>
    
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
    <img src="/images/properties/kungsholmen-apt.jpg" alt="Stilren lägenhet Kungsholmen" 
         className="w-full h-48 object-cover"
         onError="this.src='https://via.placeholder.com/400x300?text=Property'" />
    
    <div className="absolute bottom-3 right-3 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm">
      Bostadsrätt
    </div>
  </div>
  
  <div className="p-6">
    <div className="flex justify-between items-start mb-3">
      <h3 className="text-xl font-bold text-gray-900 flex-1">Stilren lägenhet Kungsholmen</h3>
      <div className="text-right ml-4">
        <div className="text-2xl font-bold text-blue-600">7 800 000 kr</div>
        
      </div>
    </div>
    
    <p className="text-gray-600 mb-3">Hantverkargatan 34</p>
    
    <div className="grid grid-cols-3 gap-4 mb-3 text-center">
      <div>
        <div className="text-lg font-semibold text-gray-900">3</div>
        <div className="text-xs text-gray-500">rum</div>
      </div>
      <div>
        <div className="text-lg font-semibold text-gray-900">88</div>
        <div className="text-xs text-gray-500">kvm</div>
      </div>
      <div>
        <div className="text-lg font-semibold text-gray-900">88 636</div>
        <div className="text-xs text-gray-500">kr/kvm</div>
      </div>
    </div>
    
    <div className="mb-3"><div className="text-sm text-gray-600">Avgift: 3600 kr/mån</div><div className="text-sm text-gray-600">Våning: 5</div></div>
    
    <div className="mb-4"><span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded mr-1">Balkong</span><span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded mr-1">Hiss</span></div>
    
    <p className="text-gray-600 text-sm mb-4">Ljus och luftig lägenhet med vacker utsikt över Riddarfjärden</p>
    
    <div className="flex space-x-2">
      <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300">
        Se detaljer
      </button>
      <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors duration-300">Boka visning</button>
    </div>
  </div>
</div>
  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-left">Header</h1>
  <p>Boka tid för visning av dessa objekt</p>
  <section className="py-16 bg-gray-50">
  <div className="max-w-7xl mx-auto px-4">
    <div className="text-center mb-12">
      <h2 className="text-4xl font-bold text-gray-900 mb-4">Lördag 14:00-15:00</h2>
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
      <h2 className="text-4xl font-bold text-gray-900 mb-4">Söndag 12:00-13:00</h2>
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
      <h2 className="text-4xl font-bold text-gray-900 mb-4">Måndag 18:00-19:00</h2>
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
      <h2 className="text-4xl font-bold text-gray-900 mb-4">Onsdag 17:30-18:30</h2>
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
  <p>Hjälp för dig som ska köpa bostad</p>
  <section className="py-16 bg-gray-50">
  <div className="max-w-7xl mx-auto px-4">
    <div className="text-center mb-12">
      <h2 className="text-4xl font-bold text-gray-900 mb-4">Finansiering</h2>
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
      <h2 className="text-4xl font-bold text-gray-900 mb-4">Besiktning</h2>
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
      <h2 className="text-4xl font-bold text-gray-900 mb-4">Juridisk hjälp</h2>
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
      <h2 className="text-4xl font-bold text-gray-900 mb-4">Budgivning</h2>
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
  <section className="py-20 bg-blue-50">
  <div className="max-w-4xl mx-auto px-4 text-center">
    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Hitta ditt drömhem idag</h2>
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
