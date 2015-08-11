/// <reference path="../../common/controllers/AbstractController.ts" />

module FifaLeagueClient.Module.User {
    export class AbstractUserController extends Common.Controllers.AbstractController {

        user: UserModel;

        static $inject = ["$scope", 'userService', '$location'];

        constructor(scope){
            super(scope);
            this.user = new UserModel(null);
        }


        // the Password and ConfirmPassword shall be identic
        protected verifyPassword():boolean{
            if(this.user.Password != null && this.user.Password !== this.user.ConfirmPassword){
                this.errors["item.Password"] = ["The password confirmation is not the same than the password"];
                return false;
            }
            return true;
        }

    }

}
