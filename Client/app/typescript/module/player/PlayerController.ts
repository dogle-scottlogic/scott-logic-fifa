/// <reference path="../common/controllers/AbstractController.ts" />

module FifaLeagueClient.Module.Player {
  export class PlayerController extends Common.Controllers.AbstractController {

      scope;
      players:PlayerModel[];
      player: PlayerModel;
      mainService : PlayerService;
      showCreateForm : boolean;
      showEditForm : boolean;
      showListForm : boolean;

    static $inject = ["$scope", 'playerService'];

    constructor(scope, playerService : PlayerService){
        super(scope);
        this.mainService = playerService;

        this.players = [];
        this.player = new PlayerModel(null);
        this.showCreateForm = false;
        this.showEditForm = false;
        this.showListForm = true;
    }

      // Method showing the create form
      public showCreatePlayer(){
          this.showCreateForm = true;
          this.showEditForm = false;
          this.showListForm = false;
          this.player = new PlayerModel(null);
      }

      // Method showing the edit form
      public showEditPlayer(Id:number){
          this.showCreateForm = false;
          this.showEditForm = true;
          this.showListForm = false;
          this.loadPlayer(Id);
      }

      // Method deleting a Player
      public deletePlayerInstance(Id:number){
          this.deletePlayer(Id);
      }

      // Method showing the list of players
      public showList(){
          this.showCreateForm = false;
          this.showEditForm = false;
          this.showListForm = true;
          this.fillPlayers();
      }

    // loading the player from database
    public loadPlayer = (id) => {
      this.resetErrors();
      if(id != null){
        this.mainService.getPlayer(id)
          .then(this.handleLoadSuccess)
          .catch(this.handleLoadErrors);
      }
    }

    // Do nothing if the creation is successful
    protected handleLoadSuccess = (data:PlayerModel) => {
      this.player = data;
    }

    // Method adding loading errors in errors list
    protected handleLoadErrors = (config) => {
      this.errors = config.errors;
    }

    // Method adding a player in the database
    public addPlayer = ()  => {
      this.resetErrors();
      // try to create the player
      // refresh the list if it is a success
      // show the errors if not
      this.mainService.addPlayer(this.player)
          .then(this.handleCreatingSuccess)
          .catch(this.handleCreatingErrors);
    }

    // Do nothing if the creation is successfull
    protected handleCreatingSuccess = (data:PlayerModel) => {
      this.showList();
    }

    // Method adding creating errors in creatingErrors list
    protected handleCreatingErrors = (config) => {
      this.errors = config.errors;
    }

    // Method updating a player in the database
    public updatePlayer = ()  => {
      // reset the errors created before
      this.resetErrors();
      // try to create the player
      // refresh the list if it is a success
      // show the errors if not
      this.mainService.updatePlayer(this.player)
          .then(this.handleUpdateSuccess)
          .catch(this.handleUpdateErrors);
    }

    // Do nothing if the creation is successful
    protected handleUpdateSuccess = (data:PlayerModel) => {
        this.showList();
    }

    // Method adding creating errors in creatingErrors list
    protected handleUpdateErrors = (config) => {
      this.errors = config.errors;
    }

    // Method deleting a player in the database
    public deletePlayer = (Id:number)  => {
      // reset the errors created before
      this.resetErrors();
      // try to create the player
      // refresh the list if it is a success
      // show the errors if not
      this.mainService.deletePlayer(Id)
        .then(this.handleDeleteSuccess)
        .catch(this.handleDeleteErrors);
    }

    // Do nothing if the creation is successful
    protected handleDeleteSuccess = (response:boolean) => {
        this.showList();
    }

    // Method adding creating errors in creatingErrors list
    protected handleDeleteErrors = (config) => {
      this.errors = config.errors;
    }

    // call the service in order to get the list of players
    public fillPlayers = () => {
      this.errors = {};
      this.mainService.getPlayerList()
          .then(this.fillPlayersSuccessCallBack)
          .catch(this.fillPlayersErrorCallBack);
    }

    // fill the players - if the callback is a success
    protected fillPlayersSuccessCallBack = (players:PlayerModel[]) => {
      this.players = players;
    }

    protected fillPlayersErrorCallBack = (config) => {
      this.errors = config.errors;
    }

  }
}
