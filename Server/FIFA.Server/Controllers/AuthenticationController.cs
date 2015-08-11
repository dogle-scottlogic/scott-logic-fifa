using FIFA.Server.Authentication;
using FIFA.Server.Infrastructure;
using FIFA.Server.Models.Authentication;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Web;
using System.Web.Http;

namespace FIFA.Server.Controllers
{
    [IdentityBasicAuthentication] // Enable authentication via an ASP.NET Identity user name and password
    [Authorize] // Require some form of authentication
    [ConfigurableCorsPolicy("localhost")]
    public class AuthenticationController : ApiController
    {

        ICurrentUserTool userTool;

        /// <summary>
        ///     Constructor
        /// </summary>
        /// <returns></returns>
        public AuthenticationController(ICurrentUserTool _userTool)
        {
            this.userTool = _userTool;
        }

        public IHttpActionResult Get()
        {
            AuthenticationModel model = new AuthenticationModel
            {
                ID = this.userTool.GetCurrentUserId(),
                UserName = User.Identity.Name
            };


            ClaimsIdentity identity = User.Identity as ClaimsIdentity;

            if (identity != null)
            {
                List<ClaimModel> claims = new List<ClaimModel>();

                foreach (Claim claim in identity.Claims)
                {
                    claims.Add(new ClaimModel
                    {
                        Type = claim.Type,
                        Value = claim.Value
                    });
                }

                model.Claims = claims;
            }

            return Json(model);
        }
    }
}