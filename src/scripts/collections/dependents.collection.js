
'use strict';

const Backbone = require('backbone');
const DependentModel = require('../models/dependent.model');

let DependentsCollection = Backbone.Collection.extend({

	model: DependentModel,

	initialize: function(options) {

		options = (options || {});

		// initialize with one model
	  this.add(new DependentModel());

	},

  // parentType can be either 0 for user or 1 for other parent
  // include all dependents not in your primary care
  getTotalNetDependents: function(parentType) {

	  let count = 0;

	  _.each(this.models, function(mdl) {
	    let la = parseInt(mdl.get('living_arrangement'), 10);
	    if (la !== -1) {
	      if (la !== parentType) {
	        count = count + 1;
        }

      }

    });

	  return count;


  },



});

module.exports = DependentsCollection;
