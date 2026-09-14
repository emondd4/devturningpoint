import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const issues = [];
const ids = new Map();

function walk(dir, filter) {
  if (!existsSync(dir)) return [];
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full, filter));
    else if (filter(entry.name)) out.push(full);
  }
  return out;
}

function trackId(id, file) {
  if (ids.has(id)) issues.push(`Duplicate id ${id} in ${file} (also ${ids.get(id)})`);
  else ids.set(id, file);
}

for (const file of walk(join(root, 'src/content/topics'), (n) => n.endsWith('.md') || n.endsWith('.mdx'))) {
  const text = readFileSync(file, 'utf8');
  const match = text.match(/^---([\s\S]*?)---/);
  if (!match) {
    issues.push(`Missing frontmatter: ${file}`);
    continue;
  }
  const idMatch = match[1].match(/^id:\s*(.+)$/m);
  if (!idMatch) issues.push(`Missing id: ${file}`);
  else trackId(idMatch[1].trim(), file);
}

for (const folder of ['careers', 'companies', 'achievements', 'interviews', 'issues', 'projects', 'history']) {
  for (const file of walk(join(root, 'src/content', folder), (n) => n.endsWith('.json'))) {
    try {
      const data = JSON.parse(readFileSync(file, 'utf8'));
      if (!data.id) issues.push(`Missing id: ${file}`);
      else trackId(data.id, file);
    } catch (error) {
      issues.push(`Invalid JSON ${file}: ${error.message}`);
    }
  }
}

if (issues.length) {
  console.error('Content validation failed:');
  for (const issue of issues) console.error(` - ${issue}`);
  process.exit(1);
}

console.log(`Content OK: ${ids.size} unique ids`);
