module FifaLeagueClient.Module.Team.Directives {

    teamModule.directive("teamplayerstatisticviewshow",TeamPlayerStatisticViewShowDirective);

    interface IMyScope extends ng.IScope {
        vm : TeamPlayerStatisticViewShowController;
        seasonid:number;
        teamplayerid:number;
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
                        if (newshow) {
                          scope.vm.loadTeamPlayerStatistic();
                        }
              }, true);
            }
        }
    }


}
