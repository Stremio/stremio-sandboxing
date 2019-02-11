# stremio-sandboxing

a prototype for sandboxed addon

A big question mark for now is how we'll define the URLs (`transportUrl`), since we need the manifest beforehand, for descriptions, and to show the allowed hosts and permissions

On the other hand, we don't want deploying to take more than uploading a single file

The current plan for the `transportUrl` is to make it: `stremio-sandbox://{url}` which is pointing to a JSON file containing the manifest and the code blob and maybe an integrity part.

Keep in mind that the stremio-api can update addons for users, by changing the `AddonDescriptor`, so it can change the `transportUrl` altogether in order to update an addon.
