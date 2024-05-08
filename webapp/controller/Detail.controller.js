sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/Page",
    "sap/m/Button",
    "sap/f/LayoutType",
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller, JSONModel, Page, Button, LayoutType) {
    "use strict";

    return Controller.extend("ui5.demo.ui5demo.controller.Detail", {
      onInit: function () {
        const oRouter = this.getOwnerComponent().getRouter();

        oRouter
          .getRoute("RouteDetail")
          .attachPatternMatched(this.onRouteMatched, this);

        oRouter
          .getRoute("RouteMain")
          .attachPatternMatched(this.onRouteMainMatched, this);
      },

      onRouteMatched: function (oEvent) {
        const oArgs = oEvent.getParameter("arguments");
        this.getView().byId("currentId").setText(oArgs.id);

        const oLayoutModel = this.getOwnerComponent().getModel("layoutModel");
        oLayoutModel.setProperty("/layout", LayoutType.TwoColumnsMidExpanded);
      },

      onRouteMainMatched: function (oEvent) {},

      onBeforeRendering: function () {},
      /**
       * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
       * This hook is the same one that SAPUI5 controls get after being rendered.
       * @memberOf example_two.one
       */
      onAfterRendering: function () {},

      /**
       * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
       * @memberOf example_two.one
       */
      onExit: function () {},
    });
  }
);
