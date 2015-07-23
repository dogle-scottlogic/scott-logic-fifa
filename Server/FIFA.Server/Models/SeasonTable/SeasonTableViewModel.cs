﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FIFA.Server.Models
{

    public class TeamPlayerTableLeagueViewModel
    {
        public int Id { get; set; }
        public int position { get; set; }
        public int nbPlayedMatches { get; set; }
        public int nbGoals { get; set; }
        public int nbPoints { get; set; }
        public Player player { get; set; }
        public Team team { get; set; }

    }

    // Class showing a league with all the players and the teams
    public class LeagueTableViewModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public IEnumerable<TeamPlayerTableLeagueViewModel> TeamPlayers { get; set; }
    }


    // Class showing a season with all the leagues
    public class SeasonTableViewModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public IEnumerable<LeagueTableViewModel> LeagueTables { get; set; }
    }
}