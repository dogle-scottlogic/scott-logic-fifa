using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FIFA.Server.Models
{

    public class TeamPlayerViewModel
    {
        public Player player { get; set; }
        public Team team { get; set; }
    }

    // Class showing a league with all the players and the teams
    public class LeagueViewModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public IEnumerable<TeamPlayerViewModel> TeamPlayers { get; set; }
    }
}