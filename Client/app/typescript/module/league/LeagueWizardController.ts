/// <reference path="../common/controllers/AbstractController.ts" />

module FifaLeagueClient.Module.League {
  export class LeagueWizardController extends Common.Controllers.AbstractController {

      // variable shown
      countryId: number;
      playerSelection:Player.Directives.SelectablePlayerModel;
      generateLeague: GenerateLeagueDTOModel;
      generatedLeagueListViewModel:LeagueViewModel[];
      mainService : GenerateLeagueService;
      wizardHandler:angular.mgoAngularWizard.WizardHandler;
      showWizard:boolean;

      // interval service use to show the result after a defined time
      intervalService;
      countBeforeResult:number;

    static $inject = ["$scope", '$interval', 'generateLeagueService', 'WizardHandler'];

    constructor(scope, interval, generateLeagueService : GenerateLeagueService, wizardHandler:angular.mgoAngularWizard.WizardHandler){
        super(scope);
        this.intervalService = interval;
        this.wizardHandler= wizardHandler;
        this.mainService = generateLeagueService;
        this.generateLeague = new GenerateLeagueDTOModel(null);
        this.showWizard = true;
        this.generatedLeagueListViewModel = null;
    }

    // Hide the wizard, show the result
    public finishedWizard():void{
      var self = this;
      self.showWizard = false;
      self.countBeforeResult = 10;

      self.intervalService(function(){
        self.countBeforeResult--;
      }, 1000, self.countBeforeResult);

    }

    public selectCountry():boolean{
      return true;
    }

    // Validating the country select step
    public validateCountrySelectionStep():void{
      if(this.wizardHandler.wizard() != null){
        this.wizardHandler.wizard().next();
      }
    }


    // Validating the season select step
    public validateSeasonSelectionStep():void{
        if(this.wizardHandler.wizard() != null){
          this.wizardHandler.wizard().next();
        }
    }

    // Validating the selection of players
    public validatePlayerSelectionStep():void{
        this.errors = {};
        var selectedPlayers = this.getListPlayers(true);
        this.generateLeague.Players = selectedPlayers;

        // Pushing the datas on the server
        this.loadingPromise =
            this.mainService.generateLeague(this.generateLeague)
              .then(this.handleGenerateLeagueSuccess)
              .catch(this.handleGenerateLeagueErrors);
    }


    // Go to the next step if the add was a success
    protected handleGenerateLeagueSuccess = (data:LeagueViewModel[]) => {
        this.generatedLeagueListViewModel = data;
        if(this.wizardHandler.wizard() != null){
          this.wizardHandler.wizard().next();
        }
    }

    // Method adding add lead errors in errors list
    protected handleGenerateLeagueErrors = (config) => {
      this.errors = config.errors;
    }

    // Get a list of <selectParam> players
    private getListPlayers = (selectParam:boolean):Player.PlayerModel[] => {
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
