import type { Channel } from "@/types/post";
import ChannelToggle from "./ChannelToggle";

interface ChannelSelectorProps {
  channels: Channel[];
  selected: Channel["id"][];
  onToggle: (channelId: Channel["id"], checked: boolean) => void;
}

export default function ChannelSelector({ channels, selected, onToggle }: ChannelSelectorProps) {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-outline-variant/50 bg-surface-container-lowest p-6 md:p-8 dark:bg-surface-container-low">
      <div className="pointer-events-none absolute -mr-16 -mt-16 top-0 right-0 size-32 rounded-bl-full bg-primary/10" />
      <h2 className="mb-6 flex items-center gap-2 text-[1.25rem] font-bold text-on-surface">
        <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
          cell_tower
        </span>
        Publicación web y Telegram
      </h2>
      <p className="mb-5 text-sm leading-relaxed text-on-surface-variant">
        Al publicar, el contenido aparece en la cartelera web. También puedes enviarlo por Telegram.
      </p>
      <div className="flex flex-wrap gap-3">
        {channels.map((channel) => (
          <ChannelToggle
            key={channel.id}
            channel={channel}
            checked={selected.includes(channel.id)}
            onChange={onToggle}
          />
        ))}
      </div>
    </section>
  );
}
