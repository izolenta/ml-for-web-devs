# ML for Web Devs WebExpo talk

## Live demos

- [Detect objects on photo](https://objects.techsample.net/)

## Links and articles

- [MNIST digits dataset](http://yann.lecun.com/exdb/mnist/)
- [Car brand logos dataset](https://www.kaggle.com/datasets/volkandl/car-brand-logos)
- [How to do custom objects detection](https://blog.tensorflow.org/2021/01/custom-object-detection-in-browser.html)

## Examples

### `snake-training`

Training routine for snake game, [brain.js](https://brain.js.org/)

Run `node src/trainingService.js`, it will produce `snake.json` file with the neural network definition 

### `snake_game`

Snake, controlled by the neural network.

You can either use included `src/service/trainedData.ts` network definition or copy content of `snake.json` produced by `snake_training` into `src/service/trainedData.ts`

Run `npm start` to start the game

### `digits_training`

Training routine for handwritten digits recognition, [tensorflow.org/js](https://www.tensorflow.org/js)

Run `node src/tensorflowTrain.js`, it will produce `tensorflowTrainingData` folder with `model.json` and `weights.bin` files that contain the neural network definition

### `digits recofnition`

Handwritten digits recognition in your browser

You can either use included `model.json` and `weights.bin` network definition in `public/tf_data` or copy files produced by `digits_training` into `public/tf_data`

Run `npm start` to start the demo

### `multibox-detection`

Common Objects Detection on photo in your browser (pre-trained tensorflow.js common-object-in-context model). Works in the browser (has no BE)

Run `npm start` to start the demo

### `video-detection`

Common Objects Detection on video in your browser (pre-trained tensorflow.js common-object-in-context model). Works in the browser (has no BE)

Run `npm start` to start the demo
