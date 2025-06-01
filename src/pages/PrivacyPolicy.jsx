export default function PrivacyPolicy() {
  return (
    <div className="bg-white dark:bg-gray-900 py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl mb-8">
          Privacy Policy
        </h1>
        
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p>
            At ResizeMaster, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your personal information when you use our service.
          </p>
          
          <h2>Information We Collect</h2>
          <p>
            We collect the following types of information:
          </p>
          <ul>
            <li>
              <strong>Account Information:</strong> When you create an account, we collect your email address and encrypted password.
            </li>
            <li>
              <strong>Usage Data:</strong> We track how many images you process to manage your subscription limits.
            </li>
            <li>
              <strong>Payment Information:</strong> If you subscribe to our Pro plan, we collect payment information through our payment processor. We do not store your full credit card details on our servers.
            </li>
          </ul>
          
          <h2>How We Process Your Images</h2>
          <p>
            ResizeMaster processes your images directly in your browser whenever possible. This means:
          </p>
          <ul>
            <li>Your original images are not uploaded to our servers unless you're using advanced features that require server-side processing.</li>
            <li>We do not store your processed images on our servers.</li>
            <li>We do not use your images for any purpose other than providing the service you requested.</li>
          </ul>
          
          <h2>How We Use Your Information</h2>
          <p>
            We use your information to:
          </p>
          <ul>
            <li>Provide and maintain our service</li>
            <li>Track your usage for billing purposes</li>
            <li>Communicate with you about your account or our services</li>
            <li>Improve our service</li>
          </ul>
          
          <h2>Data Security</h2>
          <p>
            We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
          </p>
          
          <h2>Your Rights</h2>
          <p>
            Depending on your location, you may have the right to:
          </p>
          <ul>
            <li>Access the personal information we hold about you</li>
            <li>Correct inaccurate information</li>
            <li>Delete your personal information</li>
            <li>Object to or restrict processing of your information</li>
            <li>Data portability</li>
          </ul>
          
          <h2>Changes to This Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
          </p>
          
          <h2>Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at privacy@resizemaster.com.
          </p>
          
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-8">
            Last Updated: November 1, 2023
          </p>
        </div>
      </div>
    </div>
  )
}
