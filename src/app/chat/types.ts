export type User = {
  _id: string;
  clerkId: string;
  name: string;
  email: string;
  imageUrl: string;
  isOnline: boolean;
};

export type Conversation = {
  _id: string;
  memberIds: string[];
  createdAt: string;
};

export type UserItemProps = {
  user: User;
  onClick: (user: User) => void;
};