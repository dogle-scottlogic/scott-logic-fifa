module FifaLeagueClient.Module.Team {
	export class TeamModel {
		public Id: number;
		public Name: string;
		public CountryId: number;
		public Country: Country.CountryModel;

		constructor(data){
            if (data != null){
                this.Id = data.Id;
                this.Name = data.Name;
                this.CountryId = data.CountryId;
                this.Country = data.Country;
            }
        }
	}
}