using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using FIFA.Server.Models;
using System.Data.Entity;

namespace FIFA.Server.Models
{
    public class TeamRepository : ITeamRepository
    {
        private FIFAServerContext db;

        public TeamRepository(FIFAServerContext db)
        {
            this.db = db;
        }

        // Get all the Teams
        public async Task<IEnumerable<Team>> GetAll()
        {
            return await db.Teams.Include(t => t.Country).ToListAsync();
        }

        // Get one Team by its ID
        public async Task<Team> Get(int id)
        {
            return await db.Teams.FindAsync(id);
        }

        // Add one Team
        public async Task<Team> Add(Team item)
        {
            db.Teams.Add(item);
            await db.SaveChangesAsync();
            return item;
        }

        // Update a Team by its ID
        public async Task<bool> Update(int id, Team item)
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

        // remove a Team by its id
        public async Task<bool> Remove(int id)
        {

            Team team = db.Teams.Find(id);
            if (team == null)
            {
                return false;
            }

            db.Teams.Remove(team);
            await db.SaveChangesAsync();

            return true;
        }

        public async Task<IEnumerable<Team>> GetAllWithFilter(TeamFilter filter) { 
            // do nothing with filter atm
            return await FilterTeams(db.Teams.Include(t => t.Country), filter).ToListAsync();
        }

        private IQueryable<Team> FilterTeams(IQueryable<Team> query, TeamFilter filter)
        {
            if (filter != null)
            {
                query = filter.FilterTeams(query);
            }

            return query;
        }

        public void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
        }

        public async Task<bool> teamNameExists(string name, int countryId, int? id) {
            return await db.Teams.AnyAsync(t => t.Name == name && t.CountryId == countryId && (id == null || t.Id != id));
        }

        /// <summary>
        /// Checks that the team with the specified id has attached scores i.e. 
        /// it has matches attached.
        /// 
        /// </summary>
        /// <param name="id"></param>
        /// <returns>true if team has matches, false otherwise</returns>
        public async Task<bool> HasMatches(int id) {
            return await db.TeamPlayers.Where(tp => tp.TeamId == id && tp.Scores.Where(s => s.Match != null).Count() > 0).AnyAsync();
        }
    }
}