/// <reference path="../typings/tsd.d.ts"/>
/// <reference path="module/common/services/AbstractFilter.ts" />
/// <reference path="module/common/services/Config.ts" />
/// <reference path="module/common/services/HTTPErrorInterceptorService.ts" />
/// <reference path="module/rules/RulesModule.ts" />
/// <reference path="module/country/CountryModule.ts" />
/// <reference path="module/player/PlayerModule.ts" />
/// <reference path="module/season/SeasonModule.ts" />
/// <reference path="module/team/TeamModule.ts" />
/// <reference path="module/league/LeagueModule.ts" />
/// <reference path="module/results/ResultsModule.ts" />
/// <reference path="module/dashboard/DashboardModule.ts" />
/// <reference path="module/seasonTableView/SeasonTableViewModule.ts" />
/// <reference path="module/login/LoginModule.ts" />
/// <reference path="module/user/UserModule.ts" />
/// <reference path="module/hideUnlessAdmin/HideUnlessAdminModule.ts" />
/// <reference path="module/hideUnlessLoggedIn/HideUnlessLoggedInModule.ts" />
/// <reference path="module/navBar/NavBarModule.ts" />
/// <reference path="module/info/InfoModule.ts" />


module FifaLeagueClient {
    export var mainModule = angular.module("FifaLeagueApp", ['ngRoute',
        Module.Common.HTTPErrorHandleModuleName, Module.Common.devConfig, , Module.NavBar.moduleName,
        Module.Player.moduleName, Module.Country.moduleName, Module.Season.moduleName,
        Module.Team.moduleName, Module.League.moduleName, Module.Results.moduleName,
        Module.Dashboard.moduleName, Module.SeasonTableView.moduleName, Module.Login.moduleName,
        Module.User.moduleName, Module.Rules.moduleName, Module.HideUnlessAdmin.moduleName,
        Module.HideUnlessLoggedIn.moduleName, Module.Info.moduleName
    ]).config(["$routeProvider",
    function routes($routeProvider: ng.route.IRouteProvider){
      $routeProvider.when('/teams', {
            templateUrl: 'views/team/teams.html',
            controller: Module.Team.TeamController,
            controllerAs: 'vm'
          }).when('/teams/add', {
            templateUrl: 'views/team/add-team.html',
            controller: Module.Team.AddTeamController,
            controllerAs: 'vm'
          }).when('/teams/edit/:id', {
            templateUrl: 'views/team/edit-team.html',
            controller: Module.Team.EditTeamController,
            controllerAs: 'vm'
          }).when('/add-result', {
              templateUrl: 'views/results/add-result.html',
              controller: Module.Results.AddResultController,
              controllerAs: 'vm'
          }).when('/leaguewizard', {
            template: '<leaguewizard></leaguewizard>'
          });
    }]);

    // Adding the default template for the busy message (helps for the karma unit tests)
     angular.module('FifaLeagueApp').value('cgBusyDefaults',{
           templateUrl:'views/partials/busy-template.html'
       });

}
