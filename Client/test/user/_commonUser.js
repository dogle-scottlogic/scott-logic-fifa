function createUserList() {
    return [createCorrectUser(),
            new FifaLeagueClient.Module.User.UserModel(
            {
              Id: 2,
              Name: "Jack",
              Password:"pwd",
              ConfirmPassword:"pwd"
            }),
            new FifaLeagueClient.Module.User.UserModel(
            {
              Id: 3,
              Name: "Roger",
              Password:"pwd",
              ConfirmPassword:"pwd"
            })
        ];
}

function createCorrectUser() {
  return new FifaLeagueClient.Module.User.UserModel(
          {
            Id: "1",
            Name: "Tony",
            Password:"pwd",
            ConfirmPassword:"pwd"
          })
}

function createFailurePasswordUser() {
  var user = createCorrectUser();
  user.ConfirmPassword ="pAAAA";
  return user;
}
