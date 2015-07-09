using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using FIFA.Server.Models;
using System.Data.Entity;

namespace FIFA.Server.Models
{
    public class CountryRepository : ICountryRepository
    {
        private FIFAServerContext db = new FIFAServerContext();

        public CountryRepository() { }
        
        // Get all the countries ordered by name / seasons
        public async Task<IEnumerable<Country>> GetAll()
        {
            return await db.Countries.ToListAsync();
        }

        public async Task<IEnumerable<Country>> GetAllWithFilter(CountryFilter filter)
        {
            return await FilterCountries(db.Countries, filter).ToListAsync();
        }

        private IQueryable<Country> FilterCountries(IQueryable<Country> query, CountryFilter filter)
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
            }

            return query;
        }

        // Get one country by its ID
        public async Task<Country> Get(int id)
        {
            return await db.Countries.FindAsync(id);
        }

        // Add one country
        public async Task<Country> Add(Country item){
            db.Countries.Add(item);
            await db.SaveChangesAsync();
            return item;
        }

        // Update a country by its ID
        public async Task<bool> Update(int id, Country item){

            if (item == null)
            {
                return false;
            }
            item.Id = id;

            db.Entry(item).State = EntityState.Modified;
            await db.SaveChangesAsync();

            return true;
        }

        // remove a country by its id
        public async Task<bool> Remove(int id){
            
            Country country = db.Countries.Find(id);
            if (country == null)
            {
                return false;
            }

            db.Countries.Remove(country);
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

        public async Task<bool> isCountryNameExist(string countryName, int? Id)
        {
            return await db.Countries.AnyAsync(c => c.Name == countryName && (Id == null || c.Id != Id));
        }


    }
}