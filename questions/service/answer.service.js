angular.
  module('aurora.questions').
  service('$answers', [ function() {


        var Answer = function (id) {
            this.id = id;
            this.isCorrect = false;
            this.value = "";
        }
        var AnswerFactory = {
            createAnswer : function(id) { return new Answer(id)},
            createAnswer : function(id, value, isCorrect) { return new Answer(id, value, isCorrect)}
        }

      return AnswerFactory;
  }]);
