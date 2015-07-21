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
            this.apiURL = config.backend+"api/AvailablePlayers";
        }

        public getPlayers() : ng.IPromise<TeamPlayerModel> {
            return this.getFilteredPlayers(null);
        }

				public getFilteredPlayers(matchFilter: MatchFilter) : ng.IPromise<TeamPlayerModel> {
					var deferred = this.qService.defer();
					var self = this;

					// Building the parameters
					var getParams = "";
					var url = this.apiURL;
					if(matchFilter!= null){
							getParams = matchFilter.getParameters(getParams);
							if(getParams!= ""){
									url = url +"?"+ getParams;
							}
					}

					// Getting the datas from the url
					this.httpService.get(url).success(function (data:[string], status, headers, config) {
								deferred.resolve(self.toTeamPlayerArray(data));
						}).error(function (data, status, headers, config) {
								deferred.reject(config);
						});
						return deferred.promise;
				}

				public getOpponents(id: number): ng.IPromise<TeamPlayerModel> {
						return this.getFilteredOpponents(id, null);
				}

        public getFilteredOpponents(id: number, matchFilter: MatchFilter): ng.IPromise<TeamPlayerModel> {
						var deferred = this.qService.defer();
						var self = this;

						// Building the parameters
						var getParams = "";
						var url = this.apiURL + "/" + id;
						if(matchFilter!= null){
								getParams = matchFilter.getParameters(getParams);
								if(getParams!= ""){
										url = url +"?"+ getParams;
								}
						}

            this.httpService.get(url).success(function (data:[string], status, headers, config) {
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
