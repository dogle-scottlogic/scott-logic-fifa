CREATE PROCEDURE [dbo].[MatchView By matchId]
(@matchId int)
AS
BEGIN
	SELECT l.Id, l.Name, m.Date, homeScore.TeamPlayerId, homeScore.Goals, awayScore.TeamPlayerId, awayScore.Goals
	FROM Matches as m
	INNER JOIN Leagues as l ON l.Id = m.League_Id
	INNER JOIN Scores as homeScore ON homeScore.MatchId = m.Id AND homeScore.Location = Location.Home
	INNER JOIN Scores as awayScore ON awayScore.MatchId = m.Id AND awayScore.Location = Location.Away
	WHERE m.Id = @matchId
END