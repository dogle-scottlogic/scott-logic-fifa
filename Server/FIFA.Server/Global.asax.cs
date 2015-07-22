﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using Ninject;
using Ninject.Web.Common;
using Ninject.Web.WebApi;
using Newtonsoft.Json;
using System.Reflection;
using FIFA.Server.Models;
using System.Net.Http.Headers;
using System.Data.Entity;

namespace FIFA.Server
{
    public class WebApiApplication : NinjectHttpApplication
    {
        protected override void OnApplicationStarted()
        {
            base.OnApplicationStarted();
            AreaRegistration.RegisterAllAreas();
            GlobalConfiguration.Configure(WebApiConfig.Register);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);

            // Setting the json formatter to Utc
            var jsonFormatter = GlobalConfiguration.Configuration.Formatters.JsonFormatter;
            GlobalConfiguration.Configuration.Formatters.Remove(GlobalConfiguration.Configuration.Formatters.XmlFormatter);
            GlobalConfiguration.Configuration.Formatters.JsonFormatter.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
            GlobalConfiguration.Configuration.Formatters.JsonFormatter.SerializerSettings.PreserveReferencesHandling = Newtonsoft.Json.PreserveReferencesHandling.None;
            GlobalConfiguration.Configuration.Formatters.JsonFormatter.SerializerSettings.DateTimeZoneHandling = DateTimeZoneHandling.Utc;
        }

        protected override IKernel CreateKernel()
        {
            var kernel = new StandardKernel();
            kernel.Load(Assembly.GetExecutingAssembly());

            RegisterServices(kernel);
            GlobalConfiguration.Configuration.DependencyResolver = new NinjectDependencyResolver(kernel);

            return kernel;
        }

        // Method registering services (here is where we bind the classes with ninject)
        protected void RegisterServices(IKernel kernel)
        {
            //register services with Ninject DI container
            kernel.Bind<ICountryRepository>().To<CountryRepository>();
            kernel.Bind<ISeasonRepository>().To<SeasonRepository>();
            kernel.Bind<IPlayerRepository>().To<PlayerRepository>();
            kernel.Bind<ITeamRepository>().To<TeamRepository>();
            kernel.Bind<ILeagueRepository>().To<LeagueRepository>();
            kernel.Bind<ITeamPlayerRepository>().To<TeamPlayerRepository>();  
            kernel.Bind<IScoreRepository>().To<ScoreRepository>();
            kernel.Bind<IMatchRepository>().To<MatchRepository>();
            kernel.Bind<IMatchViewRepository>().To<MatchViewRepository>();
            kernel.Bind<ISeasonTableViewRepository>().To<SeasonTableViewRepository>();
        }
    }
}
