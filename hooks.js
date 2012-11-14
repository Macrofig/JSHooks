var Hook = {
	hooks: {},
	settings: {"testmode":true,"version":"Beta20","ReleaseNotes":"Juan, for now."},
	register: function ( opts ) {
	if (typeof opts != undefined){
		//set default options
		var name = (typeof opts["callname"] !== "undefined" ?  opts["callname"]  : false)
		var order = (typeof opts["order"] !== "undefined" ? opts["order"] : 0);
		var asynch = (typeof opts["asynch"] !== "undefined" ? opts["asynch"] : false);
		var callback = (typeof opts["callback"] !== "undefined" ? opts["callback"] : false);
		var status = (typeof opts["status"] !== "undefined" ? opts["status"] : "active");
		var code = (typeof opts["code"] !== "undefined" ? opts["code"] : name+order);
		
		//check for missing vars
		if ( (name == false) || (callback == false) )  {
			return false;
			Hook.log("Hook registration failed.  Missing NAME or CALLBACK.");
		} else { 
			//All good, lets register the hook
			if( 'undefined' == typeof( Hook.hooks[name] ) )	Hook.hooks[name] = [];
			opts = {"code":code, "order" : order, "status":status, "asynch":asynch, "callback" : callback }
			Hook.hooks[name].push( opts );
			//Hook.reorder(name);
			return true;
		}
	} else return false;

  },
 
	call: function ( name, args ) {
		if( 'undefined' != typeof( Hook.hooks[name] ) )
		  for( i = 0; i < Hook.hooks[name].length; ++i )
			if( true != Hook.hooks[name][i].callback( args ) ) { break; }
	},
	clearAll:function(name){
		Hook.hooks[name] = [];
		return true;
	
	
	},	
	reorder: function (obj){
		var indexes = [];
		//create a temp array of our objects
		for(o in Hook.hooks[obj]){
		//$.each(Hook.hooks[obj], function (k,v){
			//extract order for the sort method
			var i = {"order":o.order,"obj":v[k]};
			indexes.push(i);
			debug.log(o);
		}
		
		//sorts the temp array
		indexes.sort(function(a,b){return a.order-b.order});

		Hook.hooks[obj] = [];
		var i = 0;
		for(o in indexes){
			if (typeof indexes[o].obj != "undefined"){
				var newobj = indexes[o].obj;
				if (typeof newobj.code != "undefined") 
					Hook.hooks[obj].push(indexes[o].obj);
				
			}
		}
		return true; 

  
	},
	msg: function ( m ) {
		alert(m);
  
	},
	log: function ( l ) {
		if (typeof(l) == "undefined") var l = "Log called but missing message!";
		if (Hook.settings["testmode"] == true)	debug.log( "Yar! " + l);
  
	},
	WhoAmI: function ( ) {
		Hook.log("Testmode is active!");
		Hook.log("Version number "+Hook.settings.version)
		Hook.log("For release notes go to "+Hook.settings.ReleaseNotes)
	},
	r: function ( opts ) {
		return Hook.register( opts );
  
	},
	c: function ( n, a ) {
		Hook.call( n, a )
	}
}

/*

VERSION ALPHA
Modified a version of hooks to use a more object oriented approach... ish. 
Added a settings object, log, msg, WhoAmI, and shortcut ojects.
Very basic, just proof of concept.

VERSION BETA
Added reordering function.
Cleaned up code a bit.
Tested in CHA.
Released as Beta candidate.
Known issues: Callbacks are not fired in specified order.






//I need this to happen everytime CovCalcBuild is triggered
Hook.register(
  'CovCalcBuild',
  function () {
    alert( 'Bye!' );
    return true;
  }
);


//Trigger CovCalcBuild callbacks
Hook.call('CovCalcBuild');


//hook object structure

{
    "hooks": [
        {
            "CovCalcBuild": [
                {
                    "order": "1",
                    "status": "active",
                    "asynch": false,
                    "callback": "function(){ return true;}"
                },
                {
					"code":"coverageL"
                    "order": "1",
                    "status": "disabled",
                    "asynch": false,
                    "callback": "function(){ return true;}"
                }
            ]
        },
		{
			"ZP4Call":[
				{
                    "order": "1",
                    "status": "pause",
                    "asynch": false,
                    "callback": "function(){ return true;}"
				}	
			
			]	
		},
		{
			"ZP4Success":[
				{
                    "order": "1",
                    "status": "active",
                    "asynch": false,
                    "callback": "function(){ return true;}"
				}	
			
			]	
		}
    ]
}

*/