# Boaterslist Frontend Monorepo

This repo contains 3 frontend node modules in `packages`:

- `common`: Common cross-platform components, hooks, etc
- `native-app`: Expo/React Native iOS and Android application
- `web-app`: Next.js web application

## Getting started

### Preconditions
1. Clone this repo

2. Setup GitLab access token in ~/.netrc. This file will look like this.

```
machine gitlab.com
login oauth2
password <GITLAB_PERSONAL_ACCESS_TOKEN>
```

[Please check this if you are not familiar with token.](https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html)

3. Setup GitLab access token in ~/.docker/config.json (docker login registry.gitlab.com). The file will look like this.

```
{
	"auths": {
		"registry.gitlab.com": {
			"auth": <AUTH_TOKEN>
		}
	}
}
```
- [config.json will be created automatically when you use docker login:](https://docs.docker.com/engine/reference/commandline/login/)
- [Be sure you're logging in as your user, not root (ie do not use sudo)](https://docs.docker.com/engine/install/linux-postinstall/)
- [Please check this for the Docker login](https://docs.docker.com/engine/reference/commandline/login/)

4. Setup access tokens in packages/web-app/.env.development.local and packages/native-app/.env.development.local
.env.development.local file will be provided with the predecessor or porject owner(Project owner must keep this file on his side).

### Run and Install

- `source ./bootstrap.sh`
- `make install`
- `make backend-migrate`
- `cd native-app; make dev`
- `cd web-app; make dev`

#### Please make sure you are under root folder.


## Major Area TODOs

- dialogs
- internationalization
- login
- map
- location

## References

- [React native SVG generator](https://react-svgr.com/playground/?native=true&typescript=true)
- [SVG optimizer](https://jakearchibald.github.io/svgomg/)
- [Example marketplace site](https://www.boatsetter.com/boat-rentals/fort-lauderdale--fl--united-states)

## Setup - Android Emulator

- [Android Studio](https://docs.expo.dev/workflow/android-studio-emulator/)

## How authorized testers turn on internal app sharing

Before authorized testers can download apps using internal app sharing, they need to turn on internal app sharing on their Google Play Store app.

1. Open the Google Play Store app Google Play.
2. Click account profile picture -> Settings.
3. In the “About” section, tap the Play Store version 7 times.
4. In the "General" section turn on Internal app sharing

[Google Play](https://play.google.com/apps/internaltest/4699833658855632578)

## How to test internal app in case "update" option is not appearing

option 1:

1. Remove app from your device
2. Click and install the app from a PC.

option 2:

1. Go Device Settings -> Apps -> All and click on the Play Store App entry.
2. Scroll down and click on Clear Cache.

## AWS

### Accounts

| Account Alias                                                             | Account ID   | Regions   | Notes                             |
| ------------------------------------------------------------------------- | ------------ | --------- | --------------------------------- |
| [boaterslist](https://boaterslist.signin.aws.amazon.com/console)          | 677471599795 |           | Root account (Current Production) |
| [boaterslist-dev](https://boaterslist-dev.signin.aws.amazon.com/console)  | 058556054004 | us-east-1 | Development                       |
| [boaterslist-prod](https://boaterslist-dev.signin.aws.amazon.com/console) | 849854957060 | us-east-1 | New Production                    |

## env vars

yarn global add vercel
vercel link
vercel env pull
