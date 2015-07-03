/// <reference path="../common/controllers/AbstractController.ts" />

module FifaLeagueClient.Module.Country {
  export class CountryController extends Common.Controllers.AbstractController {

      scope;
      countries:CountryModel[];
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

      // Method deleting a Country
      public deleteCountryInstance(Id:number){
          this.deleteCountry(Id);
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
        this.mainService.getCountry(id)
          .then(this.handleLoadSuccess)
          .catch(this.handleLoadErrors);
      }
    }

    // Do nothing if the creation is successfull
    protected handleLoadSuccess = (data:CountryModel) => {
      this.country = data;
    }

    // Method adding loading errors in errors list
    protected handleLoadErrors = (config) => {
      this.errors = config.errors;
    }

    /** CREATING THE COUNTRY **/
    // Method adding a country in the database
    public addCountry = ()  => {
      this.resetErrors();
      // try to create the country
      // refresh the list if it is a success
      // show the errors if not
      this.mainService.addCountry(this.country)
          .then(this.handleCreatingSuccess)
          .catch(this.handleCreatingErrors);
    }

    // Do nothing if the creation is successfull
    protected handleCreatingSuccess = (data:CountryModel) => {
      this.showList();
    }

    // Method adding creating errors in creatingErrors list
    protected handleCreatingErrors = (config) => {
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
      this.mainService.updateCountry(this.country)
          .then(this.handleUpdateSuccess)
          .catch(this.handleUpdateErrors);
    }

    // Do nothing if the creation is successfull
    protected handleUpdateSuccess = (data:CountryModel) => {
        this.showList();
    }

    // Method adding creating errors in creatingErrors list
    protected handleUpdateErrors = (config) => {
      this.errors = config.errors;
    }

    /** DELETING THE COUNTRY **/
    // Method deleting a country in the database
    public deleteCountry = (Id:number)  => {
      // reset the errors created before
      this.resetErrors();
      // try to create the country
      // refresh the list if it is a success
      // show the errors if not
      this.mainService.deleteCountry(Id)
        .then(this.handleDeleteSuccess)
        .catch(this.handleDeleteErrors);
    }

    // Do nothing if the creation is successfull
    protected handleDeleteSuccess = (response:boolean) => {
        this.showList();
    }

    // Method adding creating errors in creatingErrors list
    protected handleDeleteErrors = (config) => {
      this.errors = config.errors;
    }

    // call the service in order to get the list of countries
    public fillCountries = () => {
      this.errors = {};
      this.mainService.getCountryList()
          .then(this.fillCountriesSuccessCallBack)
          .catch(this.fillCountriesErrorCallBack);
    }

    // fill the countries - if the callback is a success
    protected fillCountriesSuccessCallBack = (countries:CountryModel[]) => {
      this.countries = countries;
    }

    protected fillCountriesErrorCallBack = (config) => {
      this.errors = config.errors;
    }

  }
}
