module FifaLeagueClient.Module.SeasonTableView.Directives {

    seasonTableViewModule.directive("seasontableviewshow",seasonTableViewShowDirective);

    interface IMyScope extends ng.IScope {
        vm : SeasonTableViewShowController;
    }

    export function seasonTableViewShowDirective(): ng.IDirective {
        return {
            restrict: "E",
            scope: {
            },
            controller: SeasonTableViewShowController,
            controllerAs: "vm",
            templateUrl: 'views/seasonTableView/seasonTableView-show.html'
        }
    }


}
