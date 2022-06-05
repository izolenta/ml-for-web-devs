import {LayersModel, loadLayersModel, Tensor, tensor2d} from '@tensorflow/tfjs'

let model: LayersModel;

export async function initModelTf() {
  model = await loadLayersModel('/tf_data/model.json');
}

export function processDataTf(digitData: number[]): number[] {
  const data = tensor2d(digitData, [1, 784]);
  const input = data.reshape([1, 28, 28, 1]);
  let result = model.predict(input) as Tensor;
  return Array.from(result.dataSync());
}