describe('CountryController', function() {
  beforeEach(module('FifaLeagueApp'));

  var ctrl, scope;

  beforeEach(inject(function($controller, $rootScope) {
      scope = $rootScope.$new();
      ctrl = $controller(FifaLeagueClient.Module.Country.CountryController, {$scope: scope});
  }));

  describe('Initialising', function(){
    it('Should have a countries property', function(){
      expect(ctrl.countries).toBeDefined();
    });
  });
});
