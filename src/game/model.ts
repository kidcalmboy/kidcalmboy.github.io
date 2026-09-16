export type AppId =
  | "messenger"
  | "mail"
  | "browser"
  | "photos"
  | "files"
  | "notes"
  | "maps"
  | "trash"
  | "evidence";
export type Ending = "bad" | "normal" | "true" | "too_early" | "he_knows" | "the_story" | "confession" | "trusted";
export interface StoryMessage {id:string;group:string;contact:string;sender:string;text:string;at:number;deleteAt?:number;deleted?:boolean}
export interface StoryState {
 selectedChoices:Record<string,string>;
 relationships:Record<string,Record<string,number>>;
 memoryFlags:Record<string,boolean>;
 conversationProgress:Record<string,string>;
 history:StoryMessage[];
 pending:Array<{group:string;contact:string;texts:string[];due:number}>;
 deadlines:Record<string,number>;
 caseFeedHistory:string[];caseFeedQueue:string[];unlockedQuestions:string[];
 endingVariables:Record<string,boolean>;deletedSeen:string[];
}
export interface Settings {
  master: number;
  music: number;
  sfx: number;
  textSpeed: number;
  reduceMotion: boolean;
}
export interface GameState {
  version: 2;
  loggedIn: boolean;
  evidence: string[];
  flags: string[];
  restored: string[];
  read: string[];
  searches: string[];
  events: string[];
  ending: Ending | null;
  settings: Settings;
  story:StoryState;
}
