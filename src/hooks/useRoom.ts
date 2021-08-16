import {useEffect, useState} from "react";
import {database} from "../services/firebase";
import firebase from "firebase";


type FirebaseQuestions = Record<string, {
    author: {
        name: string;
        avatar: string;
    }
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
}>

type QuestionsType = {
    id: string,
    author: {
        name: string;
        avatar: string;
    }
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
}

export function useRoom(roomId: string) {
    const [questions, setQuestions] = useState<Array<QuestionsType>>([]);
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

    return {questions, title}
}