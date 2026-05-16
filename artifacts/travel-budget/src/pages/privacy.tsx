export default function PrivacyPolicy() {
  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto w-full prose prose-gray dark:prose-invert">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>
      
      <h2>1. Information We Collect</h2>
      <p>
        When you use TravelBudget, we collect your travel preferences (budget, number of people, dates, departure locations, flight preferences) to provide personalized trip suggestions. We also collect basic account information via Clerk authentication.
      </p>
      
      <h2>2. How We Use Your Information</h2>
      <p>
        Your data is used solely to generate relevant travel suggestions and to maintain your saved trips list. We do not sell your personal data to third parties.
      </p>

      <h2>3. Cookies</h2>
      <p>
        We use essential cookies to maintain your session (via Clerk) and store your preferences. You can manage your cookie consent via the banner shown on your first visit.
      </p>
      
      <h2>4. Third-Party Services</h2>
      <p>
        We use Clerk for authentication. Your account credentials and login sessions are managed securely by Clerk according to their privacy policy.
      </p>
    </div>
  );
}
