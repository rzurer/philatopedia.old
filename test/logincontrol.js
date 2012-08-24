/*global  describe, it, beforeEach*/
"use strict";
var sut = require('../modules/logincontrol'),
	assert = require('assert'),
	sinon = require('sinon'),
	urls = require('../modules/urls'),
	func = function (arg) {},
	click = function (func) {
		this.clickFunction = func;
    },
	controls,
	router,
	setup = function () {
        controls = {
            usernameInput : {
				click : click,
				addClass : func,
				removeClass : func,
				val : func,
				focus : func
            },
            logincontainer : {
				slideDown : func,
				slideUp : func
            },
            loginMenu : {
				click : click,
				hide : func,
				show : func
            },
            logoutMenu : {
				click : click,
				hide : func,
				show : func
            },
            loginButton :  {
				click : click,
            },
            welcome : {
				hide : func,
				text : func,
				show : func
            },
            body :  {
				click : click,
            },
        };
		router = {
			home : func,
			logout : func,
			login: function (username, callback) {
				callback(username);
			}
		};
		sut.initialize(controls, router);
	};
describe('logincontrol', function () {
	beforeEach(setup);
	describe('#setClickEvents', function () {
		it("should set loginMenu click", function () {
			assert.ok(!controls.loginMenu.clickFunction);
			sut.setClickEvents();
			assert.ok(controls.loginMenu.clickFunction);
		});
		it("should set logoutMenu click", function () {
			assert.ok(!controls.logoutMenu.clickFunction);
			sut.setClickEvents();
			assert.ok(controls.logoutMenu.clickFunction);
		});
		it("should set body click", function () {
			assert.ok(!controls.body.clickFunction);
			sut.setClickEvents();
			assert.ok(controls.body.clickFunction);
		});
		it("should set body click", function () {
			assert.ok(!controls.body.clickFunction);
			sut.setClickEvents();
			assert.ok(controls.body.clickFunction);
		});
		it("should set usernameInput click", function () {
			assert.ok(!controls.usernameInput.clickFunction);
			sut.setClickEvents();
			assert.ok(controls.usernameInput.clickFunction);
		});
		it("should set loginButton click", function () {
			assert.ok(!controls.loginButton.clickFunction);
			sut.setClickEvents();
			assert.ok(controls.loginButton.clickFunction);
		});
	});
	describe('#private methods', function () {
		beforeEach(function () {sut.setClickEvents(); });
		describe('#loginMenu click', function () {
			it("should show login container", function () {
				var spy = sinon.spy(controls.logincontainer, "slideDown");
				controls.loginMenu.clickFunction();
				assert(spy.withArgs("normal").calledOnce);
			});
			it("should clear username entry", function () {
				var spy = sinon.spy(controls.usernameInput, "val");
				controls.loginMenu.clickFunction();
				assert(spy.withArgs("").calledOnce);
			});
			it("should focus username entry", function () {
				var spy = sinon.spy(controls.usernameInput, "focus");
				controls.loginMenu.clickFunction();
				assert(spy.calledOnce);
			});
		});
		describe('#logoutMenu click', function () {
			it("should logout and reset login controls", function () {
				var spy = sinon.spy(router, "logout");
				controls.logoutMenu.clickFunction();
				assert(spy.withArgs(sut.setLoginControls).calledOnce);
			});
			it("should go to home page", function () {
				var spy = sinon.spy(router, "home");
				controls.logoutMenu.clickFunction();
				assert(spy.calledOnce);
			});
		});
		describe('#body click', function () {
			it("should hide login", function () {
				var spy = sinon.spy(controls.logincontainer, "slideUp");
				controls.body.clickFunction();
				assert(spy.withArgs("normal").calledOnce);
			});
		});
		describe('#username entry click', function () {
			it("should return false", function () {
				assert.strictEqual(false, controls.usernameInput.clickFunction());
			});
		});
		describe('#login button click', function () {
			it("should get username entry value", function () {
				var spy = sinon.spy(controls.usernameInput, "val");
				controls.loginButton.clickFunction();
				assert(spy.calledOnce);
			});
			it("should login with username", function () {
				var spy, stub, username;
				username = "pjharvey";
				spy = sinon.spy(router, "login");
				stub = sinon.stub(controls.usernameInput, "val");
				stub.returns(username);
				controls.loginButton.clickFunction();
				assert(spy.withArgs(username, sut.login).calledOnce);
			});
		});
		describe('#router login', function () {
			it("should reset login controls", function () {
				var spy, username;
				spy = sinon.spy(sut, "setLoginControls");
				username = "pjharvey";
				router.login(username, sut.login);
				assert(spy.withArgs(username).calledOnce);
			});
			describe('when username is not empty', function () {
				it("should remove red border around user entry", function () {
					var spy, username;
					spy = sinon.spy(controls.usernameInput, "removeClass");
					username = "pjharvey";
					router.login(username, sut.login);
					assert(spy.withArgs("hover").calledOnce);
				});
				it("should navigate to home page", function () {
					var spy, username;
					spy = sinon.spy(router, "home");
					username = "pjharvey";
					router.login(username, sut.login);
					assert(spy.calledOnce);
				});
			});
			describe('when username is empty', function () {
				it("should add red border around user entry", function () {
					var spy = sinon.spy(controls.usernameInput, "addClass");
					router.login(undefined, sut.login);
					assert(spy.withArgs("hover").calledOnce);
				});
				it("should focus user entry", function () {
					var spy, username;
					spy = sinon.spy(controls.usernameInput, "focus");
					router.login(undefined, sut.login);
					assert(spy.calledOnce);
				});
			});
		});
	});
	describe('#setLoginControls', function () {
		describe('when username is passed in', function () {
			var username;
			beforeEach(function () {
				username = "username";
			});
			it("should show logout menu", function () {
				var spy = sinon.spy(controls.logoutMenu, "show");
				sut.setLoginControls(username);
				assert(spy.calledOnce);
			});
			it("should hide login menu", function () {
				var spy = sinon.spy(controls.loginMenu, "hide");
				sut.setLoginControls(username);
				assert(spy.calledOnce);
			});
			it("should hide login container", function () {
				var spy = sinon.spy(controls.logincontainer, "slideUp");
				sut.setLoginControls(username);
				assert(spy.withArgs("normal").calledOnce);
			});
			it("should hide welcome", function () {
				var spy = sinon.spy(controls.welcome, "hide");
				sut.setLoginControls(username);
				assert(spy.calledOnce);
			});
			it("should welcome text", function () {
				var spy = sinon.spy(controls.welcome, "text");
				sut.setLoginControls(username);
				assert(spy.withArgs("welcome "  + username).calledOnce);
			});
			it("should show welcome slowly", function () {
				var spy = sinon.spy(controls.welcome, "show");
				sut.setLoginControls(username);
				assert(spy.withArgs("slow").calledOnce);
			});
		});
		describe('when username is empty', function () {
			var username;
			beforeEach(function () {
				username = "";
			});
			it("should show login menu", function () {
				var spy = sinon.spy(controls.loginMenu, "show");
				sut.setLoginControls(username);
				assert(spy.calledOnce);
			});
			it("should hide logout menu", function () {
				var spy = sinon.spy(controls.logoutMenu, "hide");
				sut.setLoginControls(username);
				assert(spy.calledOnce);
			});

			it("should hide welcome", function () {
				var spy = sinon.spy(controls.welcome, "hide");
				sut.setLoginControls(username);
				assert(spy.calledOnce);
			});
			it("should welcome text", function () {
				var spy = sinon.spy(controls.welcome, "text");
				sut.setLoginControls(username);
				assert(spy.withArgs("").calledOnce);
			});
			it("should show welcome slowly", function () {
				var spy = sinon.spy(controls.welcome, "show");
				sut.setLoginControls(username);
				assert(spy.withArgs("slow").calledOnce);
			});
		});
	});
});