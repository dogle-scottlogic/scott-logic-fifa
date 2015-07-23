/// <reference path="../common/controllers/AbstractController.ts" />
module FifaLeagueClient.Module.Dashboard {

	export class DashboardShowController extends Common.Controllers.AbstractController {

		static $inject = ["$scope"];

		seasonTableFilter:SeasonTableView.SeasonTableFilter;
		showSeasonTableView: boolean;

		constructor(scope) {
			super(scope);
			this.seasonTableFilter = new SeasonTableView.SeasonTableFilter();
			this.seasonTableFilter.HasRemainingMatchToPlay = true;
			this.showSeasonTableView = true;
		}

	}
}
