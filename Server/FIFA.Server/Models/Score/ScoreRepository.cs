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

        public ScoreRepository(){ }

        public async Task<IEnumerable<Score>> GetAll() {
            IEnumerable<Score> scores = await db.Scores
                .Include(s => s.Match).Include(s => s.TeamPlayer)
                .ToListAsync();

            return scores;
        }

        public async Task<IEnumerable<Score>> GetAllWithFilter(ScoreFilter filter)
        {
            return await FilterScores(db.Scores, filter).Include(s => s.Match).Include(s => s.TeamPlayer).ToListAsync();
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
                    query = query.Where(m => m.TeamPlayer.PlayerId == filter.PlayerId);
                }
                
                if (filter.Goals != 0)
                {
                    query = query.Where(m => m.Goals == filter.Goals);
                }

                if (filter.Location != 0)
                {
                    query = query.Where(m => m.Location == filter.Location);
                }

                if (filter.MatchPlayed != null) {
                    query = query.Where(m => m.Match.Played == filter.MatchPlayed);
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

        /// <summary>
        /// Update the score when we know its match ID, player and location
        /// </summary>
        /// <param name="score"></param>
        /// <returns>true if successful, false otherwise</returns>
        public async Task<bool> UpdateFromMatchResult(Score score)
        { 
            // we know the match ID and teamPlayer ID
            // we can retrieve the score and update it  
            // the 'AsNoTracking' function to avoid the situation when 
            // the retrieved model is in Detached state and then we want to modify it
            // => that would lead to an exception
            Score existing = db.Scores.AsNoTracking().Where(s => s.MatchId == score.MatchId && s.TeamPlayerId == score.TeamPlayerId 
                                                && s.Location == score.Location).FirstOrDefault();
            score.Id = existing.Id;
            // once we have the existing score, we update it with our argument
            // if we haven't found a score, the update fails
            return existing != null ? await Update(score.Id, score) : false;
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