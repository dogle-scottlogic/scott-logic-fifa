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

namespace FIFA.Server.Controllers
{
    // Controller used to view a table of leagues
    [ConfigurableCorsPolicy("localhost")]
    public class SeasonTableViewController : ApiController
    {
        ISeasonTableViewRepository seasonTableViewRepository;
        
        /// <summary>
        ///     Constructor
        /// </summary>
        /// <returns></returns>
        public SeasonTableViewController(ISeasonTableViewRepository seasonTableViewRepository)
        {
            this.seasonTableViewRepository = seasonTableViewRepository;
        }


        /// <summary>
        ///     Get all the season classement in function of the filter
        /// </summary>
        /// <returns>Return all the current leagues (which have remaining matches)</returns>
        /// 
        // POST api/League
        [ResponseType(typeof(League))]
        public async Task<HttpResponseMessage> GetAll([FromUri]SeasonTableFilter filter)
        {
            IEnumerable<SeasonTableViewModel> leagues = await this.seasonTableViewRepository.GetAll(filter);
            return Request.CreateResponse(HttpStatusCode.OK, leagues);
        }
        
    }
}