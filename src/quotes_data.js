// TypeScript-like interface for Quote type (for documentation)
/**
 * @typedef {Object} Quote
 * @property {string} quote - The quote text
 * @property {string} author - The author of the quote
 * @property {number} likes - Number of likes
 */

/**
 * Load quotes from a CSV file using functional programming principles.
 * Returns a Promise that resolves to an array of Quote objects.
 * @param {string} filePath - Path to the CSV file
 * @returns {Promise<Quote[]>}
 */
async function loadQuotesFromCsv(filePath = "/data.csv") {
    console.log('Attempting to load quotes from:', filePath); // Debug log
    try {
        const response = await fetch(filePath);
        console.log('Fetch response:', response.status, response.statusText); // Debug log
        
        if (!response.ok) {
            console.warn(`HTTP error! status: ${response.status}`); // Debug log
            throw new Error(`Failed to load quotes (HTTP ${response.status})`);
        }
        
        const csvText = await response.text();
        console.log('CSV text loaded, length:', csvText.length); // Debug log
        
        if (!csvText.trim()) {
            throw new Error('CSV file is empty');
        }

        const quotes = parseCsvToQuotes(csvText);
        console.log('Successfully parsed quotes:', quotes.length); // Debug log
        return quotes;
    } catch (error) {
        console.warn(
            `Warning: ${filePath} not found or couldn't be loaded. Using default quotes.`,
            error
        );
        // Return default quotes if CSV loading fails
        return [
            {
                quote: "Be yourself; everyone else is already taken.",
                author: "Oscar Wilde",
                likes: 149270,
            },
            {
                quote: "Be the change that you wish to see in the world.",
                author: "Mahatma Gandhi",
                likes: 106749,
            },
            {
                quote: "The only way to do great work is to love what you do.",
                author: "Steve Jobs",
                likes: 98520,
            },
            {
                quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
                author: "Winston Churchill",
                likes: 87654,
            },
            {
                quote: "Life is what happens when you're busy making other plans.",
                author: "John Lennon",
                likes: 76543,
            }
        ];
    }
}

/**
 * Parse CSV text into an array of Quote objects
 * @param {string} csvText - Raw CSV text
 * @returns {Quote[]}
 */
function parseCsvToQuotes(csvText) {
    console.log('Starting CSV parsing...'); // Debug log
    try {
        const lines = csvText.trim().split("\n");
        console.log('Number of lines:', lines.length); // Debug log
        
        if (lines.length < 2) {
            throw new Error('CSV file has insufficient data');
        }

        const headers = lines[0].split(",");
        console.log('CSV headers:', headers); // Debug log

        const quotes = lines
            .slice(1)
            .filter((line) => line.trim())
            .map((line) => {
                const values = line.split(",");
                return {
                    quote: values[1]?.replace(/^"|"$/g, "").trim() || "Missing quote",
                    author: values[2]?.replace(/^"|"$/g, "").replace(/,/g, "").trim() || "Unknown",
                    likes: parseInt(values[4], 10) || 0,
                };
            });

        console.log('Successfully parsed quotes:', quotes.length); // Debug log
        return quotes;
    } catch (error) {
        console.error('Error parsing CSV:', error); // Debug log
        throw new Error(`Failed to parse CSV: ${error.message}`);
    }
}

/**
 * Sort quotes by the specified field
 * @param {Quote[]} quotes - Array of quotes to sort
 * @param {string} sortBy - Field to sort by
 * @param {boolean} reverse - Whether to reverse the sort order
 * @returns {Quote[]}
 */
function getSortedQuotes(quotes, sortBy = "likes", reverse = true) {
    if (!quotes || quotes.length === 0) {
        return [];
    }

    const sortedQuotes = [...quotes].sort((a, b) => {
        if (typeof a[sortBy] === "string") {
            return a[sortBy].localeCompare(b[sortBy]);
        }
        return a[sortBy] - b[sortBy];
    });

    return reverse ? sortedQuotes.reverse() : sortedQuotes;
}

// Export the functions for use in other modules
export { loadQuotesFromCsv, getSortedQuotes };