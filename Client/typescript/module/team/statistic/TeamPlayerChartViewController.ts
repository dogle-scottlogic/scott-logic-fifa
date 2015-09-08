/// <reference path="../../common/controllers/AbstractController.ts" />

module FifaLeagueClient.Module.Team {

    export class TeamPlayerChartModel {
        public Date: Date;
        public nbGoalsDiff: number;
        public matches: TeamPlayerMatch[];
    }

    export class TeamPlayerMatch {
        public nbGoalsDone: number;
        public nbGoalsTaken: number;
        public teamPlayerAgainst: string;
    }

    export class TeamPlayerChartViewController extends Common.Controllers.AbstractController {

        mainService:Results.ResultViewService;
        resultFilter:Results.ResultViewFilter;


        static $inject = ["$scope", 'resultViewService'];

        constructor(scope, resultViewService:Results.ResultViewService) {
            super(scope);
            this.mainService = resultViewService;
            this.resultFilter = new Results.ResultViewFilter();
            this.resultFilter.PlayedMatch = true;
        }

        // Get the statistics from a teamPlayer
        public loadTeamPlayerChart = () => {
            this.resultFilter.SeasonId = this.scope.seasonid;
            this.resultFilter.TeamPlayerId = this.scope.teamplayerid;
            this.loadingPromise =
                this.mainService.getResultViewFilteredList(this.resultFilter)
                    .then(this.handleLoadResultSuccess)
                    .catch(this.handleLoadErrors);
        }

        private convertData = (data) =>{
            var results = [];

            if(data != null){

                var that = this;

                var format = d3.time.format("%Y-%m-%d").parse;

                data.forEach(function(d){
                    var result = new TeamPlayerChartModel();
                    if(d.Date){

                        result.Date = format(d.Date.split("T")[0]);
                        result.nbGoalsDiff = 0;
                        result.matches = [];

                        d.countryMatches.forEach(function(country){

                            country.seasonMatches.forEach(function(season){

                                season.leagueMatches.forEach(function(league){

                                    league.matches.forEach(function(match){


                                        var tpm = new TeamPlayerMatch();
                                        if(match.homeTeamPlayer.Id === that.scope.teamplayerid)
                                        {
                                            tpm.nbGoalsDone = match.homeTeamPlayer.nbGoals;
                                            tpm.nbGoalsTaken = match.awayTeamPlayer.nbGoals;
                                            tpm.teamPlayerAgainst = match.awayTeamPlayer.PlayerName;
                                        } else {
                                            tpm.nbGoalsDone = match.awayTeamPlayer.nbGoals;
                                            tpm.nbGoalsTaken = match.homeTeamPlayer.nbGoals;
                                            tpm.teamPlayerAgainst = match.homeTeamPlayer.PlayerName;
                                        }
                                        result.nbGoalsDiff += (tpm.nbGoalsDone - tpm.nbGoalsTaken);

                                        result.matches.push(tpm);
                                    });

                                });

                            });

                        });
                    }

                    // We push only if the datas are in
                    if(result.Date){
                        results.push(result);
                    }

                });

            }
            return results;
        }

        protected getGraphWidth(margin:any){
            var width = this.scope.parentcontext.parentNode.clientWidth - margin.left - margin.right - 50;
            return width;
        }


        protected getNbTicks(width:number){
            var nbTicks = width/100;
            return nbTicks;
        }

        protected handleLoadResultSuccess = (data:Results.ResultViewModel[]) => {


            // Creating a results object with only what is usefull
            var results = this.convertData(data);

            // we display the graph only if we have at least 2 results
            if(results.length > 1){

                var chartId = "#teamPlayerChart"+this.scope.teamplayerid;

                // Draw a chart with the results
                var margin = {top: 20, right: 20, bottom: 30, left: 50},
                    width = this.getGraphWidth(margin),
                    height = 125 - margin.top - margin.bottom;

                var svg = d3.select(chartId).select("svg");
                // removing the previous graph
                if(svg){
                    svg.remove();
                }

                svg = d3.select(chartId).append("svg")
                    .attr("width", "100%")
                    .attr("height", "100%")
                  .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                var x = d3.time.scale()
                    .range([5, width]);

                var y = d3.scale.linear()
                    .range([height, 0]);

                var xAxis = d3.svg.axis()
                    .scale(x)
                    .orient("bottom")
                    .ticks(this.getNbTicks(width));

                var yAxis = d3.svg.axis()
                    .scale(y)
                    .orient("left")
                    .ticks(5);

                var line = d3.svg.line()
                    .x(function(d:any) {
                        return x(d.Date);
                    })
                    .y(function(d:any) {
                        return y(d.nbGoalsDiff);
                    });

                // Creating the x domain
                x.domain(d3.extent(results, function(d:any) { return d.Date; }));

                // Creating the y domain with the nb goals
                y.domain(d3.extent(results, function(result:any) { return (result.nbGoalsDiff); }));

                svg.append("g")
                  .attr("class", "x axis")
                  .attr("transform", "translate(0," + y(0) + ")")
                  .call(xAxis);


                svg.append("g")
                  .attr("class", "y axis")
                  .call(yAxis)
                .append("text")
                  .attr("transform", "rotate(-90)")
                  .attr("y", 6)
                  .attr("dy", ".71em")
                  .style("text-anchor", "end")
                  .text("Goal diff");

                svg.append("path")
                  .datum(results)
                  .attr("class", "line")
                  .attr("d", line);

                this.displayToolTip(svg, results, x, y);

                var that = this;

                function resize() {
                    // update width
                    width = that.getGraphWidth(margin);

                    // reset x range
                    x.range([0, width]);

                    // update axes
                    svg.select('.x.axis').call(xAxis);
                    xAxis.ticks(that.getNbTicks(width));

                    // Update line position, width & height
                    svg.selectAll('.line').attr('d', line);


                  var circleToResize = svg.selectAll('circle')
                  .attr('cx', function(d, i) {
                        return x(d.Date)
                    });

                }

                // Resize function
                d3.select(window).on('resize.'+chartId, resize);

            }

        }

        // function to display a tooltip
        protected displayToolTip = (svg, results, x, y) => {

            var that = this;

            var div = d3.select("body").append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);

            svg.selectAll("dot")
                    .data(results)
                .enter().append("circle")
                    .attr("class", "circle")
                    .attr("r", 5)
                    .attr("cx", function(d:any) { return x(d.Date); })
                    .attr("cy", function(d:any) { return y(d.nbGoalsDiff); })
                    .on("mouseover", function(d:any) {
                        div.transition()
                            .duration(200)
                            .style("opacity", .9);
                        div .html(that.showMatches(d))
                            .style("left", (d3.event.pageX) + "px")
                            .style("top", (d3.event.pageY - 28) + "px");
                        })
                    .on("mouseout", function(d) {
                        div.transition()
                            .duration(500)
                            .style("opacity", 0);
                    });
        }

        protected showMatches = (result) => {
            var formatTime = d3.time.format("%d %B %Y");
            var show = formatTime(result.Date)+" : "+result.nbGoalsDiff;
            result.matches.forEach(function(match){
                show += "<br/> Against : "+ match.teamPlayerAgainst +" : "  + match.nbGoalsDone + " - " + match.nbGoalsTaken
            });
            return show;
        }

        // Method adding loading errors in errors list
        protected handleLoadErrors = (config) => {
            this.errors = config.errors;
        }

    }

}
