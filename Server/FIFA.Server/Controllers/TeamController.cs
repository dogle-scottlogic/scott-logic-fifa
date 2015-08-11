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
    public class TeamController : AbstractCRUDAPIController<Team, int, TeamFilter>
    {
        ICountryRepository countryRepository;

        public TeamController(ITeamRepository teamRepository, ICountryRepository countryRepository) : base(teamRepository) {
            this.countryRepository = countryRepository;
        }

        /// <summary>
        ///     Retrieve a list of teams
        /// </summary>
        /// <returns>Return a list of team models</returns>
        /// 
        // GET api/Team
        [ResponseType(typeof(IEnumerable<Team>))]
        public async Task<HttpResponseMessage> GetAll([FromUri] TeamFilter teamFilter = null)
        {

            IEnumerable<Team> list;

            if (teamFilter == null)
            {
                list = await base.repository.GetAll();
            }
            else
            {
                list = await base.repository.GetAllWithFilter(teamFilter);
            }

            return Request.CreateResponse(HttpStatusCode.OK, list);
        }

        /// <summary>
        ///     Retrieves a specific team by its ID
        /// </summary>
        /// <param name="id">The ID of the team.</param>
        /// <returns>Return a team model if found</returns>
        /// 
        // GET api/Team/5
        [ResponseType(typeof(Team))]
        public async Task<HttpResponseMessage> Get(int id)
        {
            return await base.Get(id);
        }

        /// <summary>
        ///     Create a new team
        /// </summary>
        /// <param name="item">The team to add without id</param>
        /// <returns>Return a team model if created and the uri to retrieve it</returns>
        /// 
        // POST api/Team
        [ResponseType(typeof(Team))]
        [Authorize(Roles = AuthenticationRoles.AdministratorRole)] // Require authenticated requests.
        public async Task<HttpResponseMessage> Post(Team team)
        {
            // try to get the country, if it returns null, send an error
            if (!await this.countryExists(team)){
                return this.createErrorResponseWithMessage(NON_EXISTENT_COUNTRY_ERR);
            } else if (await ((ITeamRepository)repository).teamNameExists(team.Name, team.CountryId, team.Id)){
                return this.createErrorResponseWithMessage(TEAM_EXISTS_ERR);
            } else {
                return await base.Post(team);
            }
        }

        /// <summary>
        ///     Update a team by its ID
        /// </summary>
        /// <param name="id">The ID of the team.</param>
        /// <param name="item">The modified team</param>
        /// <returns>Return the modified team model if no error</returns>
        /// 
        // PUT api/Team/5
        [ResponseType(typeof(Team))]
        [Authorize(Roles = AuthenticationRoles.AdministratorRole)] // Require authenticated requests.
        public async Task<HttpResponseMessage> Put(int id, Team team)
        {
            // try to get the country, if it returns null, send an error
            if (!await this.countryExists(team)){
                return this.createErrorResponseWithMessage(NON_EXISTENT_COUNTRY_ERR);
            }
            else if (await ((ITeamRepository)repository).teamNameExists(team.Name, team.CountryId, team.Id)){
                return this.createErrorResponseWithMessage(TEAM_EXISTS_ERR);
            }  
            else {
                return await base.Put(id, team);
            }
        }

        /// <summary>
        ///     Delete a team by its ID
        /// </summary>
        /// <param name="id">The ID of the team</param>
        /// <returns>
        /// Status 200 if deleted correctly
        /// Status 404 if not (with team not found message)
        /// </returns>
        /// 
        // DELETE api/Team/5
        [ResponseType(typeof(Team))]
        [Authorize(Roles = AuthenticationRoles.AdministratorRole)] // Require authenticated requests.
        public async Task<HttpResponseMessage> Delete(int id)
        {
            bool hasMatches = await ((ITeamRepository)repository).HasMatches(id);

            // if the team has matches attached, it cannot be deleted
            return hasMatches ? createErrorResponseWithMessage(TEAM_HAS_MATCHES_ERR) : await base.Delete(id);
        }

        /**
         * Method verifying if the country associated with the team exists
         **/
        private async Task<bool> countryExists(Team item)
        {
            if (item != null){
                Country country = await this.countryRepository.Get(item.CountryId);
                return (country != null);
            }

            return false;
        }

        private const string NON_EXISTENT_COUNTRY_ERR = "The country doesn't exist";
        private const string TEAM_EXISTS_ERR = "The team name already exists";
        private const string TEAM_HAS_MATCHES_ERR = "Team can't be deleted because it has matches";

        private HttpResponseMessage createErrorResponseWithMessage(string msg) {
            return Request.CreateErrorResponse(HttpStatusCode.BadRequest, msg);
        }
    }
}