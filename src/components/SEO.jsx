import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, name, type, image, url }) => {

    // Defaults
    const defaultTitle = "ForexVolcano - Predict the Eruption";
    const defaultDescription = "Your premier source for professional Forex analysis, breaking market news, and comprehensive trading education.";
    const defaultImage = "https://images.unsplash.com/photo-1611974765270-ca12586343bb?q=80&w=1200";
    const siteUrl = "https://forexvolcano.com"; // Replace with actual domain if different

    const fullTitle = title ? `${title} | ForexVolcano` : defaultTitle;
    const metaDescription = description || defaultDescription;
    const metaImage = image || defaultImage;
    const metaUrl = url ? `${siteUrl}${url}` : siteUrl;

    return (
        <Helmet>
            {/* Standard metadata tags */}
            <title>{fullTitle}</title>
            <meta name='description' content={metaDescription} />

            {/* Facebook tags */}
            <meta property="og:type" content={type || 'website'} />
            <meta property="og:title" content={title || defaultTitle} />
            <meta property="og:description" content={metaDescription} />
            <meta property="og:image" content={metaImage} />
            <meta property="og:url" content={metaUrl} />

            {/* Twitter tags */}
            <meta name="twitter:creator" content={name || "ForexVolcano"} />
            <meta name="twitter:card" content={type === 'article' ? 'summary_large_image' : 'summary'} />
            <meta name="twitter:title" content={title || defaultTitle} />
            <meta name="twitter:description" content={metaDescription} />
            <meta name='twitter:image' content={metaImage} />
        </Helmet>
    );
}

export default SEO;
