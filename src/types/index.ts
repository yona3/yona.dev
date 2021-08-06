type Tag = {
  createdAt: string;
  id: string;
  name: string;
  publishedAt: string;
  revisedAt: string;
  updatedAt: string;
};

export type Content = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  image: { url: string; width: number; height: number };
  publishedAt: string;
  revisedAt: string;
  updatedAt: string;
  tags: Tag[];
};
