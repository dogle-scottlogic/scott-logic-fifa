﻿using System;
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
        private FIFAServerContext db;

        public SeasonRepository(FIFAServerContext db)
        {
            this.db = db;
        }
        
        // Get all the Seasons ordered by name / seasons
        public async Task<IEnumerable<Season>> GetAll()
        {
            IEnumerable<Season> seasons = await db.Seasons
                .Include(s => s.SeasonCountry)
                .Include(s => s.RuleSet)
                .OrderBy(s => s.Name)
                .ToListAsync();

            return seasons;
        }

        public async Task<IEnumerable<Season>> GetAllWithFilter(SeasonFilter filter)
        {
            return await FilterSeasons(db.Seasons.Include(s => s.SeasonCountry).Include(s => s.RuleSet), filter)
                .OrderBy(s => s.Name)
                .ToListAsync();
        }

        private IQueryable<Season> FilterSeasons(IQueryable<Season> query, SeasonFilter filter)
        {
            if (filter != null)
            {
                query = filter.FilterSeasons(query);

            }

            return query;
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


            ICollection<League> leagues = db.Leagues.Where(l => l.SeasonId == id).ToList();

            // we remove all the leagues of the season
            foreach (League league in leagues)
            {
                // but first we remove all the matches of the league
                var query = db.Matches.Where(m => m.League.Id == league.Id);

                if(query.Count() > 0)
                {
                    ICollection<Match> matches = query.ToList();

                    foreach(Match match in matches)
                    {
                    db.Matches.Remove(match);
                    }
                }

                db.Leagues.Remove(league);
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