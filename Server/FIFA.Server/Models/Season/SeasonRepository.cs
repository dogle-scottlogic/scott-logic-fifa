using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using FIFA.Server.Models;
using System.Data.Entity;

namespace FIFA.Server.Models
{
    public class SeasonRepository : ISeasonRepository
    {
        private FIFAServerContext db = new FIFAServerContext();

        public SeasonRepository()
        {

        }
        
        // Get all the Seasons ordered by name / seasons
        public async Task<IEnumerable<Season>> GetAll()
        {
            IEnumerable<Season> seasons = await db.Seasons
                .Include(s => s.SeasonCountry)
                .ToListAsync();

            return seasons;
        }

        // Get one Season by its ID
        public async Task<Season> Get(int id)
        {
            return await db.Seasons.FindAsync(id);
        }


        // Add one Season
        public async Task<Season> Add(Season item){
            db.Seasons.Add(item);
            await db.SaveChangesAsync();
            return item;
        }

        // Update a Season by its ID
        public async Task<bool> Update(int id, Season item){

            if (item == null)
            {
                return false;
            }
            item.Id = id;

            db.Entry(item).State = EntityState.Modified;
            await db.SaveChangesAsync();

            return true;
        }

        // remove a Season by its id
        public async Task<bool> Remove(int id){
            
            Season Season = db.Seasons.Find(id);
            if (Season == null)
            {
                return false;
            }

            db.Seasons.Remove(Season);
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

        /**
         * Verify if the season name already exist
         */
        public async Task<bool> isSeasonNameExist(int countryId, string seasonName, int? Id)
        {
            return await db.Seasons.AnyAsync(s => s.Name == seasonName && s.CountryId == countryId && (Id == null || s.Id != Id));
        }


    }
}