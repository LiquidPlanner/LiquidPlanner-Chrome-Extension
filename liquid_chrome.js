LiquidChrome = {};
LiquidChrome.saveOptions = function(){
  localStorage.options = JSON.stringify(LiquidChrome.defaults);
};

LiquidChrome.loadOptions = function(){
  var defaults = {
    url: {
      space_id: null,
      host: 'https://app.liquidplanner.com',
      api_path: 'api'
    },
    
    pendingCount: 10,
    doneCount: 3,
    commentCount: 5
  };
  
  LiquidChrome.defaults = $.extend(defaults, JSON.parse(localStorage.options || '{}'));
};

LiquidChrome.resetOptions = function(){
  delete localStorage.options;
  LiquidChrome.loadOptions();
};

/**
  Helper method for routing urls, takes in a url in the form:
   /going/to/:id/
  and replaces any identifier (:id) with a value from params.
*/
function route(url, params){
  // mix in the default space_id, host, and api_path
  params = $.extend({}, LiquidChrome.defaults.url, params);
  // then replace keys as needed
  for(k in params){ url = url.replace(':'+k, params[k]); }
  return url;
}

/**
  Creates a resource we can call later.
*/
function resource(url){
  res = function(options){
    $.ajax($.extend({'url': route(url, options.params), dataType: 'json'}, options));
  };
  
  res.url = url;
  return res;
};

/**
  A helper method for determining whether the extension has been configured yet.
*/
LiquidChrome.isConfigured = function(){
  return !!LiquidChrome.defaults.url.space_id;
};

// Load any stored options
LiquidChrome.loadOptions();

// Set up some default resources
LiquidChrome.tasks      = resource(':host/:api_path/workspaces/:space_id/tasks/');
LiquidChrome.task       = resource(':host/:api_path/workspaces/:space_id/tasks/:task_id');
LiquidChrome.workspaces = resource(':host/:api_path/workspaces/');
LiquidChrome.workspace  = resource(':host/:api_path/workspaces/:space_id');
LiquidChrome.members    = resource(':host/:api_path/workspaces/:space_id/members');
LiquidChrome.chatter    = resource(':host/:api_path/workspaces/:space_id/chatter');

// Add a url we will use later to show tasks in LiquidPlanner
LiquidChrome.showTaskUrl= ':host/space/:space_id/organize/show/:task_id';

/**
  Generic AJAX error handler.
*/
function showError(req, status, err) {  
  console.log(req, status, err);
  console.log('configuration:', LiquidChrome.defaults);
  $(document.body).append('<div class="error">Could not access LiquidPlanner.</div>');
}