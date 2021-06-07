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
      first_name: 'Вася',
      second_name: 'Маньков',
      display_name: '',
      login: 'Ёжик',
      email: '',
      phone: '',
      avatar: '',
      role: '',
    },
    {
      id: '',
      first_name: 'Стас',
      second_name: 'Маньков',
      display_name: '',
      login: 'Ежидзе',
      email: '',
      phone: '',
      avatar: '',
      role: '',
    },
    {
      id: '',
      first_name: 'Гуля',
      second_name: 'Манькова',
      display_name: '',
      login: 'ЕжихаСимпотяха',
      email: '',
      phone: '',
      avatar: '',
      role: '',
    }
  ]
};
