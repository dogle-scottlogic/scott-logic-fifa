/// <reference path="../../common/controllers/AbstractController.ts" />

module FifaLeagueClient.Module.Team {

    export class SeasonMatches {
        public SeasonId:number;
        public SeasonName: string;
        public TeamPlayerMatches: TeamPlayerChartModel[];
    }

    export class TeamPlayerChartModel {
        public Date: Date;
        public SeasonId:string;
        public SeasonName: string;
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
        chartId:string;

        static $inject = ["$scope", 'resultViewService'];

        constructor(scope, resultViewService:Results.ResultViewService) {
            super(scope);
            this.mainService = resultViewService;
            this.resultFilter = new Results.ResultViewFilter();
            this.resultFilter.PlayedMatch = true;

            this.chartId = "teamPlayerChart";
            if (this.scope.teamplayerid){
                this.chartId +=this.scope.teamplayerid;
            } else {
                this.chartId +=this.scope.playerid;
            }
        }

        // Get the statistics from a teamPlayer
        public loadTeamPlayerChart = () => {
            this.resultFilter.SeasonId = this.scope.seasonid;
            this.resultFilter.TeamPlayerId = this.scope.teamplayerid;
            this.resultFilter.PlayerId = this.scope.playerid;

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
                    if(d.Date){

                        d.countryMatches.forEach(function(country){

                            country.seasonMatches.forEach(function(season){

                                var result = new TeamPlayerChartModel();
                                result.Date = format(d.Date.split("T")[0]);
                                result.nbGoalsDiff = 0;
                                result.matches = [];
                                result.SeasonId = season.Id;
                                result.SeasonName = season.Name;

                                season.leagueMatches.forEach(function(league){

                                    league.matches.forEach(function(match){

                                        var tpm = new TeamPlayerMatch();
                                        if(match.homeTeamPlayer.Id === that.scope.teamplayerid
                                          || match.homeTeamPlayer.PlayerId === that.scope.playerid)
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

                                results.push(result);
                            });

                        });
                    }


                });

            }
            return results;
        }

        protected getGraphWidth(margin:any){
            return this.getSVGWidth() - margin.left - margin.right - 100;
        }

        protected getSVGWidth(){

            var width = this.scope.parentcontext.parentNode.clientWidth;

            // We loop to the parent until finding a width (this because it can be in an accordeon which doesn't have with anymore)
            var maxLoop = 10;
            var parentNode = this.scope.parentcontext.parentNode.parentNode;

            while(width == 0 && maxLoop > 0 && parentNode){
                maxLoop--;
                width = parentNode.clientWidth;
                parentNode = parentNode.parentNode;
            }

            return width;
        }


        protected getNbTicks(width:number){
            var nbTicks = width/100;
            return nbTicks;
        }

        protected handleLoadResultSuccess = (data:Results.ResultViewModel[]) => {


            // Creating a results object with only what is usefull
            var convertedData = this.convertData(data);

            // we display the graph only if we have at least 2 results
            if(convertedData.length > 1){

                var chartId = "#"+this.chartId;

                // Draw a chart with the results
                var margin = {top: 20, right: 20, bottom: 30, left: 50},
                    width = this.getGraphWidth(margin),
                    height = this.scope.height - margin.top - margin.bottom;

                var svg = d3.select(chartId).select("svg");
                // removing the previous graph
                if(svg){
                    svg.remove();
                }

                svg = d3.select(chartId).append("svg")
                    .attr("width", "100%")
                    .attr("height", this.scope.height)
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

                var that = this;

                // Creating the x domain
                x.domain(d3.extent(convertedData, function(d:any) { return d.Date; }));

                // Creating the y domain with the nb goals
                y.domain(d3.extent(convertedData, function(d:any) { return (d.nbGoalsDiff); }));

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


              // grouping lines by season
              var dataGroupedBySeason = d3.nest()
                  .key(function(d:TeamPlayerChartModel){return d.SeasonId;})
                  .rollup(function(v:any){return v;})
                  .entries(convertedData);

                // For each season we create differents lines
                var lineClassI = 0;
                dataGroupedBySeason.forEach(function(seasonMatcheToReturn){

                    var currentSeasonClass = "seasonChart"+lineClassI;

                    var results = seasonMatcheToReturn.values;

                    svg.append("path")
                      .datum(results)
                      .attr("class", "line "+currentSeasonClass)
                      .attr("d", line);

                    that.displayMatchToolTip(svg, results, x, y);

                    // Display the tooltip of the seasons
                    that.displaySeasonToolTip(svg, x, y, height, currentSeasonClass);

                    lineClassI++;

                });




                function resize() {

                    // update width
                    width = that.getGraphWidth(margin);

                    // reset x range
                    x.range([5, width]);

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

        // function to display the match tooltip
        protected displayMatchToolTip = (svg, results, x, y) => {

            var that = this;

            var div = d3.select("body").append("div")
                .attr("class", "matchTooltip")
                .style("opacity", 0);

            // Tooltip displaying the matches for a date
            svg.selectAll("dot")
                    .data(results)
                .enter().append("circle")
                    .attr("class", "circle")
                    .attr("r", 3)
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


        // function to display the season tooltip
        protected displaySeasonToolTip = (svg, x, y, height, currentSeasonClass) => {

          var that = this;

          // append the x line
          var lineTooltip = svg.append("line")
              .attr("class", "lineTooltip")
              .style("stroke", "blue")
              .style("stroke-dasharray", "3,3")
              .style("opacity", 0.5)
              .attr("y1", 0)
              .attr("y2", height);

          var seasonTextTooltip = svg.append("text")
              .attr("class", "seasonTextTooltip")
              .attr("y", 6)
              .attr("y1", 0)
              .attr("y2", height);

            // Tooltip displaying the season for a line
            svg.selectAll("."+currentSeasonClass)
                .on("mouseover", function(d:any) {

                        //Getting the mean of the date
                        var meanDate = d3.mean(d, function(m:any){return m.Date;});

                        seasonTextTooltip.text(that.showSeason(d[0]))
                                .attr("transform",
                                "translate(" + x(meanDate) + "," +
                                               -15 + ")")
                                     .attr("y2", height).transition()
                                         .duration(200)
                                         .style("opacity", .9);

                        // Displaying the X line
                        lineTooltip.attr("transform",
                        "translate(" + x(meanDate) + "," +
                                       0 + ")")
                             .attr("y2", height).transition()
                                 .duration(200)
                                 .style("opacity", .9);
                    })
                    .on("mouseout", function(d) {
                        seasonTextTooltip.transition()
                            .duration(500)
                            .style("opacity", 0);

                        // Hidding the X line
                        lineTooltip.transition()
                            .duration(500)
                            .style("opacity", 0);

                    });

        }

        protected showSeason = (result) => {
            var show = result.SeasonName;
            return show;
        }

        // Method adding loading errors in errors list
        protected handleLoadErrors = (config) => {
            this.errors = config.errors;
        }

    }

}
