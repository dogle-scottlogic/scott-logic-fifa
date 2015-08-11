using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FIFA.Server.Models
{
    public class UserFilter
    {
        public string Id { get; set; }
        public string Name { get; set; }

        public IQueryable<IdentityUser> Filter(IQueryable<IdentityUser> query)
        {
            if (!String.IsNullOrEmpty(this.Id))
            {
                query = query.Where(m => m.Id == this.Id);
            }

            if (!String.IsNullOrEmpty(this.Name))
            {
                query = query.Where(m => m.UserName.Contains(this.Name));
            }
            
            return query;
        }
    }
}