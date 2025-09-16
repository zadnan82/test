# Template Testing in Playground

The playground now supports testing entire website templates, not just individual components!

## How to Use Templates

### 1. Create Template Structure
Templates should be placed in the main `templates/` directory with this structure:

```
templates/
├── your_template_name/
│   └── frontend/
│       ├── Home.s
│       ├── About.s
│       ├── Contact.s
│       └── Projects.s
```

### 2. Write DSL Pages
Each `.s` file contains DSL code for a page. Example:

**Home.s:**
```dsl
c(
  n(Home,About,Projects,Contact)
  h(Welcome to My Website)
  t(This is the homepage content)
  b(Learn More)
)
```

**About.s:**
```dsl
c(
  h(About Us)
  t(We are a great company)
  img(logo.png){alt=Our Logo}
)
```

### 3. Test Your Template

1. **Start the playground:**
   ```bash
   cd playground
   python playground_server.py
   ```

2. **Open browser to:** `http://localhost:8003`

3. **Use the Templates panel:**
   - See all available templates
   - Click "Compile" to compile a template
   - Click "Test Template" to view the complete website

### 4. Template Features

- **Multi-page Navigation:** Switch between pages using the top navigation bar
- **Individual Page Compilation:** Each page compiles to its own React component
- **Real-time Updates:** Templates auto-recompile when files change
- **Complete Website Preview:** See how all pages work together

## Existing Template Example

The `personal_website` template is already available and includes:
- Home page with navigation
- About page
- Projects page with dropdown
- Contact page with form

Try it out by running the playground and clicking "Test Template" on the personal_website!

## API Endpoints

- `GET /api/templates` - List all templates
- `POST /api/templates/{name}/compile` - Compile specific template
- `POST /api/templates/compile-all` - Compile all templates
- `GET /template/{name}` - View complete template with navigation

## Benefits

✅ **Test Complete Websites:** See how pages work together
✅ **Rapid Prototyping:** Quick website creation with DSL
✅ **Component Reuse:** Use prefabs across pages
✅ **Real Development Workflow:** File watching and auto-compilation
✅ **Professional Output:** Clean React components with Tailwind CSS
