// Service used to manipulate a user via web API
module FifaLeagueClient.Module.User {

    export class UserService {
        httpService: ng.IHttpService;
        qService: ng.IQService;

        // URL used to reach the user API
        apiURL:string;
        apiURLWithSlash:string;

        static $inject = [
            "$httpService", '$q'
        ];

        constructor($http: ng.IHttpService, config: Common.Config, $q: ng.IQService) {
            this.httpService = $http;
            this.qService = $q;
            this.apiURL = config.backend+"api/User";
            this.apiURLWithSlash = this.apiURL+"/";
        }

        // Get a user list, execute successCallBack if it is a success and errorCallBack if it is a failure
        public getUserList(): ng.IPromise<UserModel[]> {
            return this.getUserFilteredList(null);
        }

      // Get a filtered user list, execute successCallBack if it is a success and errorCallBack if it is a failure
      public getUserFilteredList(userFilter:UserFilter): ng.IPromise<UserModel[]> {
          var deferred = this.qService.defer();
          var getParams = "";
          var url;
          if(userFilter!= null){
              getParams = userFilter.getParameters(getParams);
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
                  var userList =  [];
                  for(var i = 0; i<data.length; i++){
                      userList.push(self.convertDataToUser(data[i]));
                  }
                  deferred.resolve(userList);
              })
              .error(function (data, status, headers, config) {
                  deferred.reject(config);
              });

          return deferred.promise;
      }

        // Get the detail of a user by its ID
        public getUser(ID): ng.IPromise<UserModel>{
            var deferred = this.qService.defer();
            var self = this;
            this.httpService.get(this.apiURLWithSlash + ID).success(function (data, status, headers, config) {
                var user = self.convertDataToUser(data);
                deferred.resolve(user);
            }).error(function (data, status, headers, config) {
                deferred.reject(config);
            });
            return deferred.promise;
        }

        // add a user in the database
        public addUser(user:UserModel): ng.IPromise<UserModel>{
            var deferred = this.qService.defer();
            var self = this;

            this.httpService.post(this.apiURLWithSlash, user).success(function (data, status, headers, config) {
                var user = self.convertDataToUser(data);
                deferred.resolve(user);
            }).error(function (data, status, headers, config) {
                deferred.reject(config);
            });
            return deferred.promise;
        }

        // Updating a user with the user information
        public updateUser(user:UserModel): ng.IPromise<UserModel> {
            var deferred = this.qService.defer();
            var self = this;
            this.httpService.put(this.apiURLWithSlash + user.Id, user).success(function (data, status, headers, config) {
                var user = self.convertDataToUser(data);
                deferred.resolve(user);
            }).error(function (data, status, headers, config) {
                deferred.reject(config);
            });
            return deferred.promise;
        }

        // Deleting a user by is ID
        public deleteUser(Id) : ng.IPromise<boolean> {
            var deferred = this.qService.defer();
            var self = this;
            this.httpService.delete(this.apiURLWithSlash + Id).success(function (data, status, headers, config) {
                deferred.resolve(true);
            }).error(function (data, status, headers, config) {
                deferred.reject(config);
            });
            return deferred.promise;
        }

        // Method converting the data into a user
        protected convertDataToUser = (data): UserModel => {
            return new UserModel(data);
        }

    }

    export var userServiceName = 'userService';

    userModule.factory(userServiceName, ['$http', Common.configService, '$q', ($http,config,$q)=>
        new UserService($http,config,$q)
    ]);
}
