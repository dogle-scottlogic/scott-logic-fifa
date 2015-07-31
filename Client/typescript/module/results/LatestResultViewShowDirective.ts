module FifaLeagueClient.Module.Results.Directives {

    resultsModule.directive("latestresultviewshow",LatestResultViewShowDirective);

    interface IMyScope extends ng.IScope {
        vm : LatestResultViewShowController;
        filter : Results.ResultViewFilter;
        parentvm : Common.Controllers.AbstractController;
    }

    export function LatestResultViewShowDirective(): ng.IDirective {
        return {
            restrict: "E",
            scope: {
              filter:'=',
              parentvm:'='
            },
            controller: LatestResultViewShowController,
            controllerAs: "vm",
            templateUrl: 'views/results/latest-result-view-show.html',

            compile: function(element, attributes){
               return {
                   post: function(scope:IMyScope, $elm, $attr){
                     // Add the parent if it has been added
                     if(scope.parentvm != null){
                       scope.parentvm.addChild(scope.vm);
                     }
                     // Link the filter with the filter of the controller
                     if(scope.filter != null){
                      scope.vm.resultViewFilter = scope.filter;
                     }
                     scope.vm.loadList();
                   }
               }
           }
        }
    }


}
