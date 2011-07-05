var util=require('util'),
    rest=require('restler'),
    BASE_URL='http://ffapi.fanfeedr.com/',
    fanfeedr=exports;
//init fanfeedr cleint with key and specified tier(basic by default)
fanfeedr.init=function(key,tier,debug){
    this.key=key;
    this.tier=tier||fanfeedr.tiers.basic;
    this.debug=debug||false;
};
var Resource={
    newChildResource:function(id){
        return this.name+'/'+id;    
    },
    path:function(){
        return '/'+this.name;
    }
};
var ResourceBuilder={
    newType:function(name){
        return Object.create(Resource,{
            name:{
                value:name
            }
        });
    }
};
fanfeedr.resources={
    sport:ResourceBuilder.newType('leagues'),
    league:ResourceBuilder.newType('conferences'),
    division:ResourceBuilder.newType('divisions'),
    team:ResourceBuilder.newType('teams'),
    event:ResourceBuilder.newType('events'),
    person:ResourceBuilder.newType('persons'),
    image:ResourceBuilder.newType('images')
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
//get all sports. http://developer.fanfeedr.com/docs/read/Leagues_Resources
fanfeedr.getSports=function(callback){
    jsonRequest(this.resources.sport.name,callback);
};
//get sport description. http://developer.fanfeedr.com/docs/read/GET_leagues_id
fanfeedr.getSport=function(sportId,callback){
    jsonRequest(this.resources.sport.newChildResource(sportId),callback);
};
//LEAGUES (Seria A,English Premier League etc). This resource represents conferences in term of NBA, NHL
//get leagues. http://developer.fanfeedr.com/docs/read/Conferences_Resources
fanfeedr.getLeagues=function(sportId,callback){
    jsonRequest(this.resources.sport.newChildResource(sportId)+this.resources.league.path(),callback);
};
//get league. http://developer.fanfeedr.com/docs/read/GET_parent_resource_resource_id_conferences_id
fanfeedr.getLeague=function(leagueId,callback){
    jsonRequest(this.resources.league.newChildResource(leagueId),callback);
};
//DIVISIONS. Works for NBA, NHL (American sports)
//get divisions. http://developer.fanfeedr.com/docs/read/Divisions_Resources
fanfeedr.getDivisions=function(conferenceId,callback){
    jsonRequest(this.resources.league.newChildResource(conferenceId)+this.resources.division.path(),callback);
};
//get division.http://developer.fanfeedr.com/docs/read/GET_parent_resource_resource_id_divisions_id
fanfeedr.getDivision=function(divisionId,callback){
    jsonRequest(this.resources.division.newChildResource(divisionId),callback);
};
//TEAMS
//get all teams for sport. http://developer.fanfeedr.com/docs/read/Teams_Resources
fanfeedr.getTeams=function(sportId,callback){
    jsonRequest(this.resources.sport.newChildResource(sportId)+this.resources.team.path(),callback);
};
//get all teams from league/conference
fanfeedr.getLeagueTeams=function(leagueId,callback){
    jsonRequest(this.resources.league.newChildResource(leagueId)+this.resources.team.path(),callback);
};
//get all teams from division
fanfeedr.getDivisionTeams=function(divisionId,callback){
    jsonRequest(this.resources.division.newChildResource(divisionId)+this.resources.team.path(),callback);
};
//get team information. http://developer.fanfeedr.com/docs/read/GET_parent_resource_resource_id_teams_id
fanfeedr.getTeam=function(teamId,callback){
    jsonRequest(this.resources.team.newChildResource(teamId),callback);
};
//get team roster. http://developer.fanfeedr.com/docs/read/GET_parent_resource_resource_id_teams_id_roster
fanfeedr.getTeamRoster=function(teamId,callback){
    jsonRequest(this.resources.team.newChildResource(teamId)+'/roster',callback);
};
//get team standings. http://developer.fanfeedr.com/docs/read/GET_parent_resource_resource_id_teams_id_standings
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
//last events for league
fanfeedr.lastLeagueEvents=function(leagueId,callback){
    jsonRequest(this.resources.league.newChildResource(leagueId)+'/last',callback);
};
//today events for league
fanfeedr.todayLeagueEvents=function(leagueId,callback){
    jsonRequest(this.resources.league.newChildResource(leagueId)+'/today',callback);
};
//next events for league
fanfeedr.nextLeagueEvents=function(leagueId,callback){
    jsonRequest(this.resources.league.newChildResource(leagueId)+'/next',callback);
};
//full event info. http://developer.fanfeedr.com/docs/read/GET_parent_resource_resource_id_events_id
fanfeedr.getEventDetails=function(eventId,callback){
    jsonRequest(this.resources.event.newChildResource(eventId),callback);
};
//full event boxscore. http://developer.fanfeedr.com/docs/read/GET_parent_resource_resource_id_events_id_boxscore
fanfeedr.getEventBoxscore=function(eventId,callback){
    jsonRequest(this.resources.event.newChildResource(eventId)+'/boxscore',callback);
};
//full event recap. http://developer.fanfeedr.com/docs/read/GET_parent_resource_resource_id_events_id_recap
fanfeedr.getEventRecap=function(eventId,callback){
    jsonRequest(this.resources.event.newChildResource(eventId)+'/recap',callback);
};
//PERSONS
//get all persons for sport. http://developer.fanfeedr.com/docs/read/Persons_Resources
fanfeedr.getSportPersons=function(sportId,callback){
    jsonRequest(this.resources.sport.newChildResource(sportId)+this.resources.person.path(),callback);
};
//get all persons for league. http://developer.fanfeedr.com/docs/read/Persons_Resources
fanfeedr.getLeaguePersons=function(leagueId,callback){
    jsonRequest(this.resources.league.newChildResource(leagueId)+this.resources.person.path(),callback);
};
//get all persons for league. http://developer.fanfeedr.com/docs/read/Persons_Resources
fanfeedr.getDivisionsPersons=function(divisionId,callback){
    jsonRequest(this.resources.division.newChildResource(divisionId)+this.resources.person.path(),callback);
};
//get all persons for league. http://developer.fanfeedr.com/docs/read/Persons_Resources
fanfeedr.getTeamPersons=function(teamId,callback){
    jsonRequest(this.resources.team.newChildResource(teamId)+this.resources.person.path(),callback);
};
//get person details. http://developer.fanfeedr.com/docs/read/GET_parent_resource_resource_id_persons_id
fanfeedr.getPerson=function(personId,callback){
    jsonRequest(this.resources.person.newChildResource(personId),callback);
};
//IMAGES
//get all sport images. http://developer.fanfeedr.com/docs/read/Images_Resources
fanfeedr.getSportImages=function(sportId,callback){
    jsonRequest(this.resources.sport.newChildResource(sportId)+this.resources.image.path(),callback);
};
//get all team images. http://developer.fanfeedr.com/docs/read/Images_Resources
fanfeedr.getTeamImages=function(teamId,callback){
    jsonRequest(this.resources.team.newChildResource(teamId)+this.resources.image.path(),callback);
};
//get all person images. http://developer.fanfeedr.com/docs/read/Images_Resources
fanfeedr.getPersonImages=function(personId,callback){
    jsonRequest(this.resources.person.newChildResource(personId)+this.resources.image.path(),callback);
};
fanfeedr.getImage=function(imageId,callback){
    jsonRequest(this.resources.image.newChildResource(imageId),callback);
};
var jsonRequest=function(resource,callback){
    var url=BASE_URL+fanfeedr.tier+'/api/'+ resource+'?api_key='+fanfeedr.key;
    rest.get(url)
        .on('complete',function(data){
            if(fanfeedr.debug){
                util.log('Successful request to '+url);
                util.log('Data received:'+util.inspect(data));
            }
            callback(undefined,data);
        })
        .on('error',function(err){
            if(fanfeedr.debug){
                util.log('Failed request to '+url);
                util.log('Error:'+util.inspect(err));
            }
            callback(err);
        });
};
