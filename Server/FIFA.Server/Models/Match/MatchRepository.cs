using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using FIFA.Server.Models;
using System.Data.Entity;

namespace FIFA.Server.Models
{
    public class MatchRepository : IMatchRepository
    {
        private FIFAServerContext db;

        public MatchRepository(FIFAServerContext db)
        {
            this.db = db;
        }
        
        // Get all the Matchs ordered by name / matchs
        public async Task<IEnumerable<Match>> GetAll()
        {
            IEnumerable<Match> matchs = await db.Matches
                .ToListAsync();

            return matchs;
        }

        public async Task<IEnumerable<Match>> GetAllWithFilter(MatchFilter filter)
        {
            return await FilterMatchs(db.Matches, filter).ToListAsync();
        }

        private IQueryable<Match> FilterMatchs(IQueryable<Match> query, MatchFilter filter)
        {
            if (filter != null)
            {
                if (filter.Id != 0)
                {
                    query = query.Where(m => m.Id == filter.Id);
                }

                if (filter.Date != null)
                {
                    query = query.Where(m => m.Date == filter.Date);
                }

                if (filter.LeagueId != null)
                {
                    query = query.Where(m => m.LeagueId == filter.LeagueId);
                }

            }

            return query;
        }

        // Get one Match by its ID
        public async Task<Match> Get(int id)
        {
            return await db.Matches.FindAsync(id);
        }


        // Add one Match
        public async Task<Match> Add(Match item){
            db.Matches.Add(item);
            await db.SaveChangesAsync();
            return item;
        }

        // Update a Match by its ID
        public async Task<bool> Update(int id, Match item){

            if (item == null)
            {
                return false;
            }
            item.Id = id;

            db.Entry(item).State = EntityState.Modified;
            await db.SaveChangesAsync();

            return true;
        }

        // remove a Match by its id
        public async Task<bool> Remove(int id){
            
            Match Match = db.Matches.Find(id);
            if (Match == null)
            {
                return false;
            }

            db.Matches.Remove(Match);
            await db.SaveChangesAsync();

            return true;
        }

        // Get the match corresponding to first TeamPlayerId being the home
        // and the second one being the away
        public async Task<Match> GetMatchByPlayers(int homePlayerId, int awayPlayerId) {
            Match result = await db.Matches.Where(m => m.Scores.Any(s => s.TeamPlayerId == homePlayerId && s.Location == Location.Home) &&
                                            m.Scores.Any(s => s.TeamPlayerId == awayPlayerId && s.Location == Location.Away)).FirstOrDefaultAsync();

            return result;
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