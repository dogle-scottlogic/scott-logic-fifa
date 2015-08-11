using FIFA.Server.Models.Authentication;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Http.Controllers;

namespace FIFA.Server.Authentication
{
    // Verify if the current user can access to the user ID in parameter
    [AttributeUsage(AttributeTargets.Method, AllowMultiple = false, Inherited = true)]
    public class RestrictAccessFromUserID : AuthorizeAttribute
    {
        public RestrictAccessFromUserID()
            : base()
        {
        }

        protected override bool IsAuthorized(HttpActionContext actionContext)
        {
            var isAuthorized = base.IsAuthorized(actionContext);

            if (isAuthorized)
            {

                // Get in priority the Query if it exists
                var segmentLength = actionContext.Request.RequestUri.Segments.Length;

                if (segmentLength > 0)
                {
                    var id = actionContext.Request.RequestUri.Segments[segmentLength - 1];

                    var userTool = new CurrentUserTool();
                    // Verifiying that the ID accessed is the same than the connected user or that the connected user is the admin
                    if (!userTool.isAccessibleById(id))
                    {
                        return false;
                    }
                }

            }

            return isAuthorized;
        }
    }
}