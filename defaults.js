LiquidChrome = {};
var defaults = {
  server: 'https://app.liquidplanner.com',
  spaceId: 1
};

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

var options = ['spaceId'];
for(var i = 0, opt; opt = options[i]; i++) {
  var value = localStorage[opt];
  if(value) defaults[opt] = value;
}

LiquidChrome.defaults = defaults;