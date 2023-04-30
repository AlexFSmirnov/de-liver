import { MainCanvas } from './components';
import { HarvestCanvas } from './components/HarvestCanvas';
import { OperatingRoomContainer } from './style';

export const OperatingRoom = () => {
    return (
        <OperatingRoomContainer>
            <MainCanvas />
            <HarvestCanvas />
        </OperatingRoomContainer>
    );
};
