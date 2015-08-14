using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using FIFA.Server.Models;
using System.Data.Entity;

namespace FIFA.Server.Models
{
    public class SeasonTableViewRepository : ISeasonTableViewRepository
    {
        const int nbWiningPoints = 3;
        const int nbDrawPoints = 1;

        private FIFAServerContext db;

        public SeasonTableViewRepository(FIFAServerContext db)
        {
            this.db = db;
        }

        /**
         * Get all the current leagues which have remaining matches to play
         */
        public async Task<IEnumerable<SeasonTableViewModel>> GetAll(SeasonTableFilter filter)
        {
            if (filter == null)
            {
                filter = new SeasonTableFilter();
            }

            // Filter the scores
            var scoreQuery = filter.FilterScores(db.Scores);

            // build the team playersMatches
            var teamPlayers = this.buildTeamPlayerMatch(scoreQuery);

            // Grouping the scores by leagues
            var groupedTeamPlayers = teamPlayers.GroupBy(tp => tp.seasonId).ToList().Select(tp => tp).ToList();

            
            // Building the results by teamPlayers
            var matchResults = this.getMatchResultViewModel(groupedTeamPlayers).ToList();

            // Grouping the team playersMatches by leagues
            var leagueTeamPlayers = matchResults.Select(
                                 mg => mg
                                    .GroupBy(tp => tp.leagueId).ToList()
                                    .Select(
                                            lq => new LeagueTableViewModel
                                            {
                                                Id = lq.FirstOrDefault().leagueId,
                                                Name = lq.FirstOrDefault().leagueName,
                                                SeasonId = lq.FirstOrDefault().seasonId,
                                                SeasonName = lq.FirstOrDefault().seasonName,
                                                RuleSet = lq.FirstOrDefault().ruleSet,
                                                TeamPlayers = lq.ToList()
                                            }
                                   ).OrderBy(l => l.Name).ToList()
                                   )
                                   ;

            // Grouping the team playersMatches by seasons
            var seasonTeamPlayers = leagueTeamPlayers.Select(
                     lg => new SeasonTableViewModel
                                {
                                    Id = lg.FirstOrDefault().SeasonId,
                                    Name = lg.FirstOrDefault().SeasonName,
                                    RuleSet = lg.FirstOrDefault().RuleSet,
                                    LeagueTables = lg.ToList()
                                }
                       ).OrderBy(l => l.Name).ToList()
                       ;

            IEnumerable<SeasonTableViewModel> seasons = seasonTeamPlayers.ToList();

            
            // Calculating the position -- easier to do it in a loop
            foreach (var season in seasons)
            {
                foreach (var league in season.LeagueTables)
                {
                    int position = 1;
                    int? previousNbPoints = null;
                    int? previousNbGoalsDiff = null;
                    int? previousNbGoalsFor = null;
                    // For each team player, we compare with the previous nb of points, if it's < the position is increased
                    foreach (var teamPlayer in league.TeamPlayers)
                    {
                        if(previousNbPoints != null){
                            if (teamPlayer.nbPoints < previousNbPoints
                                || teamPlayer.nbGoalsDiff < previousNbGoalsDiff
                                || teamPlayer.nbGoalsFor < previousNbGoalsFor)
                            {
                                position++;
                            }
                        }
                        previousNbPoints = teamPlayer.nbPoints;
                        teamPlayer.position = position;
                        previousNbGoalsDiff = teamPlayer.nbGoalsDiff;
                        previousNbGoalsFor = teamPlayer.nbGoalsFor;
                    }
                }
            }

            // Finally returning the list
            return seasons;

        }

        // Returning the matches of a teamPlayer
        public class TeamPlayerMatch
        {
            public int Id { get; set; }
            public int matchId { get; set; }
            public int seasonId { get; set; }
            public string seasonName { get; set; }
            public RuleSet ruleSet { get; set; }
            public int leagueId { get; set; }
            public string leagueName { get; set; }
            public Team team { get; set; }
            public Player player { get; set; }
            public int nbGoalsFor { get; set; }
            public int nbGoalsAgainst { get; set; }
            public Boolean Played { get; set; }
        }

        // Returning a match view for each scores
        public IQueryable<TeamPlayerMatch> buildTeamPlayerMatch(IQueryable<Score> sQuery)
        {
            return sQuery.Select(
                    sc => new TeamPlayerMatch
                    {
                        seasonId = sc.Match.League.Season.Id,
                        seasonName = sc.Match.League.Season.Name,
                        ruleSet = sc.Match.League.Season.RuleSet,
                        leagueId = sc.Match.League.Id,
                        leagueName = sc.Match.League.Name,
                        Id = sc.TeamPlayer.Id,
                        matchId = sc.Match.Id,
                        team = sc.TeamPlayer.Team,
                        player = sc.TeamPlayer.Player,
                        nbGoalsFor = sc.Goals,
                        nbGoalsAgainst = sc.Match.Scores.Where(scAgainst => scAgainst.TeamPlayer != sc.TeamPlayer).Select(scAgainst => scAgainst.Goals).FirstOrDefault(),
                        Played = sc.Match.Played
                    }
            );
        }


            // Returning a view of matches from team players
        public IEnumerable<List<TeamPlayerTableLeagueViewModel>> getMatchResultViewModel(List<IGrouping<int, TeamPlayerMatch>> tpQuery)
        {
            return tpQuery.Select(
                tpg => tpg.GroupBy(tpm => tpm.Id)
                .Select(
                        tp => new TeamPlayerTableLeagueViewModel
                        {
                            leagueId = tp.FirstOrDefault().leagueId,
                            leagueName = tp.FirstOrDefault().leagueName,
                            seasonId = tp.FirstOrDefault().seasonId,
                            seasonName = tp.FirstOrDefault().seasonName,
                            ruleSet = tp.FirstOrDefault().ruleSet,
                            Id = tp.FirstOrDefault().Id,
                            player = tp.FirstOrDefault().player,
                            team = tp.FirstOrDefault().team,
                            nbPlayedMatches = tp.Where(m => m.Played == true).Count(m => 1 == 1),
                            nbGoalsFor = tp.Select(m => m.nbGoalsFor)
                                            .DefaultIfEmpty(0)
                                            .Sum(),
                            nbGoalsAgainst = tp.Select(m => m.nbGoalsAgainst)
                                            .DefaultIfEmpty(0)
                                            .Sum(),
                            nbGoalsDiff = tp.Select(m => m.nbGoalsFor - m.nbGoalsAgainst)
                                            .DefaultIfEmpty(0)
                                            .Sum(),
                            nbWin = tp.Where(m => m.Played == true).Count(m => m.nbGoalsFor > m.nbGoalsAgainst),
                            nbDraw = tp.Where(m => m.Played == true).Count(m => m.nbGoalsFor == m.nbGoalsAgainst),
                            nbLost = tp.Where(m => m.Played == true).Count(m => m.nbGoalsFor < m.nbGoalsAgainst),
                            nbPoints = (tp.Where(m => m.Played == true).Count(m => m.nbGoalsFor > m.nbGoalsAgainst) * 3 + tp.Where(m => m.Played == true).Count(m => m.nbGoalsFor == m.nbGoalsAgainst))
                        }
                ).OrderByDescending(tp => tp.nbPoints)
                .ThenByDescending(tp => tp.nbGoalsDiff)
                .ThenByDescending(tp => tp.nbGoalsFor)
                .ThenBy(tp => tp.nbPlayedMatches)
                .ThenBy(tp => tp.player.Name).ToList()
                );

        }

    }
}