using FIFA.Server.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Threading.Tasks;
using System.Data.Entity;
using System.Linq.Expressions;

namespace FIFA.Server.Models
{
    /// <summary>
    /// An adapter of a <see cref="DbSet"/> into a <see cref="ICRUDRepository{TObject, TKey, TFilter}"/>.
    /// It stores objects of type <typeparamref name="TObject"/>, keyed by <typeparamref name="TKey".
    /// It is instantiated with a default ordering key <typeparamref name="TOrderingKey"/> 
    /// and can be filtered using a <see cref="IQueryFilter{TObject}"/>.
    /// </summary>
    /// <typeparam name="TObject">The type of objects stored in it.</typeparam>
    /// <typeparam name="TKey">Type of the key on the object.</typeparam>
    /// <typeparam name="TOrderingKey">Type of the field that provides default ordering.</typeparam>
    public class DbSetRepository<TObject, TKey, TOrderingKey> : ICRUDRepository<TObject, TKey, IQueryFilter<TObject>> where TObject : class
    {
        private DbContext db;
        private DbSet<TObject> objects;
        private Action<TObject, TKey> keySetter;
        private Expression<Func<TObject, TOrderingKey>> orderingKeyExtractor;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <remarks>Both the <paramref name="keySetter"/> and the <paramref name="orderingKeyExtractor"/> 
        /// are likely to be passed in as lambda expressions.
        /// I considered giving them a common expression or delegate type but after looking at
        /// http://stackoverflow.com/questions/767733/converting-a-net-funct-to-a-net-expressionfunct
        /// decided it was a better to let the compiler manage the difference between them.
        /// </remarks>
        /// <param name="db">Needed to manage the saving of objects.</param>
        /// <param name="objects"></param>
        /// <param name="keySetter">Action needed to set the key field (type <typeparamref name="TKey"/> on the <typeparamref name="TObject"/> </param>
        /// <param name="orderingKeyExtractor">Linq expression used to extract field used for default ordering.</param>
        public DbSetRepository(DbContext db, DbSet<TObject> objects, Action<TObject, TKey> keySetter, Expression<Func<TObject, TOrderingKey>> orderingKeyExtractor)
        {
            this.db = db;
            this.objects = objects;
            this.keySetter = keySetter;
            this.orderingKeyExtractor = orderingKeyExtractor;
        }

        async Task<TObject> ICRUDRepository<TObject, TKey, IQueryFilter<TObject>>.Add(TObject item)
        {
            objects.Add(item);
            await db.SaveChangesAsync();
            return item;
        }

        void ICRUDRepository<TObject, TKey, IQueryFilter<TObject>>.Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
        }

        async Task<TObject> ICRUDRepository<TObject, TKey, IQueryFilter<TObject>>.Get(TKey id)
        {
            return await objects.FindAsync(id);
        }

        async Task<IEnumerable<TObject>> ICRUDRepository<TObject, TKey, IQueryFilter<TObject>>.GetAll()
        {
            return await AsOrderedListAsync(objects);
        }

        private Task<List<TObject>> AsOrderedListAsync(IQueryable<TObject> queryable)
        {
            return queryable.OrderBy(orderingKeyExtractor).ToListAsync();
        }

        async Task<IEnumerable<TObject>> ICRUDRepository<TObject, TKey, IQueryFilter<TObject>>.GetAllWithFilter(IQueryFilter<TObject> filter)
        {
            return await AsOrderedListAsync(filter.Filter(objects));
        }

        async Task<bool> ICRUDRepository<TObject, TKey, IQueryFilter<TObject>>.Remove(TKey id)
        {
            TObject item = objects.Find(id);
            if (item == null)
            {
                return false;
            }

            objects.Remove(item);
            await db.SaveChangesAsync();

            return true;
        }

        async Task<bool> ICRUDRepository<TObject, TKey, IQueryFilter<TObject>>.Update(TKey id, TObject item)
        {
            if (item == null)
            {
                return false;
            }
            keySetter(item, id);

            db.Entry(item).State = EntityState.Modified;
            await db.SaveChangesAsync();

            return true;
        }

        public async Task<bool> AnyAsync(Expression<Func<TObject, bool>> predicate)
        {
            return await objects.AnyAsync(predicate);
        }
    }
}