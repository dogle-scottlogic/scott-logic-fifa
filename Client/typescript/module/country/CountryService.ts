// Service used to manipulate a country via web API
module FifaLeagueClient.Module.Country {

    export class CountryService {
        httpService: ng.IHttpService;
        qService: ng.IQService;

        // URL used to reach the country API
        apiURL:string;
        apiURLWithSlash:string;

        static $inject = [
            "$httpService", '$q'
        ];

        constructor($http: ng.IHttpService, config: Common.Config, $q: ng.IQService) {
            this.httpService = $http;
            this.qService = $q;
            this.apiURL = config.backend+"api/Country";
            this.apiURLWithSlash = this.apiURL+"/";
        }

        // Get a country list, execute successCallBack if it is a success and errorCallBack if it is a failure
        public getCountryList(): ng.IPromise<CountryModel[]> {
            return this.getCountryFilteredList(null);
        }

        // Get a filtered country list, execute successCallBack if it is a success and errorCallBack if it is a failure
        public getCountryFilteredList(countryFilter:CountryFilter): ng.IPromise<CountryModel[]> {
            var deferred = this.qService.defer();
            var getParams = "";
            var url;
            if(countryFilter!= null){
                getParams = countryFilter.getParameters(getParams);
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
            this.httpService.get(this.apiURLWithSlash + ID).success(function (data, status, headers, config) {
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

            this.httpService.post(this.apiURLWithSlash, country).success(function (data, status, headers, config) {
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
            this.httpService.put(this.apiURLWithSlash + country.Id, country).success(function (data, status, headers, config) {
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
            this.httpService.delete(this.apiURLWithSlash + Id).success(function (data, status, headers, config) {
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
