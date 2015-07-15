describe('Testing the PlayerSelectListDirective', function() {
  var $compile,
      $rootScope,
      selectedplayer;

  // Load the FifaLeagueApp
  beforeEach(module('FifaLeagueApp'));

  // load the template
  beforeEach(module('templates'));

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

  // Store references to $rootScope and $compile
  // so they are available to all tests in this describe block
  beforeEach(inject(function(_$compile_, _$rootScope_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $compile = _$compile_;
    $rootScope = _$rootScope_;
  }));


  describe(' Tests select directive', function(){
    it('Show the selected list', function() {
      // Compile a piece of HTML containing the directive
      var element = $compile("<playerselectlist selectedplayer='selectedplayer'></playerselectlist>")($rootScope);

      $rootScope.$digest();
      verifyPromiseAndFlush(element.isolateScope().vm, $httpBackend);

      // Check that the compiled element contains the templated content
      for(var i=0; i<dataRepository.length;i++){
        if(dataRepository[i].Archived == true){
          expect(element.html()).not.toContain(dataRepository[i].Name);
        }else{
          expect(element.html()).toContain(dataRepository[i].Name);
        }
      }

    });

    it('Pre-selected player', function() {
      var scope = $rootScope.$new();
      scope.players = {};
      var html = angular.element('<playerselectlist players="players"></playerselectlist>');
      var element = $compile(html)(scope);

      $rootScope.$digest();
      verifyPromiseAndFlush(element.isolateScope().vm, $httpBackend);

      expect(element.isolateScope().players).toBe(scope.players);
    });

    it('Selection return scope', function() {
      var scope = $rootScope.$new();
      scope.players = {};
      var html = angular.element('<playerselectlist players="players"></playerselectlist>');
      var element = $compile(html)(scope);

      $rootScope.$digest();
      verifyPromiseAndFlush(element.isolateScope().vm, $httpBackend);

      // We select a player in order to see if it s really selected in return then
      element.isolateScope().players[1].selected = true;
      $rootScope.$digest();

      expect(scope.players).toBe(element.isolateScope().players);

    });

  });

});
