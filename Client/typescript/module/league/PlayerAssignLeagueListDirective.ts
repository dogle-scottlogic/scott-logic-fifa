module FifaLeagueClient.Module.League.Directives {

    leagueModule.directive("playerassignleaguelist",PlayerAssignLeagueListDirective);

    export class PlayerAssignLeague {

        public leagueId: number;
        public player: Player.PlayerModel;

        // build the model directly from the data returned by the service
        constructor(_player: Player.PlayerModel){
            this.player = _player;
        }

    }

    export interface IPlayerAssignLeagueListScope extends ng.IScope {
        vm : PlayerAssignLeagueListController;
        players:PlayerAssignLeague[];
        leagues:LeagueModel[];
    }

    export function PlayerAssignLeagueListDirective(): ng.IDirective {
        return {
            restrict: "E",
            scope: {
                players:'=',
                leagues:'='
            },
            controller: PlayerAssignLeagueListController,
            controllerAs: "vm",
            templateUrl: 'views/league/player-assign-league-list.html'
        }
    }


}
