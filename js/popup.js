// Inserts tasks into the popup menu.  `tasks` is an array of LiquidPlanner tasks in JSON format.
function showTasks(tasks) {
  var url, html;
  var pending_tasks = $('#pending_tasks');
  var done_tasks = $('#done_tasks');
  var baseTemplate = $('#templates .task');
  
  $('#message').hide();
  
  for (var i = 0, task; task = tasks[i]; i++) {
    html = baseTemplate.clone();
    url = route(LiquidPlanner.showTaskUrl, {task_id: task.id});
    
    html.attr({'href': url}).find('.name').text(task.name);
    
    if(task.is_done){
      done_tasks.append(html);
    } else {
      if(task.low_effort_remaining && task.high_effort_remaining){
        html.find('.estimate').text('estimate: ' + task.low_effort_remaining + '-' + task.high_effort_remaining);
      }
    
      if(task.promise_by){
        html.find('.promise').text('due: ' + task.promise_by);
      }
    
      if(task.alerts && task.alerts.length > 0){
        var severity = {'red': 2, 'yellow': 1, 'none': 0};
        var flag = task.alerts.reduce(function(prev, alert){ 
          var curr = alert.flag;
          return severity[prev] > severity[curr] ? prev : curr;
        }, 'none');
        html.addClass(flag+'_flag');
      }
      
      pending_tasks.append(html);
    }
  }
}

// Extracts data from each comment's JSON data, and inserts it into the menu.
function showComments(comments) {
  var url, text, html, author, task;
  var chatter = $('#comments');
  var baseTemplate = $('#templates .comment');
    
  $('#message').hide();
  
  for (var i = 0, comment; comment = comments[i]; i++) {
    html = baseTemplate.clone();
    url = route(LiquidPlanner.showTaskUrl, {task_id: comment.item_id});
    text = comment.plain_text.slice(0,72);
    if(text != comment.plain_text){
      text = text + '...';
    }
    
    html.attr({'href': url}).find('.text').text(text);
    author = LiquidPlanner.members[comment.member_id] || LiquidPlanner.members[0];
    task   = comment.treeitem;
    if(author){ 
      html.find('.author').text(author.user_name); 
    }
    
    if(task){
      html.find('.taskname').text('on: '+task.name); 
    }
    
    chatter.append(html);
  }
}

// Stores the workspace members as a hash.  
// These are used to display the member's name in comments the comments section.
function storeMembers(members){
  LiquidPlanner.members = {};
  for (var i = 0, member; member = members[i]; i++) {
    LiquidPlanner.members[member.id] = member;
  }
}

// If the user has not yet picked a defualt space, we show this message.
function showConfigureRequest(){
  $('#message').html( 
    $('<a>',
      {
        'class': 'menu_item',
        'href': 'options.html',
        'target': '_liquid_planner'
      }).text('Please configure LiquidPlanner')
  ).fadeIn('fast');
}

// If the user does not currently have a session or HTTP Basic Auth credentials, then we direct them to
// LiquidPlanner.
function showLoginRequest(){
  $('#message').html( 
    $('<a>',
      {
        'class': 'menu_item',
        'href': route(':host'),
        'target': '_liquid_planner'
      }).text('Please log into LiquidPlanner')
  ).fadeIn('fast');
}

$(document).ready(function(){
  // Register a global Ajax error handler.
  // If Chrome receives a 401 response, it will not display the standard
  // HTTP Basic Auth dialog.  Instead it will just sit here.  
  // If so, direct the user to log into LiquidPlanner.
  $('#error')
    .ajaxError(
      function(event, request, settings){
        console.log('error', event, request, settings);
        var authIssue = (request.readyState == 0 || request.readyState == 1) && settings.timeout;
        if( authIssue ){
          showLoginRequest();
        } else {
          $(this).html("Could not load LiquidPlanner data").fadeIn('fast');
        }
      }
    );
  
  if(!LiquidPlanner.isConfigured()){
    showConfigureRequest();
    return;
  }
  
  if(LiquidPlanner.defaults.pendingCount > 0){
    LiquidPlanner.tasks({
      success:  showTasks,
      timeout:  3500, 
      data:{
        // This filter gets the user's active tasks
        'filter':   ['owner_id = me', 'done is false'],
        'limit':    LiquidPlanner.defaults.pendingCount,
        'order':    'earliest_start'
    }});
  }
  
  if(LiquidPlanner.defaults.doneCount > 0){
    LiquidPlanner.tasks({
      success:  showTasks, 
      timeout:  3500,
      data:{
        // This filter gets the user's recently done tasks
        'filter':   ['owner_id = me', 'done is true'],
        'limit':    LiquidPlanner.defaults.doneCount,
        'order':    'updated_at'
    }});
  }
  
  if(LiquidPlanner.defaults.commentCount > 0){
    LiquidPlanner.members({
      timeout:  3500,
      success: function(members){
        storeMembers(members);
        LiquidPlanner.chatter({
          success:  showComments,
          data:{
            'ignore_mine': LiquidPlanner.defaults.ignoreMyComments,
            'for_me':      !LiquidPlanner.defaults.showAllComments,
            'limit':       LiquidPlanner.defaults.commentCount
        }});
      }
    });
  }    
});