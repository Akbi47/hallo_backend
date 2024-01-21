import { HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { SuperTest, Test } from 'supertest';
import * as dotenv from 'dotenv';
dotenv.config();

describe('Service info (e2e)', () => {
  let app: SuperTest<Test>;

  beforeEach(() => {
    app = request(process.env.APP_URL);
  });

  describe('get service info', () => {
    it('/service-info (GET)', async () => {
      const response = await app.get(`/service-info`).query({
        page: 1,
        limit: 2,
      });
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.metadata.query.page).toBe('1');
      expect(response.body.metadata.query.limit).toBe('2');
      expect(response.body.data).toBeDefined();
    });

    it('/PUT', async () => {
      const response = await app.post('/service-info');
      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    });

    it('/PUT service info (called without user token)', async () => {
      const userToken = await app.post(`/auth/user/login`).send({
        email: '123',
        password: '123',
      });

      const response = await app.post('/service-info').set('Authorization', `Bearer ${userToken}`);
      expect(response.status).toBe(401);
    });
  });
});
