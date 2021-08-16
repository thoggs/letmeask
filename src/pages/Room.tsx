import logoImg from '../assets/images/logo.svg'
import {Button} from "../components/Button";
import {RoomCode} from "../components/RoomCode";
import {useParams} from "react-router-dom";
import {FormEvent, useState} from "react";
import {useAuth} from "../hooks/useAuth";
import {toast, Toaster} from "react-hot-toast";
import {database} from "../services/firebase";
import '../styles/room.scss';
import {Question} from "../components/Question";
import {useRoom} from "../hooks/useRoom";


type RoomParams = {
    id: string;
}

export function Room() {
    const user = useAuth().user;
    const params = useParams<RoomParams>();
    const roomId = params.id;
    const [newQuestion, setNewQuestion] = useState('');
    const {title, questions} = useRoom(roomId);

    async function handleSendQuestion(event: FormEvent) {
        event.preventDefault();

        if (newQuestion.trim() === '') {
            return;
        }

        if (!user) {
            throw toast.error('Voçê precisa fazer login para enviar perguntas!');
        }

        const question = {
            content: newQuestion,
            author: {
                name: user.name,
                avatar: user.avatar
            },
            isHighlighted: false,
            isAnswered: false
        }

        try {
            await database.ref(`rooms/${roomId}/questions`).push(question);
        } catch (e) {
            console.log(e);
            toast.error('Não foi possível enviar a sua pergunta!');
        } finally {
            setNewQuestion('');
            toast.success('Pergunta enviada com sucesso!');
        }
    }

    return (
        <div id='page-room'>
            <Toaster position='top-center' reverseOrder={false}/>
            <header>
                <div className='content'>
                    <img src={logoImg} alt="LetmeAsk"/>
                    <RoomCode code={roomId}/>
                </div>
            </header>
            <main>
                <div className='room-title'>
                    <h1>Sala {title}</h1>
                    {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
                </div>
                <form onSubmit={handleSendQuestion}>
                    <textarea
                        placeholder='O que vc quer perguntar?'
                        onChange={event => setNewQuestion(event.target.value)}
                        value={newQuestion}
                    />
                    <div className='form-footer'>
                        {user ? (
                            <div className='user-info'>
                                <img src={user.avatar} alt={user.name}/>
                                <span>{user.name}</span>
                            </div>
                        ) : (
                            <span>Para enviar Pergunta, <button>faça seu login</button></span>
                        )}
                        <Button disabled={!user} type='submit'>Enviar pergunta</Button>
                    </div>
                </form>
                <div className="question-list">
                    {questions.map(question => {
                        return (<Question key={question.id} content={question.content} author={question.author}/>)
                    })}
                </div>
            </main>
        </div>
    )
}
