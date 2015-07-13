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
            templateUrl: 'views/partials/league-wizard.html'
        }
    }


}
