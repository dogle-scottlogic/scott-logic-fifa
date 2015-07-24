/// <reference path="../../common/controllers/AbstractController.ts" />

module FifaLeagueClient.Module.League {

  export class PlayerAssignLeagueListController extends Common.Controllers.AbstractController {

      scope;

    static $inject = ["$scope"];

    constructor(scope:Directives.IPlayerAssignLeagueListScope){
        super(scope);
        this.scope.players = [];
    }

    // Select a league for a player
    public selectLeague = (playerleague:Directives.PlayerAssignLeague, league:LeagueModel) => {
      playerleague.leagueId = league.Id;
    }


  }

}
