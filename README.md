1. first install ionic,gulp,bower, run:

	`npm install -g cordova ionic gulp bower`

	I guess you've already have nodejs and git .

	ref:

	http://ionicframework.com

	https://git-scm.com
	
	https://nodejs.org/en/

	note:we're using ionic1 .

2. goes to root path(familydecoration-mobile) run below commands:

	`npm install`

	`bower install`

3. run from web browser:

	`gulp watch --app "fd_mobile" --prod`

4. add/rm platform:
	
	`cordova platform add/rm ios/android`

5. build android/ios:

	`cordova build ios/android`

6. show/add/remove cordova plugin:

	`cordova plugin list`

	`cordova plugin rm/add some-plugin-name`


	`gulp --cordova "build android" --app "fd" --prod`

	