using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace FIFA.Server.Models
{
    public class SeasonFilter
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public int CountryId { get; set; }

        public bool? HavingLeague { get; set; }

        public bool? HasRemainingMatchToPlay { get; set; }


        public IQueryable<Season> FilterSeasons(IQueryable<Season> query)
        {
            if (this.Id != 0)
            {
                query = query.Where(m => m.Id == this.Id);
            }

            if (!String.IsNullOrEmpty(this.Name))
            {
                query = query.Where(m => m.Name.Contains(this.Name));
            }

            if (this.CountryId != 0)
            {
                query = query.Where(m => m.CountryId == this.CountryId);
            }

            if (this.HavingLeague != null)
            {
                query = query.Where(m => (m.Leagues.Count() > 0) == this.HavingLeague);
            }

            if (this.HasRemainingMatchToPlay != null)
            {
                if (this.HasRemainingMatchToPlay.Value)
                {
                    query = query.Where(s => s.Leagues.Any(l => l.Matches.Any(m => m.Played == false)));
                }
                else
                {
                    query = query.Where(s => s.Leagues.All(l => l.Matches.All(m => m.Played == true)));
                }
            }


            return query;
        }
    }
}