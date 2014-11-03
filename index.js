var through     = require('through2');
var gutil       = require('gulp-util');
var path        = require('path');
var exec        = require('child_process').exec;
var path        = require('path');
var PluginError = gutil.PluginError;
var resolve     = require('resolve').sync;

module.exports = function () {
  return through.obj(function (file, enc, cb) {
    this.push(file);
    evalCodeInMarkdownFile(file, cb);
  });
};

// markdown-code-blocks -t javascript README.md|node

function getExecutablePath () {
  return path.resolve(
    path.dirname(resolve('markdown-code-blocks')),
    'cmd.js'
  );
}

function evalCodeInMarkdownFile (file, callback) {
  var call = exec(
    getExecutablePath() + ' -t javascript ' + file.path + ' | node',
    function (error, stdout, stderr) {
      if (error) {
        process.stderr.write(stderr + "\n");
        callback(new PluginError("gulp-markdown-code-blocks", "Parsing failed."));
      } else {
        callback();
      }
    }
  );
}
