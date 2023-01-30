export enum ActionType {
  extensionForward = 'extensionForward',
  mailForward = 'mailForward',
  queueStatus = 'queueStatus',
  esetSetRemoteAccess = 'esetSetRemoteAccess',
  esetCheckRemoteAccess = 'esetCheckRemoteAccess',
}

export enum ExtensionStatus {
  available = 'available',
  absent = 'absent',
  dnd = 'dnd',
  lunch = 'lunch',
  businessTrip = 'businessTrip',
}

export enum PbxExtensionStatus {
  Available = 'Available',
  Away = 'Away',
  Outofoffice = 'Out of office',
  CustomOne = 'Custom 1',
  CustomTwo = 'Custom 2',
}

export enum EsetStatus {
  on = 'on',
  off = 'off',
}

export enum ForwardingType {
  InternalForwarding = 'InternalForwarding',
  ExternalForwarding = 'ExternalForwarding',
}

export enum EsetPath {
  startPage = '/users/ad_ldap',
  userPager = '/users/all',
}
