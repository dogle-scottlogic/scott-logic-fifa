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
         * Get all the current leagues which have remaining matches
         */
        public async Task<IEnumerable<SeasonTableViewModel>> GetAll()
        {
            var nbWiningPoints = 3;
            var nbDrawPoints = 1;

            // Getting all the seasons where at least one match havent been played
            var currentSeasons = db.Seasons
                .Where(s => s.Leagues.Any(l => l.Matches.Any(m => m.Played == false)));

            var leagueTableView = currentSeasons.Select(
                s => new SeasonTableViewModel{
                    Id = s.Id,
                    Name = s.Name,
                    LeagueTables = s.Leagues.Select(
                    l => new LeagueTableViewModel
                    {
                        Id = l.Id,
                        Name = l.Name,
                        TeamPlayers = l.TeamPlayers
                        .Select(
                            tp => new TeamPlayerTableLeagueViewModel
                            {
                                player = tp.Player,
                                team = tp.Team,
                                nbPlayedMatches = l.Matches.Count(m => m.Played == true && m.Scores.Any(sc => sc.TeamPlayer == tp)),
                                // Getting the number of goals realized by the player
                                nbGoals = l.Matches.Where(m => m.Played == true && m.Scores.Any(sc => sc.TeamPlayer == tp))
                                                    .Select(m => m.Scores
                                                        .Where(sc => sc.TeamPlayer == tp)
                                                        .Select(sc => sc.Goals)
                                                        .DefaultIfEmpty(0)
                                                        .Sum()
                                                        )
                                                    .DefaultIfEmpty(0)
                                                    .Sum(),
                                // Calculating the number of points
                                nbPoints = l.Matches
                                .Where(m => m.Played == true && m.Scores.Any(sc => sc.TeamPlayer == tp))
                                .Select(
                                    m =>
                                    m.Scores
                                    .Where(sc => sc.TeamPlayer == tp)
                                    .Select(
                                        sc =>
                                            // Wining scores + nbWiningPoints
                                        m.Scores.Where(s2 => s2.TeamPlayer != tp
                                        && s2.Match == sc.Match && s2.Goals < sc.Goals)
                                        .Select(r => nbWiningPoints)
                                        .DefaultIfEmpty(0)
                                        .Sum()
                                        +
                                            // Draw scores + nbDrawPoints
                                        m.Scores.Where(s2 => s2.TeamPlayer != tp
                                        && s2.Match == sc.Match && s2.Goals == sc.Goals)
                                        .Select(r => nbDrawPoints)
                                        .DefaultIfEmpty(0)
                                        .Sum()
                                        )
                                    .DefaultIfEmpty(0)
                                    .Sum()
                                )
                                .DefaultIfEmpty(0)
                                .Sum()
                            }
                        )
                        .OrderByDescending(tp=>tp.nbPoints)
                        .ThenByDescending(tp => tp.nbGoals)
                        .ThenBy(tp => tp.nbPlayedMatches)
                        .ThenBy(tp => tp.player.Name)
                    }
                    )
                    .OrderBy(l => l.Name)
                }
                );

            IEnumerable<SeasonTableViewModel> seasons = await leagueTableView
                                                                .OrderBy(l => l.Name)
                                                                .ToListAsync();

            // Calculating the position -- easier to do it in a loop
            foreach (var season in seasons)
            {
                foreach (var league in season.LeagueTables)
                {
                    int position = 1;
                    int previousNbPoints = -1;
                    // For each team player, we compare with the previous nb of points, if it's < the position is increased
                    foreach (var teamPlayer in league.TeamPlayers)
                    {
                        if (teamPlayer.nbPoints < previousNbPoints)
                        {
                            position++;
                        }
                        previousNbPoints = teamPlayer.nbPoints;
                        teamPlayer.position = position;
                    }
                }
            }

            // Finally returning the list
            return seasons;

        }

        

    }
}