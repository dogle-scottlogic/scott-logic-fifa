module FifaLeagueClient.Module.Player {
    export class PlayerModel {

        public Id:number;
        public Name: string;
        public Archived: boolean;

        // build the model directly from the data returned by the service
        constructor(data){
            if(data != null){
                this.Id = data.Id;
                this.Name = data.Name;
                this.Archived = data.Archived;
            }
        }
    }
}
