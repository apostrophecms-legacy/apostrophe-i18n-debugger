module.exports = {
  afterConstruct: function(self) {
    self.pushAssets();
  },
  construct: function(self, options) {
    self.pushAssets = function() {
      self.pushAsset('script', 'user');
      self.pushAsset('stylesheet', 'user');
    };
    self.expressMiddleware = function(req, res, next) {
      if (req.query.i18nDebugger === '1') {
        req.session.i18nDebuggerActive = true;
      } else if (req.query.i18nDebugger === '0') {
        req.session.i18nDebuggerActive = false;
      }
      if (req.query.i18nDebugger && req.query.i18nDebugger.length) {
        return res.redirect(self.apos.urls.build(req.url, { i18nDebugger: null }));
      }
      return next();
    };
    self.menu = function(req) {
      if (!req.user) {
        return '';
      }
      return self.partial('menu', { active: req.session.i18nDebuggerActive });
    };
    self.apiRoute('post', 'fetch', function(req, res, next) {
      return next(null, {
        tooltips: req.session.i18nDebugger || {}
      });
    });
    self.apos.pages.addAfterContextMenu(self.menu);

    // Use the super pattern to patch the i18n wrapper function
    // of the apostrophe-templates module
    var superI18n = self.apos.templates.i18n;
    self.apos.templates.i18n = function(req, name, key) {
      if (req.session.i18nDebuggerActive) {
        req.session.i18nDebugger = req.session.i18nDebugger || {};
      }
      var s = superI18n.apply(null, Array.prototype.slice.call(arguments));
      if (req.session.i18nDebuggerActive) {
        req.session.i18nDebugger[s] = key;
        return '⸨' + s + '⸩';
      } else {
        return s;
      }
    };
  }
};
