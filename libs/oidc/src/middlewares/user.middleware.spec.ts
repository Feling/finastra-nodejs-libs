import { JWKS, JWT } from 'jose';
import { UserMiddleware } from './user.middleware';
import { OidcHelpers } from '../utils';
import { createMock } from '@golevelup/nestjs-testing';
import { Request, Response } from 'express';
import { MOCK_CLIENT_INSTANCE, MOCK_OIDC_MODULE_OPTIONS } from '../mocks';
import { TestingModule, Test } from '@nestjs/testing';

describe('User Middleware', () => {
  let middleware: UserMiddleware;
  const keyStore = new JWKS.KeyStore([]);
  const MockOidcHelpers = new OidcHelpers(
    keyStore,
    MOCK_CLIENT_INSTANCE,
    MOCK_OIDC_MODULE_OPTIONS,
  );

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserMiddleware,
        {
          provide: OidcHelpers,
          useValue: MockOidcHelpers,
        },
      ],
    }).compile();

    middleware = module.get<UserMiddleware>(UserMiddleware);
  });

  it('should not do anything if no bearer', () => {
    const req = createMock<Request>();
    const res = createMock<Response>();
    const next = jest.fn();
    middleware.use(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('should add user in request', () => {
    const req = createMock<Request>();
    const res = createMock<Response>();
    const next = jest.fn();
    jest.spyOn(JWT, 'verify').mockReturnValue({
      username: 'John Doe',
    } as any);

    const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`;
    req.headers.authorization = `Bearer ${token}`;

    middleware.use(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(req.user['userinfo']).toBeTruthy();
  });
});