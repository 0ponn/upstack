# Upstack

Export your Obsidian notes to Substack-compatible HTML with one click. Automatically converts Markdown to clean, semantic HTML optimized for Substack's editor, including embedded images, Mermaid charts, callouts, and more.

## ✨ Features

### 🎯 Core Functionality
- **One-Click Export**: Copy your note as Substack-ready HTML with a single click
- **Automatic Image Embedding**: Local images are automatically converted to base64 data URIs and embedded directly in the HTML
- **Substack-Optimized**: Output is clean, semantic HTML that works perfectly in Substack's editor

### 📝 Markdown Support

#### Images
- **Obsidian-style images**: `![[image.png|caption]]` → Automatically converted to base64 and embedded
- **Standard Markdown images**: `![caption](image.png)` → Converted to `<figure>` tags with captions
- **Aspect ratio containers**: Images use responsive containers to prevent layout shift
- **Excalidraw support**: Excalidraw files are detected and converted (manual upload required)

#### Diagrams & Charts
- **Mermaid charts**: Automatically converted to PNG images via mermaid.ink API
- Supports flowcharts, sequence diagrams, and all Mermaid diagram types

#### Content Formatting
- **Callouts/Admonitions**: All 8 types (note, tip, important, warning, error, success, question, info)
- **Highlights**: `==text==` → Styled `<mark>` tags
- **Footnotes**: Clickable references with footnotes section at bottom
- **Tables**: Converted to text format with separators (Substack requires Datawrapper for HTML tables)
- **Code blocks**: Styled with syntax highlighting support
- **Task lists**: Checkboxes (☐/☑) for todo items
- **Wikilinks**: `[[link]]` → Standard markdown links

#### Typography
- **Headings**: All 6 levels (H1-H6) with Substack-optimized styling
- **Text formatting**: Bold, italic, strikethrough, inline code
- **Blockquotes**: Styled quote blocks
- **Lists**: Ordered and unordered, with nested support
- **Horizontal rules**: Clean divider lines

## 🚀 Installation

### From Obsidian (Recommended)

1. Open Obsidian Settings → Community Plugins
2. Disable Safe Mode
3. Click "Browse" and search for "Upstack"
4. Click "Install" then "Enable"

### Manual Installation

1. Download the latest release from [GitHub Releases](https://github.com/memmmmike/upstack/releases)
2. Extract the files to your vault's `.obsidian/plugins/upstack/` folder:
   - `main.js`
   - `manifest.json`
3. Reload Obsidian
4. Enable the plugin in Settings → Community Plugins

## 📖 Usage

### Quick Start

1. Open any Markdown note in Obsidian
2. Click the **Upstack icon** (stylized "U") in the ribbon, OR
3. Use the command palette: **"Copy current note as Substack-compatible HTML"**
4. The HTML is automatically copied to your clipboard
5. Paste directly into Substack's editor

### Example

```markdown
# My Article Title

Here's an image:
![[my-image.png|This is a caption]]

> [!tip]
> This is a helpful tip!

Here's a Mermaid chart:
```mermaid
graph TD
    A[Start] --> B[End]
```
```

When you copy this note, it will be converted to clean HTML with:
- The image embedded as base64
- The callout styled as a tip box
- The Mermaid chart converted to a PNG image

## 🎨 Supported Features

### ✅ Fully Supported

| Feature | Obsidian Syntax | Substack Output |
|---------|----------------|-----------------|
| **Images** | `![[image.png\|caption]]` | Base64 embedded `<figure>` |
| **Mermaid Charts** | ` ```mermaid ... ``` ` | PNG image via mermaid.ink |
| **Callouts** | `> [!note]` | Styled blockquote |
| **Highlights** | `==text==` | `<mark>` tag |
| **Footnotes** | `[^1]` | Clickable superscript links |
| **Tables** | `\| Col1 \| Col2 \|` | Text format with separators |
| **Code Blocks** | ` ```code``` ` | Styled `<pre><code>` |
| **Task Lists** | `- [ ]` / `- [x]` | Checkboxes (☐/☑) |
| **Wikilinks** | `[[link]]` | Standard markdown links |
| **Headings** | `# H1` to `###### H6` | Semantic HTML headings |
| **Text Formatting** | `**bold**`, `*italic*` | Styled HTML |
| **Lists** | `- item` / `1. item` | HTML lists |
| **Blockquotes** | `> quote` | Styled blockquote |
| **Horizontal Rules** | `---` | `<hr>` tag |

### 📋 Notes

- **Tables**: Substack doesn't support HTML tables directly. Tables are converted to a readable text format with vertical bar separators. For complex tables, consider using [Datawrapper](https://app.datawrapper.de).
- **Excalidraw**: Excalidraw files are detected but require manual export and upload to Substack.
- **Large Images**: Very large images (>1MB) may cause issues. Consider compressing images before embedding.

## 🛠️ Development

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Setup

```bash
# Clone the repository
git clone git@github.com:memmmmike/upstack.git
cd upstack

# Install dependencies
npm install

# Build for production
npm run build

# Build in watch mode (for development)
npm run dev
```

### Project Structure

```
upstack/
├── main.ts          # Main plugin code
├── manifest.json    # Plugin manifest
├── package.json     # Dependencies
├── tsconfig.json    # TypeScript config
├── esbuild.config.mjs  # Build configuration
└── versions.json    # Version tracking
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Obsidian API](https://docs.obsidian.md/)
- Uses [marked](https://github.com/markedjs/marked) for Markdown parsing
- Mermaid charts powered by [mermaid.ink](https://mermaid.ink/)

## 📧 Support

- **Issues**: [GitHub Issues](https://github.com/memmmmike/upstack/issues)
- **Discussions**: [GitHub Discussions](https://github.com/memmmmike/upstack/discussions)

## 🗺️ Roadmap

- [ ] Image compression before base64 conversion
- [ ] Support for more diagram types
- [ ] Custom styling options
- [ ] Batch export for multiple notes
- [ ] Export to other platforms (Medium, Ghost, etc.)

---

**Made with ❤️ for the Obsidian and Substack communities**
