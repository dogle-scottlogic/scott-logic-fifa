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
    public class PlayerController : ApiController
    {
        private FIFAServerContext db = new FIFAServerContext();

        // GET api/Player
        public IQueryable<Player> GetPlayers()
        {
            return db.Players.Include(p => p.Leagues);
        }

        // GET api/Player/5
        [ResponseType(typeof(Player))]
        public async Task<IHttpActionResult> GetPlayer(int id)
        {
            Player player = await db.Players.Where(p => p.Id == id).Include(p => p.Leagues).FirstAsync();
            if (player == null)
            {
                return NotFound();
            }

            return Ok(player);
        }

        // PUT api/Player/5
        public async Task<IHttpActionResult> PutPlayer(int id, Player player)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != player.Id)
            {
                return BadRequest();
            }

            db.Entry(player).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PlayerExists(id))
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

        // POST api/Player
        [ResponseType(typeof(Player))]
        public async Task<IHttpActionResult> PostPlayer(Player player)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Players.Add(player);
            await db.SaveChangesAsync();

            return CreatedAtRoute("DefaultApi", new { id = player.Id }, player);
        }

        // DELETE api/Player/5
        [ResponseType(typeof(Player))]
        public async Task<IHttpActionResult> DeletePlayer(int id)
        {
            Player player = await db.Players.FindAsync(id);
            if (player == null)
            {
                return NotFound();
            }

            db.Players.Remove(player);
            await db.SaveChangesAsync();

            return Ok(player);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool PlayerExists(int id)
        {
            return db.Players.Count(e => e.Id == id) > 0;
        }
    }
}