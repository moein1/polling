angular.module('polls', ['pollServices', 'ngRoute']).
config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
   // $locationProvider.html5Mode(true);
    $routeProvider.when('/polls', { templateUrl: 'partials/list.html', controller: 'pollListCtrl' }).
    when('/polls/:pollId', { templateUrl: 'partials/item.html', controller: 'pollItemCtrl' }).
    when('/new', { templateUrl: 'partials/new.html', controller: 'pollNewCtrl' }).
    otherwise({ redirectTo: '/polls' });
}]);