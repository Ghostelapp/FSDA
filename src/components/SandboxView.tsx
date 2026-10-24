import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CodeEditor } from './CodeEditor';
import { InteractiveExercise } from '../types';
import { Terminal, Sparkles, FolderDown, RefreshCw } from 'lucide-react';

const SANDBOX_TEMPLATES: Record<string, { title: string; html: string; css: string; js: string; task: string }> = {
  empty: {
    title: 'Czysty Projekt HTML5 / CSS / JS',
    task: 'Pusta piaskownica do swobodnego eksperymentowania i prototypowania.',
    html: `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8">
  <title>Laboratorium Kodowania</title>
</head>
<body>
  <h1>Witaj w Piaskownicy Kodu!</h1>
  <p>Edytuj kod w zakładkach po lewej i obserwuj podgląd na żywo.</p>
  <button id="btn" type="button">Kliknij mnie</button>
</body>
</html>`,
    css: `body {
  font-family: system-ui, sans-serif;
  padding: 30px;
  background: #f8fafc;
  color: #0f172a;
}
h1 {
  color: #4f46e5;
}
button {
  background: #4f46e5;
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.2s;
}
button:hover {
  background: #4338ca;
}`,
    js: `document.getElementById('btn').addEventListener('click', (e) => {
  const timeStr = new Date().toLocaleTimeString();
  e.target.textContent = "Kliknięto o " + timeStr;
  console.log("Przycisk został kliknięty o: " + timeStr);
});
console.log("Laboratorium gotowe do pracy.");`,
  },

  form: {
    title: 'Dostępny Formularz Walidowany',
    task: 'Szablon semantycznego formularza rejestracji z walidacją pól i etykietami label.',
    html: `<form id="sampleForm">
  <h2>Rejestracja Kursanta</h2>
  <div class="field">
    <label for="uName">Imię i nazwisko</label>
    <input type="text" id="uName" required placeholder="Jan Kowalski">
  </div>
  <div class="field">
    <label for="uMail">Adres E-mail</label>
    <input type="email" id="uMail" required placeholder="jan@example.com">
  </div>
  <button type="submit">Zapisz się</button>
</form>`,
    css: `body { font-family: system-ui; padding: 24px; background: #f1f5f9; }
form { background: white; max-width: 360px; padding: 24px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); }
h2 { margin-top: 0; color: #1e293b; font-size: 1.25rem; }
.field { margin-bottom: 16px; }
label { display: block; font-size: 0.85rem; font-weight: 600; color: #475569; margin-bottom: 6px; }
input { width: 100%; box-sizing: border-box; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 0.95rem; }
input:focus { outline: 2px solid #6366f1; border-color: transparent; }
button { width: 100%; background: #6366f1; color: white; border: none; padding: 10px; border-radius: 6px; font-weight: bold; cursor: pointer; }`,
    js: `document.getElementById('sampleForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('uName').value;
  const email = document.getElementById('uMail').value;
  console.log("Wysłano dane formularza:", { name, email });
});`,
  },
};

export const SandboxView: React.FC = () => {
  const [currentTemplateKey, setCurrentTemplateKey] = useState<string>('empty');

  const tpl = SANDBOX_TEMPLATES[currentTemplateKey] || SANDBOX_TEMPLATES['empty'];

  // Wrap template as InteractiveExercise for CodeEditor compatibility
  const sandboxExercise: InteractiveExercise = {
    id: `sandbox-${currentTemplateKey}`,
    title: tpl.title,
    instructions: tpl.task,
    task: tpl.task,
    starterCode: {
      html: tpl.html,
      css: tpl.css,
      js: tpl.js,
    },
    solutionCode: {
      html: tpl.html,
      css: tpl.css,
      js: tpl.js,
    },
    hints: ['Pisz dowolny kod i klikaj "Sprawdź kod" aby uruchomić podgląd na żywo oraz sprawdzić logi w konsoli.'],
    rules: [
      { id: 'sb-1', description: 'Struktura HTML istnieje', ruleType: 'html_contains', target: '<' },
    ],
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
            <Terminal className="h-4 w-4" />
            <span>Laboratorium Kodowania & Prototypowania</span>
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Interaktywna Piaskownica Kodu
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Dowolnie testuj HTML5, CSS3 oraz JavaScript w odizolowanym środowisku z konsolą błędów.
          </p>
        </div>

        {/* Template Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Szablon:</span>
          <select
            value={currentTemplateKey}
            onChange={(e) => setCurrentTemplateKey(e.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="empty">Czysty projekt HTML5</option>
            <option value="form">Formularz z walidacją</option>
          </select>
        </div>
      </div>

      <CodeEditor
        key={currentTemplateKey}
        exercise={sandboxExercise}
      />
    </div>
  );
};
