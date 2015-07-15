/// <reference path="../../common/controllers/AbstractController.ts" />

module FifaLeagueClient.Module.Player {
	export class PlayerListController extends Common.Controllers.AbstractController {

		playerService: PlayerService;
		players: PlayerModel[];

		static $inject = ["$scope", 'playerService', '$location'];

		constructor(scope, playerService : PlayerService, location: ng.ILocationService){
			super(scope);
			this.playerService = playerService;
			this.players = [];
		}

		public showPlayers = () => {
			this.getPlayerList();
		}

		public getPlayerList = () =>{
			this.errors = {};
			this.loadingPromise =
				this.playerService.getPlayerList()
					.then(this.onGetPlayersSuccess)
					.catch(this.onError);
		}

		protected onGetPlayersSuccess = (players: PlayerModel[]) => {
			this.players = players;
		}

		protected onError = (config) => {
			this.errors = config.errors;
		}

		public deletePlayer = (id: number) => {
			this.loadingPromise =
				this.playerService.deletePlayer(id)
					.then(this.onDeleteSuccess)
					.catch(this.onError);
		}

		protected onDeleteSuccess = () => {
			this.showPlayers();
		}
	}
}
