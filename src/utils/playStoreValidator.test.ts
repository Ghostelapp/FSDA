import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  validateAssetLinks,
  validateStoreListing,
  validateTwaManifest,
  type AssetLinkEntry,
  type PlayStoreListingMeta,
  type TwaManifestConfig,
} from './playStoreValidator';
import { buildZipArchive, isNotHtmlFallback, isValidZipBuffer } from './zipBuilder';

test('twa-manifest.json and public/twa-manifest.json are identical and pass Google Play TWA validation', () => {
  const rootManifest = JSON.parse(
    fs.readFileSync(path.resolve('twa-manifest.json'), 'utf-8')
  ) as TwaManifestConfig;
  const publicManifest = JSON.parse(
    fs.readFileSync(path.resolve('public/twa-manifest.json'), 'utf-8')
  ) as TwaManifestConfig;

  assert.deepEqual(rootManifest, publicManifest);
  const validation = validateTwaManifest(rootManifest);
  assert.equal(validation.valid, true, `Errors: ${validation.errors.join(', ')}`);
  assert.equal(rootManifest.packageId, 'com.fullstackacademy.app');
  assert.equal(rootManifest.appVersionCode, 2);
  assert.equal(rootManifest.appVersionName, '2.0.0');
});

test('public/.well-known/assetlinks.json passes Digital Asset Links SHA-256 verification', () => {
  const assetLinks = JSON.parse(
    fs.readFileSync(path.resolve('public/.well-known/assetlinks.json'), 'utf-8')
  ) as AssetLinkEntry[];
  const listing = JSON.parse(
    fs.readFileSync(path.resolve('public/play-store/karta-sklepu-play.json'), 'utf-8')
  );

  const res = validateAssetLinks(
    assetLinks,
    'com.fullstackacademy.app',
    listing.keystoreInfo.sha256Fingerprint
  );
  assert.equal(res.valid, true, `AssetLinks errors: ${res.errors.join(', ')}`);
});

test('public/play-store/karta-sklepu-play.json passes all Google Play Console limits and SDK 35 checks', () => {
  const listing = JSON.parse(
    fs.readFileSync(path.resolve('public/play-store/karta-sklepu-play.json'), 'utf-8')
  ) as PlayStoreListingMeta;

  const checks = validateStoreListing(listing);
  assert.equal(checks.length, 5);
  for (const check of checks) {
    assert.equal(check.passed, true, `Failed check ${check.id}: ${check.title} (${check.details})`);
  }
});

test('validateTwaManifest rejects invalid packageId and HTTP URLs', () => {
  const badManifest: TwaManifestConfig = {
    packageId: 'InvalidPackage',
    host: 'https://bad-host-with-protocol.com',
    name: 'Test',
    launcherName: 'TooLongLauncherName12345',
    display: 'browser',
    themeColor: '#000000',
    backgroundColor: '#000000',
    startUrl: '/',
    iconUrl: 'http://insecure.com/icon.png',
    maskableIconUrl: 'http://insecure.com/mask.png',
    appVersionCode: 0,
    appVersionName: '0.0',
    signingKey: { path: '', alias: '' },
    webManifestUrl: 'http://insecure.com/manifest.json',
  };

  const res = validateTwaManifest(badManifest);
  assert.equal(res.valid, false);
  assert.ok(res.errors.length >= 5);
});

test('buildZipArchive produces valid PKZIP and public/fullstack-academy-google-play-pack.zip is intact', () => {
  const sampleZip = buildZipArchive([
    { path: 'README.txt', data: 'Full Stack Academy Google Play Pack' },
    { path: 'android/build.gradle', data: 'apply plugin: "com.android.application"' },
  ]);
  assert.equal(isValidZipBuffer(sampleZip), true);
  assert.equal(isNotHtmlFallback(sampleZip), true);

  const htmlFallback = new TextEncoder().encode('<!doctype html><html><body>SPA</body></html>');
  assert.equal(isValidZipBuffer(htmlFallback), false);
  assert.equal(isNotHtmlFallback(htmlFallback), false);

  const diskZip = new Uint8Array(
    fs.readFileSync(path.resolve('public/fullstack-academy-google-play-pack.zip'))
  );
  assert.equal(isValidZipBuffer(diskZip), true, 'public/fullstack-academy-google-play-pack.zip must be a valid PKZIP archive');
  assert.ok(diskZip.length > 500_000, 'ZIP archive should include all Play Store graphics, keystore, and Android project');

  const expoZip = new Uint8Array(
    fs.readFileSync(path.resolve('public/fullstack-academy-expo-apk.zip'))
  );
  assert.equal(isValidZipBuffer(expoZip), true, 'public/fullstack-academy-expo-apk.zip must be a valid PKZIP archive');
  assert.ok(expoZip.length > 20_000, 'Expo ZIP archive should include all Expo project files and PNG assets');

  const easConfig = JSON.parse(fs.readFileSync(path.resolve('expo-mobile-app/eas.json'), 'utf-8'));
  assert.equal(easConfig.build.preview.android.buildType, 'apk');
  assert.equal(easConfig.build.production.android.buildType, 'app-bundle');
});

