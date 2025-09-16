import React from 'react';

export default function Blog_SiteArticlePage() {
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
  <article className="max-w-4xl mx-auto px-4 py-8">
    <!-- Back to Blog Navigation -->
    <nav className="mb-8">
        <button className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors duration-200">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            ← Back to Blog
        </button>
    </nav>

    <!-- Article Header -->
    <header className="mb-8">
        <div className="mb-4">
            <span className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm px-3 py-1 rounded-full mr-2 mb-2 transition-colors cursor-pointer">#web-development</span> <span className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm px-3 py-1 rounded-full mr-2 mb-2 transition-colors cursor-pointer">#programming</span> <span className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm px-3 py-1 rounded-full mr-2 mb-2 transition-colors cursor-pointer">#tutorial</span>
        </div>
        
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            How to Build Better Web Applications
        </h1>
        
        <div className="flex flex-wrap items-center text-gray-600 text-sm mb-6">
            <div className="flex items-center mr-6 mb-2">
                <div className="w-8 h-8 bg-gray-300 rounded-full mr-3"></div>
                <span className="font-medium">John Doe</span>
            </div>
            
            <div className="flex items-center mr-6 mb-2">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <time>March 15, 2024</time>
            </div>
            
            <div className="flex items-center mb-2">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>5 min read</span>
            </div>
        </div>
    </header>

    

    <!-- Article Content -->
    <div className="prose prose-lg max-w-none mb-12">
        <div className="text-gray-700 leading-relaxed text-lg">
            This is the main article content. It would contain the full text of the blog post with proper formatting and structure.
        </div>
    </div>

    <!-- Article Footer -->
    <footer className="border-t border-gray-200 pt-8">
        <!-- Share Buttons -->
        <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Share this article</h3>
            <div className="flex space-x-4">
                <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                    Twitter
                </button>
                
                <button className="inline-flex items-center px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors duration-200 text-sm">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    LinkedIn
                </button>
                
                <button className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 text-sm">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path>
                    </svg>
                    Copy Link
                </button>
            </div>
        </div>

        <!-- Author Bio -->
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-gray-300 rounded-full flex-shrink-0"></div>
                <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">About John Doe</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                        Software developer with a passion for creating beautiful, functional web applications. 
                        I love sharing knowledge and helping others learn to code.
                    </p>
                    <div className="flex space-x-4 mt-3">
                        <a href="#" className="text-blue-600 hover:text-blue-700 text-sm">Website</a>
                        <a href="#" className="text-blue-600 hover:text-blue-700 text-sm">Twitter</a>
                        <a href="#" className="text-blue-600 hover:text-blue-700 text-sm">LinkedIn</a>
                    </div>
                </div>
            </div>
        </div>

        <!-- Related Posts Placeholder -->
        <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6">Related Articles</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gray-100 rounded-lg p-4 text-center text-gray-500">
                    <p>Related post 1</p>
                    <p className="text-sm">Use blog post cards here</p>
                </div>
                <div className="bg-gray-100 rounded-lg p-4 text-center text-gray-500">
                    <p>Related post 2</p>
                    <p className="text-sm">Use blog post cards here</p>
                </div>
                <div className="bg-gray-100 rounded-lg p-4 text-center text-gray-500">
                    <p>Related post 3</p>
                    <p className="text-sm">Use blog post cards here</p>
                </div>
            </div>
        </div>
    </footer>
</article>
  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-left">Header</h1>
  <section className="py-12 bg-gray-50 min-h-screen">
  <div className="max-w-7xl mx-auto px-4">
    <!-- Header -->
    <div className="text-center mb-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Latest Articles</h1>
      <p className="text-xl text-gray-600 max-w-2xl mx-auto">Thoughts, tutorials, and insights</p>
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
