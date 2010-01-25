LiquidChrome = {};
var defaults = {
  server: 'https://app.liquidplanner.com'
};

var options = ['spaceId'];
for(var i = 0, opt; opt = options[i]; i++) {
  var value = localStorage[opt];
  if(value) defaults[opt] = value;
}

LiquidChrome.workSpaceUrl = function(spaceId){
  return defaults.server + '/api/workspaces/'+(spaceId||'');
};
LiquidChrome.tasksUrl = function(spaceId){
  spaceId = spaceId || defaults.spaceId;
  return LiquidChrome.workSpaceUrl(spaceId)+'/tasks';
};
LiquidChrome.showTaskUrl = function(taskId){
  spaceId = defaults.spaceId;
  return defaults.server + '/space/'+ spaceId + '/collaborate/show/'+taskId;
};

LiquidChrome.isConfigured = function(){
  return !!defaults.spaceId;
};

LiquidChrome.defaults = defaults;