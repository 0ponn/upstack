import { App, Plugin, PluginSettingTab, Setting, Notice, MarkdownView, addIcon, Platform } from 'obsidian';
import { marked } from 'marked';

export default class UpstackPlugin extends Plugin {
	async onload() {
		console.log('Upstack plugin loading...');
		
		// Test that plugin is loading
		new Notice('Upstack plugin is loading!');
		
		// 1. Add Ribbon Icon with custom stylized "U" icon (Desktop only - ribbon not available on mobile)
		// Create a custom SVG icon for "U" - modern, clean design
		if (Platform.isDesktopApp) {
			addIcon('upstack-icon', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<path d="M7 4v12c0 2.5 2 4.5 4.5 4.5s4.5-2 4.5-4.5V4"/>
				<path d="M7 4h10"/>
			</svg>`);
			
			this.addRibbonIcon('upstack-icon', 'Copy for Substack', () => {
				console.log('Upstack: Ribbon icon clicked');
				this.copySubstackHtml();
			});
		}

		// 2. Add Command Palette Entry
		this.addCommand({
			id: 'copy-for-substack',
			name: 'Copy current note as Substack-compatible HTML',
			checkCallback: (checking: boolean) => {
				const leaf = this.app.workspace.getActiveViewOfType(MarkdownView);
				if (leaf) {
					if (!checking) {
						console.log('Upstack: Command palette command executed');
						this.copySubstackHtml();
					}
					return true;
				}
				return false;
			}
		});
		
		console.log('Upstack plugin loaded successfully!');
		new Notice('Upstack plugin loaded successfully!');
	}

	async copySubstackHtml() {
		const view = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (!view) return;

		try {
			// Get the Markdown content
			const markdown = view.getViewData();
			
			// Transform logic will go here (Cursor will fill this in)
			const htmlOutput = await this.transformForSubstack(markdown, view);

			// Debug: Log the HTML output (first 2000 chars to see tables)
			console.log('Upstack: Generated HTML (first 2000 chars):', htmlOutput.substring(0, 2000));
			console.log('Upstack: Full HTML length:', htmlOutput.length);
			// Check specifically for tables in output and show table content
			// Note: Our table renderer converts tables to <p> tags with text format, not <table> tags
			const hasTextTableFormat = htmlOutput.includes(' | ') && htmlOutput.includes('</strong><br />');
			const hasHtmlTable = htmlOutput.includes('<table');
			
			if (hasTextTableFormat || hasHtmlTable) {
				console.log('Upstack: ✅ Tables found in HTML output!');
				// Check for our text-based table format
				const textTableMatches = htmlOutput.match(/<strong[^>]*>.*?\|.*?<\/strong><br \/>/g);
				if (textTableMatches) {
					console.log('Upstack: Found', textTableMatches.length, 'text-based table headers');
					console.log('Upstack: First table header:', textTableMatches[0]?.substring(0, 200));
				}
				// Also check for HTML tables (shouldn't exist, but just in case)
				if (hasHtmlTable) {
					const htmlTableMatches = htmlOutput.match(/<table[^>]*>/gi);
					if (htmlTableMatches) {
						console.log('Upstack: Found', htmlTableMatches.length, 'HTML tables');
					}
				}
			} else {
				console.warn('Upstack: ⚠️ No tables found in HTML output (checking for text format with | separators)');
			}
			
			// THE KEY: Writing to clipboard as 'text/html'
			const blob = new Blob([htmlOutput], { type: 'text/html' });
			const data = [new ClipboardItem({ 'text/html': blob })];

			await navigator.clipboard.write(data);
			new Notice('Upstack: Copied to clipboard for Substack! Check console for HTML preview.');
		} catch (err) {
			console.error('Upstack Error:', err);
			new Notice('Upstack failed to copy. Check console.');
		}
	}

	async processImages(md: string, pattern: RegExp, view: MarkdownView | undefined, hasCaption: boolean): Promise<string> {
		console.log('Upstack: processImages called, pattern:', pattern.source, 'hasCaption:', hasCaption);
		
		// Use a global regex to find all matches
		const matches: RegExpMatchArray[] = [];
		let match;
		// Reset regex lastIndex to ensure we find all matches
		pattern.lastIndex = 0;
		while ((match = pattern.exec(md)) !== null) {
			matches.push(match);
		}
		
		console.log('Upstack: Found', matches.length, 'image matches');
		
		// Process matches in reverse order to maintain correct indices when replacing
		for (let i = matches.length - 1; i >= 0; i--) {
			const match = matches[i];
			if (!match) continue;
			
			console.log('Upstack: Processing image match:', match[0]);
			
			// For images with caption pattern: match[1] = path, match[3] = caption
			// For images without caption pattern: match[1] = path
			const imagePath = match[1];
			const caption = hasCaption ? (match[3] || '') : '';
			
			try {
				// Try to resolve and read the image file
				if (!view?.file?.path) {
					console.warn('Upstack: No view or file path for image:', imagePath);
					continue;
				}
				
				// Resolve the image path relative to the current file
				// TypeScript doesn't narrow properly, so we use non-null assertion
				// @ts-ignore - We've already checked that path exists above
				const resolvedPath = this.app.metadataCache.getFirstLinkpathDest(imagePath, view.file.path!);
				
				if (!resolvedPath) {
					console.warn('Upstack: Could not resolve image path:', imagePath, 'from file:', view.file.path);
					// Fall through to fallback
				} else if (resolvedPath.path) {
					console.log('Upstack: Resolved image path:', imagePath, '->', resolvedPath.path);
					// Read the image file as binary
					const imageData = await this.app.vault.adapter.readBinary(resolvedPath.path);
					
					// Convert to base64 - use chunk-based approach to handle large images
					// The spread operator approach fails for large images
					const uint8Array = new Uint8Array(imageData);
					let binaryString = '';
					const chunkSize = 8192; // Process in chunks to avoid stack overflow
					for (let i = 0; i < uint8Array.length; i += chunkSize) {
						const chunk = uint8Array.subarray(i, i + chunkSize);
						binaryString += String.fromCharCode.apply(null, Array.from(chunk));
					}
					const base64 = btoa(binaryString);
					
					// Determine MIME type from file extension
					const ext = resolvedPath.extension.toLowerCase();
					const mimeTypes: Record<string, string> = {
						'png': 'image/png',
						'jpg': 'image/jpeg',
						'jpeg': 'image/jpeg',
						'gif': 'image/gif',
						'svg': 'image/svg+xml',
						'webp': 'image/webp',
					};
					const mimeType = mimeTypes[ext] || 'image/png';
					
					// Create data URI
					const dataUri = `data:${mimeType};base64,${base64}`;
					
					// Replace in markdown with data URI
					const replacement = hasCaption ? `![${caption}](${dataUri})` : `![](${dataUri})`;
					md = md.replace(match[0], replacement);
					
					console.log('Upstack: ✅ Converted image to base64:', imagePath, 'Size:', base64.length, 'chars');
					continue;
				} else {
					console.warn('Upstack: Resolved path exists but has no path property:', resolvedPath);
				}
			} catch (error) {
				console.error('Upstack: ❌ Error converting image to base64:', imagePath, error);
			}
			
			// Fallback: convert to standard markdown format (empty src)
			const fallback = hasCaption ? `![${caption}](${imagePath})` : `![](${imagePath})`;
			md = md.replace(match[0], fallback);
		}
		
		return md;
	}

	async transformForSubstack(md: string, view?: MarkdownView): Promise<string> {
		try {
			console.log('Upstack: Starting transformation...');
			
			// Step 1: Convert Mermaid charts to images using mermaid.ink API
			// Mermaid code blocks: ```mermaid ... ```
			const mermaidPattern = /```mermaid\n([\s\S]*?)```/g;
			md = md.replace(mermaidPattern, (match, mermaidCode) => {
				console.log('Upstack: Found Mermaid chart, converting to image...');
				// Encode mermaid code to base64 for mermaid.ink API
				// Try PNG format instead of SVG - might be more compatible with Substack
				try {
					const encoded = btoa(unescape(encodeURIComponent(mermaidCode.trim())))
						.replace(/\+/g, '-')
						.replace(/\//g, '_')
						.replace(/=+$/, '');
					// Use PNG format instead of SVG
					const mermaidImageUrl = `https://mermaid.ink/img/${encoded}`;
					console.log('Upstack: Mermaid PNG image URL generated');
					// Return as simple markdown image - let the image renderer handle it
					return `\n\n![Mermaid Chart](${mermaidImageUrl})\n\n`;
				} catch (error) {
					console.error('Upstack: Error encoding Mermaid chart:', error);
					// Fallback: return as plain text note
					return `\n\n<p style="color: #999; font-style: italic; margin: 32px 0;">[Mermaid chart - error rendering]</p>\n\n`;
				}
			});
			
			// Step 2: Handle Excalidraw files
			// Excalidraw files: ![[drawing.excalidraw]] or ![[drawing.excalidraw|caption]]
			// Since local images can't be pasted into Substack, we preserve the caption
			// but leave src empty (user needs to upload the exported PNG/SVG separately)
			const excalidrawPattern = /!\[\[([^\]]+\.excalidraw)(?:\|([^\]]+))?\]\]/g;
			md = md.replace(excalidrawPattern, (match, filePath, caption) => {
				console.log('Upstack: Found Excalidraw file:', filePath);
				// Extract just the filename without extension for a cleaner caption
				const fileName = filePath.split('/').pop()?.replace(/\.excalidraw$/, '') || 'Excalidraw Drawing';
				const altText = caption || fileName;
				
				// Convert to markdown image with empty src (like other local images)
				// The caption will be preserved in the figcaption
				return `![${altText}]()`;
			});
			
			// Step 3: Handle Obsidian Callouts/Admonitions
			// Callouts: > [!note] or > [!warning] etc.
			// Convert to styled blockquotes with appropriate styling
			const calloutPattern = />\s*\[!(\w+)\](.*?)(?=\n>\s*\[!|\n\n|$)/gs;
			md = md.replace(calloutPattern, (match, type, content) => {
				console.log('Upstack: Found callout:', type);
				const calloutTypes: Record<string, { emoji: string; bgColor: string; borderColor: string }> = {
					note: { emoji: 'ℹ️', bgColor: '#f0f7ff', borderColor: '#3b82f6' },
					tip: { emoji: '💡', bgColor: '#f0fdf4', borderColor: '#22c55e' },
					important: { emoji: '❗', bgColor: '#fef3c7', borderColor: '#f59e0b' },
					warning: { emoji: '⚠️', bgColor: '#fef2f2', borderColor: '#ef4444' },
					error: { emoji: '❌', bgColor: '#fee2e2', borderColor: '#dc2626' },
					success: { emoji: '✅', bgColor: '#f0fdf4', borderColor: '#22c55e' },
					question: { emoji: '❓', bgColor: '#f3e8ff', borderColor: '#a855f7' },
					info: { emoji: 'ℹ️', bgColor: '#f0f7ff', borderColor: '#3b82f6' },
				};
				const calloutType = type.toLowerCase();
				const calloutConfig = calloutTypes[calloutType] || calloutTypes.note!;
				const cleanContent = content.trim().replace(/^>\s*/gm, ''); // Remove > markers
				return `\n\n<blockquote style="background-color: ${calloutConfig.bgColor}; border-left: 4px solid ${calloutConfig.borderColor}; padding: 16px 20px; margin: 32px 0; border-radius: 4px;">
<strong style="display: block; margin-bottom: 8px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; color: ${calloutConfig.borderColor};">
${calloutConfig.emoji} ${type.charAt(0).toUpperCase() + type.slice(1)}
</strong>
${cleanContent}
</blockquote>\n\n`;
			});

			// Step 4: Handle Obsidian highlights ==text==
			// Convert to <mark> tags with styling
			md = md.replace(/==([^=]+)==/g, '<mark style="background-color: #fef08a; padding: 2px 4px; border-radius: 2px;">$1</mark>');

			// Step 5: Pre-process Obsidian-style images ![[image.png|caption]]
			// IMPORTANT: This must happen BEFORE wikilink processing, otherwise
			// the wikilink patterns will match the [[...]] inside ![[...]] and break the image references
			// Convert local images to base64 data URIs if possible
			// Exclude Excalidraw files (they were already processed in Step 2)
			
			// Debug: Check what image references exist in markdown
			const allImageRefs = md.match(/!\[\[[^\]]+\]\]/g);
			console.log('Upstack: All image references found:', allImageRefs);
			
			// Handle images with caption: ![[image.png|caption]]
			// Pattern: ![[path|caption]] where path ends with image extension (not .excalidraw)
			const imageWithCaptionPattern = /!\[\[([^|\]]+\.(png|jpg|jpeg|gif|svg|webp|bmp))\|([^\]]+)\]\]/gi;
			const hasImagesWithCaption = imageWithCaptionPattern.test(md);
			imageWithCaptionPattern.lastIndex = 0; // Reset after test
			
			// Handle images without caption: ![[image.png]]
			// Pattern: ![[path]] where path ends with image extension (not .excalidraw)
			const imageWithoutCaptionPattern = /!\[\[([^\]]+\.(png|jpg|jpeg|gif|svg|webp|bmp))\]\]/gi;
			const hasImagesWithoutCaption = imageWithoutCaptionPattern.test(md);
			imageWithoutCaptionPattern.lastIndex = 0; // Reset after test
			
			console.log('Upstack: Checking for images - with caption:', hasImagesWithCaption, 'without caption:', hasImagesWithoutCaption);
			
			// Debug: Show what the patterns would match
			if (allImageRefs) {
				imageWithCaptionPattern.lastIndex = 0;
				const withCaptionMatches = Array.from(md.matchAll(imageWithCaptionPattern));
				imageWithoutCaptionPattern.lastIndex = 0;
				const withoutCaptionMatches = Array.from(md.matchAll(imageWithoutCaptionPattern));
				console.log('Upstack: Pattern matches - with caption:', withCaptionMatches.map(m => m[0]), 'without caption:', withoutCaptionMatches.map(m => m[0]));
			}
			
			if (hasImagesWithCaption) {
				console.log('Upstack: Processing images with captions...');
				md = await this.processImages(md, imageWithCaptionPattern, view, true);
			}
			
			if (hasImagesWithoutCaption) {
				console.log('Upstack: Processing images without captions...');
				md = await this.processImages(md, imageWithoutCaptionPattern, view, false);
			}

			// Step 6: Handle Wikilinks [[link]] and [[link|display text]]
			// Convert to regular markdown links
			// IMPORTANT: This must happen AFTER image processing, otherwise
			// the patterns will match the [[...]] inside ![[...]] and break the image references
			// Handle wikilinks with display text: [[target|display]]
			// Exclude image references (those start with !)
			md = md.replace(/([^!])\[\[([^\]]+)\|([^\]]+)\]\]/g, '$1[$3]($2)');
			// Handle simple wikilinks: [[link]] - convert to link with same text
			// Exclude image references (those start with !)
			md = md.replace(/([^!])\[\[([^\]]+)\]\]/g, '$1[$2]($2)');

		// Step 7: Extract and process footnotes
		const footnoteMap = new Map<string, string>();
		const footnotePattern = /\[\^(\d+)\]:\s*(.+?)(?=\n\[\^|\n\n\n|$)/gs;
		let footnoteMatch;
		while ((footnoteMatch = footnotePattern.exec(md)) !== null) {
			const id = footnoteMatch[1];
			const content = footnoteMatch[2];
			if (id && content) {
				footnoteMap.set(id, content.trim());
			}
		}

		// Remove footnote definitions from markdown (they'll be added at the end)
		md = md.replace(/\[\^(\d+)\]:\s*.+?(?=\n\[\^|\n\n\n|$)/gs, '');

		// Step 8: Configure marked with custom renderers
		const renderer = new marked.Renderer();
		
		// Store original renderer methods before overriding
		const originalStrong = renderer.strong.bind(renderer);
		const originalEm = renderer.em.bind(renderer);
		const originalParagraph = renderer.paragraph.bind(renderer);
		const originalBlockquote = renderer.blockquote.bind(renderer);

		// Custom strong/bold renderer
		renderer.strong = ({ tokens }) => {
			const text = originalStrong({ tokens } as any);
			return `<strong style="font-weight: bold;">${text.replace(/<\/?strong>/g, '')}</strong>`;
		};

		// Custom emphasis/italic renderer
		renderer.em = ({ tokens }) => {
			const text = originalEm({ tokens } as any);
			return `<em style="font-style: italic;">${text.replace(/<\/?em>/g, '')}</em>`;
		};

		// Custom paragraph renderer
		renderer.paragraph = ({ tokens }) => {
			const text = originalParagraph({ tokens } as any);
			return `<p style="font-family: Georgia, serif; font-size: 19px; line-height: 1.6; color: #151515; margin-bottom: 32px;">${text.replace(/<\/?p>/g, '')}</p>`;
		};

		// Custom blockquote renderer
		renderer.blockquote = ({ tokens }) => {
			const text = originalBlockquote({ tokens } as any);
			return `<blockquote style="font-style: italic; border-left: 3px solid #151515; padding-left: 20px; margin: 32px 0; color: #151515;">${text.replace(/<\/?blockquote>/g, '')}</blockquote>`;
		};

		// Custom image renderer for <figure> with <figcaption>
		// Simplified for Substack compatibility - Mermaid charts get simpler rendering
		renderer.image = ({ href, title, text }) => {
			const caption = text || title || '';
			const src = href || '';
			const isMermaid = src.includes('mermaid.ink');
			
			// For Mermaid charts, use simpler structure to avoid Substack stripping content
			if (isMermaid) {
				return `<p style="margin: 32px 0; text-align: center;">
	<img src="${src}" style="max-width: 100%; height: auto; display: block; margin: 0 auto;" alt="${caption || 'Mermaid Chart'}" />
	${caption && caption !== 'Mermaid Chart' ? `<span style="display: block; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 14px; color: #666; margin-top: 12px;">${caption}</span>` : ''}
</p>`;
			}
			
			// For regular images, use figure with aspect-ratio container
			return `<figure style="margin: 32px 0;">
	<div style="position: relative; width: 100%; aspect-ratio: 16 / 9; padding-bottom: 56.25%; background-color: #f5f5f5; overflow: hidden;">
		<img src="${src}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; display: block;" loading="lazy" alt="${caption || ''}" />
	</div>
	${caption ? `<figcaption style="text-align: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 14px; color: #666; margin-top: 12px;">${caption}</figcaption>` : ''}
</figure>`;
		};

		// Custom horizontal rule renderer
		renderer.hr = () => {
			return '<hr style="border: none; border-top: 1px solid #e0e0e0; margin: 40px 0;" />';
		};

		// Custom heading renderers (ensure proper h1-h6 tags)
		const originalHeading = renderer.heading.bind(renderer);
		renderer.heading = ({ tokens, depth, text: headingText }) => {
			// Use original renderer to get properly rendered HTML
			const originalHtml = originalHeading({ tokens, depth, text: headingText } as any);
			// Extract just the text content (remove h tags)
			const text = originalHtml.replace(/<\/?h\d+[^>]*>/g, '');
			if (depth === 1) {
				return `<h1 style="font-family: Georgia, serif; font-weight: bold; font-size: 40px; line-height: 1.2; color: #151515; margin: 40px 0 24px 0;">${text}</h1>`;
			} else if (depth === 2) {
				return `<h2 style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-weight: 600; font-size: 22px; color: #666; margin: 32px 0 16px 0;">${text}</h2>`;
			} else {
				return `<h${depth} style="font-family: Georgia, serif; font-weight: bold; color: #151515; margin: 24px 0 12px 0;">${text}</h${depth}>`;
			}
		};

		// Custom link renderer to handle footnote references
		const originalLink = renderer.link.bind(renderer);
		renderer.link = (link) => {
			const { href, title, tokens, text: linkText } = link;
			// Use original renderer to get properly rendered HTML
			const originalHtml = originalLink(link);
			// Extract text content
			const text = originalHtml.replace(/<a[^>]*>|<\/a>/g, '');
			// Check if this is a footnote reference [^1]
			const footnoteRefMatch = text.match(/\[\^(\d+)\]/);
			if (footnoteRefMatch) {
				const footnoteId = footnoteRefMatch[1];
				return `<sup><a href="#fn${footnoteId}" style="text-decoration: none; color: #151515;">[${footnoteId}]</a></sup>`;
			}
			// Regular link with styling
			return `<a href="${href}"${title ? ` title="${title}"` : ''} style="color: #151515; text-decoration: underline;">${text}</a>`;
		};

		// Custom table renderer - Substack doesn't support HTML tables
		// Format as simple text with visual table structure using basic HTML
		const originalTableCell = renderer.tablecell.bind(renderer);
		renderer.table = (token) => {
			console.log('Upstack: Converting table to simple text format (Substack requires Datawrapper for tables)');
			
			// Get header labels
			const headers: string[] = [];
			if (token.header && token.header.length > 0) {
				for (let i = 0; i < token.header.length; i++) {
					const headerCell = token.header[i];
					if (headerCell) {
						const cellHtml = originalTableCell({ ...headerCell, header: true } as any);
						const cellText = cellHtml.replace(/<\/?th[^>]*>/g, '').trim();
						headers.push(cellText);
					}
				}
			}
			
			// Build output as simple paragraphs
			let output = '<p style="margin: 32px 0; font-family: Georgia, serif; font-size: 16px; color: #151515;">';
			
			// Add header row
			if (headers.length > 0) {
				output += '<strong style="font-weight: 600;">' + headers.join(' | ') + '</strong><br />';
			}
			
			// Add separator line
			if (headers.length > 0) {
				output += '<span style="color: #e0e0e0;">' + '—'.repeat(50) + '</span><br />';
			}
			
			// Add data rows
			if (token.rows && token.rows.length > 0) {
				for (const row of token.rows) {
					if (row && row.length > 0) {
						const rowCells: string[] = [];
						for (let i = 0; i < row.length; i++) {
							const cell = row[i];
							if (cell) {
								const cellHtml = originalTableCell({ ...cell, header: false } as any);
								const cellText = cellHtml.replace(/<\/?td[^>]*>/g, '').trim();
								rowCells.push(cellText);
							}
						}
						output += rowCells.join(' | ') + '<br />';
					}
				}
			}
			
			output += '</p>';
			return output;
		};

		// Custom table row renderer
		const originalTableRow = renderer.tablerow.bind(renderer);
		renderer.tablerow = (token) => {
			const originalHtml = originalTableRow(token);
			const rowContent = originalHtml.replace(/<\/?tr[^>]*>/g, '');
			return `<tr>${rowContent}</tr>`;
		};

		// Custom table cell renderer (handles both th and td)
		renderer.tablecell = (token) => {
			const originalHtml = originalTableCell(token);
			const cellContent = originalHtml.replace(/<\/?(th|td)[^>]*>/g, '');
			const align = token.align || 'left';
			
			if (token.header) {
				return `<th style="border: 1px solid #e0e0e0; padding: 12px; text-align: ${align}; background-color: #f5f5f5; font-weight: 600;">${cellContent}</th>`;
			} else {
				return `<td style="border: 1px solid #e0e0e0; padding: 12px; text-align: ${align}; vertical-align: top;">${cellContent}</td>`;
			}
		};

		// Custom code block renderer
		const originalCode = renderer.code.bind(renderer);
		renderer.code = (token) => {
			const code = token.text || '';
			const lang = token.lang || '';
			// For code blocks, use a styled pre/code structure
			return `<pre style="background-color: #f5f5f5; border: 1px solid #e0e0e0; border-radius: 4px; padding: 16px; margin: 32px 0; overflow-x: auto; font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace; font-size: 14px; line-height: 1.5; color: #151515;"><code>${code}</code></pre>`;
		};

		// Custom inline code renderer
		const originalCodespan = renderer.codespan.bind(renderer);
		renderer.codespan = (token) => {
			const code = token.text || '';
			return `<code style="background-color: #f5f5f5; padding: 2px 6px; border-radius: 3px; font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace; font-size: 0.9em; color: #151515;">${code}</code>`;
		};

		// Custom list item renderer for task lists (checkboxes)
		const originalListItem = renderer.listitem.bind(renderer);
		renderer.listitem = (token) => {
			// Check if this is a task list item (checkbox)
			if (token.task !== undefined && token.task !== null) {
				const checked = token.checked;
				const checkbox = checked 
					? '☑' 
					: '☐';
				const text = originalListItem(token);
				const content = text.replace(/<\/?li[^>]*>/g, '').trim();
				return `<li style="list-style: none; margin-bottom: 8px; padding-left: 24px; position: relative;">
<span style="position: absolute; left: 0; font-size: 18px;">${checkbox}</span>
<span style="margin-left: 8px;">${content}</span>
</li>`;
			}
			// Regular list item
			return originalListItem(token);
		};

		// Configure marked options
		marked.setOptions({
			renderer: renderer,
			gfm: true,
			breaks: false,
		});

		// Step 9: Convert markdown to HTML
		// Debug: Check if tables are present in markdown
		const tableMatches = md.match(/\|.*\|/g);
		if (tableMatches && tableMatches.length > 0) {
			console.log('Upstack: Found', tableMatches.length, 'potential table rows in markdown');
		}
		
		let html = marked.parse(md) as string;
		
		// Debug: Check if tables are in HTML output
		const tableHtmlMatches = html.match(/<table[^>]*>/gi);
		if (tableHtmlMatches) {
			console.log('Upstack: Found', tableHtmlMatches.length, 'tables in HTML output');
		} else if (tableMatches && tableMatches.length > 0) {
			console.warn('Upstack: Tables found in markdown but not in HTML output - tables may not be rendering');
		}

		// Step 10: Process inline footnote references [^1] that weren't in links
		html = html.replace(/\[\^(\d+)\]/g, (match, id) => {
			return `<sup><a href="#fn${id}" style="text-decoration: none; color: #151515;">[${id}]</a></sup>`;
		});

		// Step 11: Clean HTML - remove classes and data attributes (but keep styles!)
		// Remove class attributes
		html = html.replace(/\s+class="[^"]*"/g, '');
		// Remove data attributes
		html = html.replace(/\s+data-[^=]*="[^"]*"/g, '');
		// Remove id attributes except for footnotes
		html = html.replace(/\s+id="(?!fn\d+)[^"]*"/g, '');
		
		// Remove Obsidian-specific URLs and references that Substack tries to process
		// Remove app:// URLs (Obsidian app scheme)
		html = html.replace(/href="app:\/\/[^"]*"/g, 'href="#"');
		html = html.replace(/src="app:\/\/[^"]*"/g, 'src=""');
		// Remove any remaining Obsidian-specific attributes
		html = html.replace(/\s+data-link-[^=]*="[^"]*"/g, '');
		html = html.replace(/\s+data-href="[^"]*"/g, '');
		// Clean up any empty image sources that might have Obsidian URLs
		html = html.replace(/<img([^>]*)\ssrc="app:\/\/[^"]*"([^>]*)>/g, '<img$1 src=""$2>');

		// Step 12: Wrap content in semantic HTML structure
		// Extract title (first h1) if it exists
		const titleMatch = html.match(/<h1[^>]*>(.*?)<\/h1>/);
		let title = '';
		let bodyContent = html;
		
		if (titleMatch && titleMatch[1]) {
			title = titleMatch[1];
			bodyContent = html.replace(/<h1[^>]*>.*?<\/h1>\s*/i, '');
		}

		// Step 10: Add footnotes section at the end if any exist
		if (footnoteMap.size > 0) {
			let footnotesHtml = '<section style="margin-top: 48px; padding-top: 32px; border-top: 1px solid #e0e0e0;">';
			// Sort footnotes by ID number
			const sortedFootnotes = Array.from(footnoteMap.entries()).sort((a, b) => 
				parseInt(a[0]) - parseInt(b[0])
			);
			
			for (const [id, content] of sortedFootnotes) {
				// Convert footnote content from markdown to HTML
				const footnoteContent = marked.parse(content) as string;
				// Clean the footnote content (keep styles, remove classes/data)
				const cleanContent = footnoteContent
					.replace(/\s+class="[^"]*"/g, '')
					.replace(/\s+data-[^=]*="[^"]*"/g, '');
				
				footnotesHtml += `<div id="fn${id}" style="margin-bottom: 16px; font-family: Georgia, serif; font-size: 16px; line-height: 1.6; color: #151515;">${cleanContent}</div>`;
			}
			footnotesHtml += '</section>';
			bodyContent += footnotesHtml;
		}

		// Step 11: Output content directly without wrapper (Substack editor may strip wrapper divs)
		// Add title back if it was extracted, then output body content directly
		if (title) {
			html = `<h1 style="font-family: Georgia, serif; font-weight: bold; font-size: 40px; line-height: 1.2; color: #151515; margin: 0 0 40px 0;">${title}</h1>${bodyContent}`;
		} else {
			html = bodyContent;
		}

		// Step 10: Final cleanup - ensure no extra whitespace
		html = html.trim();

		console.log('Upstack: Transformation complete');
		return html;
		} catch (error) {
			console.error('Upstack: Error in transformForSubstack:', error);
			throw error;
		}
	}
}