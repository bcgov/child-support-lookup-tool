'use strict';

const Backbone = require('backbone');
import template from '../partials/default.jst';
const CalculatorModel = require('../models/calculator.model');
const DependentModel = require('../models/dependent.model');
const DependentsCollection = require('../collections/dependents.collection');
const pkg = require('../../../package.json');

let DefaultView = Backbone.View.extend({

	el: '#root',

	events: {
		'click #btn-calculate': 'onClickCalculate',
		'change #input-parent1-income': 'onChangeParent1Income',
		'change #input-parent2-income': 'onChangeParent2Income',
		'click #btn-add-dep': 'onClickAddDep',
		'click #btn-remove-dep': 'onClickRemoveDep',
        'change .select-living-arrangement': 'onChangeLivingArrangement',
        'change .input-name': 'onChangeName'
	},

	initialize: function(options) {

		this.model = new CalculatorModel();

		this.collection = new DependentsCollection();

		this.listenTo(this.collection, 'add remove', this.render);
		this.listenTo(this.model, 'change', this.render);

    this.listenToOnce(this, 'post:render', this.onPostRender);

	},

	render: function() {

		this.$el.html(template({
			dependents: this.collection.toJSON(),
			parent1income: this.model.get('parent1AnnualIncome'),
			parent2income: this.model.get('parent2AnnualIncome'),
			version: pkg.version
		}));

		this.trigger('post:render', {});

		return this;
	},

  onPostRender: function(e) {

	  // Select all elements with data-toggle="popover" in the document
    $('[data-toggle="popover"]').popover();

  },

  onChangeName: function(e) {

	  e.preventDefault();
	  let x = $(e.currentTarget).data();
	  let val = $(e.currentTarget).val();
	  if (_.has(x, 'modelId')) {
	    let mdl = this.collection.get(x.modelId);
	    if (mdl) {
	      mdl.set({'name': val});
        }
      }

  },

  onChangeLivingArrangement: function(e) {

	  e.preventDefault();
	  let x = $(e.currentTarget).data();
	  let val = $(e.currentTarget).val();
	  if (_.has(x, 'modelId')) {
	    let mdl = this.collection.get(x.modelId);
	    if (mdl) {
	      mdl.set({'living_arrangement': parseInt(val, 10)});
      }
    }

  },

	onClickAddDep: function() {

		let deps = this.model.get('numberOfDependents');
		if (deps < 6) {
			deps = deps + 1;
			this.model.set('numberOfDependents', deps);

			let dep = new DependentModel();
			this.collection.add(dep);
		}
	},

	onClickRemoveDep: function() {

		let deps = this.model.get('numberOfDependents');
		if (deps > 1) {
			deps = deps - 1;
			this.model.set('numberOfDependents', deps);

			this.collection.pop();
		}

	},

	onChangeParent1Income: function(e) {
		if (e) {
			let val = $(e.currentTarget).val();
			this.model.set('parent1AnnualIncome', val);
		}
	},

	onChangeParent2Income: function(e) {
		if (e) {
			let val = $(e.currentTarget).val();
			this.model.set('parent2AnnualIncome', val);
		}
	},

	onClickCalculate: function(e) {

		let index1 = this.model.findNearestKeyForParent(1);
		let index2 = this.model.findNearestKeyForParent(2);

		// almost there - this index is an Array of values, so now just grab
		// the associated one for total_number_of_dependents
		let kids = this.model.get('numberOfDependents');

		let kids1 = this.collection.getTotalNetDependents(0);
		let kids2 = this.collection.getTotalNetDependents(1);

		let final_pay1 = 0;
		if (kids1 !== 0) {
			final_pay1 = index1[kids1];
        }

	    let final_pay2 = 0;
		if (kids2 !== 0) {
			final_pay2 = index2[kids2];
	    }

		this.$el.find('#panel-results').show();

		let label3 = this.$el.find('#label-final-result');

		// this calculator assumes that parent1 is the user - so adjust the final display accordingly
		// either parent1 owes or is owed
		let final_result = final_pay1 - final_pay2;
		if (final_result < 0) {
			label3.html('You are owed <strong>$' + Math.abs(final_result) + '.00</strong> per-month from the other parent for the ' + kids + ' dependent(s).');
		} else {
			label3.html('You owe <strong>$' + final_result + '.00</strong> per-month to the other parent for the ' + kids + ' dependent(s).');
		}

	}

});

module.exports = DefaultView;
