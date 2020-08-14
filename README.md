[![CircleCI](https://circleci.com/gh/apostrophecms/apostrophe-i18n-debugger/tree/master.svg?style=svg)](https://circleci.com/gh/apostrophecms/apostrophe-i18n-debugger/tree/master)

# apostrophe-i18n-debugger

This module helps you find static text in your templates that is not ready
for localization and internationalization (i18n) with the
[i18n helpers](https://www.npmjs.com/package/i18n) included in
[ApostropheCMS](https://apostrophecms.com). It works only when a user is logged in.

## Installation

```
npm install apostrophe-i18n-debugger
```

## Configuration

```javascript
// in app.js, add it to your modules object
modules: {
  'apostrophe-i18n-debugger': {}
}
```

> Don't enable this module in production. It adds overhead. You should use it
in your development and/or staging environments during the initial writing
of your templates.

## Usage

In the admin bar you will see an "i18n 🐞" button.

Click that button to open the i18n debugger modal, then click "Activate" to wrap each translated piece of text wrapped ⸨ like this⸩. The page will refresh. You are now seeing the static translations highlighted. Any text not wrapped in this way has not been translated and you may need to edit your templates to wrap it in a `__('string goes here)'` call, then work on translating in the `locales/` folder.

Now, click "i18n debugger" again in the admin bar and then click the "Keys" button and click "Done" to clsoe the modal. You will now **see the "key" that was passed to the translation helper, not the translated text.** The keys are wrapped 《like this》to help you see the difference.

> In your default locale, or before you start actually translating, they might not be any different. Then again you might be using keywords rather than complete sentences in your i18n helper calls, in which case they will be quite different.

When you are done, you can click "i18n 🐞" again to close the internationalization debugger.

**This module is for debugging static text localization in your templates.** For translation of user-entered content, see [apostrophe-workflow](https://github.com/apostrophecms/apostrophe-workflow).

## Extending the module on the front end

If you have your own frontend code that manipulates text in ways that might not be apparent to the debugger, such as a Vue app, you may be interested in the following capabilities:

```javascript
// Event that fires when translations are loaded
apos.on('i18nDebuggerMaps', function(obj) {
  // obj.map: properties are keys, values are translatiojns
  // obj.reverseMap: properties are translations, values are keys
});

// Event that fires on the browser side when the user toggles
// between showing keys and showing translations
apos.on('i18nDebuggerChange', function(obj) {
  if (obj.keys) {
    // we are showing keys right now
  } else {
    // we are showing translations right now
  }
});
```

However, **note that neither of these events will fire when the debugger is first activated.** This is because the server is responsible for initially reloading the page with special wrapper characters identifying the translated text. This does involve a full page refresh.

So you can trigger a fetch of the maps yourself by calling:

```javascript
apos.modules['apostrophe-i18n-debugger'].retrieve(function(err, obj) {
  // obj.map: properties are keys, values are translatiojns
  // obj.reverseMap: properties are translations, values are keys
});
```

Note that `i18nDebuggerMaps` will be emitted when you call `retrieve`, so you might prefer to just write a handler for that and ignore the return value from the callback.

Finally, you can recognize that the debugger is active by checking:

```javascript
apos.modules['apostrophe-i18n-debugger'].options.active
```

Note that when the debugger first activates the user is always looking at translations, not keys. You will know if this changes by listening for `i18nDebuggerChange` events.

## Namespacing

Apostrophe has basic support for separate namespaces of i18n keys. However, because of the impact on the layout of the display, the namespace associated with a key is not displayed by the debugger. Generally it is clear from context, for instance anything in the Apostrophe admin UI is likely to be in the `apostrophe` namespace.

## Permissions

By default, only users with the site-wide admin permission have access to the i18n debugger. If another group needs access, you can edit the group, click on the `Permissions` tab, and check the `I18n Debugger` box. If you do not see `Groups` on your admin bar, see the apostrophe permissions documentation for how to activate editable groups.

