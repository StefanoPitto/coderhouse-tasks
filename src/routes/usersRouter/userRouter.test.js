import { expect } from 'chai';
import { describe, it } from 'mocha';
import { usersRouter } from './usersRoute.js';
import supertest from 'supertest';
import { generateRandomString } from '../../utils.js';
import { mongoose } from '../../app.js';


const request = supertest("http://localhost:8080");

describe('Users Router', () => {

    let randomUsername = generateRandomString(10) + '@test.com';    
    
  it('should register a new user', async () => {
    const response = await request.post('/api/auth/').send({
        name:'Test Name',
        age:25,
        address:"TestAddress 123",
        role:'user',
        email: randomUsername,
        password: '123asd',
    });
    expect(response.status).to.equal(200);
  });

  it('should log in a user', async () => {
    const response = await request.post('/api/auth/login').send({
      email:randomUsername,
      password:'123asd'
    });
    expect(response.status).to.equal(200);
   
  });

  it('should get 400 bad request', async ()=>{

    const response = await request.post('/api/auth/login').send({
        email:'wrongemail@test.com',
        password:"wrongpassword"
    });
    expect(response.status).to.equal(400);
  })

  it('should log out a user', async () => {
    const response = await request.post('/api/auth/logout');
    expect(response.status).to.equal(200);
    
  });

  it('should update user role to premium', async () => {
    let uid = '644dc2e4fdcd63ef1aed6225';
    const response = await request.get(`/api/auth/premium/${uid}`);
    expect(response.status).to.equal(200);
    
  });

  it('should get user details by ID', async () => {
    let uid = '644dc2e4fdcd63ef1aed6225';
    const response = await request.get(`/api/auth/${uid}`);
    expect(response.status).to.equal(200);
   
  });
});