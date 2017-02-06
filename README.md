1. first install git,nodejs,ionic,gulp,bower, run:

	`npm install -g cordova ionic gulp bower, I guess nodejs and git you've already have.`

	ref:

	http://ionicframework.com

	https://git-scm.com
	
	https://nodejs.org/en/

	note:we're using ionic1 .

3. goes to root path(familydecoration-mobile) run below commands:

`npm install`
`bower install`

cordova platform add/rm ios/android

cordova build ios/android

cordova plugin list

cordova plugin rm/add xxx


gulp --cordova "build android" --app "fd" --prod

gulp "build watch" --app "fd" --prod