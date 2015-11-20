module FifaLeagueClient.Module.HideUnlessAdmin.Directives {

    hideUnlessAdminModule.directive("hideunlessadmin", hideUnlessAdminDirective);

    export function hideUnlessAdminDirective(loginService): ng.IDirective {
        return {
            restrict: "A",
            multiElement: true,
            link: function(scope, $element) {
                function showOrHide() {
                    if (!loginService.getIsAdminFromSession()) {
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

    hideUnlessAdminDirective.$inject = ['loginService'];
}
