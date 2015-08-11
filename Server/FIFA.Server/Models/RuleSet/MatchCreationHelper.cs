using System;
using System.Collections.Generic;

namespace FIFA.Server.Models
{
    public static class MatchCreationHelper
    {

        public static List<Match> create(IEnumerable<TeamPlayer> teamPlayers, int numLegsPerOpponent)
        {
            List<Match> matchsToCreate = new List<Match>();
            for (int i = 0; i < numLegsPerOpponent; i++)
            {
                List<TeamPlayer> remainingPlayers = new List<TeamPlayer>(teamPlayers);
                foreach (var teamPlayer in teamPlayers)
                {
                    remainingPlayers.Remove(teamPlayer);
                    foreach (var opponent in remainingPlayers)
                    {
                        if (i % 2 == 0)
                        {
                            matchsToCreate.Add(createMatch(teamPlayer, opponent));
                        }
                        else
                        {
                            matchsToCreate.Add(createMatch(opponent, teamPlayer));
                        }
                    }
                }
            }
            return matchsToCreate;
        }


        private static Match createMatch(TeamPlayer homeTeam, TeamPlayer awayTeam)
        {
            //add match & score
            Match match = new Match { };
            match.Played = false;

            var scoreHomePlayer1 = new Score { Location = Location.Home, TeamPlayerId = homeTeam.Id };
            var scoreAwayPlayer2 = new Score { Location = Location.Away, TeamPlayerId = awayTeam.Id };

            match.Scores = new List<Score> { scoreHomePlayer1, scoreAwayPlayer2 };
            return match;
        }

    }
}