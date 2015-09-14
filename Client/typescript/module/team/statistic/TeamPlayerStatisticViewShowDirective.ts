module FifaLeagueClient.Module.Team.Directives {

    teamModule.directive("teamplayerstatisticviewshow",TeamPlayerStatisticViewShowDirective);

    interface IMyScope extends ng.IScope {
        vm : TeamPlayerStatisticViewShowController;
        seasonid:number;
        teamplayerid:number;
        currentelement:any;
    }

    export function TeamPlayerStatisticViewShowDirective(): ng.IDirective {
        return {
            restrict: "E",
            scope: {
                seasonid:'=',
                teamplayerid:'=',
                show:'='
            },
            controller: TeamPlayerStatisticViewShowController,
            controllerAs: "vm",
            templateUrl: 'views/team/teamPlayerStatisticView-show.html',
            link: function (scope:IMyScope, $elm, $attr)
            {
              // Reload the season if its ID changed
              scope.$watch('show', function(newshow, oldshow) {
                        // We load the teamplayer statistic only if it asks to show and has not been loaded before
                        if (newshow && scope.vm.teamPlayerStatisticViewModel == null) {
                          scope.vm.loadTeamPlayerStatistic();
                        }
              }, true);
            }
        }
    }


}
