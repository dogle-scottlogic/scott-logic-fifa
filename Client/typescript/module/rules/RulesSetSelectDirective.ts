module FifaLeagueClient.Module.Rules.Directives {

    rulesModule.directive("rulessetselect", rulesSetSelectDirective);

    interface IMyScope extends ng.IScope {
        vm : RulesSetSelectController;
        selectedrulesset:number;
        required: boolean;
    }

    export function rulesSetSelectDirective(): ng.IDirective {
        return {
            restrict: "E",
            scope: {
                selectedrulesset:'=',
                required:'=',
                'triggerselect':'&onSelect'
            },
            controller: RulesSetSelectController,
            controllerAs: "vm",
            templateUrl: 'views/rules/rules-set-select.html'
        }
    }
}
