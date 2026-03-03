export type User = {
  username: string;
  password: string;
};

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const sharedPassword = requiredEnv('STANDARD_PASSWORD');

export const users = {
  standard: {
    username: requiredEnv('STANDARD_USER'),
    password: sharedPassword,
  },
  lockedOut: {
    username: 'locked_out_user',
    password: sharedPassword,
  },
  problem: {
    username: 'problem_user',
    password: sharedPassword,
  },
  performance: {
    username: 'performance_glitch_user',
    password: sharedPassword,
  },
  error: {
    username: 'error_user',
    password: sharedPassword,
  },
  visual: {
    username: 'visual_user',
    password: sharedPassword,
  },
} satisfies Record<string, User>;
