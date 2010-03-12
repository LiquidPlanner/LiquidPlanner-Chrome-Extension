LiquidChrome = {};

/** 
  LiquidChrome Options Management
  -------------------------------
  Options are stored in Chrome's localStorage.
*/

// Saves the options to localStorage
LiquidChrome.saveOptions = function(){
  localStorage.options = JSON.stringify(LiquidChrome.defaults);
};

// Loads the options from localStorage, merging them with some sane defaults
LiquidChrome.loadOptions = function(){
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
  
  LiquidChrome.defaults = $.extend(defaults, JSON.parse(localStorage.options || '{}'));
};

// Resets options to the defaults.
LiquidChrome.resetOptions = function(){
  delete localStorage.options;
  LiquidChrome.loadOptions();
};

/**
  LiquidChrome Resource Management
  --------------------------------
  Urls are generated from url templates of the form:
      /resource/:id
  Where parts starting with a colon are replaced (:id for instance).
  
  These url templates are converted into a real url path with the `route` function.
  Resources wrap this idea, and set up defaults which jQuery can use later.
*/

// Replaces placeholder values in a url template with values from `LiquidChrome.defaults.url`
// and `params`.
function route(url, params){
  // mix in the default space_id, host, and api_path
  params = $.extend({}, LiquidChrome.defaults.url, params);
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
LiquidChrome.isConfigured = function(){
  return !!LiquidChrome.defaults.url.space_id;
};

// Load stored options from above
LiquidChrome.loadOptions();

// Define the resources (see `resources` and `route`)
LiquidChrome.tasks      = resource(':host/:api_path/workspaces/:space_id/tasks/');
LiquidChrome.task       = resource(':host/:api_path/workspaces/:space_id/tasks/:task_id');
LiquidChrome.workspaces = resource(':host/:api_path/workspaces/');
LiquidChrome.workspace  = resource(':host/:api_path/workspaces/:space_id');
LiquidChrome.members    = resource(':host/:api_path/workspaces/:space_id/members');
LiquidChrome.chatter    = resource(':host/:api_path/workspaces/:space_id/chatter');

// Add a url we will use later to show tasks in LiquidPlanner
LiquidChrome.showTaskUrl= ':host/space/:space_id/organize/show/:task_id';