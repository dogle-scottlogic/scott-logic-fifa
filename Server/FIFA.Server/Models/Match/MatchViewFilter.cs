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

        public int LeagueId { get; set; }
        public int SeasonId { get; set; }
        public int CountryId { get; set; }
        public bool? PlayedMatch { get; set; }
        
    }
}