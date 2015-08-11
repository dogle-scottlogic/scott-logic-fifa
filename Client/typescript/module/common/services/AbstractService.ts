module FifaLeagueClient.Module.Common.Services {

    export class AbstractService<TObject, TKey> {

        httpService: ng.IHttpService;
        qService: ng.IQService;

        // URL used to reach the user API
        apiURL:string;
        apiURLWithSlash:string;

        constructor($http: ng.IHttpService, config: Common.Config, $q: ng.IQService, relativeUrl: string) {
            this.httpService = $http;
            this.qService = $q;
            this.apiURL = config.backend+relativeUrl;
            this.apiURLWithSlash = this.apiURL+"/";
        }

        // Get a list, execute successCallBack if it is a success and errorCallBack if it is a failure
        public getList(): ng.IPromise<TObject[]> {
            return this.getFilteredList(null);
        }

        // Get a filtered user list, execute successCallBack if it is a success and errorCallBack if it is a failure
        public getFilteredList(filter:AbstractFilter): ng.IPromise<TObject[]> {
            var deferred = this.qService.defer();
            var getParams = "";
            var url;
            if(filter!= null){
                getParams = filter.getParameters(getParams);
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
                var returnedList =  [];
                for(var i = 0; i<data.length; i++){
                    returnedList.push(self.convertDataToTObject(data[i]));
                }
                deferred.resolve(returnedList);
            })
            .error(function (data, status, headers, config) {
                deferred.reject(config);
            });

            return deferred.promise;
        }

        // Get the detail by its ID
        public get(Id:TKey): ng.IPromise<TObject>{
            var deferred = this.qService.defer();
            var self = this;
            this.httpService.get(this.apiURLWithSlash + Id).success(function (data, status, headers, config) {
                var user = self.convertDataToTObject(data);
                deferred.resolve(user);
            }).error(function (data, status, headers, config) {
                deferred.reject(config);
            });
            return deferred.promise;
        }

        // add a user in the database
        public add(item:TObject): ng.IPromise<TObject>{
            var deferred = this.qService.defer();
            var self = this;

            this.httpService.post(this.apiURLWithSlash, item).success(function (data, status, headers, config) {
                var user = self.convertDataToTObject(data);
                deferred.resolve(user);
            }).error(function (data, status, headers, config) {
                deferred.reject(config);
            });
            return deferred.promise;
        }

        // Updating with the user information
        public update(Id:TKey, item:TObject): ng.IPromise<TObject> {
            var deferred = this.qService.defer();
            var self = this;
            this.httpService.put(this.apiURLWithSlash + Id, item).success(function (data, status, headers, config) {
                var user = self.convertDataToTObject(data);
                deferred.resolve(user);
            }).error(function (data, status, headers, config) {
                deferred.reject(config);
            });
            return deferred.promise;
        }

        // Deleting a user by is ID
        public delete(Id:TKey) : ng.IPromise<boolean> {
            var deferred = this.qService.defer();
            var self = this;
            this.httpService.delete(this.apiURLWithSlash + Id).success(function (data, status, headers, config) {
                deferred.resolve(true);
            }).error(function (data, status, headers, config) {
                deferred.reject(config);
            });
            return deferred.promise;
        }

        // Method converting the data into an object (To OVERRIDE !)
        protected convertDataToTObject(data): TObject{
            alert("YOU SHOULD OVERRIDE THIS METHOD !!!");
            return null;
        }

    }
}
