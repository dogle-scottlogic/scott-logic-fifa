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

		// Filters used to filter the player selections
		matchFilter: MatchFilter;

		static $inject = ["$scope", "availablePlayersService", "matchResultsService"];

		constructor(scope, availablePlayersService: AvailablePlayersService, matchResultsService: MatchResultsService){
			super(scope);
			this.availablePlayersService = availablePlayersService;
			this.matchResultsService = matchResultsService;
			this.homePlayers = [];
			this.awayPlayers = [];
			this.matchFilter = new MatchFilter();
		}

		public initFields = () => {
			this.matchDate = new Date();
			this.goalsHome = null;
			this.goalsAway = null;
			this.selectedHomePlayerId = null;
			this.selectedAwayPlayerId = null;
			this.loadHomePlayerList();
		}

    // Refresh the list of home players if the country is selected
		public refreshHomePlayerListFromCountry(country:string){
			this.matchFilter.CountryId = country;
			this.matchFilter.SeasonId = null;
			this.matchFilter.LeagueId = null;
			this.loadHomePlayerList();
		}

    // Refresh the list of home players if the season is selected
		public refreshHomePlayerListFromSeason(season:string){
			this.matchFilter.SeasonId = season;
			this.matchFilter.LeagueId = null;
			this.loadHomePlayerList();
		}


    // Refresh the list of home players if the league is selected
		public refreshHomePlayerListFromLeague(league:string){
			this.matchFilter.LeagueId = league;
			this.loadHomePlayerList();
		}


		private loadHomePlayerList(){
			this.loadingPromise = this.availablePlayersService.getFilteredPlayers(this.matchFilter)
									.then(this.onHomePlayersSuccess)
									.catch(this.onError);
		}

		// Get the possible opponents for the specified player
		public retrieveOpponents = () => {
			this.availablePlayersService
				.getFilteredOpponents(this.selectedHomePlayerId, this.matchFilter)
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
