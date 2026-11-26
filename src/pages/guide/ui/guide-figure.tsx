const screenshotSizes = {
  'week-overview': { width: 580, height: 357 },
  'add-task': { width: 418, height: 64 },
  'choose-status': { width: 208, height: 315 },
  'next-week': { width: 285, height: 184 },
  'habit-example': { width: 484, height: 43 },
};

interface Props {
  name: keyof typeof screenshotSizes;
  alt: string;
  caption: string;
}

const screenshots = import.meta.glob<string>('../assets/*.png', {
  eager: true,
  query: '?url',
  import: 'default',
});

/** Renders an optional guide screenshot when its asset has been supplied */
export const GuideFigure = ({ name, alt, caption }: Props) => {
  const src = screenshots[`../assets/${name}.png`];

  if (!src) return null;

  const { width, height } = screenshotSizes[name];

  return (
    <figure className="mt-8">
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        className="h-auto max-w-full border border-rule"
      />
      <figcaption className="type-help mt-3 text-ink-muted">
        {caption}
      </figcaption>
    </figure>
  );
};
