using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace FIFA.Server.Models
{
    public interface IScoreRepository : ICRUDRepository<Score, int, ScoreFilter>
    {
    }
}
