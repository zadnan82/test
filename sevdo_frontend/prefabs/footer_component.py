# sevdo_frontend/prefabs/footer_component.py
def render_prefab(args, props):
    # Default values
    company_name = props.get("companyName", "My Company")
    copyright_year = props.get("copyrightYear", "2024")
    tagline = props.get("tagline", "Building amazing products")
    links = props.get("links", ["Privacy", "Terms", "Support", "About"])
    social_media = props.get("socialMedia", ["Facebook", "Twitter", "LinkedIn"])
    background_style = props.get("backgroundStyle", "dark")  # dark or light

    # Support for nested components
    # If the args is a nested structure like "h(Company Name)"
    # we can extract and use those values
    if args:
        # Import parser when needed to avoid circular imports
        import sys
        import os

        # Get the parent directory path
        parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        if parent_dir not in sys.path:
            sys.path.append(parent_dir)
        # Import directly from the file
        from frontend_compiler import parse_dsl, _jsx_for_token

        try:
            # Try to parse args as DSL
            nodes = parse_dsl(args)
            if nodes:
                for node in nodes:
                    # Replace company name if h() token is found
                    if node.token == "h" and node.args:
                        company_name = node.args
                    # Replace tagline if t() token is found
                    elif node.token == "t" and node.args:
                        tagline = node.args
                    # Replace year if y() token is found
                    elif node.token == "y" and node.args:
                        copyright_year = node.args
                    # Replace links if l() token is found (comma-separated)
                    elif node.token == "l" and node.args:
                        links = [link.strip() for link in node.args.split(",")]
                    # Replace social media if s() token is found (comma-separated)
                    elif node.token == "s" and node.args:
                        social_media = [
                            social.strip() for social in node.args.split(",")
                        ]
                    # Replace background style if bg() token is found
                    elif node.token == "bg" and node.args:
                        background_style = node.args
        except Exception:
            # If parsing fails, just use args as the company name
            company_name = args

    # Generate link items
    link_items = "\n".join(
        [
            f'        <a href="#" className="hover:text-blue-400 transition-colors duration-200">{link}</a>'
            for link in links
        ]
    )

    # Generate social media items
    social_items = "\n".join(
        [
            f'        <a href="#" className="hover:text-blue-400 transition-colors duration-200">{social}</a>'
            for social in social_media
        ]
    )

    # Determine styling based on background
    if background_style == "light":
        bg_class = "bg-gray-100"
        text_class = "text-gray-800"
        secondary_text_class = "text-gray-600"
        hover_class = "hover:text-blue-600"
        border_class = "border-gray-200"
    else:
        bg_class = "bg-gray-800"
        text_class = "text-white"
        secondary_text_class = "text-gray-300"
        hover_class = "hover:text-blue-400"
        border_class = "border-gray-700"

    # Generate footer with customized parts
    return f"""<footer className="{bg_class} {text_class} py-12 mt-auto">
  <div className="max-w-6xl mx-auto px-4">
    <div className="grid md:grid-cols-4 gap-8"> 
       <div className="md:col-span-2">
         <h3 className="text-xl font-bold mb-4">{company_name}</h3>
         <p className="{secondary_text_class} mb-4">{tagline}</p>
         <p className="{secondary_text_class} text-sm">
           Making the world a better place through technology and innovation.
         </p>
       </div>
        
       <div>
         <h4 className="font-semibold mb-4">Quick Links</h4>
         <div className="space-y-2 text-sm {secondary_text_class}">
{link_items}
         </div>
       </div> 
       <div>
         <h4 className="font-semibold mb-4">Follow Us</h4>
         <div className="space-y-2 text-sm {secondary_text_class}">
{social_items}
         </div>
       </div>
     </div> 
    <div className="border-t {border_class} mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
      <p className="{secondary_text_class} text-sm">
        © {copyright_year} {company_name}. All rights reserved.
      </p>
      <div className="flex space-x-4 mt-4 md:mt-0 text-sm {secondary_text_class}">
        <a href="#" className="{hover_class} transition-colors duration-200">Privacy Policy</a>
        <a href="#" className="{hover_class} transition-colors duration-200">Terms of Service</a>
        <a href="#" className="{hover_class} transition-colors duration-200">Cookie Policy</a>
      </div>
    </div>
  </div>
</footer>"""


# Register with token "ft"
COMPONENT_TOKEN = "ft"
