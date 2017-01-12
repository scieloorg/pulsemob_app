
#!/bin/bash
cordova platform rm ios
cordova platform rm android

cd plugins
rm -rf *
cd ..

cordova platform add ios

cordova -d plugin add https://github.com/Infobase/oauth_patch_plugin.git --variable FACEBOOK_APP_ID="774954805873506"

cordova -d plugin add cordova-plugin-googleplus --variable REVERSED_CLIENT_ID=com.googleusercontent.apps.922330665571-qiu6cj3udr5gtrjvne4d5ceobl0bsj01

cordova -d plugin add https://github.com/marcellus-sb/phonegap-facebook-plugin.git --variable APP_ID="774954805873506" --variable APP_NAME="SciELO"

cordova -d plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-device.git

cordova -d plugin add https://github.com/apache/cordova-plugin-inappbrowser.git

cordova -d plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-globalization.git

cordova -d plugin add cordova-plugin-x-socialsharing

cordova -d plugin add https://github.com/marcellus-sb/ionic-plugins-keyboard.git

cordova -d plugin add https://github.com/marcellus-sb/phonegap-plugin-loading-spinner.git

cordova -d plugin add https://github.com/danwilson/google-analytics-plugin.git

cordova -d plugin add https://github.com/apache/cordova-plugin-whitelist

# Remover a biblioteca duplicada (instalada pelo plugin do google plus e facebook connect)
# cordova -d plugin rm android.support.v4