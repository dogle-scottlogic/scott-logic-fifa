using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FIFA.Server.Models
{
    // Class representing the static of a teamplayer match
    public class MatchStatisticViewModel
    {
        public int Id { get; set; }
        public int leagueId { get; set; }
        public string leagueName { get; set; }
        public string homeTeam { get; set; }
        public string awayTeam { get; set; }
        public int? homeNbGoals { get; set; }
        public int? awayNbGoals { get; set; }
        public DateTime? dateMatch { get; set; }
    }

    public class TeamPlayerSeasonStatisticViewModel
    {
        public int Id { get; set; }
        public string teamName { get; set; }
        public string playerName { get; set; }
        public int seasonId { get; set; }
        public string seasonName { get; set; }
        public double nbAverageGoals { get; set; }

        public MatchStatisticViewModel lastPlayedMatch { get; set; }

        public MatchStatisticViewModel nextMatch { get; set; }

    }
}