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
    solution: {
        fileAddr: '',
        code: '',
    }
};

let [stage, halt] = getStageNumber(process.argv[2]);

if (halt) {
    process.exit(1);
    return;
}

game.stage = stage;

get_file_name: {
    const thirdArg = process.argv[3];
    if (thirdArg == null) {
        printUsage();
        return;
    }

    const autoPath = `./solutions/${thirdArg}.js`;

    if (fs.existsSync(autoPath)) {
        game.solution.fileAddr = autoPath;

    } else if (fs.existsSync(thirdArg)) {
        game.solution.fileAddr = thirdArg;

    } else {
        console.log("File not found: " + thirdArg);
        return;
    }
}

const stageURL = `https://play.elevatorsaga.com/#challenge=${game.stage}`
const solution = fs.readFileSync(game.solution.fileAddr, 'utf8');
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

function printUsage() {
    console.log("Usage:\n\t$ ./run.js [stage] [solution_file]");
    console.log("Example:\n\t$ ./run.js 1 ./solutions/01.js");
    console.log("\t$ ./run.js 1 01");
}

function getStageNumber(inputVal) {
    if (inputVal == null) {
        printUsage();
        return [0, true];
    }

    if (!isDigit(inputVal)) {
        console.log(`Wrong arg: ${inputVal} is not a number. It means stage number.`)
        return [0, true];
    }
    return [parseInt(inputVal, 10), false];
}
