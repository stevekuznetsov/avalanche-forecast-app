# avalanche-forecast-app

yay!

## Development

### Authentication Keys

Run `react-native start` in one terminal to start the dev server and `npx react-native run-android` in another to connect to a device or emulator. 

#### Android

Keys are referenced in `android/app/main/AndroidManifest.xml` using relative references, like `"@string/name"`. Add a file with your keys to the build directory to inject keys into the app:

```shell
cat <<EOF >android/app/main/res/values/api_keys.xml
<resources>
    <string name="google_maps_key">REPLACE-ME</string>
</resources>
EOF
```

Google Maps API key generation is documented [here](https://developers.google.com/maps/documentation/android-sdk/get-api-key).
