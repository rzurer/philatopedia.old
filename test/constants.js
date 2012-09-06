/*global  describe, it*/
"use strict";
var sut = require('../modules/constants').constants,
	assert = require('assert');
describe('constants_module', function () {
    it("should contain expected constants", function () {
        assert.strictEqual('Click to satisfy your stamp lust', sut.loggedInSplashTitle);
        assert.strictEqual('Sign in to satisfy your stamp lust', sut.loggedOutSplashTitle);
    });
});