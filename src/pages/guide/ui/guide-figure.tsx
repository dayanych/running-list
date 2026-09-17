type GuideFigureName =
  | 'week-overview'
  | 'add-task'
  | 'choose-status'
  | 'next-week'
  | 'habit-example';

interface Props {
  name: GuideFigureName;
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

  return (
    <figure className="mt-8">
      <img
        src={src}
        alt={alt}
        width={1440}
        height={900}
        loading="lazy"
        decoding="async"
        className="h-auto w-full border border-rule"
      />
      <figcaption className="type-help mt-3 text-ink-muted">
        {caption}
      </figcaption>
    </figure>
  );
};
