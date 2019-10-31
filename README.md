# apostrophe-i18n-debugger

This module helps you find static text in your templates that is not ready
for localization and internationalization (i18n) with the 
[i18n helpers](https://www.npmjs.com/package/i18n) included in
[ApostropheCMS](https://apostrophecms.org).

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
