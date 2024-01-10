// Creates a new type object where each key is optional
export type Partial<T> = {
	[K in keyof T]?: T[K];
};

export interface ItemType {
    readonly id: number,
    readonly comments: string,
    readonly datetime: string,
    readonly is_downloaded: boolean,
    readonly item_code: number,
    readonly location: string,
    readonly type: string,
}

export interface TableModsType {
    sortBy: string,
    sortMod: string,
    page: number,
    search: string
}

export interface ItemInfoType {
    id: number,
    itemCode: string,
    type: string,
    comments: string,
    location: string
}