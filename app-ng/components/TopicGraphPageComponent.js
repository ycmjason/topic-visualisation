function TopicGraphPageController($element, topicService){
  var $ctrl = this;
  $ctrl.fetching = true;

  $ctrl.options = {
    show: false,
    n: 50,
    max_entries: 200,
    from: 0,
    sorting_method: 'alphabet',
    sorting_method_topic: null,
    chart_type: 'bar',
    chart_max_y: 'auto',
    combined_chart_topics: [],
  }

  $ctrl.topics = [];
  $ctrl.charts = [];
  $ctrl.charts_options = {
    scales: {
      yAxes: [{
        ticks: {
          suggestedMin: 0
        }
      }]
    }
  };

  var cloneAndEditTopicsToFitOptions = function(topics){
    var options = $ctrl.options;
    sorting_method = options.sorting_method;
    // if sorting_method is 'probability' yet the teopic isn't set,
    // fallback to alphabet
    if(sorting_method == 'probability' && !options.sorting_method_topic){
      sorting_method = 'alphabet';
    }

    if(sorting_method == 'probability'){
      var topic = $ctrl.topics.filter(function(t){
        return t.label == options.sorting_method_topic;
      })[0].sort('prob');
      x_axis = topic.getWords(options.from, options.from + options.n);
    }

    topics = topics.map(function(topic){
      switch(sorting_method){
        case 'alphabet':
          topic.sort();
          topic = topic.slice(options.from, options.from + options.n);
          break;
        case 'probability':
          topic = topic.filterWord(function(word){
            return x_axis.indexOf(word) >= 0;
          }).sort(x_axis);
          break;
      }
      return topic;
    });
    return topics;
  };

  $ctrl.updateCombinedChart = function(topics){
    var topics = topics || cloneAndEditTopicsToFitOptions($ctrl.topics);

    var combined_chart_topics = topics.filter(function(t){
      return $ctrl.options.combined_chart_topics.indexOf(t.label) >= 0;
    });

    $ctrl.charts.combined = {
      name: 'Combined chart',
      data: combined_chart_topics.map(function(t){
        return t.getProbabilities();
      }),
      labels: combined_chart_topics[0].getWords(),
      series: combined_chart_topics.map(function(t){
        return t.label;
      })
    }
  }
  $ctrl.setYMax = function(topics){
    var max = $ctrl.options.chart_max_y;
    if(isNaN(parseFloat(max))|| max=='auto'){
      var topics = topics || cloneAndEditTopicsToFitOptions($ctrl.topics);
      max = topics.map(function(t){
        // find the max. prob in topic
        return Math.max.apply(null, t.getProbabilities());
      }).reduce(function(p1, p2){
        // find the max. prob in the topics
        return Math.max(p1, p2); 
      });
    }
    $ctrl.charts_options.scales.yAxes[0].ticks.suggestedMax = parseFloat(max);
    return;
  };
  $ctrl.updateChart = function(){
    var updateYAxes = function(topics){
    }
    // n and from have to be manually updated to avoid rendering during change of value
    $ctrl.options.n = parseInt($ctrl.options.n);
    $ctrl.options.from = parseInt($ctrl.options.from);

    var options = $ctrl.options;

    var topics = cloneAndEditTopicsToFitOptions($ctrl.topics);
    $ctrl.charts = topics.map(function(topic){
      return {
        name: topic.label,
        data: [topic.getProbabilities()],
        labels: topic.getWords(),
      };
    });

    $ctrl.updateCombinedChart(topics);
    $ctrl.setYMax(topics);
  };
  topicService.get().then(function(topics){
    $ctrl.topics = topics;
    $ctrl.options.combined_chart_topics = $ctrl.topics.map(function(t){
      return t.label;
    });
    $ctrl.updateChart();
    $ctrl.fetching = false;
  });
}

angular.module('LDAApp').component('topicGraphPage', {
  templateUrl: 'app-ng/components/TopicGraphPageComponent.html',
  controller: ['$element', 'topicService', TopicGraphPageController],
})
