#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const docsPath = path.join(__dirname, '..', 'docs', 'api.md');
let content = fs.readFileSync(docsPath, 'utf8');

// Extract git revision from existing source links
const revMatch = content.match(/blob\/([a-f0-9]+)\//);
const gitRevision = revMatch ? revMatch[1] : 'master';
const baseUrl = `https://github.com/particle-iot/particle-api-js/blob/${gitRevision}`;

// 1. Replace 'export=' with 'Particle'
content = content.replace(/\bexport=/g, 'Particle');

// 2. Remove top-level headings
content = content.replace(/^# particle-api-js\n\n## Classes\n\n/, '');

// 3. Remove section group headings
content = content.replace(/^#### Constructors\n\n/gm, '');
content = content.replace(/^#### Methods\n\n/gm, '');

// 4. Fix class heading level: ### Particle -> ## Particle
content = content.replace(/^### Particle$/m, '## Particle');

// 5. Remove constructor signature line
content = content.replace(/^> \*\*new Particle\*\*\(.*\n\n/m, '');

// 6. Fix constructor heading
content = content.replace(/^##### Constructor$/m, '### constructor');

// 7. Remove method signature lines (> **methodName**(...): ...)
content = content.replace(/^> \*\*\w+\*\*\(.*\n\n/gm, '');

// 8. Convert method headings: ##### methodName() -> ### methodName
content = content.replace(/^##### (\w+)\(\)$/gm, '### $1');

// 9. Fix return type references
content = content.replace(/\[`Particle`\]\(#[^)]*\)/g, '`Particle`');

// 10. Convert ###### parameter sections to bullet lists
//     TypeDoc generates:
//       ###### Parameters
//       ###### options
//       `Type`
//       description
//       ###### options.field   (or just ###### field for expanded objects)
//       `Type`
//       description
//       ###### Returns
//       `Type`
//       description
//
//     We want:
//       **Parameters**
//       -   `options` **Type** description
//           -   `options.field` **Type** description
//       **Returns** Type description

const lines = content.split('\n');
const result = [];
let i = 0;

while (i < lines.length) {
	const line = lines[i];

	// Match ###### heading
	if (line.startsWith('###### ')) {
		const heading = line.slice(7).trim();

		if (heading === 'Parameters') {
			result.push('**Parameters**');
			result.push('');
			i++;
			// Process parameter entries until we hit ###### Returns or a non-###### heading or ### heading
			// The first param is typically `options` - all subsequent non-dotted params are its children.
			// Dotted params (like context.project) are grandchildren.
			let isFirstParam = true;
			while (i < lines.length) {
				const pline = lines[i];

				// Stop at Returns or a method heading
				if (pline === '###### Returns') {
					break;
				}
				if (pline.startsWith('### ') || pline.startsWith('## ')) {
					break;
				}

				// New param heading
				if (pline.startsWith('###### ')) {
					const paramName = pline.slice(7).trim();

					// Collect type (next non-empty line starting with `)
					i++;
					let paramType = '';
					let paramDesc = '';

					// Skip blank lines
					while (i < lines.length && lines[i].trim() === '') {
						i++;
					}

					// Check if next line is a type (starts with ` or \{)
					if (i < lines.length && (lines[i].startsWith('`') || lines[i].startsWith('\\{'))) {
						paramType = lines[i].trim();
						i++;
						while (i < lines.length && lines[i].trim() === '') {
							i++;
						}
					}

					// Collect description lines until next heading or blank+heading
					const descLines = [];
					while (i < lines.length && !lines[i].startsWith('#') && !(lines[i].trim() === '' && i + 1 < lines.length && lines[i + 1].startsWith('#'))) {
						if (lines[i].trim() === '') {
							let j = i;
							while (j < lines.length && lines[j].trim() === '') {
								j++;
							}
							if (j >= lines.length || lines[j].startsWith('#')) {
								break;
							}
						}
						descLines.push(lines[i]);
						i++;
					}
					paramDesc = descLines.join(' ').trim();

					// Skip trailing blank lines
					while (i < lines.length && lines[i].trim() === '') {
						i++;
					}

					// Determine indentation:
					// - First param (options/params/args) is top-level
					// - Subsequent non-dotted params are children of options -> indent once
					// - Dotted params (context.project) are grandchildren -> indent twice
					let indent = '';
					if (isFirstParam) {
						indent = '';
						isFirstParam = false;
					} else if (paramName.includes('.')) {
						indent = '        ';
					} else {
						indent = '    ';
					}

					let bullet = `${indent}-   \`${paramName}\``;
					if (paramType) {
						bullet += ` **${paramType}**`;
					}
					if (paramDesc) {
						bullet += ` ${paramDesc}`;
					}

					result.push(bullet);
				} else {
					// Skip blank lines between params
					i++;
				}
			}
			result.push('');
			continue;
		}

		if (heading === 'Returns') {
			i++;
			while (i < lines.length && lines[i].trim() === '') {
				i++;
			}

			let returnType = '';
			let returnDesc = '';

			if (i < lines.length && (lines[i].startsWith('`') || lines[i].startsWith('\\{'))) {
				returnType = lines[i].trim();
				i++;
				while (i < lines.length && lines[i].trim() === '') {
					i++;
				}
			}

			const descLines = [];
			while (i < lines.length && !lines[i].startsWith('#')) {
				if (lines[i].trim() === '') {
					let j = i;
					while (j < lines.length && lines[j].trim() === '') {
						j++;
					}
					if (j >= lines.length || lines[j].startsWith('#')) {
						break;
					}
				}
				descLines.push(lines[i]);
				i++;
			}
			returnDesc = descLines.join(' ').trim();

			while (i < lines.length && lines[i].trim() === '') {
				i++;
			}

			let returnsLine = `Returns **${returnType}**`;
			if (returnDesc) {
				returnsLine += ` ${returnDesc}`;
			}
			result.push(returnsLine);
			result.push('');
			continue;
		}

		// Other ###### headings (shouldn't happen after our transforms, but just in case)
		result.push(line);
		i++;
		continue;
	}

	result.push(line);
	i++;
}

content = result.join('\n');

// 11. Inject typedef entries
const typedefs = [
	{
		after: '### publishEvent',
		content: `### Hook

Defined in: [Particle.ts:940](${baseUrl}/src/Particle.ts#L940)

Type: \`Object\`

**Properties**

-   \`method\` **\`string\`** (optional, default \`POST\`) Type of web request triggered by the Webhook (GET, POST, PUT, or DELETE)
-   \`auth\` **\`object\`** (optional) Auth data like \`{ user: 'me', pass: '1234' }\` for basic auth or \`{ bearer: 'token' }\` to send with the Webhook request
-   \`headers\` **\`object\`** (optional) Additional headers to add to the Webhook like \`{ 'X-ONE': '1', X-TWO: '2' }\`
-   \`query\` **\`object\`** (optional) Query params to add to the Webhook request like \`{ foo: 'foo', bar: 'bar' }\`
-   \`json\` **\`object\`** (optional) JSON data to send with the Webhook request - sets \`Content-Type\` to \`application/json\`
-   \`form\` **\`object\`** (optional) Form data to send with the Webhook request - sets \`Content-Type\` to \`application/x-www-form-urlencoded\`
-   \`body\` **\`string\`** (optional) Custom body to send with the Webhook request
-   \`responseTemplate\` **\`object\`** (optional) Template to use to customize the Webhook response body
-   \`responseEvent\` **\`object\`** (optional) The Webhook response event name that your devices can subscribe to
-   \`errorResponseEvent\` **\`object\`** (optional) The Webhook error response event name that your devices can subscribe to
`
	},
	{
		after: '### archiveLedger',
		content: `### Scope

Defined in: [Particle.ts:2436](${baseUrl}/src/Particle.ts#L2436)

Type: \`"Owner" | "Product" | "Device"\`
`
	},
	{
		after: '### getLedgerInstance',
		content: `### SetMode

Defined in: [Particle.ts:2492](${baseUrl}/src/Particle.ts#L2492)

Type: \`"Replace" | "Merge"\`
`
	}
];

for (const def of typedefs) {
	const idx = content.indexOf(def.after);
	if (idx === -1) {
		console.warn(`Warning: Could not find "${def.after}" to insert typedef`);
		continue;
	}
	const afterAnchor = content.indexOf('\n### ', idx + def.after.length);
	if (afterAnchor === -1) {
		content = content + '\n' + def.content;
	} else {
		content = content.slice(0, afterAnchor) + '\n\n' + def.content + content.slice(afterAnchor);
	}
}

// 12. Generate Table of Contents
const tocEntries = [];
const headingRegex = /^### (.+)$/gm;
let match;
while ((match = headingRegex.exec(content)) !== null) {
	const name = match[1];
	const anchor = name.toLowerCase().replace(/[^a-z0-9]+/g, '');
	tocEntries.push(`-   [${name}](#${anchor})`);
}

const toc = `### Table of Contents\n\n-   [Particle](#particle)\n${tocEntries.map(e => '    ' + e).join('\n')}\n`;

// Insert TOC at the very top of the file
content = toc + '\n' + content;

// 13. Unescape angle brackets: \< and \> -> < and >
content = content.replace(/\\</g, '<');
content = content.replace(/\\>/g, '>');

// 14. Clean up multiple consecutive blank lines
content = content.replace(/\n{3,}/g, '\n\n');

fs.writeFileSync(docsPath, content, 'utf8');
console.log('Post-processed docs/api.md');
