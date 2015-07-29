/// <reference path="../../common/controllers/AbstractController.ts" />

module FifaLeagueClient.Module.Season {
	export class SeasonListController extends Common.Controllers.AbstractController {

		seasonService: SeasonService;
		seasons: SeasonModel[];
		filter:SeasonFilter;

		static $inject = ["$scope", 'seasonService', '$location'];

		constructor(scope, seasonService : SeasonService, location: ng.ILocationService){
			super(scope);
			this.seasonService = seasonService;
			this.seasons = [];
			this.filter = new SeasonFilter()
		}

		public showSeasons = () => {
			this.getSeasonList();
		}

		public onCountrySelected = (countryId:number) => {
			this.filter.CountryId = countryId;
			this.getSeasonList();
		}

		public getSeasonList = () =>{
			this.errors = {};
			this.loadingPromise =
				this.seasonService.getSeasonFilteredList(this.filter)
					.then(this.onGetSeasonsSuccess)
					.catch(this.onError);
		}

		protected onGetSeasonsSuccess = (seasons: SeasonModel[]) => {
			this.seasons = seasons;
		}

		protected onError = (config) => {
			this.errors = config.errors;
		}

		public deleteSeason = (id: number) => {
			this.loadingPromise =
				this.seasonService.deleteSeason(id)
					.then(this.onDeleteSuccess)
					.catch(this.onError);
		}

		protected onDeleteSuccess = () => {
			this.showSeasons();
		}
	}
}
