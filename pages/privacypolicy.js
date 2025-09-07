export default function Privacy() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12 text-neutral-900 dark:text-neutral-100">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

      <p className="mb-4">
        Your privacy is important to us. Please read this carefully:
      </p>

      <ul className="list-disc list-inside space-y-2 mb-4">
        <li>
          Blendistry collects minimal personal data. We store only information necessary for user accounts and site functionality, such as email and username.
        </li>
        <li>
          Comments are handled by <strong>Giscus</strong>, which requires GitHub login. Blendistry does not have access to your GitHub credentials.
        </li>
        <li>
          Any analytics used on this site are anonymous and do not track individual users.
        </li>
        <li>
          Cookies or local storage may be used for essential functionality, such as saving theme preferences or session data.
        </li>
        <li>
          We do not sell, trade, or share personal information with third parties.
        </li>
        <li>
          External links on Blendistry may collect data separately. Please review their privacy policies before interacting with them.
        </li>
        <li>
          You may request the removal of any personal data stored by Blendistry by contacting us through the email provided on the site.
        </li>
      </ul>

      <p className="mb-2">
        By using Blendistry, you acknowledge and agree to this Privacy Policy.
      </p>
      <p>
        For questions regarding privacy practices, please reach out via the provided contact information.
      </p>
    </div>
  );
}
