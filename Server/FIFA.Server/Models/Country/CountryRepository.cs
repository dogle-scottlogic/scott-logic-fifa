using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using FIFA.Server.Models;
using System.Data.Entity;

namespace FIFA.Server.Models
{
    public class CountryRepository : DbSetRepository<Country, int, String>, ICountryRepository
    {
        private FIFAServerContext db;

        /// <summary>
        /// Default constructor
        /// </summary>
        public CountryRepository() : this(new FIFAServerContext())
        {
        }

        /// <summary>
        /// Constructor that takes a specialized <see cref="DbContext"/>.
        /// </summary>
        /// <param name="db">FIFAServerContext that contains the DbSet of <see cref="Country"/> objects.</param>
        /// <remarks>To allow for ninject dependency injection, 
        /// this will attempt to dispose its <paramref name="db"/> on <c>dispose(bool)</c>.
        /// </remarks>
        CountryRepository(FIFAServerContext db) : base(
            db, 
            db.Countries, 
            (country, id) => country.Id = id, // set the key field
            (country) => country.Name) // order by this property
        {
            this.db = db;
        }

        /// <summary>
        /// Partial implementation of dispose pattern.
        /// </summary>
        /// <param name="disposing"></param>
        public void dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
        }

        /// <summary>
        /// Check for the existence of a country with the given name.
        /// </summary>
        /// <param name="countryName"></param>
        /// <param name="Id"></param>
        /// <returns>true if one has been found.</returns>
        /// <remarks>It's not clear why we take the id parameter here.</remarks>
        public async Task<bool> isCountryNameExist(string countryName, int? Id)
        {
            return await AnyAsync(c => c.Name == countryName && (Id == null || c.Id != Id));
        }
    }
}