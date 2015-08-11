module FifaLeagueClient.Module.Common.Services {

    export class AbstractService<TObject, TKey> {

        httpService: ng.IHttpService;
        qService: ng.IQService;

        // URL used to reach the TObject API
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

        // Get a filtered TObject list, execute successCallBack if it is a success and errorCallBack if it is a failure
        public getFilteredList(filter:AbstractFilter): ng.IPromise<TObject[]> {
            var deferred = this.qService.defer();
            var url;
            if(filter!= null){
                url = filter.buildApiUrl(this.apiURL, "");
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
                var returnedObject = self.convertDataToTObject(data);
                deferred.resolve(returnedObject);
            }).error(function (data, status, headers, config) {
                deferred.reject(config);
            });
            return deferred.promise;
        }

        // add a TObject in the database
        public add(TObject:TObject): ng.IPromise<TObject>{
            var deferred = this.qService.defer();
            var self = this;

            this.httpService.post(this.apiURLWithSlash, TObject).success(function (data, status, headers, config) {
                var returnedObject = self.convertDataToTObject(data);
                deferred.resolve(returnedObject);
            }).error(function (data, status, headers, config) {
                deferred.reject(config);
            });
            return deferred.promise;
        }

        // Updating with the TObject information
        public update(Id:TKey, TObject:TObject): ng.IPromise<TObject> {
            var deferred = this.qService.defer();
            var self = this;
            this.httpService.put(this.apiURLWithSlash + Id, TObject).success(function (data, status, headers, config) {
                var returnedObject = self.convertDataToTObject(data);
                deferred.resolve(returnedObject);
            }).error(function (data, status, headers, config) {
                deferred.reject(config);
            });
            return deferred.promise;
        }

        // Deleting a TObject by is ID
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
