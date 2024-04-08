sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/Page",
    "sap/m/Button",
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller, JSONModel, Page, Button) {
    "use strict";

    return Controller.extend("ui5.demo.ui5demo.controller.Main", {
      onInit: function () {
        var oViewModel = new JSONModel({
          isButtonVisible: false,
          tableItems: [
            {
              firstName: "Ran",
              lastName: "Hassid",
              hometown: "Jerusalem",
            },
            {
              firstName: "Gil",
              lastName: "Reshef",
              hometown: "Kfar Saba",
            },
            {
              firstName: "Gila",
              lastName: "Sharko",
              hometown: "Beit Shemesh",
            },
          ],
        });

        this.getOwnerComponent().setModel(oViewModel, "viewModel");

        // default model
        const oDataModel = this.getOwnerComponent().getModel();
      },
      onAddUser: function (oEvent) {
        const oViewModel = this.getOwnerComponent().getModel("viewModel");
        const tableItems = oViewModel.getProperty("/tableItems");
        tableItems.push({
          firstName: "Mindel",
          lastName: "Hanflilg",
          hometown: "Beitar",
        });

        oViewModel.setProperty("/tableItems", tableItems);
      },
      onDeleteUser: function (oEvent) {
        const oViewModel = this.getOwnerComponent().getModel("viewModel");
        const sPath = oEvent
          .getSource()
          .getParent()
          .getParent()
          .getBindingContextPath();
        const oItemToDelete = oViewModel.getProperty(sPath);
        const tableItems = oViewModel.getProperty("/tableItems");
        const index = tableItems.indexOf(oItemToDelete);

        if (index !== -1) {
          tableItems.splice(index, 1);
          oViewModel.setProperty("/tableItems", tableItems);
        }
      },
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

      onShowTitleButtonPressed: function (oEvent) {
        const isShown = this.getOwnerComponent()
          .getModel("viewModel")
          .getProperty("/isButtonVisible");

        this.getOwnerComponent()
          .getModel("viewModel")
          .setProperty("/isButtonVisible", !isShown);
      },
      onSecondButtonClicked: function (oEvent) {
        alert("second button clicked");
      },
    });
  }
);
