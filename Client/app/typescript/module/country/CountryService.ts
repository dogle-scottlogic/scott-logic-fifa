// Service used to manipulate a country via web API
module FifaLeagueClient.Module.Country {

    export class CountryService {
        httpService: ng.IHttpService;
        serverURL : string;

        // URL used to reach the country API
        countryApi = "api/Country/";

        static $inject = [
            "$httpService"
        ];

        constructor($http: ng.IHttpService, config: Common.Config) {
            this.httpService = $http;
            this.serverURL = config.backend;
        }

        // Get a country list, execute successCallBack if it is a success and errorCallBack if it is a failure
        public getCountryList(successCallBack, errorCallBack, callbackObj): void {
            var self = this;
            this.httpService.get(this.serverURL+this.countryApi)
                .success(function (data:[string], status, headers, config) {
                    var countryList =  [];
                    for(var i = 0; i<data.length; i++){
                        countryList.push(self.convertDataToCountry(data[i]));
                    }
                    self.callback(successCallBack, callbackObj, [countryList, status, headers, config]);
                })
                .error(function (data, status, headers, config) {
                    self.callback(errorCallBack,callbackObj, [data, status, headers, config]);
                });
        }

        // Get the detail of a country by its ID
        public getCountry(successCallBack, errorCallBack, callbackObj, ID){
            var self = this;
            this.httpService.get(this.serverURL+ this.countryApi + ID).success(function (data, status, headers, config) {
                var country = self.convertDataToCountry(data);
                self.callback(successCallBack, callbackObj, [country, status, headers, config]);
            }).error(function (data, status, headers, config) {
                self.callback(errorCallBack,callbackObj, [data, status, headers, config]);
            });
        }

        // add a country in the database
        public addCountry(successCallBack, errorCallBack, callbackObj, country:CountryModel) {
            var self = this;
            this.httpService.post(this.serverURL+this.countryApi, country).success(function (data, status, headers, config) {
                self.callback(successCallBack, callbackObj, [data, status, headers, config]);
            }).error(function (data, status, headers, config) {
                self.callback(errorCallBack,callbackObj, [data, status, headers, config]);
            });
        }

        // Updating a country with the country informations
        public updateCountry(successCallBack, errorCallBack, callbackObj, country:CountryModel) {
            var self = this;
            this.httpService.put(this.serverURL+ this.countryApi + country.Id, country).success(function (data, status, headers, config) {
                self.callback(successCallBack, callbackObj, [data, status, headers, config]);
            }).error(function (data, status, headers, config) {
                self.callback(errorCallBack,callbackObj, [data, status, headers, config]);
            });
        }

        // Deleting a country by is ID
        public deleteCountry(successCallBack, errorCallBack, callbackObj, Id) {
            var self = this;
            this.httpService.delete(this.serverURL+ this.countryApi + Id).success(function (data, status, headers, config) {
                self.callback(successCallBack, callbackObj, [data, status, headers, config]);
            }).error(function (data, status, headers, config) {
                self.callback(errorCallBack,callbackObj, [data, status, headers, config]);
            });
        }

        // Method in order to do callbacks
        protected callback(callbackMethod, callbackObj, parameters){
            callbackMethod.apply (callbackObj, parameters);
        }

        // Method converting the data into a country
        protected convertDataToCountry = (data): CountryModel => {
            return new CountryModel(data);
        }

    }

    export var countryServiceName = 'countryService';

    countryModule.factory(countryServiceName, ['$http', Common.configService, ($http,config)=>
        new CountryService($http,config)
    ]);
}
