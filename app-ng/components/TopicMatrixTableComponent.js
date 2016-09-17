function TopicMatrixTableController(watcherFactory, colorService){
  var generateTable = function(topics){
    words = topics[0].getWords()
    rows = words.map(function(word, i){
      row = [word];
      topics.forEach(function(t){
        row.push(t.getProbability(i))
      });
      return row;
    });
    return rows;
  };
  var $ctrl = this;

  $ctrl.options = {
    show: false,
    number_of_colors: 16,
    color_pivots: ['#1b5e20', 'rgb(255, 255, 0)', '#b71c1c'],
  };
  $ctrl.table = [];

  $ctrl.probability_range = (function(){
    all_probabilities = [].concat.apply([], $ctrl.topics.map(function(t){
      return t.getProbabilities();
    }));
    min = all_probabilities[0];
    max = all_probabilities[0];
    all_probabilities.forEach(function(p){
      min = Math.min(p, min)
      max = Math.max(p, max)
    });
    return [min, max]; 
  })()

  $ctrl.show_n_words = 50;
  $ctrl.searchtext = '';
  $ctrl.showColor = true;

  $ctrl.increase_n = function(){
    $ctrl.show_n_words += 50
  };

  $ctrl.sort = (function(){
    lastIndex = 0;
    c = -1;

    return function(rowIndex){
      if(rowIndex == lastIndex){
        c *= -1;
      } else{
        lastIndex = rowIndex;
        c = -1;
      }

      $ctrl.table.sort(function(r1, r2){
        v1 = r1[rowIndex];
        v2 = r2[rowIndex];
        if(v1 < v2) return c*-1;
        else if(v1 > v2) return c*1;
        else return 0;
      });
    };
  })();

  $ctrl.search = function(){
    if($ctrl.searchtext.trim().length == 0){
      $ctrl.table = generateTable($ctrl.topics)
    }else{
      $ctrl.table = generateTable($ctrl.topics).filter(function(row){
        word = row[0]
        var re = new RegExp($ctrl.searchtext, 'g');
        return word.match(re)
      });
    }
  };

  $ctrl.getSpectrum = function(){
    return colorService.getSpectrum($ctrl.options.number_of_colors,
                                    $ctrl.options.color_pivots);
  };
  $ctrl.colors = $ctrl.getSpectrum();

  $ctrl.getStyleFromColor = function(c){
    return {
      'background-color': c,
      'color': colorService.contrast(c)
    };
  };
  $ctrl.getStyle = function(v){
    if(angular.isString(v)) return '';
    // normalize the probability to make it an indicator
    indicator = v / $ctrl.probability_range[1];
    color_range = 1 / $ctrl.colors.length
    for(var i = 0; i < $ctrl.colors.length; i++){
      if(color_range * i <= indicator && indicator <= color_range * (i + 1)){
        return $ctrl.getStyleFromColor($ctrl.colors[i]);
      }
    }
  };

  $ctrl.$doCheck = watcherFactory({
    'options.color_pivots': function(){
      $ctrl.colors = $ctrl.getSpectrum();
    },
    'options.number_of_colors': function(){
      $ctrl.colors = $ctrl.getSpectrum();
    }
  });

  $ctrl.$onChanges = function(changes){
    if(changes.topics){
      $ctrl.table = generateTable($ctrl.topics)
    }
  };
}

angular.module('LDAApp').component('topicMatrixTable', {
  templateUrl: 'app-ng/components/TopicMatrixTableComponent.html',
  bindings: {
    topics: '<'
  },
  controller: ['watcherFactory', 'colorService', TopicMatrixTableController],
})
