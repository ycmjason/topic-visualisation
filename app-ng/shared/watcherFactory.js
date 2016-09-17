angular.module('LDAApp').
  factory('watcherFactory', function(){
    function getValue(variable, path){
      var _getValue = function(variable, pathArr){
        if(pathArr.length <= 0) return variable;
        return _getValue(variable[pathArr[0]], pathArr.slice(1));
      };

      return _getValue(variable, path.split('.'));
    };

    function setValue(variable, path, value){
      var _setValue = function(variable, pathArr, value){
        if(pathArr.length == 1) return variable[pathArr[0]] = value;
        return _setValue(variable[pathArr[0]], pathArr.slice(1), value);
      };

      return _setValue(variable, path.split('.'), value);
    }

    return function(handlers){
      var paths = Object.keys(handlers);
      var old_values = {};
      return function(){
        var $ctrl = this;
        paths.forEach(function(path){
          var current_value = getValue($ctrl, path);

          if(!angular.equals(old_values[path], current_value)){
            // call handler
            handlers[path](current_value, old_values[path]);
            // reset old_values
            old_values[path] = angular.copy(current_value);
          }
        });
      };

    };
  });
