import { ProjectSourceFile } from '../types';

const PROJECT_SLUGS: Record<string, string> = {
  'proj-1': '01-developer-portfolio',
  'proj-2': '02-cloudpulse-saas-landing',
  'proj-3': '03-developer-calculator',
  'proj-4': '04-taskflow-kanban',
  'proj-5': '05-weathersphere-app',
  'proj-6': '06-pulseanalytics-dashboard',
  'proj-7': '07-securegate-auth-api',
  'proj-8': '08-devchronicle-blog-cms',
  'proj-9': '09-codemarket-ecommerce',
  'proj-10': '10-teamsync-b2b-saas',
  'proj-11': '11-collabboard-realtime',
  'proj-12': '12-fullstack-capstone',
};

export function getProjectFolderSlug(projectId: string, projectNumber?: number): string {
  if (PROJECT_SLUGS[projectId]) {
    return PROJECT_SLUGS[projectId];
  }
  const num = projectNumber ? String(projectNumber).padStart(2, '0') : '00';
  return `${num}-${projectId.replace(/[^a-z0-9-]/gi, '').toLowerCase()}`;
}

interface TreeNode {
  name: string;
  isDir: boolean;
  children: Map<string, TreeNode>;
}

/**
 * Generates an accurate ASCII directory tree directly from actual ProjectSourceFile paths
 * so the displayed architecture always matches the downloadable codebase 1:1.
 */
export function buildFileTreeFromSources(
  rootFolderName: string,
  files: ProjectSourceFile[]
): string[] {
  const root: TreeNode = {
    name: rootFolderName.endsWith('/') ? rootFolderName : `${rootFolderName}/`,
    isDir: true,
    children: new Map(),
  };

  for (const file of files) {
    const parts = file.path.split('/').filter(Boolean);
    let current = root;
    parts.forEach((part, index) => {
      const isDir = index < parts.length - 1;
      const key = isDir ? `${part}/` : part;
      if (!current.children.has(key)) {
        current.children.set(key, { name: key, isDir, children: new Map() });
      }
      current = current.children.get(key)!;
    });
  }

  const lines: string[] = [root.name];

  const renderChildren = (node: TreeNode, prefix: string) => {
    const entries = Array.from(node.children.values()).sort((a, b) => {
      if (a.isDir !== b.isDir) return a.isDir ? -1 : 1;
      return a.name.localeCompare(b.name);
    });

    entries.forEach((child, idx) => {
      const isLast = idx === entries.length - 1;
      const connector = isLast ? '└── ' : '├── ';
      lines.push(`${prefix}${connector}${child.name}`);
      if (child.isDir) {
        renderChildren(child, `${prefix}${isLast ? '    ' : '│   '}`);
      }
    });
  };

  renderChildren(root, '');
  return lines;
}

function normalizeRelativePath(baseDir: string, relPath: string): string {
  const cleanRel = relPath.replace(/^\.\//, '');
  const segments = [...baseDir.split('/').filter(Boolean), ...cleanRel.split('/').filter(Boolean)];
  const resolved: string[] = [];
  for (const seg of segments) {
    if (seg === '.') continue;
    if (seg === '..') {
      resolved.pop();
    } else {
      resolved.push(seg);
    }
  }
  return resolved.join('/');
}

/**
 * Bundles static multi-file HTML + CSS + JS (including local ES module imports) into a single
 * self-contained HTML string suitable for live preview inside a sandboxed <iframe>.
 * Returns null for Node/React/Full-Stack projects that require a bundler or backend runtime.
 */
export function buildProjectLivePreviewHtml(files: ProjectSourceFile[]): string | null {
  const hasPackageJson = files.some((f) => f.path === 'package.json');
  const htmlFile = files.find((f) => f.path === 'index.html');
  if (!htmlFile || hasPackageJson) {
    return null;
  }

  const byPath = new Map<string, ProjectSourceFile>(files.map((f) => [f.path, f]));
  let html = htmlFile.code;

  // Inline local <link rel="stylesheet" href="...">
  html = html.replace(
    /<link\s+[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["'][^>]*\/?>/gi,
    (match, href: string) => {
      if (/^https?:\/\//i.test(href)) return match;
      const target = byPath.get(normalizeRelativePath('', href));
      if (!target) return match;
      return `<style data-source="${target.path}">\n${target.code}\n</style>`;
    }
  );

  // Recursively flatten local ES module imports for browser srcdoc execution
  const bundleJsEntry = (entryPath: string): string => {
    const visited = new Set<string>();
    const chunks: string[] = [];

    const visit = (filePath: string) => {
      if (visited.has(filePath)) return;
      visited.add(filePath);
      const file = byPath.get(filePath);
      if (!file) return;

      const dir = filePath.includes('/') ? filePath.slice(0, filePath.lastIndexOf('/')) : '';
      const localImports: string[] = [];

      let transformed = file.code.replace(
        /^\s*import\s+[^;]+?\s+from\s+['"]([^'"]+)['"];?\s*$/gm,
        (fullMatch, spec: string) => {
          if (spec.startsWith('./') || spec.startsWith('../')) {
            localImports.push(normalizeRelativePath(dir, spec));
            return '';
          }
          return fullMatch;
        }
      );

      for (const dep of localImports) {
        visit(dep);
      }

      transformed = transformed.replace(
        /^\s*export\s+(default\s+)?(async\s+function|function|class|const|let|var)\s+/gm,
        '$2 '
      );

      chunks.push(`/* --- ${filePath} --- */\n${transformed}`);
    };

    visit(entryPath);
    return chunks.join('\n\n');
  };

  // Inline local <script ... src="..."></script>
  html = html.replace(
    /<script([^>]*)\ssrc=["']([^"']+)["']([^>]*)>\s*<\/script>/gi,
    (match, before: string, src: string, after: string) => {
      if (/^https?:\/\//i.test(src)) return match;
      const resolvedPath = normalizeRelativePath('', src);
      if (!byPath.has(resolvedPath)) return match;
      const isModule = /type=["']module["']/i.test(`${before} ${after}`);
      const bundled = bundleJsEntry(resolvedPath).replace(/<\/script>/gi, '<\\/script>');
      if (isModule) {
        return `<script data-source="${resolvedPath}">\n(function(){\n${bundled}\n})();\n</script>`;
      }
      return `<script data-source="${resolvedPath}">\n${bundled}\n</script>`;
    }
  );

  return html;
}

// Standard CRC32 lookup table for RFC 1952 / ZIP compatibility
const CRC32_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) !== 0 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[i] = c >>> 0;
  }
  return table;
})();

export function computeCrc32(bytes: Uint8Array): number {
  let crc = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) {
    crc = CRC32_TABLE[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

/**
 * Creates a valid, uncompressed (STORE) ZIP archive in memory containing all project files
 * under `<rootFolderName>/...` with UTF-8 filename support and verified CRC32 checksums.
 */
export function createProjectZipBytes(
  rootFolderName: string,
  files: ProjectSourceFile[]
): Uint8Array<ArrayBuffer> {
  const encoder = new TextEncoder();
  const cleanRoot = rootFolderName.replace(/^\/+|\/+$/g, '');

  const localParts: Uint8Array[] = [];
  const centralParts: Uint8Array[] = [];
  let offset = 0;

  // Deterministic DOS timestamp (2026-01-01 12:00:00)
  const dosTime = (12 << 11) | (0 << 5) | 0;
  const dosDate = ((2026 - 1980) << 9) | (1 << 5) | 1;

  for (const file of files) {
    const entryName = `${cleanRoot}/${file.path.replace(/^\/+/, '')}`;
    const nameBytes = encoder.encode(entryName);
    const dataBytes = encoder.encode(file.code.endsWith('\n') ? file.code : `${file.code}\n`);
    const crc = computeCrc32(dataBytes);

    // Local File Header (30 bytes + filename)
    const localHeader = new Uint8Array(30 + nameBytes.length);
    const lv = new DataView(localHeader.buffer);
    lv.setUint32(0, 0x04034b50, true); // Local file header signature
    lv.setUint16(4, 20, true); // Version needed (2.0)
    lv.setUint16(6, 0x0800, true); // UTF-8 filename flag (bit 11)
    lv.setUint16(8, 0, true); // Compression: STORE (0)
    lv.setUint16(10, dosTime, true);
    lv.setUint16(12, dosDate, true);
    lv.setUint32(14, crc, true);
    lv.setUint32(18, dataBytes.length, true);
    lv.setUint32(22, dataBytes.length, true);
    lv.setUint16(26, nameBytes.length, true);
    lv.setUint16(28, 0, true); // Extra field length
    localHeader.set(nameBytes, 30);

    // Central Directory Header (46 bytes + filename)
    const centralHeader = new Uint8Array(46 + nameBytes.length);
    const cv = new DataView(centralHeader.buffer);
    cv.setUint32(0, 0x02014b50, true); // Central directory signature
    cv.setUint16(4, 20, true); // Version made by
    cv.setUint16(6, 20, true); // Version needed
    cv.setUint16(8, 0x0800, true); // UTF-8 flag
    cv.setUint16(10, 0, true); // STORE
    cv.setUint16(12, dosTime, true);
    cv.setUint16(14, dosDate, true);
    cv.setUint32(16, crc, true);
    cv.setUint32(20, dataBytes.length, true);
    cv.setUint32(24, dataBytes.length, true);
    cv.setUint16(28, nameBytes.length, true);
    cv.setUint16(30, 0, true); // Extra length
    cv.setUint16(32, 0, true); // Comment length
    cv.setUint16(34, 0, true); // Disk number start
    cv.setUint16(36, 0, true); // Internal attrs
    cv.setUint32(38, 0, true); // External attrs
    cv.setUint32(42, offset, true); // Relative offset of local header
    centralHeader.set(nameBytes, 46);

    localParts.push(localHeader, dataBytes);
    centralParts.push(centralHeader);
    offset += localHeader.length + dataBytes.length;
  }

  const centralDirSize = centralParts.reduce((sum, p) => sum + p.length, 0);
  const eocd = new Uint8Array(22);
  const ev = new DataView(eocd.buffer);
  ev.setUint32(0, 0x06054b50, true); // End of central directory signature
  ev.setUint16(4, 0, true); // Disk number
  ev.setUint16(6, 0, true); // Start disk
  ev.setUint16(8, files.length, true); // Entries on disk
  ev.setUint16(10, files.length, true); // Total entries
  ev.setUint32(12, centralDirSize, true);
  ev.setUint32(16, offset, true); // Central directory offset
  ev.setUint16(20, 0, true); // Comment length

  const totalLength = offset + centralDirSize + eocd.length;
  const output = new Uint8Array(new ArrayBuffer(totalLength));
  let cursor = 0;
  for (const part of localParts) {
    output.set(part, cursor);
    cursor += part.length;
  }
  for (const part of centralParts) {
    output.set(part, cursor);
    cursor += part.length;
  }
  output.set(eocd, cursor);

  return output;
}
