module FifaLeagueClient.Module.HideUnlessLoggedIn {
  export const moduleName = 'hideUnlessLoggedIn';

  export var hideUnlessLoggedInModule = angular.module(moduleName, ['ui.bootstrap', 'cgBusy','ngRoute']);

}
