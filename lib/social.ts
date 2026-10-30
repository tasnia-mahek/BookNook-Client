export async function startGoogleSignIn() {
  const response = await fetch('/api/auth/sign-in/social', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ provider: 'google', callbackURL: '/' })
  });
  const data = await response.json();
  if (!response.ok || !data.url) throw new Error(data.message ?? 'Google sign-in is not configured.');
  window.location.assign(data.url);
}
