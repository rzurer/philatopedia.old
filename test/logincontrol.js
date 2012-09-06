/*global  describe, it, beforeEach*/
"use strict";
var urls = require('../modules/urls').urls,
	window = {},
	postFunction = function (url, input, callback) {
		if (callback) {
			callback(input.username);
		}
	},
	func = function (){},
	router = require('../modules/routers').mainLayoutRouter(urls, window, postFunction),
    sut = require('../modules/logincontrol').loginControl(router),
    $ = require('jquery'),
	assert = require('assert'),
	sinon = require('sinon'),
	createControl = function () {
		var label = $("<label/>");
		label.unbind();
		return label;
	},
	createInput = function () {
		var input = $("<input/>");
		input.unbind();
		return input;
	},
	controls,
	setup = function () {
        controls = {
            usernameInput : createInput(),
            logincontainer : createControl(),
            loginMenu :  createControl(),
            logoutMenu : createControl(),
            loginButton : createControl(),
            welcome : createControl(),
            body : createControl(),
        };
		sut.initializeControls(controls);
	};
describe('logincontrol_module', function () {
	beforeEach(setup);
	describe('#setClickEvents', function () {
		it("should set loginMenu click", function () {
			var spy, arg;
			spy = sinon.spy(controls.loginMenu, "click");
			sut.setClickEvents();
			arg = spy.args[0][0];
			controls.loginMenu.click.restore();

			assert.strictEqual('showLogin', arg.name);
		});
		it("should set logoutMenu click", function () {
			var spy, arg;
			spy = sinon.spy(controls.logoutMenu, "click");
			sut.setClickEvents();
			arg = spy.args[0][0];
			controls.logoutMenu.click.restore();

			assert.strictEqual('logout', arg.name);
		});
		it("should set body click", function () {
			var spy, arg;
			spy = sinon.spy(controls.body, "click");
			sut.setClickEvents();
			arg = spy.args[0][0];
			controls.body.click.restore();

			assert.strictEqual('hideLogin', arg.name);
		});
		it("should set usernameInput click", function () {
			var spy, arg;
			spy = sinon.spy(controls.usernameInput, "click");
			sut.setClickEvents();
			arg = spy.args[0][0];
			controls.usernameInput.click.restore();

			assert.strictEqual('returnFalse', arg.name);
		});
		it("should set loginButton click", function () {
			var spy, arg;
			spy = sinon.spy(controls.loginButton, "click");
			sut.setClickEvents();
			arg = spy.args[0][0];
			controls.loginButton.click.restore();

			assert.strictEqual('doLogin', arg.name);
		});
	});
	describe('#private methods', function () {
		beforeEach(function () {
			sut.setClickEvents(); 
		});
		describe('#loginMenu click', function () {
			it("should show login container", function () {
				var spy = sinon.spy(controls.logincontainer, "slideDown");
				controls.loginMenu.click();
				controls.logincontainer.slideDown.restore();

				assert(spy.withArgs("normal").calledOnce);
			});
			it("should clear username entry", function () {
				var spy = sinon.spy(controls.usernameInput, "val");
				controls.loginMenu.click();
				controls.usernameInput.val.restore();

				assert(spy.withArgs("").calledOnce);
			});
			it("should focus username entry", function () {
				var spy = sinon.spy(controls.usernameInput, "focus");
				controls.loginMenu.click();
				controls.usernameInput.focus.restore();

				assert(spy.calledOnce);
			});
		});
		describe('#logoutMenu click', function () {
			it("should logout and reset login controls", function () {
				var spy, arg;
				spy = sinon.spy(router, "logout");
				controls.logoutMenu.click();
				arg = spy.args[0][0];
				router.logout.restore();

				assert.strictEqual('doSetLoginControls', arg.name);
				sinon.assert.calledOnce(spy);
			});
			it("should go to home page", function () {
				var spy = sinon.spy(router, "home");
				controls.logoutMenu.click();
				router.home.restore();

				sinon.assert.calledOnce(spy);
			});
		});
		describe('#body click', function () {
			it("should hide login", function () {
				var spy = sinon.spy(controls.logincontainer, "slideUp");
				controls.body.click();
				controls.logincontainer.slideUp.restore();

				sinon.assert.calledWith(spy, "normal");
			});
		});
		// describe('#username entry click', function () {
		// 	it("should return false", function () {
		// 		var value;
		// 		value = controls.usernameInput.click();
		// 		console.log(value['0']._listeners.click.false[0]());
		// 	});
		// });
		describe('#login button click', function () {
			it("should get username entry value", function () {
				var spy = sinon.spy(controls.usernameInput, "val");
				controls.loginButton.click();
				controls.usernameInput.val.restore();

				assert(spy.calledOnce);
			});
			it("should login with username", function () {
				var spy, stub, username, arg1, arg2;
				username = "pjharvey";
				spy = sinon.spy(router, "login");
				stub = sinon.stub(controls.usernameInput, "val");
				stub.returns(username);
				controls.loginButton.click();
				arg1 = spy.args[0][0];
				arg2 = spy.args[0][1];
				router.login.restore();
				controls.usernameInput.val.restore();

				assert.strictEqual(username, arg1);
				assert.strictEqual('login', arg2.name);

				sinon.assert.calledOnce(spy);
			});
		});
		describe('#router login', function () {
			describe('when username is not empty', function () {
				it("should remove red border around user entry", function () {
					var spy;
					controls.usernameInput.val("pjharvey");
					spy = sinon.spy(controls.usernameInput, "removeClass");
					controls.loginButton.click();
					controls.usernameInput.removeClass.restore();

					assert(spy.withArgs("hover").calledOnce);
				});
				it("should navigate to home page", function () {
					var spy, username;
					controls.usernameInput.val("pjharvey");
					spy = sinon.spy(router, "home");
					controls.loginButton.click();
					router.home.restore();

					assert(spy.calledOnce);
				});
			});
			describe('when username is empty', function () {
				it("should add red border around user entry", function () {
					var spy = sinon.spy(controls.usernameInput, "addClass");
					controls.loginButton.click();
					controls.usernameInput.addClass.restore();

					assert(spy.withArgs("hover").calledOnce);
				});
				it("should focus user entry", function () {
					var spy, username;
					spy = sinon.spy(controls.usernameInput, "focus");
					controls.loginButton.click();
					controls.usernameInput.focus.restore();

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
				controls.logoutMenu.show.restore();

				assert(spy.calledOnce);
			});
			it("should hide login menu", function () {
				var spy = sinon.spy(controls.loginMenu, "hide");
				sut.setLoginControls(username);
				controls.loginMenu.hide.restore();

				assert(spy.calledOnce);
			});
			it("should hide login container", function () {
				var spy = sinon.spy(controls.logincontainer, "slideUp");
				sut.setLoginControls(username);
				controls.logincontainer.slideUp.restore();

				assert(spy.withArgs("normal").calledOnce);
			});
			it("should hide welcome", function () {
				var spy = sinon.spy(controls.welcome, "hide");
				sut.setLoginControls(username);
				controls.welcome.hide.restore();

				assert(spy.calledOnce);
			});
			it("should welcome text", function () {
				var spy = sinon.spy(controls.welcome, "text");
				sut.setLoginControls(username);
				controls.welcome.text.restore();

				assert(spy.withArgs("welcome "  + username).calledOnce);
			});
			it("should show welcome slowly", function () {
				var spy = sinon.spy(controls.welcome, "show");
				sut.setLoginControls(username);
				controls.welcome.show.restore();

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
				var spy, tempLogoutMenu;
				tempLogoutMenu = controls.logoutMenu;
				controls.logoutMenu = {hide : func}
				spy = sinon.spy(controls.logoutMenu, "hide");
				sut.setLoginControls(username);

				controls.logoutMenu.hide.restore();
				controls.logoutMenu = tempLogoutMenu;

				assert(spy.calledOnce);
			});

			it("should hide welcome", function () {
				var spy, tempWelcome;
				tempWelcome = controls.welcome;
				controls.welcome = {hide : func, text : func, show : func}
				spy = sinon.spy(controls.welcome, "hide");
				sut.setLoginControls(username);

				controls.welcome.hide.restore();
				controls.welcome = tempWelcome;

				assert(spy.calledOnce);
			});
			it("should welcome text", function () {
				var spy = sinon.spy(controls.welcome, "text");
				sut.setLoginControls(username);
				controls.welcome.text.restore();

				assert(spy.withArgs("").calledOnce);
			});
			it("should show welcome slowly", function () {
				var spy = sinon.spy(controls.welcome, "show");
				sut.setLoginControls(username);
				controls.welcome.show.restore();

				assert(spy.withArgs("slow").calledOnce);
			});
		});
	});
});