module FifaLeagueClient.Module.HideUnlessAdmin {
  export const moduleName = 'hideUnlessAdmin';

  export var hideUnlessAdminModule = angular.module(moduleName, ['ui.bootstrap', 'cgBusy','ngRoute']);

}
