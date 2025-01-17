import { describe, it, expect, vi, afterEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import userRouter from '../userRoutes';
import { User } from '../../models/userModel';

const app = express();
app.use(express.json());
app.use('/users', userRouter);

describe('GET /users', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should get the admin user successfully', async () => {

    vi.spyOn(User, 'findById').mockResolvedValue({
      _id: "677b314df4a42d7fa23648b6",
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    });

    const response = await request(app)
      .get('/users')
      .set('Authorization', `Bearer some-jwt-token`);
    expect(response.status).toBe(200);
    expect(response.body.name).toBe('John Doe');
    expect(response.body.email).toBe('john@example.com');
    expect(response.body._id).toBe("677b314df4a42d7fa23648b6");
  });
});


describe('POST /users', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should create a user successfully', async () => {
    vi.spyOn(User, 'create').mockResolvedValue({
      _id: "677b314df4a42d7fa23648b6",
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    });

    const newUser = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    };

    const response = await request(app)
      .post('/users')
      .send(newUser);

    expect(response.status).toBe(201);
    expect(response.body.name).toBe('John Doe');
    expect(response.body.email).toBe('john@example.com');
    expect(response.body.password).toBe('password123');
  });
});

