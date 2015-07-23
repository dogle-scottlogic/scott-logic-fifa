// Service used to manipulate a TeamPlayerStatisticView via web API
module FifaLeagueClient.Module.Team {

    export class TeamPlayerStatisticViewService {
        httpService: ng.IHttpService;
        qService: ng.IQService;

        // URL used to reach the teamPlayerStatisticView API
        apiURL:string;

        static $inject = [
            "$httpService", '$q'
        ];

        constructor($http: ng.IHttpService, config: Common.Config, $q: ng.IQService) {
            this.httpService = $http;
            this.qService = $q;
            this.apiURL = config.backend+"api/TeamPlayerStatisticView";
        }

        // Get a teamPlayerStatisticView list, execute successCallBack if it is a success and errorCallBack if it is a failure
        public getTeamPlayerStatisticViewList(idTeamPlayer:number, idSeason:number): ng.IPromise<TeamPlayerStatisticViewModel> {
            var deferred = this.qService.defer();
            var self = this;

            this.httpService.get(this.apiURL+"?idTeamPlayer="+idTeamPlayer+"&idSeason="+idSeason)
                .success(function (data:[string], status, headers, config) {
                    var teamPlayerStatisticView = self.convertDataToTeamPlayerStatisticView(data);
                    deferred.resolve(teamPlayerStatisticView);
                })
                .error(function (data, status, headers, config) {
                    deferred.reject(config);
                });

            return deferred.promise;
        }


        // Method converting the data into a teamPlayerStatisticView
        protected convertDataToTeamPlayerStatisticView = (data): TeamPlayerStatisticViewModel => {
            return new TeamPlayerStatisticViewModel(data);
        }


    }

    export var teamPlayerStatisticViewServiceName = 'teamPlayerStatisticViewService';

    teamModule.factory(teamPlayerStatisticViewServiceName, ['$http', Common.configService, '$q', ($http,config,$q)=>
        new TeamPlayerStatisticViewService($http,config,$q)
    ]);
}
