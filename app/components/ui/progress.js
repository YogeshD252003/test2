import * as ProgressPrimitive from "@radix-ui/react-progress";

export function Progress({ value = 0, className = "" }) {
  return (
    <ProgressPrimitive.Root
      className={`relative w-full h-3 bg-gray-200 rounded-full overflow-hidden ${className}`}
      value={value}
    >
      <ProgressPrimitive.Indicator
        className="h-full bg-blue-500 transition-all"
        style={{ width: `${value}%` }}
      />
    </ProgressPrimitive.Root>
  );
}
