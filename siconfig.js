var Rule = require('static-include').Rule;

jsfiles = [
  'main.js',
  'shared/layoutProvider.js',
  'route.config.js',
  'chartjs.config.js',
  'shared/colorService.js',
  'shared/topicService.js',
  'shared/keyboardEventService.js',
  'shared/watcherFactory.js',
  'components/SortIconComponent.js',
  'components/AppNavComponent.js',
  'components/PreloaderComponent.js',
  'components/TopicGraphPageComponent.js',
  'components/TopicMatrixComponent.js',
  'components/TopicMatrixTableComponent.js',
  'components/TopicMatrixTableOptionsComponent.js',
  'directives/scrollableTableDirective.js',
  'directives/uiDraggableDirective.js',
];

cssfiles = [
  'index.css',
];


jslibfiles = [
  'node_modules/jquery/dist/jquery.min.js',
  'node_modules/angular/angular.min.js',
  'node_modules/materialize-css/dist/js/materialize.min.js',
  'node_modules/angular-materialize/src/angular-materialize.min.js',
  'node_modules/angular-route/angular-route.min.js',
  'node_modules/chart.js/dist/Chart.min.js',
  'node_modules/angular-chart.js/dist/angular-chart.min.js'
];

csslibfiles = [
  'http://fonts.googleapis.com/icon?family=Material+Icons',
  'node_modules/materialize-css/dist/css/materialize.min.css'
];


jsfiles = jsfiles.map(file => 'app-ng/' + file);
cssfiles = csslibfiles.concat(cssfiles.map(file => 'app-ng/css/' + file));

jsLibRule = Rule.use('js').withValues(jslibfiles);
jsLibRule.placeholder = '{[jslib]}';

module.exports = {
  rules: [
    jsLibRule,
    Rule.use('js').withValues(jsfiles),
    Rule.use('css').withValues(cssfiles)
  ]
};
