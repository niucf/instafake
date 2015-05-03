'use strict';

// Configuring the Articles module
angular.module('articles').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Blog', 'articles', 'dropdown', '/articles(/create)?');
		Menus.addSubMenuItem('topbar', 'articles', 'List Blog Posts', 'articles');
		Menus.addSubMenuItem('topbar', 'articles', 'New Blog Post', 'articles/create');
	}
]);