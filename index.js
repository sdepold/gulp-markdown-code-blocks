var through     = require('through2');
var gutil       = require('gulp-util');
var path        = require('path');
var exec        = require('child_process').exec;
var path        = require('path');
var PluginError = gutil.PluginError;
var resolve     = require('resolve').sync;
var os          = require('os');
var fs          = require('fs');

module.exports = function () {
  return through.obj(function (file, enc, cb) {
    this.push(file);
    evalCodeInMarkdownFile(enhanceFile(file), cb);
  });
};

function getExecutablePath () {
  return path.resolve(
    path.dirname(resolve('markdown-code-blocks')),
    'cmd.js'
  );
}

function evalCodeInMarkdownFile (file, callback) {
  exec(
    getExecutablePath() + ' -t javascript,js ' + file.path + ' | node',
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

function enhanceFile (file) {
  var fileExtension = path.extname(file.path);
  var newFileName   = file.path.replace(/[^\w-]/g, '-') + fileExtension;
  var newPath       = path.join(os.tmpdir(), newFileName);
  var content       = fs.readFileSync(file.path).toString();
  var packageInfo   = getPackageInformation(file);

  if (packageInfo) {
    var regExp = new RegExp('require\\([\'"]' + packageInfo.name + '[\'"]\\)', 'g');
    content = content.replace(regExp, 'require("' + packageInfo.path + '")');
  }

  fs.writeFileSync(newPath, content);

  return fs.createReadStream(newPath);
}

function getPackageInformation (file) {
  var dirname     = path.dirname(file.path);
  var packagePath = path.join(dirname, 'package.json');

  if (fs.existsSync(packagePath)) {
    var packageJson = require(packagePath);

    return {
      name: packageJson.name,
      path: path.join(dirname, packageJson.main)
    };
  }
}
