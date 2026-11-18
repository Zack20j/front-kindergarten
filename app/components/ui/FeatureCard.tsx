import type { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  title: string;
  description: string;
}

export default function FeatureCard({
  icon: Icon,
  iconColor,
  iconBg,
  title,
  description,
}: FeatureCardProps) {
  return (
    <article className="card-clay group flex h-full flex-col p-4 sm:p-6 md:p-7">
      <div className="flex items-start gap-4 sm:flex-col sm:gap-0">
        <div
          className={`icon-tile size-12 shrink-0 sm:mb-6 sm:size-14 ${iconBg} ${iconColor}`}
          aria-hidden="true"
        >
          <Icon className="size-6 sm:size-7" strokeWidth={2.2} />
        </div>

        <div className="min-w-0">
          <h3 className="font-display text-lg font-extrabold leading-snug text-on-surface sm:text-xl">
            {title}
          </h3>
          <p className="mt-1.5 text-sm font-medium leading-relaxed text-on-surface-variant sm:mt-2.5">
            {description}
          </p>
        </div>
      </div>

      <span
        aria-hidden="true"
        className={`absolute right-5 top-5 hidden size-2.5 rounded-full sm:block ${iconBg} opacity-80`}
      />
    </article>
  );
}
