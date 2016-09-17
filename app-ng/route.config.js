angular.module('LDAApp')
  .config(['$locationProvider', '$routeProvider', 'layoutProvider',
    function($locationProvider, $routeProvider, layout){
      $locationProvider.hashPrefix('!');

      $routeProvider.
        when('/topic-matrix', {
          template: layout.standard('<topic-matrix></topic-matrix>')
        }).
        when('/topic-matrix/zoom', {
          template: layout.naked('<topic-matrix></topic-matrix>')
        }).
        when('/topic-graph', {
          template: layout.standard('<topic-graph-page></topic-graph-page>')
        }).
        otherwise('/topic-matrix');
    }
  ]);
