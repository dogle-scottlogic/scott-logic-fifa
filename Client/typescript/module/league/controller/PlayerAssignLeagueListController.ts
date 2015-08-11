/// <reference path="../../common/controllers/AbstractController.ts" />

module FifaLeagueClient.Module.League {

  export class PlayerAssignLeagueListController extends Common.Controllers.AbstractController {

    scope;
    parentController;

    static $inject = ["$scope"];

    constructor(scope:Directives.IPlayerAssignLeagueListScope){
        super(scope);
        this.scope.players = [];
        this.parentController = this.scope.parentcontroller;
    }

    // Select a league for a player
    public selectLeague = (playerleague:Directives.PlayerAssignLeague, league:LeagueModel) => {
      playerleague.leagueId = league.Id;
    }

    // Get Players for a league
    public getPlayersForLeague = function(leagueId:number) {
      var players = [];
      for(var i = 0; i<this.scope.players.length;i++){
        var player = this.scope.players[i];
        if(player.leagueId == leagueId){
          players.push(player);
        }
      }
      return players;
    }

    public getErrorForLeague = function(leagueId:number) {
        return this.parentController.seasonErrors[leagueId];
    }

  }

}
