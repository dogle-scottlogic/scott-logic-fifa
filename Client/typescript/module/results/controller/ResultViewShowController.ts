
module FifaLeagueClient.Module.Results {

	export class ResultViewShowController extends AbstractResultViewShowController {

		static $inject = ["$scope", 'resultViewService'];

		constructor(scope, resultViewService: ResultViewService) {
			super(scope, resultViewService);
			this.resultViewFilter.PlayedMatch = true;

			// Initialize the date filter 1 year before today
			this.resultViewFilter.DateFrom = new Date();
			this.resultViewFilter.DateFrom.setFullYear(this.resultViewFilter.DateFrom.getFullYear() - 1);
		}
	}
}
