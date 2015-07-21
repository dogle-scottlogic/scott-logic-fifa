/// <reference path="../common/controllers/AbstractController.ts" />

module FifaLeagueClient.Module.SeasonTableView {

	export class SeasonTableViewShowController extends Common.Controllers.AbstractController {

		mainService: SeasonTableViewService;
		seasonTableViewList: SeasonTableViewModel[];

		static $inject = ["$scope", 'seasonTableViewService'];

		constructor(scope, seasonTableViewService: SeasonTableViewService) {
			super(scope);
			this.mainService = seasonTableViewService;
		}

		/** LOADING THE Season VIEW SHOW **/
		// loading the result view from database
		public loadSeasonTableViewList = () => {
			this.resetErrors();
			this.loadingPromise =
					this.mainService.getSeasonTableViewList()
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

	}

}
