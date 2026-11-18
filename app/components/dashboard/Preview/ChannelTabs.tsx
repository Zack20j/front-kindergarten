import type { Channel } from "@/types/post";

interface ChannelTabsProps {
  channels: Channel[];
  active: Channel["id"];
  onChange: (channelId: Channel["id"]) => void;
}

export default function ChannelTabs({ channels, active, onChange }: ChannelTabsProps) {
  return (
    <div className="mb-6 flex gap-2 rounded-full bg-surface-container-high p-1">
      {channels.map((channel) => {
        const isActive = channel.id === active;
        return (
          <button
            key={channel.id}
            type="button"
            onClick={() => onChange(channel.id)}
            className={[
              "flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2 text-[0.875rem] font-semibold transition-colors",
              isActive
                ? "bg-surface-container-lowest text-on-surface shadow-sm dark:bg-surface-container"
                : "text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface",
            ].join(" ")}
          >
            <span
              className="material-symbols-outlined text-[18px]"
              style={{ fontVariationSettings: channel.iconFilled ? "'FILL' 1" : "'FILL' 0" }}
            >
              {channel.icon}
            </span>
            {channel.shortLabel}
          </button>
        );
      })}
    </div>
  );
}
