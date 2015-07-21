using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace FIFA.Server.Models
{
    public class MatchFilter
    {
        public int? Id { get; set; }

        public DateTime? Date { get; set; }

        public int? LeagueId { get; set; }
        public int? SeasonId { get; set; }
        public int? CountryId { get; set; }
        
        public bool? Played { get; set; }

        public IQueryable<Match> FilterMatchs(IQueryable<Match> query)
        {
                if (this.Id != null)
                {
                    query = query.Where(m => m.Id == this.Id);
                }

                if (this.Date != null)
                {
                    query = query.Where(m => m.Date == this.Date);
                }

                if (this.Played != null)
                {
                    query = query.Where(m => m.Played == this.Played);
                }

                if (this.LeagueId != null)
                {
                    query = query.Where(m => m.League.Id == this.LeagueId);
                }

                if (this.SeasonId != null)
                {
                    query = query.Where(m => m.League.Season.Id == this.SeasonId);
                }

                if (this.CountryId != null)
                {
                    query = query.Where(m => m.League.Season.SeasonCountry.Id == this.CountryId);
                }

            return query;
        }
    }
}