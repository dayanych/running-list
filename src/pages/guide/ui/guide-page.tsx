import { useEffect } from 'react';
import { LuArrowRight } from 'react-icons/lu';
import { Link } from 'react-router-dom';

import { settingsConfig } from '@/shared/config/settings.config';
import { Button, Footer, PageHeader } from '@/shared/ui';

import { GuideFigure } from './guide-figure';

const sections = [
  ['overview', 'Your week at a glance'],
  ['first-task', 'Add your first tasks'],
  ['daily-marks', 'Understand the marks'],
  ['next-week', 'Plan the next week'],
  ['habits', 'Track a habit'],
  ['quick-reference', 'Quick reference'],
] as const;

const marks = [
  {
    icon: '01-empty',
    label: 'Empty',
    description:
      'An unfilled square. You can use it to mark a day you plan to work on a task, then change it when you know the result',
  },
  {
    icon: '02-completed',
    label: 'Full done',
    description:
      'You finished what you intended to do that day. For example, the presentation is ready to send',
  },
  {
    icon: '03-half-done',
    label: 'Half done',
    description:
      'You made progress but still have something left to do. For example, the outline is ready and the slides need work',
  },
  {
    icon: '04-moved',
    label: 'Delay',
    description:
      'You are putting the task off until another day. This mark does not move or copy the task automatically',
  },
  {
    icon: '05-cancelled',
    label: 'Failed',
    description:
      'The task did not happen that day. You can keep the mark as a record and decide what to do next',
  },
];

const sectionClassName = 'scroll-mt-8 border-t border-rule pt-10 sm:pt-12';

/** Explains weekly planning and daily marks without requiring an account */
export const GuidePage = () => {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'How to use Running List';

    return () => {
      document.title = previousTitle;
    };
  }, []);

  return (
    <>
      <a
        href="#guide-content"
        className="sr-only z-10 bg-background p-4 text-foreground focus:not-sr-only focus:absolute focus:left-4 focus:top-4"
      >
        Skip to guide
      </a>
      <PageHeader>
        <Button asChild variant="outline" className="h-11 rounded-none">
          <Link to="/">Plan my week</Link>
        </Button>
      </PageHeader>

      <main
        id="guide-content"
        tabIndex={-1}
        className="container pb-16 pt-12 focus:outline-none sm:pb-24 sm:pt-20"
      >
        <div className="max-w-3xl">
          <h1 className="type-hero max-w-xl text-balance">
            Your first week with Running List
          </h1>
          <p className="type-lead mt-6 max-w-2xl text-ink-muted">
            Make a short list of what matters this week. See your tasks and
            their daily progress in one table, then decide what comes next
          </p>
        </div>

        <div className="mt-12 grid items-start gap-12 sm:mt-16 lg:grid-cols-[12rem_minmax(0,1fr)] lg:gap-16">
          <nav aria-label="Guide sections" className="lg:sticky lg:top-8">
            <p className="type-ui mb-3">In this guide</p>
            <ul className="grid gap-1 sm:grid-cols-2 lg:grid-cols-1">
              {sections.map(([id, title]) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    className="type-help flex min-h-11 items-center text-ink-muted underline-offset-4 hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4"
                  >
                    {title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="min-w-0 max-w-2xl space-y-12 sm:space-y-16">
            <section id="overview" className={sectionClassName}>
              <h2 className="type-section">Your week at a glance</h2>
              <p className="type-lead mt-4 text-ink-muted">
                Each row is a task. The seven columns are the days of the week.
                A mark at their intersection tells you what happened with that
                task on that day
              </p>
              <dl className="mt-8 space-y-6">
                <div>
                  <dt className="type-task">See the whole week together</dt>
                  <dd className="type-help mt-1 text-ink-muted">
                    Keep your weekly tasks and daily results in the same view.
                    You can look back at earlier days while planning the rest
                  </dd>
                </div>
                <div>
                  <dt className="type-task">Keep partial progress visible</dt>
                  <dd className="type-help mt-1 text-ink-muted">
                    A task can be partly done, finished, or delayed. Your marks
                    tell the story across the week
                  </dd>
                </div>
                <div>
                  <dt className="type-task">Carry useful tasks forward</dt>
                  <dd className="type-help mt-1 text-ink-muted">
                    Copy a task to the next week without typing its name again.
                    The original stays in this week with its marks
                  </dd>
                </div>
              </dl>
              <GuideFigure
                name="week-overview"
                alt="A Running List week with example tasks in rows and daily marks across seven day columns"
                caption="One task per row. One day per column. A week you can read at a glance"
              />
            </section>

            <section id="first-task" className={sectionClassName}>
              <h2 className="type-section">Start with a few tasks</h2>
              <p className="type-lead mt-4 text-ink-muted">
                Sign in with Google or an email link. Running List opens your
                current week. Choose a few concrete things you want to do:
                prepare a presentation, book a dentist appointment, or sort out
                paperwork
              </p>
              <ol className="type-lead mt-6 list-decimal space-y-3 pl-6 marker:text-ink-muted">
                <li>
                  Find{' '}
                  <strong className="font-semibold">Add new task...</strong>{' '}
                  below the table
                </li>
                <li>Type a task name, such as “Prepare a presentation”</li>
                <li>Press Enter or the plus button to add it to the week</li>
              </ol>
              <p className="type-help mt-6 text-ink-muted">
                A good starting point is three or four tasks. The add-task field
                becomes unavailable at {settingsConfig.maxTasksPerWeek} tasks,
                including habits
              </p>
              <GuideFigure
                name="add-task"
                alt="The Add new task input below the table and a task named Prepare a presentation"
                caption="Add the task once, then use its row throughout the week"
              />
            </section>

            <section id="daily-marks" className={sectionClassName}>
              <h2 className="type-section">Give each day a mark</h2>
              <p className="type-lead mt-4 text-ink-muted">
                Click or tap the cell where your task meets the day. Choose a
                mark from the menu. You can open the same cell again to change
                it as your plans or progress change
              </p>
              <dl className="mt-8 divide-y divide-rule">
                {marks.map((mark) => (
                  <div key={mark.icon} className="flex gap-5 py-5 first:pt-0">
                    <img
                      src={`/icons/${mark.icon}.svg`}
                      width={36}
                      height={36}
                      alt=""
                      className="mt-1 size-9 shrink-0"
                    />
                    <div>
                      <dt className="type-task">{mark.label}</dt>
                      <dd className="type-help mt-1 text-ink-muted">
                        {mark.description}
                      </dd>
                    </div>
                  </div>
                ))}
              </dl>
              <p className="type-help mt-4 text-ink-muted">
                A small dot means no mark has been set. Choosing Empty adds an
                unfilled square; choosing Delete removes the mark and returns
                the cell to a dot
              </p>
              <GuideFigure
                name="choose-status"
                alt="A day cell with the Empty, Full done, Half done, Delay, Failed, and Delete menu options"
                caption="These are the same symbols and labels you will find in the table"
              />
            </section>

            <section id="next-week" className={sectionClassName}>
              <h2 className="type-section">Make room for next week</h2>
              <p className="type-lead mt-4 text-ink-muted">
                At the end of the week, look over your marks. Decide which tasks
                still matter and which ones are finished. Copy the tasks you
                want to continue
              </p>
              <ol className="type-lead mt-6 list-decimal space-y-3 pl-6 marker:text-ink-muted">
                <li>Open the three-dot menu beside a task name</li>
                <li>
                  Choose{' '}
                  <strong className="font-semibold">Copy to next week</strong>
                </li>
                <li>
                  Use the right arrow above the table to see the next week
                </li>
              </ol>
              <p className="type-help mt-6 text-ink-muted">
                The copy starts with no daily marks. Your original task and its
                marks stay in the week you copied from. Copying is a separate
                action from choosing Delay in a day cell
              </p>
              <GuideFigure
                name="next-week"
                alt="The task menu showing Rename, Copy to next week, and Delete task"
                caption="Continue a task next week while keeping this week's record"
              />
            </section>

            <section id="habits" className={sectionClassName}>
              <h2 className="type-section">Keep habits alongside your tasks</h2>
              <p className="type-lead mt-4 text-ink-muted">
                A row can also hold something you want to do regularly. Add
                “Read for 20 minutes” once, then mark each day you read. Use
                Full done when you meet your intention and Half done when you
                make some progress
              </p>
              <p className="type-lead mt-4 text-ink-muted">
                Choose the days that make sense for you. Leave other days
                without a mark, and copy the row next week if you want to keep
                going. Habit rows count toward the same weekly task limit
              </p>
              <GuideFigure
                name="habit-example"
                alt="A Read for 20 minutes task with completed and partially completed marks on different days"
                caption="One row is enough to follow a habit through the week"
              />
            </section>

            <section id="quick-reference" className={sectionClassName}>
              <h2 className="type-section">A few useful details</h2>
              <div className="mt-6 divide-y divide-rule">
                <details className="py-4">
                  <summary className="type-task cursor-pointer py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4">
                    How do I change weeks?
                  </summary>
                  <p className="type-help pb-2 pt-3 text-ink-muted">
                    Use the left and right arrows above the table, or click the
                    date range to choose a week from the calendar. Today takes
                    you back to the current week
                  </p>
                </details>
                <details className="py-4">
                  <summary className="type-task cursor-pointer py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4">
                    How do I rename a task?
                  </summary>
                  <p className="type-help pb-2 pt-3 text-ink-muted">
                    Open the three-dot menu beside its name and choose Rename.
                    Enter the new name, then press Enter or click outside the
                    field to save. Press Escape to cancel your edit
                  </p>
                </details>
                <details className="py-4">
                  <summary className="type-task cursor-pointer py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4">
                    How do I remove a mark or a task?
                  </summary>
                  <p className="type-help pb-2 pt-3 text-ink-muted">
                    To clear one day, open that cell and choose Delete. To
                    remove the entire task and its marks, open the three-dot
                    menu beside the task name and choose Delete task
                  </p>
                </details>
                <details className="py-4">
                  <summary className="type-task cursor-pointer py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4">
                    Why can&apos;t I add another task?
                  </summary>
                  <p className="type-help pb-2 pt-3 text-ink-muted">
                    When your week has {settingsConfig.maxTasksPerWeek} or more
                    tasks, the add-task field is disabled. Habit rows count too.
                    To add something else, remove a task you no longer need or
                    choose another week
                  </p>
                </details>
              </div>
            </section>

            <div className={sectionClassName}>
              <Button asChild className="h-12 rounded-none px-6">
                <Link to="/">
                  Plan my week
                  <LuArrowRight aria-hidden="true" className="ml-3 size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};
