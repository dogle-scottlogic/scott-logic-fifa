/// <reference path="../common/controllers/AbstractController.ts" />
module FifaLeagueClient.Module.Dashboard {

    export class DashboardShowController extends Common.Controllers.AbstractController {

        static $inject = ["$scope"];

        resultViewFilter: Results.ResultViewFilter;
        seasonTableFilter:SeasonTableView.SeasonTableFilter;
        showList: boolean;

        constructor(scope) {
            super(scope);
            this.showList = false;

            this.seasonTableFilter = new SeasonTableView.SeasonTableFilter();
            this.seasonTableFilter.Archived = false;

            this.resultViewFilter = new Results.ResultViewFilter();

      // We force the filters played matches and limit to 3
            this.resultViewFilter.PlayedMatch = true;
            // Initializing the limit to 3
            this.resultViewFilter.LimitResult = 3;

            this.showList = true;
        }

        public copyFilterAndRefreshChildList = function(){

            // We copy the filter to the seasontableFilter before refreshing the lists
            if(this.resultViewFilter != null && this.seasonTableFilter != null){
                this.seasonTableFilter.CountryId = this.resultViewFilter.CountryId;
                this.seasonTableFilter.SeasonId = this.resultViewFilter.SeasonId;
                this.seasonTableFilter.LeagueId = this.resultViewFilter.LeagueId;
            }

            // then we refresh the child lists
            this.refreshChildList();
        }

    }
}
