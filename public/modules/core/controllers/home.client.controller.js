'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'Photos', 'flash', 'Socket', 'posts',
	function($scope, Authentication, Photos, flash, Socket, posts) {
		// This provides Authentication context.
		$scope.authentication = Authentication;

		$scope.test = 'Hello world!';

		$scope.photos = Photos.query();

		$scope.posts = posts.posts;

		$scope.addPost = function(){
		  if(!$scope.title || $scope.title === '') { return; }
		  $scope.posts.push({
		    title: $scope.title,
		    link: $scope.link,
		    upvotes: 0
		  });
		  $scope.title = '';
		  $scope.link = '';
		};

		$scope.incrementUpvotes = function(post) {
		  post.upvotes += 1;
		};

	}
]);