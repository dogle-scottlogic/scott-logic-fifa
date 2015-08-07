/// <reference path="AbstractUserController.ts" />
module FifaLeagueClient.Module.User {
	interface IRouteParams extends ng.route.IRouteParamsService {
    		id:number;
 		}

	export class UserEditController extends AbstractUserController {
		UserService: UserService;
		locationService: ng.ILocationService;
		id: number;

		static $inject = ["$scope", 'userService', '$location', '$routeParams'];

		constructor(scope, UserService: UserService, location: ng.ILocationService, $routeParams: IRouteParams) {
			super(scope);
			this.UserService = UserService;
			this.locationService = location;
			this.id = $routeParams.id;
			this.loadUser();
		}

		private loadUser = () => {
			var self = this;
			if(self.id != null){
				this.loadingPromise =
					this.UserService.getUser(this.id)
						.then(function(data) {
							self.user = data;
						}).catch(this.onError);
			}
		}

		protected onError = (config) => {
			this.errors = config.errors;
		}

		protected onUpdateSuccess = () => {
			this.goBack();
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
