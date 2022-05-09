export class UserData {
  username: string;
  email: string;
  token?: string;
  bio: string;
  image: string;
}

export class UserRes {
  user: UserData;
}

export class UserRequestRes {
  id: number;
  username: string;
}
