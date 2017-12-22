/**
 * Created by Александр on 22.12.2017.
 */
"use strict";

//это node модули и webpack плагины, которые понадобятся нам в разработке
const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const WebpackOnBuildPlugin = require('on-build-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const AotPlugin = require('@ngtools/webpack').AotPlugin;


//помните, в package.json были команды serve, hmr, prod и т. д.? так вот,
// текущую команду (например, если вы введете npm run serve, то команда будет называться ‘serve’) можно получить и обработать вот так:
const ENV = process.env.npm_lifecycle_event ? process.env.npm_lifecycle_event : '';
const isStatic = ENV === 'serve';
const isHmr = ENV === 'hmr';
const isProd = ENV === 'prod';
const isTest = ENV === 'test';
const isAot = ENV.includes('aot');
const isProdServer = ENV.includes('prodServer');
//в зависимости от команды, мы будем объяснять webpack что делать


//обычно из webpack.config.js экспортируется функция, возвращающая объект с настройками
module.exports = function makeWebpackConfig() {

    console.log(`You are in ${ENV} mode`); //напомнить что мы запустили

    let config = {}; //главный объект с настройками

//если вдруг кто-то выполнит команду npm run prodServer, не выполнив предварительно npm run prod, кидаем напоминалку
    if (isProdServer) {
        if (!fs.existsSync('./dist')) {
            throw "Can't find ./dist, please use 'npm run prod' to get it.";
        }
    }

//подключаем sourcemaps
    if (isHmr || isStatic) {
        config.devtool = 'inline-source-map';
    } else {
        config.devtool = 'source-map';
    }

//обозначаем главный файл, который будет создавать webpack. Этот файл доступен в index.html по пути “./ng-app.js”
    config.entry = {
        'ng-app': './src/app/ng-main.ts'
    };

//специально для AoT режима нужно создать другой файл с другим наполнением, так надо…
    if (isAot) {
        config.entry['ng-app'] = './src/app/ng-main-aot.ts';
    }

// Имя файла, который создаст webpack будет 'ng-app’, так как задали filename: '[name].js', также когда запустим prod сборку,
// результирующий бандл попадет в папку './dist', это указали с помощью path: root('./dist')
    config.output = isTest ? {} : {
        path: root('./dist'), //root – всего лишь функция, для создания правильных путей относительно папки, в которой находится webpack.config.js
        filename: '[name].js'
    };

//в свойстве entry при настройке webpack обязательно нужно задать какой-нибудь файл, иначе возникнет ошибка, но в режиме
// prodServer нам нужно лишь посмотреть на нашу prod сборку.
// По этой причине и создаем поддельный файл, чтобы сервер ни на что, кроме статики, не отвлекался.
// Можно в корень проекта, рядом с webpack.config.js, положить пустой файл webpack-prod-server.js,
// чтобы в логи сервера не попадала ошибка, что этого файла нет, хотя и без него сервер будет работать.
    if (isProdServer) {
        config.entry = {
            'server': './webpack-prod-server.js'
        };
        config.output = {};
    }

//указываем расширения файлов, с которыми webpack будет работать
    config.resolve = {
        extensions: ['.ts', '.js', '.json', '.html', '.less', '.svg']
    };

//определяем так называемые loaders. Если коротко, тут готовый пример для превращения ts в js,
// html вставляем в js бандл, less компилируем в css и вставляем в js бандл, картинки до 10 кб в base64 и вставляем в js бандл.
    config.module = {
        rules: [
            {
                test: /\.ts$/,
                use: isAot ? [{loader: '@ngtools/webpack'}] : [
                    {
                        loader: 'awesome-typescript-loader?'
                    },
                    {
                        loader: 'angular2-template-loader'
                    },
                    {
                        loader: 'angular-router-loader'
                    }
                ].concat(isHmr ? '@angularclass/hmr-loader?pretty=' + !isProd + '&prod=' + isProd : []),
                exclude: [/\.(spec|e2e|d)\.ts$/]
            },
            {
                test: /\.html$/,
                loader: 'raw-loader',
                exclude: [/node_modules\/(?!(ng2-.+))/, root('src/index.html')]
            },
            {
                test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "url-loader?name=[name].[ext]&limit=10000&useRelativePath=true"
            },
            {
                test: /\.less$/,
                use: [
                    {loader: "css-to-string-loader"},
                    {loader: "css-loader"},
                    {loader: "postcss-loader"},
                    {loader: "less-loader"}
                ]
            }
        ]
    };


//если работаем не в режиме тестирования, то подключаем webpack плагины
    if (!isTest) {
        config.plugins = [
//не останавливать webpack warcher при ошибках
            new webpack.NoEmitOnErrorsPlugin(),
//передать текущий режим в наши .ts файлы, как их получить в .ts файлах увидите чуть позже
            new webpack.DefinePlugin({
                'process.env': {
                    'STATIC': isStatic,
                    'HMR': isHmr,
                    'PROD': isProd,
                    'AOT': isAot
                }
            }),
//сделать что-то по окончании сборки
            new WebpackOnBuildPlugin((stats) => {
                console.log('build is done')
            })
        ]
        //если работаем в режиме hmr, то подключить плагин для hmr
            .concat(isHmr ? new webpack.HotModuleReplacementPlugin() : []);
    }


//если вы вызовете команду ‘npm run prod’, то запустите процесс создания prod сборки с AoT
    if (isAot) {
        config.plugins = [
//нужно для AoT режима
            new AotPlugin({
                tsConfigPath: './tsconfig.json',
                entryModule: root('src/app/app.module.ts#AppModule')
            }),
//Оптимизируем полученный бандл
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false,
                    screw_ie8: true,
                    conditionals: true,
                    unused: true,
                    comparisons: true,
                    sequences: true,
                    dead_code: true,
                    evaluate: true,
                    if_return: true,
                    join_vars: true
                },
                output: {
                    comments: false
                },
                sourceMap: true
            }),
//Копируем нужные нам файлы в ./dist папку (js бандл туда положит сам webpack, а мы перенесем то, что нам понадобится дополнительно)                    
            new CopyWebpackPlugin([
                {from: 'index.html', context: './src'},
                {from: 'assets/themes/base/fonts/**/*', context: './src'},
                {from: 'assets/themes/base/images/other-images/**/*', context: './src'},
            ]),
            new WebpackOnBuildPlugin((stats) => {
                console.log('build in aot is done');
            })
        ];
    }


//Ну и наконец настроим наш webpack-dev-server
    config.devServer = {
        contentBase: isProdServer ? "./dist" : "./src",//корневая папка сервера, в prod режиме в ./dist, в режиме разработки в ./src
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
        }, //стандартные заголовки для rest запросов
        historyApiFallback: true, //включаем HTML5 history api, очень удобно 1ой строкой
        compress: true,//включаем gzip
        quiet: false, //ничего лишнего нам выводить в логи не нужно
        inline: isHmr || isStatic || isProdServer, //inline mode
        hot: isHmr, //включаем hmr, если в hmr режиме
        stats: "minimal",
        port: 9000,
//модное окно смерти при ошибке от Webpack
        overlay: {
            errors: true
        },
//Опции для webpack warcher 
        watchOptions: {
            aggregateTimeout: 50,
            ignored: /node_modules/
        }
    };

    return config;
};


//делаем правильный путь от текущей директории
function root(__path = '.') {
    return path.join(__dirname, __path);
}