export interface htmlElements {
    id: string;
    name?: string;
    formControlName?: string;
    tag?: string;
    icon?: string;
    options?: any;
    attributes?: input | button | label | checkbox | radio | img | select | option;
    style?: style;
}

export interface input {
    id?: string;
    name?: string;
    type?: 'text' | 'password' | 'checkbox' | 'radio' | 'file' | 'number' | 'email' | 'url' | 'tel' | 'search' | 'date' | 'time' | 'datetime-local' | 'month' | 'week';
    value?: string;
    disabled?: boolean;
    readonly?: boolean;
    autofocus?: boolean;
    required?: boolean;
    minlength?: number;
    maxlength?: number;
    pattern?: string;
    placeholder?: string;
    size?: number;
    autocomplete?: 'on' | 'off';
    autocorrect?: 'on' | 'off';
    autocapitalize?: 'none' | 'characters' | 'words' | 'sentences';
    spellcheck?: boolean;
    tabindex?: number;
    accesskey?: string;
    title?: string;
    ariaLabel?: string;
    ariaDescribedby?: string;
    ariaExpanded?: boolean | 'true' | 'false';
    ariaHaspopup?: boolean | 'true' | 'false' | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog';
    ariaHidden?: boolean | 'true' | 'false';
}

export interface button {
    id?: string;
    name?: string;
    value?: string;
    type?: 'button' | 'submit' | 'reset';
    form?: string;
    formaction?: string;
    formenctype?: 'application/x-www-form-urlencoded' | 'multipart/form-data' | 'text/plain';
    formmethod?: 'get' | 'post';
    formnovalidate?: boolean;
    formtarget?: '_blank' | '_self' | '_parent' | '_top' | string;
    autofocus?: boolean;
    disabled?: boolean;
    tabindex?: number;
    accesskey?: string;
    title?: string;
    ariaLabel?: string;
    ariaDescribedby?: string;
    ariaExpanded?: boolean | 'true' | 'false';
    ariaHaspopup?: boolean | 'true' | 'false' | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog';
    ariaHidden?: boolean | 'true' | 'false';
}

export interface label {
    id?: string;
    for?: string;
    accesskey?: string;
    class?: string;
    contenteditable?: boolean | 'true' | 'false';
    contextmenu?: string;
    dir?: 'ltr' | 'rtl' | 'auto';
    draggable?: boolean | 'true' | 'false';
    hidden?: boolean | 'true' | 'false';
    spellcheck?: boolean | 'true' | 'false';
    style?: string;
    tabindex?: number;
    title?: string;
    ariaLabel?: string;
    ariaDescribedby?: string;
    ariaExpanded?: boolean | 'true' | 'false';
    ariaHaspopup?: boolean | 'true' | 'false' | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog';
    ariaHidden?: boolean | 'true' | 'false';
}

export interface select {
    id?: string;
    name?: string;
    class?: string;
    autofocus?: boolean;
    disabled?: boolean;
    form?: string;
    multiple?: boolean;
    required?: boolean;
    size?: number;
    tabindex?: number;
    title?: string;
    ariaLabel?: string;
    ariaDescribedby?: string;
    ariaExpanded?: boolean | 'true' | 'false';
    ariaHaspopup?: boolean | 'true' | 'false' | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog';
    ariaHidden?: boolean | 'true' | 'false';
}

export interface option {
    id?: string,
    value?: string;
    disabled?: boolean;
    label?: string;
    selected?: boolean;
}


export interface img {
    id?: string,
    src?: string;
    alt?: string;
    width?: string | number;
    height?: string | number;
    title?: string;
    loading?: "lazy" | "eager" | "auto";
    decoding?: "sync" | "async" | "auto";
    draggable?: boolean;
}

export interface checkbox {
    id?: string;
    name?: string;
    value?: string;
    checked?: boolean;
    disabled?: boolean;
    required?: boolean;
    autoFocus?: boolean;
}

export interface radio {
    id?: string;
    name?: string;
    value?: string;
    checked?: boolean;
    disabled?: boolean;
    required?: boolean;
    autoFocus?: boolean;
}

export interface style {
    width?: number;
    height?: number;
    fontSize?: number;
    color?: string;
    backgroundColor?: string;
    fontWeight?: string;
    fontStyle?: string;
    textDecoration?: string;
    textAlign?: string;
    lineHeight?: string;
    letterSpacing?: string;
    fontFamily?: string;
    border?: string;
    borderRadius?: number;
    boxShadow?: number;
    margin?: number;
    padding?: number;
    display?: string;
    overflow?: string;
    //position?: string;
    //top?: string;
    //right?: string;
    //bottom?: string;
    //left?: string;
    //zIndex?: string;

}