export function matchesSearch(searchQuery, candidate) {
    return candidate.toLowerCase().includes(searchQuery.toLowerCase());
}
