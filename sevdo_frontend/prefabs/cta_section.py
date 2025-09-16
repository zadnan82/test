# sevdo_frontend/prefabs/cta_section.py
def render_prefab(args, props):
    # Default values
    title = props.get("title", "Ready to Transform Your Business?")
    subtitle = props.get(
        "subtitle", "Join 10,000+ companies already using our platform"
    )
    description = props.get(
        "description",
        "Start your free trial today. No credit card required. Cancel anytime.",
    )
    primary_button = props.get("primaryButton", "Start Free Trial")
    secondary_button = props.get("secondaryButton", "Book a Demo")
    style = props.get("style", "centered")  # centered, split, gradient, minimal
    urgency = props.get("urgency", "true")  # Show urgency elements
    testimonial = props.get(
        "testimonial", "This platform increased our productivity by 300%"
    )
    testimonial_author = props.get("testimonialAuthor", "Sarah Chen, CEO at TechCorp")

    # Support for nested components
    if args:
        import sys
        import os

        parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        if parent_dir not in sys.path:
            sys.path.append(parent_dir)
        from frontend_compiler import parse_dsl, _jsx_for_token

        try:
            nodes = parse_dsl(args)
            if nodes:
                for node in nodes:
                    if node.token == "h" and node.args:
                        title = node.args
                    elif node.token == "t" and node.args:
                        subtitle = node.args
                    elif node.token == "b" and node.args:
                        primary_button = node.args
        except Exception:
            title = args if args else title

    # Urgency elements
    urgency_html = ""
    if urgency == "true":
        urgency_html = """
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
        </div>"""

    # Style-specific layouts
    if style == "gradient":
        return f'''<section className="relative py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white overflow-hidden">
  <div className="absolute inset-0 bg-black opacity-20"></div>
  <div className="absolute inset-0">
    <div className="absolute top-10 left-10 w-72 h-72 bg-white opacity-10 rounded-full blur-3xl"></div>
    <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-300 opacity-10 rounded-full blur-3xl"></div>
  </div>
  <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
    <h2 className="text-5xl md:text-6xl font-bold mb-6">{title}</h2>
    <p className="text-xl md:text-2xl mb-4 text-blue-100">{subtitle}</p>
    <p className="text-lg mb-8 text-blue-200 max-w-2xl mx-auto">{description}</p>
    {urgency_html}
    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
      <button className="bg-white text-blue-600 hover:bg-blue-50 font-bold px-8 py-4 rounded-xl text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
        {primary_button}
      </button>
      <button className="border-2 border-white text-white hover:bg-white hover:text-blue-600 font-semibold px-8 py-4 rounded-xl text-lg transition-all duration-300">
        {secondary_button}
      </button>
    </div>
    <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6 max-w-2xl mx-auto">
      <p className="text-lg italic mb-3">"{testimonial}"</p>
      <p className="text-blue-200 font-semibold">{testimonial_author}</p>
    </div>
  </div>
</section>'''

    elif style == "split":
        return f'''<section className="py-20 bg-gray-50">
  <div className="max-w-7xl mx-auto px-4">
    <div className="grid lg:grid-cols-2 gap-12 items-center">
      <div>
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">{title}</h2>
        <p className="text-xl text-gray-600 mb-4">{subtitle}</p>
        <p className="text-lg text-gray-600 mb-8">{description}</p>
        {urgency_html}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-xl text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            {primary_button}
          </button>
          <button className="border-2 border-gray-300 text-gray-700 hover:bg-gray-100 font-semibold px-8 py-4 rounded-xl text-lg transition-all duration-300">
            {secondary_button}
          </button>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <p className="text-gray-700 italic mb-3">"{testimonial}"</p>
          <p className="text-gray-600 font-semibold">{testimonial_author}</p>
        </div>
      </div>
      <div className="relative">
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-8 text-white">
          <div className="text-center">
            <div className="text-6xl mb-4">🚀</div>
            <h3 className="text-2xl font-bold mb-4">Ready to Launch?</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-white bg-opacity-20 rounded-lg p-3">
                <div className="font-bold text-2xl">10K+</div>
                <div>Happy Users</div>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-3">
                <div className="font-bold text-2xl">99.9%</div>
                <div>Uptime</div>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-3">
                <div className="font-bold text-2xl">24/7</div>
                <div>Support</div>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-3">
                <div className="font-bold text-2xl">5min</div>
                <div>Setup</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>'''

    elif style == "minimal":
        return f"""<section className="py-16 bg-white border-t border-b border-gray-200">
  <div className="max-w-4xl mx-auto px-4 text-center">
    <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
    <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">{description}</p>
    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
      <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-300">
        {primary_button}
      </button>
      <button className="text-gray-600 hover:text-gray-800 font-semibold px-6 py-3 transition-colors duration-300">
        {secondary_button}
      </button>
    </div>
  </div>
</section>"""

    else:  # centered (default)
        return f'''<section className="py-20 bg-blue-50">
  <div className="max-w-4xl mx-auto px-4 text-center">
    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">{title}</h2>
    <p className="text-xl text-gray-600 mb-4">{subtitle}</p>
    <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">{description}</p>
    {urgency_html}
    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
      <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-xl text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
        {primary_button}
      </button>
      <button className="border-2 border-gray-300 text-gray-700 hover:bg-white font-semibold px-8 py-4 rounded-xl text-lg transition-all duration-300">
        {secondary_button}
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
        <p className="text-gray-700 italic mb-3">"{testimonial}"</p>
        <p className="text-gray-600 font-semibold">{testimonial_author}</p>
      </div>
    </div>
  </div>
</section>'''


# Register with token "cta"
COMPONENT_TOKEN = "cta"
