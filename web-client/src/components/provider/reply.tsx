import {ReactNode, useContext, useState} from "react";
import {ReviewReplyAPI} from "../../typed/professor.ts";
import {ReplyContext} from "../../context/reply.ts";


export function ReplyProvider({ children }: { children: ReactNode }) {
    const [replies, setReplies] = useState<ReviewReplyAPI[]>([]);


    return (
        <ReplyContext.Provider value={{replies, setReplies}}>
            {children}
        </ReplyContext.Provider>
    );
}

export function useReply() {
    return useContext(ReplyContext);
}