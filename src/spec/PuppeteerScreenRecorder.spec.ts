import fs from 'fs';

import test from 'ava';
import puppeteer from 'puppeteer';

import {
  PuppeteerScreenRecorder,
  PuppeteerScreenRecorderOptions,
} from '../lib/PuppeteerScreenRecorder';

test('case 1 --> Happy Path: Should be able to create a new screen-recording session', async (assert) => {
  /** setup */
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  const outputVideoPath = './test-output/test/video-recorder/testCase1.mp4';
  const recorder = new PuppeteerScreenRecorder(page);
  const recorderValue = await recorder.start(outputVideoPath);

  /** execute */
  await page.goto('https://github.com', { waitUntil: 'load' });
  await page.goto('https://google.com', { waitUntil: 'load' });

  /** clear */
  const status = await recorder.stop();
  await browser.close();

  /** assert */
  assert.is(recorderValue instanceof PuppeteerScreenRecorder, true);
  assert.is(status, true);
  assert.is(fs.existsSync(outputVideoPath), true);
});

test('case 2 --> Happy Path: should be to get the total duration of recording', async (assert) => {
  /** setup */
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  const outputVideoPath = './test-output/test/video-recorder/testCase2.mp4';
  const recorder = new PuppeteerScreenRecorder(page);
  const recorderValue = await recorder.start(outputVideoPath);

  /** execute */
  await page.goto('https://github.com', { waitUntil: 'load' });

  await page.goto('https://google.com', { waitUntil: 'load' });
  /** clear */
  const status = await recorder.stop();

  const duration = recorder.getRecordDuration();
  await browser.close();

  /** assert */
  assert.is(recorderValue instanceof PuppeteerScreenRecorder, true);
  assert.is(status, true);
  assert.is(duration !== '00:00:00:00', true);
  assert.is(fs.existsSync(outputVideoPath), true);
});

test('test 3 -> Error Path: should throw error if an invalid savePath argument is passed for start method', async (assert) => {
  /** setup */
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    const outputVideoPath = './test-output/test/video-recorder/';
    const recorder = new PuppeteerScreenRecorder(page);
    await recorder.start(outputVideoPath);
    /** execute */
    await page.goto('https://github.com', { waitUntil: 'load' });

    await page.goto('https://google.com', { waitUntil: 'load' });
    /** clear */
    await recorder.stop();
  } catch (error) {
    assert.true(error.message === 'Arguments should be .mp4 extension');
  }
});

test('case 2 --> Happy Path: testing video recording with video frame width, height and aspect ratio', async (assert) => {
  /** setup */
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  const options: PuppeteerScreenRecorderOptions = {
    followNewTab: false,
    videoFrame: {
      width: 1024,
      height: 1024,
    },
    aspectRatio: '4:3',
  };
  const outputVideoPath = './test-output/test/video-recorder/testCase4.mp4';
  const recorder = new PuppeteerScreenRecorder(page, options);
  const recorderValue = await recorder.start(outputVideoPath);

  /** execute */
  await page.goto('https://github.com', { waitUntil: 'load' });
  /** clear */
  const status = await recorder.stop();

  await browser.close();

  /** assert */
  assert.is(recorderValue instanceof PuppeteerScreenRecorder, true);
  assert.is(status, true);
  assert.is(fs.existsSync(outputVideoPath), true);
});
