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
            var matchQuery = getMatchResultViewModel(filteredMatchQuery);

            // Getting all the dates of the filteredMatchQuery
            var matchDates = getDistinctMatchDates(filteredMatchQuery);


            // Grouping all the matches by date then by season ID then by league ID
            var resultView = matchDates
                .Select(dOTM => new ResultViewModel
                {
                    Date = dOTM,
                    countryMatches = 
                        matchQuery
                        .Where(mq => DbFunctions.TruncateTime(mq.Date) == dOTM)
                        .GroupBy(mq => mq.CountryId)
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
                                                            .OrderBy(mv => mv.homeTeamPlayer.PlayerName)
                                                            .ThenBy(mv => mv.homeTeamPlayer.TeamName)
                                                            .ThenBy(mv => mv.awayTeamPlayer.PlayerName)
                                                            .ThenBy(mv => mv.awayTeamPlayer.TeamName)
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

            // Finally returning result
            return await this.ReturnResult(resultView, filter);
            
        }


        // Returning the dates of the matches
        public IQueryable<DateTime?> getDistinctMatchDates(IQueryable<Match> matchQuery)
        {
            return matchQuery.Select(m => DbFunctions.TruncateTime(m.Date)).Distinct();
        }
        

        // Returning a MatchResultViewModel from matchQuery
        public IQueryable<MatchResultViewModel> getMatchResultViewModel(IQueryable<Match> matchQuery)
        {
            return matchQuery
                .Select(
                    m => new MatchResultViewModel
                    {
                        Id = m.Id,
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
                        awayTeamPlayer = m.Scores
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
                );

        }

        /**
         * Get the played match
         */
        public async Task<MatchResultViewModel> Get(int id)
        {
            return await getMatchResultViewModel(db.Matches.Where(m => m.Id == id)).FirstOrDefaultAsync();
        }


    // Returning the list with limited result or not depending on the filter
        private async Task<List<ResultViewModel>> ReturnResult(IQueryable<ResultViewModel> resultView, MatchViewFilter filter)
        {
            if (filter != null && filter.LimitResult != null)
            {
                var result = resultView.Take(filter.LimitResult.Value);
                return await result.ToListAsync();
            }
            else
            {
                return await resultView.ToListAsync();
            }
        }

        private IQueryable<Match> FilterMatchView(IQueryable<Match> query, MatchViewFilter filter)
        {
            if (filter != null)
            {

                query = filter.FilterMatchView(query);

            }

            return query;
        }

        

    }
}