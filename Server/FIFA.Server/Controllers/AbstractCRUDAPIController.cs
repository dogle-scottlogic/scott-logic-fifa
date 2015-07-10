using System;
using System.Collections.Generic;
using System.Web.Http;
using System.Threading.Tasks;
using System.Net.Http;
using System.Net;
using System.Collections;
using System.Web.Mvc;
using System.Web.Http.Description;
using FIFA.Server.Models;

namespace FIFA.Server.Controllers
{
    public abstract class AbstractCRUDAPIController<TObject, TKey, TFilter> : ApiController
    {

        protected ICRUDRepository<TObject, TKey, TFilter> repository;

        protected AbstractCRUDAPIController(ICRUDRepository<TObject, TKey, TFilter> repository)
        {
            this.repository = repository;
        }

        protected async Task<HttpResponseMessage> GetAll()
        {
            IEnumerable<TObject> objectList = await repository.GetAll();
            return Request.CreateResponse<IEnumerable<TObject>>(HttpStatusCode.OK, objectList);
        }

        protected async Task<HttpResponseMessage> GetAllWithFilter(TFilter filter)
        {
            IEnumerable<TObject> objectList = await repository.GetAllWithFilter(filter);
            return Request.CreateResponse<IEnumerable<TObject>>(HttpStatusCode.OK, objectList);
        }

        protected async Task<HttpResponseMessage> Get(TKey id)
        {
            TObject item = await repository.Get(id);

            if (item == null)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }
            return Request.CreateResponse(HttpStatusCode.OK, item);
        }

        protected async Task<HttpResponseMessage> Post(TObject item)
        {
            if (item == null)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Item is empty");

            }
            else if (ModelState.IsValid)
            {
                item = await repository.Add(item);
                var response = Request.CreateResponse<TObject>(HttpStatusCode.Created, item);

                return response;
            }
            else
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }
        }

        protected async Task<HttpResponseMessage> Put(TKey id, TObject item)
        {
            if (item == null)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Item is empty");

            }
            else if (ModelState.IsValid)
            {
                if (!await repository.Update(id, item))
                {
                    return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
                }

                var response = Request.CreateResponse<TObject>(HttpStatusCode.Created, item);

                return response;

            }
            else
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }
        }

        protected async Task<HttpResponseMessage> Delete(TKey id)
        {
            if (!await repository.Remove(id))
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, "Item not found");
            }

            return Request.CreateResponse(HttpStatusCode.OK);
        }

    }
}