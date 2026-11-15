export default function DeviceSplit({ devices }) {
  return (
    <div>
      <div className="flex h-3 gap-[2px] overflow-hidden rounded-full">
        {devices.map((d) => (
          <div
            key={d.device}
            title={`${d.device}: ${d.share}%`}
            style={{ width: `${d.share}%`, backgroundColor: d.color }}
          />
        ))}
      </div>
      <ul className="mt-4 flex justify-between gap-3">
        {devices.map((d) => (
          <li key={d.device} className="flex items-start gap-2">
            <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-sm" style={{ backgroundColor: d.color }} />
            <div className="leading-tight">
              <p className="text-xs text-muted">{d.device}</p>
              <p className="text-sm font-medium tabular-nums text-ink">{d.share}%</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
