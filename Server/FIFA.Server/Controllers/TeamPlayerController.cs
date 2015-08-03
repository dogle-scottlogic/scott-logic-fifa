using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using FIFA.Server.Models;
using FIFA.Server.Infrastructure;
using FIFA.Server.Authentication;

namespace FIFA.Server.Controllers
{
    [IdentityBasicAuthentication] // Enable authentication via an ASP.NET Identity user name and password
    [Authorize] // Require authenticated requests.
    [ConfigurableCorsPolicy("localhost")]
    public class TeamPlayerController : AbstractCRUDAPIController<TeamPlayer, int, TeamPlayerFilter>
    {
        private FIFAServerContext db = new FIFAServerContext();

        public TeamPlayerController(ITeamPlayerRepository teamPlayerRepository)
            : base(teamPlayerRepository){
        }

        /// <summary>
        ///     Retrieve a list of teamPlayers
        /// </summary>
        /// <returns>Return a list of teamPlayerModels</returns>
        /// 
        // GET api/Country
        [ResponseType(typeof(IEnumerable<TeamPlayer>))]
        public async Task<HttpResponseMessage> GetAll([FromUri] TeamPlayerFilter filter = null) {
            IEnumerable<TeamPlayer> list;

            if (filter == null)
            {
                list = await base.repository.GetAll();
            }
            else
            {
                list = await base.repository.GetAllWithFilter(filter);
            }

            return Request.CreateResponse(HttpStatusCode.OK, list);
        }

        /// <summary>
        ///     Retrieves a specific teamPlayer by its ID
        /// </summary>
        /// <param name="id">The ID of the teamplayer.</param>
        /// <returns>Return a teamPlayer model if found</returns>
        /// 
        // GET api/TeamPlayer/5
        [ResponseType(typeof(TeamPlayer))]
        public async Task<HttpResponseMessage> Get(int id)
        {
            return await base.Get(id);
        }

        /// <summary>
        ///     Create a new TeamPlayer
        /// </summary>
        /// <param name="item">The TeamPlayer to add without id</param>
        /// <returns>Return a TeamPlayer model if created and its uri to retrieve it</returns>
        /// 
        // POST api/TeamPlayer
        [ResponseType(typeof(TeamPlayer))]
        [Authorize(Roles = AuthenticationRoles.AdministratorRole)] // Require authenticated requests.
        public async Task<HttpResponseMessage> Post(TeamPlayer item)
        {
            if (item != null && TeamPlayerExists(item.Id))
            {
                return this.createErrorResponseTeamPlayerExists();
            }
            else
            {
                return await base.Post(item);
            }
        }

        /// <summary>
        ///     Update a TeamPlayer by its ID
        /// </summary>
        /// <param name="id">The ID of the TeamPlayer.</param>
        /// <param name="item">The modified TeamPlayer</param>
        /// <returns>Return the modified TeamPlayer if no error</returns>
        /// 
        // PUT api/TeamPlayer/5
        [ResponseType(typeof(TeamPlayer))]
        [Authorize(Roles = AuthenticationRoles.AdministratorRole)] // Require authenticated requests.
        public async Task<HttpResponseMessage> Put(int id, TeamPlayer item)
        {
            return await base.Put(id, item);
        }

        /// <summary>
        ///     Delete a TeamPlayer by its ID
        /// </summary>
        /// <param name="id">The ID of the TeamPlayer.</param>
        /// <returns>
        /// Status 200 if deleted correctly
        /// Status 404 if not (with TeamPlayer not found message)
        /// </returns>
        /// 
        // DELETE api/TeamPlayer/5
        [ResponseType(typeof(TeamPlayer))]
        [Authorize(Roles = AuthenticationRoles.AdministratorRole)] // Require authenticated requests.
        public async Task<HttpResponseMessage> Delete(int id)
        {
            return await base.Delete(id);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool TeamPlayerExists(int id)
        {
            return db.TeamPlayers.Count(e => e.Id == id) > 0;
        }

        /**
         * Creating an error message indicating that the team player already exists
         **/
        private const string teamPlayerExistsError = "The team player already exists";
        private HttpResponseMessage createErrorResponseTeamPlayerExists()
        {
            return Request.CreateErrorResponse(HttpStatusCode.BadRequest, teamPlayerExistsError);
        }
    }
}