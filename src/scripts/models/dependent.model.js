
'use strict';

const Backbone = require('backbone');

let DependentModel = Backbone.Model.extend({

	defaults: {
		name: '',
		living_arrangement: -1
	},

	initialize: function(options) {
		options = (options || {});

	},

  toJSON: function() {
	  let json = Backbone.Model.prototype.toJSON.apply(this, arguments);
	  json.cid = this.cid;
	  return json;
  }
});

module.exports = DependentModel;
