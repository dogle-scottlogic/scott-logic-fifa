/// <reference path="../../common/controllers/AbstractController.ts" />

module FifaLeagueClient.Module.Results {
	export class AddResultController extends Common.Controllers.AbstractController {
		availablePlayersService: AvailablePlayersService;
		matchResultsService: MatchResultsService;
		homePlayers: TeamPlayerModel[];
		awayPlayers: TeamPlayerModel[];
		selectedHomePlayerId: number;
		selectedAwayPlayerId: number;
		matchDate: Date;
		goalsHome: number;
		goalsAway: number;
		displaySuccess: boolean;

		static $inject = ["$scope", "availablePlayersService", "matchResultsService"];

		constructor(scope, availablePlayersService: AvailablePlayersService, matchResultsService: MatchResultsService){
			super(scope);
			this.availablePlayersService = availablePlayersService;
			this.matchResultsService = matchResultsService;
			this.homePlayers = [];
			this.awayPlayers = [];
		}

		private initFields = () => {
			this.matchDate = new Date();
			this.goalsHome = null;
			this.goalsAway = null;
			this.selectedHomePlayerId = null;
			this.selectedAwayPlayerId = null;

			this.loadingPromise = this.availablePlayersService.getPlayers()
									.then(this.onHomePlayersSuccess)
									.catch(this.onError);
		}

		// Get the possible opponents for the specified player
		public retrieveOpponents = () => {
			this.availablePlayersService
				.getOpponents(this.selectedHomePlayerId)
				.then(this.onAwayPlayersSuccess)
				.catch(this.onError);
		}

		public saveResult = () => {
			var result = new MatchResultDTO();
			result.homePlayerId = this.selectedHomePlayerId;
			result.awayPlayerId = this.selectedAwayPlayerId;
			result.scoreHome = this.goalsHome;
			result.scoreAway = this.goalsAway;
			result.date = this.matchDate;

			this.matchResultsService.addResult(result)
				.then(this.onSaveScoreSuccess)
				.catch(this.onError);
		}

		private onHomePlayersSuccess = (data) => {
			this.homePlayers = data;
		}

		private onAwayPlayersSuccess = (data) => {
			this.awayPlayers = data;
		}

		private onSaveScoreSuccess = () => {
			this.displaySuccess = true;
			this.initFields();
		}

		private onError = (config) => {
			this.errors = config.errors;
		}
	}
}
