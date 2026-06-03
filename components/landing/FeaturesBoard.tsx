"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useReducedMotion,
  useTransform,
} from "motion/react";
import {
  ArrowRightIcon,
  BellRingingIcon,
  CheckCircleIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react/dist/ssr";

import { cn } from "@/lib/utils";

/**
 * FeaturesBoard ("Features", spec section 3): the "tablero de notas vivas".
 *
 * Asymmetric bento where each cell is NOT an icon+text card but a real fragment
 * of the CRM faux-UI pinned to a board like a paper note, with drag physics.
 * Exactly 4 cells = 4 contents (one idea per piece). 1 large + 3 small.
 *
 * Motion is on-demand (MEDIUM level), it must not auto-play or compete with the
 * hero. Three layers, all gated:
 *  - Entrance: whileInView spring (once), staggered, "ease-snap" landing.
 *  - Drag (desktop / fine pointer only): Motion drag constrained to the board,
 *    dragElastic rubber-band, dragTransition settle, whileDrag lift + tilt.
 *    Rotation + spotlight are derived from motion values (no useState for
 *    continuous values, off the React render cycle).
 *  - Hover-peek + clay spotlight (desktop only): the faux-UI micro-demo replays
 *    and a radial clay glow follows the cursor (--duration-micro).
 *  - Mobile / coarse pointer: NO free-drag (scroll conflict). The micro-demo
 *    replays once on enter (in-view-replay). No hover-peek.
 *  - Reduced motion: drag off, notes static and already placed, no spotlight.
 *    Every faux-UI is fully legible static; motion is pure enhancement.
 *
 * 100% design tokens, radius 0, transform/opacity only (+ SVG pathLength for the
 * hand-drawn "at risk" circle). Phosphor icons from /dist/ssr.
 */

// --- Motion timing tokens (mirrors globals.css) ---------------------------
const EASE_SNAP = [0.34, 1.56, 0.64, 1] as const; // --ease-snap
const DURATION_MICRO = 0.12; // --duration-micro
const ENTER_SPRING = { type: "spring", stiffness: 100, damping: 14 } as const;
const SETTLE_TRANSITION = { bounceStiffness: 240, bounceDamping: 18 } as const;

// --- Pointer capability (discrete config, detected once) ------------------
// A single boolean of configuration is allowed in useState. What is forbidden
// is tracking continuous drag/cursor values in state; those use motion values.
const FINE_POINTER_QUERY = "(pointer: fine) and (hover: hover)";

function useFinePointer(): boolean {
  // Subscribe to the media query as an external store. useSyncExternalStore
  // reads on the client without a setState-in-effect, and returns false during
  // SSR so the first client render matches (drag/hover enrich after mount).
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(FINE_POINTER_QUERY);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(FINE_POINTER_QUERY).matches,
    () => false,
  );
}

// --- Faux-UI 1: mini kanban pipeline (large cell) -------------------------
function KanbanFauxUI({ active }: { active: boolean }) {
  return (
    <div className="flex flex-col gap-4">
      <p className="font-heading text-h3 text-text-primary">Tu pipeline</p>
      <div className="grid grid-cols-2 gap-4">
        {/* Column: En curso */}
        <div className="flex flex-col gap-2">
          <span className="font-mono text-meta uppercase text-text-tertiary">
            En curso
          </span>
          <div className="rounded-sm border border-border bg-surface p-3">
            <p className="text-body-sm text-text-primary">Marta Quiroga</p>
            <p className="font-mono text-meta uppercase text-text-tertiary">
              Branding cafetería
            </p>
          </div>
          <div className="rounded-sm border border-border bg-surface p-3">
            <p className="text-body-sm text-text-primary">Estudio Bravo</p>
            <p className="font-mono text-meta uppercase text-text-tertiary">
              Landing producto
            </p>
          </div>
        </div>
        {/* Column: Cerrado */}
        <div className="flex flex-col gap-2">
          <span className="font-mono text-meta uppercase text-text-tertiary">
            Cerrado
          </span>
          <motion.div
            className="flex items-center gap-2 rounded-sm border border-success bg-success-soft p-3"
            initial={false}
            animate={
              active
                ? { scale: [1, 1.04, 1], opacity: [0.7, 1, 1] }
                : { scale: 1, opacity: 1 }
            }
            transition={{ duration: 0.36, ease: EASE_SNAP }}
          >
            <CheckCircleIcon
              size={18}
              weight="fill"
              className="shrink-0 text-success"
              aria-hidden
            />
            <div>
              <p className="text-body-sm text-text-primary">Núria Vidal</p>
              <p className="font-mono text-meta uppercase text-success">
                Cobrado
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// --- Faux-UI 2: client "at risk" with hand-drawn clay circle --------------
function AtRiskFauxUI({ active }: { active: boolean }) {
  return (
    <div className="flex flex-col gap-4">
      <span className="inline-flex w-fit items-center gap-1.5 font-mono text-meta uppercase text-accent-secondary">
        <WarningCircleIcon size={14} weight="bold" aria-hidden />
        La IA lo marca
      </span>
      <div className="relative w-fit">
        {/* Hand-drawn circle: SVG pathLength stroke, the only non-transform
            animation (allowed for the drawn ring). */}
        <svg
          aria-hidden
          viewBox="0 0 200 96"
          className="pointer-events-none absolute -inset-x-3 -inset-y-2 h-[calc(100%+1rem)] w-[calc(100%+1.5rem)]"
          preserveAspectRatio="none"
        >
          <motion.path
            d="M18 50 C 18 18, 70 12, 104 14 C 158 17, 188 30, 184 54 C 180 80, 120 86, 74 84 C 30 82, 16 70, 22 46"
            fill="none"
            stroke="var(--color-accent-secondary)"
            strokeWidth={2}
            strokeLinecap="round"
            initial={false}
            animate={{ pathLength: active ? 1 : 0.001 }}
            transition={{ duration: 0.6, ease: EASE_SNAP }}
          />
        </svg>
        <div className="relative px-2 py-1">
          <p className="text-body-sm text-text-primary">Hugo Salazar</p>
          <p className="font-mono text-meta uppercase text-text-tertiary">
            Sin contacto 18 días
          </p>
        </div>
      </div>
    </div>
  );
}

// --- Faux-UI 3: reminder toast --------------------------------------------
function ReminderFauxUI({ active }: { active: boolean }) {
  return (
    <div className="flex flex-col gap-4">
      <p className="font-heading text-h3 text-text-primary">Recordatorios</p>
      <motion.div
        className="flex items-start gap-3 rounded-sm border border-border bg-surface p-3 shadow-soft"
        initial={false}
        animate={
          active ? { y: [8, 0], opacity: [0, 1] } : { y: 0, opacity: 1 }
        }
        transition={{ duration: 0.36, ease: EASE_SNAP }}
      >
        <BellRingingIcon
          size={20}
          weight="fill"
          className="mt-0.5 shrink-0 text-accent-secondary"
          aria-hidden
        />
        <div>
          <p className="font-mono text-meta uppercase text-text-tertiary">Hoy</p>
          <p className="text-body-sm text-text-primary">
            Seguimiento con Marta Quiroga
          </p>
        </div>
      </motion.div>
    </div>
  );
}

// --- Faux-UI 4: product metric --------------------------------------------
function MetricFauxUI() {
  return (
    <div className="flex flex-col gap-2">
      <span className="font-mono text-meta uppercase text-text-tertiary">
        Clientes gestionados
      </span>
      <p className="font-mono text-[2.75rem] leading-none text-text-primary">
        37
      </p>
      <span className="inline-flex items-center gap-1.5 font-mono text-meta uppercase text-success">
        <ArrowRightIcon size={14} weight="bold" className="-rotate-45" aria-hidden />
        12 casos abiertos
      </span>
    </div>
  );
}

// --- Note shell: paper note + drag physics + spotlight --------------------
type NoteConfig = {
  id: string;
  span: string;
  restTilt: number; // resting rotation in degrees (paper-pinned look)
  /** Feature name (clay micro-label) + one-line "what it solves" so the note is
   *  understood at a glance, not just a pretty faux-UI fragment. */
  name: string;
  blurb: string;
  render: (active: boolean) => React.ReactNode;
};

const NOTES: NoteConfig[] = [
  {
    id: "kanban",
    span: "md:col-span-4 md:row-span-2",
    restTilt: -1,
    name: "Pipeline de clientes",
    blurb:
      "Cada cliente en su etapa, de “en curso” a “cobrado”. Ves de un vistazo qué tienes abierto y qué ya cerraste, sin abrir cinco pestañas.",
    render: (active) => <KanbanFauxUI active={active} />,
  },
  {
    id: "at-risk",
    span: "md:col-span-2",
    restTilt: 1,
    name: "Aviso de la IA",
    blurb:
      "La IA detecta clientes que llevan días sin contacto y te los marca antes de que se enfríen.",
    render: (active) => <AtRiskFauxUI active={active} />,
  },
  {
    id: "reminder",
    span: "md:col-span-2",
    restTilt: 1.2,
    name: "Recordatorios",
    blurb:
      "Programa el próximo seguimiento y Tendr te recuerda a quién toca escribir hoy.",
    render: (active) => <ReminderFauxUI active={active} />,
  },
  {
    id: "metric",
    span: "md:col-span-2",
    restTilt: -1.2,
    name: "Tu cartera, medida",
    blurb:
      "Cuántos clientes llevas y cuántos casos siguen abiertos, siempre a mano.",
    render: () => <MetricFauxUI />,
  },
];

function Note({
  config,
  index,
  boardRef,
  draggable,
  hoverPeek,
  reduceMotion,
}: {
  config: NoteConfig;
  index: number;
  boardRef: React.RefObject<HTMLDivElement | null>;
  draggable: boolean;
  hoverPeek: boolean;
  reduceMotion: boolean;
}) {
  // Continuous values live in motion values, never useState.
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  // Rotation derived from horizontal displacement: pivots like a short pendulum
  // around the pin (transformOrigin top-center). Resting tilt baked in.
  const dragRotate = useTransform(x, [-160, 0, 160], [-6, 0, 6]);

  // Spotlight position (clay radial glow following the cursor).
  const sx = useMotionValue(50);
  const sy = useMotionValue(50);
  const spotlight = useMotionTemplate`radial-gradient(220px circle at ${sx}% ${sy}%, var(--color-accent-secondary-soft), transparent 70%)`;

  // Discrete "demo playing" flag: in-view-replay (mobile) or hover (desktop).
  // This is a discrete UI state, not a continuous value, so useState is correct.
  const [active, setActive] = useState(false);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!hoverPeek) return;
    const rect = e.currentTarget.getBoundingClientRect();
    sx.set(((e.clientX - rect.left) / rect.width) * 100);
    sy.set(((e.clientY - rect.top) / rect.height) * 100);
  };

  return (
    <motion.article
      className={cn(
        "group relative isolate flex flex-col gap-5 rounded-md border border-border bg-surface-raised p-6 shadow-soft",
        config.span,
        draggable && "cursor-grab active:cursor-grabbing touch-none",
      )}
      style={{
        x,
        y,
        rotate: reduceMotion ? config.restTilt : dragRotate,
        transformOrigin: "top center",
      }}
      // Resting paper tilt as a static transform baseline under reduced motion
      // is applied via rotate above; for the animated path we add it on enter.
      initial={
        reduceMotion ? false : { opacity: 0, y: 28, rotate: config.restTilt }
      }
      whileInView={
        reduceMotion
          ? undefined
          : { opacity: 1, y: 0, rotate: config.restTilt }
      }
      viewport={{ once: true, amount: 0.4 }}
      transition={{ ...ENTER_SPRING, delay: index * 0.09 }}
      onViewportEnter={() => {
        // In-view-replay: on coarse pointer (no hover) the micro-demo plays once.
        if (!hoverPeek && !reduceMotion) setActive(true);
      }}
      drag={draggable}
      dragConstraints={boardRef}
      dragElastic={0.15}
      dragTransition={SETTLE_TRANSITION}
      whileDrag={{ scale: 1.04, zIndex: 20 }}
      onHoverStart={hoverPeek ? () => setActive(true) : undefined}
      onHoverEnd={hoverPeek ? () => setActive(false) : undefined}
      onPointerMove={handlePointerMove}
    >
      {/* Clay spotlight: follows the cursor, fades in on hover only. Behind the
          content, transform/opacity friendly (it animates opacity). */}
      {hoverPeek && !reduceMotion ? (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity group-hover:opacity-100"
          style={{
            backgroundImage: spotlight,
            transitionDuration: `${DURATION_MICRO * 1000}ms`,
          }}
        />
      ) : null}
      {config.render(active)}

      {/* "What it solves": always-visible caption so each feature is understood
          at a glance (not hover-only, so mobile + reduced-motion read it too).
          mt-auto anchors it to the bottom of the note. */}
      <div className="mt-auto flex flex-col gap-1.5 border-t border-border pt-4">
        <span className="font-mono text-meta uppercase text-accent-secondary">
          {config.name}
        </span>
        <p className="text-body-sm text-text-secondary">{config.blurb}</p>
      </div>
    </motion.article>
  );
}

export function FeaturesBoard() {
  const boardRef = useRef<HTMLDivElement>(null);
  const finePointer = useFinePointer();
  const reduceMotion = useReducedMotion() ?? false;

  // Drag only on fine pointer (desktop) AND when motion is allowed: avoids the
  // mobile scroll/drag gesture conflict and respects reduced motion.
  const draggable = finePointer && !reduceMotion;
  const hoverPeek = finePointer && !reduceMotion;

  return (
    <div
      ref={boardRef}
      className="grid grid-cols-1 gap-8 md:auto-rows-min md:grid-cols-6"
    >
      {NOTES.map((config, index) => (
        <Note
          key={config.id}
          config={config}
          index={index}
          boardRef={boardRef}
          draggable={draggable}
          hoverPeek={hoverPeek}
          reduceMotion={reduceMotion}
        />
      ))}
    </div>
  );
}
