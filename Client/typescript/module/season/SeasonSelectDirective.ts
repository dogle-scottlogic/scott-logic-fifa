module FifaLeagueClient.Module.Season.Directives {

    seasonModule.directive("seasonselect",seasonSelectDirective);

    interface IMyScope extends ng.IScope {
        vm : SeasonSelectController;
        filtercountry:string;
        filterhavingleague:boolean;
        selectedseason:string;
        required: boolean;
    }

    export function seasonSelectDirective(): ng.IDirective {
        return {
            restrict: "E",
            scope: {
                filtercountry:'=',
                filterhavingleague:'=',
                filterhasremainingmatchtoplay:'=',
                selectedseason:'=',
                required:'=',
                'triggerselect':'&onSelect'
            },
            controller: SeasonSelectController,
            controllerAs: "vm",
            templateUrl: 'views/season/season-select.html',
            link: function (scope:IMyScope, $elm, $attr)
            {
              // Reload the list if the filtercountry changed
              scope.$watch('filtercountry', function(newfiltercountry, oldfiltercountry) {
                        if (newfiltercountry !== oldfiltercountry) {
                          scope.vm.getSeasonList();
                        }
              }, true);

              // Reload the list if the filterhavingleague changed
              scope.$watch('filterhavingleague', function(newfilterhavingleague, oldfilterhavingleague) {
                        if (newfilterhavingleague !== oldfilterhavingleague) {
                          scope.vm.getSeasonList();
                        }
              }, true);

              // Reload the list if the filterhasremainingmatchtoplay changed
              scope.$watch('filterhasremainingmatchtoplay', function(newfilterhasremainingmatchtoplay, oldfilterhasremainingmatchtoplay) {
                        if (newfilterhasremainingmatchtoplay !== oldfilterhasremainingmatchtoplay) {
                          scope.vm.getSeasonList();
                        }
              }, true);
            }
        }
    }


}
