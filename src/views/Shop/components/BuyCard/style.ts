import styled from 'styled-components';

export const BuyCardContainer = styled.div`
    position: relative;

    width: 80%;
    min-height: 7.05vw;
    margin-bottom: 1vw;
`;

export const BuyCardImage = styled.img`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    image-rendering: pixelated;
`;

export const BuyCardContentWrapper = styled.div`
    position: absolute;
    top: 10%;
    left: 2%;
    width: 96%;
    height: 80%;

    display: flex;
    flex-direction: row;
    align-items: center;
`;

export const BuyCardPreviewImage = styled.img<{ unavailable?: boolean }>`
    margin-left: 0.75%;
    margin-right: 1.5%;
    height: 90%;
    max-height: 90%;

    ${({ unavailable }) => (unavailable ? 'filter: brightness(0);' : '')}
`;

export const BuyCardTextWrapper = styled.div`
    flex: 1;
    height: 100%;
    padding-top: 0.5%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
`;

export const BuyCardName = styled.div`
    font-size: 1.1vw;
`;

export const BuyCardDescription = styled.div`
    font-size: 0.7vw;
    margin-top: 0.5vw;
`;

export const BuyCardActionsWrapper = styled.div<{ disabled?: boolean }>`
    width: 18%;
    height: 100%;
    padding: 0 2%;
    box-sizing: border-box;

    font-size: 1.2vw;

    display: flex;
    flex-direction: column;
    align-items: flex-end;

    cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
    color: ${({ disabled }) => (disabled ? '#600' : '#090')};
`;
