import React from 'react';

export default function Blog_SiteBlogPage() {
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
  <p>Explore tutorials, insights, and thoughts on web development and technology</p>
  <section className="py-12 bg-gray-50 min-h-screen">
  <div className="max-w-7xl mx-auto px-4">
    <!-- Header -->
    <div className="text-center mb-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Latest Articles</h1>
      <p className="text-xl text-gray-600 max-w-2xl mx-auto">Thoughts, tutorials, and insights</p>
    </div>

    
        <div className="mb-8">
            <div className="relative max-w-md mx-auto">
                <input 
                    type="text" 
                    placeholder="Search articles..." 
                    className="w-full px-4 py-3 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                </div>
            </div>
        </div>
    
        <div className="mb-8">
            <div className="flex flex-wrap gap-2 justify-center">
                <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 bg-blue-100 text-blue-600" data-category="all">All</button> <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 " data-category="web-development">Web Development</button> <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 " data-category="tutorial">Tutorial</button> <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 " data-category="design">Design</button> <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 " data-category="javascript">JavaScript</button> <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 " data-category="react">React</button>
            </div>
        </div>

    <!-- Blog Posts Grid/List -->
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
      
            <article className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="w-full h-48 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                    Featured Image
                </div>
                <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium mr-3">#React</span>
                        <time>March 15, 2024</time>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors cursor-pointer line-clamp-2">
                        Getting Started with React Hooks
                    </h2>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-3">
                        Learn how to use React Hooks to build more efficient and cleaner functional components in your applications.
                    </p>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">5 min read</span>
                        <span className="text-gray-500">by Jane Smith</span>
                    </div>
                </div>
            </article>
            <article className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="w-full h-48 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                    Featured Image
                </div>
                <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium mr-3">#Design</span>
                        <time>March 12, 2024</time>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors cursor-pointer line-clamp-2">
                        CSS Grid vs Flexbox: When to Use What
                    </h2>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-3">
                        A comprehensive guide to understanding the differences between CSS Grid and Flexbox and when to use each layout method.
                    </p>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">7 min read</span>
                        <span className="text-gray-500">by John Doe</span>
                    </div>
                </div>
            </article>
            <article className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="w-full h-48 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                    Featured Image
                </div>
                <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium mr-3">#Tutorial</span>
                        <time>March 10, 2024</time>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors cursor-pointer line-clamp-2">
                        Building REST APIs with Node.js
                    </h2>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-3">
                        Step-by-step tutorial on creating robust and scalable REST APIs using Node.js, Express, and MongoDB.
                    </p>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">12 min read</span>
                        <span className="text-gray-500">by Mike Johnson</span>
                    </div>
                </div>
            </article>
            <article className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="w-full h-48 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                    Featured Image
                </div>
                <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium mr-3">#JavaScript</span>
                        <time>March 8, 2024</time>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors cursor-pointer line-clamp-2">
                        Modern JavaScript ES6+ Features
                    </h2>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-3">
                        Explore the latest JavaScript features including arrow functions, destructuring, async/await, and more.
                    </p>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">8 min read</span>
                        <span className="text-gray-500">by Sarah Wilson</span>
                    </div>
                </div>
            </article>
            <article className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="w-full h-48 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                    Featured Image
                </div>
                <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium mr-3">#Web Development</span>
                        <time>March 5, 2024</time>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors cursor-pointer line-clamp-2">
                        Responsive Web Design Best Practices
                    </h2>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-3">
                        Learn the fundamental principles of responsive web design and how to create websites that work on all devices.
                    </p>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">6 min read</span>
                        <span className="text-gray-500">by Alex Brown</span>
                    </div>
                </div>
            </article>
            <article className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="w-full h-48 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                    Featured Image
                </div>
                <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium mr-3">#Tutorial</span>
                        <time>March 2, 2024</time>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors cursor-pointer line-clamp-2">
                        Introduction to TypeScript
                    </h2>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-3">
                        Discover how TypeScript can improve your JavaScript development with static typing and better tooling.
                    </p>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">10 min read</span>
                        <span className="text-gray-500">by Emma Davis</span>
                    </div>
                </div>
            </article>
    </div>

    
    <div className="flex items-center justify-center space-x-2 mt-12">
        <button className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors" disabled>
            ← Previous
        </button>
        <button className="px-3 py-2 text-sm font-medium bg-blue-600 text-white rounded-md">1</button>
        <button className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">2</button>
        <button className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">3</button>
        <span className="px-3 py-2 text-sm text-gray-500">...</span>
        <button className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">10</button>
        <button className="px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
            Next →
        </button>
    </div>

    <!-- Empty State (hidden by default) -->
    <div className="hidden text-center py-12">
      <div className="text-gray-400 mb-4">
        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
      <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
    </div>
  </div>
</section>
  <section className="py-16 bg-white border-t border-b border-gray-200">
  <div className="max-w-4xl mx-auto px-4 text-center">
    <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Transform Your Business?</h2>
    <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">Start your free trial today. No credit card required. Cancel anytime.</p>
    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
      <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-300">
        Start Free Trial
      </button>
      <button className="text-gray-600 hover:text-gray-800 font-semibold px-6 py-3 transition-colors duration-300">
        Book a Demo
      </button>
    </div>
  </div>
</section>
</>
  );
}
