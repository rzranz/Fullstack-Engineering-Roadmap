/**
 * State Management for Full-Stack, QA & System Architect Academy
 * Persistent local storage, zero login required, fully offline capable.
 */

(function (window) {
  'use strict';

  const STORAGE_KEY = 'engineering-academy.v6';
  const LEGACY_STORAGE_KEYS = ['engineering-academy.v5', 'engineering-academy.v4', 'engineering-academy.v2'];
  const VALID_MODES = ['fullstack', 'qa', 'sa'];

  function normalizeModulesRegistry() {
    if (!Array.isArray(window.MODULES)) {
      window.MODULES = [];
    }
    const seen = new Set(window.MODULES.map(m => m.id));
    window.MODULES.forEach(m => {
      if (!m.mode) m.mode = 'fullstack';
    });

    const extraSets = [window.QA_MODULES, window.SA_MODULES];
    extraSets.forEach(list => {
      if (Array.isArray(list)) {
        list.forEach(m => {
          if (!seen.has(m.id)) {
            seen.add(m.id);
            window.MODULES.push(m);
          }
        });
      }
    });
  }

  class AcademyState {
    constructor() {
      normalizeModulesRegistry();
      this.listeners = new Set();
      this.data = this.loadFromStorage();
    }

    loadFromStorage() {
      let raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        for (const legacyKey of LEGACY_STORAGE_KEYS) {
          raw = localStorage.getItem(legacyKey);
          if (raw) break;
        }
      }

      let parsed = {};
      try {
        if (raw) parsed = JSON.parse(raw);
      } catch (err) {
        console.warn('Failed to parse previous state:', err);
      }

      const mode = VALID_MODES.includes(parsed.activeMode) ? parsed.activeMode : 'fullstack';

      return {
        completed: new Set(Array.isArray(parsed.completed) ? parsed.completed : []),
        bookmarks: new Set(Array.isArray(parsed.bookmarks) ? parsed.bookmarks : []),
        answers: parsed.answers && typeof parsed.answers === 'object' ? parsed.answers : {},
        lessonSteps: parsed.lessonSteps && typeof parsed.lessonSteps === 'object' ? parsed.lessonSteps : {},
        implChecks: parsed.implChecks && typeof parsed.implChecks === 'object' ? parsed.implChecks : {},
        labPassed: parsed.labPassed && typeof parsed.labPassed === 'object' ? parsed.labPassed : {},
        current: typeof parsed.current === 'string' ? parsed.current : null,
        theme: parsed.theme === 'dark' ? 'dark' : 'light',
        activeMode: mode
      };
    }

    buildPayload() {
      return {
        completed: [...this.data.completed],
        bookmarks: [...this.data.bookmarks],
        answers: this.data.answers,
        lessonSteps: this.data.lessonSteps,
        implChecks: this.data.implChecks,
        labPassed: this.data.labPassed,
        current: this.data.current,
        theme: this.data.theme,
        activeMode: this.data.activeMode
      };
    }

    save() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.buildPayload()));
      } catch (err) {
        console.warn('LocalStorage save failed:', err);
      }
      this.notify();
    }

    notify() {
      for (const listener of this.listeners) {
        try {
          listener(this);
        } catch (err) {
          console.error('Error in state subscriber:', err);
        }
      }
    }

    subscribe(listener) {
      this.listeners.add(listener);
      return () => this.listeners.delete(listener);
    }

    getMode() {
      return this.data.activeMode || 'fullstack';
    }

    setMode(mode, silent = false) {
      if (!VALID_MODES.includes(mode)) return;
      if (this.data.activeMode === mode) return;
      this.data.activeMode = mode;
      if (silent) {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(this.buildPayload()));
        } catch {}
      } else {
        this.save();
      }
    }

    getImplChecks(moduleId) {
      return new Set(Array.isArray(this.data.implChecks[moduleId]) ? this.data.implChecks[moduleId] : []);
    }

    toggleImplCheck(moduleId, stepKey) {
      const current = new Set(Array.isArray(this.data.implChecks[moduleId]) ? this.data.implChecks[moduleId] : []);
      if (current.has(stepKey)) current.delete(stepKey);
      else current.add(stepKey);
      this.data.implChecks[moduleId] = [...current];
      this.save();
      return current.has(stepKey);
    }

    getLabPassed(moduleId) {
      return this.data.labPassed[moduleId] || {};
    }

    setLabPassed(moduleId, tier, passed = true) {
      if (!this.data.labPassed[moduleId]) this.data.labPassed[moduleId] = {};
      this.data.labPassed[moduleId][tier] = Boolean(passed);
      this.save();
    }

    isCompleted(moduleId) {
      return this.data.completed.has(moduleId);
    }

    toggleCompleted(moduleId) {
      if (this.data.completed.has(moduleId)) {
        this.data.completed.delete(moduleId);
      } else {
        this.data.completed.add(moduleId);
      }
      this.save();
      return this.isCompleted(moduleId);
    }

    setCompleted(moduleId, completed = true) {
      if (completed) {
        this.data.completed.add(moduleId);
      } else {
        this.data.completed.delete(moduleId);
      }
      this.save();
    }

    isBookmarked(moduleId) {
      return this.data.bookmarks.has(moduleId);
    }

    toggleBookmark(moduleId) {
      if (this.data.bookmarks.has(moduleId)) {
        this.data.bookmarks.delete(moduleId);
      } else {
        this.data.bookmarks.add(moduleId);
      }
      this.save();
      return this.isBookmarked(moduleId);
    }

    getAnswer(moduleId) {
      return Number.isInteger(this.data.answers[moduleId]) ? this.data.answers[moduleId] : null;
    }

    setAnswer(moduleId, answerIndex) {
      this.data.answers[moduleId] = Number(answerIndex);
      this.save();
    }

    getLessonStep(moduleId) {
      return Number.isInteger(this.data.lessonSteps[moduleId]) ? this.data.lessonSteps[moduleId] : 0;
    }

    setLessonStep(moduleId, stepIndex) {
      this.data.lessonSteps[moduleId] = Math.max(0, Number(stepIndex));
      this.save();
    }

    get theme() {
      return this.data.theme;
    }

    toggleTheme() {
      this.data.theme = this.data.theme === 'dark' ? 'light' : 'dark';
      this.save();
      return this.data.theme;
    }

    getProgressStats(modules, modeFilter = null) {
      let list = modules || (window.MODULES || []);
      if (modeFilter) {
        list = list.filter(m => (m.mode || 'fullstack') === modeFilter);
      }
      const total = list.length;
      const completed = list.filter(m => this.data.completed.has(m.id)).length;
      const percent = total ? Math.round((completed / total) * 100) : 0;
      return {
        total,
        completed,
        percent,
        bookmarksCount: this.data.bookmarks.size
      };
    }

    getTrackStats(trackId, modules) {
      const list = (modules || (window.MODULES || [])).filter(m => m.track === trackId);
      const total = list.length;
      const completed = list.filter(m => this.data.completed.has(m.id)).length;
      const percent = total ? Math.round((completed / total) * 100) : 0;
      return { total, completed, percent };
    }
  }

  window.academyState = new AcademyState();
})(window);
