"use client";
import { X, ArrowUpRight } from "lucide-react";
import { useEffect, useRef } from "react";
import { serializeCSV } from "@/lib/csv.mjs";
export function Badge({ children }: { children: React.ReactNode }) {
  const text = String(children);
  return (
    <span
      className={`badge ${/Failed|Suspended|Bounced|Past due/.test(text) ? "red" : /Draft|Scheduled|Waiting|Starter/.test(text) ? "amber" : /Pro|Business|Sending|In progress/.test(text) ? "purple" : /Free|Read/.test(text) ? "neutral" : "green"}`}
    >
      <span className="badge-dot" />
      {children}
    </span>
  );
}
export function Avatar({ name, index = 0 }: { name: string; index?: number }) {
  return (
    <span className={`avatar avatar-${index % 5}`}>
      {name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")}
    </span>
  );
}
export function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const node = ref.current;
    const listener = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !node) return;
      const elements = Array.from(
        node.querySelectorAll<HTMLElement>(
          'button, a[href], input, select, textarea, [tabindex="0"]',
        ),
      ).filter((el) => !el.hasAttribute("disabled"));
      const first = elements[0],
        last = elements[elements.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };
    node?.addEventListener("keydown", listener);
    return () => {
      document.body.style.overflow = overflow;
      node?.removeEventListener("keydown", listener);
      previous?.focus();
    };
  }, []);
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <section
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="modal"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key === "Escape") onClose();
        }}
      >
        <header>
          <h2>{title}</h2>
          <button
            className="icon-button"
            onClick={onClose}
            aria-label="Close dialog"
            autoFocus
          >
            <X size={20} />
          </button>
        </header>
        {children}
      </section>
    </div>
  );
}
export function Trend({ value }: { value: string }) {
  return (
    <span className="trend">
      <ArrowUpRight size={13} />
      {value}
    </span>
  );
}
export function exportCSV(name: string, rows: Record<string, unknown>[]) {
  if (!rows.length) return;
  const csv = serializeCSV(rows);
  const url = URL.createObjectURL(
    new Blob([csv], { type: "text/csv;charset=utf-8;" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = `postcraft-${name}-demo.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
