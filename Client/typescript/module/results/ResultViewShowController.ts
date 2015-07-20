/// <reference path="../common/controllers/AbstractController.ts" />
module FifaLeagueClient.Module.Results {

	export class ResultViewShowController extends Common.Controllers.AbstractController {
		mainService: ResultViewService;
		resultViewList: ResultViewModel[];

		resultViewFilter: ResultViewFilter;

		static $inject = ["$scope", 'resultViewService'];

		constructor(scope, resultViewService: ResultViewService) {
			super(scope);
			this.mainService = resultViewService;
			this.resultViewFilter = new ResultViewFilter();
		}

    /** LOADING THE RESULT VIEW **/
    // loading the result view from database
    public loadResultViewList = () => {
      this.resetErrors();
      this.loadingPromise =
          this.mainService.getResultViewFilteredList(this.resultViewFilter)
            .then(this.handleLoadSuccess)
            .catch(this.handleLoadErrors);
    }

    // Do nothing if the creation is successfull
    protected handleLoadSuccess = (data:ResultViewModel[]) => {
      this.resultViewList = data;
    }

    // Method adding loading errors in errors list
    protected handleLoadErrors = (config) => {
      this.errors = config.errors;
    }
	}
}
