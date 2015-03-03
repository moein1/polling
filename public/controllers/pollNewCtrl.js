angular.module('polls').controller('pollNewCtrl', ['$scope', '$location', 'Poll', function ($scope, $location, Poll) {
    $scope.poll = {
        question: '',
        choices: [{ text: '' }, { text: '' }, { text: '' }]
    }

    $scope.addChoice = function () {
        $scope.poll.choices.push({ text: '' });
    }

    $scope.createPoll = function () {
        var poll = $scope.poll;
        if (poll.question.length > 0) {
            var choiceCount = 0;
            for (var i = 0; i < poll.choices.length; i++) {
                var choice = poll.choices[i];
                if (choice.text.length > 0) {
                    choiceCount++;
                }
            }
            if (choiceCount > 1) {
                var newPoll = new Poll(poll);
                newPoll.$save(function (p, resp) {
                    if (!p.error) {
                        $location.path('polls');
                    } else {
                        alert('Could not create poll');
                    }
                });
            } else {
                alert('You must enter at least 2 polls');

            }
        } else {
            alert('You must enter at least 1 question');
        }

       
    }
}]);