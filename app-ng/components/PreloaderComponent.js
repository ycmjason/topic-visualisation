function AppPreloaderController(){
  if(!this.color){
    this.color = 'blue'
  }
}

angular.module('LDAApp').component('appPreloader', {
  template: '\
<div ng-switch="$ctrl.type">\
  <div ng-switch-when="circular">\
    <div class="preloader-wrapper {{$ctrl.size}} active">\
      <div class="spinner-layer spinner-{{$ctrl.color}}-only">\
        <div class="circle-clipper left">\
          <div class="circle"></div>\
          </div><div class="gap-patch">\
          <div class="circle"></div>\
          </div><div class="circle-clipper right">\
          <div class="circle"></div>\
        </div>\
      </div>\
    </div>\
  </div>\
\
  <div ng-switch-default>\
    <div class="progress">\
      <div class="indeterminate"></div>\
    </div>\
  </div>\
</div>',
  bindings: {
    type: '@',
    size: '@',
    color: '@'
  },
  controller: [AppPreloaderController]
})
