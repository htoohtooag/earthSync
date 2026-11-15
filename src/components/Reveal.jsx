/** A masked headline line. The inner span rises into view on scroll. */
export default function Reveal({ children, as: Tag = 'span' }) {
  return (
    <Tag className="reveal">
      <Tag className="rv">{children}</Tag>
    </Tag>
  );
}
