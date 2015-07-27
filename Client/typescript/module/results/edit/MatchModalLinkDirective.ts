module FifaLeagueClient.Module.Results {

    resultsModule.directive("matchmodallink",MatchModalLinkDirective);

    interface IMyScope extends ng.IScope {
        vm : MatchModalLinkDirectiveControleur;
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
                'callbackupdate':'&callbackupdate'
            },
            controller: MatchModalLinkDirectiveControleur,
            controllerAs: "vm",
            templateUrl: 'views/results/match-modal-link.html',
            link: function(scope:IMyScope, modal, element, attrs) {
            }
        }
    }


}
