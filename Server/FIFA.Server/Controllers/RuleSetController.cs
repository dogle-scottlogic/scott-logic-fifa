using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using FIFA.Server.Models;
using System.Threading.Tasks;
using FIFA.Server.Infrastructure;
using FIFA.Server.Authentication;

namespace FIFA.Server.Controllers
{
    [IdentityBasicAuthentication] // Enable authentication via an ASP.NET Identity user name and password
    [Authorize] // Require authenticated requests.
    [ConfigurableCorsPolicy("localhost")]
    public class RuleSetController : AbstractCRUDAPIController<RuleSet, int, RuleSetFilter>
    {
        private FIFAServerContext db = new FIFAServerContext();

        public RuleSetController(IRuleSetRepository repository) : base(repository)
        {
        }

        /// <summary>
        ///     Retrieve all of the rule sets
        /// </summary>
        /// <returns>Return a list of rule set models</returns>
        /// 
        // GET api/RuleSet
        [ResponseType(typeof(IEnumerable<RuleSet>))]
        public async Task<HttpResponseMessage> Get()
        {
            return await base.GetAll();
        }
    }
}