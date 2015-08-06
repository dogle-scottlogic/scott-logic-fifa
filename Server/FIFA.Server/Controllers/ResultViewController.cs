using FIFA.Server.Authentication;
using FIFA.Server.Infrastructure;
using FIFA.Server.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace FIFA.Server.Controllers
{
    [IdentityBasicAuthentication] // Enable authentication via an ASP.NET Identity user name and password
    [Authorize] // Require authenticated requests.
    [ConfigurableCorsPolicy("localhost")]
    public class ResultViewController : ApiController
    {
        IMatchViewRepository matchViewRepository;

        public ResultViewController(IMatchViewRepository matchViewRepository)
        {
            this.matchViewRepository = matchViewRepository;
        }

        
        // Get all the played matches results ordered by date DESC
        public async Task<HttpResponseMessage> GetAll([FromUri] MatchViewFilter mf = null)
        {
            List<ResultViewModel> matches = await this.matchViewRepository.GetAll(mf);
            return Request.CreateResponse(HttpStatusCode.OK, matches);
        }

        // Get the result of a match
        public async Task<HttpResponseMessage> Get(int id)
        {

            MatchResultViewModel item = await this.matchViewRepository.Get(id);

            if (item == null)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }

            return Request.CreateResponse(HttpStatusCode.OK, item);
        }
    }
}
