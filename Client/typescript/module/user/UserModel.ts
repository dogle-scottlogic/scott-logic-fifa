module FifaLeagueClient.Module.User {
    export class UserModel {

        public Id:string;
        public Name: string;
        public Password: string;
        public ConfirmPassword: string;

        // build the model directly from the data returned by the service
        constructor(data){
            if(data != null){
                this.Id = data.Id;
                this.Name = data.Name;
                this.Password = data.Password;
                this.ConfirmPassword = data.ConfirmPassword;
            }
        }
    }
}
