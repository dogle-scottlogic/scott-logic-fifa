﻿using FIFA.Server.Authentication;
using Microsoft.AspNet.Identity;
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
        public async Task<IEnumerable<UserModel>> GetAll()
        {
            IEnumerable<UserModel> UserList = await queryIdentityUser(db.Users).ToListAsync();
            
            return UserList;
        }

        public async Task<IEnumerable<UserModel>> GetAllWithFilter(UserFilter filter)
        {
            IEnumerable<UserModel> UserList = await queryIdentityUser(db.Users).ToListAsync();

            return UserList;
        }
        
        // Get a User by its ID
        public async Task<UserModel> Get(string id)
        {

            UserModel user = await queryIdentityUser(db.Users.Where( u => u.Id == id)).FirstOrDefaultAsync();
            return user;
        }

        // convert an IdentityUser into UserModel
        private IQueryable<UserModel> queryIdentityUser(IQueryable<IdentityUser> queryUser)
        {
            return queryUser.Select(
                u => new UserModel
                {
                    Id = u.Id,
                    Name = u.UserName,
                    Password = null
                }
                );
        }
        
        // Adding a User to the database
        public async Task<UserModel> Add(UserModel item)
        {
            if (item == null)
            {
                throw new ArgumentNullException("item");
            }

            // We convert the userModel to IdentityUser
            IdentityUser newUser = createIdentityUser(item);
            // we attach the user to the role of user
            IdentityRole role = await db.Roles.Where(r => r.Name == AuthenticationRoles.UserRole).FirstOrDefaultAsync();
            newUser.Roles.Add(new IdentityUserRole { RoleId = role.Id, UserId = newUser.Id });
            // we claim him hasRegistered
            newUser.Claims.Add(new IdentityUserClaim
            {
                UserId = newUser.Id,
                ClaimType = "hasRegistered",
                ClaimValue = "true"
            });

            db.Users.Add(newUser);
            await db.SaveChangesAsync();

            return item;
        }

        // Update a User from the database (the financial adviser is retrieved automatically)
        public async Task<bool> Update(string id, UserModel item)
        {
            if (item == null)
            {
                return false;
            }

            // we get the user in the database and change the name / password (if not null)
            IdentityUser editedUser = db.Users.Find(id);
            if (editedUser != null)
            {
                if (!String.IsNullOrEmpty(item.Name))
                {
                    editedUser.UserName = item.Name;
                }

                // if the password is blank, we reuse the previous one
                if (!String.IsNullOrEmpty(item.Password))
                {
                    editedUser.PasswordHash = new PasswordHasher().HashPassword(item.Password);
                    editedUser.SecurityStamp = Guid.NewGuid().ToString();
                }
                
                db.Entry(editedUser).State = EntityState.Modified;
                await db.SaveChangesAsync();

                return true;
            }
            else
            {
                return false;
            }
            
        }

        // convert an UserModel to IdentityUser
        private IdentityUser createIdentityUser(UserModel user)
        {
            IdentityUser returnedUser = new IdentityUser(user.Name);
            if (!String.IsNullOrEmpty(user.Password))
            {
                returnedUser.PasswordHash = new PasswordHasher().HashPassword(user.Password);
                returnedUser.SecurityStamp = Guid.NewGuid().ToString();
            }

            return returnedUser;
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
        
        public void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
        }


        public async Task<bool> isNameExist(string name, string Id)
        {
            return await db.Users.AnyAsync(u => u.UserName == name && (Id == null || u.Id != Id));
        }
        
    }
}