namespace FIFA.Server.Migrations
{
    using FIFA.Server.Authentication;
    using FIFA.Server.Models;
    using Microsoft.AspNet.Identity;
    using Microsoft.AspNet.Identity.EntityFramework;
    using System;
    using System.Collections.Generic;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;

    internal sealed class Configuration : DbMigrationsConfiguration<FIFA.Server.Models.FIFAServerContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
        }

        protected override void Seed(FIFA.Server.Models.FIFAServerContext context)
        {
            //  This method will be called after migrating to the latest version.

            // Creating the users
            initUsers(context);

            // Populating the countries
            context.Countries.AddOrUpdate(
                c => c.Id,
                new Country { Id = 1, Name = "Scotland" }
            );
            context.SaveChanges();
            
            //Populating rule sets
            context.RuleSets.AddOrUpdate(
                rs => rs.Id,
                new RuleSet { Id = 1, Name = "Standard League", LegsPlayedPerOpponent = 2, NumPromotionPlaces = 1 },
                new RuleSet { Id = 2, Name = "Round Robin", LegsPlayedPerOpponent = 1, NumPromotionPlaces = 0 }
            );

            context.SaveChanges();

            var season = new Season { Id = 1, Name = "Scottish season", CountryId = 1, RuleSetId = 1 };
            // Populating the seasons
            if (context.Seasons.Count() == 0)
            {
                context.Seasons.AddOrUpdate(
                    s => s.Id,
                    season
                );
                context.SaveChanges();
            }

            var allPlayers = new List<Player> {
                // League 1
                new Player { Id = 1, Name = "Tony" },
                new Player { Id = 2, Name = "Jack"},
                new Player { Id = 3, Name = "Pete"},
                new Player { Id = 4, Name = "Will" },
                new Player { Id = 5, Name = "Ian" },
                new Player { Id = 6, Name = "Craig" },
                // League 2
                new Player { Id = 7, Name = "Stevie" },
                new Player { Id = 8, Name = "Graham" },
                new Player { Id = 9, Name = "Murray" },
                new Player { Id = 10, Name = "Rob" },
                new Player { Id = 11, Name = "Steven" },
                new Player { Id = 12, Name = "Nils" }
            };

            // half the players in League 1, half in 2
            var playersLeague1 = allPlayers.GetRange(0, 6);
            var playersLeague2 = allPlayers.GetRange(6, 6);


            // Populating the players
            foreach (Player player in allPlayers) {
                context.Players.AddOrUpdate(
                    p => p.Id,
                    player
                );
            }
            context.SaveChanges();

            var allTeams = new List<Team> {
                new Team { Id = 1, Name = "Rangers", CountryId = 1},
                new Team { Id = 2, Name = "Inverness CT", CountryId = 1 },
                new Team { Id = 3, Name = "Hearts", CountryId = 1 },
                new Team { Id = 4, Name = "Aberdeen", CountryId = 1 },
                new Team { Id = 5, Name = "Ross County", CountryId = 1 },
                new Team { Id = 6, Name = "Dundee United", CountryId = 1 },
                new Team { Id = 7, Name = "St Mirren", CountryId = 1 },
                new Team { Id = 8, Name = "Motherwell", CountryId = 1 },
                new Team { Id = 9, Name = "Patrick Thistle", CountryId = 1 },
                new Team { Id = 10, Name = "Hibs", CountryId = 1 },
                new Team { Id = 11, Name = "St Johnstone", CountryId = 1 },
                new Team { Id = 12, Name = "Kilmarnock", CountryId = 1 }
            };

            foreach (Team team in allTeams){
                context.Teams.AddOrUpdate(
                    t => t.Id,
                    team
                );
            }
            context.SaveChanges();


            // team & player combo
            var allTeamPlayers = new List<TeamPlayer>
            {
                // League 1
                new TeamPlayer { Id = 1, PlayerId = 1, TeamId = 5},
                new TeamPlayer { Id = 2, PlayerId = 2, TeamId = 3},
                new TeamPlayer { Id = 3, PlayerId = 3, TeamId = 2},
                new TeamPlayer { Id = 4, PlayerId = 4, TeamId = 1},
                new TeamPlayer { Id = 5, PlayerId = 5, TeamId = 4},
                new TeamPlayer { Id = 6, PlayerId = 6, TeamId = 6},
                // League 2
                new TeamPlayer { Id = 7, PlayerId = 7, TeamId = 8},
                new TeamPlayer { Id = 8, PlayerId = 8, TeamId = 7},
                new TeamPlayer { Id = 9, PlayerId = 9, TeamId = 10},
                new TeamPlayer { Id = 10, PlayerId = 10, TeamId = 11},
                new TeamPlayer { Id = 11, PlayerId = 11, TeamId = 9},
                new TeamPlayer { Id = 12, PlayerId = 12, TeamId = 12}
            };



            foreach (TeamPlayer teamPlayer in allTeamPlayers)
            {
                context.TeamPlayers.AddOrUpdate(
                    tp => tp.Id,
                    teamPlayer
                );
            }
            context.SaveChanges();
        }
        
        // Generates matches and scores for a list of players
        private List<Match> seedMatchesScores(FIFAServerContext context, List<TeamPlayer> players, Int32 scoreId, Int32 matchId)
        {
            List<Match> createdMatches = new List<Match>();

            // generate League 1 games
            foreach (TeamPlayer p1 in players)
            {
                foreach (TeamPlayer p2 in players)
                {
                    // avoid adding match for player against himself
                    if (p1.Id != p2.Id)
                    {
                        //add match & score
                        Match match = new Match { Id = matchId++};
                        context.Matches.AddOrUpdate(
                            m => m.Id,
                            match
                        );
                        context.SaveChanges();
                        createdMatches.Add(match);

                        var scoreHomePlayer1 = new Score { Id = scoreId++, MatchId = match.Id, Location = Location.Home, TeamPlayer = p1 };
                        var scoreAwayPlayer2 = new Score { Id = scoreId++, MatchId = match.Id, Location = Location.Away, TeamPlayer = p2 };
                        context.Scores.AddOrUpdate(
                            s => s.Id,
                            scoreHomePlayer1, scoreAwayPlayer2
                        );
                        context.SaveChanges();
                    }
                }

            }
            return createdMatches;
        }


        protected List<IdentityUser> initUsers(FIFAServerContext context)
        {
            // if at least one user exist we don t populate
            if (context.Users.Count() > 0)
            {
                return null;
            } else { 
                // Initializing the roles for users
                IdentityRole role = context.Roles.Add(new IdentityRole(AuthenticationRoles.UserRole));
                context.Roles.Add(role);

                IdentityRole adminRole = context.Roles.Add(new IdentityRole(AuthenticationRoles.AdministratorRole));
                context.Roles.Add(adminRole);
                context.SaveChanges();

                // Creating generic users
                var users = new List<IdentityUser>
                {
                    new IdentityUser("user1"),
                    new IdentityUser("user2"),
                    new IdentityUser("admin")
                };

                initUser(users[0], role.Id);
                context.Users.Add(users[0]);
                initUser(users[1], role.Id);
                context.Users.Add(users[1]);

                // adding the Admin role to the admin user
                initUser(users[2], role.Id);
                users[2].Roles.Add(new IdentityUserRole { RoleId = adminRole.Id, UserId = users[2].Id });
                context.Users.Add(users[2]);

                context.SaveChanges();
                return users;
            }


        }


        protected void initUser(IdentityUser user, string roleID)
        {
            user.Roles.Add(new IdentityUserRole { RoleId = roleID, UserId = user.Id });
            user.Claims.Add(new IdentityUserClaim
            {
                UserId = user.Id,
                ClaimType = "hasRegistered",
                ClaimValue = "true"
            });

            user.PasswordHash = new PasswordHasher().HashPassword("password");
            user.SecurityStamp = Guid.NewGuid().ToString();
        }
    }
}
