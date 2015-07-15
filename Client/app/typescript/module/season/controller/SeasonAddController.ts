/// <reference path="../../common/controllers/AbstractController.ts" />

module FifaLeagueClient.Module.Season {
  export class SeasonAddController extends Common.Controllers.AbstractController {

    season: SeasonModel;
    mainService : SeasonService;
		locationService: ng.ILocationService;

    static $inject = ["$scope", 'seasonService', '$location'];

    constructor(scope, seasonService : SeasonService, location: ng.ILocationService){
        super(scope);
        this.mainService = seasonService;
  			this.locationService = location;
        this.season = new SeasonModel(null);
    }

    /** CREATING THE SEASON **/
    // Method adding a season in the database
    public addSeason = ()  => {
      this.resetErrors();

        this.loadingPromise =
          this.mainService.addSeason(this.season)
              .then(this.onSaveSuccess)
              .catch(this.onSaveError);
    }

    // Do nothing if the creation is successfull
    protected onSaveSuccess = (data:SeasonModel) => {
      this.goBack();
    }

    // Method adding creating errors in creatingErrors list
    protected onSaveError = (config) => {
      this.errors = config.errors;
    }

    // Go to the seasonList
    public goBack(){
			this.locationService.path(seasonsPath);
    }

  }

}
