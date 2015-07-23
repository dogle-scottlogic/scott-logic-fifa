/// <reference path="../../common/controllers/AbstractController.ts" />

module FifaLeagueClient.Module.Team {

	export class TeamPlayerStatisticViewShowController extends Common.Controllers.AbstractController {

		mainService:TeamPlayerStatisticViewService;
		teamPlayerStatisticViewModel:TeamPlayerStatisticViewModel;

		static $inject = ["$scope", 'teamPlayerStatisticViewService'];

		constructor(scope, teamPlayerStatisticViewService:TeamPlayerStatisticViewService) {
			super(scope);
			this.mainService = teamPlayerStatisticViewService;
		}

		// Get the statistics from a teamPlayer
		public loadTeamPlayerStatistic = () => {
			if(this.scope.teamplayerid != null && this.scope.seasonid != null){
				this.loadingPromise =
					this.mainService.getTeamPlayerStatisticViewList(this.scope.teamplayerid, this.scope.seasonid)
						.then(this.handleLoadPlayerSuccess)
						.catch(this.handleLoadErrors);
			}
		}

		protected handleLoadPlayerSuccess = (data:Team.TeamPlayerStatisticViewModel) => {
			this.teamPlayerStatisticViewModel = data;
		}

		// Method adding loading errors in errors list
		protected handleLoadErrors = (config) => {
			this.errors = config.errors;
		}

	}

}
