import { useEffect, useState } from "react";
import { database } from "../services/firebase";
import { useAuth } from "./useAuth";


type FirebaseQuestions = Record<string, {
  author: {
    name: string;
    avatar: string;
  }
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
  likes: Record<string, { authorId: string; }>
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
  likeCount: number;
  likeId: string | undefined;
}

export function useRoom(roomId: string) {
  const {user} = useAuth();
  const [questions, setQuestions] = useState<Array<QuestionsType>>([]);
  const [title, setTitle] = useState('');

  useEffect(() => {
    const roomRef = database.ref(`rooms/${roomId}`);

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
            isAnswered: value.isAnswered,
            likeCount: Object.values(value.likes ?? {}).length,
            likeId: Object.entries(value.likes ?? {})
              .find((x) => x[1].authorId === user?.id)?.[0]
          }
        })
        setTitle(dataBaseRoom.title);
        setQuestions(parsedQuestions);

      } catch {
        console.log('Nenhum pergunta criada nessa sala!')
      }
    })

    return () => {
      roomRef.off('value');
    }

  }, [roomId, user?.id])

  return {questions, title}
}
