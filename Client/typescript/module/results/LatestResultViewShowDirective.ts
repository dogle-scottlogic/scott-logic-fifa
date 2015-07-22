module FifaLeagueClient.Module.Results.Directives {

    resultsModule.directive("latestresultviewshow",LatestResultViewShowDirective);

    interface IMyScope extends ng.IScope {
        vm : LatestResultViewShowController;
    }

    export function LatestResultViewShowDirective(): ng.IDirective {
        return {
            restrict: "E",
            scope: {
            },
            controller: LatestResultViewShowController,
            controllerAs: "vm",
            templateUrl: 'views/results/latest-result-view-show.html',
            link: function (scope:IMyScope, $elm, $attr)
            {
            }
        }
    }


}
