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

    [ConfigurableCorsPolicy("localhost")]
    public class LeagueController : AbstractCRUDAPIController<League, int>
    {

        ISeasonRepository seasonRepository;

        /// <summary>
        ///     Constructor
        /// </summary>
        /// <returns></returns>
        public LeagueController(ILeagueRepository leagueRepository, ISeasonRepository seasonRepository)
            : base(leagueRepository)
        {
            this.seasonRepository = seasonRepository;
        }

        /// <summary>
        ///     Retrieve a list of leagues
        /// </summary>
        /// <returns>Return a list of leagueModel</returns>
        /// 
        // GET api/League
        [ResponseType(typeof(IEnumerable<League>))]
        public async Task<HttpResponseMessage> GetAll()
        {
            return await base.GetAll();
        }

        /// <summary>
        ///     Retrieves a specific league by it's ID
        /// </summary>
        /// <param name="id">The ID of the league.</param>
        /// <returns>Return a leagueModel if found</returns>
        /// 
        // GET api/League/5
        [ResponseType(typeof(League))]
        public async Task<HttpResponseMessage> Get(int id)
        {
            return await base.Get(id);
        }

        /// <summary>
        ///     Create a new league
        /// </summary>
        /// <param name="item">The league to add without id</param>
        /// <returns>Return a leagueModel if created and its uri to retrieve it</returns>
        /// 
        // POST api/League
        [ResponseType(typeof(League))]
        public async Task<HttpResponseMessage> Post(League item)
        {
            // try to get the season, if it returns null, send an error
            if (!await this.isSeasonExist(item))
            {
                return this.createErrorResponseSeasonDoesntExists();
            }
            else if (await ((ILeagueRepository)repository).isLeagueNameExist(item.SeasonId, item.Name, null))
            {
                return this.createErrorResponseLeagueNameExists();
            }
            else
            {
                return await base.Post(item);
            }
        }

        /// <summary>
        ///     Update a league by its ID
        /// </summary>
        /// <param name="id">The ID of the league.</param>
        /// <param name="item">The modified league</param>
        /// <returns>Return the modified leagueModel if no error</returns>
        /// 
        // PUT api/League/5
        [ResponseType(typeof(League))]
        public async Task<HttpResponseMessage> Put(int id, League item)
        {
            // try to get the season, if it returns null, send an error
            if (!await this.isSeasonExist(item))
            {
                return this.createErrorResponseSeasonDoesntExists();
            }
            else if (await ((ILeagueRepository)repository).isLeagueNameExist(item.SeasonId, item.Name, id))
            {
                return this.createErrorResponseLeagueNameExists();
            }
            else
            {
                return await base.Put(id, item);
            }
        }

        /// <summary>
        ///     Delete a league by its ID
        /// </summary>
        /// <param name="id">The ID of the league.</param>
        /// <returns>
        /// Status 200 if deleted correctly
        /// Status 404 if not (with league not found message)
        /// </returns>
        /// 
        // DELETE api/League/5
        [ResponseType(typeof(League))]
        public async Task<HttpResponseMessage> Delete(int id)
        {
            return await base.Delete(id);
        }

        /**
         * Method verifying if a season exist in the item
         **/
        private async Task<bool> isSeasonExist(League item)
        {
            if (item == null)
            {
                return false;
            }
            else
            {
                Season season = await this.seasonRepository.Get(item.SeasonId);
                return (season != null);

            }
        }

        /**
         * Creating an error message indicating that the season doesn't exist
         **/
        private const string seasonDoesntExistsError = "The season doesn't exist";
        private HttpResponseMessage createErrorResponseSeasonDoesntExists()
        {
            return Request.CreateErrorResponse(HttpStatusCode.BadRequest, seasonDoesntExistsError);
        }

        /**
         * Creating an error message indicating that the league name already exists for this season
         **/
        private const string leagueNameExistsError = "The league name already exists for this season";
        private HttpResponseMessage createErrorResponseLeagueNameExists()
        {
            return Request.CreateErrorResponse(HttpStatusCode.BadRequest, leagueNameExistsError);
        }


    }
}