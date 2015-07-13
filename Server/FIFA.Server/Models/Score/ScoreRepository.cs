using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using FIFA.Server.Models;
using System.Data.Entity;

namespace FIFA.Server.Models
{
    public class ScoreRepository : IScoreRepository
    {
        private FIFAServerContext db = new FIFAServerContext();

        public ScoreRepository()
        {

        }
        
        // Get all the Scores ordered by name / scores
        public async Task<IEnumerable<Score>> GetAll()
        {
            IEnumerable<Score> scores = await db.Scores
                .ToListAsync();

            return scores;
        }

        public async Task<IEnumerable<Score>> GetAllWithFilter(ScoreFilter filter)
        {
            return await FilterScores(db.Scores, filter).ToListAsync();
        }

        private IQueryable<Score> FilterScores(IQueryable<Score> query, ScoreFilter filter)
        {
            if (filter != null)
            {
                if (filter.Id != 0)
                {
                    query = query.Where(m => m.Id == filter.Id);
                }

                if (filter.MatchId != 0)
                {
                    query = query.Where(m => m.MatchId == filter.MatchId);
                }
                
                if (filter.PlayerId != 0)
                {
                    query = query.Where(m => m.PlayerId == filter.PlayerId);
                }
                
                
                if (filter.Goals != 0)
                {
                    query = query.Where(m => m.Goals == filter.Goals);
                }

                if (filter.Location != 0)
                {
                    query = query.Where(m => m.Location == filter.Location);
                }
                
            }

            return query;
        }

        // Get one Score by its ID
        public async Task<Score> Get(int id)
        {
            return await db.Scores.FindAsync(id);
        }


        // Add one Score
        public async Task<Score> Add(Score item){
            db.Scores.Add(item);
            await db.SaveChangesAsync();
            return item;
        }

        // Update a Score by its ID
        public async Task<bool> Update(int id, Score item){

            if (item == null)
            {
                return false;
            }
            item.Id = id;

            db.Entry(item).State = EntityState.Modified;
            await db.SaveChangesAsync();

            return true;
        }

        // remove a Score by its id
        public async Task<bool> Remove(int id){
            
            Score Score = db.Scores.Find(id);
            if (Score == null)
            {
                return false;
            }

            db.Scores.Remove(Score);
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
        

    }
}