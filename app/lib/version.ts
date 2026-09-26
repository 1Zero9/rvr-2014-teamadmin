import 'server-only';

/**
 * Vercel sets these automatically on every deployment (build and runtime,
 * no config needed) - reading them gives a version marker that changes
 * every time a deploy actually goes live, so "did my last push deploy?"
 * has a visible answer instead of a guess. Falls back to 'dev' locally,
 * where these aren't set.
 */
export function getAppVersion() {
  const sha = process.env.VERCEL_GIT_COMMIT_SHA;
  if (!sha) return 'dev';
  const short = sha.slice(0, 7);
  return process.env.VERCEL_ENV === 'production' ? short : `${short}-${process.env.VERCEL_ENV || 'local'}`;
}
