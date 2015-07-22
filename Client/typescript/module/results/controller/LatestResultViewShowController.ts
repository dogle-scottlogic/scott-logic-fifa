
module FifaLeagueClient.Module.Results {

	export class LatestResultViewShowController extends AbstractResultViewShowController {

		static $inject = ["$scope", 'resultViewService'];

		constructor(scope, resultViewService: ResultViewService) {
			super(scope, resultViewService);
			this.resultViewFilter.PlayedMatch = true;
			// Initializing the limit to 3
			this.resultViewFilter.LimitResult = 3;

		}
	}
}
