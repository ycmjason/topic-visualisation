angular.module('LDAApp') .directive('uiDraggable', ['$document', function($document) {
  return {
    scope:{
      onDrag: '&',
      onDrop: '&'
    },
    link: function(scope, element, attr) {
      var startX = 0, startY = 0, x = 0, y = 0;

      function tempCss(e, p, v){
        var original_value = e.css(p);
        e.css(p, v);
        return function(){
          e.css(p, original_value);
        };
      }
      function tempClass(e, c){
        e.addClass(c);
        return function(){
          e.removeClass(c);
        };
      }

      function callAll(fs, this_arg){
        return function(event){
          scope.$apply(function(){
            fs.forEach(function(fn){
              fn.call(scope, {$event: event});
            });
          });
        };
      };

      function mousemove(scope){
        var event = scope.$event;
        y = event.pageY - startY;
        x = event.pageX - startX;
        element.css({
          top: y + 'px',
          left:  x + 'px'
        });
      }

      function mouseup(){
        $document.off('mousemove');
        $document.off('mouseup');
      }

      element.css('cursor', 'pointer')
        .css('position', 'relative');

      element.on('mousedown', function(event) {
        // Prevent default dragging of selected content
        event.preventDefault();

        x = parseFloat(element.css('left')) || 0;
        y = parseFloat(element.css('top')) || 0;

        var mousemove_cbs = [mousemove];
        var mouseup_cbs = [mouseup];
        
        mouseup_cbs.push(tempCss(element, 'z-index', '10'));
        mouseup_cbs.push(tempClass(element, 'z-depth-1'));

        if(scope.onDrag){
          mousemove_cbs.push(scope.onDrag);
        }

        if(scope.onDrop){
          mouseup_cbs.push(scope.onDrop);
        }

        startX = event.pageX - x;
        startY = event.pageY - y;

        $document.on('mousemove', callAll(mousemove_cbs, element));
        $document.on('mouseup', callAll(mouseup_cbs, element));
      });

    }
  };
}]);
