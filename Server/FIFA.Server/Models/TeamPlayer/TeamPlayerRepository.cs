using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using FIFA.Server.Models;
using System.Data.Entity;

namespace FIFA.Server.Models
{
    public class TeamPlayerRepository : ITeamPlayerRepository
    {
        private FIFAServerContext db;

        public TeamPlayerRepository(FIFAServerContext db)
        {
            this.db = db;
        }

        // Get all the TeamPlayers
        public async Task<IEnumerable<TeamPlayer>> GetAll()
        {
            IEnumerable<TeamPlayer> teamPlayers = await db.TeamPlayers
                                                            .Include(tp => tp.Player)
                                                            .Include(tp => tp.Team).ToListAsync();
            return teamPlayers;
        }

        // Get one TeamPlayer by its ID
        public async Task<TeamPlayer> Get(int id)
        {
            return await db.TeamPlayers.FindAsync(id);
        }


        // Add one TeamPlayer
        public async Task<TeamPlayer> Add(TeamPlayer item)
        {
            db.TeamPlayers.Add(item);
            await db.SaveChangesAsync();
            return item;
        }

        // Update a TeamPlayer by its ID
        public async Task<bool> Update(int id, TeamPlayer item)
        {

            if (item == null)
            {
                return false;
            }
            item.Id = id;

            db.Entry(item).State = EntityState.Modified;
            await db.SaveChangesAsync();

            return true;
        }

        // remove a TeamPlayer by its id
        public async Task<bool> Remove(int id)
        {

            TeamPlayer teamPlayer = db.TeamPlayers.Find(id);
            if (teamPlayer == null)
            {
                return false;
            }

            db.TeamPlayers.Remove(teamPlayer);
            await db.SaveChangesAsync();

            return true;
        }

        public async Task<IEnumerable<TeamPlayer>> GetAllWithFilter(TeamPlayerFilter filter) { 
            // do nothing with filter atm
            return await FilterTeamPlayers(db.TeamPlayers, filter).ToListAsync();
        }

        private IQueryable<TeamPlayer> FilterTeamPlayers(IQueryable<TeamPlayer> query, TeamPlayerFilter filter)
        {
            if (filter != null)
            {
                if (filter.Id != 0)
                {
                    query = query.Where(m => m.Id == filter.Id);
                }

                if (filter.TeamId != 0)
                {
                    query = query.Where(m => m.TeamId == filter.TeamId);
                }

                if (filter.PlayerId != 0)
                {
                    query = query.Where(m => m.PlayerId == filter.PlayerId);
                }


            }

            return query;
        }

        public async Task<IEnumerable<TeamPlayer>> GetAllWithUnplayedMatches(Location location, MatchFilter filter)
        {
            if (filter == null)
            {
                filter = new MatchFilter();
            }
            filter.Played = false;
            var filterMatch = filter.FilterMatchs(db.Matches);

            return await db.TeamPlayers.Where(tp => tp.Scores.Any(s => filterMatch.Contains(s.Match) 
                                        && s.Location == location))
                                       .Include(tp => tp.Player)
                                       .Include(tp => tp.Team)
                                       .OrderBy(tp => tp.Player.Name)
                                       .ThenBy(tp => tp.Team.Name)
                                       .ToListAsync();
        }

        public async Task<IEnumerable<TeamPlayer>> GetAvailableAwayOpponents(int id, MatchFilter filter)
        {
            if (filter == null)
            {
                filter = new MatchFilter();
            }
            filter.Played = false;
            var filterMatch = filter.FilterMatchs(db.Matches);

            // Get all teamPlayers which is id not <id> that have at least one unplayed match with the player with <id>
           return await db.TeamPlayers.Where(tp => tp.Id != id &&
                                                tp.Scores.Any(sc => filterMatch.Contains(sc.Match)
                                                    && sc.Location == Location.Away
                                                    && sc.Match.Scores.Any(sc2 => sc2.TeamPlayerId == id)))
                                                    .Include(tp => tp.Player)
                                                    .Include(tp => tp.Team)
                                                    .OrderBy(tp => tp.Player.Name)
                                                    .ThenBy(tp => tp.Team.Name)
                                                    .ToListAsync();
        }

        // Get the statistics of a team player for a season
        public async Task<TeamPlayerSeasonStatisticViewModel> GetTeamPlayerStatisticForASeason(int teamPlayerId, int seasonId)
        {

            // Getting all the matches of a season assigned to a teamPlayer
            var filteredMatches = db.Matches.Where(
                    m => m.League.Season.Id == seasonId
                           && m.Scores.Any(sc => sc.TeamPlayer.Id == teamPlayerId)
                );

            // Get the lastPlayedMatch for a season / teamPlayer
            var lastPlayedMatchQuery = this.getLastPlayedMatchStatisticVM(filteredMatches);
            // Get the next match to play for a season / teamPlayer
            var nextMatchQuery = this.getNextMatchStatisticVM(filteredMatches);
            // Retrieve the average goals for a season / teamPlayer
            var averageGoal = getAverageGoalVM(filteredMatches, teamPlayerId);

            var query = db.TeamPlayers.Where(tp => tp.Id == teamPlayerId)
                .Select(
                    tp => new TeamPlayerSeasonStatisticViewModel
                            {
                                Id = tp.Id,
                                playerName = tp.Player.Name,
                                teamName = tp.Team.Name,
                                seasonId = seasonId,
                                seasonName = tp.Leagues
                                        .Where(l => l.Season.Id == seasonId)
                                        .Select(l => l.Season.Name)
                                        .FirstOrDefault(),
                                nbAverageGoals = averageGoal,
                                lastPlayedMatch = lastPlayedMatchQuery.FirstOrDefault(),
                                nextMatch = nextMatchQuery.FirstOrDefault(),
                    }
                );

            return await query.FirstOrDefaultAsync();
        }

        // Retrieve the number of goals done by a teamplayer on a season
        public int getAverageGoalVM(IQueryable<Match> filteredMatches, int teamPlayerId)
        {
            filteredMatches = filteredMatches.Where(m => m.Played == true);

            // Getting the total of goals for this season
            var returnedQuery = filteredMatches.Select(m => m.Scores
                                        .Where(sc => sc.TeamPlayer.Id == teamPlayerId)
                                        .Select(sc => sc.Goals)
                                        .DefaultIfEmpty(0).Sum()
                            )
                            .DefaultIfEmpty(0).Sum()
                            /
                            // Divided by the number of played matches (1 by default to avoid / 0)
                            filteredMatches.Select(m => 1).DefaultIfEmpty(1).Count();
            
            return returnedQuery;
        }


        // Retrieve the last match for a season and a teamPlayer ID
        public IQueryable<MatchStatisticViewModel> getLastPlayedMatchStatisticVM(IQueryable<Match> filteredMatches)
        {
            filteredMatches = filteredMatches.Where(m => m.Played == true);

            var returnedQuery = getMatchStatisticVM(filteredMatches).OrderByDescending(ms => ms.dateMatch);

            return returnedQuery;
        }

        // Retrieve the next match for a season and a teamPlayer ID
        public IQueryable<MatchStatisticViewModel> getNextMatchStatisticVM(IQueryable<Match> filteredMatches)
        {
            filteredMatches = filteredMatches.Where(m => m.Played == false);

            var returnedQuery = getMatchStatisticVM(filteredMatches).OrderBy(ms => ms.dateMatch);

            return returnedQuery;
        }

        // Retrieve a match statistic from a matchQuery
        public IQueryable<MatchStatisticViewModel> getMatchStatisticVM(IQueryable<Match> matchQuery)
        {
            var returnedQuery = matchQuery
                            .Select(m => new MatchStatisticViewModel
                            {
                                Id = m.Id,
                                leagueId = m.League.Id,
                                leagueName = m.League.Name,
                                dateMatch = m.Date,
                                homeTeam = m.Scores.Where(sc => sc.Location == Location.Home)
                                                        .Select(sc => sc.TeamPlayer.Player.Name).FirstOrDefault(),
                                homeNbGoals = m.Scores.Where(sc => sc.Location == Location.Home)
                                                                                .Select(sc => sc.Goals).FirstOrDefault(),
                                awayTeam = m.Scores.Where(sc => sc.Location == Location.Away)
                                                        .Select(sc => sc.TeamPlayer.Player.Name).FirstOrDefault(),
                                awayNbGoals = m.Scores.Where(sc => sc.Location == Location.Away)
                                                                                .Select(sc => sc.Goals).FirstOrDefault()
                            }
                           );
            return returnedQuery;
        }

        public void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
        }


    }
}