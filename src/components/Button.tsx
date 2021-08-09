import {useState} from "react";

type ButtonProps = {
    text?: string;
}


export function OutlineButton(props: ButtonProps) {
    const [counter, setCounter] = useState(0);

    function increment() {
        setCounter(counter + 1)
    }

    return (
        <button onClick={increment}>{props.text} - {counter}</button>
    )
}
