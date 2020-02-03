apos.define('apostrophe-i18n-debugger', {
  extend: 'apostrophe-context',
  afterConstruct: function(self) {
    self.enableClickHandlers();
    self.enableDebugger();
  },
  construct: function(self, options) {

    var keys = false;
    var i18nMap = {};
    var i18nReverseMap = {};

    self.enableClickHandlers = function() {
      apos.adminBar.link('apostrophe-i18n-debugger', function() {
        self.modal();
      });
    };

    self.modal = function() {
      apos.create('apostrophe-i18n-debugger-modal', options);
    };

    self.enableDebugger = function() {

      $('body').on('click', '[data-i18n-debugger-activate]', function() {
        if (window.location.search && window.location.search.length) {
          window.location.search += '&i18nDebugger=1';
        } else {
          window.location.search = 'i18nDebugger=1';
        }
        return false;
      });

      $('body').on('click', '[data-i18n-debugger-deactivate]', function() {
        if (window.location.search && window.location.search.length) {
          window.location.search += '&i18nDebugger=0';
        } else {
          window.location.search = 'i18nDebugger=0';
        }
        return false;
      });

      $('body').on('click', '[data-i18n-debugger-toggle]', function() {
        keys = !keys;
        self.retrieve(function(err) {
          if (err) {
            apos.utils.error(err);
            return;
          }
          self.display();
          $('[data-i18n-debugger-toggle]').removeClass('apos-active');
          $('[data-i18n-debugger-toggle]').prop('disabled', false);
          if (keys) {
            $('[data-i18n-debugger-toggle="keys"]').addClass('apos-active');
            $('[data-i18n-debugger-toggle="keys"]').prop('disabled', true);
          } else {
            $('[data-i18n-debugger-toggle="translations"]').addClass('apos-active');
            $('[data-i18n-debugger-toggle="translations"]').prop('disabled', true);
          }
        });
        return false;
      });
    };

    self.retrieve = function(callback) {
      return apos.utils.post('/modules/apostrophe-i18n-debugger/fetch', {}, function(err, data) {
        if (err) {
          return callback(err);
        }
        i18nMap = data.map;
        i18nReverseMap = _.invert(i18nMap);
        var result = {
          map: i18nMap,
          reverseMap: i18nReverseMap
        };
        apos.emit('i18nDebuggerMaps', result);
        return callback(null, result);
      });
    };

    self.display = function() {

      var map = i18nMap;
      var open = '⸨';
      var close = '⸩';
      var newOpen = '《'; 
      var newClose = '》';

      if (!keys) {
        map = i18nReverseMap;
        open = '《';
        close = '》';
        newOpen = '⸨';
        newClose = '⸩';
      }

      var walker = document.createTreeWalker(
        document.body, 
        NodeFilter.SHOW_TEXT, 
        null, 
        false
      );

      var textNode;
      var textNodes = [];

      while (textNode = walker.nextNode()) {
        var text = textNode.textContent;
        var i = 0;
        while (true) {
          var match = text.indexOf(open, i);
          if (match === -1) {
            break;
          }
          var offset = match + 1;
          // Correctly balance when nested, only get excited
          // about the outer one
          var depth = 1;
          while (offset < text.length) {
            if (text.charAt(offset) === close) {
              depth--;
              if (!depth) {
                break;
              }
            } else if (text.charAt(offset) === open) {
              depth++;
            }
            offset++;
          }
          if (depth) {
            // Confused
            break;
          }
          var end = offset;
          var s = text.substring(match + 1, end);
          i = end + 1;

          if (map[s]) {
            text = text.substring(0, match) + newOpen + map[s] + newClose + text.substring(i);
            i += (map[s].length - s.length);
          }
        }
        textNode.textContent = text;
      }
      apos.emit('i18nDebuggerChange', {
        keys: keys
      });
    };
  }
});

$(function() {
  apos.on('i18nDebuggerMaps', function(e) {
    console.log(e);
  });
  apos.on('i18nDebuggerChange', function(e) {
    console.log(e);
  });
});
