'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var photos = require('../../app/controllers/photos.server.controller');
	var multiparty = require('connect-multiparty');
	var multipartyMiddleware = multiparty();

	// Photos Routes
	app.route('/photos')
		.get(photos.list)
		.post(users.requiresLogin, multipartyMiddleware, photos.create);

	app.route('/photos/:photoId')
		.get(photos.read)
		.put(users.requiresLogin, photos.hasAuthorization, photos.update)
		.delete(users.requiresLogin, photos.hasAuthorization, photos.delete);

	// Finish by binding the Photo middleware
	app.param('photoId', photos.photoByID);
};
