import { MousePointer2 } from "lucide-react";
import type {
  BoardMock,
  CanvasMock,
  DocMock,
  FeatureMockData,
} from "@/app/_data/landing";

/** Static picture of a surface: role="img" makes its label the only thing screen readers announce. */
export function FeatureMock({ mock }: { mock: FeatureMockData }) {
  return (
    <div
      role="img"
      aria-label={mock.label}
      className="overflow-hidden rounded-2xl border bg-card text-left shadow-2xl select-none"
    >
      <div className="flex h-10 items-center justify-between gap-3 border-b px-4 text-xs">
        <span className="truncate text-muted-foreground">{mock.breadcrumb}</span>
        <span className="shrink-0 rounded-md bg-secondary px-2 py-0.5 text-secondary-foreground">
          {mock.tag}
        </span>
      </div>
      {mock.kind === "canvas" && <Flowchart mock={mock} />}
      {mock.kind === "doc" && <Doc mock={mock} />}
      {mock.kind === "board" && <Board mock={mock} />}
    </div>
  );
}

function FlowNode({
  x,
  y,
  width,
  label,
  active,
}: {
  x: number;
  y: number;
  width: number;
  label: string;
  active?: boolean;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={44}
        rx={10}
        className={active ? "fill-secondary stroke-primary" : "fill-secondary stroke-border"}
      />
      <text
        x={x + width / 2}
        y={y + 27}
        textAnchor="middle"
        className="fill-foreground text-[14px] font-medium"
      >
        {label}
      </text>
    </g>
  );
}

function Flowchart({ mock }: { mock: CanvasMock }) {
  return (
    <div className="bg-[radial-gradient(var(--border)_1px,transparent_1px)] bg-size-[18px_18px] p-4">
      <svg viewBox="0 0 480 330" aria-hidden="true" className="block h-auto w-full">
        <defs>
          <marker
            id="flow-arrow"
            viewBox="0 0 8 8"
            refX="7"
            refY="4"
            markerWidth="7"
            markerHeight="7"
            orient="auto"
          >
            <path d="M0 0 8 4 0 8Z" className="fill-primary" />
          </marker>
        </defs>

        <g fill="none" strokeWidth="1.5" className="stroke-primary">
          <path d="M240 60V88" markerEnd="url(#flow-arrow)" />
          <path d="M144 128H84V196" markerEnd="url(#flow-arrow)" />
          <path d="M336 128H396V196" markerEnd="url(#flow-arrow)" />
          <path d="M84 240V290H150" markerEnd="url(#flow-arrow)" />
          {/* Dashed: the arrow the agent is still drawing. */}
          <path d="M396 240V290H330" strokeDasharray="5 4" markerEnd="url(#flow-arrow)" />
        </g>

        <FlowNode x={150} y={16} width={180} label={mock.start} />
        <polygon
          points="240,88 336,128 240,168 144,128"
          className="fill-secondary stroke-border"
        />
        <text
          x={240}
          y={132}
          textAnchor="middle"
          className="fill-foreground text-[13px] font-medium"
        >
          {mock.decision}
        </text>
        <text x={114} y={120} textAnchor="middle" className="fill-muted-foreground text-[12px]">
          {mock.yes.branch}
        </text>
        <text x={366} y={120} textAnchor="middle" className="fill-muted-foreground text-[12px]">
          {mock.no.branch}
        </text>
        <FlowNode x={14} y={196} width={140} label={mock.yes.step} />
        <FlowNode x={326} y={196} width={140} label={mock.no.step} />
        <FlowNode x={150} y={268} width={180} label={mock.end} active />

        <path d="M334 290 342 311 346 302 355 299Z" className="fill-primary" />
        <rect x={350} y={303} width={126} height={24} rx={12} className="fill-primary" />
        <text
          x={413}
          y={319}
          textAnchor="middle"
          className="fill-primary-foreground text-[11px] font-medium"
        >
          {mock.agent}
        </text>
      </svg>
    </div>
  );
}

function Doc({ mock }: { mock: DocMock }) {
  return (
    <div className="p-5 sm:p-7">
      <p className="font-heading text-2xl font-semibold">{mock.title}</p>
      <p className="mt-1 text-xs text-muted-foreground">{mock.source}</p>

      <div className="relative mt-5 rounded-lg border border-primary/40 bg-accent/40 p-3">
        <p className="font-heading font-semibold">{mock.overview.heading}</p>
        <p className="mt-1 text-sm text-muted-foreground">{mock.overview.body}</p>
        <span className="absolute -top-2.5 right-3 rounded-full bg-primary px-2.5 py-0.5 text-[11px] font-medium text-primary-foreground">
          {mock.overview.agent}
        </span>
      </div>

      <div className="mt-5 px-3">
        <p className="font-heading font-semibold">{mock.steps.heading}</p>
        <ol className="mt-1 list-decimal space-y-1 pl-5 text-sm text-muted-foreground">
          {mock.steps.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function Board({ mock }: { mock: BoardMock }) {
  return (
    <div className="grid grid-cols-3 gap-2 p-3 sm:grid-cols-4 sm:gap-3 sm:p-4">
      {mock.columns.map((column, index) => (
        // Three columns is all that stays legible at phone width.
        <div key={column.name} className={index === 3 ? "hidden sm:block" : undefined}>
          <p className="truncate px-1 text-[11px] font-medium text-muted-foreground">
            {column.name}
          </p>
          <div className="mt-2 space-y-2">
            {column.cards.map((card) => (
              <div key={card.title} className="relative rounded-lg border bg-secondary p-2.5 pb-3">
                <p className="text-xs font-medium">{card.title}</p>
                <div className="mt-2 flex -space-x-1">
                  {card.members.map((member) => (
                    <span
                      key={member}
                      className="flex size-4.5 items-center justify-center rounded-full bg-muted text-[9px] text-muted-foreground ring-1 ring-secondary"
                    >
                      {member}
                    </span>
                  ))}
                </div>
                {card.cursor && <LiveCursor name={card.cursor} />}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function LiveCursor({ name }: { name: string }) {
  return (
    <span className="absolute right-1 bottom-1 flex items-start text-emerald-400">
      <MousePointer2 className="size-3.5 fill-current" />
      <span className="mt-2.5 -ml-0.5 rounded-full bg-emerald-400 px-1.5 py-px text-[10px] font-medium text-emerald-950">
        {name}
      </span>
    </span>
  );
}
