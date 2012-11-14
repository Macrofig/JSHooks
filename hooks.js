var Hook = 
{
	hooks: {},
	settings: {"testmode":true,"version":"Beta40","ReleaseNotes":"Juan, for now."},
	register: function ( opts )
	{
		if (typeof opts != undefined)
		{
			//set default options
			var name = (typeof opts["callname"] !== "undefined" ?  opts["callname"]  : false)
			var order = (typeof opts["order"] !== "undefined" ? opts["order"] : 0);
			var asynch = (typeof opts["asynch"] !== "undefined" ? opts["asynch"] : false);
			var callback = (typeof opts["callback"] !== "undefined" ? opts["callback"] : false);
			var status = (typeof opts["status"] !== "undefined" ? opts["status"] : "active");
			var code = (typeof opts["code"] !== "undefined" ? opts["code"] : name+order);
		
			//check for missing vars
			if ( (name == false) || (callback == false) )
			{
				return false;
				Hook.log("Hook registration failed.  Missing NAME or CALLBACK.");
			} else 
			{ 
				//All good, lets register the hook
				if( 'undefined' == typeof( Hook.hooks[name] ) )	Hook.hooks[name] = [];
				opts = {"code":code, "order" : order, "status":status, "asynch":asynch, "callback" : callback }
				Hook.hooks[name].push( opts );
				//Hook.reorder(name);
				return true;
			}
		} else return false;

	},
 
	call: function ( name, args )
	{
		if( typeof( Hook.hooks[name] ) != 'undefined' )
		{
			for( i = 0; i < Hook.hooks[name].length; ++i )
		  	{
				if( Hook.hooks[name][i].callback )
				{
					Hook.hooks[name][i].callback( args ) 

				}
			}
		}
	},
	clearAll:function(name){
		//check if targeting specific callback with CODE.
		//Structure: [name].[code] or [name]
		if (typeof name != "undefined" )
		{
			var code = name.indexOf(".");
			if ( code == -1 ) 
			{
				//clear all hooks with provided name
				Hook.hooks[name] = [];
				return true;
			}else if ( code != -1 ) 
			{
				//clear only a specific hook within a name
				code = name.substring(code,name.length);
				for ( h in Hook.hooks[name] )
					var hook = Hook.hooks[name][h]
					if ( hook.code == code )
						Hook.hooks[name].splice(h,h);
				return true;
	
			} else return false;
		} else return false;
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
	log: function ( l ) {
		//error handling
		if (typeof(l) == "undefined") var l = "Log called but missing message!";
		//check for testmode
		if ( typeof Hook.settings == "undefined" ) var testmode = false
			else var testmode = Hook.settings["testmode"];
		//if console exists and testmode is active
		if ( ( testmode == true ) && ( console.log ) ) console.log( "Yar! " + l);
  
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