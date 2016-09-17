angular.module('LDAApp')
  .config(['ChartJsProvider', function(ChartJs){
    var Chart = ChartJs.$get().Chart
    var lineConfig = Chart.defaults.global.elements.line;
    angular.extend(lineConfig, {
      fill: false,
    });
  }]);
