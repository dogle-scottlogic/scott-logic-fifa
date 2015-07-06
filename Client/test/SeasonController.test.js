describe('SeasonController', function() {
  beforeEach(module('FifaLeagueApp'));

  var ctrl, scope;

  beforeEach(inject(function($controller, $rootScope) {
      scope = $rootScope.$new();
      ctrl = $controller(FifaLeagueClient.Module.Season.SeasonController, {$scope: scope});
  }));

  describe('Initialising', function(){
    it('Should have a seaons property', function(){
      expect(ctrl.seasons).toBeDefined();
    });

    it('Should have a seaon property', function(){
      expect(ctrl.season).toBeDefined();
    });
  });


});
