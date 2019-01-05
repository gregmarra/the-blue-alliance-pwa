import Dexie from 'dexie';

const db = new Dexie('TBA-Models-v3');
db.version(1).stores({
  apiCalls: '&url',
  config: '&key',
  // awards: '&key, event_key',
  // // awardTeams: '&key, awardKey, teamKey, teamKey_year, teamKey_eventKey',
  // events: '&key, year',
  // eventAlliances: '&key',
  // eventRankings: '&key',
  // eventTeams: '&key, eventKey, teamKey, teamKey_year',
  // teams: '&key, team_number',
  // teamEventStatuses: '&key, teamKey_year, eventKey',
  // matches: '&key, event_key',
  // // matchTeams: '&key, matchKey, teamKey, teamKey_year, teamKey_eventKey',
  // media: '&key',
  // // mediaTeams: '&key, mediaKey, teamKey, teamKey_year',
});
export default db;
