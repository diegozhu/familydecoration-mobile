1. first install ionic,gulp,bower, run:

	`npm install -g cordova ionic gulp bower`

	I guess you've already have nodejs and git . now , grab a cup of coffee, this will take a long time. remember to turn on your shadowsocks. :)

	ref:

	http://ionicframework.com

	https://git-scm.com
	
	https://nodejs.org/en/

	note:we're using ionic1 .

2. goes to root path(familydecoration-mobile) run below commands:

	`npm install`

	`bower install`

3. run from web browser:

	`gulp watch-build --app "fd_mobile" --prod`

	`gulp watch --app "fd_mobile" --prod`

4. add/rm platform:
	
	`cordova platform add/rm ios/android`

5. build android/ios:

	`gulp --cordova "build android/ios" --app "fd_mobile" --prod`   #long time downloading android sdk and xcode. shadowsocks required.

	`cordova build ios/android`   --- dont use this.

6. show/add/remove cordova plugin:

	`cordova plugin list`

	`cordova plugin rm/add some-plugin-name`

7. debug on iPhone:
	
	after build ios, open xproj file under platforms ios, then you can debug ObjectC with xCode and remotely debug js with safari

8. debug on android

	after build android, import platforms/android to android stadio(AS). then you can debug java code with AS and remotely debug js with chrome

	note: if you want debug js code only , you dont need to import the project into AS, just build apk and install , that will work.

	

	