using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using FIFA.Server.Models;
using System.Data.Entity;

namespace FIFA.Server.Models
{
    public class MatchViewRepository : IMatchViewRepository
    {
        private FIFAServerContext db;

        public MatchViewRepository(FIFAServerContext db)
        {
            this.db = db;
        }
        
        /**
         * Get all the played matches for every leagues
         */
        public async Task<List<ResultViewModel>> GetAll(MatchViewFilter filter)
        {

            var filteredMatchQuery = this.FilterMatchView(db.Matches, filter);

           // Getting all the played matches
            var matchQuery = filteredMatchQuery
                .Select(
                    m => new MatchResultViewModel{
                            LeagueId = m.League.Id,
                            LeagueName = m.League.Name,
                            SeasonId = m.League.Season.Id,
                            SeasonName = m.League.Season.Name,
                            CountryId = m.League.Season.SeasonCountry.Id,
                            CountryName = m.League.Season.SeasonCountry.Name,
                            Date = m.Date,
                            homeTeamPlayer = m.Scores.Where(s => s.Location == Location.Home)
                            .Select(s => new TeamPlayerResultViewModel
                            {
                                Id = s.TeamPlayerId,
                                PlayerName = s.TeamPlayer.Player.Name,
                                TeamName = s.TeamPlayer.Team.Name,
                                nbGoals = s.Goals
                            })
                            .FirstOrDefault(),
                            awayTeamPlayerName = m.Scores
                            .Where(s => s.Location == Location.Away)
                            .Select(s => new TeamPlayerResultViewModel
                                {
                                    Id = s.TeamPlayerId,
                                    PlayerName = s.TeamPlayer.Player.Name,
                                    TeamName = s.TeamPlayer.Team.Name,
                                    nbGoals = s.Goals
                                }
                            )
                            .FirstOrDefault()
                        }
                )
                .OrderBy(mv => mv.homeTeamPlayer.PlayerName)
                .ThenBy(mv => mv.homeTeamPlayer.TeamName)
                .ThenBy(mv => mv.awayTeamPlayerName.PlayerName)
                .ThenBy(mv => mv.awayTeamPlayerName.TeamName);


            // Grouping all the matches by date then by season ID then by league ID
            var resultView = matchQuery
                .GroupBy(mq => DbFunctions.TruncateTime(mq.Date))
                .Select(mq => new ResultViewModel
                {
                    Date = DbFunctions.TruncateTime(mq.FirstOrDefault().Date),
                    countryMatches = mq.ToList()
                    .GroupBy(l => l.CountryId)
                    .Select(
                        cv => new CountryResultViewModel
                            {
                                Id = cv.FirstOrDefault().CountryId,
                                Name = cv.FirstOrDefault().CountryName,
                                Date = cv.FirstOrDefault().Date.Value,
                                seasonMatches = cv.ToList()
                                .GroupBy(l => l.SeasonId)
                                .Select(
                                        sv => new SeasonResultViewModel
                                        {
                                            Id = sv.FirstOrDefault().SeasonId,
                                            Name = sv.FirstOrDefault().SeasonName,
                                            Date = sv.FirstOrDefault().Date.Value,
                                            leagueMatches = sv.ToList()
                                            .GroupBy(svg => svg.LeagueId)
                                            .Select(
                                                    lq => new LeagueResultViewModel
                                                    {
                                                        Id = lq.FirstOrDefault().LeagueId,
                                                        Name = lq.FirstOrDefault().LeagueName,
                                                        Date = lq.FirstOrDefault().Date.Value,
                                                        matches = lq.ToList()
                                                    }
                                           )
                                           .OrderBy(l => l.Name)
                                        }
                                    )
                                    .OrderBy(sv => sv.Name)
                            }
                    )
                    .OrderBy(cv => cv.Name)
                }
                )
                .OrderByDescending(mv => mv.Date.Value);

            // Finally returning the list
           return await resultView
               .ToListAsync();

        }

        private IQueryable<Match> FilterMatchView(IQueryable<Match> query, MatchViewFilter filter)
        {
            if (filter != null)
            {
                
                if (filter.PlayedMatch != null)
                {
                    query = query.Where(m => m.Played == filter.PlayedMatch);
                }

                if (filter.Date != null)
                {
                    query = query.Where(m => m.Date == filter.Date);
                }
                
                if (filter.LeagueId != 0)
                {
                    query = query.Where(m => m.LeagueId == filter.LeagueId);
                }

                if (filter.SeasonId != 0)
                {
                    query = query.Where(m => m.League.Season.Id == filter.SeasonId);
                }


                if (filter.CountryId != 0)
                {
                    query = query.Where(m => m.League.Season.SeasonCountry.Id == filter.CountryId);
                }

            }

            return query;
        }

        

    }
}