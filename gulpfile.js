'use strict';

var gulp    = require('gulp');
var mdBlock = require('./');

gulp.task('default', function () {
  return gulp.src('./README.md').pipe(mdBlock());
});
