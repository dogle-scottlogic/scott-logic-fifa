/// <reference path="../../common/controllers/AbstractController.ts" />

module FifaLeagueClient.Module.Season {
	export class SeasonSelectController extends Common.Controllers.AbstractController{

		mainService: SeasonService;
		seasons: SeasonModel[];

		static $inject = ["$scope", 'seasonService'];

		constructor(scope, seasonService : SeasonService){
			super(scope);
			this.mainService = seasonService;
			this.seasons = [];
		}

		public getSeasonList = () =>{
			this.errors = {};
			// if we have a filter, we use it
			var seasonFilter:SeasonFilter = new SeasonFilter();
			if(this.scope.filtercountry != null){
				seasonFilter.CountryId = this.scope.filtercountry;
			}
			if(this.scope.filterhavingleague != null){
				seasonFilter.HavingLeague = this.scope.filterhavingleague;
			}
			this.loadingPromise =
					this.mainService.getSeasonFilteredList(seasonFilter)
						.then(this.onGetSeasonsSuccess)
						.catch(this.onError);
		}

		protected onGetSeasonsSuccess = (seasons: SeasonModel[]) => {
			this.seasons = seasons;
			// if their is only one season we select it automatically
			if(this.seasons.length == 1){
					this.scope.selectedseason = this.seasons[0].Id;
			}
		}

		protected onError = (config) => {
			this.errors = config.errors;
		}

    // Selecting a Season
    public select(){
      this.scope.triggerselect({season : this.scope.selectedseason});
    }
	}
}
