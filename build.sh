#!/bin/bash

VERSION=$1
datetime=`date '+%m%d.%H%M'`
exportDir="builds"
projectDir=`pwd`
SERVER="prod"
LASTBUILDVERSION=`ls builds/ |grep ipa | sed "s/ios-//g" | sed "s/.ipa//g" | awk -F '.' '{print $1"."$2"."$3}' | uniq | sort -dr | head -n 1`

if [ "$#" = "2" ]; then
	echo welcome to fd-mobile auto build shell.
	SERVER=$2
else 
	echo
	echo 请按照以下格式提供【版本号】和【服务器地址配置文件】两个参数:
	echo
	echo     ./buils.sh \$version \$server
	echo
	echo 例如：
	echo
	echo     ./build.sh $LASTBUILDVERSION prod
	echo 
	echo 最近一次构建版本号:$LASTBUILDVERSION
	echo 可供选择的服务器地址配置文件:`ls $projectDir/fd_mobile/common/constants | grep "env-" | grep ".json" | sed "s/env-//g" | sed "s/.json//g"` | sed "s/ /,/g"
	echo 服务器地址配置文件见 $projectDir'/fd_mobile/common/constants'
	echo 如需额外添加请提交到git上
 	exit
fi

cpwd=`pwd`

echo $VERSION.$datetime
cd $projectDir

git stash
git stash drop
#git pull --rebase  http://Haiyang.zhu:nanJING2013@130.147.219.56/bama/bama-1.0.git develop
git pull

echo entering project dir $projectDir

bower install 
npm install

#chmod -Rv 755 * >> /dev/null 2>&1
chmod +x $projectDir/hooks/after_prepare/update_platform_config.js

gulp config --setWidgetAttr="version=$VERSION.$datetime"
gulp config --setWidgetAttr="ios-CFBundleVersion=$datetime"
gulp --cordova "build ios" --app fd_mobile --env $SERVER --appversion $VERSION.$datetime
cordova build ios --release --device --buildFlag="codeSignIdentity=iPhone Distribution" --buildFlag="packageType=enterprise" --buildFlag="developmentTeam=7YY4NV42A9" --buildFlag="provisioningProfile=28b4d71e-c0c4-4245-b630-610c0be130dd"


#cordova build ios  --release
#gulp --cordova "build ios" --app fd_mobile --env $SERVER --appversion $VERSION.$datetime
#xcrun -sdk iphoneos PackageApplication  "$projectDir/platforms/ios/build/emulator/fd.app" -o "$exportDir/ios-$VERSION.$datetime($SERVER).ipa"

echo
echo 
if [ "$?" -ne "0" ]; then
	echo build error.
	echo
	echo
	exit $?
fi

ipafile=$exportDir/ios-$VERSION.$datetime-$SERVER.ipa
plistfile=$exportDir/ios-$VERSION.$datetime-$SERVER.plist

cp  $projectDir/platforms/ios/build/device/fd.ipa $ipafile
cat $exportDir/fd_template.plist | sed "s/FD_FILE_NAME/ios-$VERSION.$datetime-$SERVER.ipa/g" | sed "s/FD_VERSION/$VERSION.$datetime/g" > $plistfile

#echo sending ipa file
#sshpass -p Bama123 scp $plistfile root@192.168.1.105:/bama/release/apk-builds/
#echo sending plist file
#sshpass -p Bama123 scp $ipafile root@192.168.1.105:/bama/release/apk-builds/
#echo
echo
echo build ok
echo 
#echo 已上传到 https://192.168.1.105/ 
echo
echo
