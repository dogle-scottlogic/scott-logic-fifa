﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace FIFA.Server.Models
{
    public interface ILeagueRepository : ICRUDRepository<League, int>
    {
        Task<bool> isLeagueNameExist(int seasonId, string leagueName, int? Id);
    }
}
