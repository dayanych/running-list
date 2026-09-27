import { appConfig, routesPaths } from '@/shared/config';

import { LegalPageLayout } from './legal-page-layout';

const UPDATED_AT = 'September 25, 2026';

const contact = appConfig.supportEmail ? (
  <a href={`mailto:${appConfig.supportEmail}`}>{appConfig.supportEmail}</a>
) : (
  'the support address published by Running List'
);

const sections = [
  {
    id: 'accepting-the-terms',
    title: 'Accepting these terms',
    content: (
      <p>
        These Terms of Service govern your use of Running List. By signing in or
        using the service, you agree to these terms and the Privacy Policy. If
        you do not agree, do not use Running List.
      </p>
    ),
  },
  {
    id: 'the-service',
    title: 'The service',
    content: (
      <p>
        Running List is a personal planning tool for organizing weekly tasks and
        recording daily progress. It is provided for general productivity
        purposes and is not professional, medical, financial, or legal advice.
      </p>
    ),
  },
  {
    id: 'accounts',
    title: 'Your account',
    content: (
      <>
        <p>
          You sign in through Google and are responsible for maintaining the
          security of that Google account. You must provide accurate account
          information and be legally permitted to use the service where you
          live.
        </p>
        <p>
          Tell us promptly at {contact} if you believe someone has gained
          unauthorized access to your Running List account.
        </p>
      </>
    ),
  },
  {
    id: 'your-content',
    title: 'Your content',
    content: (
      <>
        <p>
          You retain ownership of the task titles and other content you add. You
          give Running List permission to store, process, and display that
          content only as needed to provide and maintain the service.
        </p>
        <p>
          You are responsible for your content and should not enter information
          that you do not have the right to use or that requires protections
          beyond those described in the Privacy Policy.
        </p>
      </>
    ),
  },
  {
    id: 'acceptable-use',
    title: 'Acceptable use',
    content: (
      <>
        <p>You must not:</p>
        <ul>
          <li>use Running List for unlawful, harmful, or abusive activity;</li>
          <li>
            interfere with the service, probe its security, or attempt to access
            another user&apos;s account or data;
          </li>
          <li>
            automate requests in a way that places an unreasonable load on the
            service;
          </li>
          <li>
            copy, reverse engineer, or misuse the service except where
            applicable law expressly permits it.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'availability-and-changes',
    title: 'Availability and changes',
    content: (
      <p>
        Running List may change, experience interruptions, or become
        unavailable. We may add or remove functionality, suspend the service for
        maintenance or security, or discontinue it. When practical, we will
        provide reasonable notice of material changes that affect access to
        saved content.
      </p>
    ),
  },
  {
    id: 'ending-use',
    title: 'Ending use',
    content: (
      <>
        <p>
          You may stop using Running List at any time. To request deletion of
          your account and associated content, email {contact}.
        </p>
        <p>
          We may restrict or terminate access when reasonably necessary to
          prevent abuse, protect the service or other people, comply with law,
          or address a material violation of these terms.
        </p>
      </>
    ),
  },
  {
    id: 'disclaimers-and-liability',
    title: 'Disclaimers and liability',
    content: (
      <>
        <p>
          Running List is provided “as is” and “as available.” To the extent
          permitted by law, we disclaim implied warranties, including warranties
          of merchantability, fitness for a particular purpose, and
          non-infringement. We do not promise that the service will always be
          available, error-free, or that stored content will never be lost.
        </p>
        <p>
          To the extent permitted by law, Running List and its operator will not
          be liable for indirect, incidental, special, consequential, or
          punitive damages, or for loss of data, use, or opportunity arising
          from use of the service. Rights that cannot legally be limited remain
          unaffected.
        </p>
      </>
    ),
  },
  {
    id: 'changes-and-contact',
    title: 'Changes and contact',
    content: (
      <>
        <p>
          We may update these terms as the service changes. The effective date
          at the top identifies the current version. Continued use after an
          updated version takes effect means you accept the revised terms.
        </p>
        <p>Questions about these terms can be sent to {contact}.</p>
      </>
    ),
  },
];

/** Presents the public Running List terms of service */
export const TermsPage = () => (
  <LegalPageLayout
    title="Terms of Service"
    summary="These terms describe the rules for using Running List and what you can expect from the service."
    updatedAt={UPDATED_AT}
    sections={sections}
    relatedLabel="Privacy Policy"
    relatedPath={`/${routesPaths.privacy}`}
  />
);
