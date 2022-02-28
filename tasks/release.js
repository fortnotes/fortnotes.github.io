/**
 * Release tasks
 */

import path from 'path';
import runner from 'runner';
import tools from 'runner-tools';
import logger from 'runner-logger';
import runnerGeneratorSass from 'runner-generator-sass';
import runnerGeneratorRepl from 'runner-generator-repl';
import runnerGeneratorStatic from 'runner-generator-static';
import runnerGeneratorPug from 'runner-generator-pug';


const source  = 'src';
const target  = path.join('..', 'master');


Object.assign(
    runner.tasks,

    runnerGeneratorPug({
        source: path.join(source, 'pug', 'main.pug'),
        target: path.join(target, 'index.html'),
        variables: {
            develop: false,
            package: {
                description: 'Online private information management platform.'
            }
        }
    }),

    runnerGeneratorRepl({
        runner: runner
    }),

    runnerGeneratorSass({
        file: path.join(source, 'sass', 'release.scss'),
        outFile: path.join(target, 'main.css'),
        outputStyle: 'compressed',
        sourceMap: path.join(target, 'main.css.map')
    }),

    runnerGeneratorStatic({
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
