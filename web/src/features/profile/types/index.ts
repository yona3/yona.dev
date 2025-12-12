export type Like = {
  category: string;
  description?: string;
  list?: string[];
};

export type ProfileData = {
  age: number;
  universityAge: number;
  likes: Like[];
};

export type ProfileProps = {
  profileData: ProfileData;
};
