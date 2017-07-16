1. first install ionic,gulp,bower, run:

	`npm install -g cordova@7.0.1 ionic gulp bower`

	I guess you've already have nodejs and git . now , grab a cup of coffee, this will take a long time. remember to turn on your shadowsocks. :)

	ref:

	http://ionicframework.com

	https://git-scm.com
	
	https://nodejs.org/en/

	note:we're using ionic1 .

2. goes to root path(familydecoration-mobile) run below commands:

	`npm install`

	`bower install`

3. run from web browser: (skip when setting up environment)
	
	`gulp watch --app "fd_mobile"`

	`gulp build --app "fd_mobile"`

	`gulp watch-build --app "fd_mobile"`

	`gulp watch --app "fd_mobile" --env prod`

	`gulp build --app "fd_mobile" --env prod`

	`gulp watch-build --app "fd_mobile" --env prod`

4. add/rm platform:

	`cordova platform add android@6.2.3 --nosave --nofetch`
	`cordova platform add ios@4.2.0 --nosave --nofetch`
	`cordova platform rm ios`
	`cordova platform rm android`

5. build android/ios:

	`gulp --cordova "build android/ios" --app "fd_mobile" --env prod --appversion 1.0.1`   #long time downloading android sdk and xcode. shadowsocks required.

	`cordova build ios/android`   --- dont use this.

6. show/add/remove cordova plugin:

	`cordova plugin list`

	`cordova plugin rm/add some-plugin-name`

7. debug on iPhone:
	
	after build ios, open xproj file under platforms ios, then you can debug ObjectC with xCode and remotely debug js with safari

8. debug on android

	after build android, import platforms/android to android stadio(AS). then you can debug java code with AS and remotely debug js with chrome

	note: if you want debug js code only , you dont need to import the project into AS, just build apk and install , that will work.

9. TODO
	1. global exception handler(especially ajax exceptions including session timeout)
	2. session/local storage enhancement. cause we need to manually handle data which is user related. clean or keep it when logout, sometimes we need clean it and some times we dont, usually we need to deal with these three kinds of data:
		a) app level user non-related data, like app configurations , ajax timeout time such.
		b) app level user related data , like user's configurations.
		c) session level user related data, like user's tasks, need to refresh every logout/login
	3. log server enhancement. $log from angular is far from production usage(not clever enough to filter). we need to implement our own log service which have tag feature to filter. this shound't be complex, I'll have it done this week.
	4. authentication service, user login/logout work(including cacheFactory cleanning, autologin/silent in background when session timeout feature), forgot my password feature.
	5. take a look at cordova camera plugins and location service plugin. I guess you can start here. Checkout uploadPics function in my-data/symptom-statement\service\symptom.service.js 
	
