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
                required:'=',
                'triggerselect':'&onSelect'
            },
            controller: CountrySelectController,
            controllerAs: "vm",
            templateUrl: 'views/country/country-select.html'
        }
    }


}
