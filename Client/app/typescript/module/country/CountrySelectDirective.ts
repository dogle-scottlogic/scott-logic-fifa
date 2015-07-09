module FifaLeagueClient.Module.Country.Directives {

    countryModule.directive("countryselect",countrySelectDirective);

    interface IMyScope extends ng.IScope {
        vm : CountryController;
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
            controller: CountryController,
            controllerAs: "vm",
            templateUrl: 'views/partials/country-select.html'
        }
    }


}

