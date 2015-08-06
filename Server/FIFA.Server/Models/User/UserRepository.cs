using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace FIFA.Server.Models
{
    public class UserRepository : IUserRepository
    {
        private FIFAServerContext db;

        public UserRepository(FIFAServerContext db)
        {
            this.db = db;
        }

        // Get the list of all Users
        public async Task<IEnumerable<IdentityUser>> GetAll()
        {
            IEnumerable<IdentityUser> UserList = await db.Users.ToListAsync();
            return UserList;
        }

        public async Task<IEnumerable<IdentityUser>> GetAllWithFilter(UserFilter filter)
        {
            IEnumerable<IdentityUser> UserList = await db.Users.ToListAsync();
            return UserList;
        }

        // Get a User by its ID
        public async Task<IdentityUser> Get(string id)
        {

            IdentityUser user = db.Users.Find(id);
            return user;
        }
        
        // Adding a User to the database
        public async Task<IdentityUser> Add(IdentityUser item)
        {
            if (item == null)
            {
                throw new ArgumentNullException("item");
            }

            db.Users.Add(item);
            await db.SaveChangesAsync();

            return item;
        }

        // Remove a User from the database
        public async Task<bool> Remove(string id)
        {
            IdentityUser User = db.Users.Find(id);

            if (User == null)
            {
                return false;
            }

            db.Users.Remove(User);
            await db.SaveChangesAsync();
            return true;
        }

        // Update a User from the database (the financial adviser is retrieved automatically)
        public async Task<bool> Update(string id, IdentityUser item)
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

        public void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
        }


        public async Task<bool> isUserNameExist(string userName, string Id)
        {
            return await db.Users.AnyAsync(u => u.UserName == userName && (Id == null || u.Id != Id));
        }
    }
}