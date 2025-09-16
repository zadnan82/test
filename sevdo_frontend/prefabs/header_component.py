# sevdo_frontend/prefabs/header_component.py

def render_prefab(args, props):
    # Default values
    title = props.get("text", props.get("title", "Header"))
    subtitle = props.get("subtitle", "")
    level = str(props.get("level", "h1")).lower()  # h1..h6
    variant = props.get("variant", "primary")  # primary | secondary | danger
    align = props.get("align", "left")  # left | center | right
    href = props.get("href")
    extra_class = props.get("class", "")
    subtitle_class_extra = props.get("subtitleClass", "")

    # Support for nested components
    # If args contains nested DSL like "h(Custom Title) t(Subtitle text)",
    # prefer those values for title/subtitle
    if args:
        # Import parser when needed to avoid circular imports
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
                    if node.token == "h" and node.args:
                        title = node.args
                    elif node.token == "t" and node.args:
                        subtitle = node.args
        except Exception:
            # If parsing fails, use raw args as title
            title = args

    # Normalize/validate heading level
    valid_levels = {"h1", "h2", "h3", "h4", "h5", "h6"}
    if level not in valid_levels:
        # Accept numeric too, e.g., 1..6
        if level.isdigit() and ("h" + level) in valid_levels:
            level = "h" + level
        else:
            level = "h1"

    # Typography size by level
    level_to_size = {
        "h1": "text-3xl md:text-4xl",
        "h2": "text-2xl md:text-3xl",
        "h3": "text-xl md:text-2xl",
        "h4": "text-lg md:text-xl",
        "h5": "text-base md:text-lg",
        "h6": "text-sm md:text-base",
    }
    size_classes = level_to_size.get(level, "text-3xl md:text-4xl")

    # Variant palette
    if variant == "secondary":
        title_palette = "text-gray-700"
        subtitle_palette = "text-gray-500"
    elif variant == "danger":
        title_palette = "text-red-700"
        subtitle_palette = "text-red-600"
    else:
        title_palette = "text-gray-900"
        subtitle_palette = "text-gray-600"

    # Alignment
    align_map = {"left": "text-left",
                 "center": "text-center", "right": "text-right"}
    align_class = align_map.get(align, "text-left")

    # Compose classes
    title_classes = f"{size_classes} font-bold {title_palette} {align_class}"
    if extra_class:
        title_classes = f"{title_classes} {extra_class}"

    subtitle_classes = f"mt-2 {subtitle_palette} {align_class}"
    if subtitle_class_extra:
        subtitle_classes = f"{subtitle_classes} {subtitle_class_extra}"

    # Title content (optionally linked)
    if href:
        title_content = f'<a href="{href}" className="hover:underline">{title}</a>'
    else:
        title_content = title

    # Subtitle section
    subtitle_section = ""
    if subtitle:
        subtitle_section = f"\n  <p className=\"{subtitle_classes}\">{subtitle}</p>"

    # Render with chosen heading tag
    tag = level
    return f"""<{tag} className=\"{title_classes}\">{title_content}</{tag}>{subtitle_section}"""


# Register with token "h" to override the built-in header
COMPONENT_TOKEN = "h"
