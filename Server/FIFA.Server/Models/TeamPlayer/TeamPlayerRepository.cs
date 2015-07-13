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
        private FIFAServerContext db = new FIFAServerContext();

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

                if (filter.TeamId != null)
                {
                    query = query.Where(m => m.TeamId == filter.TeamId);
                }

                if (filter.PlayerId != null)
                {
                    query = query.Where(m => m.PlayerId == filter.PlayerId);
                }
            }

            return query;
        }

        public async Task<IEnumerable<TeamPlayer>> GetAllWithUnplayedMatches(Location location) {
            return await db.TeamPlayers.Where(tp => tp.Scores.Any(s => s.Match.Played == false && s.Location == location))
                                       .Include(tp => tp.Player)
                                       .Include(tp => tp.Team).ToListAsync();
        }

        public async Task<IEnumerable<TeamPlayer>> GetAvailableAwayOpponents(int id)
        { 
            // Get all teamPlayers which is id not <id> that have at least one unplayed match with the player with <id>
           return await db.TeamPlayers.Where(tp => tp.Id != id && 
                                                tp.Scores.Any(sc => sc.Match.Played == false 
                                                    && sc.Location == Location.Away
                                                    && sc.Match.Scores.Any(sc2 => sc2.TeamPlayerId == id)))
                                                    .Include(tp => tp.Player)
                                                    .Include(tp => tp.Team).ToListAsync();
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