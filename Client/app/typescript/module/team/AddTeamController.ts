module FifaLeagueClient.Module.Team {
	export class AddTeamController extends Common.Controllers.AbstractController {
		teamService: TeamService;
		locationService: ng.ILocationService;
		team: TeamModel;

		static $inject = ["$scope", 'teamService', '$location'];

		constructor(scope, teamService : TeamService, location: ng.ILocationService){
			super(scope);
			this.teamService = teamService;	
			this.locationService = location;
			this.team = new TeamModel(null);
		}

		public addTeam = () => {
			this.resetErrors();

			this.loadingPromise = 
				this.teamService.addTeam(this.team)
					.then(this.onSaveSuccess)
					.catch(this.onSaveError);
		}

		protected onSaveSuccess = () => {
			this.locationService.path('/teams');
		}

		protected onSaveError = (config) => {
			this.errors = config.errors;
		}
	}
}