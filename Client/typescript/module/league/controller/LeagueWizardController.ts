/// <reference path="../../common/controllers/AbstractController.ts" />

module FifaLeagueClient.Module.League {
  export class LeagueWizardController extends Common.Controllers.AbstractController {


      mainService : GenerateLeagueService;
      wizardHandler:angular.mgoAngularWizard.WizardHandler;

      // interval service use to show the result after a defined time
      intervalService;

      // variable shown
      countryId: number;
      playerSelection:Player.Directives.SelectablePlayerModel;
      playerAssignLeague:Directives.PlayerAssignLeague[];
      leagues:LeagueModel[];

      generateLeague: GenerateLeagueDTOModel;

      showWizard:boolean;
      countBeforeResult:number;

      // The Id of the season after generation
      generatedSeasonId:number;


    static $inject = ["$scope", '$interval', 'generateLeagueService', 'WizardHandler'];

    constructor(scope, interval, generateLeagueService : GenerateLeagueService, wizardHandler:angular.mgoAngularWizard.WizardHandler){
        super(scope);
        this.intervalService = interval;
        this.wizardHandler= wizardHandler;
        this.mainService = generateLeagueService;
        this.generateLeague = new GenerateLeagueDTOModel(null);
        this.playerAssignLeague=[];
        this.showWizard = true;
    }

    // Hide the wizard, show the result (count to 10 before showing)
    public finishedWizard():void{
      var self = this;
      self.showWizard = false;
      self.countBeforeResult = 10;
      this.generatedSeasonId = this.generateLeague.SeasonId;

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
        this.playerAssignLeague=[];

        // Transfering them into playerLeague
        for(var i=0;i<selectedPlayers.length;i++){
          var pl = new Directives.PlayerAssignLeague(selectedPlayers[i]);
          this.playerAssignLeague.push(pl);
        }

        // Filling the leagues in consequence
        this.fillLeagues(this.playerAssignLeague);
    }

    // Assigning players to league
    public validateAssignPlayerToLeagueStep():void{
      this.errors = {};

      this.generateLeague.PlayerLeagues = [];
      // tranforming the selections in player assignable
      for(var i=0; i<this.leagues.length;i++){
          var league = this.leagues[i];
          var players = [];
          // for each leagues, we retrieve the players associated
          for(var j=0; j< this.playerAssignLeague.length;j++){
            if(this.playerAssignLeague[j].leagueId == league.Id){
              players.push(this.playerAssignLeague[j].player);
            }
          }
          // we add this list of players with the league
          this.generateLeague.PlayerLeagues.push(new PlayerAssignLeagueModel(league, players));
      }


      // Pushing the datas on the server
      this.loadingPromise =
          this.mainService.generateLeague(this.generateLeague)
            .then(this.handleGenerateLeagueSuccess)
            .catch(this.handleGenerateLeagueErrors);
    }


    // Go to the next step if the add was a success
    protected handleGenerateLeagueSuccess = (data) => {
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


    // call the service in order to get the number of leagues in function of the number of players
    public fillLeagues = (playerAssignLeague:Directives.PlayerAssignLeague[]) => {
      var self = this;
      self.errors = {};

      this.loadingPromise =
        self.mainService.getLeaguesFilteredList(this.playerAssignLeague.length)
            .then(self.fillLeaguesSuccessCallBack)
            .catch(self.fillLeaguesErrorCallBack);
    }

    // fill the players - if the callback is a success
    protected fillLeaguesSuccessCallBack = (leagues:LeagueModel[]) => {
      var self = this;
      // filling the list of the leagues
      this.leagues = leagues;
      if(self.wizardHandler.wizard() != null){
        self.wizardHandler.wizard().next();
      }
    }

    protected fillLeaguesErrorCallBack = (config) => {
      this.errors = config.errors;
    }


  }

}
