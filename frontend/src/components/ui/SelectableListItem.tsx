interface SelectableListItemProps {
  title: string;
  subtitle: string;
  selected: boolean;
  onClick: () => void;
}

export default function SelectableListItem({
  title,
  subtitle,
  selected,
  onClick,
}: SelectableListItemProps) {
  return (
    <div
      onClick={onClick}
      className={`border rounded-xl px-4 py-3 cursor-pointer transition-colors ${
        selected ? "border-primary bg-primary/5" : "border-[#D6DCE8] bg-white"
      }`}
    >
      <p className="font-bold text-black">{title}</p>
      <p className="text-sm text-gray-400">{subtitle}</p>
    </div>
  );
}
