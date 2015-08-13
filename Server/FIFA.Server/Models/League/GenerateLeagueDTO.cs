using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace FIFA.Server.Models
{
    public class GenerateLeagueDTO
    {
        public GenerateLeagueDTO()
        {
        }

        public int CountryId { get; set; }
        public RuleSet Rules { get; set; }
        public string SeasonName { get; set; }
        public ICollection<PlayerAssignLeagueModel> PlayerLeagues { get; set; }

    }

    public class PlayerAssignLeagueModel
    {
        
        public PlayerAssignLeagueModel()
        {
        }

        public League league { get; set; }
        public ICollection<Player> Players { get; set; }

    }
}