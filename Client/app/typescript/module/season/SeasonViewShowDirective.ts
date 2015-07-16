module FifaLeagueClient.Module.Season.Directives {

    seasonModule.directive("seasonviewshow",seasonViewShowDirective);

    interface IMyScope extends ng.IScope {
        vm : SeasonViewShowController;
        seasonid:number;
    }

    export function seasonViewShowDirective(): ng.IDirective {
        return {
            restrict: "E",
            scope: {
                seasonid:'='
            },
            controller: SeasonViewShowController,
            controllerAs: "vm",
            templateUrl: 'views/season/season-view-show.html',
            link: function (scope:IMyScope, $elm, $attr)
            {
              // Reload the season if its ID changed
              scope.$watch('seasonid', function(newseasonid, oldseasonid) {
                        if (newseasonid !== oldseasonid) {
                          scope.vm.loadSeason(newseasonid);
                        }
              }, true);
            }
        }
    }


}
