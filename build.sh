#!/bin/bash

VERSION=`date '+%y%m%d%H%M'`
exportDir="builds"
projectDir=`pwd`
SERVER="prod"

if [ "$#" = "1" ]; then
	echo welcome to fd-mobile auto build shell.
	SERVER=$1
else 
	echo
	echo 请按照以下格式提供【服务器地址配置文件】参数:
	echo
	echo     ./buils.sh \$server
	echo
	echo 例如：
	echo
	echo     ./build.sh prod
	echo 
	echo 可供选择的服务器地址配置文件:`ls $projectDir/fd_mobile/common/constants | grep "env-" | grep ".json" | sed "s/env-//g" | sed "s/.json//g"` | sed "s/ /,/g"
	echo 服务器地址配置文件见 $projectDir'/fd_mobile/common/constants'
	echo 如需额外添加请提交到git上
 	exit
fi

cpwd=`pwd`

echo 'version(year,month,day): '$VERSION
cd $projectDir

#git stash
#git stash drop
#git pull

echo entering project dir $projectDir

echo bower installing
bower install 
echo npm installing
npm install

echo cleaning platforms
rm -rf platforms/*
echo cleaning plugins
rm -rf plugins/*

echo adding ios@4.4.0
cordova platform add ios@4.4.0 --nosave --nofetch
echo adding android@6.2.3
cordova platform add android@6.2.3 --nosave --nofetch

echo gulp configuring
gulp config --setWidgetAttr="version=$VERSION"
gulp config --setWidgetAttr="android-versionCode=$VERSION"
gulp config --setWidgetAttr="ios-CFBundleVersion=$VERSION"
echo gulp building
gulp build --app fd_mobile --env $SERVER --appversion $VERSION --cordova "xxx"

echo build ios release
cordova build ios --release --device
mv platforms/ios/build/device/佳诚装饰.ipa builds/$VERSION.release.ipa
mv builds/$VERSION.release.ipa builds/latest.ipa

echo build ios debug
cordova build ios --debug --device
mv platforms/ios/build/device/佳诚装饰.ipa builds/$VERSION.debug.ipa

echo build android relase
cordova build android --release
mv platforms/android/build/outputs/apk/android-release.apk builds/$VERSION.release.apk
mv builds/$VERSION.release.apk builds/latest.apk

echo build android debug
cordova build android --debug
mv platforms/android/build/outputs/apk/android-debug.apk builds/$VERSION.debug.apk


echo
echo 
if [ "$?" -ne "0" ]; then
	echo build error.
	echo
	echo
	exit $?
fi

echo
echo build ok
echo 
echo
echo
