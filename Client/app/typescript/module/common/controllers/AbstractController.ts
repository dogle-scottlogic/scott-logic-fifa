module FifaLeagueClient.Module.Common.Controllers {
  export class AbstractController {
    scope;
    errors: {};

      constructor(scope){
        this.scope = scope;
      }
  }
}
