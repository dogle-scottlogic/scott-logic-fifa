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
    public class MatchController : AbstractCRUDAPIController<Match, int, MatchFilter>
    {
        /// <summary>
        ///     Constructor
        /// </summary>
        /// <returns></returns>
        public MatchController(IMatchRepository matchRepository)
            : base(matchRepository)
        {
        }

        /// <summary>
        ///     Retrieve a list of countries
        /// </summary>
        /// <returns>Return a list of matchModel</returns>
        /// 
        // GET api/Match
        [ResponseType(typeof(IEnumerable<Match>))]
        public async Task<HttpResponseMessage> GetAll([FromUri] MatchFilter matchFilter = null)
        {
            IEnumerable<Match> list;

            if (matchFilter == null)
            {
                list = await base.repository.GetAll();
            }
            else
            {
                list = await base.repository.GetAllWithFilter(matchFilter);
            }

            return Request.CreateResponse(HttpStatusCode.OK, list);
        }

        /// <summary>
        ///     Retrieves a specific match by it's ID
        /// </summary>
        /// <param name="id">The ID of the match.</param>
        /// <returns>Return a matchModel if found</returns>
        /// 
        // GET api/Match/5
        [ResponseType(typeof(Match))]
        public async Task<HttpResponseMessage> Get(int id)
        {
            return await base.Get(id);
        }

        /// <summary>
        ///     Create a new match
        /// </summary>
        /// <param name="item">The match to add without id</param>
        /// <returns>Return a matchModel if created and its uri to retrieve it</returns>
        /// 
        // POST api/Match
        [ResponseType(typeof(Match))]
        [Authorize(Roles = AuthenticationRoles.AdministratorRole)] // Require authenticated requests.
        public async Task<HttpResponseMessage> Post(Match item)
        {
            return await base.Post(item);
        }

        /// <summary>
        ///     Update a match by its ID
        /// </summary>
        /// <param name="id">The ID of the match.</param>
        /// <param name="item">The modified match</param>
        /// <returns>Return the modified matchModel if no error</returns>
        /// 
        // PUT api/Match/5
        [ResponseType(typeof(Match))]
        [Authorize(Roles = AuthenticationRoles.AdministratorRole)] // Require authenticated requests.
        public async Task<HttpResponseMessage> Put(int id, Match item)
        {
           return await base.Put(id, item);
        }

        /// <summary>
        ///     Delete a match by its ID
        /// </summary>
        /// <param name="id">The ID of the match.</param>
        /// <returns>
        /// Status 200 if deleted correctly
        /// Status 404 if not (with match not found message)
        /// </returns>
        /// 
        // DELETE api/Match/5
        [ResponseType(typeof(Match))]
        [Authorize(Roles = AuthenticationRoles.AdministratorRole)] // Require authenticated requests.
        public async Task<HttpResponseMessage> Delete(int id)
        {
            return await base.Delete(id);
        }
        

    }
}