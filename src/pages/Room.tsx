import logoImg from '../assets/images/logo.svg'
import {Button} from "../components/Button";
import {RoomCode} from "../components/RoomCode";
import {useParams} from "react-router-dom";
import {FormEvent, useState} from "react";
import {useAuth} from "../hooks/useAuth";
import {toast, Toaster} from "react-hot-toast";
import {database} from "../services/firebase";
import '../styles/room.scss';


type RoomParams = {
    id: string;
}

export function Room() {
    const user = useAuth().user;
    const params = useParams<RoomParams>();
    const roomId = params.id;
    const [newQuestion, setNewQuestion] = useState('');

    async function handleSendQuestion(event: FormEvent) {
        event.preventDefault();

        if (newQuestion.trim() === '') {
            return;
        }

        if (!user) {
            throw toast.error('Voçe precisa fazer login para enviar perguntas!');
        }

        const question = {
            content: newQuestion,
            author: {
                name: user.name,
                avatar: user.avatar
            },
            isHighLighted: false,
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
                    <h1>Sala React</h1>
                    <span>4 perguntas</span>
                </div>
                <form onSubmit={handleSendQuestion}>
                    <textarea
                        placeholder='O que vc quer perguntar?'
                        onChange={event => setNewQuestion(event.target.value)}
                        value={newQuestion}
                    />
                    <div className='form-footer'>
                        <span>Para enviar Pergunta, <button>faça seu login</button></span>
                        <Button disabled={!user} type='submit'>Enviar pergunta</Button>
                    </div>
                </form>
            </main>
        </div>
    )
}
