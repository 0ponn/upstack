# Obsidian Plugin Submission Checklist

This document tracks the requirements for submitting Upstack to the Obsidian plugin directory.

## ✅ Pre-Submission Checklist

### Repository Requirements
- [x] **README.md**: Comprehensive documentation with features, installation, and usage
- [x] **LICENSE**: MIT License file included
- [x] **manifest.json**: Complete with all required fields
- [x] **versions.json**: Version tracking file present
- [x] **.gitignore**: Properly configured to exclude build files

### Manifest.json Requirements
- [x] **id**: "upstack" (unique, doesn't contain "obsidian")
- [x] **name**: "Upstack"
- [x] **version**: "1.0.0" (follows semantic versioning)
- [x] **minAppVersion**: "0.15.0" (minimum Obsidian version)
- [x] **description**: Clear, descriptive plugin description
- [x] **author**: Author name (needs to be filled in)
- [x] **authorUrl**: GitHub profile URL (needs to be filled in)
- [x] **isDesktopOnly**: false (works on all platforms)

### Code Quality
- [x] **TypeScript**: Properly typed code
- [x] **Build Process**: Clean build with no errors
- [x] **No Console Errors**: Plugin loads without errors
- [x] **Error Handling**: Graceful error handling for edge cases
- [x] **Code Comments**: Well-commented code

### Functionality
- [x] **Core Features**: All documented features work correctly
- [x] **Image Embedding**: Base64 conversion works
- [x] **Mermaid Charts**: Conversion to images works
- [x] **All Markdown Features**: Tables, callouts, footnotes, etc. work
- [x] **Substack Compatibility**: Output works in Substack editor

### Documentation
- [x] **README**: Comprehensive with examples
- [x] **Usage Instructions**: Clear step-by-step guide
- [x] **Feature List**: Complete list of supported features
- [x] **Installation Guide**: Both manual and from Obsidian
- [x] **Development Guide**: Setup instructions for contributors

## 📋 Submission Steps

### 1. Update Author Information
- [ ] Update `manifest.json` with your actual name and GitHub URL
- [ ] Update README.md with your GitHub username in URLs

### 2. Create GitHub Release
- [ ] Create a new release on GitHub
- [ ] Tag version: `1.0.0` (must match manifest.json)
- [ ] Release name: "Upstack v1.0.0"
- [ ] Upload as binary attachments:
  - [ ] `main.js`
  - [ ] `manifest.json`
  - [ ] `styles.css` (if applicable - we don't have one)

### 3. Fork obsidian-releases
- [ ] Fork https://github.com/obsidianmd/obsidian-releases
- [ ] Add entry to `community-plugins.json`:
```json
{
  "id": "upstack",
  "name": "Upstack",
  "author": "Michael Layug",
  "description": "Export your Obsidian notes to Substack-compatible HTML with one click.",
  "repo": "memmmmike/upstack"
}
```

### 4. Create Pull Request
- [ ] Commit changes to your fork
- [ ] Create PR to obsidian-releases
- [ ] Fill out PR template with all checkboxes marked
- [ ] Submit PR

### 5. Address Review Feedback
- [ ] Respond to any review comments
- [ ] Make requested changes
- [ ] Update release if needed
- [ ] Comment on PR when updates are complete

## 📝 PR Template Checklist

When creating the PR, ensure all items are checked:

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
- [x] I have created a GitHub release with the required files

## 🔗 Useful Links

- [Obsidian Plugin Documentation](https://docs.obsidian.md/Plugins)
- [Submission Requirements](https://docs.obsidian.md/Plugins/Releasing/Submission+requirements+for+plugins)
- [Plugin Guidelines](https://docs.obsidian.md/Plugins/Releasing/Plugin+guidelines)
- [obsidian-releases Repository](https://github.com/obsidianmd/obsidian-releases)
