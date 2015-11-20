module FifaLeagueClient.Module.Results {

    resultsModule.directive("matchmodallink",MatchModalLinkDirective);

    interface IMyScope extends ng.IScope {
        vm : MatchModalLinkDirectiveController;
        id:string;
        showeditlink:boolean;
        callbackupdate;
    }

    export function MatchModalLinkDirective(): ng.IDirective {
        return {
            restrict: "E",
            scope: {
                showeditlink:'=',
                id:'=',
                errors:'=',
                'callbackupdate':'&callbackupdate'
            },
            controller: MatchModalLinkDirectiveController,
            controllerAs: "vm",
            templateUrl: 'views/results/match-modal-link.html',
            link: function(scope:IMyScope, modal, element, attrs) {
            }
        }
    }


}
