const { src, dest, series, watch } = require('gulp');
const plugins = require('gulp-load-plugins')();
// 说明：del插件无gulp-开头，无法通过plugins插件直接使用，需要单独引入
// 7.0.0版本需要用到esm
const del = require('del');
//    gulp-sass no longer has a default Sass compiler; please set one yourself.
//    Both the "sass" and "node-sass" packages are permitted.
//    For example, in your gulpfile:
//
//        const sass = require('gulp-sass')(require('sass'));
const sass = require('gulp-sass')(require('sass'));

const browserSync = require('browser-sync');
const reload = browserSync.reload;


// 压缩js uglifyjs
function js (cb) {
  // console.log('this is js scripts task')
  src('js/*.js')
    // 下一个处理环节
    .pipe(plugins.uglify())
    .pipe(dest('./dist/js'))
    .pipe(reload({ stream: true }));
  cb();
}

// 对scss/less编译，压缩，输出css文件
function css (cb) {
  // console.log('this is css styles task')
  src('css/*.scss')
    .pipe(sass({ outputStyle: 'compressed' }))
    .pipe(plugins.autoprefixer({
      cascade: false,
      remove: false
    }))
    .pipe(dest('./dist/css'))
    .pipe(reload({ stream: true }));
  cb();
}

// 监听这些文件的变化
function watcher () {
  watch('js/*.js', js);
  watch('css/*.scss', css);
}

// 删除dist目录中的内容
function clean (cb) {
  del('./dist');
  cb();
}

// server任务
function serve (cb) {
  browserSync.init({
    server: {
      baseDir: './'
    }
  })
  cb()
}

// 导出等于创建任务，通过  npx gulp --tasks  查看任务
// $ npx gulp scripts 运行任务
exports.scripts = js;
exports.styles = css;
exports.clean = clean;
exports.default = series([
  clean,
  js,
  css,
  serve,
  watcher
]);
