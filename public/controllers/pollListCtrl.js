angular.module('polls').
    controller('pollListCtrl', ['$scope', 'Poll', function ($scope, Poll) {
        $scope.polls = Poll.query();
    }]);