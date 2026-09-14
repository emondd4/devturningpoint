import { generateFoundations } from './generate-foundations.mjs';
import { generateFlutter } from './generate-flutter.mjs';
import { generateFrontend } from './generate-frontend.mjs';
import { generateBackend } from './generate-backend.mjs';
import { generateDevops } from './generate-devops.mjs';
import { generateDatabase } from './generate-database.mjs';
import { generateSecondaryTracks } from './generate-secondary.mjs';
import fs from 'node:fs';
import path from 'node:path';

const roots = generateFoundations();
const flutter = generateFlutter();
const frontend = generateFrontend();
const backend = generateBackend();
const devops = generateDevops();
const database = generateDatabase();
const secondaryCount = generateSecondaryTracks();

const topicsRoot = path.resolve(import.meta.dirname, '../src/content/topics');
const tracks = fs.readdirSync(topicsRoot).filter((d) => fs.statSync(path.join(topicsRoot, d)).isDirectory());

const counts = {};
let total = 0;
for (const track of tracks.sort()) {
  const n = fs.readdirSync(path.join(topicsRoot, track)).filter((f) => f.endsWith('.mdx')).length;
  counts[track] = n;
  total += n;
}

console.log('Generated topic files:');
console.log({
  foundations: roots.length,
  'mobile-flutter': flutter.length,
  frontend: frontend.length,
  backend: backend.length,
  devops: devops.length,
  database: database.length,
  secondaryTopicsWritten: secondaryCount,
});
console.log('\\nPer-track MDX counts on disk:');
console.log(counts);
console.log('Total:', total);
