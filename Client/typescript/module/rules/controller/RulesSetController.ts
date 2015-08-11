/// <reference path="../../common/controllers/AbstractController.ts" />

module FifaLeagueClient.Module.Rules {
    export class RulesSetSelectController extends Common.Controllers.AbstractController{

        rulesSetService: RulesSetService;
        rulesSets: RulesSetModel[];

        static $inject = ["$scope", 'rulesSetService'];

        constructor(scope, rulesSetService : RulesSetService){
            super(scope);
            this.rulesSetService = rulesSetService;
            this.rulesSets = [];
        }

        public getRulesSetList = () =>{
            this.errors = {};

            this.loadingPromise =
                this.rulesSetService.getRulesSetList()
                    .then(this.onGetLoadSuccess)
                    .catch(this.onError);
        }

        protected onGetLoadSuccess = (rulesSets: RulesSetModel[]) => {
            this.rulesSets = rulesSets;
            // Automatically select the top value
            if(this.rulesSets.length > 0){
                    this.scope.selectedrulesset = this.rulesSets[0].Id;
            }
        }

        protected onError = (config) => {
            this.errors = config.errors;
        }

        // Selecting a rules set
        public select(){
          this.scope.triggerselect({rulesSet : this.scope.selectedrulesset});
        }
    }
}
