using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace FIFA.Server.Models
{
    public class SeasonTableFilter
    {
        public int? Id { get; set; }
        
        public int? CountryId { get; set; }

        public int? SeasonId { get; set; }

        public int? LeagueId { get; set; }

        public bool? HasRemainingMatchToPlay { get; set; }

        public IQueryable<League> FilterLeagueTable(IQueryable<League> query)
        {
            if (this.LeagueId != null)
            {
                query = query.Where(l => l.Id == this.LeagueId);
            }
            return query;
        }

        public IQueryable<Season> FilterSeasonTable(IQueryable<Season> query)
        {
            if (this.Id != null)
            {
                query = query.Where(s => s.Id == this.Id);
            }
            
            if (this.CountryId != null)
            {
                query = query.Where(s => s.CountryId == this.CountryId);
            }


            if (this.SeasonId != null)
            {
                query = query.Where(s => s.Id == this.SeasonId);
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

            if (this.LeagueId != null)
            {
                query = query.Where(s => s.Leagues.Any(l => l.Id == this.LeagueId));
            }


            return query;
        }

        public IQueryable<Score> FilterScores(IQueryable<Score> query)
        {

            if (this.Id != null)
            {
                query = query.Where(sc => sc.Match.Id == this.Id);
            }

            if (this.CountryId != null)
            {
                query = query.Where(sc => sc.Match.League.Season.SeasonCountry.Id == this.CountryId);
            }


            if (this.SeasonId != null)
            {
                query = query.Where(sc => sc.Match.League.Season.Id == this.SeasonId);
            }

            if (this.LeagueId != null)
            {
                query = query.Where(sc => sc.Match.League.Id == this.LeagueId);
            }


            if (this.HasRemainingMatchToPlay != null)
            {
                if (this.HasRemainingMatchToPlay.Value)
                {
                    query = query.Where(sc => sc.Match.League.Matches.Any(lm => lm.Played == false));
                }
                else
                {
                    query = query.Where(sc => sc.Match.League.Matches.All(lm => lm.Played == true));
                }
            }
            
            return query;
        }
    }
}