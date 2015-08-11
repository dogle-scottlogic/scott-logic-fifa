/// <reference path="AbstractUserController.ts" />

module FifaLeagueClient.Module.User {
    export class UserAddController extends AbstractUserController {

        user: UserModel;
        mainService : UserService;
        locationService: ng.ILocationService;

        static $inject = ["$scope", 'userService', '$location'];

        constructor(scope, userService : UserService, location: ng.ILocationService){
            super(scope);
            this.mainService = userService;
            this.locationService = location;
        }

        public addUser = ()  => {
            this.resetErrors();
            if(this.verifyPassword()){
                this.loadingPromise =
                this.mainService.add(this.user)
                .then(this.onSaveSuccess)
                .catch(this.onSaveError);
            }
        }

        // Do nothing if the creation is successfull
        protected onSaveSuccess = (data:UserModel) => {
            this.goBack();
        }

        // Method adding creating errors in creatingErrors list
        protected onSaveError = (config) => {
            this.errors = config.errors;
        }

        // Go to the userList
        public goBack(){
            this.locationService.path(usersPath);
        }

    }

}
