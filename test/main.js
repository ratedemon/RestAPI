import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../src/index';
import db from '../src/db';
import User from '../src/model/user';
import Post from '../src/model/post';

const should = chai.should();

chai.use(chaiHttp);

let token = '';

describe('User', ()=>{
    before('DB clear', (done) => {
        User.destroy({
            where: {
                email: "test@test.com"
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
});