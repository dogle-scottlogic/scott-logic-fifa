﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using FIFA.Server.Models;
using System.Data.Entity;

namespace FIFA.Server.Models
{
    public class LeagueRepository : ILeagueRepository
    {
        private FIFAServerContext db = new FIFAServerContext();

        public LeagueRepository() { }
        
        public async Task<IEnumerable<League>> GetAll()
        {
            return await db.Leagues.ToListAsync();
        }

        public async Task<IEnumerable<League>> GetAllWithFilter(LeagueFilter filter)
        {
            return await FilterLeagues(db.Leagues, filter).ToListAsync();
        }

        private IQueryable<League> FilterLeagues(IQueryable<League> query, LeagueFilter filter)
        {
            if (filter != null)
            {
                if (filter.Id != 0)
                {
                    query = query.Where(l => l.Id == filter.Id);
                }

                if (!String.IsNullOrEmpty(filter.Name))
                {
                    query = query.Where(l => l.Name.Contains(filter.Name));
                }

                if (filter.SeasonId != 0)
                {
                    query = query.Where(l => l.SeasonId == filter.SeasonId);
                }
                
            }

            return query;
        }

        public async Task<League> Get(int id)
        {
            League league = await db.Leagues.Where(l => l.Id == id).Include(s => s.Season).FirstAsync();
            return league;
        }

        public async Task<League> Add(League item)
        {
            db.Leagues.Add(item);
            await db.SaveChangesAsync();
            return item;
        }

        public async Task<bool> Update(int id, League item)
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
            League league = db.Leagues.Find(id);

            if (league == null)
            {
                return false;
            }

            db.Leagues.Remove(league);
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
         * Verify if the league name already exists for this season
         **/
        public async Task<bool> isLeagueNameExist(int seasonId, string leagueName, int? Id)
        {
            return await db.Leagues.AnyAsync(l => l.Name == leagueName && l.SeasonId == seasonId && (Id == null || l.Id != Id));
        }
    }
}