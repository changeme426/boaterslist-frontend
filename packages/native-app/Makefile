.PHONY: build build-android clean clean-cache dev dev-clear-cache env-setup install

TARGET_ENV ?= development

# load .env variables
ifneq ("$(wildcard .env.${TARGET_ENV})", "")
include .env.${TARGET_ENV}
endif
ifneq ("$(wildcard .env.${TARGET_ENV}.local)", "")
include .env.${TARGET_ENV}.local
endif

export EXPO_TOKEN

clean:
	rm -rf .expo node_modules
	rm -f *.log

clean-cache:
	rm -rf ./node_modules/.cache/babel-loader

dev: build-prep
	expo start

start-prod: build-prep
	expo start --no-dev --minify

dev-clear-cache:
	expo start -c

install:
	yarn
	yarn global add expo-cli@5.2.0
	yarn global add eas-cli@0.47.0
	yarn postinstall

build: build-prep
	expo prebuild
	# remove from .gitignore during build (ugly but effective)
	sed -i '/^\/assets\/common\/$$/d' .gitignore
	sed -i '/^\/compiled-lang\/$$/d' .gitignore
	eas build:configure --platform=all
	expo publish
	eas build --platform=all --non-interactive
	echo '/assets/common/' >> .gitignore
	echo '/compiled-lang/' >> .gitignore

build-submit-android: build-prep
	expo prebuild
	# remove from .gitignore during build (ugly but effective)
	sed -i '/^\/assets\/common\/$$/d' .gitignore
	sed -i '/^\/compiled-lang\/$$/d' .gitignore
	eas build:configure --platform=android
	expo publish
	eas build --platform=android --auto-submit --non-interactive
	echo '/assets/common/' >> .gitignore
	echo '/compiled-lang/' >> .gitignore

build-submit-ios: build-prep
	expo prebuild
	# app compliance
	sed -i '5i \    <key>ITSAppUsesNonExemptEncryption<\/key>\n    <false\/>' ios/Boaterslist/Info.plist
	# remove android/ios from .gitignore during build (ugly but effective)
	sed -i '/^\/assets\/common\/$$/d' .gitignore
	sed -i '/^\/compiled-lang\/$$/d' .gitignore
	eas build:configure --platform=ios
	expo publish
	eas build --platform=ios --auto-submit --non-interactive
	echo '/assets/common/' >> .gitignore
	echo '/compiled-lang/' >> .gitignore

extract:
	yarn extract '**/*.ts*' --ignore='**/*.d.ts' --ignore='node_modules' --out-file lang/en.json --id-interpolation-pattern '[sha512:contenthash:base64:6]'

build-prep:
	yarn compile lang/fr.json --ast --out-file compiled-lang/fr.json
	yarn compile lang/es.json --ast --out-file compiled-lang/es.json
# android workspace image path workaround
	rm -rf assets/common
	mkdir -p assets/common
	cp -r ../common/assets assets/common
