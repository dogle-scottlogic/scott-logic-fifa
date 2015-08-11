describe('The RulesSetController', function() {
    beforeEach(module('rules'));
    beforeEach(module(FifaLeagueClient.Module.Common.devConfig));
    beforeEach(module(FifaLeagueClient.Module.Common.HTTPErrorHandleModuleName));

    var ruleSetController;
    var ruleSetService;
    var locationService;
    var defer;
    var rootScope;

    //Mock the rules set service
    beforeEach(function() {
        module(function($provide) {
            $provide.value('rulesSetService', ruleSetService);
        });

        ruleSetService = jasmine.createSpyObj('ruleSetService', [ 'getRulesSetList' ]);

        // Getting the dependencies
        inject(function($injector) {
            $q = $injector.get('$q');
            defer = $q.defer();
            rootScope = $injector.get('$rootScope');
        });
    });

    // Constructing the controller
    beforeEach(inject(function($controller, $rootScope) {
        scope = $rootScope.$new();

        ruleSetController = $controller(FifaLeagueClient.Module.Rules.RulesSetSelectController, {$scope: scope});

        scope.$digest();
    }));

    describe('when getting the rules set list', function() {

        it('creates a loading promise', function() {
            defer.resolve(createRulesSetList());
            ruleSetService.getRulesSetList.and.returnValue(defer.promise);

            // Simulate team list retrieval
            ruleSetController.getRulesSetList();

            verifyPromiseAndDigest(ruleSetController, defer, rootScope);
        });

        it('succeeds it sets the rules list on the controller', function() {
            defer.resolve(createRulesSetList());
            ruleSetService.getRulesSetList.and.returnValue(defer.promise);

            ruleSetController.getRulesSetList();
            verifyPromiseAndDigest(ruleSetController, defer, rootScope);

            expect(ruleSetController.rulesSets).toEqual(createRulesSetList());
        });

        it('succeeds it sets the selected rule set to be the first returned', function() {
            ruleSetService.getRulesSetList.and.returnValue(defer.promise);

            ruleSetController.getRulesSetList();
            defer.resolve(createRulesSetList());
            verifyPromiseAndDigest(ruleSetController, defer, rootScope);

            expect(scope.selectedrulesset).toEqual(createRulesSetList()[0].Id);
        });

        it('fails it adds the errors to the controller', function() {
            ruleSetService.getRulesSetList.and.returnValue(defer.promise);

            ruleSetController.getRulesSetList();

            defer.reject({errors: createErrors()});
            verifyPromiseAndDigest(ruleSetController, defer, rootScope);

            expect(ruleSetController.errors).toEqual(createErrors());
        });
    });

    //Helper for creating a server error
    function createErrors() {
        return { 
                'Item.Global' : "The server is unreachable"
        };
    }

    //Helper for creating a list of rule sets
    function createRulesSetList() {
        return [
            new FifaLeagueClient.Module.Rules.RulesSetModel({
                Id: 1,
                Name: "Never revisit past conquests",
                LegsPlayedPerOpponent: 1
            }),
            new FifaLeagueClient.Module.Rules.RulesSetModel({
                Id: 2,
                Name: "Always try everything at least twice",
                LegsPlayedPerOpponent: 2
            })
        ];
    }
});