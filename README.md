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

3. other command you might use:

	`cordova platform add/rm ios/android`

	`cordova build ios/android`

	`cordova plugin list`

	`cordova plugin rm/add some-plugin-name`


	`gulp --cordova "build android" --app "fd" --prod`

	`gulp "build watch" --app "fd" --prod`