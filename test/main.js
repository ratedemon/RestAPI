import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../src/index';
import db from '../src/db';
import User from '../src/model/user';
import Post from '../src/model/post';

const should = chai.should();

chai.use(chaiHttp);

let token = '';
let user_id = 0;

describe('User', () => {
    before('DB clear', (done) => {
        User.destroy({
            where: {
                $or: [
                    {
                        email: {
                            $eq: "test@test.com"
                        }
                    },
                    {
                        email: {
                            $eq: "user@gmail.com"
                        }
                    }
                ]
            }
        }).then((res) => {
            done();
        }).catch(err => console.log("Error", err));
    });

    describe('/POST register user', () => {
        it('it should create a user', (done) => {
            const user = {
                name: "Test Test",
                email: "test@test.com",
                password: "123456",
                phone: "+380999999999"
            };
            chai.request(server).post('/api/register').send(user).end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('token');
                res.body.should.be.a('object');
                res.body.token.should.be.a('string');
                token = res.body.token;
                done();
            });
        });
    });

    describe('/POST login user', () => {
        it('it should login user', (done) => {
            const user = {
                email: "test@test.com",
                password: "123456"
            };
            chai.request(server).post('/api/login').send(user).end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('token');
                res.body.token.should.be.a('string');
                token = res.body.token;
                done();
            });
        });
    });

    describe('/GET current user', () => {
        it('it should get current user', (done) => {
            chai.request(server).get('/api/me').set('Authorization', token).end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('id');
                res.body.should.have.property('name');
                res.body.should.have.property('email');
                res.body.name.should.be.a('string');
                res.body.email.should.be.a('string');
                done();
            });
        });
    });

    describe('/PUT update user', () => {
        it('it should update user infor', (done) => {
            const user = {
                phone: "+380666666666",
                name: "User Test",
                email: "user@gmail.com",
                current_password: "123456",
                new_password: "qwerty"
            };

            chai.request(server).put('/api/me').set('Authorization', token).send(user).end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('id');
                res.body.should.have.property('name');
                res.body.should.have.property('email');
                user_id = res.body.id;
                done();
            });
        });
    });

    describe('/POST login user', () => {
        it('it should login user', (done) => {
            const user = {
                email: "user@gmail.com",
                password: "qwerty"
            };
            chai.request(server).post('/api/login').send(user).end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('token');
                res.body.token.should.be.a('string');
                token = res.body.token;
                done();
            });
        });
    });

    describe('/GET user by id', () => {
        it('it should get user by id', (done) => {
            chai.request(server).get(`/api/user/${user_id}`).set('Authorization', token).end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('id');
                res.body.should.have.property('name');
                res.body.should.have.property('email');
                res.body.name.should.be.a('string');
                res.body.email.should.be.a('string');
                done();
            });
        });
    });

    describe('/GET search users', () => {
        it('it should search users by params', (done) => {
            chai.request(server).get(`/api/user?name=User%20Test&email=user@gmail.com`).set('Authorization', token).end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body[0].should.be.a('object');
                res.body[0].should.have.property('id');
                res.body[0].should.have.property('name');
                res.body[0].should.have.property('email');
                res.body[0].name.should.be.a('string');
                res.body[0].email.should.be.a('string');
                done();
            });
        });
    });
});

describe('POSTS', () => {
    let post_id = 0;
    describe('/PUT create post', () => {
        it('it should create post', (done) => {
            const post = {
                title: "Awesome Title",
                description: "Beautiful text"
            };
            chai.request(server).put('/api/item').send(post).set('Authorization', token).end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('title');
                res.body.should.have.property('description');
                res.body.should.have.property('image');
                res.body.should.have.property('user_id');
                res.body.image.should.be.a('string');
                res.body.title.should.be.a('string');
                res.body.description.should.be.a('string');
                res.body.user_id.should.be.a('number');
                res.body.title.should.equal(post.title);
                res.body.description.should.equal(post.description);

                res.body.user.should.be.a('object');
                res.body.user.should.have.property('name');
                res.body.user.should.have.property('email');
                res.body.user.should.have.property('phone');
                res.body.user.name.should.be.a('string');
                res.body.user.email.should.be.a('string');
                post_id = res.body.id;
                done();
            });
        });
    });

    const finalPostData = {
        title: "New awesome title",
        description: "More beautiful text"
    };

    describe('/PUT update post', () => {
        it('it should update post', (done) => {
            chai.request(server).put(`/api/item/${post_id}`).send(finalPostData).set('Authorization', token).end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('title');
                res.body.should.have.property('description');
                res.body.should.have.property('image');
                res.body.should.have.property('user_id');
                res.body.image.should.be.a('string');
                res.body.title.should.be.a('string');
                res.body.description.should.be.a('string');
                res.body.user_id.should.be.a('number');
                res.body.title.should.equal(finalPostData.title);
                res.body.description.should.equal(finalPostData.description);

                res.body.user.should.be.a('object');
                res.body.user.should.have.property('name');
                res.body.user.should.have.property('email');
                res.body.user.should.have.property('phone');
                res.body.user.name.should.be.a('string');
                res.body.user.email.should.be.a('string');
                done();
            });
        });
    });

    describe('/GET get post', () => {
        it('it should get post', (done) => {
            chai.request(server).get(`/api/item/${post_id}`).set('Authorization', token).end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('title');
                res.body.should.have.property('description');
                res.body.should.have.property('image');
                res.body.should.have.property('user_id');
                res.body.image.should.be.a('string');
                res.body.title.should.be.a('string');
                res.body.description.should.be.a('string');
                res.body.user_id.should.be.a('number');
                res.body.title.should.equal(finalPostData.title);
                res.body.description.should.equal(finalPostData.description);

                res.body.user.should.be.a('object');
                res.body.user.should.have.property('name');
                res.body.user.should.have.property('email');
                res.body.user.should.have.property('phone');
                res.body.user.name.should.be.a('string');
                res.body.user.email.should.be.a('string');
                done();
            });
        });
    });

    describe('/GET get post', () => {
        it('it should get post', (done) => {
            chai.request(server).get(`/api/item/${post_id}`).set('Authorization', token).end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('title');
                res.body.should.have.property('description');
                res.body.should.have.property('image');
                res.body.should.have.property('user_id');
                res.body.image.should.be.a('string');
                res.body.title.should.be.a('string');
                res.body.description.should.be.a('string');
                res.body.user_id.should.be.a('number');
                res.body.title.should.equal(finalPostData.title);
                res.body.description.should.equal(finalPostData.description);

                res.body.user.should.be.a('object');
                res.body.user.should.have.property('name');
                res.body.user.should.have.property('email');
                res.body.user.should.have.property('phone');
                res.body.user.name.should.be.a('string');
                res.body.user.email.should.be.a('string');
                done();
            });
        });
    });


    describe('/GET search post', () => {
        it('it should search post', (done) => {
            chai.request(server).get(`/api/item?title=${finalPostData.title}&user_id=${user_id}&order_by=createdAt&order_type=desc`).set('Authorization', token).end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body[0].should.be.a('object');
                res.body[0].should.have.property('title');
                res.body[0].should.have.property('description');
                res.body[0].should.have.property('image');
                res.body[0].should.have.property('user_id');
                res.body[0].image.should.be.a('string');
                res.body[0].title.should.be.a('string');
                res.body[0].description.should.be.a('string');
                res.body[0].user_id.should.be.a('number');
                res.body[0].title.should.equal(finalPostData.title);
                res.body[0].description.should.equal(finalPostData.description);

                res.body[0].user.should.be.a('object');
                res.body[0].user.should.have.property('name');
                res.body[0].user.should.have.property('email');
                res.body[0].user.should.have.property('phone');
                res.body[0].user.name.should.be.a('string');
                res.body[0].user.email.should.be.a('string');
                done();
            });
        });
    });


    describe('/POST upload image', () => {
        it('it should upload image for post', (done) => {
            chai.request(server).post(`/api/item/${post_id}/image`).set('Authorization', token)
                .field('extra_info', '{"in":"case you want to send json along with your file"}')
                .attach('avatar', __dirname + '/image/img.jpg').end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('title');
                res.body.should.have.property('description');
                res.body.should.have.property('image');
                res.body.should.have.property('user_id');
                res.body.image.should.be.a('string');
                res.body.title.should.be.a('string');
                res.body.description.should.be.a('string');
                res.body.user_id.should.be.a('number');

                res.body.user.should.be.a('object');
                res.body.user.should.have.property('name');
                res.body.user.should.have.property('email');
                res.body.user.should.have.property('phone');
                res.body.user.name.should.be.a('string');
                res.body.user.email.should.be.a('string');
                done();
            });
        });
    });

    describe('/DELETE delete image', () => {
        it('it should delete image', (done) => {
            chai.request(server).del(`/api/item/${post_id}/image`).set('Authorization', token).end((err, res) => {
                res.should.have.status(200);
                done();
            });
        });
    });

    describe('/DELETE delete post', () => {
        it('it should delete post', (done) => {
            chai.request(server).del(`/api/item/${post_id}`).set('Authorization', token).end((err, res) => {
                res.should.have.status(200);
                done();
            });
        });
    });
});