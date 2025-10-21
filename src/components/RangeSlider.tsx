interface RangeSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export function RangeSlider({
  label,
  value,
  onChange,
  min = 1,
  max = 10,
}: RangeSliderProps) {
  return (
    <div>
      <label className="block mb-1 text-sm font-medium text-black">
        {label}: {value}/{max}
      </label>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-gray-200 appearance-none cursor-pointer accent-black"
      />
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}
