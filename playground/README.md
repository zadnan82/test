# Frontend DSL Playground

A development environment for testing and prototyping frontend applications using the Frontend DSL Compiler.

## 🚀 Quick Start

1. **Create DSL files** in the `input_files/` directory
2. **Files are automatically compiled** to React components in `output_files/`
3. **View your components** in the browser at http://localhost:8000

## 📁 Directory Structure

```
playground/
├── input_files/          # Put your .txt DSL files here
├── output_files/         # Compiled JSX files (auto-generated)
├── templates/           # HTML templates for the web interface
├── playground_server.py # Main server script
└── README.md            # This file
```

## 🎯 DSL Syntax Examples

### Basic Elements

- `h(Hello World)` - Header
- `t(This is text)` - Paragraph
- `b(Button Text)` - Button
- `i(placeholder text)` - Input field
- `img(image-url)` - Image
- `sel(option1,option2)` - Select dropdown

### Containers

- `c(...)` - Flex column container (gap-4 by default)
- `f(...)` - Form container

### Properties

- `b(Button, onClick=alert('Hi!'))` - Button with click handler
- `i(placeholder, label=Name)` - Input with label
- `c(class=custom-classes)` - Container with custom Tailwind classes

### Nesting

```
c(class=gap-6)
h(Main Title)
c(class=gap-4)
t(Some text)
b(A button)
```

## 🔧 Running the Playground

### Prerequisites

- Python 3.8+
- Required packages: `fastapi`, `uvicorn`, `watchdog`, `jinja2`

### Installation

```bash
# Install dependencies
pip install fastapi uvicorn watchdog jinja2

# Or if you have requirements.txt in the project root
pip install -r requirements.txt
```

### Starting the Server

```bash
# From the project root directory
cd playground
python playground_server.py
```

Then open http://localhost:8003 in your browser.

## 📝 Creating Your First Component

1. Create a new file in `input_files/`, e.g., `my_component.txt`
2. Add some DSL syntax:
   ```
   h(My First Component)
   t(This is awesome!)
   b(Click Me, onClick=alert('Hello!'))
   ```
3. Save the file - it will be automatically compiled
4. View it at http://localhost:8000

## 🔄 Auto-Reload

The playground automatically watches for changes in `input_files/` and recompiles files when you save them. The web interface will update in real-time.

## 🌟 Features

- **Real-time compilation** - Changes are reflected immediately
- **Live preview** - See your components as you build them
- **Multiple files** - Work with multiple components simultaneously
- **Web interface** - Easy-to-use browser interface
- **Full-page view** - Test components in isolation
- **Tailwind CSS** - Beautiful, responsive styling out of the box

## 🛠️ Advanced Usage

### Custom Component Registration

You can register custom components by creating Python files in `sevdo_frontend/prefabs/` that define:

- `COMPONENT_TOKEN` - The DSL token for your component
- `render_prefab(args, props)` - Function that returns JSX

### Custom Styling

All components use Tailwind CSS classes. You can customize the appearance by:

- Modifying the generated JSX files
- Adding custom CSS to the HTML templates
- Using the `class` property on containers

## 📚 DSL Reference

For complete DSL documentation, see `docs/frontend_dsl.md` in the project root.

## 🐛 Troubleshooting

- **Server won't start**: Make sure port 8000 is available
- **Files not compiling**: Check the console for error messages
- **Components not displaying**: Ensure your DSL syntax is correct
- **WebSocket issues**: The server will automatically reconnect

## 🤝 Contributing

Feel free to extend the playground with:

- More example files
- Custom templates
- Additional features
- Better error handling

Happy coding! 🎉
