// Service used to manipulate a league via web API
module FifaLeagueClient.Module.League {

    export class LeagueService {
        httpService: ng.IHttpService;
        qService: ng.IQService;

        // URL used to reach the league API
        apiURL:string;
        apiURLWithSlash:string;

        static $inject = [
            "$httpService", '$q'
        ];

        constructor($http: ng.IHttpService, config: Common.Config, $q: ng.IQService) {
            this.httpService = $http;
            this.qService = $q;
            this.apiURL = config.backend+"api/League";
            this.apiURLWithSlash = this.apiURL+"/";
        }

        // Get a league list, execute successCallBack if it is a success and errorCallBack if it is a failure
        public getLeagueList(): ng.IPromise<LeagueModel[]> {
            return this.getLeagueFilteredList(null);
        }

      // Get a filtered league list, execute successCallBack if it is a success and errorCallBack if it is a failure
      public getLeagueFilteredList(leagueFilter:LeagueFilter): ng.IPromise<LeagueModel[]> {
          var deferred = this.qService.defer();
          var getParams = "";
          var url;
          if(leagueFilter!= null){
              getParams = leagueFilter.getParameters(getParams);
              if(getParams!= ""){
                  url = this.apiURL +"?"+ getParams;
              }else{
                url = this.apiURLWithSlash;
              }
          }else{
            url = this.apiURLWithSlash;
          }

          var self = this;
          this.httpService.get(url)
              .success(function (data:[string], status, headers, config) {
                  var leagueList =  [];
                  for(var i = 0; i<data.length; i++){
                      leagueList.push(self.convertDataToLeague(data[i]));
                  }
                  deferred.resolve(leagueList);
              })
              .error(function (data, status, headers, config) {
                  deferred.reject(config);
              });

          return deferred.promise;
      }

        // Method converting the data into a league
        protected convertDataToLeague = (data): LeagueModel => {
            return new LeagueModel(data);
        }

    }

    export var leagueServiceName = 'leagueService';

    leagueModule.factory(leagueServiceName, ['$http', Common.configService, '$q', ($http,config,$q)=>
        new LeagueService($http,config,$q)
    ]);
}
