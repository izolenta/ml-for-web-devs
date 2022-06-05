import './detector.css';
import {ReactNode, RefObject, useEffect, useRef, useState} from "react";
import {DetectedObject, ObjectDetection} from "@tensorflow-models/coco-ssd";
import * as tf from '@tensorflow/tfjs';

const cocoSsd = require('@tensorflow-models/coco-ssd');
require('@tensorflow/tfjs-backend-cpu');
require('@tensorflow/tfjs-backend-webgl');

tf.setBackend('webgl');

declare global {
  interface Window {
    stream:any;
  }
}

const Detector = () => {

  const [isInitialized, setInitialized] = useState(false);
  const [boundingData, setBoundingData] = useState(Array<DetectedObject>());
  const [boxes, setBoxes] = useState(Array<ReactNode>());
  const [isVideoLoaded, setVideoLoaded] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  let model = useRef<ObjectDetection | null>(null);

  useEffect(() => {
    cocoSsd.load().then((result:ObjectDetection) => {
      model.current = result;
      setInitialized(true);
    });
    navigator.mediaDevices
      .getUserMedia({
        audio: false,
        video: {
          facingMode: "user"
        }
      })
      .then(stream => {
        window.stream = stream;
        videoRef.current!.srcObject = stream;
        return new Promise((resolve, reject) => {
          videoRef.current!.onloadedmetadata = () => {
            setVideoLoaded(true);
          };
        });
      });

  }, [])

  useEffect(() => {
    if (isInitialized && isVideoLoaded) {
      frameDetection(videoRef, model.current!);
    }
  }, [isInitialized, isVideoLoaded])


  useEffect(() => {
    let nodes = [];
    for (let next of boundingData) {
      let cls = next.class;
      let positionFrame = {left: next.bbox[0]+'px', top: next.bbox[1]+'px', width: next.bbox[2]+'px', height: next.bbox[3]+'px'};
      let positionHeader = {left: next.bbox[0]+'px', top: (next.bbox[1]-60)+'px'};
      let box = <div className={'positioned'} style={positionFrame}></div>;
      let header = <div className={'header'} style={positionHeader}>{cls}</div>;
      nodes.push(box);
      nodes.push(header);
    }
    setBoxes(nodes);
  }, [boundingData])

  function frameDetection(video: RefObject<HTMLVideoElement>, model: ObjectDetection) {
    tf.engine().startScope();
    model.detect(video.current!, 10, 0.5).then(predictions => {
      if (predictions !== undefined) {
        setBoundingData(predictions);
      }
      setTimeout(() => {
        requestAnimationFrame(() => {
          frameDetection(video, model);
        });
      }, 50);
      tf.engine().endScope();
    });
  }

  if (isInitialized) {
    return (
      <div>
        <div className={'headline'}>Multibox Objects Pre-Trained model</div>
        <div className={'wrapper'}>
          <video
            className="size"
            autoPlay
            playsInline
            muted
            preload={'auto'}
            ref={videoRef}
            id="frame"
          />
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