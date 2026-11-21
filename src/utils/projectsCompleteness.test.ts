import assert from 'node:assert/strict';
import test from 'node:test';
import { PROJECTS_DATA } from '../data/projectsData';
import { PROJECT_SOURCE_DESCRIPTIONS_EN } from '../locales/curriculumEn';
import { getProjectInteractiveExercise } from './codeRunner';
import {
  buildFileTreeFromSources,
  buildProjectLivePreviewHtml,
  computeCrc32,
  createProjectZipBytes,
  getProjectFolderSlug,
} from './projectPackager';

test('wszystkie 12 projektów istnieje w kolejności 1..12 i zawiera kompletne pliki źródłowe z README.md', () => {
  assert.equal(PROJECTS_DATA.length, 12);

  PROJECTS_DATA.forEach((project, idx) => {
    const expectedNum = idx + 1;
    assert.equal(project.id, `proj-${expectedNum}`);
    assert.equal(project.number, expectedNum);

    const files = project.sourceFiles || [];
    assert.ok(
      files.length >= 4,
      `${project.id} powinien mieć co najmniej 4 kompletne pliki (ma ${files.length})`
    );

    const paths = files.map((f) => f.path);
    assert.equal(
      new Set(paths).size,
      paths.length,
      `${project.id} zawiera zduplikowane ścieżki plików`
    );
    assert.ok(paths.includes('README.md'), `${project.id} musi zawierać README.md`);

    for (const file of files) {
      assert.ok(file.description.trim().length >= 15, `${project.id}::${file.path} ma zbyt krótki opis`);
      assert.ok(file.code.trim().length >= 40, `${project.id}::${file.path} ma zbyt krótki kod`);
      assert.doesNotMatch(
        file.code,
        /\b(TODO|FIXME)\b/,
        `${project.id}::${file.path} nie może zawierać niedokończonych komentarzy TODO/FIXME`
      );
      assert.doesNotMatch(
        file.code,
        /[А-Яа-яЁё]/,
        `${project.id}::${file.path} zawiera nieoczekiwane znaki cyrylicy`
      );
    }
  });
});

test('weryfikatory interaktywne dla wszystkich 12 projektów nie zawierają literówek cyrylicy', () => {
  for (const project of PROJECTS_DATA) {
    const exPl = getProjectInteractiveExercise(project, 'pl');
    assert.doesNotMatch(
      `${exPl.title} ${exPl.instructions} ${exPl.task}`,
      /[А-Яа-яЁё]/,
      `Ćwiczenie weryfikacyjne ${project.id} zawiera cyrylicę`
    );
  }
});

test('projekty #1–#5 mają spójny index.html, brak brakujących plików CSS/JS i budują działający podgląd na żywo', () => {
  const staticProjects = PROJECTS_DATA.filter((p) => p.number <= 5);
  assert.equal(staticProjects.length, 5);

  for (const project of staticProjects) {
    const files = project.sourceFiles || [];
    const byPath = new Set(files.map((f) => f.path));
    const htmlFile = files.find((f) => f.path === 'index.html');
    assert.ok(htmlFile, `${project.id} musi posiadać index.html`);

    // Sprawdź czy każdy lokalny <link rel="stylesheet" href="..."> istnieje w sourceFiles
    const cssMatches = Array.from(
      htmlFile.code.matchAll(/<link\s+[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["'][^>]*>/gi)
    );
    assert.ok(cssMatches.length >= 1, `${project.id} powinien dołączać arkusz CSS w index.html`);
    for (const m of cssMatches) {
      const href = m[1].replace(/^\.\//, '');
      if (!/^https?:\/\//i.test(href)) {
        assert.ok(byPath.has(href), `${project.id} odwołuje się do brakującego CSS: ${href}`);
      }
    }

    // Sprawdź czy każdy lokalny <script src="..."> istnieje w sourceFiles
    const scriptMatches = Array.from(
      htmlFile.code.matchAll(/<script[^>]*\ssrc=["']([^"']+)["'][^>]*>/gi)
    );
    assert.ok(scriptMatches.length >= 1, `${project.id} powinien dołączać skrypt JS w index.html`);
    for (const m of scriptMatches) {
      const src = m[1].replace(/^\.\//, '');
      if (!/^https?:\/\//i.test(src)) {
        assert.ok(byPath.has(src), `${project.id} odwołuje się do brakującego JS: ${src}`);
      }
    }

    const previewHtml = buildProjectLivePreviewHtml(files);
    assert.ok(previewHtml && previewHtml.length > 500, `${project.id} powinien generować podgląd HTML`);
    assert.match(previewHtml, /<style data-source=/, `${project.id} powinien mieć zainlinowany CSS`);
    assert.match(previewHtml, /<script data-source=/, `${project.id} powinien mieć zainlinowany JS`);
  }
});

test('projekty #6–#12 mają poprawny package.json, strict tsconfig.json, konfigurację, bazę/backend/frontend oraz infrastrukturę w #12', () => {
  const fullStackProjects = PROJECTS_DATA.filter((p) => p.number >= 6);
  assert.equal(fullStackProjects.length, 7);

  for (const project of fullStackProjects) {
    const files = project.sourceFiles || [];
    const byPath = new Map(files.map((f) => [f.path, f]));

    // Nie są projektami czysto statycznymi HTML
    assert.equal(buildProjectLivePreviewHtml(files), null);

    const pkgFile = byPath.get('package.json');
    assert.ok(pkgFile, `${project.id} wymaga package.json`);
    const pkg = JSON.parse(pkgFile.code);
    assert.ok(typeof pkg.name === 'string' && pkg.name.length > 0);
    assert.ok(pkg.scripts && Object.keys(pkg.scripts).length >= 2);
    assert.ok(pkg.dependencies && Object.keys(pkg.dependencies).length >= 2);

    const tsConfigFile = byPath.get('tsconfig.json');
    assert.ok(tsConfigFile, `${project.id} wymaga tsconfig.json`);
    const tsConfig = JSON.parse(tsConfigFile.code);
    assert.equal(tsConfig.compilerOptions?.strict, true, `${project.id} tsconfig musi mieć strict: true`);

    if (project.number >= 7) {
      assert.ok(byPath.has('.env.example'), `${project.id} wymaga .env.example`);
      const hasDbSchema = files.some((f) => f.path.endsWith('.sql') || f.path.endsWith('.prisma'));
      if (project.number !== 11) {
        assert.ok(hasDbSchema, `${project.id} wymaga schematu bazy (.sql lub .prisma)`);
      }
    }

    if (project.number >= 8) {
      const hasFrontendTsx = files.some((f) => f.path.endsWith('.tsx'));
      const hasBackendTs = files.some((f) => f.path.endsWith('.ts') && !f.path.endsWith('.test.ts'));
      assert.ok(hasFrontendTsx, `${project.id} (Full-Stack) musi zawierać komponenty frontendowe .tsx`);
      assert.ok(hasBackendTs, `${project.id} (Full-Stack) musi zawierać moduły backendowe .ts`);
    }
  }

  // Dodatkowe wymagania produkcyjne dla Projektu #12 (Capstone)
  const capstone = PROJECTS_DATA.find((p) => p.id === 'proj-12')!;
  const capstonePaths = new Set((capstone.sourceFiles || []).map((f) => f.path));
  for (const required of [
    'Dockerfile',
    'docker-compose.yml',
    'nginx/default.conf',
    '.github/workflows/ci-cd.yml',
    'server/src/routes/items.test.ts',
  ]) {
    assert.ok(capstonePaths.has(required), `proj-12 wymaga pliku produkcyjnego: ${required}`);
  }
});

test('drzewo fileStructure w każdym z 12 projektów odpowiada w 100% rzeczywistym plikom sourceFiles', () => {
  for (const project of PROJECTS_DATA) {
    const files = project.sourceFiles || [];
    const treeText = project.fileStructure.join('\n');
    for (const file of files) {
      const baseName = file.path.split('/').pop()!;
      assert.ok(
        treeText.includes(baseName),
        `fileStructure w ${project.id} nie zawiera pliku ${file.path}`
      );
    }
    const rebuilt = buildFileTreeFromSources(
      getProjectFolderSlug(project.id, project.number),
      files
    );
    assert.deepEqual(project.fileStructure, rebuilt);
  }
});

test('tłumaczenia EN (PROJECT_SOURCE_DESCRIPTIONS_EN) pokrywają 100% wszystkich plików ze wszystkich 12 projektów', () => {
  const missingKeys: string[] = [];

  for (const project of PROJECTS_DATA) {
    for (const file of project.sourceFiles || []) {
      const key = `${project.id}::${file.path}`;
      const desc = PROJECT_SOURCE_DESCRIPTIONS_EN[key];
      if (!desc || desc.trim().length < 15) {
        missingKeys.push(key);
      }
    }
  }

  assert.deepEqual(
    missingKeys,
    [],
    `Brakujące opisy EN dla plików projektów: ${missingKeys.join(', ')}`
  );
});

test('createProjectZipBytes generuje poprawne archiwum ZIP (CRC32 + nagłówki PK + wszystkie pliki) dla każdego z 12 projektów', () => {
  // Referencyjny test CRC32 dla ciągu "123456789" === 0xCBF43926
  const crcCheck = computeCrc32(new TextEncoder().encode('123456789'));
  assert.equal(crcCheck, 0xcbf43926);

  const decoder = new TextDecoder();

  for (const project of PROJECTS_DATA) {
    const files = project.sourceFiles || [];
    const slug = getProjectFolderSlug(project.id, project.number);
    const zipBytes = createProjectZipBytes(slug, files);
    const view = new DataView(zipBytes.buffer, zipBytes.byteOffset, zipBytes.byteLength);

    // Local File Header signature at offset 0: PK\x03\x04 (0x04034b50 little-endian)
    assert.equal(view.getUint32(0, true), 0x04034b50, `${project.id} ZIP musi zaczynać się od PK\\x03\\x04`);

    // End of Central Directory (EOCD) at end - 22 bytes: PK\x05\x06 (0x06054b50)
    const eocdOffset = zipBytes.length - 22;
    assert.equal(view.getUint32(eocdOffset, true), 0x06054b50, `${project.id} ZIP musi kończyć się poprawnym EOCD`);
    assert.equal(view.getUint16(eocdOffset + 8, true), files.length, `${project.id} ZIP entries on disk`);
    assert.equal(view.getUint16(eocdOffset + 10, true), files.length, `${project.id} ZIP total entries`);

    const rawText = decoder.decode(zipBytes);
    for (const file of files) {
      assert.ok(
        rawText.includes(`${slug}/${file.path}`),
        `${project.id} ZIP musi zawierać wpis ${slug}/${file.path}`
      );
    }
  }
});
