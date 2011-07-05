var util=require('util'),
    rest=require('restler'),
    BASE_URL='http://ffapi.fanfeedr.com/',
    fanfeedr=exports;
    
fanfeedr.init=function(key,tier){
    this.key=key;
    this.tier=tier||fanfeedr.tiers.basic;
};
var Resource={
    newResourceType:function(name){
        return Object.create(this,{
            name:{
                value:name
            }
        });
    },
    newChildResource:function(id){
        return this.name+'/'+id;    
    }
};
fanfeedr.resources={
    sport:Resource.newResourceType('leagues'),
    league:Resource.newResourceType('conferences'),
    division:Resource.newResourceType('divisions'),
    team:Resource.newResourceType('teams'),
    event:Resource.newResourceType('events'),
    person:Resource.newResourceType('persons')
    //geo:'geo'
};

//tier for the API. Ref: http://developer.fanfeedr.com/page/API_Plans_and_Pricing
fanfeedr.tiers={
    basic:'basic',
    bronze:'bronze',
    silver:'silver',
    gold:'gold',
    enterprise:'enterprise'
};

//leagues resources
fanfeedr.sports={
    boxing:"1fa67523-cef0-5a64-9e21-9af5631109d5", 
    formula:"6a72f772-9933-5d28-abfb-11fdcfbf7ec7", 
    mlb:"20f0857f-3c43-5f50-acfc-879f838ee853", 
    nascar:"d40e07a0-8ff8-5e23-b7be-2f212e3bd307",
    nba:"f65226d8-fbf7-5033-a7a0-50de55b57968", 
    nfl:"13962b74-cab5-5d0a-93c8-466b6a3fa342",
    nhl:"8e5c52c9-b7c0-5343-8141-122e12fdc48f", 
    pga:"92c56b74-7860-58ef-8f3d-92402d0fe0cb",
    racing:"f6ad29be-2699-5e5e-841c-1c04a2f5dbd4",
    football:"0a3c27d2-a655-58e4-a49c-9f3c7411c710",
    tennis:"0f4005bb-b854-5c65-9f28-d564c2e0b7f8"
};
fanfeedr.footballLeagues=[
    {"id": "4c941317-f28f-5171-bc19-ce1879939413", "name": "Champions League"}, 
    {"id": "7e7974b0-53d3-5432-b3f4-3777c6d9984e", "name": "UEFA"}, 
    {"id": "c034e93e-7f70-5ea3-97b5-5f6e09991e45", "name": "Bundesliga"}, 
    {"id": "0872ff0e-7708-5b81-bc5e-b7fcc382b3a8", "name": "Eredivisie"}, 
    {"id": "4de88ed7-51c3-54c0-80c2-6819e1d13d47", "name": "Ligue 1"}, 
    {"id": "b3c0d93e-ce60-5984-ba07-801e4064ed52", "name": "Primera"},
    {"id": "c9f96582-058d-5bf3-b459-4d98ce3b5aec", "name": "MLS"}, 
    {"id": "8e651af0-93cf-5959-8f55-416533f2c411", "name": "Premier League"}, 
    {"id": "1b67d32e-ff01-5c36-89dc-67dd64a14bb8", "name": "La Liga"}, 
    {"id": "569d24c6-c774-5970-97c7-b3be76091579", "name": "Serie A"}, 
    {"id": "6982f90d-2df8-5c0f-8ace-51daa7a50c54", "name": "National Team"}
];
//LOW_LEVEL API
//SPORTS
//get all sports
fanfeedr.getSports=function(callback){
    jsonRequest(this.resources.sport.name,callback);
};
//get sport description
fanfeedr.getSport=function(sportId,callback){
    jsonRequest(this.resources.sport.newChildResource(sportId),callback);
};
//LEAGUES
//get leagues
fanfeedr.getLeagues=function(sportId,callback){
    jsonRequest(this.resources.sport.newChildResource(sportId)+'/'+this.resources.league.name,callback);
};
//get league
fanfeedr.getLeague=function(sportId,leagueId,callback){
    jsonRequest(this.resources.sport.newChildResource(sportId)+'/'+this.resources.league.newChildResource(leagueId),callback);
};
//TEAMS
//get all teams for sport
fanfeedr.getTeams=function(sportId,callback){
    jsonRequest(this.resources.sport.newChildResource(sportId)+'/'+this.resources.team.name,callback);
};
//get all teams from conference
fanfeedr.getLeagueTeams=function(leagueId,callback){
    jsonRequest(this.resources.league.newChildResource(leagueId)+'/'+this.resources.team.name,callback);
};
//get team information
fanfeedr.getTeam=function(teamId,callback){
    jsonRequest(this.resources.team.newChildResource(teamId),callback);
};
//get team roster
fanfeedr.getTeamRoster=function(teamId,callback){
    jsonRequest(this.resources.team.newChildResource(teamId)+'/roster',callback);
};
//get team standings
fanfeedr.getTeamStandings=function(teamId,callback){
    jsonRequest(this.resources.team.newChildResource(teamId)+'/standings',callback);
};
//EVENTS
//last events for sport
fanfeedr.lastSportEvents=function(sportId,callback){
    jsonRequest(this.resources.sport.newChildResource(sportId)+'/last',callback);
};
//today events for sport
fanfeedr.todaySportEvents=function(sportId,callback){
    jsonRequest(this.resources.sport.newChildResource(sportId)+'/today',callback);
};
//next events for sport
fanfeedr.nextSportEvents=function(sportId,callback){
    jsonRequest(this.resources.sport.newChildResource(sportId)+'/next',callback);
};
//full event info
fanfeedr.getEventDetails=function(eventId,callback){
    jsonRequest('events/'+eventId,callback);
};
//PERSONS
fanfeedr.getPersons=function(resourcePath,callback){
    jsonRequest(resourcePath+'/persons',callback);
};
var jsonRequest=function(resource,callback){
    var url=BASE_URL+fanfeedr.tier+'/api/'+ resource+'?api_key='+fanfeedr.key;
    util.log('Request to '+url);
    rest.get(url)
        .on('complete',function(data){callback(undefined,data);})
        .on('error',function(err){callback(err);});
};
