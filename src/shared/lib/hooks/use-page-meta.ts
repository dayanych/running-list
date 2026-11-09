import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { appConfig } from '@/shared/config';

import { getCanonicalUrl } from '../get-canonical-url';

interface PageMeta {
  title: string;
  description?: string;
  noindex?: boolean;
}

/**
 * Sets a value on a head tag, creating the tag when it is missing
 *
 * @param tagName - Name of the head tag
 * @param key - Attribute and value that identify the tag
 * @param valueAttribute - Attribute that receives the value
 * @param value - Value to apply
 * @returns Function that restores the previous state of the head
 */
const applyHeadTag = (
  tagName: 'link' | 'meta',
  [keyAttribute, keyValue]: [string, string],
  valueAttribute: string,
  value: string,
) => {
  const existing = document.head.querySelector(
    `${tagName}[${keyAttribute}="${keyValue}"]`,
  );
  const element = existing ?? document.createElement(tagName);
  const previousValue = element.getAttribute(valueAttribute);

  element.setAttribute(keyAttribute, keyValue);
  element.setAttribute(valueAttribute, value);

  if (!existing) document.head.append(element);

  return () => {
    if (!existing || previousValue === null) {
      element.remove();
      return;
    }

    element.setAttribute(valueAttribute, previousValue);
  };
};

/**
 * Applies search metadata for the current page while it is mounted
 *
 * @param meta - Title, description, and indexing rule of the page
 */
export const usePageMeta = ({
  title,
  description,
  noindex = false,
}: PageMeta) => {
  const { pathname } = useLocation();

  useEffect(() => {
    const previousTitle = document.title;
    const canonicalUrl = noindex
      ? null
      : getCanonicalUrl(appConfig.appUrl, pathname);
    const restoreHead = [
      description
        ? applyHeadTag('meta', ['name', 'description'], 'content', description)
        : null,
      canonicalUrl
        ? applyHeadTag('link', ['rel', 'canonical'], 'href', canonicalUrl)
        : null,
      noindex
        ? applyHeadTag('meta', ['name', 'robots'], 'content', 'noindex')
        : null,
    ];

    document.title = title;

    return () => {
      document.title = previousTitle;
      restoreHead.forEach((restore) => restore?.());
    };
  }, [title, description, noindex, pathname]);
};
