export type AppConfig = {
  get: (propertyName: string) => any;
  set: (propertyName: string) => any;
  argv: any;
  file: any;
  defaults: any;
};

export interface IssueTrackingStructure {
  projects: string[];
}

export interface IssueTrackers {
  github: IssueTrackingStructure;
  jira: IssueTrackingStructure;
}

export interface Teams {
  name: string;
  emoji: string;
  mentions: string;
  channels: string[];
  issueTracking: IssueTrackers;
}
