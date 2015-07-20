using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace FIFA.Server.Models
{
    public interface IMatchViewRepository
    {
        Task<List<ResultViewModel>> GetAll(MatchViewFilter filter);
    }
}
