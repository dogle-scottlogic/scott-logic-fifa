module FifaLeagueClient.Module.League.Directives {

    leagueModule.directive("leagueselect",leagueSelectDirective);

    interface IMyScope extends ng.IScope {
        vm : LeagueSelectController;
        filtercountry:string;
        filterseason:string;
        selectedleague:string;
        required: boolean;
    }

    export function leagueSelectDirective(): ng.IDirective {
        return {
            restrict: "E",
            scope: {
                filtercountry:'=',
                filterseason:'=',
                filterhasremainingmatchtoplay:'=',
                selectedleague:'=',
                required:'=',
                'triggerselect':'&onSelect'
            },
            controller: LeagueSelectController,
            controllerAs: "vm",
            templateUrl: 'views/league/league-select.html',
            link: function (scope:IMyScope, $elm, $attr)
            {
              // Reload the list if the filtercountry changed
              scope.$watch('filtercountry', function(newfiltercountry, oldfiltercountry) {
                        if (newfiltercountry !== oldfiltercountry) {
                          scope.vm.getLeagueList();
                        }
              }, true);

              // Reload the list if the filterseason changed
              scope.$watch('filterseason', function(newfilterseason, oldfilterseason) {
                        if (newfilterseason !== oldfilterseason) {
                          scope.vm.getLeagueList();
                        }
              }, true);

              // Reload the list if the filterhasremainingmatchtoplay changed
              scope.$watch('filterhasremainingmatchtoplay', function(newfilterhasremainingmatchtoplay, oldfilterhasremainingmatchtoplay) {
                        if (newfilterhasremainingmatchtoplay !== oldfilterhasremainingmatchtoplay) {
                          scope.vm.getLeagueList();
                        }
              }, true);
            }
        }
    }


}
