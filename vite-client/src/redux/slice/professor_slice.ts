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
                    const aLikes = a.likes - a.dislikes;
                    const bLikes = b.likes - b.dislikes;

                    if (aDate > Date.now() - 86400000 && bDate > Date.now() - 86400000) {
                        return bDate - aDate;
                    }
                    if (aDate > Date.now() - 86400000) {
                        return -1;
                    }
                    if (bDate > Date.now() - 86400000) {
                        return 1;
                    }
                    if (aLikes !== bLikes) {
                        return bLikes - aLikes;
                    }
                    return bDate - aDate;

                });
            }
            state.professor.reviews = reviews;
        },
        addReview: (state, action: PayloadAction<ReviewAPI>) => {
            if (!state.professor) {
                return;
            }

            state.professor.reviews = [action.payload, ...state.professor.reviews];
        }

    }
});

export const {setProfessor, clearProfessor, sortReviews, addReview} = professorSlice.actions

export const selectProfessor = (state: RootState) => state.professor

export default professorSlice.reducer;