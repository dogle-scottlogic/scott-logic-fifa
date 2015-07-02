/// <reference path="../../common/controllers/AbstractController.ts" />

module FifaLeagueClient.Module.Country.Controllers {
  export class CountryController extends Common.Controllers.AbstractController {
    scope;
    countries;

    static $inject = ["$scope"];

    constructor(scope){
      super(scope);

      this.countries = [];
    }
  }
}
