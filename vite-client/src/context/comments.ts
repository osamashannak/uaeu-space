import {createContext, Dispatch, SetStateAction} from "react";
import {ReviewReplyAPI} from "../typed/professor.ts";

interface CommentsContextProps {
    comments: ReviewReplyAPI[];
    setComments:  Dispatch<SetStateAction<ReviewReplyAPI[]>>;
}

export const CommentsContext = createContext<CommentsContextProps>({
    comments: [],
    setComments(): void {
    }
});