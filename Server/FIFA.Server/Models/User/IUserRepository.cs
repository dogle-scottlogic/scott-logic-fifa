using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace FIFA.Server.Models
{
    public interface IUserRepository : ICRUDRepository<IdentityUser, string, UserFilter>
    {
        Task<bool> isUserNameExist(string userName, string Id);
    }
}