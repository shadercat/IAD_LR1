// https://github.com/shiffman/bayes-classifier-js
// dataset https://www.kaggle.com/uciml/sms-spam-collection-dataset
const CLASSIFIER = new Classifier();
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
} // returns boolean

function getStatistics(sentences) { // Sentence[]
    let counter = 0;
    let guessingResult = [];
    for (let i = 0; i < sentences.length; i++) {
        let res = isSpam(sentences[i]);
        if (res === sentences[i].isSpam) {
            counter++;
        }

        let percentage = counter / (i + 1 / 100);
        guessingResult.push(new GuessingStats(Math.floor(percentage * 100), i + 1));
    }

    return guessingResult;
} // returns GuessingStats[]

function thisIsAnExampleAndItWontBeUsed() {
    let classifierLocal = new Classifier();

    // Text to train, followed by category name
    classifierLocal.train("New meeting tomorrow (file)", "+");
    classifierLocal.train("Corporate party tomorrow", "+");
    classifierLocal.train("New greeting text", "+");

    classifierLocal.train("Free sales party", "spam");
    classifierLocal.train("Free file for you", "spam");
    classifierLocal.train("Free file upload", "spam");

    classifierLocal.probabilities();

    let results = classifierLocal.guess("Free file tomorrow");
    console.log(results);
    return classifierLocal.guess("Free file tomorrow")['+'].probability;
}