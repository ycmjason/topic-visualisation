angular.module('LDAApp').
  provider('layout', function(){
    this.$get = function(){ };

    var container = function(html){
      t = '<div class="container">';
      t += html;
      t += '</div>';
      return t;
    };

    var container_fluid = function(html){
      t = '<div class="container-fluid">';
      t += html;
      t += '</div>';
      return t;
    };

    this.standard = function(html){
      t = '<app-nav></app-nav>';
      t += container(html);

      return t;
    };

    this.naked = function(html){
      t = container_fluid(html);

      return t;
    };

  });
