angular.module('LDAApp').
  // Topic service
  service('topicService', ['$http', '$q', 'Topic', function($http, $q, Topic){
    var topics;
    this.get = function(){
      var defer = $q.defer();

      if(!topics){
        $http.get('resources/topics.json')
          .then(function(res){
            topics = res.data.map(Topic.fromJSON);
            defer.resolve(topics);
          })
          .catch(function(res){
            defer.reject('Error occoured when fetching topics... Please refresh to retry.');
          });
      }else{
        defer.resolve(topics);
      }

      return defer.promise;
    };
  }]).

  // Topic class
  factory('Topic', function(){
    function Topic(label, words_dist){
      this.label = label;
      this.words_dist = words_dist;
    };

    Topic.fromJSON = function(topic){
      return new Topic(topic.label, topic.words_dist);
    };

    Topic.prototype.filterWord = function(fn){
      var filtered_words_dist = this.words_dist.filter(function(wd){
        return fn(wd[0]);
      });

      return new Topic(this.label, filtered_words_dist);
    };

    Topic.prototype.getProbabilities = function(from, to){
      from = from!=undefined? from: 0;
      to = to!=undefined? to: this.words_dist.length;
      return this.words_dist.slice(from, to).map(function(wd){
        return wd[1];
      });
    };

    Topic.prototype.getProbability = function(key){
      switch(typeof key){
        case "string":
          return this._getProbabilityByWord(key);
        case "number":
          return this.words_dist[key][1];
        default:
          console.error("getProbability is called with wrong key");
      }
    };

    Topic.prototype._getProbabilityByWord = function(key){
      return this.words_dist.filter(function(wd){
        return wd[0] == word;
      }).map(function(wd){
        probability = wd[1]
        return probability;
      })[0];
    };

    Topic.prototype.getWords = function(from, to){
      from = from!=undefined? from: 0;
      to = to!=undefined? to: this.words_dist.length;
      return this.words_dist.slice(from, to).map(function(wd){
        return wd[0];
      });
    };

    Topic.prototype.sort = function(key){
      if(key == 'prob') this._sortByProb();
      // key could be a comparison function of word_dist
      else if(typeof(key) == "function"){
        this.word_dist = this.words_dist.sort(key);
      }
      // key can also be an array of words so that this topic would be sorted in that order
      else if(angular.isArray(key)) this._sortByWordList(key);
      // otherwise by default, sort by word
      else this._sortByWord();

      return this;
    };

    Topic.prototype._sortByWordList = function(words){
      this.words_dist.sort(function(wd1, wd2){
        return words.indexOf(wd1[0]) - words.indexOf(wd2[0]);
      });
    };

    Topic.prototype._sortByWord = function(){
      this.words_dist = this.words_dist.sort(function(wd1, wd2){
        if(wd1[0] > wd2[0]) return 1;
        if(wd1[0] < wd2[0]) return -1;
        return 0;
      });
    };
    Topic.prototype._sortByProb = function(){
      this.words_dist = this.words_dist.sort(function(wd1, wd2){
        return wd1[1]-wd2[1];
      });
    };

    Topic.prototype.slice = function(from, to){
      var wd = this.words_dist.slice(from, to);
      return new Topic(this.label, wd);
    };

    return Topic;
  });
