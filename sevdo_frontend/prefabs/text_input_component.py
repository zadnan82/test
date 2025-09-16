# sevdo_frontend/prefabs/text_input_component.py

def render_prefab(args, props):
    # Default values
    label = props.get("label", "Label")
    placeholder = props.get("placeholder", "Type here...")
    name_attr = props.get("name", "textInput")
    # text | email | password | search | number
    input_type = props.get("type", "text")
    size = props.get("size", "md")  # sm | md | lg
    # default | success | danger | warning
    variant = props.get("variant", "default")
    helper_text = props.get("helperText", "")
    required = props.get("required", False)
    disabled = props.get("disabled", False)
    extra_class = props.get("class", "")

    # Support for nested components and DSL overrides
    if args:
        import sys
        import os
        parent_dir = os.path.dirname(
            os.path.dirname(os.path.abspath(__file__)))
        if parent_dir not in sys.path:
            sys.path.append(parent_dir)
        from frontend_compiler import parse_dsl
        try:
            nodes = parse_dsl(args)
            if nodes:
                for node in nodes:
                    # t() maps to label text, p() maps to placeholder
                    if node.token in ("t", "h") and node.args:
                        label = node.args
                    elif node.token == "p" and node.args:
                        placeholder = node.args
        except Exception:
            # If parsing fails, treat raw args as the label
            label = args

    # Size-based classes
    if size == "sm":
        size_classes = "px-3 py-1.5 text-sm"
    elif size == "lg":
        size_classes = "px-4 py-3 text-base"
    else:
        size_classes = "px-3 py-2 text-sm"

    # Variant border/ring palette
    if variant == "success":
        palette_classes = "border-green-300 focus:ring-green-500"
        helper_palette = "text-green-600"
    elif variant == "danger":
        palette_classes = "border-red-300 focus:ring-red-500"
        helper_palette = "text-red-600"
    elif variant == "warning":
        palette_classes = "border-yellow-300 focus:ring-yellow-500"
        helper_palette = "text-yellow-700"
    else:
        palette_classes = "border-gray-300 focus:ring-blue-500"
        helper_palette = "text-gray-600"

    base_classes = f"w-full border rounded-md focus:outline-none focus:ring-2 focus:border-transparent {size_classes} {palette_classes}"
    if disabled:
        base_classes = f"{base_classes} bg-gray-100 cursor-not-allowed opacity-70"
    if extra_class:
        base_classes = f"{base_classes} {extra_class}"

    required_attr = " required" if required else ""
    disabled_attr = " disabled" if disabled else ""

    helper_block = ""
    if helper_text:
        helper_block = f"\n  <p className=\"mt-1 text-xs {helper_palette}\">{helper_text}</p>"

    return f"""<label className=\"block\">
  <span className=\"block mb-1 text-sm font-medium text-gray-700\">{label}{' *' if required else ''}</span>
  <input
    type=\"{input_type}\"
    name=\"{name_attr}\"
    placeholder=\"{placeholder}\"
    className=\"{base_classes}\"{required_attr}{disabled_attr}
  />{helper_block}
</label>"""


# Register with token "i"
COMPONENT_TOKEN = "i"
