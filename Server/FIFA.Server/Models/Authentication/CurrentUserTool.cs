using System.Web;
using Microsoft.AspNet.Identity;
using FIFA.Server.Authentication;

namespace FIFA.Server.Models.Authentication
{
    public class CurrentUserTool
    {
        // Get the current user name
        public static string GetCurrentUserName()
        {
            return HttpContext.Current.User.Identity.Name;
        }

        // Return the Id of the user
        public static string GetCurrentUserId()
        {
            return HttpContext.Current.User.Identity.GetUserId(); ;
        }

        // return true if the user is in the role
        public static bool isUserInRole(string role)
        {

            if (HttpContext.Current.User.Identity.IsAuthenticated)
            {
                return HttpContext.Current.User.IsInRole(role);
            }

            return false;
        }

        // Verify if an user name is accessible
        // => the userName is the current user
        // => or the user is an administrator
        public static bool isAccessibleByName(string userName)
        {
            bool admin = isUserInRole(AuthenticationRoles.AdministratorRole);
            if (admin)
            {
                return true;
            }
            else
            {
                return (GetCurrentUserName() == userName);
            }
        }

        // Verify if an userID is accessible
        // => the userID is the current user ID
        // => or the user is an administrator
        public static bool isAccessibleById(string userID)
        {
            bool admin = isUserInRole(AuthenticationRoles.AdministratorRole);
            if (admin)
            {
                return true;
            }
            else
            {
                return (GetCurrentUserId() == userID);
            }
        }
    }
}