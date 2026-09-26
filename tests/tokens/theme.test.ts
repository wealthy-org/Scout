import { test, describe } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

describe('Dossier.OS Design System & Tailwind v4 Tokens (TICKET-01)', () => {
  const rootDir = process.cwd();
  const globalsCssPath = path.join(rootDir, 'app', 'globals.css');
  const layoutPath = path.join(rootDir, 'app', 'layout.tsx');

  test('globals.css exists and contains @import "tailwindcss"', () => {
    assert.strictEqual(fs.existsSync(globalsCssPath), true, 'app/globals.css must exist');
    const content = fs.readFileSync(globalsCssPath, 'utf8');
    assert.match(content, /@import\s+["']tailwindcss["'];/, 'globals.css must import tailwindcss');
  });

  test('globals.css defines @theme block with Dossier.OS color palette', () => {
    const content = fs.readFileSync(globalsCssPath, 'utf8');
    assert.match(content, /@theme\s*\{/, 'globals.css must define a @theme block');

    const requiredColors = [
      '--color-canvas',
      '--color-surface',
      '--color-subtle',
      '--color-ink',
      '--color-ink-muted',
      '--color-signal-blue',
      '--color-signal-mint',
      '--color-signal-amber',
      '--color-signal-coral',
      '--color-signal-orchid',
      '--color-signal-cyan'
    ];

    for (const color of requiredColors) {
      assert.ok(
        content.includes(color),
        `globals.css @theme block must include color token "${color}"`
      );
    }
  });

  test('globals.css defines neo-brutalist shadow tokens', () => {
    const content = fs.readFileSync(globalsCssPath, 'utf8');
    const requiredShadows = [
      '--shadow-neo-sm',
      '--shadow-neo',
      '--shadow-neo-lg',
      '--shadow-neo-hover'
    ];

    for (const shadow of requiredShadows) {
      assert.ok(
        content.includes(shadow),
        `globals.css @theme block must include shadow token "${shadow}"`
      );
    }
  });

  test('globals.css binds Geist font variables to Tailwind font utilities', () => {
    const content = fs.readFileSync(globalsCssPath, 'utf8');
    assert.match(
      content,
      /--font-sans:\s*var\(--font-geist-sans\)/,
      '--font-sans must bind to var(--font-geist-sans)'
    );
    assert.match(
      content,
      /--font-mono:\s*var\(--font-geist-mono\)/,
      '--font-mono must bind to var(--font-geist-mono)'
    );
  });

  test('globals.css defines structural border tokens', () => {
    const content = fs.readFileSync(globalsCssPath, 'utf8');
    assert.ok(content.includes('--border-neo'), 'globals.css must define --border-neo');
    assert.ok(content.includes('--border-neo-thick'), 'globals.css must define --border-neo-thick');
  });

  test('globals.css strictly forbids dark mode media queries (Chalk & Ink Light Canvas only)', () => {
    const content = fs.readFileSync(globalsCssPath, 'utf8');
    assert.strictEqual(
      content.includes('prefers-color-scheme: dark'),
      false,
      'globals.css must NOT contain prefers-color-scheme: dark (Rule 13: Dark mode is strictly forbidden)'
    );
  });

  test('layout.tsx properly configures Geist Sans & Mono font variables', () => {
    assert.strictEqual(fs.existsSync(layoutPath), true, 'app/layout.tsx must exist');
    const content = fs.readFileSync(layoutPath, 'utf8');
    assert.match(content, /--font-geist-sans/, 'layout.tsx must define --font-geist-sans variable');
    assert.match(content, /--font-geist-mono/, 'layout.tsx must define --font-geist-mono variable');
    assert.match(content, /geistSans\.variable/, 'layout.tsx must apply geistSans.variable to html/body');
    assert.match(content, /geistMono\.variable/, 'layout.tsx must apply geistMono.variable to html/body');
  });
});
