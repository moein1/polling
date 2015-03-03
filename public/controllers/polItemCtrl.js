angular.module('polls').
controller('pollItemCtrl', ['$scope', '$routeParams', 'socket', 'Poll', function ($scope, $routeParams, socket, Poll) {
    $scope.poll = Poll.get({ pollId: $routeParams.pollId });
    socket.on('myvote', function (data) {
        console.dir(data);
        if (data._id === $routeParams.pollId) {
            $scope.poll = data;
        }
    });

    socket.on('vote', function (data) {
        console.dir(data);
        if (data._id === $routeParams.pollId) {
            $scope.poll.choices = data.choices;
            $scope.poll.totalVotes = data.totalVotes;
        } 
    });
    $scope.vote = function () {
        var pollId = $scope.poll._id,
            choiceId = $scope.poll.userVote;
        if (choiceId) {
            var voteObj = { poll_id: pollId, choice: choiceId };
            socket.emit('send:vote', voteObj);
        } else {
            alert('You must select an option to vote for');
        }
    }
}]);