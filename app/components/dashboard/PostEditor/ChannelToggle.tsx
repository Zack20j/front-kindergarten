import type { Channel } from "@/types/post";

interface ChannelToggleProps {
  channel: Channel;
  checked: boolean;
  onChange: (channelId: Channel["id"], checked: boolean) => void;
}

export default function ChannelToggle({ channel, checked, onChange }: ChannelToggleProps) {
  return (
    <label className="relative flex cursor-pointer items-center">
      <input
        checked={checked}
        onChange={(e) => onChange(channel.id, e.target.checked)}
        className="peer sr-only"
        type="checkbox"
      />
      <div
        className="flex items-center gap-3 rounded-full border-2 px-5 py-3 transition-colors duration-200 peer-focus-visible:outline-[3px] peer-focus-visible:outline-offset-[3px] peer-focus-visible:outline-primary/70"
        style={{
          backgroundColor: checked
            ? `color-mix(in oklab, ${channel.color} 16%, transparent)`
            : "var(--surface-container)",
          borderColor: checked
            ? `color-mix(in oklab, ${channel.color} 70%, var(--on-surface))`
            : "var(--outline-variant)",
          color: checked
            ? `color-mix(in oklab, ${channel.color} 70%, var(--on-surface))`
            : "var(--on-surface-variant)",
        }}
      >
        <span
          className="material-symbols-outlined text-xl"
          style={{ fontVariationSettings: channel.iconFilled ? "'FILL' 1" : "'FILL' 0" }}
        >
          {channel.icon}
        </span>
        <span className="text-[0.875rem] font-semibold">{channel.label}</span>
      </div>
    </label>
  );
}
