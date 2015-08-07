/// <reference path="../../common/controllers/AbstractController.ts" />

module FifaLeagueClient.Module.User {
	export class UserListController extends Common.Controllers.AbstractController {

		userService: UserService;
		users: UserModel[];

		static $inject = ["$scope", 'userService', '$location'];

		constructor(scope, userService : UserService, location: ng.ILocationService){
			super(scope);
			this.userService = userService;
			this.users = [];
		}

		public getUserList = () =>{
			this.errors = {};
			this.loadingPromise =
				this.userService.getUserList()
					.then(this.onGetUsersSuccess)
					.catch(this.onError);
		}

		protected onGetUsersSuccess = (users: UserModel[]) => {
			this.users = users;
		}

		protected onError = (config) => {
			this.errors = config.errors;
		}

		public deleteUser = (id: number) => {
			this.loadingPromise =
				this.userService.deleteUser(id)
					.then(this.onDeleteSuccess)
					.catch(this.onError);
		}

		protected onDeleteSuccess = () => {
			this.getUserList();
		}
	}
}
