import {
  type Article,
  articleKindLabels,
  formatArticleDate,
} from "../../lib/content";
import notesStyles from "./notes.module.css";

type Props = {
  article: Article;
};

export const NoteArticleHeader = ({ article }: Props) => {
  return (
    <>
      <div className={notesStyles.noteMeta}>
        <time dateTime={article.publishedAt}>
          {formatArticleDate(article.publishedAt)}
        </time>
        <span className={notesStyles.noteType}>
          {articleKindLabels[article.kind]}
        </span>
      </div>
      <h1>{article.title}</h1>
    </>
  );
};
