document.addEventListener("DOMContentLoaded", function() {
    const bookUrl = 'http://localhost:3000/books';
    const currentUser = { "id": 1, "username": "pouros" }; // Example current user
    
    function fetchBooks() {
        fetch(bookUrl)
        .then(response => response.json())
        .then(books => {
            const list = document.getElementById('list');
            list.innerHTML = '';
            books.forEach(book => {
                const li = document.createElement('li');
                li.textContent = book.title;
                li.addEventListener('click', () => showBookDetails(book));
                list.appendChild(li);
            });
        });
    }

    function showBookDetails(book) {
        const showPanel = document.getElementById('show-panel');
        showPanel.innerHTML = `
            <h2>${book.title}</h2>
            <img src="${book.img_url}" alt="${book.title}">
            <p>${book.description}</p>
            <ul id="user-list">
                ${book.users.map(user => `<li>${user.username}</li>`).join('')}
            </ul>
            <button id="like-button">${book.users.some(user => user.id === currentUser.id) ? 'Unlike' : 'Like'}</button>
        `;

        document.getElementById('like-button').addEventListener('click', () => toggleLike(book));
    }

    function toggleLike(book) {
        const userList = document.getElementById('user-list');
        const likeButton = document.getElementById('like-button');
        let updatedUsers;

        if (book.users.some(user => user.id === currentUser.id)) {
            updatedUsers = book.users.filter(user => user.id !== currentUser.id);
            likeButton.textContent = 'Like';
        } else {
            updatedUsers = [...book.users, currentUser];
            likeButton.textContent = 'Unlike';
        }

        fetch(`${bookUrl}/${book.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ users: updatedUsers })
        })
        .then(response => response.json())
        .then(updatedBook => {
            book.users = updatedBook.users;
            userList.innerHTML = updatedBook.users.map(user => `<li>${user.username}</li>`).join('');
        });
    }

    fetchBooks();
});
