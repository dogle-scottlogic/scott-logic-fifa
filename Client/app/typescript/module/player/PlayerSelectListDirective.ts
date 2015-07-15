module FifaLeagueClient.Module.Player.Directives {

    playerModule.directive("playerselectlist",playerSelectListDirective);

    export class SelectablePlayerModel {

        public player: PlayerModel;
        public selected: boolean;

        // build the model directly from the data returned by the service
        constructor(_player: PlayerModel){
            this.player = _player;
            this.selected = false;
        }

    }

    export interface IPlayerSelectListScope extends ng.IScope {
        vm : PlayerSelectListController;
        players:{[Id: number]:SelectablePlayerModel};
    }

    export function playerSelectListDirective(): ng.IDirective {
        return {
            restrict: "E",
            scope: {
                players:'='
            },
            controller: PlayerSelectListController,
            controllerAs: "vm",
            templateUrl: 'views/player/player-select-list.html'
        }
    }


}
