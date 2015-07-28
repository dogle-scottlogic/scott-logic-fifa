module FifaLeagueClient.Module.SeasonTableView.Directives {

    seasonTableViewModule.directive("seasontableviewshow",seasonTableViewShowDirective);

    interface IMyScope extends ng.IScope {
        vm : SeasonTableViewShowController;
    		filter: SeasonTableFilter;
        show:boolean;
        resultviewfilter:Results.ResultViewFilter;
        copyFilterAndLoad;
    }

    export function seasonTableViewShowDirective(): ng.IDirective {
        return {
            restrict: "E",
            scope: {
              filter:'=',
              resultviewfilter:'=',
              show:'='
            },
            controller: SeasonTableViewShowController,
            controllerAs: "vm",
            templateUrl: 'views/seasonTableView/seasonTableView-show.html',
            link: function (scope:IMyScope, $elm, $attr)
            {
              // Reload the season if its ID changed and we ask to show
              scope.$watch('filter', function(newfilter, oldfilter) {
                        if (newfilter.isEqual(oldfilter) ) {
                          scope.copyFilterAndLoad();
                        }
              }, true);

              scope.$watch('resultviewfilter', function(newresultviewfilter, oldresultviewfilter) {
                        if (newresultviewfilter != null && !newresultviewfilter.isEqual(oldresultviewfilter)) {
                          // Copying the datas into the scope.filter
                          scope.filter.CountryId = newresultviewfilter.CountryId;
                          scope.filter.SeasonId = newresultviewfilter.SeasonId;
                          scope.filter.LeagueId = newresultviewfilter.LeagueId;
                          scope.copyFilterAndLoad();
                        }
              }, true);

                // Reload the season if its shown
                scope.$watch('show', function(newShow, oldshow) {
                          scope.copyFilterAndLoad();
                }, true);


              // copy the filter into the controller
              scope.copyFilterAndLoad = function(){
                if (scope.show) {
                  scope.vm.loadSeasonTableViewList(scope.filter);
                }
              }
            }
        }
    }


}
