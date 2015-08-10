/// <reference path="AbstractUserController.ts" />
module FifaLeagueClient.Module.User {
	interface IRouteParams extends ng.route.IRouteParamsService {
    		id:number;
 		}

	export class UserEditController extends AbstractUserController {
		UserService: UserService;
		locationService: ng.ILocationService;
		id: number;
		loginService: Login.LoginService;
		userBeforeChange: UserModel;

		static $inject = ["$scope", 'userService', '$location', '$routeParams', 'loginService'];

		constructor(scope, UserService: UserService, location: ng.ILocationService, $routeParams: IRouteParams, loginService: Login.LoginService) {
			super(scope);
			this.UserService = UserService;
			this.locationService = location;
			this.id = $routeParams.id;
			this.loginService = loginService;
			this.loadUser();
		}

		private loadUser = () => {
			var self = this;
			if(self.id != null){
				this.loadingPromise =
					this.UserService.getUser(this.id)
						.then(function(data) {
							self.user = data;
							self.userBeforeChange = self.user;
						}).catch(this.onError);
			}
		}

		protected onError = (config) => {
			this.errors = config.errors;
		}

		protected onUpdateSuccess = () => {
		  // if the userId in session is the same than the modified user  and the password had been changed or the user name
			// we empty the datas in session in order to force the login
			if(this.loginService.getUserIdInSession() == this.user.Id
			&& (this.userBeforeChange.Name != this.user.Name || this.user.Password != null)){
				this.loginService.logout();
				this.locationService.path(Login.loginPath);
			}else{
				this.goBack();
			}
		}

		protected updateUser = () => {
			var self = this;
			self.errors = {};
			if(self.verifyPassword()){
				this.loadingPromise =
					this.UserService.updateUser(this.user)
						.then(this.onUpdateSuccess)
						.catch(this.onError);
			}
		}

    // Go to the userList
    public goBack(){
			this.locationService.path(usersPath);
    }
	}
}
