using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace FIFA.Server.Models
{
    public class LeagueFilter
    {
        public LeagueFilter()
        {
        }

        public int? Id { get; set; }
        public string Name { get; set; }
        public int? SeasonId { get; set; }
        public int? CountryId { get; set; }
        public bool? HasRemainingMatchToPlay { get; set; }

        public IQueryable<League> FilterLeagues(IQueryable<League> query)
        {
            if (this.Id != null)
            {
                query = query.Where(l => l.Id == this.Id);
            }

            if (this.Name != null)
            {
                query = query.Where(l => l.Name.Contains(this.Name));
            }

            if (this.SeasonId != null)
            {
                query = query.Where(l => l.SeasonId == this.SeasonId);
            }

            if (this.CountryId != null)
            {
                query = query.Where(l => l.Season.SeasonCountry.Id == this.CountryId);
            }

            if (this.HasRemainingMatchToPlay != null)
            {
                if (this.HasRemainingMatchToPlay.Value)
                {
                    query = query.Where(l => l.Matches.Any(m => m.Played == false));
                }
                else
                {
                    query = query.Where(l => l.Matches.All(m => m.Played == true));
                }
            }

            return query;
        }

    }
}