module FifaLeagueClient.Module.Results.Directives {

    resultsModule.directive("latestresultviewshow",LatestResultViewShowDirective);

    interface IMyScope extends ng.IScope {
        vm : LatestResultViewShowController;
        filter : Results.ResultViewFilter;
        show : boolean;
        copyFilterAndLoad;
    }

    export function LatestResultViewShowDirective(): ng.IDirective {
        return {
            restrict: "E",
            scope: {
              filter:'=',
              show:'='
            },
            controller: LatestResultViewShowController,
            controllerAs: "vm",
            templateUrl: 'views/results/latest-result-view-show.html',
            link: function (scope:IMyScope, $elm, $attr)
            {
              // Reload the list if the filter change
              scope.$watch('filter', function(newfilter, oldfilter) {
                    if (newfilter != null && !newfilter.isEqual(oldfilter)) {
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

                  if(scope.filter != null){
                    scope.vm.resultViewFilter = scope.filter;
                  }

                  scope.vm.loadResultViewList();
                }
              }

            }
        }
    }


}
