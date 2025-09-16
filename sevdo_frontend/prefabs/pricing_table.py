# sevdo_frontend/prefabs/pricing_table.py
def render_prefab(args, props):
    # Default values
    title = props.get("title", "Choose Your Plan")
    subtitle = props.get("subtitle", "Simple, transparent pricing that grows with you")
    currency = props.get("currency", "$")
    period = props.get("period", "month")
    cta_text = props.get("ctaText", "Get Started")

    # Default pricing plans
    default_plans = [
        {
            "name": "Starter",
            "price": "19",
            "popular": False,
            "description": "Perfect for small teams getting started",
            "features": [
                "Up to 5 team members",
                "10GB storage",
                "Basic support",
                "Core features",
                "Mobile apps",
            ],
            "cta": "Start Free Trial",
            "cta_style": "secondary",
        },
        {
            "name": "Professional",
            "price": "49",
            "popular": True,
            "description": "Best for growing businesses",
            "features": [
                "Up to 50 team members",
                "100GB storage",
                "Priority support",
                "Advanced features",
                "API access",
                "Custom integrations",
                "Analytics dashboard",
            ],
            "cta": "Start Free Trial",
            "cta_style": "primary",
        },
        {
            "name": "Enterprise",
            "price": "99",
            "popular": False,
            "description": "For large organizations",
            "features": [
                "Unlimited team members",
                "Unlimited storage",
                "24/7 dedicated support",
                "All features included",
                "Custom development",
                "On-premise deployment",
                "SLA guarantee",
                "Training & onboarding",
            ],
            "cta": "Contact Sales",
            "cta_style": "secondary",
        },
    ]

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
                        cta_text = node.args
                        # Update all plans with new CTA text
                        for plan in default_plans:
                            if plan["cta_style"] == "primary":
                                plan["cta"] = node.args
        except Exception:
            title = args if args else title

    # Generate pricing cards
    pricing_cards = ""
    for plan in default_plans:
        # Popular badge
        popular_badge = ""
        if plan["popular"]:
            popular_badge = """
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                </div>
            </div>"""

        # Card styling based on popularity
        card_classes = "relative bg-white rounded-2xl shadow-lg border-2 p-8 transition-all duration-300 hover:shadow-xl"
        if plan["popular"]:
            card_classes = "relative bg-white rounded-2xl shadow-xl border-2 border-blue-500 p-8 transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1"
        else:
            card_classes = "relative bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-8 transition-all duration-300 hover:shadow-xl hover:border-blue-300"

        # Features list
        features_html = ""
        for feature in plan["features"]:
            features_html += f"""
                <li className="flex items-center text-gray-600 mb-3">
                    <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    {feature}
                </li>"""

        # CTA button styling
        if plan["cta_style"] == "primary":
            button_class = "w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
        else:
            button_class = "w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-6 rounded-xl border-2 border-gray-300 hover:border-gray-400 transition-all duration-300"

        pricing_cards += f'''
        <div className="{card_classes}">{popular_badge}
            <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan["name"]}</h3>
                <p className="text-gray-600 mb-4">{plan["description"]}</p>
                <div className="mb-4">
                    <span className="text-5xl font-bold text-gray-900">{currency}{plan["price"]}</span>
                    <span className="text-gray-600">/{period}</span>
                </div>
            </div>
            <ul className="mb-8 space-y-3">{features_html}
            </ul>
            <button className="{button_class}">
                {plan["cta"]}
            </button>
        </div>'''

    return f"""<section className="py-16 bg-gray-50">
  <div className="max-w-7xl mx-auto px-4">
    <div className="text-center mb-12">
      <h2 className="text-4xl font-bold text-gray-900 mb-4">{title}</h2>
      <p className="text-xl text-gray-600 max-w-3xl mx-auto">{subtitle}</p>
    </div>
    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">{pricing_cards}
    </div>
    <div className="text-center mt-12">
      <p className="text-gray-600 mb-4">All plans include a 14-day free trial. No credit card required.</p>
      <p className="text-sm text-gray-500">
        Need something custom? <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold">Contact us</a> for enterprise solutions.
      </p>
    </div>
  </div>
</section>"""


# Register with token "pt"
COMPONENT_TOKEN = "pt"
