/* eslint-disable @next/next/no-img-element */
import type { ArticleBlock } from "../../lib/content";
import styles from "./article.module.css";

type Props = {
  blocks: ArticleBlock[];
};

export const ArticleContent = ({ blocks }: Props) => {
  return (
    <div className={styles.articleContent}>
      {blocks.map((block, index) => {
        const key = `${block.kind}-${index}`;

        if (block.kind === "heading") {
          const Tag = `h${block.level}` as "h1" | "h2" | "h3";
          return <Tag key={key}>{block.text}</Tag>;
        }

        if (block.kind === "list") {
          return (
            <ul key={key}>
              {block.items.map((item, itemIndex) => (
                <li key={`${index}-${itemIndex}`}>{item}</li>
              ))}
            </ul>
          );
        }

        if (block.kind === "quote") {
          return <blockquote key={key}>{block.text}</blockquote>;
        }

        if (block.kind === "code") {
          return (
            <pre key={key}>
              <code>{block.code}</code>
            </pre>
          );
        }

        if (block.kind === "image") {
          return (
            <figure key={key}>
              <img
                alt={block.asset.alt}
                height={block.asset.height}
                src={block.asset.src}
                width={block.asset.width}
              />
              {block.caption && <figcaption>{block.caption}</figcaption>}
            </figure>
          );
        }

        if (block.kind === "callout") {
          return (
            <aside className={styles.callout} data-tone={block.tone} key={key}>
              {block.text}
            </aside>
          );
        }

        if (block.kind === "linkCard") {
          return (
            <a
              className={styles.linkCard}
              href={block.url}
              key={key}
              rel="noopener noreferrer"
              target="_blank"
            >
              <strong>{block.title}</strong>
              {block.description && <span>{block.description}</span>}
            </a>
          );
        }

        if (block.kind === "gallery") {
          return (
            <div className={styles.gallery} key={key}>
              {block.images.map((image) => (
                <img
                  alt={image.alt}
                  height={image.height}
                  key={image.id}
                  src={image.src}
                  width={image.width}
                />
              ))}
            </div>
          );
        }

        return <p key={key}>{block.text}</p>;
      })}
    </div>
  );
};
