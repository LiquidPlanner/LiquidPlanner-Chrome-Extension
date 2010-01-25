LiquidChrome = {};

// Set up the defaults for LiquidChrome.  At the moment, these are all just
// used for routing:
var defaults = {
  space_id: null,
  host: 'https://app.liquidplanner.com',
  api_path: 'api'
};

// initialize any defaults we have stored in localStorage
for(key in defaults) {
  var value = localStorage[key];
  if(value) defaults[key] = value;
}

/**
  Helper method for routing urls, takes in a url in the form:
   /going/to/:id/
  and replaces any identifier (:id) with a value from params.
*/
function route(url, params){
  // mix in the default space_id, host, and api_path
  params = $.extend({}, defaults, params);
  // then replace keys as needed
  for(k in params){ url = url.replace(':'+k, params[k]); }
  return url;
}

/**
  Creates a resource we can call later.
*/
function resource(url){
  res = function(options){
    var baseOptions = {
      'url': route(url, options.params),
      dataType: 'json'
    };
    
    $.ajax($.extend(baseOptions, options));
  };
  
  res.url = url;
  return res;
};

// Set up some default resources
LiquidChrome.tasks      = resource(':host/:api_path/workspaces/:space_id/tasks/');
LiquidChrome.task       = resource(':host/:api_path/workspaces/:space_id/tasks/:task_id');
LiquidChrome.workspaces = resource(':host/:api_path/workspaces/');
LiquidChrome.workspace  = resource(':host/:api_path/workspaces/:space_id');

// Add a url we will use later to show tasks in LiquidPlanner
LiquidChrome.showTaskUrl= ':host/space/:space_id/organize/show/:task_id';

/**
  A helper method for determining whether the extension has been configured yet.
*/
LiquidChrome.isConfigured = function(){
  return !!defaults.space_id;
};

LiquidChrome.defaults = defaults;