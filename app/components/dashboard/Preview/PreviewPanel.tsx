import type { Channel, MediaItem } from "@/types/post";
import ChannelTabs from "./ChannelTabs";
import { CHANNEL_PREVIEWS } from "./previews";

interface PreviewPanelProps {
  channels: Channel[];
  activeChannel: Channel["id"];
  onActiveChannelChange: (channelId: Channel["id"]) => void;
  schoolName: string;
  content: string;
  media: MediaItem[];
  timestamp: string;
}

export default function PreviewPanel({
  channels,
  activeChannel,
  onActiveChannelChange,
  schoolName,
  content,
  media,
  timestamp,
}: PreviewPanelProps) {
  const ActivePreview = CHANNEL_PREVIEWS[activeChannel];

  return (
    <section className="sticky top-24 rounded-2xl border border-outline-variant/50 bg-surface-container-lowest p-6 md:p-8 dark:bg-surface-container-low">
      <h2 className="mb-6 flex items-center gap-2 text-[1.25rem] font-bold text-on-surface">
        <span className="material-symbols-outlined text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>
          preview
        </span>
        Vista previa por canal
      </h2>

      <ChannelTabs channels={channels} active={activeChannel} onChange={onActiveChannelChange} />

      <ActivePreview schoolName={schoolName} content={content} media={media} timestamp={timestamp} />
    </section>
  );
}
