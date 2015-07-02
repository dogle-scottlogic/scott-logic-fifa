module FifaLeagueClient.Module.Common {

    /**
     * Interface of configuration settings.
     */
    export interface Config{
        backend:string
    }

    /**
     * String constant to refer to the config service.
     * @type {string}
     */
    export const configService = 'environment.Config';

    /**
     * Development environment config module name.
     * @type {string}
     */
    export const devConfig = 'dev.config';

    /**
     * Deployment environment config module name.
     * @type {string}
     */
    export const deployConfig = 'deploy.config';

    /**
     * Module with configuration settings for development environment.
     */
    angular.module(devConfig,[])
        .constant(configService, {
            'backend': 'http://localhost:65158/'
        });

}