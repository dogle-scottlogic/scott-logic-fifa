module FifaLeagueClient.Module.Team.Directives {

    teamModule.directive("teamplayerchartview",TeamPlayerChartViewDirective);

    interface IMyScope extends ng.IScope {
        vm : TeamPlayerChartViewController;
        seasonid:number;
        teamplayerid:number;
        parentcontext:any;
    }

    export function TeamPlayerChartViewDirective(): ng.IDirective {
        return {
            restrict: "E",
            scope: {
                seasonid:'=',
                teamplayerid:'=',
                show:'=',
                parentcontext:'='
            },
            controller: TeamPlayerChartViewController,
            controllerAs: "vm",
            templateUrl: 'views/team/teamPlayerChartView-show.html',
            link: function (scope:IMyScope, $elm, $attr)
            {
              // Reload the season if its ID changed
              scope.$watch('show', function(newshow, oldshow) {
                        // We load the teamplayer chart only if it asks to show and has not been loaded before
                        if (newshow) {
                          scope.vm.loadTeamPlayerChart();
                        }
              }, true);
            }
        }
    }


}
