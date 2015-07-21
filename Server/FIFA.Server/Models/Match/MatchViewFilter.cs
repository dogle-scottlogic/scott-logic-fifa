using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace FIFA.Server.Models
{
    public class MatchViewFilter
    {

        public DateTime? Date { get; set; }

        public int? LeagueId { get; set; }
        public int? SeasonId { get; set; }
        public int? CountryId { get; set; }
        public bool? PlayedMatch { get; set; }
        public DateTime? DateFrom { get; set; }
        public DateTime? DateTo { get; set; }

        public IQueryable<Match> FilterMatchView(IQueryable<Match> query)
        {

            if (this.PlayedMatch != null)
            {
                query = query.Where(m => m.Played == this.PlayedMatch);
            }

            if (this.Date != null)
            {
                query = query.Where(m => m.Date == this.Date);
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

            if (this.DateFrom != null)
            {
                query = query.Where(m => m.Date >= this.DateFrom);
            }

            if (this.DateTo!= null)
            {
                // we add 24 hours in order to be at midnight
                this.DateTo = this.DateTo.Value.AddHours(24);
                query = query.Where(m => m.Date <= this.DateTo);
            }


            return query;
        }
        
    }
}