import { expect } from 'chai';
import { describe, it } from 'mocha';
import supertest from 'supertest';
import { faker } from '@faker-js/faker';
import { mongoose } from '../../app.js';
const request = supertest("http://localhost:8080");


describe('Carts Router', () => {
    

    it('Should create a cart', async () => {
        const response = await request.post('/api/carts/');
    
        expect(response.status).to.equal(200);
      })

    it('Should get the cart',async()=>{
        const cartResponse = await request.post ("/api/carts/")

        console.log(cartResponse.body.id)
        const response = await request.get(`/api/carts/${cartResponse.body.id}`);

        expect(response.status).to.equal(200);

    })


    })