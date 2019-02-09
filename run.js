#!/usr/bin/env node

const fs = require('fs');
const {
    Builder,
    By,
    Key,
    until,
} = require('selenium-webdriver');

const game = {
    stage: 1,
};

get_stage_number: {
    const secondArg = process.argv[2];
    if (secondArg == null) {
        console.log("Usage:\n\t$ ./run.js stage solution_file.js");
        console.log("Example:\n\t$ ./run.js 1 ./solutions/01.js");
        return;
    }

    if (!isDigit(secondArg)) {
        console.log(`Wrong arg: ${secondArg} is not a number. It means stage number.`)
        return;
    }
    game.stage = parseInt(secondArg, 10);
}


const stageURL = `https://play.elevatorsaga.com/#challenge=${game.stage}`

const inputPath = './solutions/01.js';

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

driver.get(stageURL)
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

function isDigit(str) {
    return /^\d+$/.test(str);
}
