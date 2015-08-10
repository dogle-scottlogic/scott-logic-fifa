module FifaLeagueClient.Module.User {
  export const moduleName = 'user';

  export var userModule = angular.module(moduleName, ['ui.bootstrap', 'cgBusy','ngRoute', Login.moduleName]);

  export const usersPath = '/users';
  export const usersAddPath = usersPath+'/add';
  export const usersEditPath = usersPath+'/edit/:id';

  userModule.config(["$routeProvider",
  function routes($routeProvider: ng.route.IRouteProvider){

      $routeProvider
        .when(usersPath, {
          templateUrl: 'views/user/users.html',
          controller: UserListController,
          controllerAs: 'vm'
        })
        .when(usersAddPath, {
            templateUrl: 'views/user/user-add.html',
            controller: UserAddController,
            controllerAs: 'vm'
          })
        .when(usersEditPath, {
            templateUrl: 'views/user/user-edit.html',
            controller: UserEditController,
            controllerAs: 'vm'
        });

    }]);
}
