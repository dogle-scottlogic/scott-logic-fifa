module FifaLeagueClient.Module.Common.Controllers {
  export class AbstractController {
    scope;
    errors: {};
    loadingPromise;
    childList : AbstractListController[];

    constructor(scope){
      this.scope = scope;
      this.childList = [];
    }

    protected resetErrors(){
      this.errors = {};
    }

    public addChild = function(child:AbstractListController){
      this.childList.push(child);
    }


    public refreshChildList = function(){
      if(this.childList != null){
        for(var i=0;i<this.childList.length;i++){
          this.childList[i].loadList();
        }
      }
    }

  }
}
