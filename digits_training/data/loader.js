import fs from "fs";

export function loadData() {
  let {result, length} = readLabels('./data/train-labels-idx1-ubyte');
  let dataArray = readData('./data/train-images-idx3-ubyte', length);
  return [length, dataArray, result];
}

export function loadTestData() {
  let {result, length} = readLabels('./data/t10k-labels-idx1-ubyte');
  let dataArray = readData('./data/t10k-images-idx3-ubyte', length);
  return [length, dataArray, result];
}

function readData(path, length) {
  let offset = 16; //skipping magic number and data length, assuming it is the same as in labels file

  const dataFile = fs.readFileSync(path);
  const width = dataFile.readInt32BE(8);
  const height = dataFile.readInt32BE(12);
  const result = [];

  console.log(width, height);

  for (let i=0; i<length; i++) {
    let nextData = [];
    for (let j=0; j<width*height; j++) {
      nextData.push(dataFile.readUInt8(offset) / 255);
      offset++;
    }
    result.push(nextData);
  }
  return result;
}

function readLabels(path) {
  let offset = 4; //skipping the magic number

  const labelsFile = fs.readFileSync(path);
  const length = labelsFile.readInt32BE(offset);
  const result = [];

  offset+=4;

  for (let i=0; i<length; i++) {
    const output = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const label = labelsFile.readInt8(offset);
    output[label] = 1;
    result.push(output);
    offset++;
  }
  return {result, length};
}