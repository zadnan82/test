# sevdo_backend/endpoints/_template.py
"""
Template file for creating new endpoints.
Copy this file and modify it for each new endpoint.
"""


def render_endpoint(args=None, props=None):
    """
    Render FastAPI endpoint code.

    Args:
        args: String arguments from DSL (e.g., path parameters)
        props: Dictionary of properties from DSL

    Returns:
        String containing FastAPI endpoint code
    """
    # Default values
    endpoint_path = props.get("path", "/example")
    method = props.get("method", "GET").upper()
    description = props.get("description", "Example endpoint")

    # Support for inline args parsing
    if args:
        # Parse args if needed
        # Example: args could be "path=/custom/path,method=POST"
        pass

    # Generate the endpoint code
    endpoint_code = f'''
@app.{method.lower()}("{endpoint_path}")
async def example_endpoint():
    """
    {description}
    """
    return {{"message": "Example endpoint working"}}
'''

    return endpoint_code.strip()


# Register with token "example" (change this for each endpoint)
ENDPOINT_TOKEN = "example"
