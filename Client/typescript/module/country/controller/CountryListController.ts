/// <reference path="../../common/controllers/AbstractController.ts" />

module FifaLeagueClient.Module.Country {
	export class CountryListController extends Common.Controllers.AbstractController {

		countryService: CountryService;
		countries: CountryModel[];

		static $inject = ["$scope", 'countryService', '$location'];

		constructor(scope, countryService : CountryService, location: ng.ILocationService){
			super(scope);
			this.countryService = countryService;
			this.countries = [];
		}

		public showCountries = () => {
			this.getCountryList();
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

		public deleteCountry = (id: number) => {
			this.loadingPromise =
				this.countryService.deleteCountry(id)
					.then(this.onDeleteSuccess)
					.catch(this.onError);
		}

		protected onDeleteSuccess = () => {
			this.showCountries();
		}
	}
}
