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
 - [x] 3. Link the resource instances to the authenticated user
	- [x] REST services return only the resources linked to the authenticated user
	- [x] Web socket notifications are sent only if the modified resources are linked to the authenticated user
 - [ ] 4. Online/offline behaviour
	- [ ] In online mode, the app tries first to use the REST services when new items are created/updated
	- [ ] In offline mode or if the REST calls fail, the app stores data locally
	- [ ] Inform user about the items not sent to the server
 - [ ] 5. When entering the online mode, the app automatically tries to send data to the server
 - [ ] 6. Use pagination
 - [ ] 7. Use search & filter
