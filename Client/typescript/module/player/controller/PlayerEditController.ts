/// <reference path="../../common/controllers/AbstractController.ts" />
module FifaLeagueClient.Module.Player {
	interface IRouteParams extends ng.route.IRouteParamsService {
    		id:number;
 		}

	export class PlayerEditController extends Common.Controllers.AbstractController {
		PlayerService: PlayerService;
		locationService: ng.ILocationService;
		id: number;
		player: PlayerModel;

		static $inject = ["$scope", 'playerService', '$location', '$routeParams'];


		constructor(scope, PlayerService: PlayerService, location: ng.ILocationService, $routeParams: IRouteParams) {
			super(scope);
			this.PlayerService = PlayerService;
			this.locationService = location;
			this.id = $routeParams.id;
			this.loadPlayer();
		}

		private loadPlayer = () => {
			var self = this;
			if(self.id != null){
				this.loadingPromise =
					this.PlayerService.getPlayer(this.id)
						.then(function(data) {
							self.player = data;
						}).catch(this.onError);
			}
		}

		protected onError = (config) => {
			this.errors = config.errors;
		}

		protected onUpdateSuccess = () => {
			this.goBack();
		}

		protected updatePlayer = () => {
			var self = this;
			this.loadingPromise =
				this.PlayerService.updatePlayer(this.player)
					.then(this.onUpdateSuccess)
					.catch(this.onError);
		}

    // Go to the playerList
    public goBack(){
			this.locationService.path(playersPath);
    }
	}
}
