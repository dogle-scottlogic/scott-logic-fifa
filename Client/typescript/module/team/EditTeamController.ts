module FifaLeagueClient.Module.Team {
	interface IRouteParams extends ng.route.IRouteParamsService {
    		id:number;
 		}

	export class EditTeamController extends Common.Controllers.AbstractController {
		teamService: TeamService;
		locationService: ng.ILocationService;
		id: number;
		team: TeamModel;

		static $inject = ["$scope", 'teamService', '$location', '$routeParams'];

		
		constructor(scope, teamService: TeamService, location: ng.ILocationService, $routeParams: IRouteParams) {
			super(scope);
			this.teamService = teamService;
			this.locationService = location;
			this.id = $routeParams.id;
			this.loadTeam();
		}

		private loadTeam = () => {
			var self = this;
			this.loadingPromise = 
				this.teamService.getTeam(this.id)
					.then(function(data) {
						self.team = data;
					}).catch(this.onError);
		}

		protected onError = (config) => {
			this.errors = config.errors;
		}

		protected onUpdateSuccess = () => {
			this.locationService.path('/teams');
		}

		protected updateTeam = () => {
			var self = this;
			this.loadingPromise =
				this.teamService.updateTeam(this.team)
					.then(this.onUpdateSuccess)
					.catch(this.onError);	
		}
	}
}