let ALT_CLASSIFIER = new Classifier();
let ALT_FILE;
let ALT_CONTROL_FILE;
const SPAM = 'spam';
const HAM = 'ham';

class GuessingStats {
    constructor(percent, quantityOfTrainSentences) {
        this.percent = percent;
        this.quantityOfSentences = quantityOfTrainSentences;
    }
}

//setup source file.
//just use something like <input type="file" onchange="setupSourceFile(this)">
function setupSourceFile(input) {
    let file = input.files[0];
    ALT_FILE = file;
    return `File name: ${file.name}`
}

//setup control file for testing percentage of correct results dependence from train quantity;
//file with same structure as train file
function setupControlFile(input) {
    let file = input.files[0];
    ALT_CONTROL_FILE = file;
    return `File name: ${file.name}`
}

//rowsNumber - number of file rows used for training classifier
function trainClassifier(rowsNumber) {
    if (ALT_FILE === undefined) {
        return "File not found";
    }

    let reader = new FileReader();
    reader.readAsText(ALT_FILE);
    reader.onload = function () {
        let lines = reader.result.split('\n');
        for (let i = 0; i <= rowsNumber && i < lines.length; i++) {
            let data = lines[i].split(',');
            ALT_CLASSIFIER.train(data[0], data[1]);
        }

        ALT_CLASSIFIER.probabilities();
    }

    reader.onerror = function () {
        console.log(reader.error);
    }
}

//if spam returns 'spam' otherwise 'ham'
function guessClass(string) {
    let res = ALT_CLASSIFIER.guess(string);
    return res[SPAM] > 0.5 ? SPAM : HAM;
}

//starts test of success dependence from train data quantity.
//call function trainDependenceCallback(results) as callback.
//return string if file not found.
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
            let rowsForTrain = i * rowsNumberForStep;
            ALT_CLASSIFIER = new Classifier();

            for (let j = 0; j <= rowsForTrain && j < lines.length; j++) {
                let data = lines[i].split(',');
                ALT_CLASSIFIER.train(data[0], data[1]);
            }
            ALT_CLASSIFIER.probabilities();


            let successfulResult = 0;
            for (let k = 0; k < controlData.length; k++) {
                let controlDataLine = controlData[k].split(',');
                let res = guessClass(controlDataLine[1]);
                if (res === controlDataLine[0]) {
                    successfulResult++;
                }
            }

            let percentageOfSuccess = successfulResult / (controlData / 100);
            results.push(new GuessingStats(percentageOfSuccess, rowsForTrain))
        }

        trainDependenceCallback(results);
    }

    reader.onerror = function () {
        console.log(reader.error);
    }
}

//callback for testing success rate dependence. Change it accordingly to usage.
function trainDependenceCallback(results) {
    //end of testing
}