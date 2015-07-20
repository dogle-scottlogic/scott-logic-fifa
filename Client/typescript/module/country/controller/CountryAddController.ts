/// <reference path="../../common/controllers/AbstractController.ts" />

module FifaLeagueClient.Module.Country {
  export class CountryAddController extends Common.Controllers.AbstractController {

    country: CountryModel;
    mainService : CountryService;
		locationService: ng.ILocationService;

    static $inject = ["$scope", 'countryService', '$location'];

    constructor(scope, countryService : CountryService, location: ng.ILocationService){
        super(scope);
        this.mainService = countryService;
  			this.locationService = location;
        this.country = new CountryModel(null);
    }

    /** CREATING THE COUNTRY **/
    // Method adding a country in the database
    public addCountry = ()  => {
      this.resetErrors();

        this.loadingPromise =
          this.mainService.addCountry(this.country)
              .then(this.onSaveSuccess)
              .catch(this.onSaveError);
    }

    // Do nothing if the creation is successfull
    protected onSaveSuccess = (data:CountryModel) => {
      this.goBack();
    }

    // Method adding creating errors in creatingErrors list
    protected onSaveError = (config) => {
      this.errors = config.errors;
    }

    // Go to the countryList
    public goBack(){
			this.locationService.path(countriesPath);
    }

  }

}
