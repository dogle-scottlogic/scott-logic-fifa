module FifaLeagueClient.Module.Country.Directives {

    countryModule.directive("countryselect",countrySelectDirective);

    interface IMyScope extends ng.IScope {
        vm : CountrySelectController;
        selectedcountry:string;
        required: boolean;
    }

    export function countrySelectDirective(): ng.IDirective {
        return {
            restrict: "E",
            scope: {
                selectedcountry:'=',
                filterhasremainingmatchtoplay:'=',
                required:'=',
                'triggerselect':'&onSelect'
            },
            controller: CountrySelectController,
            controllerAs: "vm",
            templateUrl: 'views/country/country-select.html',
            link: function (scope:IMyScope, $elm, $attr)
            {
              // Reload the list if the filterhasremainingmatchtoplay changed
              scope.$watch('filterhasremainingmatchtoplay', function(newfilterhasremainingmatchtoplay, oldfilterhasremainingmatchtoplay) {
                        if (newfilterhasremainingmatchtoplay !== oldfilterhasremainingmatchtoplay) {
                          scope.vm.getCountryList();
                        }
              }, true);
            }
        }
    }


}
