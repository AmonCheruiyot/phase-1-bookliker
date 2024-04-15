document.addEventListener('DOMContentLoaded', () => {
    const listPanel = document.getElementById('list-panel');
    const showPanel = document.getElementById('show-panel');

    // Fetch books from the API and display them
    function fetchBooks() {
        fetch('http://localhost:3000/books')
            .then(response => response.json())
            .then(books => {
                books.forEach(book => {
                    const listItem = document.createElement('li');
                    listItem.textContent = book.title;
                    listItem.addEventListener('click', () => {
                        fetchBookDetails(book.id);
                    });
                    listPanel.appendChild(listItem);
                });
            })
            .catch(error => console.error('Error fetching books:', error));
    }

    // Fetch book details by ID and display them
    function fetchBookDetails(bookId) {
        fetch(`http://localhost:3000/books/${bookId}`)
            .then(response => response.json())
            .then(book => {
                showPanel.innerHTML = `
                    <h2>${book.title}</h2>
                    <p>${book.description}</p>
                    <img src="${book.img_url}" alt="${book.title}">
                    <button id="like-button">Like</button>
                    <ul id="liked-by"></ul>
                `;
                const likeButton = document.getElementById('like-button');
                likeButton.addEventListener('click', () => {
                    likeBook(bookId);
                });
                const likedBy = document.getElementById('liked-by');
                book.users.forEach(user => {
                    const userItem = document.createElement('li');
                    userItem.textContent = user.username;
                    likedBy.appendChild(userItem);
                });
            })
            .catch(error => console.error('Error fetching book details:', error));
    }

    // Like a book
    function likeBook(bookId) {
        const userId = 1; // Assuming the user is already logged in
        fetch(`http://localhost:3000/books/${bookId}`)
            .then(response => response.json())
            .then(book => {
                const alreadyLiked = book.users.some(user => user.id === userId);
                if (!alreadyLiked) {
                    const updatedUsers = [...book.users, { id: userId }];
                    fetch(`http://localhost:3000/books/${bookId}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ users: updatedUsers })
                    })
                    .then(() => {
                        fetchBookDetails(bookId);
                    })
                    .catch(error => console.error('Error liking book:', error));
                } else {
                    console.log('You have already liked this book.');
                }
            })
            .catch(error => console.error('Error checking if book is already liked:', error));
    }

    // Initial fetch of books
    fetchBooks();
});
