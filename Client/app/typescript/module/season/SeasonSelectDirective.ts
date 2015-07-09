module FifaLeagueClient.Module.Season.Directives {

    seasonModule.directive("seasonselect",seasonSelectDirective);

    interface IMyScope extends ng.IScope {
        vm : SeasonController;
        filtercountry:string;
        selectedseason:string;
    }

    export function seasonSelectDirective(): ng.IDirective {
        return {
            restrict: "E",
            scope: {
                filtercountry:'=',
                selectedseason:'=',
                'triggerselect':'&onSelect'
            },
            controller: SeasonController,
            controllerAs: "vm",
            templateUrl: 'views/partials/season-select.html'
        }
    }


}
