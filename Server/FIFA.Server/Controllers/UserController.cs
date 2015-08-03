using FIFA.Server.Authentication;
using FIFA.Server.Infrastructure;
using FIFA.Server.Models;
using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;

namespace FIFA.Server.Controllers
{
    /// <summary>
    ///     User API class used to manipulate User table
    /// </summary>
    /// <returns></returns>
    [IdentityBasicAuthentication] // Enable authentication via an ASP.NET Identity user name and password
    [Authorize] // Require authenticated requests.
    [ConfigurableCorsPolicy("localhost")]
    public class UserController : AbstractCRUDAPIController<IdentityUser, string, UserFilter>
    {

        /// <summary>
        ///     Constructor
        /// </summary>
        /// <returns></returns>
        public UserController(IUserRepository UserRepository)
            : base(UserRepository)
        {
        }

        /// <summary>
        ///     Retrieve a list of Users
        /// </summary>
        /// <returns>Return a list of IdentityUser</returns>
        [Authorize(Roles = AuthenticationRoles.AdministratorRole)]
        public async Task<HttpResponseMessage> GetAll()
        {
            return await base.GetAll();
        }

        /// <summary>
        ///     Retrieves a specific User by it's ID
        /// </summary>
        /// <param name="id">The ID of the User.</param>
        /// <returns>Return a IdentityUser if found</returns>
        [RestrictAccessFromUserID]
        public async Task<HttpResponseMessage> Get(string id)
        {
            return await base.Get(id);
        }

        /// <summary>
        ///     Create a new User
        /// </summary>
        /// <param name="item">The User to add without id</param>
        /// <returns>Return a IdentityUser if created and its uri to retrieve it</returns>
        [Authorize(Roles = AuthenticationRoles.AdministratorRole)]
        public async Task<HttpResponseMessage> Post(IdentityUser item)
        {
            if (item != null && await ((IUserRepository)repository).isUserNameExist(item.UserName, null))
            {
                return this.createErrorResponseUserNameExists();
            }
            else
            {
                return await base.Post(item);
            }
        }

        /// <summary>
        ///     Update a User by its ID
        /// </summary>
        /// <param name="id">The ID of the User.</param>
        /// <param name="item">The modified User</param>
        /// <returns>Return the modified IdentityUser if no error</returns>
        [RestrictAccessFromUserID]
        public async Task<HttpResponseMessage> Put(string id, IdentityUser item)
        {
            if (item != null && await ((IUserRepository)repository).isUserNameExist(item.UserName, id))
            {
                return this.createErrorResponseUserNameExists();
            }
            else
            {
                return await base.Put(id, item);
            }
        }

        /// <summary>
        ///     Delete a User by its ID
        /// </summary>
        /// <param name="id">The ID of the User.</param>
        /// <returns>
        /// Status 200 if deleted correctly
        /// Status 404 if not (with User not found message)
        /// </returns>
        [Authorize(Roles = AuthenticationRoles.AdministratorRole)]
        public async Task<HttpResponseMessage> Delete(string id)
        {
            return await base.Delete(id);
        }


        /**
         * Creating an error message indicating that the user name already exists
         **/
        private const string userNameExistsError = "The user name already exists";
        private HttpResponseMessage createErrorResponseUserNameExists()
        {
            return Request.CreateErrorResponse(HttpStatusCode.BadRequest, userNameExistsError);
        }


    }
}