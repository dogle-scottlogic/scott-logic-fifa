module FifaLeagueClient.Module.Common {
    export class HTTPErrorInterceptorService {

        qService: ng.IQService;

        constructor($q: ng.IQService) {
            this.qService = $q;
        }

        // Handle Request error
        public requestError = (rejection) => {
            return this.qService.reject(rejection);
        }

        // Handle response error
        public responseError = (rejection) => {

            var propertyErrors  = {};

            var errorList = [];
            // handling the no response status
            if(rejection.status == 0){
                errorList.push("The server is unreachable");
                propertyErrors["item.Global"] = errorList;
            }else if(rejection.statusMessage != undefined){
                errorList.push(rejection.status+" : "+rejection.statusMessage);
                propertyErrors["item.Global"] = errorList;
            }
            else if(rejection.statusText != null) {
                errorList.push(rejection.status+" : "+rejection.statusText);
                propertyErrors["item.Global"] = errorList;
            }

            if(rejection.data != null){
                this.parsePropertyErrors(rejection.data, propertyErrors);
            }

            // returning the errors in config
            rejection.config.errors = propertyErrors;

            return this.qService.reject(rejection);
        }


        //separate method for parsing errors into a single flat array
        protected parsePropertyErrors = (response, errors) => {

            if(response != null ){

                if(response.ModelState != null){
                    for (var key in response.ModelState) {
                        var errorList = [];
                        for (var i = 0; i < response.ModelState[key].length; i++) {
                            // for each error, we then push the message
                            // we throw away duplicates key
                            if (errorList.indexOf(response.ModelState[key][i]) == -1) {
                                errorList.push(response.ModelState[key][i]);
                            }
                        }
                        errors[key] = errorList;
                    }
                }
            }

        }

    }


    /**
     * Module with HTTPErrorHandle : Used to parse errors from .net webApi
     */
    export const HTTPErrorHandleModuleName = 'HTTPErrorHanleModule';

    /**
     * Module with HTTPErrorHandle
     */
   angular.module(HTTPErrorHandleModuleName,[])
       .service('HTTPErrorInterceptorService', ['$q', function initService($q){
        return new HTTPErrorInterceptorService($q);
    }])
        .config([
        '$httpProvider',
        ($httpProvider) => $httpProvider.interceptors.push('HTTPErrorInterceptorService')
    ])
}
