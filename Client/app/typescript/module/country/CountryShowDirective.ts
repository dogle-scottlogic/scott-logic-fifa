module FifaLeagueClient.Module.Country.Directives {

    countryModule.directive("countryshow",countryShowDirective);

    interface IMyScope extends ng.IScope {
        vm : CountryController;
        countryid:number;
    }

    export function countryShowDirective(): ng.IDirective {
        return {
            restrict: "E",
            scope: {
                countryid:'='
            },
            controller: CountryController,
            controllerAs: "vm",
            templateUrl: './views/partials/country-show.html'
        }
    }


}

