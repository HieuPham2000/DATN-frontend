import rehypeRaw from 'rehype-raw';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';

export default function Markdown({ ...param }) {
    return <ReactMarkdown rehypePlugins={[rehypeRaw]} {...param} />;
}
