
module FifaLeagueClient.Module.Results {

	export class ResultViewShowController extends AbstractResultViewShowController {

		static $inject = ["$scope", 'resultViewService'];

		constructor(scope, resultViewService: ResultViewService) {
			super(scope, resultViewService);
			this.resultViewFilter.PlayedMatch = true;
		}
	}
}
