import { CSSProperties } from 'react';

interface Slice {
  left: number;
  width: number;
}

interface SliceProps {
  slice: Slice;
}

const SCREENSHOT = {
  src: '/images/running-list-table.png',
  alt: 'Running List week view with seven tasks and their daily marks',
  width: 2848,
  height: 1124,
};

// Source pixels kept on small screens. The empty middle of the table is
// dropped, and the two sides meet where the dotted lines end
const COMPACT_TOP = 350;
const COMPACT_HEIGHT = 672;
const TASKS_SLICE: Slice = { left: 80, width: 536 };
const MARKS_SLICE: Slice = { left: 2153, width: 600 };

/**
 * Places the screenshot so that only one slice of it is visible
 *
 * @param slice - Horizontal part of the screenshot in source pixels
 * @returns Position and size relative to the slice container
 */
const getSliceStyle = ({ left, width }: Slice): CSSProperties => ({
  left: `${(-left / width) * 100}%`,
  top: `${(-COMPACT_TOP / COMPACT_HEIGHT) * 100}%`,
  width: `${(SCREENSHOT.width / width) * 100}%`,
});

/** Shows one horizontal slice of the screenshot */
const ScreenshotSlice = ({ slice }: SliceProps) => (
  <div className="relative overflow-hidden">
    <img
      src={SCREENSHOT.src}
      alt=""
      width={SCREENSHOT.width}
      height={SCREENSHOT.height}
      className="absolute h-auto max-w-none"
      style={getSliceStyle(slice)}
    />
  </div>
);

/** Joins the task names and the daily marks into a table that fits a phone */
const CompactScreenshot = () => (
  <div
    role="img"
    aria-label={SCREENSHOT.alt}
    className="mt-8 grid lg:hidden"
    style={{
      aspectRatio: `${TASKS_SLICE.width + MARKS_SLICE.width} / ${COMPACT_HEIGHT}`,
      gridTemplateColumns: `${TASKS_SLICE.width}fr ${MARKS_SLICE.width}fr`,
    }}
  >
    <ScreenshotSlice slice={TASKS_SLICE} />
    <ScreenshotSlice slice={MARKS_SLICE} />
  </div>
);

/** Shows the product screenshot in the layout that suits the screen width */
export const WeekScreenshot = () => (
  <>
    <CompactScreenshot />
    {/* The offsets cancel the padding baked into the screenshot, so its
        content lines up with the text above */}
    <img
      src={SCREENSHOT.src}
      alt={SCREENSHOT.alt}
      width={SCREENSHOT.width}
      height={SCREENSHOT.height}
      className="mt-12 hidden w-full -translate-x-[2.84%] -translate-y-[7.3%] lg:block"
    />
  </>
);
