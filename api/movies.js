export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    try {
        const response = await fetch('https://hindilinks4u.pink/wp-json/wp/v2/posts?per_page=30&_embed', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const posts = await response.json();

        const cleanData = posts.map(post => {
            let rawTitle = post.title?.rendered || 'Untitled';
            let cleanTitle = rawTitle
                .replace(/Hindilinks4u|hindilinks4u\.pink|Watch Online|Full Movie|Hindi Dubbed/gi, '')
                .replace(/&#8211;|&#8217;|&amp;|&#038;/g, '')
                .trim();

            let posterUrl = 'https://via.placeholder.com/150x220?text=No+Poster';
            if (post._embedded && post._embedded['wp:featuredmedia'] && post._embedded['wp:featuredmedia'][0]) {
                posterUrl = post._embedded['wp:featuredmedia'][0].source_url || posterUrl;
            }

            return {
                id: post.id,
                title: cleanTitle,
                poster: posterUrl
            };
        });

        return res.status(200).json({ success: true, items: cleanData });
    } catch (error) {
        return res.status(200).json({
            success: false,
            error: error.message,
            items: []
        });
    }
}
