const { src, dest, watch, parallel } = require('gulp')
const sass = require('gulp-sass')(require('sass'))
const Fibers = require('fibers')
const $ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'gulp.*'],
    replaceString: /\bgulp[\-.]/
})
const stylelint = require('stylelint')
const reporter = require('postcss-reporter')

const compileSass = (cb) => {
    src('sass/**/*.scss', {
        sourcemaps: true, // init
        base: './sass'
    })
        .pipe(
            sass({
                outputStyle: 'compressed',
                fiber: Fibers,
                includePaths: 'node_modules'
            })
                .on('error', sass.logError)
        )
        .pipe($.plumber({
            errorHandler(err) {
                console.log(err.messageFormatted)
                this.$emit('enf')
            }
        }))
        .pipe(dest('./dist', {
            sourcemaps: true // write
        }))
    cb()
}

const lintStyles = (cb) => {
    src('sass/**/*.scss').pipe(
        $.postcss(
            [
                stylelint(),
                reporter({
                    clearReportedMessages: true,
                    clearMessages: true
                })
            ],
            {
                syntax: require('postcss-scss')
            }
        )
    )
    cb()
}

const watchCompileSass = (cb) => {
    watch(['sass/**/*.scss'], compileSass)
    cb()
}

const watchLintStyles = (cb) => {
    watch(['sass/**/*.scss'], lintStyles)
    cb()
}

exports.default = parallel(
    compileSass,
    lintStyles
)

exports.watch = parallel(
    watchCompileSass,
    watchLintStyles
)
