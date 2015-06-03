using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using FIFA.Server.Models;

namespace FIFA.Server.Controllers
{
    public class LeagueController : ApiController
    {
        private FIFAServerContext db = new FIFAServerContext();

        // GET api/League
        public IQueryable<League> GetLeagues()
        {
            return db.Leagues.Include(s => s.Season).Include(p => p.Players);
        }

        // GET api/League/5
        [ResponseType(typeof(League))]
        public async Task<IHttpActionResult> GetLeague(int id)
        {
            League league = await db.Leagues.Where(l => l.Id == id).Include(s => s.Season).Include(p => p.Players).FirstAsync();
            if (league == null)
            {
                return NotFound();
            }

            return Ok(league);
        }

        // PUT api/League/5
        public async Task<IHttpActionResult> PutLeague(int id, League league)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != league.Id)
            {
                return BadRequest();
            }

            db.Entry(league).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!LeagueExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST api/League
        [ResponseType(typeof(League))]
        public async Task<IHttpActionResult> PostLeague(League league)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Leagues.Add(league);
            await db.SaveChangesAsync();

            return CreatedAtRoute("DefaultApi", new { id = league.Id }, league);
        }

        // DELETE api/League/5
        [ResponseType(typeof(League))]
        public async Task<IHttpActionResult> DeleteLeague(int id)
        {
            League league = await db.Leagues.FindAsync(id);
            if (league == null)
            {
                return NotFound();
            }

            db.Leagues.Remove(league);
            await db.SaveChangesAsync();

            return Ok(league);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool LeagueExists(int id)
        {
            return db.Leagues.Count(e => e.Id == id) > 0;
        }
    }
}