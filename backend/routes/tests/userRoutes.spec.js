import { describe, it, expect, vi, afterEach } from 'vitest';
import dotenv from "dotenv";
import request from 'supertest';
import express from 'express';
import userRouter from '../userRoutes';
import { User } from '../../models/userModel';

const app = express();
app.use(express.json());
app.use('/users', userRouter);

dotenv.config();
const ADMIN_ID = process.env.ADMIN_ID;

describe('GET /users', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should get the admin user successfully', async () => {

    vi.spyOn(User, 'findById').mockResolvedValue({
      _id: ADMIN_ID,
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
    expect(response.body._id).toBe(ADMIN_ID);
  });
});


describe('POST /users', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should create a user successfully', async () => {
    vi.spyOn(User, 'create').mockResolvedValue({
      _id: ADMIN_ID,
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

