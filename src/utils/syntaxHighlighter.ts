import Prism from 'prismjs';

// Load language components for Prism
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-docker';

const LANGUAGE_MAP: Record<string, string> = {
  js: 'javascript',
  javascript: 'javascript',
  ts: 'typescript',
  typescript: 'typescript',
  jsx: 'jsx',
  tsx: 'tsx',
  html: 'markup',
  markup: 'markup',
  xml: 'markup',
  svg: 'markup',
  css: 'css',
  sql: 'sql',
  bash: 'bash',
  sh: 'bash',
  shell: 'bash',
  zsh: 'bash',
  json: 'json',
  yaml: 'yaml',
  yml: 'yaml',
  docker: 'docker',
  dockerfile: 'docker',
};

/**
 * Highlights a string of source code into syntax-highlighted HTML
 * using PrismJS tokens and classes.
 */
export function highlightCode(code: string, rawLang = 'javascript'): string {
  if (!code) return '';

  const normalized = (rawLang || '').toLowerCase().trim();
  const prismLang = LANGUAGE_MAP[normalized] || 'javascript';
  const grammar = Prism.languages[prismLang] || Prism.languages.javascript;

  try {
    return Prism.highlight(code, grammar, prismLang);
  } catch {
    // Escape basic HTML entities as fallback
    return code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }
}

/**
 * Returns a friendly display name for a code language
 */
export function getLanguageDisplayName(rawLang = 'javascript'): string {
  const norm = (rawLang || '').toLowerCase().trim();
  switch (norm) {
    case 'js':
    case 'javascript':
      return 'JavaScript (ES6+)';
    case 'ts':
    case 'typescript':
      return 'TypeScript';
    case 'html':
    case 'markup':
      return 'HTML5';
    case 'css':
      return 'CSS3';
    case 'sql':
      return 'PostgreSQL SQL';
    case 'bash':
    case 'sh':
    case 'shell':
      return 'Terminal Bash';
    case 'json':
      return 'JSON';
    case 'yaml':
    case 'yml':
      return 'YAML';
    case 'docker':
    case 'dockerfile':
      return 'Dockerfile';
    default:
      return rawLang.toUpperCase();
  }
}
