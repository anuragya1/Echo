export type signFormType = {
  email: string;
  username?: string;
  password: string;
};

export type User = {
  id: string;
  username: string;
  email: string;
  image: string;
  about: string;
  friends: string[];
  requests: string[];
  blockeds: string[];
};

export type channel = {
  id: string;
  participants: any[];
  messages: string[];
  name?: string;
  description?: string;
  image?: string;
  admins?: string[];
  createdAt:any;
  updatedAt:any;
};

export type message = {
  id: string;
  userId: string;
  user?: User;
  text?: string;
  images?: string[];
  createdAt: Date;
};
