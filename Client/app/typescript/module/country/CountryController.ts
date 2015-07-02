/// <reference path="../common/controllers/AbstractController.ts" />

module FifaLeagueClient.Module.Country {
  export class CountryController extends Common.Controllers.AbstractController {

      scope;
      countries;
      country: CountryModel;
      mainService : CountryService;
      showCreateForm : boolean;
      showEditForm : boolean;
      showListForm : boolean;

    static $inject = ["$scope", 'countryService'];

    constructor(scope, countryService : CountryService){
        super(scope);
        this.mainService = countryService;

        this.countries = [];
        this.country = new CountryModel(null);
        this.showCreateForm = false;
        this.showEditForm = false;
        this.showListForm = true;
    }

      // Method showing the create form
      public showCreateCountry(){
          this.showCreateForm = true;
          this.showEditForm = false;
          this.showListForm = false;
          this.country = new CountryModel(null);
      }

      // Method showing the edit form
      public showEditCountry(Id:number){
          this.showCreateForm = false;
          this.showEditForm = true;
          this.showListForm = false;
          this.loadCountry(Id);
      }

      // Method showing the list of countries
      public showList(){
          this.showCreateForm = false;
          this.showEditForm = false;
          this.showListForm = true;
          this.fillCountries();
      }

    /** LOADING THE COUNTRY **/
    // loading the country from database
    public loadCountry = (id) => {
      this.resetErrors();
      if(id != null){
        this.mainService.getCountry(this.handleLoadSuccess, this.handleLoadErrors, this, id);
      }
    }

    // Do nothing if the creation is successfull
    protected handleLoadSuccess = (data, status, headers, config) => {
      this.country = data;
    }

    // Method adding loading errors in errors list
    protected handleLoadErrors = (data, status, headers, config) => {
      this.errors = config.errors;
    }

    /** CREATING THE COUNTRY **/
    // Method adding a country in the database
    public addCountry = ()  => {
      this.resetErrors();
      // try to create the country
      // refresh the list if it is a success
      // show the errors if not
      this.mainService.addCountry(this.handleCreatingSuccess, this.handleCreatingErrors, this, this.country);
    }

    // Do nothing if the creation is successfull
    protected handleCreatingSuccess = (data, status, headers, config) => {
      this.showList();
    }

    // Method adding creating errors in creatingErrors list
    protected handleCreatingErrors = (data, status, headers, config) => {
      this.errors = config.errors;
    }

    /** UPDATING THE COUNTRY **/
    // Method adding a country in the database
    public updateCountry = ()  => {
      // reset the errors created before
      this.resetErrors();
      // try to create the country
      // refresh the list if it is a success
      // show the errors if not
      this.mainService.updateCountry(this.handleUpdateSuccess, this.handleUpdateErrors, this, this.country);
    }

    // Do nothing if the creation is successfull
    protected handleUpdateSuccess = (data, status, headers, config) => {
        this.showList();
    }

    // Method adding creating errors in creatingErrors list
    protected handleUpdateErrors = (data, status, headers, config) => {
      this.errors = config.errors;
    }

    /** DELETING THE COUNTRY **/
    // Method adding a country in the database
    public deleteCountry = ()  => {
      // reset the errors created before
      this.resetErrors();
      // try to create the country
      // refresh the list if it is a success
      // show the errors if not
      this.mainService.deleteCountry(this.handleDeleteSuccess, this.handleDeleteErrors, this, this.country.Id);
    }

    // Do nothing if the creation is successfull
    protected handleDeleteSuccess = (data, status, headers, config) => {
        this.showList();
    }

    // Method adding creating errors in creatingErrors list
    protected handleDeleteErrors = (data, status, headers, config) => {
      this.errors = config.errors;
    }

    // call the service in order to get the list of countries
    public fillCountries = () => {
      this.errors = {};
      this.mainService.getCountryList(this.fillCountriesSuccessCallBack, this.fillCountriesErrorCallBack, this);
    }

    // fill the countries - if the callback is a success
    protected fillCountriesSuccessCallBack = (data, status, headers, config) => {
      this.countries = data;
    }

    protected fillCountriesErrorCallBack = (data, status, headers, config) => {
      this.errors = config.errors;
    }

  }
}
