using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FIFA.Server.Models
{
    public class TeamFilter
    {
        public int? Id { get; set; }

        public string Name { get; set; }

        public int? CountryId { get; set; }

        public IQueryable<Team> FilterTeams(IQueryable<Team> query)
        {
            if (this.Id != null)
            {
                query = query.Where(m => m.Id == this.Id);
            }

            if (!String.IsNullOrEmpty(this.Name))
            {
                query = query.Where(m => m.Name.Contains(this.Name));
            }

            if (this.CountryId != null)
            {
                query = query.Where(m => m.CountryId == this.CountryId);
            }

            return query;
        }
    }
}