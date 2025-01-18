import { describe, it, expect, vi, afterEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import contributionRouter from '../contributionRoutes';
import { Contribution } from '../../models/contributionModel';

const app = express();
app.use(express.json());
app.use('/contributions', contributionRouter);


describe('GET /contributions', () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });
  
    it('should get all contributions', async () => {
      const mockContributions = [
        { name: 'Test contribution 1', description: 'Description 1', isMilestone: false },
        { name: 'Test contribution 2', description: 'Description 2', isMilestone: true },
      ];
      vi.spyOn(Contribution, 'find').mockResolvedValue(mockContributions);
  
      const response = await request(app).get('/contributions');
  
      expect(response.status).toBe(200);
      expect(response.body.count).toBe(mockContributions.length);
      expect(response.body.data).toEqual(mockContributions);
    });

    it('get contribution by id', async () => {
      const mockContributions = [
        { _id:"123", name: 'Test contribution 1', description: 'Description 1', isMilestone: false },
        { name: 'Test contribution 2', description: 'Description 2', isMilestone: true },
      ];
      vi.spyOn(Contribution, 'findById').mockImplementation((id) => {
        return Promise.resolve(mockContributions.find(contribution => contribution._id === id));
      });
  
      const response = await request(app).get('/contributions/123');
      expect(response.status).toBe(200);
      expect(response.body.name).toBe("Test contribution 1");
      expect(response.body.description).toEqual("Description 1");
      expect(response.body.isMilestone).toEqual(false);
    });
  });
  

