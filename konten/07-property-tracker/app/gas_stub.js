/* Google Apps Script tiruan untuk menjalankan Property Tracker di browser dengan data dummy.
 * Semua ID spreadsheet menunjuk ke satu workbook in-memory (window.DUMMY_SHEETS dari data.js). */
(function () {
  function toVal(v) {
    if (typeof v === 'string' && v.indexOf('D:') === 0) {
      var s = v.slice(2), p = s.split(/[-T:]/).map(Number);
      return new Date(p[0], p[1] - 1, p[2], p[3] || 0, p[4] || 0);
    }
    return v;
  }
  function Sheet(name, def) {
    this.name = name; this.grid = {}; this.lastRow = 0; this.lastCol = 0;
    var self = this;
    function put(r, c, v) {
      (self.grid[r] = self.grid[r] || {})[c] = toVal(v);
      if (v !== '' && v !== null) { self.lastRow = Math.max(self.lastRow, r); self.lastCol = Math.max(self.lastCol, c); }
    }
    if (def.rows) def.rows.forEach(function (row, i) { row.forEach(function (v, j) { put(def.start + i, 2 + j, v); }); });
    if (def.cells) Object.keys(def.cells).forEach(function (r) {
      Object.keys(def.cells[r]).forEach(function (c) { put(+r, +c, def.cells[r][c]); });
    });
  }
  Sheet.prototype = {
    getName: function () { return this.name; },
    getLastRow: function () { return this.lastRow; },
    getLastColumn: function () { return this.lastCol; },
    getMaxRows: function () { return 1000; },
    getRange: function (r, c, nr, nc) {
      if (typeof r === 'string') return new Range(this, 1, 1, 1, 1);
      return new Range(this, r, c, nr || 1, nc || 1);
    },
    getDataRange: function () { return new Range(this, 1, 1, this.lastRow, this.lastCol); }
  };
  function Range(sh, r, c, nr, nc) { this.sh = sh; this.r = r; this.c = c; this.nr = nr; this.nc = nc; }
  Range.prototype = {
    getValues: function () {
      var out = [];
      for (var i = 0; i < this.nr; i++) {
        var row = [], g = this.sh.grid[this.r + i] || {};
        for (var j = 0; j < this.nc; j++) { var v = g[this.c + j]; row.push(v === undefined ? '' : v); }
        out.push(row);
      }
      return out;
    },
    getDisplayValues: function () { return this.getValues().map(function (r) { return r.map(function (v) { return v instanceof Date ? v.toISOString().slice(0, 10) : String(v); }); }); },
    getValue: function () { return this.getValues()[0][0]; },
    getDisplayValue: function () { return String(this.getValue()); },
    setValues: function () { return this; }, setValue: function () { return this; }, setFormula: function () { return this; },
    setFormulas: function () { return this; }, clearContent: function () { return this; }, setNumberFormat: function () { return this; }
  };
  var BOOK = {};
  Object.keys(window.DUMMY_SHEETS).forEach(function (n) { BOOK[n] = new Sheet(n, window.DUMMY_SHEETS[n]); });
  var SS = {
    getId: function () { return 'DUMMY'; }, getName: function () { return 'Property Tracker (Dummy)'; },
    getSheetByName: function (n) { return BOOK[n] || null; }, getSheets: function () { return Object.values(BOOK); }
  };
  window.SpreadsheetApp = { openById: function () { return SS; }, getActiveSpreadsheet: function () { return SS; }, flush: function () {} };

  function pad(n) { return (n < 10 ? '0' : '') + n; }
  window.Utilities = {
    formatDate: function (d, tz, f) {
      var y = d.getFullYear(), M = d.getMonth() + 1, dd = d.getDate(), H = d.getHours(), m = d.getMinutes(), s = d.getSeconds();
      return f.replace('yyyy', y).replace('MM', pad(M)).replace('dd', pad(dd)).replace('HH', pad(H)).replace('mm', pad(m))
        .replace('ss', pad(s)).replace(/^M$/, String(M));
    },
    getUuid: function () { return 'demo-' + Math.random().toString(36).slice(2); }
  };
  var cache = {};
  window.CacheService = { getScriptCache: function () { return { get: function (k) { return cache[k] || null; }, put: function (k, v) { cache[k] = v; }, remove: function (k) { delete cache[k]; } }; } };
  var props = {};
  window.PropertiesService = { getScriptProperties: function () { return { getProperty: function (k) { return props[k] || null; }, setProperty: function (k, v) { props[k] = v; }, deleteProperty: function (k) { delete props[k]; } }; } };
  window.Session = { getEffectiveUser: function () { return { getEmail: function () { return 'manager@example.com'; } }; }, getActiveUser: function () { return { getEmail: function () { return 'manager@example.com'; } }; } };
  window.ScriptApp = { getProjectTriggers: function () { return []; }, newTrigger: function () { var t = { forSpreadsheet: function () { return t; }, onEdit: function () { return t; }, create: function () { return t; } }; return t; }, getOAuthToken: function () { return ''; } };
  window.SENT_MAIL = [];
  window.MailApp = { sendEmail: function (o) { window.SENT_MAIL.push(o); } };
  window.LockService = { getScriptLock: function () { return { waitLock: function () {}, tryLock: function () { return true; }, releaseLock: function () {} }; } };

  // google.script.run -> panggil fungsi server (Code.gs dibungkus jadi window.SERVER)
  function runner(ok, fail) {
    return new Proxy({}, {
      get: function (_, fn) {
        if (fn === 'withSuccessHandler') return function (h) { return runner(h, fail); };
        if (fn === 'withFailureHandler') return function (h) { return runner(ok, h); };
        return function () {
          var args = Array.prototype.slice.call(arguments);
          setTimeout(function () {
            try {
              var res = window.SERVER[fn].apply(null, args);
              ok && ok(JSON.parse(JSON.stringify(res === undefined ? null : res)));
            } catch (e) { console.error(fn, e); fail && fail(e); }
          }, 10);
        };
      }
    });
  }
  window.google = { script: { run: runner(null, null) } };
})();
