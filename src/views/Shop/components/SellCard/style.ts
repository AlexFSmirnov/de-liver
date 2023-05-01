import styled from 'styled-components';
import { OrganQuality } from '../../../../common';

export const SellCardContainer = styled.div`
    position: relative;

    width: 80%;
    min-height: ${({ theme }) => theme.gameScaled(7.05)};
    margin-bottom: ${({ theme }) => theme.gameScaled(1)};
`;

export const SellCardImage = styled.img`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    image-rendering: pixelated;
`;

export const SellCardContentWrapper = styled.div`
    position: absolute;
    top: 10%;
    left: 2%;
    width: 96%;
    height: 80%;

    display: flex;
    flex-direction: row;
    align-items: center;
`;

export const SellCardPreviewImage = styled.img<{ quality: OrganQuality }>`
    margin-left: 0.75%;
    margin-right: 1.5%;
    height: 90%;
    max-height: 90%;

    ${({ quality }) => {
        switch (quality) {
            case OrganQuality.Bad:
                return `filter: brightness(0.3);`;
            case OrganQuality.Medium:
                return `filter: brightness(0.7);`;
            default:
                return '';
        }
    }}

    image-rendering: pixelated;
`;

export const SellCardTextWrapper = styled.div`
    flex: 1;
    height: 100%;
    padding-top: 0.5%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
`;

export const SellCardName = styled.div`
    font-size: ${({ theme }) => theme.gameScaled(1.1)};
`;

export const SellCardDescription = styled.div<{ quality: OrganQuality }>`
    font-size: ${({ theme }) => theme.gameScaled(1)};
    margin-top: ${({ theme }) => theme.gameScaled(1)};

    ${({ quality }) => {
        switch (quality) {
            case OrganQuality.Bad:
                return `color: #800;`;
            case OrganQuality.Good:
                return `color: #060;`;
            default:
                return '';
        }
    }}
`;

export const SellCardActionsWrapper = styled.div`
    width: 20%;
    height: 100%;
    padding: 0 2%;
    box-sizing: border-box;

    font-size: ${({ theme }) => theme.gameScaled(1.2)};

    display: flex;
    flex-direction: column;
    align-items: flex-end;

    cursor: pointer;
    color: #090;
`;
