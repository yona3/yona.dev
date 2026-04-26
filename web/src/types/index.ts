// google analytics
export type ContactEvent = {
  action: "submit_form";
  category: "contact";
  label: string;
  value?: string;
};

export type ClickEvent = {
  action: "click";
  category: "other";
  label: string;
  value?: string;
};

export type GtagEvent = ContactEvent | ClickEvent;
