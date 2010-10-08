LiquidPlanner
============

This extension is meant to provide useful functionality in Chrome,
and to serve as an example of accessing the LiquidPlanner API.

Key Files
---------
`liquid_planner.js` is responsible for accessing the LiquidPlanner API.
`options.html` and `popup.html` define the interface for the extension options and the 
popup menu respectively.

Using the LiquidPlanner API
----------------------------
LiquidPlanner exposes a lot of its functionality through a RESTful API.
The extension uses four resources workspaces, workspace members,
comments, and tasks.  We define a `resource` function in `liquid_planner.js` to facilitate
fetching resources from the LiquidPlanner API.  This is then used to set up the resources we
might want to access:
  
    LiquidPlanner.workspaces = resource(':host/:api_path/workspaces/');

Now we can call `LiquidPlanner.workspaces` to get a list of workspaces.

    LiquidPlanner.workspaces({success: showWorkSpaces});
    
The `success` option defines the callback to use, in this case it is `showWorkSpaces`.
  
Behind the scenes jQuery will call LiquidPlanner's API and parse the JSON response.
Normal Javascript objects are then passed into `showWorkSpaces`:

    function showWorkSpaces(spaces, status) {
      ...
      for (var i = 0, space; space = spaces[i]; i++) {
        var name = space.name;
        ...
      }
      ...
    }

This pattern is repeated throughout the LiquidPlanner plugin.
For more information, see "LiquidPlanner Resource Management" in `liquid_planner.js`.

    adam sanderson, LiquidPlanner
    adam@liquidplanner.com