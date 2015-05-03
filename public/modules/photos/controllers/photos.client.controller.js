'use strict';

//note addition of $http
angular.module('photos')
.controller('PhotosController', ['$scope', '$stateParams', '$location', '$http', 'Authentication', 'Photos', 'flash', 'Socket',  
	function($scope, $stateParams, $location, $http, Authentication, Photos, flash, Socket) {
	  $scope.authentication = Authentication;

	  Socket.on('photo.liked', function(notify_model) {
	      console.log(notify_model);
	      flash.success = 'Photo upvoted: '+notify_model.photo.name;
	  });

	  Socket.on('photo.disliked', function(notify_model) {
	      console.log(notify_model);
	      flash.error = 'Photo downvoted: '+notify_model.photo.name;
	  });

	  Socket.on('photo.create', function(notify_model) {
	      console.log(notify_model);
	      flash.success = 'New Photo created: '+notify_model.photo.name;
	  });

	  $scope.likes = 0;
	  $scope.isLiked = false;
		// Create new Photo

		$scope.sort = 'created';

	  $scope.create = function() {
		    // Create new Photo object
		    var photo = new Photos ({
		      	name: $scope.imageName,
	            file: $scope.imageFile
		    });
		    photo.$save(function(response) {
		      	$location.path('photos/' + response._id);
		      	// Clear form fields
		     	$scope.imageName = '';
	            $scope.imageFile = '';

		    }, function(errorResponse) {
			 	$scope.error = errorResponse.data.message;
	       	});
            
	  };

	  $scope.filterPhotos = function(photos){

	  	console.log('filterPhotos called');
	  	console.log(photos);

	  		var the_user = $scope.authentication.user._id;

	  		for(var i = 0; i < photos.length; i++){

	  			console.log(i);

	  			var the_photo = photos[i];

	  			console.log(the_photo);

	  			for(var j = 0; i < the_photo.likes.length; i++) {
	  			    console.log('Comparing likes - ' + the_photo.likes[j] + ' to ' + the_user._id + ' is ' + the_photo.likes[j].equals(the_user));
	  			    if(the_photo.likes[j].equals(the_user)) {
	  			        var containsValue = true;
	  			        console.log('found value in current photo likes array..');
	  			    }
	  			}

	  		}

	  };

	  //Swipe to remove photo from display
	  $scope.hide = function($index) {
		$scope.photos.splice($index,1);
	  };
	  // Remove existing Photo
	  $scope.remove = function(photo) {

	  	console.log(photo);

	    if ( photo ) { 

			photo.$remove();
			flash.success = 'Image successfully removed';

			for (var i in $scope.photos) {
				if ($scope.photos [i] === photo) {
					$scope.photos.splice(i, 1);
				}
			}

		} else {
			flash.success = 'Image successfully removed';
			$scope.photo.$remove(function() {
				$location.path('photos');
			});
		}
	  };

	  // Update existing Photo
	  $scope.update = function() {
	    var photo = $scope.photo;

	    photo.$update(function() {
	      $location.path('photos/' + photo._id);
	    }, function(errorResponse) {
			$scope.error = errorResponse.data.message;
	    });
	  };

	  // Find a list of Photos
	  $scope.find = function(user) {

	  	if(user){

	  		// user defined
	  		console.log(user);
	  		var the_photos = Photos.query();
		  	console.log(the_photos);

		  	for(var i = 0; i < the_photos.length; i++){

		  		var curr_photo = the_photos[i];

		  		if(curr_photo.user._id === user._id){
		  			$scope.isLiked = true;
		  			$scope.isLiked = false;
		  		}

		  	}

	  		$scope.photos = the_photos;

	  	}else {

	  		// user undefined
		    $scope.photos = Photos.query();

	  	}

	  };

	  // Find existing Photo
	  $scope.findOne = function() {
	    $scope.photo = Photos.get({ 
	      photoId: $stateParams.photoId
	    },function(){
                var user = $scope.authentication.user;
                var containsValue=false;
                if($scope.authentication.user) {
					console.log('ID '+$scope.authentication.user._id);
					$scope.likes = $scope.photo.likes.length;
					for(var i=0; i<$scope.photo.likes.length; i++) {
						console.log('Comparing ' + $scope.photo.likes[i] + ' to ' + user._id + ' is ' + ($scope.photo.likes[i]===user._id).toString());
						if($scope.photo.likes[i]===user._id) {
							containsValue = true;
						}
					}
				}
                $scope.isLiked = containsValue;
                $scope.isDisLiked = containsValue;
              },function(){console.log('error');});

	  };
          
	  //Like a photo
	  $scope.likeThis = function() {


	  		flash.success = 'Photo has been upvoted!';


		    var photo = $scope.photo;
		    $http.put('photos/upvote/' + photo._id).success(function() {
	              // Update the photo with our user ID.
	              photo.likes.push($scope.authentication.user._id);
	              
	              $scope.photo.isLiked=true;
	              $scope.photo.isDisLiked=false;
		    });

     	}; 

		//Like a photo
		$scope.disLikeThis = function() {

			flash.error = 'Photo has been downvoted!';

			var photo = $scope.photo;
			$http.put('photos/downvote/' + photo._id).success(function() {
				// Update the photo with our user ID.
				photo.dislikes.push($scope.authentication.user._id);

				$scope.photo.isLiked=false;
				$scope.photo.isDisLiked=true;
			});

		};   

		$scope.upVote = function(photo){
		  console.log(photo);
		  $scope.photo = photo;
		  $scope.photo.score++;

		  $scope.likeThis();

		};

		$scope.downVote = function(photo){
		 console.log(photo);
		 $scope.photo = photo;
		 $scope.photo.score--;

		 $scope.disLikeThis();

		};
     
         
     }])

		
.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);
