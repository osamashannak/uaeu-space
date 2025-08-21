import {ComponentType, createContext} from "react";

type ModalContextProps = {
    openModal: (
        Component: ComponentType<any>,
        props?: Record<string, any>
    ) => void;
    closeModal: () => void;
};

export const ModalContext = createContext<ModalContextProps | undefined>(undefined);
