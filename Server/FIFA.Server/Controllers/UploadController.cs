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
using FIFA.Server.Authentication;

namespace FIFA.Server.Controllers
{
    [IdentityBasicAuthentication] // Enable authentication via an ASP.NET Identity user name and password
    [Authorize] // Require authenticated requests.
    public class UploadController : ApiController
    {
        private FIFAServerContext db = new FIFAServerContext();

        // GET api/Upload
        public IQueryable<Upload> GetUploads()
        {
            return db.Uploads;
        }

        // GET api/Upload/5
        [ResponseType(typeof(Upload))]
        public async Task<IHttpActionResult> GetUpload(int id)
        {
            Upload upload = await db.Uploads.FindAsync(id);
            if (upload == null)
            {
                return NotFound();
            }

            return Ok(upload);
        }

        // PUT api/Upload/5
        public async Task<IHttpActionResult> PutUpload(int id, Upload upload)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != upload.Id)
            {
                return BadRequest();
            }

            db.Entry(upload).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UploadExists(id))
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

        // POST api/Upload
        [ResponseType(typeof(Upload))]
        public async Task<IHttpActionResult> PostUpload(Upload upload)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Uploads.Add(upload);
            await db.SaveChangesAsync();

            return CreatedAtRoute("DefaultApi", new { id = upload.Id }, upload);
        }

        // DELETE api/Upload/5
        [ResponseType(typeof(Upload))]
        public async Task<IHttpActionResult> DeleteUpload(int id)
        {
            Upload upload = await db.Uploads.FindAsync(id);
            if (upload == null)
            {
                return NotFound();
            }

            db.Uploads.Remove(upload);
            await db.SaveChangesAsync();

            return Ok(upload);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool UploadExists(int id)
        {
            return db.Uploads.Count(e => e.Id == id) > 0;
        }
    }
}