module FifaLeagueClient.Module.League.Directives {

    leagueModule.directive("leaguewizard",leagueWizardDirective);

    interface IMyScope extends ng.IScope {
        vm : LeagueWizardController;
        controlseason : ()=>boolean;
    }

    export function leagueWizardDirective(): ng.IDirective {
        return {
            restrict: "E",
            controller: LeagueWizardController,
            controllerAs: "vm",
            templateUrl: 'views/partials/league-wizard.html',
            link: function(scope:IMyScope, element, attrs) {
                scope.controlseason = function() {
                     // control that the season match with the country
                     //@todo to implement
                     return true;
                }
            }
        }
    }


}
