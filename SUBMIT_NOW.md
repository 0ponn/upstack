# Obsidian Plugin Submission - Step by Step

## Pre-Flight Check

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

### 2.1: Navigate to the Repository
1. Go to: https://github.com/obsidianmd/obsidian-releases
2. This is the official Obsidian repository that contains the community plugin registry

### 2.2: Create a Fork
1. Look for the **"Fork"** button in the top-right corner of the page (next to "Star" and "Watch")
2. Click **"Fork"**
3. GitHub will ask: "Where should we fork this repository?"
   - Select your account: **memmmmike**
   - Leave the repository name as: **obsidian-releases**
4. Click **"Create fork"**
5. Wait for GitHub to create your fork (usually takes 10-30 seconds)
6. You'll be redirected to: `https://github.com/memmmmike/obsidian-releases`
7. You should see a banner at the top saying "forked from obsidianmd/obsidian-releases"

### 2.3: Verify Your Fork
- Check that the URL is: `https://github.com/memmmmike/obsidian-releases`
- You should see the repository files (including `community-plugins.json`)
- The repository should show "forked from obsidianmd/obsidian-releases" at the top

## Step 3: Add Your Plugin Entry

### 3.1: Navigate to community-plugins.json
1. In your fork (`memmmmike/obsidian-releases`), scroll down to find the file list
2. Look for the file: **`community-plugins.json`**
3. Click on **`community-plugins.json`** to open it

### 3.2: Edit the File
1. Click the **pencil icon** (✏️) in the top-right corner of the file view (next to "Raw" and "Blame")
2. This opens the file in edit mode
3. You'll see a large JSON array with many plugin entries

### 3.3: Find Where to Add Your Entry
**Option A: Add at the end (easiest)**
1. Scroll to the very bottom of the file
2. Find the last plugin entry (it will end with `}`)
3. After the closing `}` of the last entry, add a comma `,`
4. Press Enter to add a new line

**Option B: Add in alphabetical order (recommended)**
1. The plugins are typically sorted alphabetically by `id` or `name`
2. Find where "upstack" would fit alphabetically
3. Look for entries starting with "u" or entries that come after "t"
4. Add your entry in the appropriate location
5. Make sure to add a comma `,` after the previous entry's closing `}`

### 3.4: Add Your Plugin Entry
Paste this JSON (make sure it's properly formatted):

```json
{
  "id": "upstack",
  "name": "Upstack",
  "author": "Michael Layug",
  "description": "A 'copy for Substack' plugin :) Exports your Obsidian notes to Substack-compatible HTML with one click.",
  "repo": "memmmmike/upstack"
}
```

**Important formatting rules:**
- Each property should be on its own line (or properly formatted)
- Use double quotes `"` for all strings (not single quotes)
- No trailing comma after the last property
- Proper indentation (usually 2 spaces)

### 3.5: Verify JSON is Valid
1. Check that:
   - There's a comma `,` before your entry (unless it's the first entry)
   - There's NO trailing comma after your entry's closing `}`
   - All strings are in double quotes
   - The file still starts with `[` and ends with `]`
   - Your entry is properly indented

2. **Check for duplicate IDs:**
   - Use Ctrl+F (or Cmd+F) to search for `"id": "upstack"`
   - Make sure it only appears once (in your new entry)
   - If it appears elsewhere, your ID is taken - you'll need a different one

### 3.6: Commit Your Changes
1. Scroll down to the bottom of the edit page
2. You'll see a section: **"Commit changes"**
3. **Commit message** (first text box): 
   ```
   Add plugin: Upstack
   ```
4. **Extended description** (optional, second text box): Leave empty or add:
   ```
   Adds Upstack plugin to community plugins list
   ```
5. Make sure **"Commit directly to the master branch"** is selected (or your default branch)
6. Click the green **"Commit changes"** button

### 3.7: Verify Your Commit
1. After committing, you'll see a confirmation page
2. You should see your commit message: "Add plugin: Upstack"
3. The file should show your new entry in `community-plugins.json`
4. You're now ready to create the pull request!

## Step 4: Create Pull Request

### 4.1: Navigate to Your Fork
1. After committing in Step 3, GitHub will show a yellow banner at the top of your fork's page
2. The banner says: **"Compare & pull request"** - click this button
3. **OR** manually navigate to: https://github.com/memmmmike/obsidian-releases
4. You should see a banner saying "This branch is X commits ahead of obsidianmd:master" - click **"Pull request"**

### 4.2: Set Up the Pull Request
1. **Base repository**: Should be `obsidianmd/obsidian-releases` (the original)
2. **Base branch**: Should be `master` (not `main`)
3. **Compare repository**: Should be `memmmmike/obsidian-releases` (your fork)
4. **Compare branch**: Should be the branch you just committed to (usually `master` or `main`)

### 4.3: Fill Out the PR Form

**PR Title** (required):
```
Add plugin: Upstack
```

**PR Description** (required):
Copy and paste this entire block (make sure all checkboxes are marked with `[x]`):

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

**Important Notes:**
- Make sure ALL checkboxes are marked with `[x]` (not `[ ]`)
- The description should match your plugin's actual information
- Double-check that your GitHub release exists and has the correct files

### 4.4: Review the Changes
Before submitting, GitHub will show you a diff of what changed:
- You should see your plugin entry added to `community-plugins.json`
- It should be in alphabetical order (or near the end if you added it at the end)
- Verify the JSON is valid (no syntax errors)

### 4.5: Submit the PR
1. Click the green **"Create pull request"** button
2. You'll be taken to the PR page where you can see:
   - Your PR title and description
   - The file changes (diff)
   - Any automated checks that run
3. The PR is now submitted and waiting for review!

### 4.6: What Happens Next
- The Obsidian team will review your PR (this can take days or weeks)
- They may:
  - Ask questions in the PR comments
  - Request changes
  - Approve and merge it
- You'll get email notifications for any activity on the PR
- Once merged, your plugin will appear in Obsidian's community plugin browser!

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

Good luck!
