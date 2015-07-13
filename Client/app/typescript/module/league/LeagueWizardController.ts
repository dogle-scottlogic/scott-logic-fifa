/// <reference path="../common/controllers/AbstractController.ts" />

module FifaLeagueClient.Module.League {
  export class LeagueWizardController extends Common.Controllers.AbstractController {

      // variable shown
      countryId: number;
      playerSelection:Player.Directives.SelectablePlayerModel;
      generateLeague: GenerateLeagueDTOModel;
      league: LeagueModel;
      mainService : GenerateLeagueService;
      wizardHandler:angular.mgoAngularWizard.WizardHandler;
      showWizard:boolean;

    static $inject = ["$scope", 'generateLeagueService', 'WizardHandler'];

    constructor(scope, generateLeagueService : GenerateLeagueService, wizardHandler:angular.mgoAngularWizard.WizardHandler){
        super(scope);
        this.wizardHandler= wizardHandler;
        this.mainService = generateLeagueService;
        this.generateLeague = new GenerateLeagueDTOModel(null);
        this.showWizard = true;
    }

    // Hide the wizard, show the result
    public finishedWizard():void{
      this.showWizard = false;
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
        this.generateLeague.Players = selectedPlayers;

        // Pushing the datas on the server
        this.mainService.generateLeague(this.generateLeague)
          .then(this.handleGenerateLeagueSuccess)
          .catch(this.handleGenerateLeagueErrors);
    }


    // Go to the next step if the add was a success
    protected handleGenerateLeagueSuccess = (data:LeagueModel) => {
        this.league = data;
        this.wizardHandler.wizard().next();
    }

    // Method adding add lead errors in errors list
    protected handleGenerateLeagueErrors = (config) => {
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
