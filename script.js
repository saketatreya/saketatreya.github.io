document.addEventListener('DOMContentLoaded', () => {
    const checkbox = document.getElementById('checkbox');
    updateTheme(); // Initial theme update based on local storage or system preference

    checkbox.addEventListener('change', function() {
        toggleTheme();
    });

    // Initialize blog functionalities
    initBlogFeatures();

    function updateTheme() {
        const currentTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        document.body.classList.add(currentTheme + '-theme');
        checkbox.checked = (currentTheme === 'dark');
        updateBackgroundVideo(currentTheme);
    }

    function toggleTheme() {
        const isDarkMode = document.body.classList.toggle('dark-theme');
        document.body.classList.toggle('light-theme', !isDarkMode);
        const theme = isDarkMode ? 'dark' : 'light';
        localStorage.setItem('theme', theme);
        updateBackgroundVideo(theme);
    }

    function updateBackgroundVideo(theme) {
        const backgroundVideo = document.getElementById('backgroundVideo');
        if(backgroundVideo) {
            backgroundVideo.src = theme === 'dark' ? 'dark.webm' : 'light.webm';
        }
    }

    function initBlogFeatures() {
        document.querySelectorAll('.blog-title').forEach(blog => {
            blog.addEventListener('click', () => openBlog(blog.getAttribute('data-url')));
        });

        document.querySelectorAll('.like-button').forEach(button => {
            button.addEventListener('click', () => increaseLikes(button.getAttribute('data-blog-id')));
        });

        document.querySelectorAll('.comment-button').forEach(button => {
            button.addEventListener('click', () => {
                const blogId = button.getAttribute('data-blog-id');
                const commentInput = document.querySelector(`#commentInput-${blogId}`);
                addComment(blogId, commentInput.value);
                commentInput.value = '';
            });
        });

        loadBlogStates();
    }

    function openBlog(url) {
        window.open(url, '_blank');
    }

    function increaseLikes(blogId) {
        const currentLikes = parseInt(localStorage.getItem(`${blogId}-likes`) || '0', 10) + 1;
        localStorage.setItem(`${blogId}-likes`, currentLikes.toString());
        document.querySelector(`#${blogId} .likes-count`).innerText = currentLikes;
    }

    function addComment(blogId, comment) {
        if (comment.trim() === '') return;
        const comments = JSON.parse(localStorage.getItem(`${blogId}-comments`) || '[]');
        comments.push(comment);
        localStorage.setItem(`${blogId}-comments`, JSON.stringify(comments));
        updateCommentsDisplay(blogId, comments);
    }

    function loadBlogStates() {
        document.querySelectorAll('.blog').forEach(blog => {
            const blogId = blog.getAttribute('id');
            const likesCount = localStorage.getItem(`${blogId}-likes`) || '0';
            document.querySelector(`#${blogId} .likes-count`).innerText = likesCount;

            const comments = JSON.parse(localStorage.getItem(`${blogId}-comments`) || '[]');
            updateCommentsDisplay(blogId, comments);
        });
    }

    function updateCommentsDisplay(blogId, comments) {
        const commentsList = document.querySelector(`#${blogId} .comments-section`);
        commentsList.innerHTML = ''; // Clear existing comments
        comments.forEach(comment => {
            const commentElement = document.createElement('li');
            commentElement.innerText = comment;
            commentsList.appendChild(commentElement);
        });
    }
});
