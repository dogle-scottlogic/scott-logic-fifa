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
    public class CountryController : ApiController
    {
        private FIFAServerContext db = new FIFAServerContext();

        // GET api/Country
        public IQueryable<Season> GetSeasons()
        {
            return db.Seasons;
        }

        // GET api/Country/5
        [ResponseType(typeof(Season))]
        public async Task<IHttpActionResult> GetSeason(int id)
        {
            Season season = await db.Seasons.FindAsync(id);
            if (season == null)
            {
                return NotFound();
            }

            return Ok(season);
        }

        // PUT api/Country/5
        public async Task<IHttpActionResult> PutSeason(int id, Season season)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != season.Id)
            {
                return BadRequest();
            }

            db.Entry(season).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SeasonExists(id))
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

        // POST api/Country
        [ResponseType(typeof(Season))]
        public async Task<IHttpActionResult> PostSeason(Season season)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Seasons.Add(season);
            await db.SaveChangesAsync();

            return CreatedAtRoute("DefaultApi", new { id = season.Id }, season);
        }

        // DELETE api/Country/5
        [ResponseType(typeof(Season))]
        public async Task<IHttpActionResult> DeleteSeason(int id)
        {
            Season season = await db.Seasons.FindAsync(id);
            if (season == null)
            {
                return NotFound();
            }

            db.Seasons.Remove(season);
            await db.SaveChangesAsync();

            return Ok(season);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool SeasonExists(int id)
        {
            return db.Seasons.Count(e => e.Id == id) > 0;
        }
    }
}