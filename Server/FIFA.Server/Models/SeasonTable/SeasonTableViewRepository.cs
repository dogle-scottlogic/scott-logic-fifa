﻿using System;
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

            // Getting all the seasons having at least one match havent been played
            var currentSeasons = filter.FilterSeasonTable(db.Seasons);
            var currentLeagues = filter.FilterLeagueTable(db.Leagues);

            var leagueTableView = currentSeasons.Select(
                s => new SeasonTableViewModel
                {
                    Id = s.Id,
                    Name = s.Name,
                    LeagueTables = currentLeagues.Where(l => l.SeasonId == s.Id).Select(l => new LeagueTableViewModel
                    {
                        Id = l.Id,
                        Name = l.Name,
                        TeamPlayers = l.TeamPlayers
                        .Select(
                            tp => new TeamPlayerTableLeagueViewModel
                            {
                                Id = tp.Id,
                                player = tp.Player,
                                team = tp.Team,
                                nbPlayedMatches = l.Matches.Count(m => m.Played == true
                                                    && m.Scores.Any(sc => sc.TeamPlayer == tp)),
                                nbGoalsFor = l.Matches.Where(m => m.Played == true
                                            && m.Scores.Any(sc => sc.TeamPlayer == tp)
                                            )
                                                .Select(m => m.Scores
                                                    .Where(sc => sc.TeamPlayer == tp)
                                                    .Select(sc => sc.Goals)
                                                    .DefaultIfEmpty(0)
                                                    .Sum()
                                                    )
                                                .DefaultIfEmpty(0)
                                                .Sum(),
                               nbGoalsAgainst = l.Matches.Where(m => m.Played == true
                                            && m.Scores.Any(sc => sc.TeamPlayer == tp)
                                            )
                                                .Select(m => m.Scores
                                                    .Where(sc => sc.TeamPlayer != tp)
                                                    .Select(sc => sc.Goals)
                                                    .DefaultIfEmpty(0)
                                                    .Sum()
                                                    )
                                                .DefaultIfEmpty(0)
                                                .Sum(),
                                nbGoalsDiff = l.Matches.Where(m => m.Played == true
                                            && m.Scores.Any(sc => sc.TeamPlayer == tp)
                                            )
                                                .Select(m => m.Scores
                                                    .Where(sc => sc.TeamPlayer == tp)
                                                    .Select(sc => sc.Goals)
                                                    .DefaultIfEmpty(0)
                                                    .Sum()
                                                    )
                                                .DefaultIfEmpty(0)
                                                .Sum()
                                                -
                                          l.Matches.Where(m => m.Played == true
                                            && m.Scores.Any(sc => sc.TeamPlayer == tp)
                                            )
                                                .Select(m => m.Scores
                                                    .Where(sc => sc.TeamPlayer != tp)
                                                    .Select(sc => sc.Goals)
                                                    .DefaultIfEmpty(0)
                                                    .Sum()
                                                    )
                                                .DefaultIfEmpty(0)
                                                .Sum(),
                                nbWin = l.Matches.Where(m => m.Played == true
                                            && m.Scores.Any(sc => sc.TeamPlayer == tp)
                                            )
                                                .Select(m => m.Scores
                                                    .Where(sc => sc.TeamPlayer == tp && sc.Goals > m.Scores.Where(sc2 => sc2.TeamPlayer != tp).Select(sc2 => sc2.Goals).FirstOrDefault())
                                                    .Select(sc => 1)
                                                    .DefaultIfEmpty(0)
                                                    .Sum()
                                                    )
                                                .DefaultIfEmpty(0)
                                                .Sum(),
                                nbDraw = l.Matches.Where(m => m.Played == true
                                            && m.Scores.Any(sc => sc.TeamPlayer == tp)
                                            )
                                                .Select(m => m.Scores
                                                    .Where(sc => sc.TeamPlayer == tp && sc.Goals == m.Scores.Where(sc2 => sc2.TeamPlayer != tp).Select(sc2 => sc2.Goals).FirstOrDefault())
                                                    .Select(sc => 1)
                                                    .DefaultIfEmpty(0)
                                                    .Sum()
                                                    )
                                                .DefaultIfEmpty(0)
                                                .Sum(),
                                nbLost = l.Matches.Where(m => m.Played == true
                                           && m.Scores.Any(sc => sc.TeamPlayer == tp)
                                            )
                                                .Select(m => m.Scores
                                                    .Where(sc => sc.TeamPlayer == tp && sc.Goals < m.Scores.Where(sc2 => sc2.TeamPlayer != tp).Select(sc2 => sc2.Goals).FirstOrDefault())
                                                    .Select(sc => 1)
                                                    .DefaultIfEmpty(0)
                                                    .Sum()
                                                    )
                                                .DefaultIfEmpty(0)
                                                .Sum(),
                                nbPoints = l.Matches
                                            // for all played matches by the teamplayer for the league l
                                            .Where(m => m.Played == true
                                                && m.Scores.Any(sc => sc.TeamPlayer == tp))
                                            .Select(
                                                m =>
                                                m.Scores
                                                // which has been played by the player
                                                .Where(sc => sc.TeamPlayer == tp)
                                                .Select(
                                                    sc =>
                                                    // Wining case - We add <nbWiningPoints> for each match that the player has won 
                                                    // (ie the number of goals from the adversary < of his score)
                                                    m.Scores.Where(s2 => s2.TeamPlayer != tp
                                                    && s2.Match == sc.Match
                                                    && s2.Goals < sc.Goals)
                                                    .Select(r => nbWiningPoints)
                                                    .DefaultIfEmpty(0)
                                                    .Sum()
                                                    +
                                                    // Draw case - We add <nbDrawPoints> for each match that the player is draw 
                                                    // (ie the number of goals from the adversary == of his score)
                                                    m.Scores.Where(s2 => s2.TeamPlayer != tp
                                                    && s2.Match == sc.Match
                                                    && s2.Goals == sc.Goals)
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
                        .OrderByDescending(tp => tp.nbPoints)
                        .ThenByDescending(tp => tp.nbGoalsDiff)
                        .ThenByDescending(tp => tp.nbGoalsFor)
                        .ThenBy(tp => tp.nbPlayedMatches)
                        .ThenBy(tp => tp.player.Name)
                    })
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