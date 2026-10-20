"use client";

import { Stage, Layer } from 'react-konva';
import { Rect, Circle, Star } from 'react-konva';

export default function Canvas({ shapes }: { shapes: any[] }) {
  return (
    <div className='m-4'>
      <Stage width={800} height={800} >
        <Layer>
          {shapes.map((node, index) => {
            if (node.type === 'rect') {
              return <Rect key={index} {...node.props} />;
            } else if (node.type === 'circle') {
              return <Circle key={index} {...node.props} />;
            } else if (node.type === 'star') {
              return <Star key={index} {...node.props} />;
            }
          })}
        </Layer>
      </Stage>
    </div>

  );
}