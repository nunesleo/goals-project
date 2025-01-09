import { describe, it, expect, vi, afterEach } from 'vitest';
import dotenv from "dotenv";
import request from 'supertest';
import express from 'express';
import goalRouter from '../goalRoutes';
import { Goal } from '../../models/goalModel';

const app = express();
app.use(express.json());
app.use('/goals', goalRouter);

dotenv.config();
const ADMIN_ID = process.env.ADMIN_ID;

describe('GET /goals', () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });
  
    it('should get all goals', async () => {
      const mockGoals = [
        { name: 'Test Goal 1', description: 'Description 1' },
        { name: 'Test Goal 2', description: 'Description 2' },
      ];
      vi.spyOn(Goal, 'find').mockResolvedValue(mockGoals);
  
      const response = await request(app).get('/goals');
  
      expect(response.status).toBe(200);
      expect(response.body.count).toBe(mockGoals.length);
      expect(response.body.data).toEqual(mockGoals);
    });
  });
  

