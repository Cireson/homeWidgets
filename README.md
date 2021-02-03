# homeWidgets

A framework for loading custom widgets on dashboard pages in the Cireson Portal for ServiceManager and some default widgets.

Usage:
These widgets are designed to be used with an HTML Widget from a Dashboard Page in the Cireson Portal. The individual widget is called by having these scripts running in custom.js. For the widgets to be loaded correctly the [loadScript](https://community.cireson.com/discussion/comment/14268#Comment_14268) must be present. It is recommended to use loadScript to also call homeWidgets.js like so:

```
loadScript('/CustomSpace/homeWidgets/homeWidgets.js', ['Page'])
```

This will load the homeWidgets on every dashboard page. You can change 'Page' to the GUID of a particular dashboard page if you only want the widgets loading on a single page.

(Please keep in mind that changes to custom.js may not be reflected until after a hard refresh (Ctrl + F5) )

Once the widgets are loaded into custom.js, each widget can be rendered using an HTML Widget that contains a div with the class being the name of each widget.
