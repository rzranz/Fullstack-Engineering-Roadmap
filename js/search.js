/**
 * Search Engine for Full-Stack Engineering Academy
 * Multi-field weighted scoring with contextual snippet extraction.
 */

(function (window) {
  'use strict';

  function escapeHTML(value) {
    return String(value ?? '').replace(/[&<>"']/g, char => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[char]);
  }

  function moduleSearchFields(module, tracks) {
    const track = (tracks || window.TRACKS || []).find(item => item.id === module.track);
    return [
      { label: 'Judul materi', weight: 14, text: module.title || '' },
      { label: 'Jalur teknologi', weight: 9, text: `${module.track || ''} ${track?.desc || ''} ${track?.outcome || ''}` },
      { label: 'Ringkasan & tujuan', weight: 7, text: module.summary || '' },
      { label: 'Konsep inti', weight: 7, text: (module.concepts || []).flat().join(' ') },
      { label: 'Contoh kode', weight: 8, text: `${module.code?.language || ''} ${module.code?.content || ''}` },
      { label: 'Arsitektur & komparasi', weight: 5, text: module.compare || '' },
      { label: 'Best practices', weight: 5, text: (module.practices || []).join(' ') },
      { label: 'Studi kasus', weight: 5, text: module.case || '' },
      { label: 'Latihan mandiri', weight: 4, text: module.exercise?.scenario || module.exercise?.task || (typeof module.exercise === 'string' ? module.exercise : '') },
      { label: 'Cek pemahaman', weight: 3, text: `${module.quiz?.question || ''} ${(module.quiz?.options || []).join(' ')}` }
    ];
  }

  function searchTokenIndex(text, token) {
    const source = String(text || '');
    const cleanToken = String(token || '').trim();
    if (!cleanToken) return -1;
    const escaped = cleanToken.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (/^[a-z0-9_$]+$/i.test(cleanToken)) {
      const match = new RegExp(`(^|[^a-z0-9_$])${escaped}($|[^a-z0-9_$])`, 'i').exec(source);
      return match ? match.index + match[1].length : -1;
    }
    return source.toLowerCase().indexOf(cleanToken.toLowerCase());
  }

  function findSnippet(text, query) {
    const clean = String(text || '').replace(/\s+/g, ' ').trim();
    if (!clean) return '';
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean).sort((a, b) => b.length - a.length);
    const matches = terms.map(token => searchTokenIndex(clean, token)).filter(index => index >= 0).sort((a, b) => a - b);
    const found = matches.length ? matches[0] : -1;
    if (found < 0) return clean.slice(0, 140) + (clean.length > 140 ? '…' : '');
    const start = Math.max(0, found - 45);
    const end = Math.min(clean.length, found + 110);
    return `${start > 0 ? '…' : ''}${clean.slice(start, end)}${end < clean.length ? '…' : ''}`;
  }

  function searchModules(query, modules, tracks) {
    const term = (query || '').trim().toLowerCase();
    if (!term) return [];

    const list = modules || window.MODULES || [];
    const tokens = [...new Set(term.split(/\s+/).filter(Boolean))];

    return list.map(module => {
      const fields = moduleSearchFields(module, tracks);
      let score = 0;
      const allMatchedTokens = new Set();
      let bestField = null;

      for (const field of fields) {
        const value = String(field.text || '').toLowerCase();
        const matched = tokens.filter(token => searchTokenIndex(value, token) >= 0);
        if (matched.length) {
          const fieldScore = matched.reduce((sum, token) => sum + field.weight * (value.startsWith(token) ? 1.3 : 1), 0);
          score += fieldScore;
          matched.forEach(token => allMatchedTokens.add(token));
          if (!bestField || fieldScore > bestField.score) {
            bestField = { ...field, score: fieldScore };
          }
        }
      }

      if (!bestField) return null;

      const coverage = allMatchedTokens.size / tokens.length;
      score = score * (0.7 + coverage * 0.3);

      return {
        module,
        score,
        matchType: bestField.label,
        snippet: findSnippet(bestField.text, term),
        coverage
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score || a.module.title.localeCompare(b.module.title));
  }

  window.academySearch = {
    searchModules,
    findSnippet,
    escapeHTML
  };
})(window);

