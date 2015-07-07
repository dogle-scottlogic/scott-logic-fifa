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
        private FIFAServerContext db = new FIFAServerContext();

        public PlayerRepository() { }
        
        public async Task<IEnumerable<Player>> GetAll()
        {
            return await db.Players.ToListAsync();
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