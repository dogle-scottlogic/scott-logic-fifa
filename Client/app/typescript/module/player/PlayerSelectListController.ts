/// <reference path="../common/controllers/AbstractController.ts" />

module FifaLeagueClient.Module.Player {

  export class PlayerSelectListController extends Common.Controllers.AbstractController {

      scope;
      players:PlayerModel[];
      mainService : PlayerService;

    static $inject = ["$scope", 'playerService'];

    constructor(scope:Directives.IPlayerSelectListScope, playerService : PlayerService){
        super(scope);
        this.mainService = playerService;
        this.players = [];
        this.fillPlayers();
        this.scope.players = {};
    }

    // call the service in order to get the list of players
    public fillPlayers = () => {
      var self = this;
      self.errors = {};
      self.mainService.getPlayerList()
          .then(self.fillPlayersSuccessCallBack)
          .catch(self.fillPlayersErrorCallBack);
    }

    // fill the players - if the callback is a success
    protected fillPlayersSuccessCallBack = (players:PlayerModel[]) => {
      var self = this;
      self.players = players;
      // filling the list of the players (all unselected by default)
      angular.forEach(self.players, function(value: PlayerModel, key) {
        self.scope.players[value.Id] = new Directives.SelectablePlayerModel(value);
      });
    }

    protected fillPlayersErrorCallBack = (config) => {
      this.errors = config.errors;
    }

    // select a player
    public selectPlayer = (Id:number) => {
      this.scope.players[Id].selected = true;
    }

    // unselect a player
    public unSelectPlayer = (Id:number) => {
      this.scope.players[Id].selected = false;
    }

    // Select all players
    public selectAllPlayers = () => {
      var self = this;
      angular.forEach(self.scope.players, function(value: Directives.SelectablePlayerModel, key) {
        self.scope.players[value.player.Id].selected = true;
      });
    }


    // Unselect all players
    public unSelectAllPlayers = () => {
      var self = this;
      angular.forEach(self.scope.players, function(value: Directives.SelectablePlayerModel, key) {
        self.scope.players[value.player.Id].selected = false;
      });
    }


    // Verify if exists at least one player <selectParam>
    public existAtLeast(selectParam:boolean):boolean{
      var self = this;
      var exist:boolean = false;
      angular.forEach(self.scope.players, function(value: Directives.SelectablePlayerModel, key) {
        if(value.selected == selectParam){
          exist = true;
        }
      });
      return exist;
    }

  }
}
