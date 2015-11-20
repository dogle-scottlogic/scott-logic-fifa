module FifaLeagueClient.Module.Results {

    export class MatchModalLinkDirectiveController extends Common.Controllers.AbstractController {

        scope;
        modal;
        matchService

        static $inject = [
            "$scope", '$modal', 'matchService'
        ];

        constructor(scope, $modal, matchService) {
            super(scope);
            this.scope = scope;
            this.modal = $modal;
            this.matchService = matchService;
        }

        public openMatchEdit = () => {
            this.openModalUpdate(this.scope, this.modal, this.callbackupdate, this, this.scope.id);
        }

        public openModalUpdate (scope, modal, callBackParam, callbackObj, Id) {
            var self = this;

            var modalInstance = modal.open({
                animation: scope.animationsEnabled,
                templateUrl: 'views/results/match-edit.html',
                controller: MatchModalEditController,
                controllerAs: 'vm',
                size: 800,
                resolve: {
                    Id: function () {
                        return Id;
                    }
                }
            });

            modalInstance.result.then(function () {
                self.callbackupdate();
            });
        }

        public deleteMatch = () => {
            var self = this;
            self.loadingPromise =
            self.matchService.deleteMatch(this.scope.id)
                .then(self.callbackupdate)
                .catch(self.onError);
        }

        protected onError = (config) => {
            this.scope.errors = config.errors;
        }

        public callbackupdate = () => {
            if(this.scope.callbackupdate){
                this.scope.callbackupdate();
            }
        }

    }

}
