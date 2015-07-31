/// <reference path="../common/controllers/AbstractListController.ts" />

module FifaLeagueClient.Module.SeasonTableView {

	export class SeasonTableViewShowController extends Common.Controllers.AbstractListController {

		mainService: SeasonTableViewService;
		seasonTableViewList: SeasonTableViewModel[];
		filter:SeasonTableFilter;

		static $inject = ["$scope", 'seasonTableViewService'];

		constructor(scope, seasonTableViewService: SeasonTableViewService) {
			super(scope);
			this.mainService = seasonTableViewService;
		}

		/** LOADING THE Season VIEW SHOW **/
		// loading the result view from database
		public loadList = () => {
			this.resetErrors();
			this.loadingPromise =
					this.mainService.getSeasonTableViewFilteredList(this.filter)
						.then(this.handleLoadSuccess)
						.catch(this.handleLoadErrors);
		}

		// Do nothing if the creation is successfull
		protected handleLoadSuccess = (data:SeasonTableViewModel[]) => {
			this.seasonTableViewList = data;
		}

		// Method adding loading errors in errors list
		protected handleLoadErrors = (config) => {
			this.errors = config.errors;
		}

		// Get the statistics from a teamPlayer
		public showTeamPlayerStatistic = (teamPlayer:TeamPlayerTableLeagueViewModel) => {
			teamPlayer.show = !teamPlayer.show;
		}


	}

}
