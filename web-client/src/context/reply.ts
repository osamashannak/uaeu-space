import {createContext, Dispatch, SetStateAction} from "react";
import {ReviewReplyAPI} from "../typed/professor.ts";

interface ReplyCContextProps {
    replies: ReviewReplyAPI[];
    setReplies:  Dispatch<SetStateAction<ReviewReplyAPI[]>>;
}

export const ReplyContext = createContext<ReplyCContextProps>({
    replies: [],
    setReplies(): void {
    }
});