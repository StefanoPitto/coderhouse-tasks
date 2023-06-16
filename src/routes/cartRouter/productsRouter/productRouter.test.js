import { expect } from 'chai';
import { describe, it } from 'mocha';
import supertest from 'supertest';
import { faker } from '@faker-js/faker';
import { mongoose } from '../../../app.js';
const request = supertest("http://localhost:8080");


describe('Products Router', () => {
    it('should get a list of products', async () => {
        const response = await request.get('/api/products');
    
        expect(response.status).to.equal(200);
      });
})