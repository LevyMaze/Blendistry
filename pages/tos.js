export default function TOS() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12 text-neutral-900 dark:text-neutral-100">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>

      <p className="mb-4">
        By using Blendistry, you agree to the following terms:
      </p>

      <ul className="list-disc list-inside space-y-2 mb-4">
        <li>
          Blendistry is an independent project and is <strong>not affiliated with GitHub</strong>.
        </li>
        <li>
          User accounts are managed by Blendistry itself. Authentication for comments is handled via <strong>Giscus</strong> using GitHub OAuth. We do not store or control your GitHub login credentials.
        </li>
        <li>
          You agree to use the site responsibly. Any abusive, harmful, or illegal activity is strictly prohibited.
        </li>
        <li>
          Content on Blendistry is for educational purposes. We are not liable for any issues arising from implementing suggestions or code found on the site.
        </li>
        <li>
          Blendistry reserves the right to update or change these terms at any time. Continued use of the site constitutes acceptance of these updates.
        </li>
        <li>
          User-generated comments or content are the responsibility of the individual user. Blendistry is not responsible for user-submitted content.
        </li>
        <li>
          External links may lead to third-party websites. Blendistry is not responsible for the content or practices of these sites.
        </li>
      </ul>

      <p className="mb-2">
        By accessing and using Blendistry, you acknowledge that you have read, understood, and agreed to these Terms of Service.
      </p>
      <p>
        For any questions regarding these terms, please contact us via the provided email.
      </p>
    </div>
  );
}
