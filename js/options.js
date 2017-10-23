// Callback uses to render the list of workspaces.
// `spaces` is an array of JSON data.
function showWorkSpaces(spaces) {
  var html = $('#workspaces');
  var currentId = LiquidPlanner.defaults.url.space_id;
  
  for (var i = 0, space; space = spaces[i]; i++) {
    var isSelected = (space.id == currentId);

    html.append(
      $('<option>')
        .attr('value', space.id)
        .attr('selected', isSelected ? 'selected' : '')
        .text(space.name)
    );
  }
  
  updateSpaceId();
}

// updates the default space id and stores the options
function updateSpaceId(){
  var spaceId = $('#workspaces').val();
  LiquidPlanner.defaults.url.space_id = spaceId;
  LiquidPlanner.saveOptions();
}

// extracts an integer value and saves it in the LiquidPlanner options,
// name is both the id of the input, and the options key.
function saveIntegerOption(name){
  return function(){
    var input = $('#'+name);
    var val = parseInt(input.val(),10);
    val = val > 0 ? val : 0;
    input.val(val);
    
    LiquidPlanner.defaults[name] = val;
    LiquidPlanner.saveOptions();
  };
}

// extracts a boolean value and saves it in the LiquidPlanner options,
// name is both the id of the input, and the options key.
function saveBooleanOption(name){
  return function(){
    var input = $('#'+name);
    var val = input.attr('checked');

    LiquidPlanner.defaults[name] = val;
    LiquidPlanner.saveOptions();
  };
}

// Register event listeners and fetch the list of workspaces
$(document).ready(function(){
  
  // Register an ajax exception observer:
  $('#error')
    .ajaxError( function(event, request, settings){
      $(this).html("Could not load LiquidPlanner data").show();
    });
  
  // Register a generic ajax observer:
  $('#loading')
    .ajaxSend(function(){ $(this).fadeIn('fast'); })
    .ajaxStop(function(){ $(this).fadeOut('fast');});
  
  // Load the user's workspaces
  LiquidPlanner.workspaces({success: showWorkSpaces});
  
  // Set up the options and their observers:
  $('#workspaces')
    .change(updateSpaceId);
  
  $('#commentCount')
    .val(LiquidPlanner.defaults.commentCount)
    .change(saveIntegerOption('commentCount'));
    
  $('#doneCount')
    .val(LiquidPlanner.defaults.doneCount)
    .change(saveIntegerOption('doneCount'));
    
  $('#pendingCount')
    .val(LiquidPlanner.defaults.pendingCount)
    .change(saveIntegerOption('pendingCount'));
    
  $('#showAllComments')
    .attr('checked', LiquidPlanner.defaults.showAllComments)
    .change(saveBooleanOption('showAllComments'));
  
  // Hook up page controls
  $('#showAdvancedOptions')
    .click(function(){ 
      $(this).hide(); $('#advancedOptions').toggle('slide'); 
    });
    
  $('#resetOptions')
    .click(function(){
      var ok = confirm("Are your sure you want to reset your settings?");
      if(ok){LiquidPlanner.resetOptions();}
      return ok;
    });
});