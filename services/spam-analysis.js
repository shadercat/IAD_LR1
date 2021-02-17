// https://github.com/shiffman/bayes-classifier-js

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
    
} // no return

function isSpam(string) { //string

} // returns boolean

function getStatistics(sentences) { // Sentence[]

} // returns GuessingStats[]

function thisIsAnExampleAndItWontBeUsed() {
    let classifier = new Classifier();

    // Text to train, followed by category name
    classifier.train("New meeting tomorrow (file)", "+");
    classifier.train("Corporate party tomorrow", "+");
    classifier.train("New greeting text", "+");

    classifier.train("Free sales party", "spam");
    classifier.train("Free file for you", "spam");
    classifier.train("Free file upload", "spam");

    classifier.probabilities();

    let results = classifier.guess("Free file tomorrow");

    return classifier.guess("Free file tomorrow")['+'].probability;
}