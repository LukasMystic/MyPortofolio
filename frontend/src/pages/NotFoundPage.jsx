import SEO from '../components/SEO';
import { Page, Button } from '../components/ui';

const NotFoundPage = () => (
  <Page className="text-center">
    <SEO title="Page not found | Stanley Pratama Teguh" description="This page doesn’t exist." />
    <p className="mt-16 text-subhead font-semibold text-label2">404</p>
    <h1 className="mt-1 text-large-title font-bold">This page doesn’t exist.</h1>
    <p className="mx-auto mt-2 max-w-reading text-body text-label2">The link may be old, or the page may have moved.</p>
    <div className="mt-7 flex flex-wrap justify-center gap-3">
      <Button to="/">Go home</Button>
      <Button to="/projects" variant="gray">See my work</Button>
    </div>
  </Page>
);

export default NotFoundPage;
