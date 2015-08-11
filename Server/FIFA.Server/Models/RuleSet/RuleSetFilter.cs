using System.Collections.Generic;

namespace FIFA.Server.Models
{
    public class RuleSetFilter
    {
        /// <summary>
        /// To make use of the ICRUDRepository we have implemented a filter that currently does nothing. The alternative
        /// was to have a more generic Repo and Controller and have the current one and this extend it, but that seems
        /// more disruptive when we might make use of this filter anyway.
        /// </summary>
        /// <param name="ruleSet"></param>
        /// <returns></returns>
        public bool accepts(RuleSet ruleSet)
        {
            return true;
        }
    }
}