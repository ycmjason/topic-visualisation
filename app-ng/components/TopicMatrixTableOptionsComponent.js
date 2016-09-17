function TopicMatrixTableOptionsController($element, colorService, keyboardEvent){
  var $ctrl = this;
  $ctrl.inputs = {};

  $ctrl.contrastColor = colorService.contrast;

  $ctrl.addColorKeyup = function(e){
    switch(keyboardEvent.getKeycodeName(e.keyCode)){
      case 'enter':
        $ctrl.addColor();
        break;
    }
  };
  $ctrl.addColor = function(){
    var color = $ctrl.inputs.add_color;
    if(colorService.isColor(color)){
      $ctrl.options.color_pivots.push(color);
      $ctrl.inputs.add_color = '';
    }
  };

  $ctrl.removeColor = function(i){
    $ctrl.options.color_pivots = $ctrl.options.color_pivots.filter(function(v, index){
      return index != i;
    });
  };

  $ctrl.onDrop = function(e){
    var swap = function(arr, i, j){
      var temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
      return arr;
    };
    var insertBefore = function(arr, i, j){
      if(i == j || i == j - 1) return arr;
      else if(i < j) return insertBefore(swap(arr, i, i+1), i+1, j);
      else if(i > j) return insertBefore(swap(arr, i, i-1), i-1, j);
    };
    var insertAfter = function(arr, i, j){
      if(i == j || i == j + 1) return arr;
      else if(i < j) return insertAfter(swap(arr, i, i+1), i+1, j);
      else if(i > j) return insertAfter(swap(arr, i, i-1), i-1, j);
    };

    dropped_chip = e.target;
    next_chips = $($(dropped_chip).nextAll('.chip').get().reverse());
    prev_chips = $($(dropped_chip).prevAll('.chip').get().reverse());
    next_chips.each(function(){
      if($(this).position().left < $(dropped_chip).position().left){
        insertAfter($ctrl.options.color_pivots,
             $(dropped_chip).data('index'),
             $(this).data('index'));
        // break the each loop
        return false;
      }
    });
    prev_chips.each(function(){
      if($(this).position().left > $(dropped_chip).position().left){
        insertBefore($ctrl.options.color_pivots,
             $(dropped_chip).data('index'),
             $(this).data('index'));
        // break the each loop
        return false;
      }
    });
    $(dropped_chip).css('top', '0').css('left', '0');
  };
};

angular.module('LDAApp').component('topicMatrixTableOptions', {
  templateUrl: 'app-ng/components/TopicMatrixTableOptionsComponent.html',
  bindings: {
    options: '<'
  },
  controller: ['$element', 'colorService', 'keyboardEvent', TopicMatrixTableOptionsController]
});
