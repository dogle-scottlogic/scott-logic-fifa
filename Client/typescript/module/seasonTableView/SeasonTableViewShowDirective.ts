module FifaLeagueClient.Module.SeasonTableView.Directives {

    seasonTableViewModule.directive("seasontableviewshow",seasonTableViewShowDirective);

    interface IMyScope extends ng.IScope {
        vm : SeasonTableViewShowController;
    		filter: SeasonTableFilter;
        show:boolean;
    }

    export function seasonTableViewShowDirective(): ng.IDirective {
        return {
            restrict: "E",
            scope: {
              filter:'=',
              show:'='
            },
            controller: SeasonTableViewShowController,
            controllerAs: "vm",
            templateUrl: 'views/seasonTableView/seasonTableView-show.html',
            link: function (scope:IMyScope, $elm, $attr)
            {
              // Reload the season if its ID changed and we ask to show
              scope.$watch('filter', function(newfilter, oldfilter) {
                        if (newfilter !== oldfilter && scope.show) {
                          scope.vm.loadSeasonTableViewList(newfilter);
                        }
              }, true);

                // Reload the season if its shown
                scope.$watch('show', function(newShow, oldshow) {
                          if (scope.show) {
                            scope.vm.loadSeasonTableViewList(scope.filter);
                          }
                }, true);
            }
        }
    }


}
