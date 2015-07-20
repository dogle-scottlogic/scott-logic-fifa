/// <reference path="../common/controllers/AbstractController.ts" />

module FifaLeagueClient.Module.Team {
	export class TeamController extends Common.Controllers.AbstractController {
		teamService: TeamService;

		teams: TeamModel[];

		static $inject = ["$scope", 'teamService', '$location'];

		constructor(scope, teamService : TeamService, location: ng.ILocationService){
			super(scope);
			this.teamService = teamService;
			this.teams = [];
		}

		public showTeams = () => {
			this.getTeamList();
		}

		public getTeamList = () =>{
			this.errors = {};
			this.loadingPromise =
				this.teamService.getTeamList()
					.then(this.onGetTeamsSuccess)
					.catch(this.onError);
		}

		protected onGetTeamsSuccess = (teams: TeamModel[]) => {
			this.teams = teams;
		}

		protected onError = (config) => {
			this.errors = config.errors;
		}

		public deleteTeam = (id: number) => {
			this.loadingPromise =
				this.teamService.deleteTeam(id)
					.then(this.onDeleteSuccess)
					.catch(this.onError);
		}

		protected onDeleteSuccess = () => {
			this.showTeams();
		}
	}
}
