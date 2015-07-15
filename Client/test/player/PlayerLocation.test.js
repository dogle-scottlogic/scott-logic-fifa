describe('Testing the player locations', function() {
  beforeEach(module('FifaLeagueApp'));
  // load the template
  beforeEach(module('templates'));

  var playerService = {};
  var location, rootScope, compile;
  var route;
  var defer;

  // Mocking the player service
  beforeEach(function() {

    module(function($provide) {
        // Fake seasonService Implementation returning a promise
        $provide.value('playerService', playerService);
      });
      // defining the method getPlayerList for the service used by the controller
      playerService.getPlayerList = function(){
      }

      playerService.getPlayer = function(id){
      }

  });

    // getting all we need for the tests
  beforeEach(inject(function ($location, $rootScope, $route, $compile, $q) {

    location = $location;
    rootScope = $rootScope;
    route= $route;
    compile=$compile;
    defer = $q.defer();
  }));


  describe('Testing the player location : ', function(){

    it('Location /players shall link to views/player/players.html and FifaLeagueClient.Module.Player.PlayerListController', function() {

      // moving to the location /players
      location.path('/players');
      rootScope.$apply();
      rootScope.$digest();

      // Verifying the definition of the URL /players
      expect(location.path()).toBe('/players');
      expect(route.current.controller).toBe(FifaLeagueClient.Module.Player.PlayerListController);
      expect(route.current.templateUrl).toEqual('views/player/players.html');
    });

    it('Location /players shall call playerService.getPlayerList() in order to init the list', function() {

      // Spying the playerService for the method getPlayerList which will return a promise
      spyOn(playerService, 'getPlayerList').and.returnValue(defer.promise);
      // Creating a fake view in order to have then the location diplayed in this
      var html = angular.element('<ng-view></ng-view>');
      var element = compile(html)(rootScope.$new());

      // moving to the location /players
      location.path('/players');
      rootScope.$apply();
      rootScope.$digest();

      // Verfiying that on init the getPlayerList of the service is called
      expect(playerService.getPlayerList).toHaveBeenCalled();
    });

    it('Location /players/add shall link to views/player/player-add.html and FifaLeagueClient.Module.Player.PlayerAddController', function() {

      // moving to the location /players
      location.path('/players/add');
      rootScope.$apply();
      rootScope.$digest();

      // Verifying the definition of the URL /players
      expect(location.path()).toBe('/players/add');
      expect(route.current.controller).toBe(FifaLeagueClient.Module.Player.PlayerAddController);
      expect(route.current.templateUrl).toEqual('views/player/player-add.html');
    });


    it('Location /players/edit/1 shall link to views/player/player-edit.html and FifaLeagueClient.Module.Player.PlayerEditController', function() {

      // moving to the location /players
      location.path('/players/edit/1');
      rootScope.$apply();
      rootScope.$digest();

      // Verifying the definition of the URL /players
      expect(location.path()).toBe('/players/edit/1');
      expect(route.current.controller).toBe(FifaLeagueClient.Module.Player.PlayerEditController);
      expect(route.current.templateUrl).toEqual('views/player/player-edit.html');
    });

    it('Location /players/edit/1 shall call playerService.getPlayer() in order to init the player', function() {

      // Spying the playerService for the method getPlayerList which will return a promise
      spyOn(playerService, 'getPlayer').and.returnValue(defer.promise);
      // Creating a fake view in order to have then the location diplayed in this
      var html = angular.element('<ng-view></ng-view>');
      var element = compile(html)(rootScope.$new());

      // moving to the location /players
      location.path('/players/edit/1');
      rootScope.$apply();
      rootScope.$digest();

      // Verfiying that on init the getPlayerList of the service is called
      expect(playerService.getPlayer).toHaveBeenCalledWith('1');
    });

  });


});
