using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FIFA.Server.Models
{

    // Class representing a team player with the number of goals
    public class TeamPlayerResultViewModel
    {
        public int Id { get; set; }
        public string TeamName { get; set; }
        public string PlayerName { get; set; }
        public int nbGoals { get; set; }
    }

    // Class representing a match result
    public class MatchResultViewModel
    {
        public int LeagueId { get; set; }
        public string LeagueName { get; set; }
        public int SeasonId { get; set; }
        public string SeasonName { get; set; }
        public int CountryId { get; set; }
        public string CountryName { get; set; }
        public DateTime? Date { get; set; }
        public TeamPlayerResultViewModel homeTeamPlayer { get; set; }
        public TeamPlayerResultViewModel awayTeamPlayerName { get; set; }
    }

    // Class representing a league with the played matches for a date
    public class LeagueResultViewModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public DateTime? Date { get; set; }

        public IEnumerable<MatchResultViewModel> matches { get; set; }
    }

    // Class representing a season with the played matches in a league for a date
    public class SeasonResultViewModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public DateTime? Date { get; set; }

        public IEnumerable<LeagueResultViewModel> leagueMatches { get; set; }

    }

    // Class representing a country with the played matches in a season / league for a date
    public class CountryResultViewModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public DateTime? Date { get; set; }

        public IEnumerable<SeasonResultViewModel> seasonMatches { get; set; }

    }



    // Class representing a match with it s date and the players
    public class ResultViewModel
    {
        public DateTime? Date { get; set; }

        public IEnumerable<CountryResultViewModel> countryMatches { get; set; }
    }


}