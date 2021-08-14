import copyImg from '../assets/images/copy.svg';
import '../styles/room-code.scss';


type RoomCodeProps = {
    code: string;
}

export function RoomCode(props: RoomCodeProps) {

    async function copyRoomCodeToClipboard() {
        await navigator.clipboard.writeText(props.code);
    }

    return(
        <button onClick={copyRoomCodeToClipboard} className='room-code'>
            <div>
                <img src={copyImg} alt="copy room code"/>
            </div>
            <span>Sala #{props.code}</span>
        </button>
    )
}
