describe('Testing the PlayerSelectListController', function() {
  beforeEach(module('player'));
  beforeEach(module(FifaLeagueClient.Module.Common.devConfig));

  var playerSelectListController;
  var $httpBackend;

  var dataRepository;

  // Mocking the player service
  beforeEach(function() {

    dataRepository = player_buildDataRepository();

    // Mocking the datas
    inject(function($injector) {

      config = $injector.get(FifaLeagueClient.Module.Common.configService);
      $httpBackend = $injector.get('$httpBackend');
      $q = $injector.get('$q');

      player_mockHTTPBackend(config, $httpBackend, $q, dataRepository);
    });

  });

  // Constructing the controller
  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope.$new();

    playerSelectListController = $controller(FifaLeagueClient.Module.Player.PlayerSelectListController,
        {$scope: scope});


    // Initialize the list of the players
    playerSelectListController.fillPlayers();
    verifyPromiseAndFlush(playerSelectListController, $httpBackend);

    scope.$digest();
  }));

  describe('PlayerSelectListController in normal case (no error) : ', function(){

    it('should contain all none archived players at initialize', function() {
      // The player shall be retrieved in the list
      expect(playerSelectListController.scope.players[1].player).toEqual(dataRepository[0]);
      expect(playerSelectListController.scope.players[2].player).toEqual(dataRepository[1]);
      expect(Object.keys(playerSelectListController.scope.players).length).toEqual(2);
    });


    it('all item should be unselected', function() {
      // The player shall be retrieved in the list
      for(var key in playerSelectListController.scope.players){
        expect(playerSelectListController.scope.players[key].selected).toEqual(false);
      }
    });


    it('Selecting a player shall select him and not the others', function() {
      var playerSelected = 1;
      playerSelectListController.selectPlayer(playerSelected);
      // The player shall be retrieved in the list
      for(var key in playerSelectListController.scope.players){
        if(playerSelected == key){
          expect(playerSelectListController.scope.players[key].selected).toEqual(true);
        }else{
          expect(playerSelectListController.scope.players[key].selected).toEqual(false);
        }
      }
    });


    it('Unselecting a player shall unselect him and not the others', function() {
      // first we select all players
      for(var key in playerSelectListController.scope.players){
        playerSelectListController.scope.players[key].selected = true;
      }
      var playerUnSelected = 1;
      playerSelectListController.unSelectPlayer(playerUnSelected);
      // The player shall be retrieved in the list
      for(var key in playerSelectListController.scope.players){
        if(playerUnSelected == key){
          expect(playerSelectListController.scope.players[key].selected).toEqual(false);
        }else{
          expect(playerSelectListController.scope.players[key].selected).toEqual(true);
        }
      }
    });

    it('Select all player shall select them all', function() {
      playerSelectListController.selectAllPlayers();
      // The player shall be retrieved in the list
      for(var key in playerSelectListController.scope.players){
        expect(playerSelectListController.scope.players[key].selected).toEqual(true);
      }
    });

    it('Unselect all player shall select them all', function() {
      // first we select all players
      for(var key in playerSelectListController.scope.players){
        playerSelectListController.scope.players[key].selected = true;
      }
      playerSelectListController.unSelectAllPlayers();
      // The player shall be retrieved in the list
      for( var i=0;i<playerSelectListController.scope.players.size;i++){
          expect(playerSelectListController.scope.players[i].selected).toEqual(false);
      }
    });

    it('Exist at least <selected> shall return false if nobody is selected', function() {
          expect(playerSelectListController.existAtLeast(true)).toEqual(false);
    });

    it('Exist at least <selected> shall return true if at least one is selected', function() {
          playerSelectListController.scope.players[1].selected = true;
          expect(playerSelectListController.existAtLeast(true)).toEqual(true);
    });

    it('Exist at least <!selected> shall return true if nobody is selected', function() {
          expect(playerSelectListController.existAtLeast(false)).toEqual(true);
    });


    it('Exist at least <!selected> shall return false if everybody is selected', function() {
          for(var key in playerSelectListController.scope.players){
            playerSelectListController.scope.players[key].selected = true;
          }
          expect(playerSelectListController.existAtLeast(false)).toEqual(false);
    });


  });



});
