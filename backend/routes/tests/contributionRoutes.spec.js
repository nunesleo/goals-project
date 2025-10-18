import { describe, it, expect, vi, afterEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';
import contributionRouter from '../contributionRoutes';
import goalRouter from '../goalRoutes';
import { Contribution } from '../../models/contributionModel';
import { Goal } from '../../models/goalModel';
import { User } from '../../models/userModel';

const app = express();
app.use(express.json());
app.use('/contributions', contributionRouter);
app.use('/goals', goalRouter);

const testUserId = 'test-user-id';
const testToken = jwt.sign({ userId: testUserId }, 'your_secret_key');

describe('POST /contributions/:id', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should post a contribution to a goal', async () => {
    const goalId = 'goal123';
    const mockGoal = { 
      _id: goalId, 
      name: 'Test Goal', 
      user: testUserId,
      contributions: [],
      save: vi.fn().mockResolvedValue(true)
    };

    const mockUser = {
      _id: testUserId,
      contributionPoints: 0,
      save: vi.fn().mockResolvedValue(true)
    };

    const newContribution = {
      name: 'Test contribution 2',
      description: 'Description 2',
      isMilestone: true,
    };

    const savedContribution = { 
      _id: '122', 
      name: newContribution.name,
      description: newContribution.description,
      isMilestone: newContribution.isMilestone,
      goal: goalId,
      user: testUserId
    };

    vi.spyOn(Goal, 'findById').mockResolvedValue(mockGoal);
    vi.spyOn(Contribution, 'create').mockResolvedValue(savedContribution);
    vi.spyOn(User, 'findById').mockResolvedValue(mockUser);

    const response = await request(app)
      .post(`/contributions/${goalId}`)
      .set('Authorization', `Bearer ${testToken}`)
      .send(newContribution);
    
    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      name: newContribution.name,
      description: newContribution.description,
      isMilestone: newContribution.isMilestone
    });
  });
});

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

    const response = await request(app)
      .get('/contributions')
      .set('Authorization', `Bearer ${testToken}`);

    expect(response.status).toBe(200);
    expect(response.body.count).toBe(mockContributions.length);
    expect(response.body.data).toEqual(mockContributions);
  });
});

describe('DELETE /contributions/:goalId/:id', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should delete a contribution by id', async () => {
    const goalId = 'goal123';
    const contributionId = '123';
    
    const mockContributionsArray = [contributionId];
    mockContributionsArray.pull = vi.fn();
    
    const mockGoal = {
      _id: goalId,
      name: 'Test Goal',
      contributions: mockContributionsArray,
      save: vi.fn().mockResolvedValue(true)
    };

    const mockContribution = { 
      _id: contributionId, 
      name: 'Deleted contribution', 
      user: testUserId,
      isMilestone: false
    };

    const mockUser = {
      _id: '677b314df4a42d7fa23648b6',
      contributionPoints: 100,
      save: vi.fn().mockResolvedValue(true)
    };

    vi.spyOn(Goal, 'findById').mockResolvedValue(mockGoal);
    vi.spyOn(Contribution, 'findByIdAndDelete').mockResolvedValue(mockContribution);
    vi.spyOn(User, 'findById').mockResolvedValue(mockUser);

    const response = await request(app)
      .delete(`/contributions/${goalId}/${contributionId}`)
      .set('Authorization', `Bearer ${testToken}`);

    console.log('DELETE Response:', response.status, response.body);

    expect(response.status).toBe(200);
    expect(response.body.message).toMatch(/deleted/i);
    expect(response.body.contribution).toEqual(mockContribution);
  });

  it('should return 404 if goal not found', async () => {
    vi.spyOn(Goal, 'findById').mockResolvedValue(null);

    const response = await request(app)
      .delete('/contributions/goal999/contrib999')
      .set('Authorization', `Bearer ${testToken}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toMatch(/goal not found/i);
  });

  it('should return 404 if contribution not found', async () => {
    const goalId = 'goal123';
    
    const mockContributionsArray = [];
    mockContributionsArray.pull = vi.fn();
    
    const mockGoal = {
      _id: goalId,
      contributions: mockContributionsArray,
      save: vi.fn().mockResolvedValue(true)
    };

    const mockUser = {
      _id: '677b314df4a42d7fa23648b6',
      contributionPoints: 100,
      save: vi.fn().mockResolvedValue(true)
    };

    vi.spyOn(Goal, 'findById').mockResolvedValue(mockGoal);
    vi.spyOn(Contribution, 'findByIdAndDelete').mockResolvedValue(null);
    vi.spyOn(User, 'findById').mockResolvedValue(mockUser);

    const response = await request(app)
      .delete('/contributions/goal123/contrib999')
      .set('Authorization', `Bearer ${testToken}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toMatch(/contribution not found/i);
  });
});