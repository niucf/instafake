/*global io:false */

'use strict';

//socket factory that provides the socket service
angular.module('core').factory('Socket', ['socketFactory',
    function(socketFactory) {
        return socketFactory({
            prefix: '',
            ioSocket: io.connect('http://localhost:3000')
        });
    }
]);


angular.module('core').factory('posts', [function(){
  var o = {
    posts: []
  };
  return o;
}]);