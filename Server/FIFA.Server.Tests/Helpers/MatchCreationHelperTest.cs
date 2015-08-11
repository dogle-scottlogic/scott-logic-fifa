using FIFA.Server.Models;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Collections.Generic;
using System.Linq;

namespace FIFA.Server.Tests.Repositories
{
    [TestClass]
    public class MatchCreationHelperTest
    {
        [TestMethod]
        public void WithOneLegBetweenOpponents_OneMatchIsCreatedBetweenEachPairOfTeams()
        {
            List<TeamPlayer> teamPlayers = new List<TeamPlayer>
            {
                new TeamPlayer { Id = 0 },
                new TeamPlayer { Id = 1 }
            };
            var matches = MatchCreationHelper.create(teamPlayers, 1);

            Assert.AreEqual(1, matches.Count);
            var match1 = matches.ElementAt(0);
            Assert.AreEqual(0, match1.Scores.ElementAt(0).TeamPlayerId);
            Assert.AreEqual(1, match1.Scores.ElementAt(1).TeamPlayerId);
        }

        [TestMethod]
        public void WithTwoLegsBetweenOpponents_HomeAndAwayMatchesAreCreatedBetweenEachPairOfTeams()
        {
            List<TeamPlayer> teamPlayers = new List<TeamPlayer>
            {
                new TeamPlayer { Id = 0 },
                new TeamPlayer { Id = 1 }
            };
            var matches = MatchCreationHelper.create(teamPlayers, 2);

            Assert.AreEqual(2, matches.Count);
            var match1 = matches.ElementAt(0);
            Assert.AreEqual(0, match1.Scores.ElementAt(0).TeamPlayerId);
            Assert.AreEqual(1, match1.Scores.ElementAt(1).TeamPlayerId);
            var match2 = matches.ElementAt(1);
            Assert.AreEqual(1, match2.Scores.ElementAt(0).TeamPlayerId);
            Assert.AreEqual(0, match2.Scores.ElementAt(1).TeamPlayerId);
        }

        [TestMethod]
        public void WithOneLegBetweenOpponents_And5Teams_ThereShouldBe10Games()
        {
            /* This is because each team has 4 games and there are two teams involved in each game;
               (4 * 5) / 2 = 10 
            */
            List<TeamPlayer> teamPlayers = new List<TeamPlayer>
            {
                new TeamPlayer { Id = 0 },
                new TeamPlayer { Id = 1 },
                new TeamPlayer { Id = 2 },
                new TeamPlayer { Id = 3 },
                new TeamPlayer { Id = 4 }
            };

            var matches = MatchCreationHelper.create(teamPlayers, 1);

            Assert.AreEqual(10, matches.Count);
        }


        [TestMethod]
        public void WithTwoLegsBetweenOpponents_And5Teams_ThereShouldBe20Games()
        {
            /* This is because each team has 8 games (home and away against 4 opponents) and there
               are two teams involved in each game; (8 * 5) / 2 = 20 
            */
            List<TeamPlayer> teamPlayers = new List<TeamPlayer>
            {
                new TeamPlayer { Id = 0 },
                new TeamPlayer { Id = 1 },
                new TeamPlayer { Id = 2 },
                new TeamPlayer { Id = 3 },
                new TeamPlayer { Id = 4 }
            };

            var matches = MatchCreationHelper.create(teamPlayers, 2);

            Assert.AreEqual(20, matches.Count);
        }

        [TestMethod]
        public void WithFourLegsBetweenOpponents_And20Teams_ThereShouldBe760Games()
        {
            /* 
               Testing extreme
               19 Opponents * 4 legs = 76 games per team
               76 games per team * 20 teams = 1520 games
               1420 games / 2 players per game = 760 unique games
            */
            List<TeamPlayer> teamPlayers = new List<TeamPlayer>();
            for (int i = 0; i < 20; i++)
            {
                teamPlayers.Add(new TeamPlayer { Id = i });
            }
            var matches = MatchCreationHelper.create(teamPlayers, 4);

            Assert.AreEqual(760, matches.Count);
        }
    }
}