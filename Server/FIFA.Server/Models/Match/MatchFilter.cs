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
        public int Id { get; set; }

        public DateTime? Date { get; set; }

        public int LeagueId;
        
        public bool Played { get; set; }
    }
}