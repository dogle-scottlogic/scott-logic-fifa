/// <reference path="../common/controllers/AbstractController.ts" />
module FifaLeagueClient.Module.Dashboard {

	export class DashboardShowController extends Common.Controllers.AbstractController {

		static $inject = ["$scope"];

		resultViewFilter: Results.ResultViewFilter;
		seasonTableFilter:SeasonTableView.SeasonTableFilter;
		showList: boolean;

		constructor(scope) {
			super(scope);

			this.seasonTableFilter = new SeasonTableView.SeasonTableFilter();
			this.seasonTableFilter.HasRemainingMatchToPlay = true;

			this.resultViewFilter = new Results.ResultViewFilter();
			this.resultViewFilter.PlayedMatch = true;
			// Initializing the limit to 3
			this.resultViewFilter.LimitResult = 3;

			this.showList = true;
		}


		public refreshList = function(){
			this.resultViewFilter = this.resultViewFilter;
		}

	}
}
