# SciELO Mobile

## Configuração de ambiente de desenvolvimento


# Pré-requisitos

Para montar o ambiente de desenvolvimento do aplicativo da SciELO, as seguintes ferramentas são necessárias:

- Node.js: [https://nodejs.org/en/](https://nodejs.org/en/)
- Cordova: [https://cordova.apache.org/](https://cordova.apache.org/)
  - Nesse projeto foi utilizada a versão 5.4.1
- Android SDK: [http://developer.android.com/intl/pt-br/sdk/index.html](http://developer.android.com/intl/pt-br/sdk/index.html)
  - A versão mais recente deve ser utilizada
- Cordova-icon: [https://www.npmjs.com/package/cordova-icon](https://www.npmjs.com/package/cordova-icon)
- Xcode: [https://developer.apple.com/xcode/download/](https://developer.apple.com/xcode/download/)
  - Nesse projeto foi utilizada a versão 7.1.1
- Netbeans: [https://netbeans.org/](https://netbeans.org/)
  - IDE utilizada para desenvolvimento do projeto cordova

# Script de Configuração

O script a baixo foi desenvolvido para auxiliar a configuração do projeto. Ele deve ser executado na pasta raiz do projeto. 

Antes de executá-lo, substitua os ids das redes sociais pelos ids de suas contas nas respectivas redes.

**"prepare.sh"**

```{bash} 
#!/bin/bash
cordova platform rm ios
cordova platform rm android 
cd pluginsrm -rf \*
cd .. 
cordova platform add android
cordova platform add ios 
cordova -d plugin add https://github.com/Infobase/oauth\_patch\_plugin.git --variable FACEBOOK\_APP\_ID="<REPLACE HERE WITH YOUR APP ID>" 
cordova -d plugin add cordova-plugin-googleplus --variable REVERSED\_CLIENT\_ID="<REPLACE HERE WITH YOUR REVERSED\_CLIENT\_ID>" 
cordova -d plugin add https://github.com/marcellus-sb/phonegap-facebook-plugin.git --variable APP\_ID="<REPLACE HERE WITH YOUR APP ID>" --variable APP\_NAME="SciELO" 
cordova -d plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-device.git 
cordova -d plugin add https://github.com/Glitchbone/CordovaYoutubeVideoPlayer.git 
cordova -d plugin add https://github.com/apache/cordova-plugin-inappbrowser.git 
cordova -d plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-globalization.git 
cordova -d plugin add cordova-plugin-x-socialsharing 
cordova -d plugin add https://github.com/marcellus-sb/ionic-plugins-keyboard.git 
cordova -d plugin add https://github.com/marcellus-sb/phonegap-plugin-loading-spinner.git 
cordova -d plugin add https://github.com/apache/cordova-plugin-whitelist
cordova -d plugin add https://github.com/danwilson/google-analytics-plugin.git |
```

O script deve ser executado para criar os projetos Android e iOS com os devidos plugins.

Para compatibilidade de todos os plugins, a configuração a baixo deve ser inserida no arquivo "platforms/android/build.gradle".

```
  configurations {    all*.exclude group: 'com.android.support', module: 'support-v4'}
```

Também dever incluido o valor a baixo no grupo android -> defaultConfig

```
  applicationId "br.com.scielo"
```

Por exemplo:

```
	android {
	...
	    defaultConfig {
	        applicationId "br.com.scielo"
	        ...
	    }
	}
```

# Altrando Endereço dos Serviços

Para alterar o endereço dos serviços utilizados pelo aplicativo, as seguintes variaveis no arquivo /js/SciELO.js devem ser alteradas:

```
	SciELO.solrURL = "http://<SERVER ADDRESS>/"; //Endereço do SOLR com os dados da SciELO indexados
	SciELO.imageBaseURL = "http://<SERVER ADDRESS>/"; //Endereço das imagens submetidas pelo backoffice
	SciELO.serverURL = "http://<SERVER ADDRESS>/webservices/mobile/"; //Endereço dos serviços utilizados pelo aplicativo
```

# Altrando Google Analytics

Para alterar o Tracking Id do Google Analytics utilizado pelo aplicativo, o métedo no arquivo /js/App.js deve ser alterado:

```
	analytics.startTrackerWithId('<TRACKING ID>'); //ID de acompanhamento do app, vinculado a uma conta do Google
	
```

# Gerando versão Android

O script a baixo executa os passos necessários para gerar o pacote APK que possa ser submetido para Google Play Store.

```{bash}
#!/bin/bash 
cordova build android --release 
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore SciELO.keystore platforms/android/build/outputs/apk/android-release-unsigned.apk scielo -storepass <REPLACE WITH STORE PASS> -keypass <REPLACE WITH KEY PASS> -tsa http://timestamp.digicert.com 
zipalign -f -v 4 platforms/android/build/outputs/apk/android-release-unsigned.apk platforms/android/build/outputs/apk/SciELO.apk
```

Keystore utilizado para gerar o pacote:

# Gerando versão iOS

Para gerar a versão para iOS, o comando a baixo deve ser executado na pasta raiz do projeto.

```{bash}
cordova build ios
```

Em seguida, o projeto para Xcode é gerado na pasta platforms/ios. Para sumbter uma versão para o itunes deve seguir os procedimentos padrões.

# Habilitando o login do Google

Para habilitar o login tem que ser criada duas credencias em [oauthclient](https://console.developers.google.com/apis/credentials/oauthclient)

A primeira é a credencial de **Aplicativo da Web** usando as configurações:

- Origens JavaScript autorizadas
    * http://localhost:8080
    * http://localhost:3000

- URIs de redirecionamento autorizados
    * http://localhost:8080
    * http://localhost

No final desta configuração será gerada uma Id do cliente. Essa Id tem que ser usada no *prepare.sh*, mas de forma invertida. E também ela tem que ser inserida no arquivo **LoginController.js** nos campos: *LoginController.IOS_API_KEY* e  *webClientId*

A segunda credencial é a de **Android** usando a configuração:

- Nome do pacote
    * br.com.scielo
    
Também tem que informar o SHA-1, na pópia página Credenciais informa como obter. Para informações mais detalhadas acesse [app-signing](https://developer.android.com/studio/publish/app-signing.html)

  
