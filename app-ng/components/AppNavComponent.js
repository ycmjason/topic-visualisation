angular.module('LDAApp').component('appNav', {
  templateUrl: 'app-ng/components/AppNavComponent.html',
  controller: function(){
    this.app_name = "Topics"
    this.menu = [
      {
        label: 'Topic matrix',
        href: '#!/topic-matrix'
      },
      {
        label: 'Topic charts',
        href: '#!/topic-graph'
      },
    ];
  }
});
