module FifaLeagueClient.Module.Season.Directives {

    seasonModule.directive("seasonselect",seasonSelectDirective);

    interface IMyScope extends ng.IScope {
        vm : SeasonSelectController;
        filtercountry:string;
        selectedseason:string;
        required: boolean;
    }

    export function seasonSelectDirective(): ng.IDirective {
        return {
            restrict: "E",
            scope: {
                filtercountry:'=',
                selectedseason:'=',
                required:'=',
                'triggerselect':'&onSelect'
            },
            controller: SeasonSelectController,
            controllerAs: "vm",
            templateUrl: 'views/season/season-select.html',
            link: function (scope:IMyScope, $elm, $attr)
            {
              // Reload the country if its ID changed
              scope.$watch('filtercountry', function(newfiltercountry, oldfiltercountry) {
                        if (newfiltercountry !== oldfiltercountry) {
                          scope.vm.getSeasonList();
                        }
              }, true);
            }
        }
    }


}
