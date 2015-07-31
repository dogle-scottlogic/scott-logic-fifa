/// <reference path="../../common/controllers/AbstractController.ts" />
module FifaLeagueClient.Module.Results {

	export class AbstractResultViewShowController extends Common.Controllers.AbstractListController {
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
    public loadList = function() {
			var self = this;
      self.resetErrors();
      self.loadingPromise =
          self.mainService.getResultViewFilteredList(self.resultViewFilter)
            .then(self.handleLoadSuccess)
            .catch(self.handleLoadErrors);
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
