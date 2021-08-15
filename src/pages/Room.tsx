import logoImg from '../assets/images/logo.svg'
import {Button} from "../components/Button";
import {RoomCode} from "../components/RoomCode";
import {useParams} from "react-router-dom";
import {FormEvent, useEffect, useState} from "react";
import {useAuth} from "../hooks/useAuth";
import {toast, Toaster} from "react-hot-toast";
import {database} from "../services/firebase";
import '../styles/room.scss';
import firebase from "firebase/app";


type FirebaseQuestions = Record<string, {
    author: {
        name: string;
        avatar: string;
    }
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
}>

type Questions = {
    id: string,
    author: {
        name: string;
        avatar: string;
    }
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
}

type RoomParams = {
    id: string;
}

export function Room() {
    const user = useAuth().user;
    const params = useParams<RoomParams>();
    const roomId = params.id;
    const [newQuestion, setNewQuestion] = useState('');
    const [questions, setQuestions] = useState<Array<Questions>>([]);
    const [title, setTitle] = useState('');

    useEffect(() => {
        const roomRef = database.ref(`rooms/${roomId}`);
        getFirebaseRoomsQuestions(roomRef);

    }, [roomId])

    function getFirebaseRoomsQuestions(roomRef: firebase.database.Reference): any {
        roomRef.on('value', room => {
            const dataBaseRoom = room.val();
            const firebaseQuestions: FirebaseQuestions = dataBaseRoom.questions ?? {};

            try {
                const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
                    return {
                        id: key,
                        content: value.content,
                        author: value.author,
                        isHighlighted: value.isHighlighted,
                        isAnswered: value.isAnswered
                    }
                })
                setTitle(dataBaseRoom.title);
                setQuestions(parsedQuestions);

            } catch {
                console.log('Nenhum pergunta criada nessa sala!')
            }
        })
    }

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
            </main>
        </div>
    )
}
