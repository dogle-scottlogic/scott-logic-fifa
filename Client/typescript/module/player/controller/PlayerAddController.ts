/// <reference path="../../common/controllers/AbstractController.ts" />

module FifaLeagueClient.Module.Player {
  export class PlayerAddController extends Common.Controllers.AbstractController {

    player: PlayerModel;
    mainService : PlayerService;
		locationService: ng.ILocationService;

    static $inject = ["$scope", 'playerService', '$location'];

    constructor(scope, playerService : PlayerService, location: ng.ILocationService){
        super(scope);
        this.mainService = playerService;
  			this.locationService = location;
        this.player = new PlayerModel(null);
    }

    /** CREATING THE PLAYER **/
    // Method adding a player in the database
    public addPlayer = ()  => {
      this.resetErrors();

        this.loadingPromise =
          this.mainService.addPlayer(this.player)
              .then(this.onSaveSuccess)
              .catch(this.onSaveError);
    }

    // Do nothing if the creation is successfull
    protected onSaveSuccess = (data:PlayerModel) => {
      this.goBack();
    }

    // Method adding creating errors in creatingErrors list
    protected onSaveError = (config) => {
      this.errors = config.errors;
    }

    // Go to the playerList
    public goBack(){
			this.locationService.path(playersPath);
    }

  }

}
