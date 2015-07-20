/// <reference path="../../common/controllers/AbstractController.ts" />
module FifaLeagueClient.Module.Season {

	export class SeasonViewShowController extends Common.Controllers.AbstractController {
		mainService: SeasonViewService;
		seasonView: SeasonViewModel;

		static $inject = ["$scope", 'seasonViewService'];

		constructor(scope, seasonViewService: SeasonViewService) {
			super(scope);
			this.mainService = seasonViewService;
		}

    /** LOADING THE SEASON VIEW **/
    // loading the season view from database
    public loadSeason = (id) => {
      this.resetErrors();
      if(id != null){
          this.loadingPromise =
              this.mainService.getSeasonView(id)
                .then(this.handleLoadSuccess)
                .catch(this.handleLoadErrors);
      }
    }

    // Do nothing if the creation is successfull
    protected handleLoadSuccess = (data:SeasonViewModel) => {
      this.seasonView = data;
    }

    // Method adding loading errors in errors list
    protected handleLoadErrors = (config) => {
      this.errors = config.errors;
    }
	}
}
