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
            templateUrl: 'views/partials/country-show.html',
            link: function (scope:IMyScope, $elm, $attr)
            {
              // Reload the country if its ID changed
              scope.$watch('countryid', function(newcountryid, oldcountryid) {
                        if (newcountryid !== oldcountryid) {
                          scope.vm.loadCountry(newcountryid);
                        }
              }, true);
            }
        }
    }


}
