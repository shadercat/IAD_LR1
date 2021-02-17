// https://github.com/shiffman/bayes-classifier-js
// dataset https://www.kaggle.com/uciml/sms-spam-collection-dataset
let CLASSIFIER = new Classifier();
let ALT_FILE;
let ALT_CONTROL_FILE;
const SPAM = "spam";
const HAM = "ham";

class Sentence {
    constructor(string, isSpam) { //string, boolean
        this.string = string;
        this.isSpam = isSpam;
    }
}

class GuessingStats {
    constructor(percent, quantityOfSentences) { // percent is int from 0 to 100, quantityOfSentences is int from 1 to ...
        this.percent = percent;
        this.quantityOfSentences = quantityOfSentences;
    }
}

function learnExamples(sentences) { // Sentence[]
    sentences.forEach(element => {
        CLASSIFIER.train(element.string, element.isSpam ? SPAM : HAM);
    })
    CLASSIFIER.probabilities();
} // no return

function isSpam(string) { //string
    let res = CLASSIFIER.guess(string);
    return new Sentence(string, res[SPAM].probability > 0.5);
} // returns Sentence

function guessClass(string) {
    let res = CLASSIFIER.guess(string);
    console.log(res);
    return res[SPAM].probability > 0.5 ? SPAM : HAM;
}

function getStatistics(sentences) { // Sentence[]
    let counter = 0;
    let guessingResult = [];
    for (let i = 0; i < sentences.length; i++) {
        let res = isSpam(sentences[i].string).isSpam;
        if (res === sentences[i].isSpam) {
            counter++;
        }

        let percentage = counter / (i + 1 / 100);
        guessingResult.push(new GuessingStats(Math.floor(percentage * 100), i + 1));
    }

    return guessingResult;
} // returns GuessingStats[]

//setup source file.
//just use something like <input type="file" onchange="setupSourceFile(this)">
function setupSourceFile(input) {
    let file = input.files[0];
    ALT_FILE = file;
    return `File name: ${file.name}`
}

function setupControlFile(input) {
    let file = input.files[0];
    ALT_CONTROL_FILE = file;
    return `File name: ${file.name}`
}

//start learn from file
function trainClassifierFromFile() {
    if (ALT_FILE === undefined) {
        return "File not found";
    }

    let reader = new FileReader();
    reader.readAsText(ALT_FILE);
    reader.onload = function () {
        let lines = reader.result.split('\n');
        for (let i = 0; i < lines.length; i++) {
            let data = lines[i].split(',');
            CLASSIFIER.train(data[1], data[0]);
            trainCallback(i / (lines.length / 100))
        }

        CLASSIFIER.probabilities();
    }

    reader.onerror = function () {
        console.log(reader.error);
    }
}

function trainCallback(currentState){
    let indicator = document.getElementById("indicator");
    indicator.setAttribute("style", `width: ${currentState}%`)
}

function trainDependenceTest(rowsNumberForStep) {
    if (ALT_CONTROL_FILE === undefined && ALT_FILE === undefined) {
        return 'File not found';
    }

    let reader = new FileReader();
    reader.readAsText(ALT_CONTROL_FILE);
    reader.onload = function () {
        let lines = reader.result.split('\n');
        trainDependence(rowsNumberForStep, lines);
    }

    reader.onerror = function () {
        console.log(reader.error);
    }
}

//inner (private) function. Don't use it.
function trainDependence(rowsNumberForStep, controlData) {
    if (ALT_FILE === undefined) {
        return "Files not found";
    }

    let results = [];

    let reader = new FileReader();
    reader.readAsText(ALT_FILE);
    reader.onload = function () {
        let lines = reader.result.split('\n');
        let trainRoundsCount = Math.ceil(lines.length / rowsNumberForStep);

        for (let i = 1; i <= trainRoundsCount; i++) {
            CLASSIFIER = new Classifier();
            let rowsForTrain = i * rowsNumberForStep;
            for (let j = 0; j <= rowsForTrain && j < lines.length; j++) {
                let data = lines[j].split(',');
                CLASSIFIER.train(data[1], data[0]);
            }

            CLASSIFIER.probabilities();

            let successfulResult = 0;
            for (let k = 0; k < controlData.length; k++) {
                let controlDataLine = controlData[k].split(',');
                let res = guessClass(controlDataLine[1]);
                if (res === controlDataLine[0]) {
                    successfulResult++;
                }
            }

            console.log(`${successfulResult}, ${controlData.length}`);
            let percentageOfSuccess = successfulResult / (controlData.length / 100);
            results.push(new GuessingStats(percentageOfSuccess, rowsForTrain))
            testCallback(i / (trainRoundsCount / 100));
        }

        trainDependenceCallback(results);
    }

    reader.onerror = function () {
        console.log(reader.error);
    }
}

//callback for testing success rate dependence. Change it accordingly to usage.
function trainDependenceCallback(results) {
    console.log(results);
    drawStats(results);
}

function testCallback(currentState){
    let indicator = document.getElementById("indicator2");
    indicator.setAttribute("style", `width: ${currentState}%`)
}