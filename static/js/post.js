const SUCCESS = 200;
const xhr = new XMLHttpRequest();

class Post {
    constructor() {
        this.BASE_URL = '/posts'
    }

    get(postId, done) {
        xhr.open('GET', `${this.BASE_URL}/${postId}`);
        xhr.onreadystatechange = () => {
            if (xhr.readyState > 3 && xhr.status === SUCCESS) {
                done(JSON.parse(xhr.responseText));
            }
        };
        xhr.send();
    }
    
    getAll(done) {
        xhr.open('GET', this.BASE_URL);
        xhr.onreadystatechange = () => {
            if (xhr.readyState > 3 && xhr.status === SUCCESS) {
                done(JSON.parse(xhr.responseText));
            }
        };
        xhr.send();
    }

    save(data, done) {
        let params = Object.keys(data)
            .map(k => `${k}=${encodeURIComponent(data[k])}`)
            .join('&');

        xhr.open('POST', this.BASE_URL);
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onreadystatechange = () => {
            if (xhr.readyState > 3 && xhr.status === SUCCESS) {
                done(JSON.parse(xhr.responseText));
            }
        };

        xhr.send(params);
    }

    remove(postId, done) {
        xhr.open('DELETE', `${this.BASE_URL}/${postId}`);
        xhr.onreadystatechange = () => {
            if (xhr.readyState > 3 && xhr.status === SUCCESS) {
                done(JSON.parse(xhr.responseText));
            }
        };
        xhr.send();
    }

    update(postId, data, done) {
        let params = Object.keys(data)
            .map(k => `${k}=${encodeURIComponent(data[k])}`)
            .join('&');

        xhr.open('PUT', `${this.BASE_URL}/${postId}`);
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onreadystatechange = () => {
            if (xhr.readyState > 3 && xhr.status === SUCCESS) {
                done(JSON.parse(xhr.responseText));
            }
        };

        xhr.send(params);
    }
}