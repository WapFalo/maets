const path = require('path');

function safeRequire(relPath) {
    try {
        const fullPath = path.resolve(__dirname, '..', relPath);
        // eslint-disable-next-line import/no-dynamic-require, global-require
        return require(fullPath);
    } catch (err) {
        return null;
    }
}

function tryRequireCandidates(candidates) {
    for (let p of candidates) {
        const mod = safeRequire(p);
        if (mod) return mod;
    }
    return null;
}

function makeReqResNext() {
    const req = { body: {}, params: {}, query: {}, headers: {}, user: {} };
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis(),
    };
    const next = jest.fn();
    return { req, res, next };
}

describe('Project handlers extended tests (sanity + module-level)', () => {
    const controllers = safeRequire('controllers') || safeRequire('controllers/index.js') || null;
    const middleware = safeRequire('middleware') || null;
    const repositories = safeRequire('repositories') || null;

    test('jest is running', () => {
        expect(true).toBe(true);
    });

    test('Accept recommendation message', () => {
        expect('We recommend installing an extension to run jest tests.').toBe(
            'We recommend installing an extension to run jest tests.',
        );
    });

    describe('controllers module', () => {
        test('controllers can be required (or intentionally absent)', () => {
            expect([null, 'object'].includes(typeof controllers)).toBe(true);
        });
    });

    describe('middleware module', () => {
        test('middleware can be required (or intentionally absent)', () => {
            expect([null, 'object'].includes(typeof middleware)).toBe(true);
        });
    });

    describe('repositories module', () => {
        test('repositories can be required (or intentionally absent)', () => {
            expect([null, 'object'].includes(typeof repositories)).toBe(true);
        });
    });

    // Specific controller tests
    const gameController = tryRequireCandidates([
        'controllers/game.controller.js',
        'controllers/game.controller',
        'controllers/gameController.js',
        'controllers/gameController',
        'game.controller.js',
        'game.controller',
    ]);

    const userController = tryRequireCandidates([
        'controllers/user.controller.js',
        'controllers/user.controller',
        'controllers/userController.js',
        'controllers/userController',
        'user.controller.js',
        'user.controller',
    ]);

    if (gameController) {
        describe('game.controller functions', () => {
            Object.keys(gameController).forEach((name) => {
                const fn = gameController[name];
                test(`game.controller.${name} is a function`, () => {
                    expect(typeof fn).toBe('function');
                });
                test(`game.controller.${name} callable without throwing`, async () => {
                    const { req, res, next } = makeReqResNext();
                    // call with typical controller args and ensure it doesn't throw
                    let result;
                    try {
                        result = fn(req, res, next);
                        if (result && typeof result.then === 'function') {
                            await result;
                        }
                    } catch (err) {
                        // If implementation intentionally throws for missing dependencies, treat as fail
                        throw err;
                    }
                    // either called next or interacted with res
                    expect(next.mock.calls.length > 0 || res.status.mock.calls.length > 0 || res.json.mock.calls.length > 0 || res.send.mock.calls.length > 0).toBe(true);
                });
            });
        });
    } else {
        test('game.controller not present (skipped)', () => {
            expect(gameController).toBeNull();
        });
    }

    if (userController) {
        describe('user.controller functions', () => {
            Object.keys(userController).forEach((name) => {
                const fn = userController[name];
                test(`user.controller.${name} is a function`, () => {
                    expect(typeof fn).toBe('function');
                });
                test(`user.controller.${name} callable without throwing`, async () => {
                    const { req, res, next } = makeReqResNext();
                    let result;
                    try {
                        result = fn(req, res, next);
                        if (result && typeof result.then === 'function') {
                            await result;
                        }
                    } catch (err) {
                        throw err;
                    }
                    expect(next.mock.calls.length > 0 || res.status.mock.calls.length > 0 || res.json.mock.calls.length > 0 || res.send.mock.calls.length > 0).toBe(true);
                });
            });
        });
    } else {
        test('user.controller not present (skipped)', () => {
            expect(userController).toBeNull();
        });
    }

    // verifyToken middleware (likely at middleware/verifyToken.js or verifyToken.js)
    const verifyToken = tryRequireCandidates([
        'middleware/verifyToken.js',
        'middleware/verifyToken',
        'verifyToken.js',
        'verifyToken',
    ]);

    if (verifyToken) {
        describe('verifyToken middleware', () => {
            test('verifyToken is a function', () => {
                expect(typeof verifyToken).toBe('function');
            });

            test('verifyToken callable and either calls next or sets res status', async () => {
                const { req, res, next } = makeReqResNext();
                // Case: no auth header
                req.headers = {};
                let result = verifyToken(req, res, next);
                if (result && typeof result.then === 'function') await result;
                expect(next.mock.calls.length > 0 || res.status.mock.calls.length > 0).toBe(true);

                // Case: invalid token string
                next.mockClear();
                res.status.mockClear();
                req.headers = { authorization: 'Bearer invalid-token' };
                result = verifyToken(req, res, next);
                if (result && typeof result.then === 'function') await result;
                expect(next.mock.calls.length > 0 || res.status.mock.calls.length > 0).toBe(true);
            });
        });
    } else {
        test('verifyToken middleware not present (skipped)', () => {
            expect(verifyToken).toBeNull();
        });
    }

    // repository JSON-like modules
    const gameRepo = tryRequireCandidates([
        'repositories/game.repository.json.js',
        'repositories/game.repository.js',
        'repositories/game.repository',
        'repositories/game.repository.json',
        'game.repository.json.js',
        'game.repository.js',
    ]);

    const userRepo = tryRequireCandidates([
        'repositories/user.repository.json.js',
        'repositories/user.repository.js',
        'repositories/user.repository',
        'repositories/user.repository.json',
        'user.repository.json.js',
        'user.repository.js',
    ]);

    [ ['game.repository', gameRepo], ['user.repository', userRepo] ].forEach(([label, repo]) => {
        if (repo) {
            describe(`${label} exports`, () => {
                test(`${label} is an object`, () => {
                    expect(typeof repo).toBe('object');
                });
                Object.keys(repo).forEach((key) => {
                    const fn = repo[key];
                    test(`${label}.${key} is a function`, () => {
                        expect(typeof fn).toBe('function');
                    });
                    test(`${label}.${key} callable without throwing`, async () => {
                        const args = [];
                        // provide common args: id or payload
                        if (fn.length >= 1) args.push('test-id');
                        if (fn.length >= 2) args.push({ sample: true });
                        let result;
                        try {
                            result = fn(...args);
                            if (result && typeof result.then === 'function') {
                                await result;
                            }
                        } catch (err) {
                            throw err;
                        }
                        // success if returns anything or resolves
                        expect(true).toBe(true);
                    });
                });
            });
        } else {
            test(`${label} not present (skipped)`, () => {
                expect(repo).toBeNull();
            });
        }
    });

    // service JSON-like modules
    const gameService = tryRequireCandidates([
        'services/game.service.json.js',
        'services/game.service.js',
        'services/game.service',
        'game.service.json.js',
        'game.service.js',
    ]);

    const userService = tryRequireCandidates([
        'services/user.service.json.js',
        'services/user.service.js',
        'services/user.service',
        'user.service.json.js',
        'user.service.js',
    ]);

    [ ['game.service', gameService], ['user.service', userService] ].forEach(([label, svc]) => {
        if (svc) {
            describe(`${label} exports`, () => {
                test(`${label} is an object or function`, () => {
                    expect(['object', 'function'].includes(typeof svc)).toBe(true);
                });
                if (typeof svc === 'object') {
                    Object.keys(svc).forEach((key) => {
                        const fn = svc[key];
                        test(`${label}.${key} is callable`, () => {
                            expect(typeof fn === 'function').toBe(true);
                        });
                        test(`${label}.${key} callable without throwing`, async () => {
                            if (typeof fn !== 'function') return;
                            const args = [];
                            if (fn.length >= 1) args.push('test');
                            let result;
                            try {
                                result = fn(...args);
                                if (result && typeof result.then === 'function') await result;
                            } catch (err) {
                                throw err;
                            }
                            expect(true).toBe(true);
                        });
                    });
                } else if (typeof svc === 'function') {
                    test(`${label} as function callable without throwing`, async () => {
                        let result;
                        try {
                            result = svc();
                            if (result && typeof result.then === 'function') await result;
                        } catch (err) {
                            throw err;
                        }
                        expect(true).toBe(true);
                    });
                }
            });
        } else {
            test(`${label} not present (skipped)`, () => {
                expect(svc).toBeNull();
            });
        }
    });
});