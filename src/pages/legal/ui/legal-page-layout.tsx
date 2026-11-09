import { ReactNode, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';

import { routesPaths } from '@/shared/config';
import { usePageMeta } from '@/shared/lib';
import { Button, Footer, PageHeader } from '@/shared/ui';

interface LegalSection {
  id: string;
  title: string;
  content: ReactNode;
}

interface LegalPageLayoutProps {
  title: string;
  summary: string;
  updatedAt: string;
  sections: LegalSection[];
  relatedLabel: string;
  relatedPath: string;
}

const sectionClassName = 'scroll-mt-8 border-t border-rule pt-10 sm:pt-12';

/** Renders a public legal document with consistent reading navigation */
export const LegalPageLayout = ({
  title,
  summary,
  updatedAt,
  sections,
  relatedLabel,
  relatedPath,
}: LegalPageLayoutProps) => {
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [title]);

  usePageMeta({ title: `${title} | Running List`, description: summary });

  return (
    <>
      <a
        href="#legal-content"
        className="sr-only z-10 bg-background p-4 text-foreground focus:not-sr-only focus:absolute focus:left-4 focus:top-4"
      >
        Skip to document
      </a>
      <PageHeader>
        <Button asChild variant="outline" className="h-11 rounded-none">
          <Link to={`/${routesPaths.guide}`}>Read the guide</Link>
        </Button>
      </PageHeader>

      <main
        id="legal-content"
        tabIndex={-1}
        className="container pb-16 pt-12 focus:outline-none sm:pb-24 sm:pt-20"
      >
        <header className="max-w-3xl">
          <h1 className="type-hero max-w-2xl text-balance">{title}</h1>
          <p className="type-lead mt-6 max-w-2xl text-ink-muted">{summary}</p>
          <p className="type-meta mt-5 text-ink-muted">Effective {updatedAt}</p>
        </header>

        <div className="mt-12 grid items-start gap-12 sm:mt-16 lg:grid-cols-[12rem_minmax(0,1fr)] lg:gap-16">
          <nav aria-label={`${title} sections`} className="lg:sticky lg:top-8">
            <p className="type-ui mb-3">On this page</p>
            <ul className="grid gap-1 sm:grid-cols-2 lg:grid-cols-1">
              {sections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="type-help flex min-h-11 items-center text-ink-muted underline-offset-4 hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4"
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <article className="min-w-0 max-w-2xl space-y-12 sm:space-y-16">
            {sections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className={sectionClassName}
              >
                <h2 className="type-section">{section.title}</h2>
                <div className="type-lead mt-4 space-y-4 text-ink-muted [&_a:focus-visible]:rounded-sm [&_a:focus-visible]:outline-none [&_a:focus-visible]:ring-2 [&_a:focus-visible]:ring-ring [&_a:focus-visible]:ring-offset-2 [&_a:hover]:text-foreground [&_a]:underline [&_a]:decoration-border [&_a]:underline-offset-4 [&_a]:transition-colors [&_li]:pl-1 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
                  {section.content}
                </div>
              </section>
            ))}

            <nav
              aria-label="Related legal document"
              className={`${sectionClassName} type-help flex flex-wrap items-center gap-x-6 gap-y-3 text-ink-muted`}
            >
              <Link
                to={`/${routesPaths.guide}`}
                className="min-h-11 content-center underline decoration-border underline-offset-4 transition-colors hover:text-foreground focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Guide
              </Link>
              <Link
                to={relatedPath}
                className="min-h-11 content-center underline decoration-border underline-offset-4 transition-colors hover:text-foreground focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {relatedLabel}
              </Link>
            </nav>
          </article>
        </div>
      </main>

      <Footer />
    </>
  );
};
