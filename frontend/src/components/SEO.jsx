// src/components/SEO.jsx

import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, name, type, imageUrl, url, keywords, author, personSchema }) => {
  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{title}</title>
      <meta name='description' content={description} />
      <meta name='keywords' content={keywords} />
      <meta name='author' content={author} />
      <link rel='canonical' href={url} />

      {/* Open Graph / Facebook tags */}
      <meta property='og:type' content={type} />
      <meta property='og:title' content={title} />
      <meta property='og:description' content={description} />
      <meta property='og:site_name' content={name} />
      <meta property='og:url' content={url} />
      <meta property='og:image' content={imageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />


      {/* Twitter tags */}
      <meta name='twitter:card' content='summary_large_image' />
      <meta name='twitter:creator' content={name} />
      <meta name='twitter:title' content={title} />
      <meta name='twitter:description' content={description} />
      <meta name='twitter:image' content={imageUrl} />

      {/* JSON-LD Structured Data */}
      {personSchema && (
        <script type="application/ld+json">
          {JSON.stringify(personSchema)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;