export enum ActionType {
    extensionForward = 'extensionForward',
    mailForward = 'mailForward',
    queueStatus = 'queueStatus',
}

export enum QueueStatus {
    true = "true",
    false = "false"
}


export enum ChangeExtensionForward {
    true = "true",
    false = "false"
}

export enum ChangeMailForwardForward {
    true = "true",
    false = "false"
}
export enum ExtensionStatus {
    available = "available",
    absent = "absent",
    dnd = "dnd",
    lunch = "lunch",
    businessTrip = "businessTrip",
}

export enum ExtensionForwardRuleType {
    mobile = "mobile",
    extension = "extension",
    external = "external",
}

export enum PbxExtensionStatus {
    Available = "Available",
    Away = "Away",
    Outofoffice = "Out of office",
    CustomOne = "Custom 1",
    CustomTwo = "Custom 2",
}

export enum ForwardingType {
    InternalForwarding = "InternalForwarding",
    ExternalForwarding = "ExternalForwarding",
}