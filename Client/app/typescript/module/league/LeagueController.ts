/// <reference path="../common/controllers/AbstractController.ts" />

module FifaLeagueClient.Module.League {
  export class LeagueController extends Common.Controllers.AbstractController {

      scope;
      leagues:LeagueModel[];
      league: LeagueModel;
      mainService : LeagueService;
      showCreateForm : boolean;
      showEditForm : boolean;
      showListForm : boolean;

    static $inject = ["$scope", 'leagueService'];

    constructor(scope, leagueService : LeagueService){
        super(scope);
        this.mainService = leagueService;

        this.leagues = [];
        this.league = new LeagueModel(null);
        this.showCreateForm = false;
        this.showEditForm = false;
        this.showListForm = true;
    }

      // Method showing the create form
      public showCreateLeague(){
          this.showCreateForm = true;
          this.showEditForm = false;
          this.showListForm = false;
          this.league = new LeagueModel(null);
      }

      // Method showing the edit form
      public showEditLeague(Id:number){
          this.showCreateForm = false;
          this.showEditForm = true;
          this.showListForm = false;
          this.loadLeague(Id);
      }

      // Method deleting a League
      public deleteLeagueInstance(Id:number){
          this.deleteLeague(Id);
      }

      // Method showing the list of leagues
      public showList(){
          this.showCreateForm = false;
          this.showEditForm = false;
          this.showListForm = true;
          this.fillLeagues();
      }

    /** LOADING THE LEAGUE **/
    // loading the league from database
    public loadLeague = (id) => {
      this.resetErrors();
      if(id != null){
          this.loadingPromise =
              this.mainService.getLeague(id)
                .then(this.handleLoadSuccess)
                .catch(this.handleLoadErrors);
      }
    }

    // Do nothing if the creation is successfull
    protected handleLoadSuccess = (data:LeagueModel) => {
      this.league = data;
    }

    // Method adding loading errors in errors list
    protected handleLoadErrors = (config) => {
      this.errors = config.errors;
    }

    /** CREATING THE LEAGUE **/
    // Method adding a league in the database
    public addLeague = ()  => {
      this.resetErrors();
      // try to create the league
      // refresh the list if it is a success
      // show the errors if not
        this.loadingPromise =
          this.mainService.addLeague(this.league)
              .then(this.handleCreatingSuccess)
              .catch(this.handleCreatingErrors);
    }

    // Do nothing if the creation is successfull
    protected handleCreatingSuccess = (data:LeagueModel) => {
      this.showList();
    }

    // Method adding creating errors in creatingErrors list
    protected handleCreatingErrors = (config) => {
      this.errors = config.errors;
    }

    /** UPDATING THE LEAGUE **/
    // Method adding a league in the database
    public updateLeague = ()  => {
      // reset the errors created before
      this.resetErrors();
      // try to create the league
      // refresh the list if it is a success
      // show the errors if not
        this.loadingPromise =
          this.mainService.updateLeague(this.league)
              .then(this.handleUpdateSuccess)
              .catch(this.handleUpdateErrors);
    }

    // Do nothing if the creation is successfull
    protected handleUpdateSuccess = (data:LeagueModel) => {
        this.showList();
    }

    // Method adding creating errors in creatingErrors list
    protected handleUpdateErrors = (config) => {
      this.errors = config.errors;
    }

    /** DELETING THE LEAGUE **/
    // Method deleting a league in the database
    public deleteLeague = (Id:number)  => {
      // reset the errors created before
      this.resetErrors();
      // try to create the league
      // refresh the list if it is a success
      // show the errors if not
        this.loadingPromise =
            this.mainService.deleteLeague(Id)
            .then(this.handleDeleteSuccess)
            .catch(this.handleDeleteErrors);
    }

    // Do nothing if the creation is successfull
    protected handleDeleteSuccess = (response:boolean) => {
        this.showList();
    }

    // Method adding creating errors in creatingErrors list
    protected handleDeleteErrors = (config) => {
        this.errors = config.errors;
    }

    // call the service in order to get the list of leagues
    public fillLeagues = () => {
        this.errors = {};
        this.loadingPromise =
            this.mainService.getLeagueList()
            .then(this.fillLeaguesSuccessCallBack)
            .catch(this.fillLeaguesErrorCallBack);
    }

    // fill the leagues - if the callback is a success
    protected fillLeaguesSuccessCallBack = (leagues:LeagueModel[]) => {
        this.leagues = leagues;
    }

    protected fillLeaguesErrorCallBack = (config) => {
        this.errors = config.errors;
    }

    // Selecting a league
    public select(){
      this.scope.triggerselect({league : this.scope.selectedleague});
    }

  }

}
