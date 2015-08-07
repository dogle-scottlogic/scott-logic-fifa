using FIFA.Server.Authentication;
using FIFA.Server.Infrastructure;
using FIFA.Server.Models;
using FIFA.Server.Models.Authentication;
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
    public class UserController : AbstractCRUDAPIController<UserModel, string, UserFilter>
    {

        ICurrentUserTool userTool;
        /// <summary>
        ///     Constructor
        /// </summary>
        /// <returns></returns>
        public UserController(IUserRepository UserRepository, ICurrentUserTool _userTool)
            : base(UserRepository)
        {
            this.userTool = _userTool;
        }

        /// <summary>
        ///     Retrieve a list of Users
        /// </summary>
        /// <returns>Return a list of UserModel</returns>
        public async Task<HttpResponseMessage> GetAll()
        {
            return await base.GetAll();
        }

        /// <summary>
        ///     Retrieves a specific User by it's ID
        /// </summary>
        /// <param name="id">The ID of the User.</param>
        /// <returns>Return a UserModel if found</returns>
        [RestrictAccessFromUserID]
        public async Task<HttpResponseMessage> Get(string id)
        {
            return await base.Get(id);
        }

        /// <summary>
        ///     Create a new User
        /// </summary>
        /// <param name="item">The User to add without id</param>
        /// <returns>Return a UserModel if created and its uri to retrieve it</returns>
        [Authorize(Roles = AuthenticationRoles.AdministratorRole)]
        public async Task<HttpResponseMessage> Post(UserModel item)
        {
            // The password is mandatory on creation
            if(item != null && String.IsNullOrEmpty(item.Password))
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Impossible to create an user with an empty password.");
            }
            else if (item != null && String.IsNullOrEmpty(item.Name))
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Impossible to create an user with an empty name.");
            }
            else if (item != null && await ((IUserRepository)repository).isNameExist(item.Name, null))
            {
                return this.createErrorResponseUserNameExists();
            }else
            {
                return await base.Post(item);
            }
        }

        /// <summary>
        ///     Update a User by its ID
        /// </summary>
        /// <param name="id">The ID of the User.</param>
        /// <param name="item">The modified User</param>
        /// <returns>Return the modified UserModel if no error</returns>
        [RestrictAccessFromUserID]
        public async Task<HttpResponseMessage> Put(string id, UserModel item)
        {
            
            if (item != null && String.IsNullOrEmpty(item.Name))
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Impossible to update an user with an empty name.");
            }
            else if (item != null && await ((IUserRepository)repository).isNameExist(item.Name, id))
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
            // if the user to delete is the current user, we respond an error
            if (this.userTool.GetCurrentUserId() == id)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "You can't delete yourself. Ask for an other administrator to do this operation.");
            }
            else
            {
                return await base.Delete(id);
            }
        }


        /**
         * Creating an error message indicating that the user name already exists
         **/
        private const string NameExistsError = "The user name already exists";
        private HttpResponseMessage createErrorResponseUserNameExists()
        {
            return Request.CreateErrorResponse(HttpStatusCode.BadRequest, NameExistsError);
        }


    }
}