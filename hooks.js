var Hook = 
{
	hooks: {},
	settings: {"testmode":true,"version":"Beta40","ReleaseNotes":"Juan, for now."},
	register: function ( opts )
	{
		if (typeof opts != "undefined")
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
				Hook.log("Hook registration failed.  Missing NAME or CALLBACK.");
				return false;
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
			var e, hook;
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
				name = name.replace(code, '');
				code = code.replace('.','');
				for ( h in Hook.hooks[name] )
				{
					hook = Hook.hooks[name];
					e = h;
					hook = hook[h];

					if ( hook.code == code )
					{
						if ( e == 0 ) e = 1;
						Hook.hooks[name].splice( h, e );
					}
				}
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
			Hooks.log(o);
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
