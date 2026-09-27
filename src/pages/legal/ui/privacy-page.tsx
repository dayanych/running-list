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
    id: 'information-we-collect',
    title: 'Information we collect',
    content: (
      <>
        <p>Running List processes only the information needed to operate.</p>
        <ul>
          <li>
            <strong className="font-semibold text-foreground">
              Google account information.
            </strong>{' '}
            When you sign in with Google, we receive your Google account
            identifier, name, and email address. We never receive your Google
            password and do not request access to Google Drive, Calendar,
            contacts, or email.
          </li>
          <li>
            <strong className="font-semibold text-foreground">
              Content you create.
            </strong>{' '}
            We store task titles, task colors and order, the weeks associated
            with tasks, and the daily progress marks you choose.
          </li>
          <li>
            <strong className="font-semibold text-foreground">
              Technical information.
            </strong>{' '}
            Our hosting and database providers may process routine request
            information such as IP address, browser details, and timestamps for
            security, reliability, and troubleshooting. Your browser stores the
            session information needed to keep you signed in.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'how-we-use-information',
    title: 'How we use information',
    content: (
      <>
        <p>We use your information to:</p>
        <ul>
          <li>authenticate your account and keep it secure;</li>
          <li>save, display, and synchronize your weekly tasks and marks;</li>
          <li>respond to support and data-rights requests;</li>
          <li>maintain, troubleshoot, and protect Running List.</li>
        </ul>
        <p>
          We do not sell or rent personal information. Running List does not use
          your tasks for advertising and does not include third-party
          advertising trackers.
        </p>
      </>
    ),
  },
  {
    id: 'service-providers',
    title: 'Service providers',
    content: (
      <>
        <p>
          Running List relies on a small number of service providers that
          process information on our behalf:
        </p>
        <ul>
          <li>
            <a href="https://policies.google.com/privacy">Google</a> provides
            account sign-in.
          </li>
          <li>
            <a href="https://supabase.com/privacy">Supabase</a> provides
            authentication and database hosting.
          </li>
          <li>
            <a href="https://vercel.com/legal/privacy-notice">Vercel</a>{' '}
            provides application hosting and delivery.
          </li>
        </ul>
        <p>
          We may also disclose information when required by law or when
          reasonably necessary to protect users, Running List, or the public. We
          do not share personal information with third parties for their own
          marketing.
        </p>
      </>
    ),
  },
  {
    id: 'retention-and-control',
    title: 'Retention and your choices',
    content: (
      <>
        <p>
          We keep account information and saved content while your account is
          active or as needed to provide Running List. You can edit or delete
          tasks and daily marks in the application.
        </p>
        <p>
          To request a copy of your information, correct account information, or
          delete your account and its associated content, email {contact}. We
          may need to verify that the request comes from the account owner.
          Limited information may remain temporarily in backups, security
          records, or logs when required for legitimate operational or legal
          reasons.
        </p>
      </>
    ),
  },
  {
    id: 'security-and-transfers',
    title: 'Security and data location',
    content: (
      <>
        <p>
          We use access controls and the security features provided by Google,
          Supabase, and Vercel to protect information. No online service can
          guarantee absolute security, so please contact us if you believe your
          account has been compromised.
        </p>
        <p>
          These providers may process information in countries other than the
          one where you live. Their privacy notices explain the safeguards they
          apply to international data transfers.
        </p>
      </>
    ),
  },
  {
    id: 'children',
    title: 'Children',
    content: (
      <p>
        Running List is not directed to children under 13, and we do not
        knowingly collect personal information from children under 13. If you
        believe a child has provided personal information, email {contact} so we
        can review and remove it.
      </p>
    ),
  },
  {
    id: 'changes-and-contact',
    title: 'Changes and contact',
    content: (
      <>
        <p>
          We may update this policy when Running List or its service providers
          change. The effective date at the top of this page identifies the
          current version. Material changes will be communicated in a reasonable
          way before they take effect when required.
        </p>
        <p>Questions or privacy requests can be sent to {contact}.</p>
      </>
    ),
  },
];

/** Presents the public Running List privacy policy */
export const PrivacyPage = () => (
  <LegalPageLayout
    title="Privacy Policy"
    summary="This policy explains what Running List collects, why it is needed, and the choices you have about your information."
    updatedAt={UPDATED_AT}
    sections={sections}
    relatedLabel="Terms of Service"
    relatedPath={`/${routesPaths.terms}`}
  />
);
