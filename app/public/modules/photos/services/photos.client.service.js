'use strict';

// transform the photo (passed in as data) using a fd to submit it using mulitpart.
function transformPhoto(data) {
    if (data === undefined)
      return data;
  console.log("UPLOADING THAT FUCKING PHOTO!!!");
  console.log('transforming data',data);
    var fd = new FormData();
  fd.append('file', data.file);
  fd.append('name', data.name);
  return fd;
}

//Photos service used to communicate Photos REST endpoints
angular.module('photos').factory('Photos', ['$resource',
	function($resource) {
		return $resource('photos/:photoId', { photoId: '@_id'
		}, {
			update: {
				method: 'PUT'
			},
			save: {
			  method: 'POST',
                          transformRequest: transformPhoto,
                          headers: {'Content-Type': undefined}
			}
		});
	}
]);
