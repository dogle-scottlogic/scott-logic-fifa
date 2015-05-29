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
    public class MatchController : ApiController
    {
        private FIFAServerContext db = new FIFAServerContext();

        // GET api/Match
        public IQueryable<Match> GetMatches()
        {
            return db.Matches;
        }

        // GET api/Match/5
        [ResponseType(typeof(Match))]
        public async Task<IHttpActionResult> GetMatch(int id)
        {
            Match match = await db.Matches.FindAsync(id);
            if (match == null)
            {
                return NotFound();
            }

            return Ok(match);
        }

        // PUT api/Match/5
        public async Task<IHttpActionResult> PutMatch(int id, Match match)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != match.Id)
            {
                return BadRequest();
            }

            db.Entry(match).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MatchExists(id))
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

        // POST api/Match
        [ResponseType(typeof(Match))]
        public async Task<IHttpActionResult> PostMatch(Match match)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Matches.Add(match);
            await db.SaveChangesAsync();

            return CreatedAtRoute("DefaultApi", new { id = match.Id }, match);
        }

        // DELETE api/Match/5
        [ResponseType(typeof(Match))]
        public async Task<IHttpActionResult> DeleteMatch(int id)
        {
            Match match = await db.Matches.FindAsync(id);
            if (match == null)
            {
                return NotFound();
            }

            db.Matches.Remove(match);
            await db.SaveChangesAsync();

            return Ok(match);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool MatchExists(int id)
        {
            return db.Matches.Count(e => e.Id == id) > 0;
        }
    }
}