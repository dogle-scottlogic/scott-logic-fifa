module FifaLeagueClient.Module.Country.Directives {

    countryModule.directive("countryselect",countrySelectDirective);

    interface IMyScope extends ng.IScope {
        vm : CountryController;
        selectedcountry:string;
    }

    export function countrySelectDirective(): ng.IDirective {
        return {
            restrict: "E",
            scope: {
                selectedcountry:'=',
                'triggerselect':'&onSelect'
            },
            controller: CountryController,
            controllerAs: "vm",
            templateUrl: './views/partials/country-select.html',
            link: function(scope:IMyScope, element, attrs) {
                scope.selectedcountry = scope.selectedcountry;
            }
        }
    }


}

