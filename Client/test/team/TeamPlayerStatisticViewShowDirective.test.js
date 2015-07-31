describe('Testing the TeamPlayerStatisticViewShowDirective', function() {
  var $compile,
      $rootScope,
      selectedseason;

  // Load the FifaLeagueApp
  beforeEach(module('FifaLeagueApp'));
  beforeEach(module('team'));

  // load the template
  beforeEach(module('templates'));
  beforeEach(module('cgBusy'));

  var $httpBackend;
  var dataRepository;
  var $http;

  // Mocking the season service
  beforeEach(function() {

    dataRepository = teamPlayerStatisticView_buildDataRepository();

    // Mocking the datas
    inject(function($injector) {

      config = $injector.get(FifaLeagueClient.Module.Common.configService);
      $httpBackend = $injector.get('$httpBackend');
      $q = $injector.get('$q');
      $http = $injector.get('$http');

      teamPlayerStatisticView_mockHTTPBackend(config, $httpBackend, $q, dataRepository);
    });

  });

  // Store references to $rootScope and $compile
  // so they are available to all tests in this describe block
  beforeEach(inject(function(_$compile_, _$rootScope_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $compile = _$compile_;
    $rootScope = _$rootScope_;
  }));


  describe(' Tests show directive', function(){
    it('Show at false shouldn t load the teamPlayerStatistic', function() {
        var scope = $rootScope.$new();
        scope.seasonid = 1;
        scope.teamplayerid = 1;
        scope.show = null;
        var html = angular.element('<teamplayerstatisticviewshow seasonid="seasonid" teamplayerid="teamplayerid" show="show"></teamplayerstatisticviewshow>');
        var element = $compile(html)(scope);

        $rootScope.$digest();

        expect($http.pendingRequests.length).toEqual(0);
    });

    it('Show at tru should load the teamPlayerStatistic', function() {
        var scope = $rootScope.$new();
        scope.seasonid = 1;
        scope.teamplayerid = 1;
        scope.show = null;
        var html = angular.element('<teamplayerstatisticviewshow seasonid="seasonid" teamplayerid="teamplayerid" show="show"></teamplayerstatisticviewshow>');
        var element = $compile(html)(scope);

        $rootScope.$digest();

        expect($http.pendingRequests.length).toEqual(0);

        scope.show = true;

        $rootScope.$digest();
        verifyPromiseAndFlush(element.isolateScope().vm, $httpBackend);
          expect(element.html()).toContain(getTeamPlayerStat(dataRepository,scope.teamplayerid, scope.seasonid).nbAverageGoals);
    });

  });


});
