export type chatListType =
  | { id: string | number; title: string; avatar: any; created_by: string }[]
  | null;

export type chatUsers = {
  "id": number | string,
  "first_name": string,
  "second_name": string,
  "display_name": string | null,
  "login"?: string | null,
  "email": string | null,
  "phone"?: string | null,
  "avatar": string | null,
  "role"?: string | null
}[]

export type messageType = {
  "content": string,
  "type": string,
  "time": string,
  "user_id": string | number,
  "id": string | number
} | messageType[]

export default {
  auth: false,
  userInfo: {
    id: null,
    first_name: null,
    second_name: null,
    display_name: null,
    login: null,
    email: null,
    phone: null,
    avatar: '../../img/photoVideo.svg',
  },
  chatsList: [],
  activeChat: null,
  chat: {
    id: '',
    title: '',
    avatar: '',
    created_by: '',
  },
  users: [
    {
      id: '',
      first_name: '',
      second_name: '',
      display_name: '',
      login: '',
      email: '',
      phone: '',
      avatar: '',
      role: ''
    }
  ],
  messageStore: []
};
