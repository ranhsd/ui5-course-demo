sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/f/LayoutType",
  ],
  function (BaseController, JSONModel, LayoutType) {
    "use strict";

    return BaseController.extend("ui5.demo.ui5demo.controller.App", {
      onInit: function () {
        var oLayoutModel = new JSONModel({
          layout: LayoutType.OneColumn,
        });

        this.getOwnerComponent().setModel(oLayoutModel, "layoutModel");
      },
    });
  }
);
