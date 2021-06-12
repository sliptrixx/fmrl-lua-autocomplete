interface FmrlTypeMap {
    [prop: string]: FmrlType
}

interface FmrlType {
    type?: string
    name?: string
    doc?: string
    mode?: string
    properties?: FmrlTypeMap
    args?: FmrlTypeMap
    returns?: string
    inherits?: string[]
}