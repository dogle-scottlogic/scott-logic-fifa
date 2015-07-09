module FifaLeagueClient.Module.League.Directives {

    leagueModule.directive("leaguewizard",leagueWizardDirective);

    interface IMyScope extends ng.IScope {
        vm : LeagueController;
        countryId : number;
        controlseason : ()=>boolean;
    }

    export function leagueWizardDirective(): ng.IDirective {
        return {
            restrict: "E",
            controller: LeagueController,
            controllerAs: "vm",
            templateUrl: 'views/partials/league-wizard.html',
            link: function(scope:IMyScope, element, attrs) {
                scope.controlseason = function() {
                     // control that the season match with the country
                     //@todo to implement
                     return false;
                }
            }
        }
    }


}
