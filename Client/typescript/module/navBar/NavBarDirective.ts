module FifaLeagueClient.Module.NavBar {

    navBarModule.directive("navbar", navBarDirective);

    export function navBarDirective(): ng.IDirective {
        return {
            restrict: "E",
            templateUrl: 'views/nav-bar/nav-bar.html'
        }
    }

}
