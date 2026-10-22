import { InteractiveExercise } from '../types';

export interface RuleResult {
  id: string;
  description: string;
  passed: boolean;
  message?: string;
}

export interface ValidationSummary {
  allPassed: boolean;
  passedCount: number;
  totalCount: number;
  results: RuleResult[];
}

export function validateExerciseCode(
  exercise: InteractiveExercise,
  code: { html: string; css: string; js: string }
): ValidationSummary {
  const { html, css, js } = code;
  const results: RuleResult[] = [];

  const normalizedHtml = html.toLowerCase();
  const normalizedCss = css.toLowerCase().replace(/\s+/g, ' ');
  const normalizedJs = js.toLowerCase();

  for (const rule of exercise.rules) {
    let passed = false;
    let message: string | undefined;

    switch (rule.ruleType) {
      case 'html_contains': {
        const targetClean = rule.target.toLowerCase();
        passed = normalizedHtml.includes(targetClean);
        if (!passed) {
          message = `Brak oczekiwanego fragmentu: "${rule.target}"`;
        }
        break;
      }

      case 'html_tag_exists': {
        const tag = rule.target.toLowerCase();
        // Regex checking for <tag or <tag ... >
        const tagRegex = new RegExp(`<${tag}(\\s|>|/)`, 'i');
        passed = tagRegex.test(html);
        if (!passed) {
          message = `Brak wymaganego znacznika <${rule.target}> w strukturze HTML`;
        }
        break;
      }

      case 'html_attr_exists': {
        const attrName = rule.target.toLowerCase();
        const attrVal = rule.param ? rule.param.toLowerCase() : null;
        if (attrVal) {
          const regex = new RegExp(`${attrName}\\s*=\\s*["'][^"']*${attrVal}[^"']*["']`, 'i');
          passed = regex.test(html);
          if (!passed) {
            message = `Brak atrybutu ${attrName} zawierającego "${rule.param}"`;
          }
        } else {
          const regex = new RegExp(`\\b${attrName}\\b`, 'i');
          passed = regex.test(html);
          if (!passed) {
            message = `Brak atrybutu ${attrName}`;
          }
        }
        break;
      }

      case 'css_contains': {
        const cssTarget = rule.target.toLowerCase();
        passed = normalizedCss.includes(cssTarget);
        if (!passed) {
          message = `Reguła CSS powinna zawierać definicję: "${rule.target}"`;
        }
        break;
      }

      case 'js_contains': {
        const jsTarget = rule.target.toLowerCase();
        passed = normalizedJs.includes(jsTarget);
        if (!passed) {
          message = `Kod JavaScript powinien zawierać: "${rule.target}"`;
        }
        break;
      }

      default:
        passed = false;
        message = 'Nieobsługiwany typ weryfikacji';
    }

    results.push({
      id: rule.id,
      description: rule.description,
      passed,
      message,
    });
  }

  const passedCount = results.filter((r) => r.passed).length;
  const totalCount = results.length;
  const allPassed = totalCount > 0 && passedCount === totalCount;

  return {
    allPassed,
    passedCount,
    totalCount,
    results,
  };
}

export function generateSandboxDocument(html: string, css: string, js: string): string {
  // Wrap in a secure, self-reporting HTML document with script error and console interceptors
  return `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    /* Reset & sensible defaults for exercises */
    *, *::before, *::after { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 16px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #1e293b;
      background-color: #ffffff;
      line-height: 1.5;
    }
    ${css}
  </style>
  <script>
    (function() {
      function sendToParent(type, message) {
        try {
          window.parent.postMessage({
            source: 'fsda-sandbox',
            type: type,
            data: message
          }, '*');
        } catch (e) {}
      }

      var _log = console.log;
      var _error = console.error;
      var _warn = console.warn;
      var _info = console.info;

      console.log = function() {
        var args = Array.prototype.slice.call(arguments);
        _log.apply(console, args);
        sendToParent('log', args.map(function(a) { 
          return typeof a === 'object' ? JSON.stringify(a) : String(a); 
        }).join(' '));
      };

      console.error = function() {
        var args = Array.prototype.slice.call(arguments);
        _error.apply(console, args);
        sendToParent('error', args.map(function(a) { 
          return typeof a === 'object' ? JSON.stringify(a) : String(a); 
        }).join(' '));
      };

      console.warn = function() {
        var args = Array.prototype.slice.call(arguments);
        _warn.apply(console, args);
        sendToParent('warn', args.map(function(a) { 
          return typeof a === 'object' ? JSON.stringify(a) : String(a); 
        }).join(' '));
      };

      window.onerror = function(msg, url, lineNo, columnNo, error) {
        sendToParent('error', 'Runtime Error (linia ' + lineNo + '): ' + msg);
        return false;
      };
    })();
  </script>
</head>
<body>
  ${html}

  <script>
    try {
      ${js}
    } catch(err) {
      console.error('Błąd wykonania skryptu: ' + (err.message || err));
    }
  </script>
</body>
</html>`;
}
