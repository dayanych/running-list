import { WeekScreenshot } from './week-screenshot';

/** Introduces the product next to the sign-in form */
export const AuthIntro = () => (
  <div className="flex flex-col px-6 pt-12 sm:px-12 lg:justify-center lg:py-16 xl:px-16">
    <div className="mx-auto w-full max-w-[26rem] lg:mx-0 lg:max-w-[56rem]">
      <p className="type-meta mb-6 text-ink-muted lg:hidden">Running List</p>
      <h1 className="type-hero max-w-[36rem] text-balance">
        Your week in one table
      </h1>
      <p className="type-lead mt-6 max-w-[32rem] text-pretty text-ink-muted">
        Tasks in rows, days in columns. Make a short list of what matters this
        week, mark what happened each day, then decide what comes next
      </p>
      <WeekScreenshot />
    </div>
  </div>
);
