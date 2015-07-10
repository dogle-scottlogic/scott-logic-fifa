/// <reference path="../common/controllers/AbstractController.ts" />

module FifaLeagueClient.Module.League {
  export class LeagueWizardController extends Common.Controllers.AbstractController {

      // variable shown
      countryId: number;
      playerSelection:Player.Directives.SelectablePlayerModel;
      league: LeagueModel;
      mainService : LeagueService;
      wizardHandler:angular.mgoAngularWizard.WizardHandler;

    static $inject = ["$scope", 'leagueService', 'WizardHandler'];

    constructor(scope, leagueService : LeagueService, wizardHandler:angular.mgoAngularWizard.WizardHandler){
        super(scope);
        this.wizardHandler= wizardHandler;
        this.mainService = leagueService;
        this.league = new LeagueModel(null);
    }

    public selectCountry():boolean{
      return true;
    }

    // Validating the country select step
    public validateCountrySelectionStep():void{
        this.wizardHandler.wizard().next();
    }


    // Validating the season select step
    public validateSeasonSelectionStep():void{
        this.wizardHandler.wizard().next();
    }

    // Validating the selection of players
    public validatePlayerSelectionStep():void{
        this.errors = {};
        var selectedPlayers = this.getListPlayers(true);
        this.league.Players = selectedPlayers;

        // Pushing the datas on the server
        this.mainService.addLeague(this.league)
          .then(this.handleAddLeadSuccess)
          .catch(this.handleAddLeadErrors);
    }


    // Go to the next step if the add was a success
    protected handleAddLeadSuccess = (data:LeagueModel) => {
        this.league = data;
        this.wizardHandler.wizard().next();
    }

    // Method adding add lead errors in errors list
    protected handleAddLeadErrors = (config) => {
      this.errors = config.errors;
    }

    // Get a list of <selectParam> players
    public getListPlayers = (selectParam:boolean):Player.PlayerModel[] => {
      var self = this;
      var listOfPlayers:Player.PlayerModel[] = [];
      angular.forEach(self.playerSelection, function(value: Player.Directives.SelectablePlayerModel, key) {
        if(value.selected == selectParam){
          listOfPlayers.push(value.player);
        }
      });
      return listOfPlayers;
    }


  }

}
