export interface textbox {
    text: string,
    fontSize: number,
    fontColor: string,
    minLength: number,
    maxLength: number,
    readonly: boolean,
    required: boolean
}

export interface textarea {
    text: string,
    fontSize: number,
    fontColor: string,
    minLength: number,
    maxLength: number,
    readonly: boolean,
    required: boolean
}

export interface label {
    text: string,
    fontSize: number,
    fontColor: string
}

export interface table {
    captions: row,
    row: row[]
}

export interface row {
    cells: string[]
}

export interface combobox {
    fontColor: string,
    fontSize: number,
    options: option[]
}

export interface option {
    value: string | number,
    text: string
}

export interface checkbox {
    text: string,
    fontSize: number,
    fontColor: string,
    readonly: boolean
}

export interface radioButton {
    text: string,
    fontColor: string,
    fontSize: number
}

export interface image {
    src: string,
    width: number,
    height: number
}

export interface link {
    url: string
}

export interface button {
    text: string,
    disabled: boolean
}

export interface listbox {
    fontColor: string,
    fontSize: number,
    options?: option[]
}

export interface htmlTemplate {
    id?: number,
    label: string,
    tag: string,
    icon?: string,
    style: {
        width: number,
        height: number
    },
    position?: {
        x: number,
        y: number
    }
    isDragDisabled: boolean,
    element: textbox | textarea | label | table | combobox | option
    | checkbox | radioButton | image | link | button | listbox
}


export interface folder {
    id: number,
    folderName: string,
    files: file[],
    folders: folder[],
    isOpen: boolean
}

export interface file {
    fileId: number,
    name: string,
    content: string,
    isSelected?: boolean;
}
