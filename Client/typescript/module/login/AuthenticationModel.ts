module FifaLeagueClient.Module.Login {

  export class AuthenticationModel
  {
      public isAuth:boolean;
      public userName:string;
      public password: string;

      constructor(){
        this.isAuth = false;
        this.userName = "";
        this.password = "";
      }
  }

}
