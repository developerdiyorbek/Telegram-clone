import { ReactNode } from "react";

export interface ChildProps {
  children: ReactNode;
}

export interface IUser {
  email: string;
  _id: string;
  avatar?: string;
  firstName: string;
  bio?: string;
  lastName?: string;
}
