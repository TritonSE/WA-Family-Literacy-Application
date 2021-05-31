#!/usr/bin/env bash
set -euxo pipefail

pod install

xcodebuild \
  -workspace LetsRead.xcworkspace \
  -scheme LetsRead \
  -sdk iphoneos \
  -configuration Release \
  -allowProvisioningUpdates \
  archive \
  -archivePath $PWD/build/lets-read.xcarchive

xcodebuild \
  -exportArchive \
  -allowProvisioningUpdates \
  -archivePath $PWD/build/lets-read.xcarchive \
  -exportOptionsPlist ExportOptions.plist \
  -exportPath $PWD/build
