/// <reference path="../../common/controllers/AbstractController.ts" />
module FifaLeagueClient.Module.Season {
	interface IRouteParams extends ng.route.IRouteParamsService {
    		id:number;
 		}

	export class SeasonEditController extends Common.Controllers.AbstractController {
		SeasonService: SeasonService;
		locationService: ng.ILocationService;
		id: number;
		season: SeasonModel;
		seasonTableFilter: SeasonTableView.SeasonTableFilter;
		showSeasonTableView: boolean;

		static $inject = ["$scope", 'seasonService', '$location', '$routeParams'];


		constructor(scope, SeasonService: SeasonService, location: ng.ILocationService, $routeParams: IRouteParams) {
			super(scope);
			this.SeasonService = SeasonService;
			this.locationService = location;
			this.id = $routeParams.id;
			this.loadSeason();
		}

		private loadSeason = () => {
			var self = this;
			if(self.id != null){
				this.loadingPromise =
					this.SeasonService.getSeason(this.id)
						.then(function(data) {
							self.season = data;
							self.seasonTableFilter = new SeasonTableView.SeasonTableFilter();
							self.seasonTableFilter.SeasonId = self.id;
							self.showSeasonTableView = true;
						}).catch(this.onError);
			}
		}

		protected onError = (config) => {
			this.errors = config.errors;
		}

		protected onUpdateSuccess = () => {
			this.goBack();
		}

		protected updateSeason = () => {
			var self = this;
			this.loadingPromise =
				this.SeasonService.updateSeason(this.season)
					.then(this.onUpdateSuccess)
					.catch(this.onError);
		}

    // Go to the seasonList
    public goBack(){
			this.locationService.path(seasonsPath);
    }
	}
}
