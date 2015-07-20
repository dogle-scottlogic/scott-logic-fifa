/// <reference path="../../common/controllers/AbstractController.ts" />
module FifaLeagueClient.Module.Country {

	export class CountryShowController extends Common.Controllers.AbstractController {
		mainService: CountryService;
		country: CountryModel;

		static $inject = ["$scope", 'countryService'];

		constructor(scope, CountryService: CountryService) {
			super(scope);
			this.mainService = CountryService;
		}

    /** LOADING THE COUNTRY **/
    // loading the country from database
    public loadCountry = (id) => {
      this.resetErrors();
      if(id != null){
          this.loadingPromise =
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
	}
}
