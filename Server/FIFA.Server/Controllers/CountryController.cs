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
    public class CountryController : AbstractCRUDAPIController<Country, int, CountryFilter>
    {
        /// <summary>
        ///     Constructor
        /// </summary>
        /// <returns></returns>
        public CountryController(ICountryRepository countryRepository)
            : base(countryRepository)
        {
        }

        /// <summary>
        ///     Retrieve a list of countries
        /// </summary>
        /// <returns>Return a list of countryModel</returns>
        /// 
        // GET api/Country
        [ResponseType(typeof(IEnumerable<Country>))]
        public async Task<HttpResponseMessage> GetAll([FromUri] CountryFilter countryFilter = null)
        {
            IEnumerable<Country> list;

            if (countryFilter == null)
            {
                list = await base.repository.GetAll();
            }
            else
            {
                list = await base.repository.GetAllWithFilter(countryFilter);
            }

            return Request.CreateResponse(HttpStatusCode.OK, list);
        }

        /// <summary>
        ///     Retrieves a specific country by it's ID
        /// </summary>
        /// <param name="id">The ID of the country.</param>
        /// <returns>Return a countryModel if found</returns>
        /// 
        // GET api/Country/5
        [ResponseType(typeof(Country))]
        public async Task<HttpResponseMessage> Get(int id)
        {
            return await base.Get(id);
        }

        /// <summary>
        ///     Create a new country
        /// </summary>
        /// <param name="item">The country to add without id</param>
        /// <returns>Return a countryModel if created and its uri to retrieve it</returns>
        /// 
        // POST api/Country
        [ResponseType(typeof(Country))]
        [Authorize(Roles = AuthenticationRoles.AdministratorRole)] // Require authenticated requests.
        public async Task<HttpResponseMessage> Post(Country item)
        {
            if (item != null && await((ICountryRepository)repository).isCountryNameExist(item.Name, null))
            {
                return this.createErrorResponseCountryNameExists();
            }
            else
            {
                return await base.Post(item);
            }
        }

        /// <summary>
        ///     Update a country by its ID
        /// </summary>
        /// <param name="id">The ID of the country.</param>
        /// <param name="item">The modified country</param>
        /// <returns>Return the modified countryModel if no error</returns>
        /// 
        // PUT api/Country/5
        [ResponseType(typeof(Country))]
        [Authorize(Roles = AuthenticationRoles.AdministratorRole)] // Require authenticated requests.
        public async Task<HttpResponseMessage> Put(int id, Country item)
        {
            if (item != null && await ((ICountryRepository)repository).isCountryNameExist(item.Name, id))
            {
                return this.createErrorResponseCountryNameExists();
            }
            else
            {
                return await base.Put(id, item);
            }
        }

        /// <summary>
        ///     Delete a country by its ID
        /// </summary>
        /// <param name="id">The ID of the country.</param>
        /// <returns>
        /// Status 200 if deleted correctly
        /// Status 404 if not (with country not found message)
        /// </returns>
        /// 
        // DELETE api/Country/5
        [ResponseType(typeof(Country))]
        [Authorize(Roles = AuthenticationRoles.AdministratorRole)] // Require authenticated requests.
        public async Task<HttpResponseMessage> Delete(int id)
        {
            return await base.Delete(id);
        }

        /**
         * Creating an error message indicating that the country name already exists
         **/
        private const string countryNameExistsError = "The country name already exists";
        private HttpResponseMessage createErrorResponseCountryNameExists()
        {
            return Request.CreateErrorResponse(HttpStatusCode.BadRequest, countryNameExistsError);
        }

    }
}