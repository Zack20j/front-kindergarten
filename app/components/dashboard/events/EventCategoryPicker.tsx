import { EVENT_CATEGORIES } from "@/data/eventCategories";

interface EventCategoryPickerProps {
  value: string;
  onChange: (categoryId: string) => void;
}

export default function EventCategoryPicker({ value, onChange }: EventCategoryPickerProps) {
  return (
    <div>
      <label className="mb-2.5 block text-sm font-bold text-on-surface">
        Categoría <span className="text-error">*</span>
      </label>
      <div className="flex flex-wrap gap-2.5">
        {EVENT_CATEGORIES.map((category) => {
          const isActive = category.id === value;
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onChange(category.id)}
              className={[
                "flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors",
                isActive
                  ? "bg-primary text-on-primary"
                  : "bg-surface-container-high text-on-surface hover:bg-surface-container-highest",
              ].join(" ")}
            >
              {isActive && <span className="material-symbols-outlined text-base">check</span>}
              {category.emoji} {category.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
