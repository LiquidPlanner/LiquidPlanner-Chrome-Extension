LiquidPlanner = {};

/** 
  LiquidPlanner Options Management
  -------------------------------
  Options are stored in Chrome's localStorage.
*/

// Saves the options to localStorage
LiquidPlanner.saveOptions = function(){
  localStorage.options = JSON.stringify(LiquidPlanner.defaults);
};

// Loads the options from localStorage, merging them with some sane defaults
LiquidPlanner.loadOptions = function(){
  var defaults = {
    url: {
      space_id: null,
      host: 'https://app.liquidplanner.com',
      api_path: 'api'
    },
    
    pendingCount: 10,
    doneCount: 3,
    commentCount: 3,
    showAllComments: false
  };
  
  LiquidPlanner.defaults = $.extend(defaults, JSON.parse(localStorage.options || '{}'));
};

// Resets options to the defaults.
LiquidPlanner.resetOptions = function(){
  delete localStorage.options;
  LiquidPlanner.loadOptions();
};

/**
  LiquidPlanner Resource Management
  --------------------------------
  Urls are generated from url templates of the form:
      /resource/:id
  Where parts starting with a colon are replaced (:id for instance).
  
  These url templates are converted into a real url path with the `route` function.
  Resources wrap this idea, and set up defaults which jQuery can use later.
*/

// Replaces placeholder values in a url template with values from `LiquidPlanner.defaults.url`
// and `params`.
function route(url, params){
  // mix in the default space_id, host, and api_path
  params = $.extend({}, LiquidPlanner.defaults.url, params);
  // then replace keys as needed
  for(k in params){ url = url.replace(':'+k, params[k]); }
  return url;
}

// Creates a function which will make jQuery ajax requests.  See `options.html` and `popup.html` for examples
function resource(url){
  res = function(options){
    options = $.extend({'url': route(url, options.params), dataType: 'json'}, options);
    return $.ajax(options);
  };
  
  res.url = url;
  return res;
};


// A helper method for determining whether the extension has been configured yet.
// If a default space has not been picked yet, we will prompt the user for one on the options page
LiquidPlanner.isConfigured = function(){
  return !!LiquidPlanner.defaults.url.space_id;
};

// Load stored options from above
LiquidPlanner.loadOptions();

// Define the resources (see `resources` and `route`)
LiquidPlanner.tasks      = resource(':host/:api_path/workspaces/:space_id/tasks/');
LiquidPlanner.task       = resource(':host/:api_path/workspaces/:space_id/tasks/:task_id');
LiquidPlanner.workspaces = resource(':host/:api_path/workspaces/');
LiquidPlanner.workspace  = resource(':host/:api_path/workspaces/:space_id');
LiquidPlanner.members    = resource(':host/:api_path/workspaces/:space_id/members');
LiquidPlanner.chatter    = resource(':host/:api_path/workspaces/:space_id/chatter');

// Add a url we will use later to show tasks in LiquidPlanner
LiquidPlanner.showTaskUrl= ':host/space/:space_id/organize/show/:task_id';