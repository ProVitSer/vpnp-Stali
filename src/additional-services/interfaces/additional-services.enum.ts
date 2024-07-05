export enum ServicesType {
    mail = 'mail',
    queue = 'queue',
    extension = 'extension',
}

export enum ExtensionForwardRuleType {
    mobile = 'mobile',
    extension = 'extension',
    external = 'external'
}

export enum ExtensionForwardType {
    internal = 'internal',
    external = 'external',
}

export enum QueueStatus {
    LoggedIn = 'LoggedIn',
    LoggedOut = 'LoggedOut'
}

export enum ForwardStatus {
    Available = 'Available',
    Away = 'Away',
    DND = 'DND',
    Lunch = 'Lunch',
    BusinessTrip = 'BusinessTrip',
}

export enum FwType {
    Extension = "Extension",
    Mobile = "Mobile",
    External = "External",
    EndCall = "EndCall",
}