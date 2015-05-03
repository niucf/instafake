'use strict';

angular.module('timeline')
.controller('TimelineController', ['$scope','$resource',
	    function($scope, $resource) {

		  // set a default username value
	      $scope.tweets = 'twitter';
	      
	      // empty tweet model
	      $scope.tweetsResult = [];

	    /**
	     * requests and processes tweet data
	     */
	    $scope.getTweets = function() {
			$scope.tweetsResult = [];
			var params = {
				action: 'user_timeline',
				user: $scope.username
			};
			// create Tweet data resource
			$scope.tweets = $resource('/tweets/:action/:user', params);

			// GET request using the resource
			$scope.tweets.query( { }, function (res) {
				$scope.tweetsResult = $scope.tweetsResult.concat(res);
			});
	    };

	    $scope.get_instagram_photos = function(){

	    	$scope.instagram_photos = [];
	    	var endpoint = 'https://api.instagram.com/v1/media/popular';


	    };



}]);