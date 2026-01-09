# Obsidian Plugin Submission - Step by Step

## ✅ Pre-Flight Check

Everything is ready! Your plugin has:
- ✅ Complete manifest.json with author info
- ✅ README.md with comprehensive documentation
- ✅ LICENSE file (MIT)
- ✅ Clean build (main.js is 54KB)
- ✅ All files pushed to GitHub

## Step 1: Create GitHub Release

1. Go to: https://github.com/memmmmike/upstack/releases/new

2. Fill in:
   - **Tag**: `1.0.0` (must match manifest.json version exactly)
   - **Release title**: `Upstack v1.0.0`
   - **Description**: 
     ```
     Initial release of Upstack - Export your Obsidian notes to Substack-compatible HTML with one click.
     
     Features:
     - Automatic image embedding (base64)
     - Mermaid chart conversion
     - Callouts, footnotes, tables, and more
     - Substack-optimized HTML output
     ```

3. **Upload files** (drag and drop):
   - `main.js` (from `/home/mlayug/Documents/projects/upstack/main.js`)
   - `manifest.json` (from `/home/mlayug/Documents/projects/upstack/manifest.json`)

4. Click **"Publish release"**

## Step 2: Fork obsidian-releases

1. Go to: https://github.com/obsidianmd/obsidian-releases
2. Click **"Fork"** (top right)
3. Wait for fork to complete

## Step 3: Add Your Plugin Entry

1. In your fork, navigate to: `community-plugins.json`
2. Click the **pencil icon** to edit
3. Find the end of the JSON array (before the closing `]`)
4. Add a comma after the last entry, then add:

```json
,
{
  "id": "upstack",
  "name": "Upstack",
  "author": "Michael Layug",
  "description": "A 'copy for Substack' plugin :) Exports your Obsidian notes to Substack-compatible HTML with one click.",
  "repo": "memmmmike/upstack"
}
```

5. Make sure:
   - There's a comma before your entry (unless it's the first one)
   - JSON is valid (no trailing comma after your entry)
   - The `id` is unique (check existing entries)

6. Scroll down, add commit message: `Add plugin: Upstack`
7. Click **"Commit changes"**

## Step 4: Create Pull Request

1. After committing, you'll see a banner: **"Compare & pull request"** - click it
2. **PR Title**: `Add plugin: Upstack`
3. **PR Description**: Copy and paste this (mark all checkboxes):

```markdown
## Plugin Information
- **Name**: Upstack
- **ID**: upstack
- **Author**: Michael Layug
- **Repository**: memmmmike/upstack
- **Version**: 1.0.0

## Description
A 'copy for Substack' plugin :) Exports your Obsidian notes to Substack-compatible HTML with one click. Automatically converts Markdown, embeds images as base64, converts Mermaid charts, and handles callouts, footnotes, and more.

## Checklist
- [x] I have read the [Submission Requirements](https://docs.obsidian.md/Plugins/Releasing/Submission+requirements+for+plugins)
- [x] I have read the [Plugin Guidelines](https://docs.obsidian.md/Plugins/Releasing/Plugin+guidelines)
- [x] My plugin follows the [Code Style Guidelines](https://docs.obsidian.md/Plugins/Releasing/Code+style+guidelines)
- [x] My plugin is not a duplicate of an existing plugin
- [x] My plugin ID is unique and doesn't contain "obsidian"
- [x] I have tested my plugin with the latest version of Obsidian
- [x] My plugin works on both desktop and mobile
- [x] I have included a README.md file
- [x] I have included a LICENSE file
- [x] My manifest.json is complete and correct
- [x] I have created a GitHub release with the required files (main.js and manifest.json)
```

4. Click **"Create pull request"**

## Step 5: Wait for Review

- The Obsidian team will review your plugin
- They may request changes or ask questions
- Respond to any comments and make updates if needed
- Once approved, your plugin will be merged and available in the community directory!

## Quick Reference

- **Your GitHub Repo**: https://github.com/memmmmike/upstack
- **obsidian-releases**: https://github.com/obsidianmd/obsidian-releases
- **Your Fork**: https://github.com/memmmmike/obsidian-releases (after forking)
- **Release Files Location**: 
  - `main.js`: `/home/mlayug/Documents/projects/upstack/main.js`
  - `manifest.json`: `/home/mlayug/Documents/projects/upstack/manifest.json`

## JSON Entry for community-plugins.json

```json
{
  "id": "upstack",
  "name": "Upstack",
  "author": "Michael Layug",
  "description": "A 'copy for Substack' plugin :) Exports your Obsidian notes to Substack-compatible HTML with one click.",
  "repo": "memmmmike/upstack"
}
```

Good luck! 🚀
