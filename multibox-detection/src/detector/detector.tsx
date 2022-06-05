import './detector.css';
import {ChangeEvent, ReactNode, useEffect, useRef, useState} from "react";
import {DetectedObject, ObjectDetection} from "@tensorflow-models/coco-ssd";

const cocoSsd = require('@tensorflow-models/coco-ssd');
require('@tensorflow/tfjs-backend-cpu');
require('@tensorflow/tfjs-backend-webgl');

let model:ObjectDetection;

const Detector = () => {

  const [isInitialized, setInitialized] = useState(false);
  const [boundingData, setBoundingData] = useState(() => Array<DetectedObject>());
  const [boxes, setBoxes] = useState(() => Array<ReactNode>());

  useEffect(() => {
    cocoSsd.load().then((result:ObjectDetection) => {
      model = result;
      setInitialized(true);
    });
  }, [])

  useEffect(() => {
    let nodes = [];
    for (let next of boundingData) {
      let positionFrame = {left: next.bbox[0]+'px', top: next.bbox[1]+'px', width: next.bbox[2]+'px', height: next.bbox[3]+'px'};
      let positionHeader = {left: next.bbox[0]+'px', top: (next.bbox[1]-60)+'px'};
      let box = <div className={'positioned'} style={positionFrame}></div>;
      let header = <div className={'header'} style={positionHeader}>{next.class} {next.score.toFixed(2)}</div>;
      nodes.push(box);
      nodes.push(header);
    }
    setBoxes(nodes);
  }, [boundingData])

  const imageRef = useRef<HTMLImageElement>(null);

  async function fileLoaded(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      let file = e.target.files[0];

      const image = imageRef.current!;
      let fr = new FileReader();

      fr.onload = function() {
        if (fr !== null && typeof fr.result == "string") {
          image.src = fr.result;
        }
      };
      fr.readAsDataURL(file);

      image.onload = async function() {
        let objects = await model.detect(imageRef.current!)
        setBoundingData(objects);
      };
    }
  }

  if (isInitialized) {
    return (
      <div>
        <div className={'headline'}>Multibox Objects Pre-Trained model</div>
        <input className={'input'} type='file' accept={'image/*'} multiple={false} onChange={(e) => fileLoaded(e)}/>
        <div className={'wrapper'}>
          <img ref={imageRef} width={1000}></img>
          { boxes }
        </div>
      </div>
    );
  }
  else {
    return(
      <div>Loading...</div>
    );
  }
}

export default Detector;