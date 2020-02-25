module.exports = {
  afterConstruct: function(self) {
    self.pushAssets();
    self.addToAdminBar();
  },
  construct: function(self, options) {
    self.pushAssets = function() {
      self.pushAsset('script', 'user');
      self.pushAsset('script', 'modal');
      self.pushAsset('stylesheet', 'user');
    };
    self.on('apostrophe-pages:beforeSend', 'singleton', function(req) {
      if (req.user) {
        self.pushCreateSingleton(req, 'always');
      }
    });
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

    self.addToAdminBar = function() {
      self.apos.adminBar.add(self.__meta.name, 'i18n 🐞', 'apos-i18n-debugger');
    };

    self.renderRoute('post', 'modal', function(req, res, next) {
      return next(null, {
        template: 'modal',
        data: {
          active: req.session.i18nDebuggerActive
        }
      });
    });

    self.apiRoute('post', 'fetch', function(req, res, next) {
      return next(null, {
        map: req.session.i18nDebugger || {}
      });
    });

    self.getCreateSingletonOptions = function(req) {
      return {
        active: req.session.i18nDebuggerActive,
        action: self.action
      };
    };

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
