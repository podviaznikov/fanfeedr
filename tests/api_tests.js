var util=require('util'),
    assert=require('assert'),
    fanfeedr=require('../lib/fanfeedr.js');
fanfeedr.init('no_key',fanfeedr.tiers.bronze,true);

module.exports={
    'test getSports':function(){
        fanfeedr.getSports(function(er,data){
            if(er){
                assert.fail(er,undefined,"List of sports was not found");
            }
            else{
                assert.equal(data.length,14,'Expected 14 sports');
            }
        });
    },
    'test getLeagues':function(){
        fanfeedr.getLeagues('0a3c27d2-a655-58e4-a49c-9f3c7411c710',function(er,data){
            if(er){
                assert.fail(er,undefined,"Football leagues not found");
            }
            else{
                assert.equal(data.length,13,'Expected 13 leagues');
            }
        });
    },
    'test getLeagueTeams':function(){
        fanfeedr.getLeagueTeams('s9xcjyztzg8d9d24euvfz8fec',function(er,data){
            if(er){
                assert.fail(er,undefined,"Premiere leagues teams not found");
            }
            else{
                assert.equal(data.length,29,'Expected 20 teams in EPL');
                assert.equal('Arsenal',data[0].name,'Arsenal should be the first team');
            }
        });
    },
    'test getTeam':function(){
        fanfeedr.getTeam('ba214a05-0d53-59fd-b0ec-e016f112fba8',function(er,data){
            if(er){
                assert.fail(er,undefined,"Team not found");
            }
            else{
                assert.equal('Arsenal',data.short_name,'Arsenal expected for provided id');
            }
        });
    },
    'test getTeamRoster':function(){
        fanfeedr.getTeamRoster('ba214a05-0d53-59fd-b0ec-e016f112fba8',function(er,data){
            if(er){
                assert.fail(er,undefined,"Team roster not found");
            }
            else{
                assert.equal(0,data.length,'Arsenal has no roster now');
            }
        });
    },
    'test getTeamStandings': function(){
        fanfeedr.getTeamStandings('ba214a05-0d53-59fd-b0ec-e016f112fba8',function(er,data){
            if(er){
                assert.fail(er,undefined,"Team standings not found");
            }
            else{
                assert.equal(19,data[0].wins,'Arsenal has 19 wins');
            }
        });
    },
    'test getLastFootballEvents':function(){
        fanfeedr.lastSportEvents('0a3c27d2-a655-58e4-a49c-9f3c7411c710',function(er,data){
            if(er){
                assert.fail(er,undefined,"Last football event not found");
            }
            else{
                assert.ok(data.length>0,'Events should be empty');
            }
        });
    },
    'test getTodayFootballEvents':function(){
        fanfeedr.todaySportEvents('0a3c27d2-a655-58e4-a49c-9f3c7411c710',function(er,data){
            if(er){
                assert.fail(er,undefined,"Today football events not found");
            }
            else{
                assert.ok(data.length>0,'Events should be empty');
            }
        });
    },
    'test getNextFootballEvents':function(){
        fanfeedr.nextSportEvents('0a3c27d2-a655-58e4-a49c-9f3c7411c710',function(er,data){
            if(er){
                assert.fail(er,undefined,"Next football events not found");
            }
            else{
                assert.ok(data.length>0,'Events should be empty');
            }
        });
    },
};
