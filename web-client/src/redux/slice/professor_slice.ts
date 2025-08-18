import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {ProfessorAPI, ReviewAPI} from "../../typed/professor.ts";
import {RootState} from "../store.ts";


interface ProfessorState {
    professor?: ProfessorAPI | null,
}

const initialState: ProfessorState = {
    professor: undefined,
}

export enum SORT_BY {
    relevant,
    newest
}


export const professorSlice = createSlice({
    name: 'professor',
    initialState,
    reducers: {
        setProfessor: (state, action) => {
            state.professor = action.payload
        },
        clearProfessor: (state) => {
            state.professor = undefined
        },
        sortReviews: (state, action) => {
            if (!state.professor) {
                return;
            }

            let reviews = [...state.professor.reviews];
            if (action.payload === SORT_BY.newest) {
                reviews = reviews.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
            } else {
                reviews = reviews.sort((a, b) => {

                    const aDate = new Date(a.created_at).getTime();
                    const bDate = new Date(b.created_at).getTime();
                    const aLikes = a.like_count - a.dislike_count;
                    const bLikes = b.like_count - b.dislike_count;

                    const oneWeek = 7 * 24 * 60 * 60 * 1000; // milliseconds in one week
                    const sixMonths = 6 * 30 * 24 * 60 * 60 * 1000; // milliseconds in six months
                    const now = Date.now();

                    // Check if a review is less than a week old
                    const aNew = now - aDate < oneWeek;
                    const bNew = now - bDate < oneWeek;

                    // Check if a review is older than 6 months
                    const aOld = now - aDate > sixMonths;
                    const bOld = now - bDate > sixMonths;

                    // If both reviews are less than a week old, sort by date
                    if (aNew && bNew) {
                        return bDate - aDate;
                    }

                    // If one review is new and the other is not, the new one comes first
                    if (aNew !== bNew) {
                        return aNew ? -1 : 1;
                    }

                    // If one review is old and the other is not, the old one goes to the bottom
                    if (aOld !== bOld) {
                        return aOld ? 1 : -1;
                    }

                    // If both reviews are not new and not old, sort by score of 1 and 5
                    if (a.score === 1 || a.score === 5) {
                        if (b.score === 1 || b.score === 5) {
                            // If both have score of 1 or 5, sort by likes/dislikes ratio
                            if (aLikes !== bLikes) {
                                return bLikes - aLikes;
                            } else {
                                // If likes/dislikes ratio is the same, sort by date
                                return bDate - aDate;
                            }
                        } else {
                            // If only a has score of 1 or 5, a comes first
                            return -1;
                        }
                    } else if (b.score === 1 || b.score === 5) {
                        // If only b has score of 1 or 5, b comes first
                        return 1;
                    } else {
                        // If neither has score of 1 or 5, sort by likes/dislikes ratio
                        if (aLikes !== bLikes) {
                            return bLikes - aLikes;
                        } else {
                            // If likes/dislikes ratio is the same, sort by date
                            return bDate - aDate;
                        }
                    }

                });
            }
            state.professor.reviews = reviews;
        },
        addReview: (state, action: PayloadAction<ReviewAPI>) => {
            if (!state.professor) {
                return;
            }

            state.professor.reviews = [action.payload, ...state.professor.reviews];
        },
        removeReview: (state, action: PayloadAction<number>) => {
            if (!state.professor) {
                return;
            }

            state.professor.reviews = state.professor.reviews.filter(review => review.id !== action.payload);
        },
        addReply: (state, action: PayloadAction<{ reviewId: number }>) => {
            if (!state.professor) {
                return;
            }

            const review = state.professor.reviews.find(review => review.id === action.payload.reviewId);

            if (!review) {
                return;
            }

            review.reply_count += 1;
        },
        removeReply: (state, action: PayloadAction<{ reviewId: number }>) => {
            if (!state.professor) {
                return;
            }

            const review = state.professor.reviews.find(review => review.id === action.payload.reviewId);

            if (!review) {
                return;
            }

            review.reply_count -= 1;
        },
        changeRepliesCount: (state, action: PayloadAction<{ reviewId: number, count: number }>) => {
            if (!state.professor) {
                return;
            }

            const review = state.professor.reviews.find(review => review.id === action.payload.reviewId);

            if (!review) {
                return;
            }

            review.reply_count = action.payload.count;
        }
    }
});

export const {
    setProfessor,
    clearProfessor,
    sortReviews,
    addReview,
    removeReview,
    addReply,
    removeReply,
    changeRepliesCount
} = professorSlice.actions

export const selectProfessor = (state: RootState) => state.professor

export default professorSlice.reducer;