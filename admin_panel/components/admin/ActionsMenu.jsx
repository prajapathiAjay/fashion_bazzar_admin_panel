"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { EllipsisVertical } from "lucide-react";

const MENU_WIDTH = 192; // w-48
const ITEM_HEIGHT = 40;

/**
 * Row actions as a dropdown: a "⋮" button that opens a small menu.
 *
 * @param {Array<{
 *   label: string,          text shown in the menu
 *   icon: Component,        a lucide-react icon
 *   href?: string,          makes the item a link ...
 *   external?: boolean,     ... that opens in a new tab
 *   onClick?: () => void,   or makes it a button
 *   danger?: boolean,       red, for delete
 *   disabled?: boolean
 * }>} items
 * @param {string} [label]   what the menu is for, read by screen readers ("Actions for Sweater")
 */
export default function ActionsMenu({ items, label = "Actions" }) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  // The menu is drawn at a fixed spot on the screen (not inside the table),
  // so the table's scroll area can't cut it off.
  const toggle = () => {
    if (open) return setOpen(false);
    const rect = buttonRef.current.getBoundingClientRect();
    const height = items.length * ITEM_HEIGHT + 12;
    const fitsBelow = rect.bottom + 6 + height <= window.innerHeight;
    setPosition({
      top: fitsBelow ? rect.bottom + 6 : Math.max(8, rect.top - height - 6), // open upwards near the bottom
      left: Math.max(8, rect.right - MENU_WIDTH),
    });
    setOpen(true);
  };

  // Close on a click elsewhere, Escape, scrolling or resizing
  useEffect(() => {
    if (!open) return undefined;
    const close = () => setOpen(false);
    const onDown = (e) => {
      if (menuRef.current?.contains(e.target) || buttonRef.current?.contains(e.target)) return;
      close();
    };
    const onKey = (e) => {
      if (e.key === "Escape") {
        close();
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [open]);

  const itemClass = (item) =>
    `flex h-10 w-full items-center gap-2.5 rounded-md px-3 text-left text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
      item.danger ? "text-danger hover:bg-danger-50" : "text-ink-soft hover:bg-mist hover:text-ink"
    }`;

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={toggle}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={label}
        title="Actions"
        className={`flex h-8 w-8 items-center justify-center rounded-md border transition-colors ${
          open
            ? "border-line-hover bg-mist text-ink"
            : "border-transparent text-subtle hover:border-line-strong hover:bg-mist hover:text-ink"
        }`}
      >
        <EllipsisVertical size={17} />
      </button>

      {open &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            aria-label={label}
            style={{ top: position.top, left: position.left, width: MENU_WIDTH }}
            className="fixed z-50 rounded-lg border border-line bg-white p-1.5 shadow-[0_12px_32px_rgba(28,23,20,0.14)]"
          >
            {items.map((item) => {
              const Icon = item.icon;
              const content = (
                <>
                  {Icon && <Icon size={16} strokeWidth={1.75} className="shrink-0" />}
                  <span className="truncate">{item.label}</span>
                </>
              );
              if (item.href && !item.disabled) {
                return item.external ? (
                  <a
                    key={item.label}
                    role="menuitem"
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => setOpen(false)}
                    className={itemClass(item)}
                  >
                    {content}
                  </a>
                ) : (
                  <Link
                    key={item.label}
                    role="menuitem"
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={itemClass(item)}
                  >
                    {content}
                  </Link>
                );
              }
              return (
                <button
                  key={item.label}
                  type="button"
                  role="menuitem"
                  disabled={item.disabled}
                  onClick={() => {
                    setOpen(false);
                    item.onClick?.();
                  }}
                  className={itemClass(item)}
                >
                  {content}
                </button>
              );
            })}
          </div>,
          document.body
        )}
    </>
  );
}
