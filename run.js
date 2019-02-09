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
    URL: '',
    timeLimit: 0,
    solution: {
        fileAddr: '',
        code: '',
    }
};

game_setting: {
    let [stage, errorArg2] = getStageNumber(process.argv[2]);
    let [fileName, errorArg3] = getFileName(process.argv[3]);

    if (errorArg2 || errorArg3) {
        printUsage();
        process.exit(1);
        return;
    }
    game.stage = stage;
    game.URL = `https://play.elevatorsaga.com/#challenge=${game.stage}`
    game.solution.fileAddr = fileName;
    game.solution.code = fs.readFileSync(game.solution.fileAddr, 'utf8');

    console.log(game.solution.code);
}

run_the_solution: {
    const driver = new Builder()
        .forBrowser('chrome')
        .build();

    driver.get(stageURL)
    .then(getTimeLimit)
    .then(prepareInject)
    .then(injectSolution)
    .then(clickReset)
    .then(clickApply);
}

// functions ------------------------------------------------------------------

function getTimeLimit() {
    driver
        .findElement(By.xpath('/html/body/div/div[2]/div/h3/span[2]'))
        .getText()
        .then((text) => {
            game.timeLimit = parseInt(text, 10);
            console.log(`The time limit is ${game.timeLimit} sec.`);
        });
}

function prepareInject() {
    driver.executeScript('console.log("code injection start")')
    driver.executeScript('confirm = function() { return true; };')
    driver.executeScript("mycode = \`" + game.solution.code + "\`")
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
        return [0, true];
    }

    if (!isDigit(inputVal)) {
        console.log(`Wrong arg: ${inputVal} is not a number. It means stage number.`)
        return [0, true];
    }
    return [parseInt(inputVal, 10), false];
}

function getFileName(userInput) {
    if (userInput == null) {
        return ['', true];
    }
    if (fs.existsSync(userInput)) {
        return [userInput, false];
    }

    const autoPath = `./solutions/${userInput}.js`;
    if (fs.existsSync(autoPath)) {
        return [autoPath, false];
    }
    console.log("File not found: " + userInput);
    return ['', true];
}
