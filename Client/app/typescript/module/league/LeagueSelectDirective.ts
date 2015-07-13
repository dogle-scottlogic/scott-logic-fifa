module FifaLeagueClient.Module.League.Directives {

    leagueModule.directive("leagueselect",leagueSelectDirective);

    interface IMyScope extends ng.IScope {
        vm : LeagueController;
        selectedleague:string;
    }

    export function leagueSelectDirective(): ng.IDirective {
        return {
            restrict: "E",
            scope: {
                filterseason:'=',
                selectedleague:'=',
                'triggerselect':'&onSelect'
            },
            controller: LeagueController,
            controllerAs: "vm",
            templateUrl: 'views/partials/league-select.html'
        }
    }


}
