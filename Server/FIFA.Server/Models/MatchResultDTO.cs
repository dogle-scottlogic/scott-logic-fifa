using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FIFA.Server.Models
{
    public class MatchResultDTO
    {
        public int HomePlayerId { get; set; }
        public int AwayPlayerId { get; set; }
        public int ScoreHome { get; set; }
        public int ScoreAway { get; set; }
        public DateTime Date { get; set; }
    }
}