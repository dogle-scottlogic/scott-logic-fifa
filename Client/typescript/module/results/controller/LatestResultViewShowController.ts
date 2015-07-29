
module FifaLeagueClient.Module.Results {

	export class LatestResultViewShowController extends AbstractResultViewShowController {

		static $inject = ["$scope", 'resultViewService'];

		constructor(scope, resultViewService: ResultViewService) {
			super(scope, resultViewService);
		}
	}
}
