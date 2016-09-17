function TopicMatrixController(topicService){
  var $ctrl = this;
  $ctrl.topics = [];
  topicService.get().then(function(topics){
    $ctrl.topics = topics;
  });
}

angular.module('LDAApp').component('topicMatrix', {
  templateUrl: 'app-ng/components/TopicMatrixComponent.html',
  controller: ['topicService', TopicMatrixController],
})
