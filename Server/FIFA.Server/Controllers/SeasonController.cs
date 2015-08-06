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
    public class SeasonController : AbstractCRUDAPIController<Season, int, SeasonFilter>
    {
        private FIFAServerContext db = new FIFAServerContext();

        ICountryRepository countryRepository;

        /// <summary>
        ///     Constructor
        /// </summary>
        /// <returns></returns>
        public SeasonController(ISeasonRepository seasonRepository, ICountryRepository countryRepository)
            : base(seasonRepository)
        {
            this.countryRepository = countryRepository;
        }

        /// <summary>
        ///     Retrieve a list of seasons
        /// </summary>
        /// <returns>Return a list of seasonModel</returns>
        /// 
        // GET api/Season
        [ResponseType(typeof(IEnumerable<Season>))]
        public async Task<HttpResponseMessage> GetAll([FromUri] SeasonFilter seasonFilter = null)
        {
            IEnumerable<Season> list;

            if (seasonFilter == null)
            {
                list = await base.repository.GetAll();
            }
            else
            {
                list = await base.repository.GetAllWithFilter(seasonFilter);
            }

            return Request.CreateResponse(HttpStatusCode.OK, list);
        }

        /// <summary>
        ///     Retrieves a specific season by its ID
        /// </summary>
        /// <param name="id">The ID of the season.</param>
        /// <returns>Return a seasonModel if found</returns>
        /// 
        // GET api/Season/5
        [ResponseType(typeof(Season))]
        public async Task<HttpResponseMessage> Get(int id)
        {
            return await base.Get(id);
        }

        /// <summary>
        ///     Create a new season
        /// </summary>
        /// <param name="item">The season to add without id</param>
        /// <returns>Return a seasonModel if created and its uri to retrieve it</returns>
        /// 
        // POST api/Season
        [ResponseType(typeof(Season))]
        [Authorize(Roles = AuthenticationRoles.AdministratorRole)] // Require authenticated requests.
        public async Task<HttpResponseMessage> Post(Season item)
        {
            // try to get the country, if it returns null, send an error
            if (!await this.isCountryExist(item))
            {
                return this.createErrorResponseCountryDoesntExists();
            }
            else if (await ((ISeasonRepository)repository).isSeasonNameExist(item.CountryId, item.Name, null))
            {
                return this.createErrorResponseSeasonNameExists();
            }
            else
            {
                return await base.Post(item);
            }
        }

        /// <summary>
        ///     Update a season by its ID
        /// </summary>
        /// <param name="id">The ID of the season.</param>
        /// <param name="item">The modified season</param>
        /// <returns>Return the modified seasonModel if no error</returns>
        /// 
        // PUT api/Season/5
        [ResponseType(typeof(Season))]
        [Authorize(Roles = AuthenticationRoles.AdministratorRole)] // Require authenticated requests.
        public async Task<HttpResponseMessage> Put(int id, Season item)
        {
            // try to get the country, if it returns null, send an error
            if (!await this.isCountryExist(item))
            {
                return this.createErrorResponseCountryDoesntExists();
            }
            else if (await ((ISeasonRepository)repository).isSeasonNameExist(item.CountryId, item.Name, id))
            {
                return this.createErrorResponseSeasonNameExists();
            }
            else
            {
                return await base.Put(id, item);
            }
        }

        /// <summary>
        ///     Delete a season by its ID
        /// </summary>
        /// <param name="id">The ID of the season.</param>
        /// <returns>
        /// Status 200 if deleted correctly
        /// Status 404 if not (with season not found message)
        /// </returns>
        /// 
        // DELETE api/Season/5
        [ResponseType(typeof(Season))]
        [Authorize(Roles = AuthenticationRoles.AdministratorRole)] // Require authenticated requests.
        public async Task<HttpResponseMessage> Delete(int id)
        {
            return await base.Delete(id);
        }

        /**
         * Method verifying if a country exist in the item
         **/
        private async Task<bool> isCountryExist(Season item)
        {
            if (item == null)
            {
                return false;
            }
            else
            {
                Country country = await this.countryRepository.Get(item.CountryId);
                return (country != null);

            }
        }

        /**
         * Creating an error message indicating that the country doesn't exist
         **/
        private const string countryDoesntExistsError = "The country doesn't exist";
        private HttpResponseMessage createErrorResponseCountryDoesntExists()
        {
            return Request.CreateErrorResponse(HttpStatusCode.BadRequest, countryDoesntExistsError);
        }

        /**
         * Creating an error message indicating that the season name already exists for this country
         **/
        private const string seasonNameExistsError = "The season name already exists for this country";
        private HttpResponseMessage createErrorResponseSeasonNameExists()
        {
            return Request.CreateErrorResponse(HttpStatusCode.BadRequest, seasonNameExistsError);
        }


    }
}