
'use strict';

const Backbone = require('backbone');
import calc_data from '../data/data.json';

let CalculatorModel = Backbone.Model.extend({

	defaults: {
		numberOfDependents: 1,
		parent1AnnualIncome: null,
		parent2AnnualIncome: null
	},

	initialize: function(options) {

		options = (options || {});

		this.data_table = calc_data;

		this.on('change:parent1AnnualIncome', this.onChangeParent1Income);
		this.on('change:parent2AnnualIncome', this.onChangeParent2Income);
	},

	onChangeParent1Income: function(mdl) {

		const attrs = mdl.changedAttributes();

		if (!attrs) {
			return;
		}

		let val = attrs.parent1AnnualIncome;
		if (val < 0) {
			val = 0;
		}

		if (val > 150000) {
			val = 150000;
		}

		mdl.set({'parent1AnnualIncome': val});

	},

	onChangeParent2Income: function(mdl) {

		const attrs = mdl.changedAttributes();

		if (!attrs) {
			return;
		}

		let val = attrs.parent2AnnualIncome;
		if (val < 0) {
			val = 0;
		}

		if (val > 150000) {
			val = 150000;
		}

		mdl.set({'parent2AnnualIncome': val});

	},

	validate: function(attrs) {

		/*
		if (attrs.numberOfDependents <= 0) {
			return 'number of dependents must be positive';
		}

		if (attrs.numberOfDependents > 6 ) {
			return 'number of dependents must be less then 6';
		}


		if (attrs.parent1AnnualIncome < 0) {
			return 'parent1 annual income must be positive';
		}

		if (attrs.parent2AnnualIncome < 0) {
			return 'parent2 annual income must be positive';
		}*/
	},

	// our data blob only works with ranges. Going to need a "price is right" approach in order to
	// find the nearest value without going over
	// val - our parent 1 or 2
	findNearestKeyForParent: function(val) {

		if (!this.isValid()) {
			console.error('invalid model');
			return;
		}

		let salary;
		let difference = 0;
	    let bestIndex = 0;
	    let bestDifference = Infinity;
	    let i, cur, incomeKey;

		if (val === 1) {
			salary = this.get('parent1AnnualIncome');
		} else {
			salary = this.get('parent2AnnualIncome');
		}

		for (i = 0; i < this.data_table.length; i++) {
		    cur = this.data_table[i];

		    incomeKey = cur[0];
		    difference = Math.abs(salary - incomeKey);
		    if (difference < bestDifference) {
		        bestDifference = difference;
		        bestIndex = i;
		    }
		}

		return (this.data_table[bestIndex]);

	}
});

module.exports = CalculatorModel;
