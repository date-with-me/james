import React from "react";

export type WoAType = "giver" | "receiver" | "both";

export type LoveLanguage =
  | "Words of Affirmation"
  | "Acts of Service"
  | "Receiving Gifts"
  | "Quality Time"
  | "Physical Touch";

export type LoveLanguagesProps = {
  WordsOfAffirmation: WoAType;
  QualityTime: WoAType;
  PhysicalTouch: WoAType;
  ActsOfService: WoAType;
  ReceivingGifts: WoAType;
  description?: string;
  className?: string;
};

const LOVE_LANGUAGE_EMOJI: Record<LoveLanguage, string> = {
  "Words of Affirmation": "💬",
  "Acts of Service": "🛠️",
  "Receiving Gifts": "🎁",
  "Quality Time": "🕰️",
  "Physical Touch": "🤝",
};

function getBadgeClasses(mode: WoAType): string {
  switch (mode) {
    case "giver":
      return "bg-blue-100 text-blue-700";
    case "receiver":
      return "bg-pink-100 text-pink-700";
    case "both":
    default:
      return "bg-purple-100 text-purple-700";
  }
}

function prettyMode(mode: WoAType): string {
  return mode === "giver" ? "Giver" : mode === "receiver" ? "Receiver" : "Giver & Receiver";
}

export function LoveLanguages({
  WordsOfAffirmation,
  QualityTime,
  PhysicalTouch,
  ActsOfService,
  ReceivingGifts,
  description,
  className,
}: LoveLanguagesProps) {
  const containerClass = `p-4 bg-gray-50 rounded-lg ${className ?? ""}`.trim();

  const items: Array<{ name: LoveLanguage; mode: WoAType }> = [
    { name: "Words of Affirmation", mode: WordsOfAffirmation },
    { name: "Quality Time", mode: QualityTime },
    { name: "Physical Touch", mode: PhysicalTouch },
    { name: "Acts of Service", mode: ActsOfService },
    { name: "Receiving Gifts", mode: ReceivingGifts },
  ];

  return (
    <div className={containerClass}>
      <div className="text-sm uppercase tracking-wide text-gray-500 mb-2">Love Languages</div>
      {description && <p className="text-gray-700 mb-3">{description}</p>}
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.name} className="flex items-start gap-3">
            <span className="text-xl" aria-hidden>
              {LOVE_LANGUAGE_EMOJI[item.name]}
            </span>
            <div className="flex-1">
              <div className="text-base md:text-lg font-medium text-gray-800 flex items-center gap-2">
                <span>{item.name}</span>
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full ${getBadgeClasses(item.mode)}`}
                >
                  {prettyMode(item.mode)}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default LoveLanguages;


