import { Channel, ChannelApiName, ChannelId } from "@/types/post";

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

export const CHANNEL_ID_BY_API: Record<ChannelApiName, ChannelId> = {
  TELEGRAM: "telegram",
  FACEBOOK: "facebook",
  INSTAGRAM: "instagram",
};

export function getChannelLabel(apiName: ChannelApiName): string {
  const id = CHANNEL_ID_BY_API[apiName];
  return CHANNELS.find((channel) => channel.id === id)?.label ?? apiName;
}

export const DEFAULT_SELECTED_CHANNELS: Channel["id"][] = ["telegram"];

export const MAX_POST_LENGTH = 2200;
