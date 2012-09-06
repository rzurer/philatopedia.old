"use strict";
/*global  describe, beforeEach, it*/
var assert = require('assert'),
    urls = require('../modules/urls').urls,
    sut = require('../modules/mainMenu').mainMenu(urls),
    parent,
    child,
    menu,
    controls,
    findArg,
    attr = function (name, value) {
        this[name] = value;
    },
    setup = function () {
        findArg = '';
        parent = {
            addClass : function (classname) {
                this.klass = this.klass + ' ' + classname;
            },
            klass : "parentclass"
        };
        child = {
            removeClass : function () {
                delete this.klass;
            },
            parent : function () {
                return parent;
            },
            klass : "childclass"
        };
        menu = {
            children : function (selector) {
                return child;
            },
            find : function (selector) {
                findArg = selector;
                return child;
            }
        };
        controls = {
            menu : menu,
            homeLink : { attr : attr},
            sandboxLink : { attr : attr},
            usercollectionLink : { attr : attr},
            addLink : { attr : attr},
            signinLink : { attr : attr},
            signoutLink : { attr : attr},
        };
        sut.initializeControls(controls);
    };
describe('mainMenu_module', function () {
    beforeEach(setup);
    describe('#initialize', function () {
        it("should set assign urls to links", function () {
            assert.strictEqual(controls.homeLink.href, urls.home);
            assert.strictEqual(controls.sandboxLink.href, urls.sandbox);
            assert.strictEqual(controls.usercollectionLink.href, urls.usercollection);
            assert.strictEqual(controls.addLink.href, urls.add);
            assert.strictEqual(controls.signinLink.href, urls.poundsign);
            assert.strictEqual(controls.signoutLink.href, urls.poundsign);
        });
    });
    describe('#setActiveMenu', function () {
        it("should remove class from children", function () {
            sut.setActiveMenu();
            assert(child.hasOwnProperty("klass") === false);
        });
        it("should add active class to parent", function () {
            sut.setActiveMenu();
            assert.strictEqual(parent.klass, "parentclass active");
        });
        it("should set href to expected url", function () {
            var url = 'foo',
                expected = 'a[href="' + url + '"]';
            sut.setActiveMenu(url);
            assert.strictEqual(findArg, expected);
        });
    });
});
