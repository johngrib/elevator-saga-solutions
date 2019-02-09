#!/usr/bin/env node

const fs = require('fs');
const {
    Builder,
    By,
    Key,
    until,
} = require('selenium-webdriver');

const inputPath = './solutions/' + process.argv.slice(2).pop() + '.js';

if (!fs.existsSync(inputPath)) {
    console.log("File not found: " + inputPath);
    return;
}

const solution = fs.readFileSync(inputPath, 'utf8');
console.log(solution);

const driver = new Builder()
    .forBrowser('chrome')
    .build();

let time = 0;

driver.get('https://play.elevatorsaga.com/')
    .then(getTimeLimit)
    .then(prepareInject)
    .then(injectSolution)
    .then(clickReset)
    .then(clickApply);

function getTimeLimit() {
    driver
        .findElement(By.xpath('/html/body/div/div[2]/div/h3/span[2]'))
        .getText()
        .then((text) => {
            time = parseInt(text, 10);
            console.log(text);
            console.log(time);
        });
}

function prepareInject() {
    driver.executeScript('console.log("code injection start")')
    driver.executeScript('confirm = function() { return true; };')
    driver.executeScript("mycode = \`" + solution + "\`")
}

function injectSolution() {
    driver.executeScript(`$('#default-elev-implementation').text(mycode)`);
}

function clickReset() {
    driver.findElement(By.xpath('//*[@id="button_reset"]')).click();
}

function clickApply() {
    driver.findElement(By.xpath('//*[@id="button_apply"]')).click();
}
