/**
 * Develop tasks
 */

'use strict';

const
    path    = require('path'),
    runner  = require('runner'),
    tools   = require('runner-tools'),
    logger  = require('runner-logger'),
    source  = 'src',
    target  = path.join('..', 'master');


Object.assign(
    runner.tasks,

    require('runner-generator-pug')({
        source: path.join(source, 'pug', 'main.pug'),
        target: path.join(target, 'index.html'),
        options: {
            pretty: true
        },
        variables: {
            develop: true,
            package: require('../package')
        }
    }),

    require('runner-generator-repl')({
        runner: runner
    }),

    require('runner-generator-sass')({
        file: path.join(source, 'sass', 'develop.scss'),
        outFile: path.join(target, 'main.css'),
        sourceMap: path.join(target, 'main.css.map')
    }),

    require('runner-generator-static')({
        path: path.join(target),
        port: 9090
    })
);


// main tasks
// runner.task('init', function ( done ) {
//     tools.mkdir([path.join(target, 'lang')], logger.wrap('init'), done);
// });

runner.task('copy', function ( done ) {
    tools.copy(
        {
            source: path.join(source, 'img'),
            target: path.join(target, 'img')
        },
        logger.wrap('copy'),
        done
    );
});

runner.task('build', runner.parallel('pug:build', 'sass:build', 'copy'));

// eslint-disable-next-line no-unused-vars
runner.task('watch', function ( done ) {
    runner.watch(path.join(source, 'pug', '**', '*.pug'), 'pug:build');
    runner.watch(path.join(source, 'sass', '**', '*.scss'), 'sass:build');
    runner.watch(path.join(source, 'img', '**', '*'), 'copy');
});

runner.task('serve', runner.parallel('static:start', 'repl:start'));

runner.task('default', runner.serial('build', runner.parallel('watch', 'serve')));
