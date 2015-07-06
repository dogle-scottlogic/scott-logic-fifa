module FifaLeagueClient.Module.Common.Controllers {
  export class AbstractController {
    scope;
    errors: {};
    loadingPromise;

      constructor(scope){
        this.scope = scope;
      }

      protected resetErrors(){
        this.errors = {};
      }
  }
}
