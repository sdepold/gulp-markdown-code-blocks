# gulp-markdown-code-blocks [![Build Status](https://secure.travis-ci.org/sdepold/gulp-markdown-code-blocks.png)](http://travis-ci.org/sdepold/gulp-markdown-code-blocks)

Gulp task for running [markdown-code-blocks](https://github.com/grncdr/markdown-code-blocks).

## Installation

```
npm install --save-dev gulp gulp-markdown-code-blocks markdown-code-blocks
```

## Usage

Evaluating the code of your readme file is as easy as this:

```javascript
'use strict';

var gulp    = require('gulp');
var mdBlock = require('gulp-markdown-code-blocks');

gulp.task('default', function () {
  return gulp.src('./README.md').pipe(mdBlock());
});
```

## Niceties

Please note that the previous snippet is a code fence, that is evaluated by the code block parser as
well. That means it will try to evaluate `require('gulp-markdown-code-blocks')`, a.k.a. it will try
to resolve the name of this project, which is not part of the `package.json` file. Before throwing
the readme file into `markdown-code-blocks`, the gulp task try to find your `package.json` in the
same directory as the readme file and replace `require('name-of-your-package')` with `require('value-of-the-main-property-of-your-package-json')`. So in case of this lib, it will actually
be `require('./index.js')`.

## Test

The following snippet will be executed and evaluated:

```javascript
require('assert')(true);
```

## License

MIT
