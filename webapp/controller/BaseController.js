sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/Page",
    "sap/m/Button",
    "sap/f/LayoutType",
    "ui5/demo/ui5demo/model/models",
    "sap/m/MessageToast",
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (
    Controller,
    JSONModel,
    Page,
    Button,
    LayoutType,
    models,
    MessageToast
  ) {
    "use strict";

    return Controller.extend("ui5.demo.ui5demo.controller.BaseController", {
      onCreateUserAddress: async function (oEvent) {
        alert("fragment in fragment");
        this._oDialog = await this.loadFragment({
          name: "ui5.demo.ui5demo.fragment.CreateUserAddress",
        });

        const oUserAddressModel = new JSONModel({
          busy: false,
          userAddress: {
            addressType: "",
            address: "",
            city: "",
            country: "",
          },
        });

        this._oDialog.setModel(oUserAddressModel);
        this._oDialog.setModel(models.createAddressTypeModel(), "addressTypes");

        this._oDialog.open();
      },

      onSaveUserAddress: function (oEvent) {
        const oData = this._oDialog
          .getModel("userAddressModel")
          .getProperty("/userAddress");

        this._oDialog.getModel("userAddressModel").setProperty("/busy", true);

        const oDataModel = this.getOwnerComponent().getModel();
        oDataModel.create(`/UserSet('${this._userId}')/addresses`, oData, {
          success: (oData, response) => {
            this._oDialog.getModel().setProperty("/busy", false);
            MessageToast.show("Addreess added successfully!");
            this._oDialog.close();
          },
          error: (oError) => {
            this._oDialog.getModel().setProperty("/busy", false);
            alert(oError.message);
          },
        });
      },
      onDeleteUserAddress: function (oEvent) {
        const oObjectToDelete = oEvent
          .getSource()
          .getBindingContext()
          .getObject();
        const oDataModel = this.getOwnerComponent().getModel();
        const sPath = oDataModel.createKey("UserAddressSet", {
          id: oObjectToDelete.id,
          addressType: oObjectToDelete.addressType,
        });

        oDataModel.remove(`/${sPath}`, {
          success: (oData, response) => {
            MessageToast.show("Addreess deleted successfully!");
          },
          error: (oError) => {
            alert(oError.message);
          },
        });
      },

      onDialogClose: function (oEvent) {
        this._oDialog.destroy();
        this._oDialog = null;
      },

      onCloseUserAddressDialog: function (oEvent) {
        // oEvent.getSource().getParent().close();
        this._oDialog.close();
      },
    });
  }
);
