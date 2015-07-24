/// <reference path="../../common/controllers/AbstractController.ts" />

module FifaLeagueClient.Module.Player {

  export class PlayerSelectListController extends Common.Controllers.AbstractController {

      scope;
      mainService : PlayerService;

    static $inject = ["$scope", 'playerService'];

    constructor(scope:Directives.IPlayerSelectListScope, playerService : PlayerService){
        super(scope);
        this.mainService = playerService;
        this.scope.players = [];
    }

    // call the service in order to get the list of players
    public fillPlayers = () => {
      var self = this;
      self.errors = {};

      // Get only the none archived players
      var playerFilter = new PlayerFilter();
      playerFilter.Archived = false;

      this.loadingPromise =
        self.mainService.getPlayerFilteredList(playerFilter)
            .then(self.fillPlayersSuccessCallBack)
            .catch(self.fillPlayersErrorCallBack);
    }

    // fill the players - if the callback is a success
    protected fillPlayersSuccessCallBack = (players:PlayerModel[]) => {
      var self = this;
      // filling the list of the players (all unselected by default)
      for(var i = 0;i<players.length;i++){
        self.scope.players.push(new Directives.SelectablePlayerModel(players[i]));
      }
    }

    protected fillPlayersErrorCallBack = (config) => {
      this.errors = config.errors;
    }

    // select a player
    public selectPlayer = (player: Directives.SelectablePlayerModel) => {
      player.selected = true;
    }

    // unselect a player
    public unSelectPlayer = (player: Directives.SelectablePlayerModel) => {
      player.selected = false;
    }

    // Select all players
    public selectAllPlayers = () => {
      var self = this;
      for(var i = 0;i<self.scope.players.length;i++){
        self.scope.players[i].selected = true;;
      }
    }


    // Unselect all players
    public unSelectAllPlayers = () => {
      var self = this;
      for(var i = 0;i<self.scope.players.length;i++){
        self.scope.players[i].selected = false;;
      }
    }


    // Verify if at least exists one player <selectParam>
    public existAtLeast(selectParam:boolean):boolean{
      var self = this;
      var exist:boolean = false;

      for(var i = 0;i<self.scope.players.length;i++){
        if(self.scope.players[i].selected == selectParam){
          exist = true;
          break;
        }
      }

      return exist;
    }

  }

}
