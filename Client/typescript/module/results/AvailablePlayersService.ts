module FifaLeagueClient.Module.Results {
	export class AvailablePlayersService {
		httpService: ng.IHttpService;
        qService: ng.IQService;

        // URL used to reach the API
        apiURL:string;

        static $inject = [
            "$httpService", '$q'
        ];

		constructor($http: ng.IHttpService, config: Common.Config, $q: ng.IQService) {
            this.httpService = $http;
            this.qService = $q;
            this.apiURL = config.backend+"api/AvailablePlayers/";
        }

        public getPlayers() : ng.IPromise<TeamPlayerModel> {
        	var deferred = this.qService.defer();
        	var self = this;

        	this.httpService.get(this.apiURL).success(function (data:[string], status, headers, config) {
                deferred.resolve(self.toTeamPlayerArray(data));
            }).error(function (data, status, headers, config) {
                deferred.reject(config);
            });
            return deferred.promise;
        }

        public getOpponents(id: number): ng.IPromise<TeamPlayerModel> {
            var deferred = this.qService.defer();
            var self = this;

            this.httpService.get(this.apiURL + "/" + id).success(function (data:[string], status, headers, config) {
                deferred.resolve(self.toTeamPlayerArray(data));
            }).error(function (data, status, headers, config) {
                deferred.reject(config);
            });
            return deferred.promise;
        }

        private toTeamPlayerArray(arr: string[]): TeamPlayerModel[] {
            var teamPlayers = [];
            for (var i = 0; i < arr.length; i++){
                teamPlayers.push(new TeamPlayerModel(arr[i]));
            }

            return teamPlayers;
        }
	}

	export var serviceName = 'availablePlayersService';

    resultsModule.factory(serviceName, ['$http', Common.configService, '$q', ($http,config,$q)=>
        new AvailablePlayersService($http,config,$q)
    ]);
}