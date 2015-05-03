'use strict';

// Comments controller
angular.module('comments').controller('CommentsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Comments',
	function($scope, $stateParams, $location, Authentication, Comments) {
		$scope.authentication = Authentication;

		// Create new Comment
		$scope.create = function() {
			// Create new Comment object



			var comment = new Comments ({
				comment_body: $scope.comment_body,
				photo: $scope.photo
			});

			console.log('\n');
			console.log(comment);
			console.log('\n');

			// Redirect after save
			comment.$save(function(response) {

				console.log(response);
				
				$location.path('comments/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Comment
		$scope.remove = function(comment) {
			if ( comment ) { 
				comment.$remove();

				for (var i in $scope.comments) {
					if ($scope.comments [i] === comment) {
						$scope.comments.splice(i, 1);
					}
				}
			} else {
				$scope.comment.$remove(function() {
					$location.path('comments');
				});
			}
		};

		// Update existing Comment
		$scope.update = function() {
			var comment = $scope.comment;

			comment.$update(function() {
				$location.path('comments/' + comment._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Comments
		$scope.find = function() {
			$scope.comments = Comments.query();
		};

		// Find a list of Comments FOR A CERTAIN PHOTO
		$scope.findForPhoto = function(photo) {

			console.log('\nfindForPhoto called\n');
			console.log(photo._id);
			$scope.comments = Comments.query({ _id: photo._id });
			// $scope.comments = Comments
			// 	.find({ _id: photo })
			// 	// .where('_id').equals(photo)
			// 	// .where('age').gt(17).lt(66)
			// 	// .where('likes').in(['vaporizing', 'talking'])
			// 	// .limit(10)
			// 	.sort('-created')
			// 	.exec(function(err, comments){

			// 		if(err){
			// 			console.log(err);
			// 		} else {
			// 			console.log(comments);
			// 		}

			// 	});
			
		};

		// Find existing Comment
		$scope.findOne = function() {
			$scope.comment = Comments.get({ 
				commentId: $stateParams.commentId
			});
		};
	}
]);