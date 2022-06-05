// origin: https://codelabs.developers.google.com/codelabs/tfjs-training-classfication

import {loadData, loadTestData} from "../data/loader.js";
import fs from "fs";

import tf from '@tensorflow/tfjs-node'

const model = tf.sequential()

model.add(tf.layers.conv2d({
  inputShape: [28, 28, 1],
  kernelSize: 5,
  filters: 8,
  strides: 1,
  activation: 'relu',
  kernelInitializer: 'varianceScaling'
}));

model.add(
  tf.layers.maxPooling2d(
    {poolSize: [2, 2], strides: [2, 2]}
  ));

model.add(tf.layers.conv2d({
  kernelSize: 5,
  filters: 16,
  strides: 1,
  activation: 'relu',
  kernelInitializer: 'varianceScaling'
}));

model.add(tf.layers.maxPooling2d({poolSize: [2, 2], strides: [2, 2]}));

model.add(tf.layers.flatten());

model.add(tf.layers.dense({
  units: 10,
  kernelInitializer: 'varianceScaling',
  activation: 'softmax'
}));

const optimizer = tf.train.adam();
model.compile({
  optimizer: optimizer,
  loss: 'categoricalCrossentropy',
  metrics: ['accuracy'],
});

const [length, dataArray, labelsArray] = loadData();
const [lengthTest, dataTestArray, labelsTestArray] = loadTestData();

const data = tf.tensor2d(dataArray);
const labels = tf.tensor2d(labelsArray, [length, 10]);

const [trainXs, trainYs] = tf.tidy(() => {
  return [
    data.reshape([length, 28, 28, 1]),
    labels
  ]
});

const testData = tf.tensor2d(dataTestArray);
const testLabels = tf.tensor2d(labelsTestArray, [lengthTest, 10]);

const [testXs, testYs] = tf.tidy(() => {
  return [
    testData.reshape([lengthTest, 28, 28, 1]),
    testLabels
  ]
});

await model.fit(trainXs, trainYs, {
  batchSize: 200,
  validationData: [testXs, testYs],
  epochs: 20,
  shuffle: true,
  //callbacks: fitCallbacks
});

const filename = 'tensorflowTrainingData';

if (fs.existsSync(filename)) {
  fs.rmSync(filename, {recursive: true, force: true});
}

await model.save('file://'+filename);

console.log('done');