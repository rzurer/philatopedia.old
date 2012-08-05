/*global  describe, it, beforeEach*/
"use strict";
var LoginControl = require('../modules/logincontrol').LoginControl,
	assert = require('assert'),
	urls = require('../modules/urls'),
	window = {},
	postFunctionWasCalled,
	setClick = function (handler) {
		this.doClick = handler;
	},
	postFunction = function (url, data, callback) {
		callback(data);
		postFunctionWasCalled = true;
	},
	MainLayoutRouter = require('../modules/routers').MainLayoutRouter,
	router,
	controls,
	assertBeforeSetLoginControls = function () {
		assert.strictEqual(undefined, window.location);
		assert.strictEqual(true,  controls.logoutMenu.isVisible);
		assert.strictEqual(false,  controls.loginMenu.isVisible);
		assert.strictEqual(false,  controls.welcome.hideCalled);
		assert.strictEqual(false,  controls.welcome.showCalled);
		assert.strictEqual('username',  controls.welcome.username); //case when user is null
		assert.strictEqual('',  controls.welcome.showRate);
	},
	assertAfterSetLoginControls = function (url, successful) {
		if (successful === true) {
			assert.strictEqual(url, window.location);
			assert.strictEqual(false,  controls.loginMenu.isVisible);
			assert.strictEqual(true,  controls.logoutMenu.isVisible);
			assert.strictEqual(true,  controls.welcome.hideCalled);
			assert.strictEqual(true,  controls.welcome.showCalled);
			assert.strictEqual('',  controls.welcome.username);
			assert.strictEqual('slow',  controls.welcome.showRate);
			return;
		}
		assert.strictEqual(url, window.location);
		assert.strictEqual(true,  controls.loginMenu.isVisible);
		assert.strictEqual(false,  controls.logoutMenu.isVisible);
		assert.strictEqual(true,  controls.welcome.hideCalled);
		assert.strictEqual(true,  controls.welcome.showCalled);
		assert.strictEqual('',  controls.welcome.username);
		assert.strictEqual('slow',  controls.welcome.showRate);
	},
	sut,
	setup = function () {
		postFunctionWasCalled = false;
		delete window.location;
        controls = {
            usernameInput : {
				value : 'username',
				focused : false,
				click : setClick,
				doClick : null,
				classname : '',
				addClass : function (classname) {
					this.classname = classname;
				},
				removeClass : function () {
					delete this.classname;
				},
				val : function (str) {
					this.value = str;
				},
				focus : function () {
					this.focused = true;
				}
            },
            login : {
				slideDownRate : '',
				slideUpRate : '',
				slideDown : function (rate) {
					this.slideDownRate = rate;
				},
				slideUp : function (rate) {
					this.slideUpRate = rate;
				}
            },
            loginMenu : {
				click : setClick,
				isVisible : false,
				doClick : null,
				hide : function () {
					this.isVisible = false;
				},
				show : function () {
					this.isVisible = true;
				}
            },
            logoutMenu : {
				click : setClick,
				isVisible : true,
				doClick : null,
				hide : function () {
					this.isVisible = false;
				},
				show : function () {
					this.isVisible = true;
				}
            },
            loginButton :  {
				click : setClick,
				doClick : null
            },
            welcome : {
				hideCalled : false,
				showCalled : false,
				showRate : '',
				username : 'username',
				hide : function () {
					this.hideCalled = true;
				},
				text : function (username) {
					this.username = username;
				},
				show : function (rate) {
					this.showCalled = true;
					this.showRate = rate;
				}
            },
            body :  {
				click : setClick,
				doClick : null,
            },
        };
		router = new MainLayoutRouter(urls, window);
		router.initialize(urls, window, postFunction)
        sut = new LoginControl();
		sut.initialize(controls, router);
    };
describe('LoginControl', function () {
    beforeEach(setup);
	describe('#initialize', function () {
		it("should set controls", function () {
			assert.strictEqual(sut.usernameInput, controls.usernameInput);
			assert.strictEqual(sut.login, controls.login);
			assert.strictEqual(sut.loginMenu, controls.loginMenu);
			assert.strictEqual(sut.logoutMenu, controls.logoutMenu);
			assert.strictEqual(sut.loginButton, controls.loginButton);
			assert.strictEqual(sut.welcome, controls.welcome);
			assert.strictEqual(sut.body, controls.body);
		});
	});
	describe('#setClickEvents', function () {
		it("should set control click events", function () {
			assert.strictEqual(null, controls.usernameInput.doClick);
			assert.strictEqual(null, controls.loginMenu.doClick);
			assert.strictEqual(null, controls.logoutMenu.doClick);
			assert.strictEqual(null, controls.loginButton.doClick);
			assert.strictEqual(null, controls.body.doClick);
			sut.setClickEvents();
			assert.ok(controls.usernameInput.doClick instanceof Function);
			assert.ok(controls.loginMenu.doClick instanceof Function);
			assert.ok(controls.logoutMenu.doClick instanceof Function);
			assert.ok(controls.loginButton.doClick instanceof Function);
			assert.ok(controls.body.doClick instanceof Function);
		});
		it("should return false when usernameInput is clicked", function () {
			sut.setClickEvents();
			assert.strictEqual(false, controls.usernameInput.doClick());
		});
		it("should showLogin when loginMenu is clicked", function () {
			assert.strictEqual('username', controls.usernameInput.value);
			assert.strictEqual('', controls.login.slideDownRate);
			assert(controls.usernameInput.focused === false);
			sut.setClickEvents();
			assert.strictEqual(false, controls.loginMenu.doClick());
			assert.strictEqual('', controls.usernameInput.value);
			assert.strictEqual('normal', controls.login.slideDownRate);
			assert(controls.usernameInput.focused === true);
		});
		it("should hide login when body is clicked", function () {
			assert.strictEqual('', controls.login.slideUpRate);
			sut.setClickEvents();
			controls.body.doClick();
			assert.strictEqual('normal', controls.login.slideUpRate);
		});
		it("should logout when logoutMenu is clicked", function () {
			assertBeforeSetLoginControls();
			sut.setClickEvents();
			controls.logoutMenu.doClick();
			assertAfterSetLoginControls(urls.home, false);
		});
		it("should post logout when logoutMenu is clicked", function () {
			assert(!postFunctionWasCalled);
			sut.setClickEvents();
			controls.logoutMenu.doClick();
			assert(postFunctionWasCalled);
		});
		it("should post login when loginButton is clicked", function () {
			assert(!postFunctionWasCalled);
			sut.setClickEvents();
			controls.loginButton.doClick();
			assert(postFunctionWasCalled);
		});
		describe('when login is unsuccessful', function () {
			it("should login when loginButton is clicked", function () {  //case when username is undefined; test logincontrols called
				assertBeforeSetLoginControls();
				assert(!controls.usernameInput.focused);
				assert.strictEqual('', controls.usernameInput.classname);
				
				window.location = "currenturl";
				sut.setClickEvents();
				controls.loginButton.doClick();

				assert(controls.usernameInput.focused);
				assert.strictEqual('hover', controls.usernameInput.classname);
				assertAfterSetLoginControls("currenturl", false);
			});
		});
		describe('when login is successful', function () {
			it("should login when loginButton is clicked", function () {  //case when username is undefined; test logincontrols called
				assertBeforeSetLoginControls();
				assert(!controls.usernameInput.focused);
				assert.strictEqual('', controls.usernameInput.classname);
				controls.usernameInput.val = function () {
					return "user entered value";
				};
				sut.setClickEvents();
				controls.loginButton.doClick();
				assert(!controls.usernameInput.focused);
				assert.ok(!controls.usernameInput.classname);
				assertAfterSetLoginControls(urls.home, true);
			});
		});
	});
});

