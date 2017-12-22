  Через терминал заходим в папку, где лежит package.json, и вводим команду npm i
Так как мы используем команды rimraf,
webpack и webpack-dev-server в терминале, то придется объяснить их вашему ПК с помощью команды npm i rimraf webpack webpack-dev-server -g

  Описание зависимостей
  {
    "name": "angular-project",
    "version": "1.0.0",
    "description": "angular scaffolding",
    "author": "maxim1006",
    "license": "MIT",
    "dependencies": {
        //блок необходимых для Angular модулей
        "@angular/animations": "^4.3.6",
        "@angular/common": "^4.3.6",
        "@angular/compiler": "^4.3.6",
        "@angular/compiler-cli": "^4.3.6",
        "@angular/core": "^4.3.6",
        "@angular/forms": "^4.3.6",
        "@angular/http": "^4.3.6",
        "@angular/platform-browser": "^4.3.6",
        "@angular/platform-browser-dynamic": "^4.3.6",
        "@angular/router": "^4.3.6",
        //модули для hmr
        "@angularclass/hmr": "^2.1.1",
        "@angularclass/hmr-loader": "^3.0.2",
        //polyfills для es5
        "core-js": "^2.5.0",
        //модуль для работы декораторов в браузере
        "reflect-metadata": "^0.1.8",
         //модуль для работы с реактивным программированием
        "rxjs": "^5.4.3",
         //типизация и доп. возможности для js
        "typescript": "2.3.4",
        //зоны в js, очень интересно, обязательно почитайте
        "zone.js": "^0.8.17"
    },
    "devDependencies": {
        //для сборки AoT (Ahead-of-Time Compilation) angular
        "@ngtools/webpack": "^1.6.2",
        //поддержка типизации, чтобы не ругался typescript
        "@types/es6-shim": "^0.31.35",
        "@types/jasmine": "^2.5.54",
        "@types/node": "^7.0.43",
        //routing в приложении
        "angular-router-loader": "^0.6.0",
        //так как на выходе получится бандл со встроенными темплейтами
        "angular2-template-loader": "^0.6.2",
        //чтобы не писать префиксы в css
        "autoprefixer": "^6.3.7",
        //для оптимизации работы typescript в webpack
        "awesome-typescript-loader": "^3.2.3",
        //если вдруг надо скопировать папку/файл
        "copy-webpack-plugin": "^4.0.1",
        //для работы с css
        "css-loader": "^0.28.5",
        "css-to-string-loader": "^0.1.2",
        //es6 polyfills
        "es6-shim": "^0.35.1",
        //для мобильной разработки
        "hammerjs": "^2.0.8",
         //чтобы webpack работал с html
        "html-webpack-plugin": "^2.29.0",
        //препроцессор для более удобной работы со стилями
        "less": "^2.7.2",
        "less-loader": "^4.0.3",
        //по завершению сборки сможем вызвать коллбек
        "on-build-webpack": "^0.1.0",
        //вставляет результат работы webpack на страничку
        "raw-loader": "^0.5.1",
        //для работы со стилями
        "postcss-loader": "^1.3.3",
        "style-loader": "^0.17.0",
        //линтер
        "tslint": "^5.7.0",
        //если надо что-нибудь удалить
        "rimraf": "^2.6.1",
        //чтобы вставить картинки в css в виде base64
        "url-loader": "^0.5.8",
        //webpack
        "webpack": "^3.5.5",
        //и его встроенный express сервер
        "webpack-dev-server": "^2.7.1"
    },

//когда введем в терминале эти команды с помощью npm run __command__ (например npm run serve)выполняться соответствующие команды)
    "scripts": {
//Запускаем сервер. При каждом сохранении в вашем редакторе при работе с файлами проекта страничка будет перезагружаться, и вы будете видеть результат. Расскажем подробнее о команде. Для начала запускаем веб-сервер с данными настройками. Если мы хотим видеть в консоли, что с ним происходит (что бандлится и т. д.), используем (флаг --profile); если хотим, чтобы при сохранении в редакторе webpack автоматически обновлял результат, используем (--watch); ну а если хотим видеть проценты компиляции, можем опционально использовать (флаг –-progress).
        "serve": "webpack-dev-server --config ./webpack.config.js --profile --watch --progress",
        //то же, что и serve, но без перезагрузки страницы
        "hmr": "webpack-dev-server --config ./webpack.config.js --profile --watch --progress",
        //создаем prod папочку с нашим проектом
        "prod": "npm run aot",
        //посмотреть как наш проект выглядит в prod, мало ли что
        "prodServer": "webpack-dev-server --config ./webpack.config.js --open",
        //очищаем ./dist на всякий случай
        "clean": "rimraf ./dist",
        //нужно, чтобы в webpack.js понять, что мы делаем aot. Делать это необязательно, но для наглядности нужно.
        "aot": "webpack",
        //тесты для приложения
        "test": "karma start"
    }
}

