import gulp from 'gulp';
import webpack from 'webpack';
import gulpWebpack from 'webpack-stream';
import TerserPlugin from 'terser-webpack-plugin-legacy';
import { log, colors } from 'gulp-util';
import named from 'vinyl-named';
import rename from 'gulp-rename';

import args from './lib/args';

gulp.task('xdLib', () => {
  const tmp = {};
  return gulp
    .src('src/lib/**/*.js')
    .pipe(named())
    .pipe(
      rename((path) => {
        tmp[path.basename] = path;
      }),
    )
    .pipe(
      gulpWebpack(
        {
          output: {
            filename: '[name].js',
          },
          plugins: [new TerserPlugin()],
          module: {
            rules: [
              {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                options: {
                  presets: ['@babel/preset-env'],
                },
              },
              {
                test: /\.mjs$/,
                include: /node_modules/,
                use: {
                  loader: 'babel-loader',
                  options: {
                    presets: ['@babel/preset-env'],
                  },
                },
              },
            ],
          },
        },
        webpack,
        (err, stats) => {
          if (err) return;
          log(
            `Finished '${colors.cyan('scripts')}'`,
            stats.toString({
              chunks: false,
              colors: true,
              cached: false,
              children: false,
            }),
          );
        },
      ),
    )
    .pipe(
      rename((path) => {
        path.dirname = tmp[path.basename].dirname;
      }),
    )
    .pipe(gulp.dest(`dist/${args.vendor}/lib`));
});
