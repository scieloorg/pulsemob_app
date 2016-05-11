#!/bin/bash
cordova platform rm ios
cordova platform rm android

cd plugins
rm -rf *
cd ..

cordova platform add android
cordova platform add ios

cordova -d plugin add https://github.com/Infobase/oauth_patch_plugin.git --variable FACEBOOK_APP_ID="774954805873506"

#cordova -d plugin add cordova-plugin-googleplus --variable REVERSED_CLIENT_ID="com.googleusercontent.apps.903038984767-jmg2ov4lvfc5p8k214smfp3bkjv4gcm8"
cordova -d plugin add https://github.com/EddyVerbruggen/cordova-plugin-googleplus.git --variable REVERSED_CLIENT_ID="com.googleusercontent.apps.903038984767-jmg2ov4lvfc5p8k214smfp3bkjv4gcm8"

#cordova -d plugin add https://github.com/marcellus-sb/phonegap-facebook-plugin.git --variable APP_ID="774954805873506" --variable APP_NAME="SciELO"
cordova -d plugin add https://github.com/Wizcorp/phonegap-facebook-plugin.git --variable APP_ID="774954805873506" --variable APP_NAME="SciELO"

cordova -d plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-device.git

cordova -d plugin add https://github.com/Glitchbone/CordovaYoutubeVideoPlayer.git

cordova -d plugin add https://github.com/apache/cordova-plugin-inappbrowser.git

cordova -d plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-globalization.git

cordova -d plugin add cordova-plugin-x-socialsharing

cordova -d plugin add https://github.com/marcellus-sb/ionic-plugins-keyboard.git

cordova -d plugin add https://github.com/marcellus-sb/phonegap-plugin-loading-spinner.git

cordova -d plugin add https://github.com/danwilson/google-analytics-plugin.git

# Remover a biblioteca duplicada (instalada pelo plugin do google plus e facebook connect)
# cordova -d plugin rm android.support.v4
