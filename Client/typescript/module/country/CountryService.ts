// Service used to manipulate a country via web API
module FifaLeagueClient.Module.Country {

    export class CountryService {
        httpService: ng.IHttpService;
        qService: ng.IQService;

        // URL used to reach the country API
        apiURL:string;

        static $inject = [
            "$httpService", '$q'
        ];

        constructor($http: ng.IHttpService, config: Common.Config, $q: ng.IQService) {
            this.httpService = $http;
            this.qService = $q;
            this.apiURL = config.backend+"api/Country/";
        }

        // Get a country list, execute successCallBack if it is a success and errorCallBack if it is a failure
        public getCountryList(): ng.IPromise<CountryModel[]> {
            var deferred = this.qService.defer();

            var self = this;
            this.httpService.get(this.apiURL)
                .success(function (data:[string], status, headers, config) {
                    var countryList =  [];
                    for(var i = 0; i<data.length; i++){
                        countryList.push(self.convertDataToCountry(data[i]));
                    }
                    deferred.resolve(countryList);
                })
                .error(function (data, status, headers, config) {
                    deferred.reject(config);
                });

            return deferred.promise;
        }

        // Get the detail of a country by its ID
        public getCountry(ID): ng.IPromise<CountryModel>{
            var deferred = this.qService.defer();
            var self = this;
            this.httpService.get(this.apiURL + ID).success(function (data, status, headers, config) {
                var country = self.convertDataToCountry(data);
                deferred.resolve(country);
            }).error(function (data, status, headers, config) {
                deferred.reject(config);
            });
            return deferred.promise;
        }

        // add a country in the database
        public addCountry(country:CountryModel): ng.IPromise<CountryModel>{
            var deferred = this.qService.defer();
            var self = this;

            this.httpService.post(this.apiURL, country).success(function (data, status, headers, config) {
                var country = self.convertDataToCountry(data);
                deferred.resolve(country);
            }).error(function (data, status, headers, config) {
                deferred.reject(config);
            });
            return deferred.promise;
        }

        // Updating a country with the country informations
        public updateCountry(country:CountryModel): ng.IPromise<CountryModel> {
            var deferred = this.qService.defer();
            var self = this;
            this.httpService.put(this.apiURL + country.Id, country).success(function (data, status, headers, config) {
                var country = self.convertDataToCountry(data);
                deferred.resolve(country);
            }).error(function (data, status, headers, config) {
                deferred.reject(config);
            });
            return deferred.promise;
        }

        // Deleting a country by is ID
        public deleteCountry(Id) : ng.IPromise<boolean> {
            var deferred = this.qService.defer();
            var self = this;
            this.httpService.delete(this.apiURL + Id).success(function (data, status, headers, config) {
                deferred.resolve(true);
            }).error(function (data, status, headers, config) {
                deferred.reject(config);
            });
            return deferred.promise;
        }

        // Method converting the data into a country
        protected convertDataToCountry = (data): CountryModel => {
            return new CountryModel(data);
        }

    }

    export var countryServiceName = 'countryService';

    countryModule.factory(countryServiceName, ['$http', Common.configService, '$q', ($http,config,$q)=>
        new CountryService($http,config,$q)
    ]);
}
