import { Channel } from "@/types/post";

export const CHANNELS: Channel[] = [
  {
    id: "telegram",
    label: "Telegram",
    shortLabel: "Tel",
    icon: "send",
    iconFilled: true,
    color: "#0088cc",
  },
];

export const DEFAULT_SELECTED_CHANNELS: Channel["id"][] = ["telegram"];

export const MAX_POST_LENGTH = 2200;
