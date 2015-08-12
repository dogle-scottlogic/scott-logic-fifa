﻿using FIFA.Server.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace FIFA.Server.Models
{
    public class CountryFilter : IQueryFilter<Country>
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public bool? HasRemainingMatchToPlay { get; set; }

        public IQueryable<Country> Filter(IQueryable<Country> query)
        {
            if (this.Id != 0)
            {
                query = query.Where(m => m.Id == this.Id);
            }

            if (!String.IsNullOrEmpty(this.Name))
            {
                query = query.Where(m => m.Name.Contains(this.Name));
            }

            if (this.HasRemainingMatchToPlay != null)
            {
                if (this.HasRemainingMatchToPlay.Value)
                {
                    query = query.Where(c => c.Seasons.Any(s => s.Leagues.Any(l => l.Matches.Any(m => m.Played == false))));
                }
                else
                {
                    query = query.Where(c => c.Seasons.All(s => s.Leagues.All(l => l.Matches.All(m => m.Played == true))));
                }
            }

            return query;
        }

    }
}