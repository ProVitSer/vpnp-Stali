export enum RemoteStatus {
  apiFail = 'apiFail',
  inProgress = 'inProgress',
  completed = 'completed',
  notFound = 'notFound',
}

export enum RemoteTaskType {
  adUsersList = 'adUsersList',
  getUserStatus = 'getUserStatus',
  activateRemote = 'activateRemote',
  deactivateRemote = 'deactivateRemote',
}

export enum RemoteStatusChangeType {
  start = 'start',
  progress = 'progress',
  end = 'end',
}
