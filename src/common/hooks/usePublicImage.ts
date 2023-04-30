import { useEffect, useState } from 'react';
import { PublicImage } from '../enums';

export const usePublicImage = (imageUrl: PublicImage) => {
    const [image, setImage] = useState<HTMLImageElement | null>(null);

    useEffect(() => {
        setImage(null);

        const image = new Image();
        image.src = `images/${imageUrl}`;

        image.onload = () => setImage(image);
    }, [imageUrl]);

    return image;
};
