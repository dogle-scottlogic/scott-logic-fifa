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

			// if we have a filter, we use it
			var countryFilter:CountryFilter = new CountryFilter();

			if(this.scope.filterhasremainingmatchtoplay != null){
				countryFilter.HasRemainingMatchToPlay = this.scope.filterhasremainingmatchtoplay;
			}

			this.loadingPromise =
				this.countryService.getCountryFilteredList(countryFilter)
					.then(this.onGetCountriesSuccess)
					.catch(this.onError);
		}

		protected onGetCountriesSuccess = (countries: CountryModel[]) => {
			this.countries = countries;
			// if their is only one country we select it automatically
			if(this.countries.length == 1){
					this.scope.selectedcountry = this.countries[0].Id;
			}
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
