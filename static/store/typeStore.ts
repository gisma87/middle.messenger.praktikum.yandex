import {messageType} from "./state";

export type objType = {
  [key: string]:
    | string
    | number
    | boolean
    | null
    | undefined
    | string[]
    | number[]
    | objType
    | objType[];
};

export type arrType = (
  | string
  | number
  | boolean
  | null
  | undefined
  | objType
  | arrType
  | arrType[]
  | objType[]
)[];

export type userInfoType = {
  id: number | null;
  first_name: string | null;
  second_name: string | null;
  display_name: string | null;
  login: string | null;
  email: string | null;
  phone: string | null;
  avatar: string | null;
};

export type stateType = {
  auth: boolean;
  userInfo: userInfoType;
  chatsList: objType[] | null;
  chat: objType;
  users: objType[];
  activeChat: string | number | null;
  token?: string;
  messageStore: messageType[]
  [key: string]:
    | string
    | number
    | boolean
    | null
    | undefined
    | arrType
    | objType
    | objType[];
};

export type stateKey = Extract<keyof stateType, string>;
