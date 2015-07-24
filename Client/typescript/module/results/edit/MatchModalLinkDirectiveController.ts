module FifaLeagueClient.Module.Results {

    export class MatchModalLinkDirectiveControleur{

        scope;
        modal;

        static $inject = [
            "$scope", '$modal'
        ];

        constructor(scope, $modal) {
            this.scope = scope;
            this.modal = $modal;
        }

        public openMatchEdit = () => {
            this.openModalUpdate(this.scope, this.modal, this.callbackupdate, this, this.scope.id);
        }

        public openModalUpdate (scope, modal, callBackParam, callbackObj, id) {
            var self = this;

            var modalInstance = modal.open({
                animation: scope.animationsEnabled,
                templateUrl: 'views/results/match-edit.html',
                controller: MatchModalEditController,
                controllerAs: 'vm',
                size: 800,
                resolve: {
                    id: function () {
                        return id;
                    }
                }
            });

            modalInstance.result.then(function () {
                self.callbackupdate();
            });
        }

        public callbackupdate = () => {
            if(this.scope.callbackupdate){
                this.scope.callbackupdate();
            }
        }

    }

}
