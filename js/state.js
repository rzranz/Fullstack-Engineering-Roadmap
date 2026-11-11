/**
 * State Management for Full-Stack Engineering Academy
 * Persistent local storage, zero login required, fully offline capable.
 */

(function (window) {
  'use strict';

  const STORAGE_KEY = 'engineering-academy.v5';
  const LEGACY_STORAGE_KEYS = ['engineering-academy.v4', 'engineering-academy.v2'];

  class AcademyState {
    constructor() {
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

      return {
        completed: new Set(Array.isArray(parsed.completed) ? parsed.completed : []),
        bookmarks: new Set(Array.isArray(parsed.bookmarks) ? parsed.bookmarks : []),
        answers: parsed.answers && typeof parsed.answers === 'object' ? parsed.answers : {},
        lessonSteps: parsed.lessonSteps && typeof parsed.lessonSteps === 'object' ? parsed.lessonSteps : {},
        current: typeof parsed.current === 'string' ? parsed.current : null,
        theme: parsed.theme === 'dark' ? 'dark' : 'light'
      };
    }

    save() {
      try {
        const payload = {
          completed: [...this.data.completed],
          bookmarks: [...this.data.bookmarks],
          answers: this.data.answers,
          lessonSteps: this.data.lessonSteps,
          current: this.data.current,
          theme: this.data.theme
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
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

    getProgressStats(modules) {
      const list = modules || (window.MODULES || []);
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

