# Mobile-Applications
Repo hosting labs from UBB's MA class

## Ionic 1
App features:
Note that for now, the floor / wall tiles and future clients are simple generic item classes
 - [x] Visualize a list of registered floor and wall tiles from the server
 - [x] Add / Edit floor and wall tiles
 - [x] See more details regarding a selected floor or wall tile

## Ionic 2
App features:
 - [x] 1. Show the network status (online / offline).
 - [x] 2. Authenticate users 
	- [x] After login, app stores the auth token in local storage
	- [x] When app starts, the login page is not opened if the user is authenticated
	- [x] App allows users to logout
 - [X] 3. Link the resource instances to the authenticated user
	- [X] REST services return only the resources linked to the authenticated user
	- [X] Web socket notifications are sent only if the modified resources are linked to the authenticated user
 - [X] 4. Online/offline behaviour
	- [X] In online mode, the app tries first to use the REST services when new items are created/updated
	- [X] In offline mode or if the REST calls fail, the app stores data locally
	- [X] Inform user about the items not sent to the server
 - [X] 5. When entering the online mode, the app automatically tries to send data to the server
 - [X] 6. Use pagination
 - [X] 7. Use search & filter
 
## Ionic 3
App features:
 - [x] 1. Use camera
	- [x] In the context of the edit page allow user to take a photo
	- [x] Show photo when the resource is shown (in list/view/edit pages)
	- [x] Save photo on the device
	- [x] Upload photo
 - [x] 2. Use maps
	- [x] In the context of the edit page allow user to open a map in order to select a location of that resource
	- [x] Later, allow user to open a map in order to locate the resource
 - [x] 3. Use animations
	- [x] Animate some components
	- [x] Override existing component animations
