import React from 'react';

export default function Wedding_SitePaketPage() {
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
  <p>Välj det paket som passar er dröm och budget</p>
  <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white min-h-screen flex items-center">
  <div className="absolute inset-0 bg-black opacity-20"></div>
  <div className="relative z-10 max-w-6xl mx-auto px-4 py-20 text-center">
    <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
      Från intima ceremonier till storslagna fester
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
  <div className="relative bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl shadow-xl border-2 border-pink-300 p-8 transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-2">
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <div className="bg-pink-600 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                Mest populär
            </div>
        </div>
  <div className="text-center mb-8">
    <h3 className="text-3xl font-bold text-gray-900 mb-3">Romantisk start</h3>
    <p className="text-gray-600 mb-6 leading-relaxed">Perfekt för intima bröllop med närmaste familj och vänner</p>
    
    <div className="mb-6">
      <span className="text-5xl font-bold text-pink-600">45 000</span>
      <span className="text-gray-600 text-lg"> kr</span>
    </div>
    
    <div className="grid grid-cols-2 gap-4 mb-6">
      <div className="bg-white bg-opacity-50 rounded-lg p-3">
        <div className="text-2xl font-bold text-gray-900">50</div>
        <div className="text-sm text-gray-600">gäster</div>
      </div>
      <div className="bg-white bg-opacity-50 rounded-lg p-3">
        <div className="text-lg font-bold text-gray-900">6 timmar</div>
        <div className="text-sm text-gray-600">varaktighet</div>
      </div>
    </div>
  </div>
  
  <div className="mb-8">
    <h4 className="text-lg font-semibold text-gray-800 mb-4">Ingår i paketet:</h4>
    <ul className="space-y-2">
                <li className="flex items-start text-gray-600 mb-3">
                    <svg className="w-5 h-5 text-pink-500 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                    </svg>
                    [Grundläggande planering
                </li>
    </ul>
  </div>
  
  <button className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg">
    Välj detta paket
  </button>
  
  <div className="text-center mt-4">
    <button className="text-pink-600 hover:text-pink-700 font-semibold text-sm transition-colors duration-300">
      Anpassa paketet →
    </button>
  </div>
</div>
  <div className="relative bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl shadow-xl border-2 border-pink-300 p-8 transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-2">
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <div className="bg-pink-600 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                Mest populär
            </div>
        </div>
  <div className="text-center mb-8">
    <h3 className="text-3xl font-bold text-gray-900 mb-3">Drömbröllopet</h3>
    <p className="text-gray-600 mb-6 leading-relaxed">Vårt mest populära paket med allt för en perfekt bröllopdag</p>
    
    <div className="mb-6">
      <span className="text-5xl font-bold text-pink-600">85 000</span>
      <span className="text-gray-600 text-lg"> kr</span>
    </div>
    
    <div className="grid grid-cols-2 gap-4 mb-6">
      <div className="bg-white bg-opacity-50 rounded-lg p-3">
        <div className="text-2xl font-bold text-gray-900">100</div>
        <div className="text-sm text-gray-600">gäster</div>
      </div>
      <div className="bg-white bg-opacity-50 rounded-lg p-3">
        <div className="text-lg font-bold text-gray-900">8 timmar</div>
        <div className="text-sm text-gray-600">varaktighet</div>
      </div>
    </div>
  </div>
  
  <div className="mb-8">
    <h4 className="text-lg font-semibold text-gray-800 mb-4">Ingår i paketet:</h4>
    <ul className="space-y-2">
                <li className="flex items-start text-gray-600 mb-3">
                    <svg className="w-5 h-5 text-pink-500 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                    </svg>
                    [Fullständig planering
                </li>
    </ul>
  </div>
  
  <button className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg">
    Välj detta paket
  </button>
  
  <div className="text-center mt-4">
    <button className="text-pink-600 hover:text-pink-700 font-semibold text-sm transition-colors duration-300">
      Anpassa paketet →
    </button>
  </div>
</div>
  <div className="relative bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl shadow-xl border-2 border-pink-300 p-8 transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-2">
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <div className="bg-pink-600 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                Mest populär
            </div>
        </div>
  <div className="text-center mb-8">
    <h3 className="text-3xl font-bold text-gray-900 mb-3">Lyxig celebration</h3>
    <p className="text-gray-600 mb-6 leading-relaxed">Ultimata lyxupplevelsen för er stora dag</p>
    
    <div className="mb-6">
      <span className="text-5xl font-bold text-pink-600">150 000</span>
      <span className="text-gray-600 text-lg"> kr</span>
    </div>
    
    <div className="grid grid-cols-2 gap-4 mb-6">
      <div className="bg-white bg-opacity-50 rounded-lg p-3">
        <div className="text-2xl font-bold text-gray-900">150</div>
        <div className="text-sm text-gray-600">gäster</div>
      </div>
      <div className="bg-white bg-opacity-50 rounded-lg p-3">
        <div className="text-lg font-bold text-gray-900">10 timmar</div>
        <div className="text-sm text-gray-600">varaktighet</div>
      </div>
    </div>
  </div>
  
  <div className="mb-8">
    <h4 className="text-lg font-semibold text-gray-800 mb-4">Ingår i paketet:</h4>
    <ul className="space-y-2">
                <li className="flex items-start text-gray-600 mb-3">
                    <svg className="w-5 h-5 text-pink-500 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                    </svg>
                    [Premiumplanering
                </li>
    </ul>
  </div>
  
  <button className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg">
    Välj detta paket
  </button>
  
  <div className="text-center mt-4">
    <button className="text-pink-600 hover:text-pink-700 font-semibold text-sm transition-colors duration-300">
      Anpassa paketet →
    </button>
  </div>
</div>
  <div className="relative bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl shadow-xl border-2 border-pink-300 p-8 transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-2">
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <div className="bg-pink-600 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                Mest populär
            </div>
        </div>
  <div className="text-center mb-8">
    <h3 className="text-3xl font-bold text-gray-900 mb-3">Destination wedding</h3>
    <p className="text-gray-600 mb-6 leading-relaxed">Magiskt bröllop på er drömplats utomlands</p>
    
    <div className="mb-6">
      <span className="text-5xl font-bold text-pink-600">120 000</span>
      <span className="text-gray-600 text-lg"> kr</span>
    </div>
    
    <div className="grid grid-cols-2 gap-4 mb-6">
      <div className="bg-white bg-opacity-50 rounded-lg p-3">
        <div className="text-2xl font-bold text-gray-900">75</div>
        <div className="text-sm text-gray-600">gäster</div>
      </div>
      <div className="bg-white bg-opacity-50 rounded-lg p-3">
        <div className="text-lg font-bold text-gray-900">3 dagar</div>
        <div className="text-sm text-gray-600">varaktighet</div>
      </div>
    </div>
  </div>
  
  <div className="mb-8">
    <h4 className="text-lg font-semibold text-gray-800 mb-4">Ingår i paketet:</h4>
    <ul className="space-y-2">
                <li className="flex items-start text-gray-600 mb-3">
                    <svg className="w-5 h-5 text-pink-500 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                    </svg>
                    [Resplanering och koordinering
                </li>
    </ul>
  </div>
  
  <button className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg">
    Välj detta paket
  </button>
  
  <div className="text-center mt-4">
    <button className="text-pink-600 hover:text-pink-700 font-semibold text-sm transition-colors duration-300">
      Anpassa paketet →
    </button>
  </div>
</div>
  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-left">Header</h1>
  <p>Gör ert bröllop ännu mer speciellt</p>
  <section className="py-16 bg-gray-50">
  <div className="max-w-7xl mx-auto px-4">
    <div className="text-center mb-12">
      <h2 className="text-4xl font-bold text-gray-900 mb-4">Extra fotografi</h2>
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
      <h2 className="text-4xl font-bold text-gray-900 mb-4">Videografi</h2>
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
      <h2 className="text-4xl font-bold text-gray-900 mb-4">Livemusik</h2>
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
      <h2 className="text-4xl font-bold text-gray-900 mb-4">Specialdekoration</h2>
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
      <h2 className="text-4xl font-bold text-gray-900 mb-4">Gästaktiviteter</h2>
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
      <h2 className="text-4xl font-bold text-gray-900 mb-4">Spa & skönhet</h2>
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
      <h2 className="text-4xl font-bold text-gray-900 mb-4">Flexibla paket</h2>
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
      <h2 className="text-4xl font-bold text-gray-900 mb-4">Säsongsrabatter</h2>
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
      <h2 className="text-4xl font-bold text-gray-900 mb-4">Familjerabatt</h2>
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
      <h2 className="text-4xl font-bold text-gray-900 mb-4">Betalningsplan</h2>
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
      <h2 className="text-4xl font-bold text-gray-900 mb-4">Personlig konsultation</h2>
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
      <h2 className="text-4xl font-bold text-gray-900 mb-4">Leverantörskoordinering</h2>
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
      <h2 className="text-4xl font-bold text-gray-900 mb-4">Tidsplanering</h2>
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
      <h2 className="text-4xl font-bold text-gray-900 mb-4">Krisberedskap</h2>
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
      <h2 className="text-4xl font-bold text-gray-900 mb-4">Obegränsad support</h2>
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
  <p>Transparent prissättning utan dolda kostnader</p>
  <section className="py-16 bg-gray-50">
  <div className="max-w-7xl mx-auto px-4">
    <div className="text-center mb-12">
      <h2 className="text-4xl font-bold text-gray-900 mb-4">Grundpris</h2>
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
      <h2 className="text-4xl font-bold text-gray-900 mb-4">Extra gäster</h2>
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
      <h2 className="text-4xl font-bold text-gray-900 mb-4">Helger och högsäsong</h2>
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
      <h2 className="text-4xl font-bold text-gray-900 mb-4">Resekostnader</h2>
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
    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Redo att börja planera?</h2>
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
