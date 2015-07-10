using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FIFA.Server.Models
{
    public interface ICRUDRepository<TObject, TKey, TFilter>
    {
        Task<IEnumerable<TObject>> GetAll();
        Task<IEnumerable<TObject>> GetAllWithFilter(TFilter filter); 
        Task<TObject> Get(TKey id);
        Task<TObject> Add(TObject item);
        Task<bool> Update(TKey id, TObject item);
        Task<bool> Remove(TKey id);
        void Dispose(bool disposing);
    }
}