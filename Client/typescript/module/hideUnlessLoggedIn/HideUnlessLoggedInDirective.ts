module FifaLeagueClient.Module.HideUnlessLoggedIn.Directives {

    hideUnlessLoggedInModule.directive("hideunlessloggedin", hideUnlessLoggedInDirective);

    export function hideUnlessLoggedInDirective(loginService): ng.IDirective {
        return {
            restrict: "A",
            multiElement: true,
            scope: true,
            link: function(scope, $element) {
                
                function showOrHide() {
                    if (!loginService.isUserLoggedIn()) {
                        $element.hide();
                    } else {
                        $element.show();
                    }
                }
                showOrHide();
                scope.$root.$on('loginChange', showOrHide);
            }
        }
    }

    hideUnlessLoggedInDirective.$inject = ['loginService'];
}
