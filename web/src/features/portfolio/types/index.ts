export interface Work {
  image: string;
  name: string;
  description: string;
  tech: string;
  url: string;
}

export interface WorkItemProps {
  image: string;
  name: string;
  description: string;
  tech: string;
  url: string;
}

export interface PortfolioListProps {
  works: Work[];
}
