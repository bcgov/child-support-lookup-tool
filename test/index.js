
'use strict';

require('./main.bundle');

QUnit.test('something to test', function(assert) {
  assert.expect(1);

  var mdl = new CalculatorModel();
  assert.equal(mdl.get('numberOfDependents'), 1);
});
