using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace FIFA.Server.Models
{
    public class RuleSetRepository : IRuleSetRepository
    {
        private FIFAServerContext db;

        public RuleSetRepository(FIFAServerContext db)
        {
            this.db = db;
        }

        public async Task<RuleSet> Add(RuleSet item)
        {
            db.RuleSets.Add(item);
            await db.SaveChangesAsync();
            return item;
        }

        public async Task<List<Match>> createMatchAndScore(IEnumerable<TeamPlayer> teamPlayers, int ruleSetId)
        {
            var numLegsPerOpponent = (await this.Get(ruleSetId)).LegsPlayedPerOpponent;
            return MatchCreationHelper.create(teamPlayers, numLegsPerOpponent);
        }

        public void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
        }

        public async Task<RuleSet> Get(int id)
        {
            return await db.RuleSets.FindAsync(id);
        }

        public async Task<IEnumerable<RuleSet>> GetAll()
        {
            return await db.RuleSets.ToListAsync();
        }

        public async Task<IEnumerable<RuleSet>> GetAllWithFilter(RuleSetFilter filter)
        {
            return await db.RuleSets.Where(rs => filter.accepts(rs)).ToListAsync();
        }

        public async Task<bool> Remove(int id)
        {
            RuleSet ruleSet = db.RuleSets.Find(id);
            if (ruleSet == null)
            {
                return false;
            }

            db.RuleSets.Remove(ruleSet);
            await db.SaveChangesAsync();

            return true;
        }

        public async Task<bool> Update(int id, RuleSet item)
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
    }
}