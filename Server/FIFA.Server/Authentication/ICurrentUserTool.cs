using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace FIFA.Server.Models.Authentication
{
    public interface ICurrentUserTool
    {
        // Get the current user name
        string GetCurrentUserName();

        // Return the Id of the user
        string GetCurrentUserId();

        // return true if the user is in the role
        bool isUserInRole(string role);

        // Verify if an user name is accessible
        // => the userName is the current user
        // => or the user is an administrator
        bool isAccessibleByName(string userName);

        // Verify if an userID is accessible
        // => the userID is the current user ID
        // => or the user is an administrator
        bool isAccessibleById(string userID);
    }
}
