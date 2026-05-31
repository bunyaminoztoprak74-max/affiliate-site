import { CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProsConsBoxProps {
  pros: string[];
  cons: string[];
  className?: string;
}

export default function ProsConsBox({ pros, cons, className }: ProsConsBoxProps) {
  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 gap-4 my-6", className)}>
      <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
        <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2 text-sm uppercase tracking-wide">
          <CheckCircle className="w-4 h-4" />
          Pros
        </h4>
        <ul className="space-y-2">
          {pros.map((pro) => (
            <li key={pro} className="flex gap-2 text-sm text-green-800">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
              <span>{pro}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
        <h4 className="font-semibold text-red-800 mb-3 flex items-center gap-2 text-sm uppercase tracking-wide">
          <XCircle className="w-4 h-4" />
          Cons
        </h4>
        <ul className="space-y-2">
          {cons.map((con) => (
            <li key={con} className="flex gap-2 text-sm text-red-800">
              <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <span>{con}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
