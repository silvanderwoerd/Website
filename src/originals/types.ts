// The shapes every original, setting and instance share (CLAUDE.md "The Inspector").
// No imports: schema files and the Node check scripts load this file directly.

export type Device = "desktop" | "tablet" | "phone";
export const DEVICES: readonly Device[] = ["desktop", "tablet", "phone"];

// What a setting can be. Only tokens and fixed choices: never a free value.
export type SettingKind = "choice" | "toggle" | "colorToken" | "spaceStep" | "textStyle";

export type SettingDef = {
  label: string;
  kind: SettingKind;
  options?: readonly string[]; // choice only
  perDevice?: boolean; // separate values for desktop / tablet / phone
};

export type OriginalSchema = {
  name: string;
  label: string;
  level: "stripe" | "block";
  purpose: string;
  devOnly?: boolean; // test originals that never reach the live site
  settings: Record<string, SettingDef>;
  fields?: readonly string[]; // text fields editable in place
  blocks?: Record<string, string>; // content key → block original (stripes only)
};

export type SettingValue = string | boolean | Partial<Record<Device, string | boolean>>;
export type Settings = Record<string, SettingValue>;

export type Overridable = {
  overrides?: Settings;
  overrideReasons?: Record<string, string>;
};

export type StripeInstance = Overridable & {
  id: string;
  type: string;
  content: Record<string, unknown>;
  spaceBefore?: string; // a space token (Webflow's spacer bands)
  padTop?: string; // a space token: Webflow's spacer at the band's own top edge
  padBottom?: string; // …and at its bottom edge
  pageTone?: "gradient"; // page background tone while this stripe is in view
  anchor?: string; // id for in-page links
};

export type BlockInstance = Overridable & Record<string, unknown>;

export type PageContent = {
  slug: string;
  title: string;
  description?: string;
  family?: "fluid" | "fixed"; // which type system the page uses (decisions #4)
  background?: "black"; // the live <body class="background-color-black"> (projects, Work, Act …)
  stripes: StripeInstance[];
};
