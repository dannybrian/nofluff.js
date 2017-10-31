# nofluff.js

This is a minimal browser framework for my conference workshop, "Create Your Own JavaScript Framework (Or At Least Learn How)". It's an effort to demonstrate that modern browser features make many JavaScript frameworks — as we know them — unnecessary. And that features the browser *doesn't* provide (such as templating) are not difficult to create.

Nofluff.js uses many modern browser features, including custom elements, shadow DOM, ES6 classes, and custom events. For this reason, you need the webcomponents.js polyfill:

    % bower install
    
Load the lite version into your app first:

    <script src="bower_components/webcomponentsjs/webcomponents-lite.js"></script>

Followed by the framework script:

    <script src="nofluff.js"></script>
    
