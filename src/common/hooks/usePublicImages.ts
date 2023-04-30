import { useEffect, useState } from 'react';
import { PublicImage } from '../enums';

export const usePublicImages = (imageUrls: Record<string, PublicImage>) => {
    const [images, setImages] = useState<Record<string, HTMLImageElement>>({});

    useEffect(() => {
        console.log('my use-effect is fired');
        Object.entries(imageUrls).forEach(([key, url]) => {
            const image = new Image();
            image.src = `images/${url}`;

            image.onload = () => setImages((prev) => ({ ...prev, [key]: image }));
        });
    }, [imageUrls]);

    return images;
};
