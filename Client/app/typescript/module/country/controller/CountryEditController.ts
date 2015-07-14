/// <reference path="../../common/controllers/AbstractController.ts" />
module FifaLeagueClient.Module.Country {
	interface IRouteParams extends ng.route.IRouteParamsService {
    		id:number;
 		}

	export class CountryEditController extends Common.Controllers.AbstractController {
		CountryService: CountryService;
		locationService: ng.ILocationService;
		id: number;
		country: CountryModel;

		static $inject = ["$scope", 'countryService', '$location', '$routeParams'];


		constructor(scope, CountryService: CountryService, location: ng.ILocationService, $routeParams: IRouteParams) {
			super(scope);
			this.CountryService = CountryService;
			this.locationService = location;
			this.id = $routeParams.id;
			this.loadCountry();
		}

		private loadCountry = () => {
			var self = this;
			if(self.id != null){
				this.loadingPromise =
					this.CountryService.getCountry(this.id)
						.then(function(data) {
							self.country = data;
						}).catch(this.onError);
			}
		}

		protected onError = (config) => {
			this.errors = config.errors;
		}

		protected onUpdateSuccess = () => {
			this.goBack();
		}

		protected updateCountry = () => {
			var self = this;
			this.loadingPromise =
				this.CountryService.updateCountry(this.country)
					.then(this.onUpdateSuccess)
					.catch(this.onError);
		}

    // Go to the countryList
    public goBack(){
			this.locationService.path(countriesPath);
    }
	}
}
