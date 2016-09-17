angular.module('LDAApp').directive('scrollableTable',
                                   ['$timeout', '$compile', function($timeout, $compile){
  var contents;
  return {
    compile: function(element){
      // save the contents to compile later
      contents = element.contents();
      element.html('');
      return function(scope, element, attrs){
        // parse the options
        options = attrs.scrollableTable.split(' ');

        var container = transform(element);
        container.data('fix-head', options.indexOf('fix-head') != -1);
        container.data('fix-col', options.indexOf('fix-col') != -1);

        // compile and add them back to element
        element.append($compile(contents)(scope));

        scope.$watch(function(){
          return container.find('tr, td').length
        }, function(){
          build();
        });

        // timeout to let data to finish rendering
        $timeout(function(){
          build();
        });

        function build(){
          fixWidth(container);

          if(container.data('fix-head')){
            container = fixHead(container);
          }

          if(container.data('fix-col')){
           container = fixCol(container);
          }
        }

        function tempCSS(element, stylename, temp_value, fn){
          // Temporarily replace a css property and restore it after fn();
          var ret;
          var original_value = element.css(stylename);
          element.css(stylename, temp_value);
          ret = fn();
          element.css(stylename, original_value);
          return ret;
        };

        function getMaxWidthTd(container){
          table = container.find('table')

          var widths = tempCSS(table, 'table-layout', 'auto', function(){
            tds = container.find('th, td');
            widths = tds.map(function(){
              return $(this).outerWidth();
            }).get();
            return widths;
          });

          max_width = widths.reduce(function(a, b){
            return Math.max(a, b);
          }, 0);
          return max_width;
        }

        function fixWidth(container){
          var max_width = getMaxWidthTd(container);

          container.find('th, td').outerWidth(max_width);

          tempCSS(table.find('thead tr'), 'display', '', function(){
            table.width(table.find('thead').width());
          });
        }

        function fixHead(container){
          container.find('thead tr')
           .css('display', 'block')
           .css('overflow-y', 'scroll')
           .css('overflow-x', 'hidden');

          container.find('tbody')
           .css('display', 'block')
           .css('height', '30em')
           .css('overflow-y', 'scroll')

          container.find('#scrolling')
           .css('height', '')
           .css('overflow-y', 'hidden');

          return container;
        };

        function fixCol(container){
          var td_width = getMaxWidthTd(container);

          container.find('#positioning')
            .css('margin-left', td_width)
            .css('position', 'relative')

          container.find('td:nth-child(1), th:nth-child(1)')
            .css('position', 'absolute')
            .css('left', '-' + td_width)
            .css('z-index', '1');

          container.find('th:nth-child(1)')
            .css('z-index', '2')
            .css('background-color', 'white');

          fixed_cols = container.find('td:nth-child(1)')

          var scrollHandler = function(){
            var height = fixed_cols.outerHeight();
            var scrollTop = $(this).scrollTop();
            fixed_cols.each(function(i){
              $(this).css('top', (height * (i+1)) - scrollTop);
            });
          };

          var scrolling_y_selector = container.data('fix-head')? 'tbody': '#scrolling';

          if(!container.data('scrollListenerRegistered')){
            container
              .data('scrollListenerRegistered', true)
              .find(scrolling_y_selector)
              .scroll(scrollHandler)
          }

          scrollHandler.apply(container.find(scrolling_y_selector));

          return container
        }

        function transform(element){
          var container = $('\
            <div id="container">\
              <div id="positioning">\
                <div id="scrolling">\
                </div>\
              </div>\
            </div>')
            .css('overflow-y', 'hidden');
          element.replaceWith(container);

          container
            .find('#scrolling')
            .append(element);

          container
            .find('#scrolling')
            .css('overflow-y', 'auto')
            .css('overflow-x', 'auto')
            .css('height', '30em')
            .prepend('<div id="placeholder"></div>');

          container
            .find('table')
            .css('table-layout', 'fixed');

          return container;
        }
      }
    }
  };

}]);
