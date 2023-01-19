export enum FindRequestType {
    AUTOCOMPLETE,
    KNOWN
}

export interface FindRequestBody {
    value: string,
    type: FindRequestType
}