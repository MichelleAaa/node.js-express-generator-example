const express = require('express');
const Blog = require('../models/blog');

const blogRouter = express.Router();

blogRouter.route('/')
.get((req, res, next) => {
    Blog.find()
    .then(posts => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(posts);
    })
    .catch(err => next(err));
})
.post((req, res, next) => {
    Blog.create(req.body)
    .then(post => {
        console.log('Post Created ', post);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(post);
    })
    .catch(err => next(err));
})
.put((req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /blog');
})
.delete((req, res, next) => {
    Blog.deleteMany()
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

blogRouter.route('/:postId')
.get((req, res, next) => {
    Blog.findById(req.params.blogId)
    .then(post => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(post);
    })
    .catch(err => next(err));
})
.post((req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /blog/${req.params.postId}`);
})
.put((req, res, next) => {
    Blog.findByIdAndUpdate(req.params.blogId, {
        $set: req.body
    }, { new: true })
    .then(post => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(post);
    })
    .catch(err => next(err));
})
.delete((req, res, next) => {
    Blog.findByIdAndDelete(req.params.blogId)
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

blogRouter.route('/:blogId/comments')
.get((req, res, next) => {
    Blog.findById(req.params.blogId)
    .then(post => {
        if (post) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(post.comments);
        } else {
            err = new Error(`Post ${req.params.blogId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
})
.post((req, res, next) => {
    Blog.findById(req.params.blogId)
    .then(post => {
        if (post) {
            post.comments.push(req.body);
            post.save()
            .then(post => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(post);
            })
            .catch(err => next(err));
        } else {
            err = new Error(`Post ${req.params.blogId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
})
.put((req, res) => {
    res.statusCode = 403;
    res.end(`PUT operation not supported on /blog/${req.params.blogId}/comments`);
})
.delete((req, res, next) => {
    Blog.findById(req.params.blogId)
    .then(post => {
        if (post) {
            for (let i = (post.comments.length-1); i >= 0; i--) {
                post.comments.id(post.comments[i]._id).remove();
            }
            post.save()
            .then(post => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(post);
            })
            .catch(err => next(err));
        } else {
            err = new Error(`Post ${req.params.blogId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
});

// campsiteRouter.route('/:campsiteId/comments/:commentId')
// .get((req, res, next) => {
//     Campsite.findById(req.params.campsiteId)
//     .then(campsite => {
//         if (campsite && campsite.comments.id(req.params.commentId)) {
//             res.statusCode = 200;
//             res.setHeader('Content-Type', 'application/json');
//             res.json(campsite.comments.id(req.params.commentId));
//         } else if (!campsite) {
//             err = new Error(`Campsite ${req.params.campsiteId} not found`);
//             err.status = 404;
//             return next(err);
//         } else {
//             err = new Error(`Comment ${req.params.commentId} not found`);
//             err.status = 404;
//             return next(err);
//         }
//     })
//     .catch(err => next(err));
// })
// .post((req, res) => {
//     res.statusCode = 403;
//     res.end(`POST operation not supported on /campsites/${req.params.campsiteId}/comments/${req.params.commentId}`);
// })
// .put((req, res, next) => {
//     Campsite.findById(req.params.campsiteId)
//     .then(campsite => {
//         if (campsite && campsite.comments.id(req.params.commentId)) {
//             if (req.body.rating) {
//                 campsite.comments.id(req.params.commentId).rating = req.body.rating;
//             }
//             if (req.body.text) {
//                 campsite.comments.id(req.params.commentId).text = req.body.text;
//             }
//             campsite.save()
//             .then(campsite => {
//                 res.statusCode = 200;
//                 res.setHeader('Content-Type', 'application/json');
//                 res.json(campsite);
//             })
//             .catch(err => next(err));
//         } else if (!campsite) {
//             err = new Error(`Campsite ${req.params.campsiteId} not found`);
//             err.status = 404;
//             return next(err);
//         } else {
//             err = new Error(`Comment ${req.params.commentId} not found`);
//             err.status = 404;
//             return next(err);
//         }
//     })
//     .catch(err => next(err));
// })
// .delete((req, res, next) => {
//     Campsite.findById(req.params.campsiteId)
//     .then(campsite => {
//         if (campsite && campsite.comments.id(req.params.commentId)) {
//             campsite.comments.id(req.params.commentId).remove();
//             campsite.save()
//             .then(campsite => {
//                 res.statusCode = 200;
//                 res.setHeader('Content-Type', 'application/json');
//                 res.json(campsite);
//             })
//             .catch(err => next(err));
//         } else if (!campsite) {
//             err = new Error(`Campsite ${req.params.campsiteId} not found`);
//             err.status = 404;
//             return next(err);
//         } else {
//             err = new Error(`Comment ${req.params.commentId} not found`);
//             err.status = 404;
//             return next(err);
//         }
//     })
//     .catch(err => next(err));
// });

module.exports = blogRouter;