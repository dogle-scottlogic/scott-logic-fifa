/// <reference path="../../common/controllers/AbstractController.ts" />

module FifaLeagueClient.Module.Country {
	export class CountrySelectController extends Common.Controllers.AbstractController{

		countryService: CountryService;
		countries: CountryModel[];

		static $inject = ["$scope", 'countryService'];

		constructor(scope, countryService : CountryService){
			super(scope);
			this.countryService = countryService;
			this.countries = [];
		}

		public getCountryList = () =>{
			this.errors = {};
			this.loadingPromise =
				this.countryService.getCountryList()
					.then(this.onGetCountriesSuccess)
					.catch(this.onError);
		}

		protected onGetCountriesSuccess = (countries: CountryModel[]) => {
			this.countries = countries;
		}

		protected onError = (config) => {
			this.errors = config.errors;
		}

    // Selecting a country
    public select(){
      this.scope.triggerselect({country : this.scope.selectedcountry});
    }
	}
}
