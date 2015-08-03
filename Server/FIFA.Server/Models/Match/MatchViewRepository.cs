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
            
            // Grouping the matches by date
            var groupedMatches = matchQuery.GroupBy(m => DbFunctions.TruncateTime(m.Date)).ToList().Select(mq => mq).ToList();

            // we group by the league Id
            var leagueMatches = groupedMatches.Select(
                                                gm => gm.GroupBy(svg => svg.LeagueId)
                                                .Select(
                                                        lq => new LeagueResultViewModel
                                                        {
                                                            CountryId = lq.FirstOrDefault().CountryId,
                                                            CountryName = lq.FirstOrDefault().CountryName,
                                                            SeasonId = lq.FirstOrDefault().SeasonId,
                                                            SeasonName = lq.FirstOrDefault().SeasonName,
                                                            Id = lq.FirstOrDefault().LeagueId,
                                                            Name = lq.FirstOrDefault().LeagueName,
                                                            Date = lq.FirstOrDefault().Date,
                                                            matches = lq.ToList()
                                                            .OrderBy(mv => mv.homeTeamPlayer.PlayerName)
                                                            .ThenBy(mv => mv.homeTeamPlayer.TeamName)
                                                            .ThenBy(mv => mv.awayTeamPlayer.PlayerName)
                                                            .ThenBy(mv => mv.awayTeamPlayer.TeamName)
                                                        }
                                               )
                                               .OrderBy(l => l.Name).ToList()
                                               );

            // we group by the Season ID
            var seasonMatches = leagueMatches.Select(
                                       lm => lm.GroupBy(svg => svg.SeasonId)
                                            .Select(
                                                    lq => new SeasonResultViewModel
                                                    {
                                                        CountryId = lq.FirstOrDefault().CountryId,
                                                        CountryName = lq.FirstOrDefault().CountryName,
                                                        Id = lq.FirstOrDefault().SeasonId,
                                                        Name = lq.FirstOrDefault().SeasonName,
                                                        Date = lq.FirstOrDefault().Date,
                                                        leagueMatches = lq.ToList()
                                                    }
                                           )
                                           .OrderBy(l => l.Name).ToList()
                                   );


            // we group by the Country ID
            var countryMatches = seasonMatches.Select(
                                    sm => sm.GroupBy(svg => svg.CountryId)
                                    .Select(
                                            lq => new CountryResultViewModel
                                            {
                                                Id = lq.FirstOrDefault().CountryId,
                                                Name = lq.FirstOrDefault().CountryName,
                                                Date = lq.FirstOrDefault().Date,
                                                seasonMatches = lq.ToList()
                                            }
                                   )
                                   .OrderBy(l => l.Name).ToList()
                                   );


            // Finnaly we group by the Date
            var resultView = countryMatches.Select(
                                            lq => new ResultViewModel
                                            {
                                                Date = lq.FirstOrDefault().Date,
                                                countryMatches = lq.ToList()
                                            }
                                   )
                                   .OrderByDescending(l => l.Date).ToList();
            
            return await this.ReturnResult(resultView, filter);

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
        private async Task<List<ResultViewModel>> ReturnResult(List<ResultViewModel> resultView, MatchViewFilter filter)
        {
            if (filter != null && filter.LimitResult != null)
            {
                var result = resultView.Take(filter.LimitResult.Value);
                return result.ToList();
            }
            else
            {
                return resultView.ToList();
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