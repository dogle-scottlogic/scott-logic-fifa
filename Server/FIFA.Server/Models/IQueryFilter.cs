using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FIFA.Server.Models
{
    public interface IQueryFilter<TObject>
    {
        IQueryable<TObject> Filter(IQueryable<TObject> query);
    }
}
