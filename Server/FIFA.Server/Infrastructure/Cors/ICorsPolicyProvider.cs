using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using System.Web.Cors;
using System.Web.Http.Cors;

namespace FIFA.Server.Infrastructure
{
    
        /// <summary>
        /// An attribute for using Cors policies that have been created in a configuration file.
        /// Usage should be [ConfigurableCorsPolicy("policyname")] that matches a politic name in Web.config
        /// </summary>
        public class ConfigurableCorsPolicyAttribute : Attribute, ICorsPolicyProvider
        {
            private readonly CorsPolicy _policy;

            public ConfigurableCorsPolicyAttribute(string name)
            {
                _policy = new CorsPolicy();

                var config = ConfigurationManager.GetSection("cors");
                var corsConfig = (CorsSection)config;
                if (corsConfig != null)
                {
                    var policy = corsConfig.CorsPolicies.Cast<CorsElement>().FirstOrDefault(x => x.Name == name);
                    if (policy != null)
                    {
                        if (policy.Headers == "*")
                            _policy.AllowAnyHeader = true;
                        else
                            policy.Headers.Split(';').ToList().ForEach(x => _policy.Headers.Add(x));

                        if (policy.Methods == "*")
                            _policy.AllowAnyMethod = true;
                        else
                            policy.Methods.Split(';').ToList().ForEach(x => _policy.Methods.Add(x));

                        if (policy.Origins == "*")
                            _policy.AllowAnyOrigin = true;
                        else
                            policy.Origins.Split(';').ToList().ForEach(x => _policy.Origins.Add(x));
                    }
                }
            }

            public Task<CorsPolicy> GetCorsPolicyAsync(HttpRequestMessage request, CancellationToken cancellationToken)
            {
                return Task.FromResult(_policy);
            }
        }

}