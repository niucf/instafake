'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus', 'flash', 'Socket',
	function($scope, Authentication, Menus, flash, Socket) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});

		Socket.on('user.login', function(notify_model) {
		    console.log(notify_model);
		    flash.success = notify_model.message;
		});

		Socket.on('article.created', function(notify_model) {
		    console.log(notify_model);
		    flash.success = 'New Article  - '+notify_model.article.title+' - by '+notify_model.user;
		});

		Socket.on('photo.liked', function(notify_model){
		  console.log(notify_model);
		  flash.success = 'Photo upvoted  - '+notify_model.photo.title+' - by '+notify_model.user;
		});

		Socket.on('photo.disliked', function(notify_model){
		  console.log(notify_model);
		  flash.success = 'Photo downvoted  - '+notify_model.photo.title+' - by '+notify_model.user;
		});

		
	}
]);