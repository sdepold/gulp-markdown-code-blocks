var through     = require('through2');
var gutil       = require('gulp-util');
var path        = require('path');
var exec        = require("child_process").exec;
var PluginError = gutil.PluginError;
var vm          = require('vm');

module.exports = function () {
  return through.obj(function (file, enc, cb) {
    this.push(file);
    evalCodeInMarkdownFile(file, cb);
  });
};

// markdown-code-blocks -t javascript README.md|node

function getExecutablePath () {
  return path.resolve(__dirname, 'node_modules', '.bin', 'markdown-code-blocks');
}

function evalCodeInMarkdownFile (file, callback) {
  var call = exec(
    getExecutablePath() + ' -t javascript ' + file.path + ' | node',
    function (error, stdout, stderr) {
      if (error) {
        callback(new PluginError("gulp-markdown-code-blocks", "Parsing failed."));
      } else {
        callback();
      }
    }
  );
}
