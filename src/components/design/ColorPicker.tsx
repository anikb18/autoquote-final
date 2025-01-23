import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

export function ColorPicker({ color, onChange }: ColorPickerProps) {
  return (
    <div className="flex items-center gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <button
            className="w-8 h-8 rounded-lg border shadow"
            style={{ backgroundColor: color }}
          />
        </PopoverTrigger>
        <PopoverContent className="w-64">
          <div className="space-y-2">
            <Label>Pick a color</Label>
            <Input
              type="color"
              value={color}
              onChange={(e) => onChange(e.target.value)}
              className="h-32 w-full"
            />
          </div>
        </PopoverContent>
      </Popover>
      <Input
        type="text"
        value={color}
        onChange={(e) => onChange(e.target.value)}
        className="font-mono"
      />
    </div>
  );
}