LiquidChrome
============

This extension is meant to provide useful functionality in Chrome,
and to serve as an example of accessing the LiquidPlanner API.

Key Files
---------
`options.html` and `popup.html` define the interface for the extension options and the 
popup menu respectively.  These depend on `liquid_chrome.js` to define how resources
are accessed through the LiquidPlanner API.

Using the LiquidPlanner API
----------------------------
LiquidPlanner exposes a lot of its functionality through a RESTful API.
The extension uses four resources workspaces, workspace members,
comments, and tasks.  We define the `resource` function in `liquid_chrome.js` to facilitate
fetching resources from the LiquidPlanner API.  This is then used to set up the resources we
might want to access:
  
    LiquidChrome.workspaces = resource(':host/:api_path/workspaces/');

For example the options page needs to display a list of workspace.  To get these 
we call `LiquidChrome.workspaces` with a callback for success, and a callback for errors:

    LiquidChrome.workspaces({success: showWorkSpaces, error: showError});
  
Behind the scenes jQuery will call LiquidPlanner's and parse the JSON response from the server.
Normal Javascript objects are then passed into `showWorkSpaces`:

    function showWorkSpaces(spaces, status) {
      ...
      for (var i = 0, space; space = spaces[i]; i++) {
        var name = space.name;
        ...
      }
      ...
    }

This pattern is repeated throughout LiquidChrome.