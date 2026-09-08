const BASE_URL = "http://localhost:3000";

async function runTests() {
  console.log("🚀 Starting Authentication & Sharing Smoke Tests...\n");

  const testEmail = `tester_${Date.now()}@example.com`;
  const testPassword = "securePassword123";
  const testName = "Smoke Test User";

  let sessionCookie = "";

  // Helper to extract cookie
  function extractCookie(res) {
    const raw = res.headers.get("set-cookie");
    if (!raw) return null;
    return raw.split(";")[0];
  }

  // 1. Initial /api/auth/me (should be null)
  console.log("1. Checking initial /api/auth/me without cookie...");
  const meRes1 = await fetch(`${BASE_URL}/api/auth/me`);
  const meData1 = await meRes1.json();
  console.log("   Result:", meData1);
  if (meData1.user !== null) throw new Error("Expected initial user to be null");
  console.log("   ✓ Verified guest user is unauthenticated\n");

  // 2. Sign up
  console.log(`2. Registering new user (${testEmail})...`);
  const signupRes = await fetch(`${BASE_URL}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: testName,
      email: testEmail,
      password: testPassword,
      confirmPassword: testPassword,
    }),
  });

  const signupData = await signupRes.json();
  console.log("   Status:", signupRes.status);
  console.log("   Response:", signupData);

  if (signupRes.status !== 201) throw new Error("Signup failed");
  if (!signupData.user || signupData.user.email !== testEmail) {
    throw new Error("Invalid signup response");
  }

  sessionCookie = extractCookie(signupRes);
  console.log("   Session Cookie received:", sessionCookie ? "YES" : "NO");
  if (!sessionCookie) throw new Error("No session cookie set on signup");
  console.log("   ✓ User registered and session created\n");

  // 3. Duplicate email test
  console.log("3. Testing duplicate email registration...");
  const dupRes = await fetch(`${BASE_URL}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Duplicate",
      email: testEmail,
      password: "someotherpassword",
      confirmPassword: "someotherpassword",
    }),
  });
  console.log("   Status:", dupRes.status);
  const dupData = await dupRes.json();
  console.log("   Response:", dupData);
  if (dupRes.status !== 409) throw new Error("Expected 409 Conflict for duplicate email");
  console.log("   ✓ Duplicate registration correctly rejected\n");

  // 4. Check /api/auth/me with session cookie
  console.log("4. Verifying /api/auth/me with session cookie...");
  const meRes2 = await fetch(`${BASE_URL}/api/auth/me`, {
    headers: { Cookie: sessionCookie },
  });
  const meData2 = await meRes2.json();
  console.log("   Result:", meData2);
  if (!meData2.user || meData2.user.email !== testEmail) {
    throw new Error("Auth me did not return logged-in user");
  }
  console.log("   ✓ /api/auth/me successfully recognized user session\n");

  // 5. Share a snippet while authenticated
  console.log("5. Sharing code snippet as authenticated user...");
  const shareRes = await fetch(`${BASE_URL}/api/shares`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: sessionCookie,
    },
    body: JSON.stringify({
      code: "console.log('Hello from authenticated user!');",
      language: "javascript",
      title: "Authenticated Test Snippet",
    }),
  });
  const shareData = await shareRes.json();
  console.log("   Share Status:", shareRes.status);
  console.log("   Share OTP:", shareData.otp);
  if (!shareData.otp) throw new Error("Failed to create share snippet");
  console.log("   ✓ Authenticated snippet created with OTP\n");

  // 6. Check user dashboard shares
  console.log("6. Fetching user's shares from /api/user/shares...");
  const userSharesRes = await fetch(`${BASE_URL}/api/user/shares`, {
    headers: { Cookie: sessionCookie },
  });
  const userSharesData = await userSharesRes.json();
  console.log("   User Shares Count:", userSharesData.shares?.length);
  console.log("   First Share:", userSharesData.shares?.[0]);
  if (!userSharesData.shares || userSharesData.shares.length === 0) {
    throw new Error("User shares list is empty");
  }
  if (userSharesData.shares[0].title !== "Authenticated Test Snippet") {
    throw new Error("User share title mismatch");
  }
  console.log("   ✓ Snippet linked to user account and visible in list\n");

  // 7. Logout
  console.log("7. Logging out...");
  const logoutRes = await fetch(`${BASE_URL}/api/auth/logout`, {
    method: "POST",
    headers: { Cookie: sessionCookie },
  });
  console.log("   Logout Status:", logoutRes.status);
  const meRes3 = await fetch(`${BASE_URL}/api/auth/me`, {
    headers: { Cookie: sessionCookie },
  });
  const meData3 = await meRes3.json();
  console.log("   User after logout:", meData3.user);
  if (meData3.user !== null) throw new Error("Expected user to be null after logout");
  console.log("   ✓ User logged out successfully\n");

  // 8. Sign in with wrong password
  console.log("8. Testing signin with wrong password...");
  const wrongLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: testEmail,
      password: "wrongPassword",
    }),
  });
  console.log("   Status:", wrongLoginRes.status);
  if (wrongLoginRes.status !== 401) throw new Error("Expected 401 Unauthorized for wrong password");
  console.log("   ✓ Invalid credentials rejected\n");

  // 9. Sign in with correct password
  console.log("9. Testing signin with correct password...");
  const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: testEmail,
      password: testPassword,
    }),
  });
  const loginData = await loginRes.json();
  console.log("   Login Status:", loginRes.status);
  console.log("   Logged in user:", loginData.user);
  const newCookie = extractCookie(loginRes);
  if (!newCookie) throw new Error("No session cookie set on login");
  console.log("   ✓ User successfully logged back in\n");

  // 10. Redeem the OTP to verify code redemption still works perfectly
  console.log("10. Testing OTP redemption of shared code...");
  const redeemRes = await fetch(`${BASE_URL}/api/shares/redeem`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ otp: shareData.otp }),
  });
  const redeemData = await redeemRes.json();
  console.log("    Redeem Status:", redeemRes.status);
  console.log("    Decrypted Code:", redeemData.code);
  if (redeemData.code !== "console.log('Hello from authenticated user!');") {
    throw new Error("Redeemed code mismatch");
  }
  console.log("    ✓ Code successfully redeemed and decrypted\n");

  console.log("🎉 ALL AUTHENTICATION & SHARING TESTS PASSED SUCCESSFULLY!");
}

runTests().catch((err) => {
  console.error("❌ Test failed:", err);
  process.exit(1);
});
