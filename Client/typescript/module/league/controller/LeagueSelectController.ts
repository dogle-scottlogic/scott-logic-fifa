/// <reference path="../../common/controllers/AbstractController.ts" />

module FifaLeagueClient.Module.League {
	export class LeagueSelectController extends Common.Controllers.AbstractController{

		mainService: LeagueService;
		leagues: LeagueModel[];

		static $inject = ["$scope", 'leagueService'];

		constructor(scope, leagueService : LeagueService){
			super(scope);
			this.mainService = leagueService;
			this.leagues = [];
		}

		public getLeagueList = () =>{
			this.errors = {};
			// if we have a filter, we use it
			var leagueFilter:LeagueFilter = new LeagueFilter();

			if(this.scope.filtercountry != null){
				leagueFilter.CountryId = this.scope.filtercountry;
			}

			if(this.scope.filterseason != null){
				leagueFilter.SeasonId = this.scope.filterseason;
			}

			if(this.scope.filterhasremainingmatchtoplay != null){
				leagueFilter.HasRemainingMatchToPlay = this.scope.filterhasremainingmatchtoplay;
			}

			this.loadingPromise =
					this.mainService.getLeagueFilteredList(leagueFilter)
						.then(this.onGetLeaguesSuccess)
						.catch(this.onError);
		}

		protected onGetLeaguesSuccess = (leagues: LeagueModel[]) => {
			this.leagues = leagues;
			// if their is only one league we select it automatically
			if(this.leagues.length == 1){
					this.scope.selectedleague = this.leagues[0].Id;
			}
		}

		protected onError = (config) => {
			this.errors = config.errors;
		}

    // Selecting a League
    public select(){
      this.scope.triggerselect({league : this.scope.selectedleague});
    }
	}
}
