import { Input } from "@/components/ui/input";

interface SearchBoxProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const SearchBox = ({ placeholder, value, onChange, className = "max-w-sm" }: SearchBoxProps) => {
  return (
    <Input
      placeholder={placeholder}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className={className}
    />
  );
};