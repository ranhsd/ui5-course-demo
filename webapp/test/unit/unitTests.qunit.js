/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"ui5demo/ui5-demo/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
