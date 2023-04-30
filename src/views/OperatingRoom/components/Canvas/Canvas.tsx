import { CanvasHTMLAttributes, forwardRef } from 'react';
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../../../../common';
import { CanvasElement, CanvasElementProps } from './style';

type CanvasProps = CanvasHTMLAttributes<HTMLCanvasElement> & CanvasElementProps;

// eslint-disable-next-line react/display-name, @typescript-eslint/ban-types
export const Canvas = forwardRef<HTMLCanvasElement, CanvasProps>((props, ref) => (
    <CanvasElement {...props} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} ref={ref} />
));
