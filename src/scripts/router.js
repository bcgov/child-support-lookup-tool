
'use strict';

const Backbone  = require('backbone');
const DefaultView = require('./views/default.view');

export default Backbone.Router.extend({

	routes: {
		'*actions':  'defaultRoute'
	},

	initialize: function(options) {
	},

	defaultRoute: function() {
		this.view = new DefaultView();
		this.view.render();
	}

});
