// Season INIT

// build a dataRepository with the results
resultView_buildDataRepository = function() {
    return [new FifaLeagueClient.Module.Results.ResultViewModel(
        {
            Date: "01012015",
            countryMatches: [
              {
                Id: 1,
                Name: "Scotland"
              },
              {
                Id: 2,
                Name: "Germany"
              }
          ]
        }),
        new FifaLeagueClient.Module.Results.ResultViewModel(
            {
                Date: "02012015",
                countryMatches: [
                  {
                    Id: 1,
                    Name: "Scotland"
                  }
              ]
            })
    ];
}

getresultByCountryId = function(dataRepository, countryId){
  var dataToReturn = [];

  for(var i=0; i<dataRepository.length;i++)
  {
      var resultView = dataRepository[i];
      var countries = [];

      for(var j=0; j<resultView.countryMatches.length;j++)
      {
          var country = resultView.countryMatches[j];

          if (country.Id == countryId) {
              countries.push(resultView.countryMatches[j]);
          }
      }

      if(countries.length > 0){
          var result = new FifaLeagueClient.Module.Results.ResultViewModel({Date:resultView.Date,countryMatches:countries});
          dataToReturn.push(result);
      }

  }
  return dataToReturn;
}

// mocking the backend
resultView_mockHTTPBackend = function(config, $httpBackend, $q, dataRepository){

    var mockedResultViewGetList = $httpBackend.whenGET(config.backend+"api/ResultView?PlayedMatch=true")
        .respond(function (method, url, data, headers) {
            return [200,dataRepository];
        });


    var mockedResultViewGetList = $httpBackend.whenGET(/\/api\/ResultView\?CountryId=[1-9][0-9]*/)
        .respond(function (method, url, data, headers) {
            var urlSplited = url.split("=");
            var urlCountrySplited = urlSplited[1].split("&");

            var countryId = urlCountrySplited[0];

            var dataToReturn = getresultByCountryId(dataRepository, countryId);

            return [200,dataToReturn];
        });

    return mockedResultViewGetList;

}


// mocking the backend in error case
resultView_mockHTTPBackend_Error = function(config, $httpBackend, $q, dataRepository){

    $httpBackend.whenGET(config.backend+"api/ResultView?PlayedMatch=true")
        .respond(0,{status:0});


}
