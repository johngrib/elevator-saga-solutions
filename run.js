#!/usr/bin/env node

const {
    Builder,
    By,
    Key,
    until
} = require('selenium-webdriver');

console.log('arguments: ' + process.argv.slice(2));

const driver = new Builder()
    .forBrowser('chrome')
    .build();

driver.get('http://www.google.com/ncr')
    .then(_ =>
        driver.findElement(By.name('q')).sendKeys('webdriver', Key.RETURN))
    .then(_ => driver.wait(until.titleIs('webdriver - Google Search'), 1000))
    .then(_ => driver.quit());
