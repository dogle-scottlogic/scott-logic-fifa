using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using FIFA.Server.Models;
using System.Data.Entity;

namespace FIFA.Server.Models
{
    public class PlayerRepository : IPlayerRepository
    {
        private FIFAServerContext db;

        public PlayerRepository(FIFAServerContext db)
        {
            this.db = db;
        }
        
        public async Task<IEnumerable<Player>> GetAll()
        {
            return await db.Players.ToListAsync();
        }


        public async Task<IEnumerable<Player>> GetAllWithFilter(PlayerFilter filter)
        {
            return await FilterPlayers(db.Players, filter).ToListAsync();
        }


        private IQueryable<Player> FilterPlayers(IQueryable<Player> query, PlayerFilter filter)
        {
            if (filter != null)
            {
                if (filter.Id != 0)
                {
                    query = query.Where(m => m.Id == filter.Id);
                }

                if (!String.IsNullOrEmpty(filter.Name))
                {
                    query = query.Where(m => m.Name.Contains(filter.Name));
                }

                if (filter.Archived != null)
                {
                    query = query.Where(m => m.Archived == filter.Archived);
                }
            }

            return query;
        }

        public async Task<Player> Get(int id)
        {
            return await db.Players.FindAsync(id);
        }

        public async Task<Player> Add(Player item)
        {
            db.Players.Add(item);
            await db.SaveChangesAsync();
            return item;
        }

        public async Task<bool> Update(int id, Player item)
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

        public async Task<bool> Remove(int id)
        {    
            Player player = db.Players.Find(id);

            if (player == null)
            {
                return false;
            }

            db.Players.Remove(player);
            await db.SaveChangesAsync();

            return true;
        }
        
        public void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
        }

        public async Task<bool> isPlayerNameExist(string playerName, int? Id)
        {
            return await db.Players.AnyAsync(c => c.Name == playerName && (Id == null || c.Id != Id));
        }
    }
}