const searchBar = document.getElementById('search-bar');
const searchButton = document.getElementById('search-button');
const resultsDiv = document.getElementById('results');

searchButton.addEventListener('click', async () => {
  const userMessage = searchBar.value.trim();
  if (userMessage) {
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: userMessage })
      });
      const data = await response.json();
      resultsDiv.innerHTML = data.message.replace(/\n/g, '<br>');
    } catch (error) {
      console.error(error);
      resultsDiv.innerHTML = 'An error occurred while processing your request.';
    }
  }
});