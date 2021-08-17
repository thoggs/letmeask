import logoImg from '../assets/images/logo.svg'
import {Button} from "../components/Button";
import {RoomCode} from "../components/RoomCode";
import {useHistory, useParams} from "react-router-dom";
import {Toaster} from "react-hot-toast";
import {Question} from "../components/Question";
import {useRoom} from "../hooks/useRoom";
import deleteImg from '../assets/images/delete.svg'
import {database} from '../services/firebase';
import '../styles/room.scss';


type RoomParams = {
    id: string;
}

export function AdminRoom() {
    const history = useHistory();
    const roomId = useParams<RoomParams>().id;
    const {title, questions} = useRoom(roomId);

    async function handleEndRoom() {
        await database.ref(`rooms/${roomId}`).update({
            endedAt: new Date()
        })
        history.push(`/`)
    }

    async function handleDeleteQuestion(questionId: string) {
        if (window.confirm('Tem certeza que você deseja excluir esta pergunta?')) {
            await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
        }
    }

    return (
        <div id='page-room'>
            <Toaster position='top-center' reverseOrder={false}/>
            <header>
                <div className='content'>
                    <img src={logoImg} alt="LetmeAsk"/>
                    <div>
                        <RoomCode code={roomId}/>
                        <Button onClick={handleEndRoom} isOutlined>Encerrar sala</Button>
                    </div>
                </div>
            </header>
            <main>
                <div className='room-title'>
                    <h1>Sala {title}</h1>
                    {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
                </div>
                <div className="question-list">
                    {questions.map(question => {
                        return (
                            <Question key={question.id} content={question.content} author={question.author}>
                                <button onClick={() => handleDeleteQuestion(question.id)} type='button'>
                                    <img src={deleteImg} alt="remover pergunta"/>
                                </button>
                            </Question>)
                    })}
                </div>
            </main>
        </div>
    )
}
