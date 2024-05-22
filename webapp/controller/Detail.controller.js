sap.ui.define(
  [
    "ui5/demo/ui5demo/controller/BaseController",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/Page",
    "sap/m/Button",
    "sap/f/LayoutType",
    "ui5/demo/ui5demo/model/models",
    "sap/m/MessageToast",
    "sap/ui/table/Column",
    "sap/m/Column",
    "sap/m/Label",
    "sap/m/Text",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (
    BaseController,
    Controller,
    JSONModel,
    Page,
    Button,
    LayoutType,
    models,
    MessageToast,
    UIColumn,
    Column,
    Label,
    Text,
    Filter,
    FilterOperator
  ) {
    "use strict";

    return BaseController.extend("ui5.demo.ui5demo.controller.Detail", {
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
        this._userId = oArgs.id;

        const oView = this.getView();
        oView.bindElement(`/UserSet('${this._userId}')`);

        const oLayoutModel = this.getOwnerComponent().getModel("layoutModel");
        oLayoutModel.setProperty("/layout", LayoutType.TwoColumnsMidExpanded);
      },

      // onCountryChanged: function (oEvent) {
      //   const val = oEvent.getParameter("value");
      //   const oUserAddrModel = this._oDialog.getModel("userAddressModel");
      //   oUserAddrModel.setProperty("/cityEnabled", !!val);
      // },

      onCountryValueHelpRequest: async function (oEvent) {
        this._oCitySelectDialog = await this.loadFragment({
          name: "ui5.demo.ui5demo.fragment.CitySelection",
        });

        this._oCitySelectDialog.open();

        this.getView().addDependent(this._oCitySelectDialog);

        const oTable = await this._oCitySelectDialog.getTableAsync();

        const sSelectedCountryCode = this.getView()
          .getModel("userAddressModel")
          .getProperty("/userAddress/country");

        if (oTable.bindRows) {
          oTable.bindRows({
            path: "/CountryRegionSet",
            events: {
              dataReceived: () => {
                this._oCitySelectDialog.update();
              },
            },
            filters: new Filter({
              path: "countryCode",
              operator: FilterOperator.EQ,
              value1: sSelectedCountryCode,
            }),
          });
          const oCityCode = new UIColumn({
            label: new Label({ text: "City Code" }),
            template: new Text({ wrapping: false, text: "{regionCode}" }),
          });

          const oCityNameColumn = new UIColumn({
            label: new Label({ text: "City Name" }),
            template: new Text({ wrapping: false, text: "{regionName}" }),
          });
          oTable.addColumn(oCityCode);
          oTable.addColumn(oCityNameColumn);
        }

        // For Mobile the default table is sap.m.Table
        // if (oTable.bindItems) {
        //   // Bind items to the ODataModel and add columns
        //   oTable.bindItems({
        //     path: "/ZSALESREPORT",
        //     template: new ColumnListItem({
        //       cells: [
        //         new Label({ text: "{ProductCode}" }),
        //         new Label({ text: "{ProductName}" }),
        //       ],
        //     }),
        //     events: {
        //       dataReceived: function () {
        //         oDialog.update();
        //       },
        //     },
        //   });
        //   oTable.addColumn(
        //     new MColumn({ header: new Label({ text: "Product Code" }) })
        //   );
        //   oTable.addColumn(
        //     new MColumn({ header: new Label({ text: "Product Name" }) })
        //   );
        // }
        this._oCitySelectDialog.update();
      },

      onCityValyeHelpCancel: function (oEvent) {
        oEvent.getSource().close();
      },

      onCityValyeHelpOk: function (oEvent) {
        const oSelectedToken = oEvent.getParameter("tokens")[0];
        const sSelectedCityCode = oSelectedToken.getKey();
        const sSelectedCityText = oSelectedToken.getText();

        this.getView()
          .getModel("userAddressModel")
          .setProperty("/userAddress/city", sSelectedCityText);

        this._oCitySelectDialog.close();
      },

      onCityValyeHelpAfterClose: function (oEvent) {
        oEvent.getSource().destroy();
        this._oCitySelectDialog = null;
      },

      onCreateUserAddress: async function (oEvent) {
        this._oDialog = await this.loadFragment({
          name: "ui5.demo.ui5demo.fragment.CreateUserAddress",
        });

        const oUserAddressModel = new JSONModel({
          busy: false,
          // cityEnabled: false,
          userAddress: {
            addressType: "",
            address: "",
            city: "",
            country: "",
          },
        });

        const oAddressTypesModel = models.createAddressTypeModel();

        this.getView().setModel(oUserAddressModel, "userAddressModel");
        this.getView().setModel(oAddressTypesModel, "addressTypes");

        this._oDialog.open();

        // Open the dialog in an alternative way

        // this.loadFragment({
        //   name: "ui5.demo.ui5demo.fragment.CreateUserAddress",
        // }).then(function (oDialog) {
        //   oDialog.open();
        // });
      },

      onSaveUserAddress: function (oEvent) {
        const oData = this.getView()
          .getModel("userAddressModel")
          .getProperty("/userAddress");

        this.getView().getModel("userAddressModel").setProperty("/busy", true);

        const oDataModel = this.getOwnerComponent().getModel();
        oDataModel.create(`/UserSet('${this._userId}')/addresses`, oData, {
          success: (oData, response) => {
            this.getView()
              .getModel("userAddressModel")
              .setProperty("/busy", false);
            MessageToast.show("Addreess added successfully!");
            this._oDialog.close();
          },
          error: (oError) => {
            this.getView()
              .getModel("userAddressModel")
              .setProperty("/busy", false);
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
