document.addEventListener('DOMContentLoaded', () => {
    const checkbox = document.getElementById('checkbox');
    updateTheme(); // Initial theme update based on local storage or system preference
    loadBlogStates();

    checkbox.addEventListener('change', function() {
        document.body.classList.toggle('dark-theme');
        document.body.classList.toggle('light-theme');
        const theme = this.checked ? 'dark' : 'light';
        localStorage.setItem('theme', theme);
        updateBackgroundVideo(theme);
        updateBackgroundImage(); // If you're using background images as well
    });

    function updateTheme() {
        const currentTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        document.body.classList.add(currentTheme + '-theme');
        checkbox.checked = (currentTheme === 'dark');
        updateBackgroundVideo(currentTheme);
    }

    function updateBackgroundVideo(theme) {
        const backgroundVideo = document.getElementById('backgroundVideo');
        backgroundVideo.src = theme === 'dark' ? 'dark.webm' : 'light.webm';
    }


    blogs.forEach(blog => {
        blog.addEventListener('click', () => {
            window.open(blog.getAttribute('data-url'), '_blank');
        });
    });

    document.querySelectorAll('.like-button').forEach(button => {
        button.addEventListener('click', () => {
            const blogId = button.getAttribute('data-blog-id');
            increaseLikes(blogId);
        });
    });

    document.querySelectorAll('.comment-button').forEach(button => {
        button.addEventListener('click', () => {
            const blogId = button.getAttribute('data-blog-id');
            const commentInput = document.querySelector(`#commentInput-${blogId}`);
            addComment(blogId, commentInput.value);
            commentInput.value = '';
        });
    });


    function loadBlogStates() {
        document.querySelectorAll('.blog').forEach(blog => {
            const blogId = blog.getAttribute('id');
            const likesCount = localStorage.getItem(`${blogId}-likes`) || 0;
            document.querySelector(`#${blogId} .likes-count`).innerText = likesCount;

            const commentsList = document.querySelector(`#${blogId} .comments-section`);
            const comments = JSON.parse(localStorage.getItem(`${blogId}-comments`) || '[]');
            comments.forEach(comment => {
                const commentElement = document.createElement('li');
                commentElement.innerText = comment;
                commentsList.appendChild(commentElement);
            });
        });
    }

    function increaseLikes(blogId) {
        const currentLikes = parseInt(localStorage.getItem(`${blogId}-likes`) || 0) + 1;
        localStorage.setItem(`${blogId}-likes`, currentLikes);
        document.querySelector(`#${blogId} .likes-count`).innerText = currentLikes;
    }

    function addComment(blogId, comment) {
        if (!comment.trim()) return;
        const comments = JSON.parse(localStorage.getItem(`${blogId}-comments`) || '[]');
        comments.push(comment);
        localStorage.setItem(`${blogId}-comments`, JSON.stringify(comments));

        const commentsList = document.querySelector(`#${blogId} .comments-section`);
        const commentElement = document.createElement('li');
        commentElement.innerText = comment;
        commentsList.appendChild(commentElement);
    }
});
