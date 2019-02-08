#!/usr/bin/env node

const fs = require('fs');
const {
    Builder,
    By,
    Key,
    until
} = require('selenium-webdriver');

const inputPath = './solutions/' + process.argv.slice(2).pop() + '.js';

if (!fs.existsSync(inputPath)) {
    console.log("File not found: " + inputPath);
    return;
}

const solution = fs.readFileSync(inputPath, 'utf8');
console.log(solution);

return;


const driver = new Builder()
    .forBrowser('chrome')
    .build();

driver.get('http://www.google.com/ncr')
    .then(_ =>
        driver.findElement(By.name('q')).sendKeys('webdriver', Key.RETURN))
    .then(_ => driver.wait(until.titleIs('webdriver - Google Search'), 1000))
    .then(_ => driver.quit());
