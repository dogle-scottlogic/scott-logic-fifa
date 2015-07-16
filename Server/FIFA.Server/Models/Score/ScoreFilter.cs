using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace FIFA.Server.Models
{
    public class ScoreFilter
    {

        public int Id { get; set; }

        public int MatchId { get; set; }
        public int PlayerId { get; set; }

        public int Goals { get; set; }

        public Location Location { get; set; }
        public bool? MatchPlayed { get; set; }
    }
}