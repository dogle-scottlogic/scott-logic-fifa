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
    // Controller used to view a table of leagues
    [ConfigurableCorsPolicy("localhost")]
    public class TeamPlayerStatisticViewController : ApiController
    {
        ITeamPlayerRepository teamPlayerRepository;
        
        /// <summary>
        ///     Constructor
        /// </summary>
        /// <returns></returns>
        public TeamPlayerStatisticViewController(ITeamPlayerRepository teamPlayerRepository)
        {
            this.teamPlayerRepository = teamPlayerRepository;
        }
        

        /// <summary>
        ///     Get the team player statistic for a season
        /// </summary>
        /// <returns>Return all the current leagues (which have remaining matches)</returns>
        /// 
        // POST api/League
        [ResponseType(typeof(League))]
        public async Task<HttpResponseMessage> Get(int idTeamPlayer, int idSeason)
        {
            TeamPlayerSeasonStatisticViewModel tp = await this.teamPlayerRepository.GetTeamPlayerStatisticForASeason(idTeamPlayer, idSeason);
            return Request.CreateResponse(HttpStatusCode.OK, tp);
        }
        
    }
}