module FifaLeagueClient.Module.Team {

	export class TeamService {
		httpService: ng.IHttpService;
        qService: ng.IQService;
        apiURL:string;
        apiURLWithSlash:string;

        static $inject = [
            '$httpService', '$q'
        ];

        constructor($http: ng.IHttpService, config: Common.Config, $q: ng.IQService) {
            this.httpService = $http;
            this.qService = $q;
            this.apiURL = config.backend+"api/Team";
            this.apiURLWithSlash = this.apiURL+"/";
        }

        // Get a team list, execute successCallBack if it is a success and errorCallBack if it is a failure
        public getTeamList(): ng.IPromise<TeamModel[]> {
            return this.getTeamFilteredList(null);
        }

				// Get a filtered season list, execute successCallBack if it is a success and errorCallBack if it is a failure
				public getTeamFilteredList(teamFilter:TeamFilter): ng.IPromise<TeamModel[]> {
						var deferred = this.qService.defer();
						var getParams = "";
						var url;
						if(teamFilter!= null){
								getParams = teamFilter.getParameters(getParams);
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
                    var teamList =  [];
                    for(var i = 0; i<data.length; i++){
                        teamList.push(self.convertDataToTeam(data[i]));
                    }
                    deferred.resolve(teamList);
                })
                .error(function (data, status, headers, config) {
                    deferred.reject(config);
                });

						return deferred.promise;
				}


        // Get a team by its ID
        public getTeam(ID): ng.IPromise<TeamModel>{
            var deferred = this.qService.defer();
            var self = this;

            this.httpService.get(this.apiURLWithSlash + ID).success(function (data, status, headers, config) {
                var team = self.convertDataToTeam(data);
                deferred.resolve(team);
            }).error(function (data, status, headers, config) {
                deferred.reject(config);
            });
            return deferred.promise;
        }

        // add a team in the database
        public addTeam(team:TeamModel): ng.IPromise<TeamModel>{
            var deferred = this.qService.defer();
            var self = this;

            this.httpService.post(this.apiURLWithSlash, team).success(function (data, status, headers, config) {
                var team = self.convertDataToTeam(data);
                deferred.resolve(team);
            }).error(function (data, status, headers, config) {
                deferred.reject(config);
            });
            return deferred.promise;
        }

        // Updating a team with the team informations
        public updateTeam(team:TeamModel): ng.IPromise<TeamModel> {
            var deferred = this.qService.defer();
            var self = this;

            this.httpService.put(this.apiURLWithSlash + team.Id, team).success(function (data, status, headers, config) {
                var team = self.convertDataToTeam(data);
                deferred.resolve(team);
            }).error(function (data, status, headers, config) {
                deferred.reject(config);
            });
            return deferred.promise;
        }

        // Deleting a team by is ID
        public deleteTeam(Id) : ng.IPromise<boolean> {
            var deferred = this.qService.defer();

            this.httpService.delete(this.apiURLWithSlash + Id).success(function (data, status, headers, config) {
                deferred.resolve(true);
            }).error(function (data, status, headers, config) {
                deferred.reject(config);
            });
            return deferred.promise;
        }

        // Method converting the data into a team
        protected convertDataToTeam = (data): TeamModel => {
            return new TeamModel(data);
        }
	}

	export var serviceName = 'teamService';

    teamModule.factory(serviceName, ['$http', Common.configService, '$q', ($http,config,$q)=>
        new TeamService($http,config,$q)
    ]);
}
