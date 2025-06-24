export interface Like {
  category: "作品" | "バンド" | "飲食物";
  list?: string[];
  description?: string;
}

export interface ProfileData {
  age: number;
  universityAge: number;
  likes: Like[];
}

export interface ProfileProps {
  profileData: ProfileData;
}
