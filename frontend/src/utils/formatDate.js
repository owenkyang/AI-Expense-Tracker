export function formatDate(timestamp) {
	const date = new Date(parseInt(timestamp)); // Parse the timestamp to ensure it's an integer representing milliseconds

	const day = date.getUTCDate().toString().padStart(2, '0');
	const month = date.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' });
	const year = date.getUTCFullYear();

	return `${month} ${day} ${year}`;
}

// Example usage:
const timestamp = 1704067200000;
const formattedDate = formatDate(timestamp);
console.log(formattedDate); // Output: "12 Dec 2023"