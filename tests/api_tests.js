var util=require('util'),
    assert=require('assert'),
    fanfeedr=require('../lib/fanfeedr.js');
util.log('Started testing');
fanfeedr.init('9xcjyztzg8d9d24euvfz8fec','basic');
fanfeedr.getSports(function(er,data){
    if(er){
        assert.fail(er,undefined,"Error shouldn't happen");
    }
    else{
        assert.equal(data.length,14,'Expected 14 sports');
    }
});

fanfeedr.getLeagues('0a3c27d2-a655-58e4-a49c-9f3c7411c710',function(er,data){
    if(er){
        assert.fail(er,undefined,"Error shouldn't happen");
    }
    else{
        assert.equal(data.length,13,'Expected 14 sports');
    }
});
util.log('Finished testing');
