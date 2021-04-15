const { Classifier } = require('ml-classify-text')

// class Classifier {
//     constructor(model) {
//         this.data = new Map();
//         this.classifier = null;
//         if (model) this.classifier = new mlClassifier(model);
//         this.classifier = new mlClassifier();
//     }
//     addData(label, data){
//         const previousData = this.data.get(label) || [];
//         previousData.push(data);
//         this.data.set(label, previousData);
//     }
//     predict(text){
//         this.classifier
//     }
//     train() {
//         this.data.forEach((value, key) => {
//             classifier.train(value, key)
//         });
//     }
// }

module.exports = Classifier;