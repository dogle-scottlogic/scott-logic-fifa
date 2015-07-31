module FifaLeagueClient.Module.SeasonTableView.Directives {

    seasonTableViewModule.directive("seasontableviewshow",seasonTableViewShowDirective);

    interface IMyScope extends ng.IScope {
        vm : SeasonTableViewShowController;
        filter:SeasonTableView.SeasonTableFilter;
        parentvm : Common.Controllers.AbstractController;
    }

    export function seasonTableViewShowDirective(): ng.IDirective {
        return {
            restrict: "E",
            scope: {
              filter:'=',
              parentvm:'='
            },
            controller: SeasonTableViewShowController,
            controllerAs: "vm",
            templateUrl: 'views/seasonTableView/seasonTableView-show.html',
            compile: function(element, attributes){
               return {
                   post: function(scope:IMyScope, $elm, $attr){
                     // Add the parent if it has been added
                     if(scope.parentvm != null){
                       scope.parentvm.addChild(scope.vm);
                     }
                     // Link the filter with the filter of the controller
                     scope.vm.filter = scope.filter;
                     scope.vm.loadList();
                   }
               }
           }
        }
    }


}
