<?php
/**
 * Holds the OAuth2 login for the Admin panel.
 */

namespace Miiverse\Pages\Admin;

/**
 * OAuth2 login.
 *
 * @author RverseTeam
 */
class OAuth2 extends Page
{
    /**
     * Redirects the user to either the index or to Discord's login.
     */
    public function login()
    {
        if (isset($_SESSION['discord_token'])) {
            return redirect(route('admin.home'));
        } else {
            $provider = new \Wohali\OAuth2\Client\Provider\Discord([
                'clientId' => config('admin.discord_client'),
                'clientSecret' => config('admin.discord_secret'),
                'redirectUri' => full_domain().route('oauth2.callback'),
            ]);

            $options = [
                'scope' => config('admin.discord_scopes'),
            ];

            $authUrl = $provider->getAuthorizationUrl($options);
            $_SESSION['oauth2state'] = $provider->getState();

            return redirect($authUrl);
        }
    }

    /**
     * Process the Discord callback and read the user data.
     */
    public function callback()
    {
        if (empty($_GET['state']) || ($_GET['state'] !== $_SESSION['oauth2state'])) {
            unset($_SESSION['oauth2state']);
            exit('Invalid state');
        }

        $provider = new \Wohali\OAuth2\Client\Provider\Discord([
            'clientId' => config('admin.discord_client'),
            'clientSecret' => config('admin.discord_secret'),
            'redirectUri' => full_domain().route('oauth2.callback'),
        ]);

        // Get an access token using the provided authorization code
        $token = $provider->getAccessToken('authorization_code', [
            'code' => $_GET['code']
        ]);

        try {
            // Yes, I know this thing is not really secure, but what I can do
            // with a makeshift framework like this one?

            $user = $provider->getResourceOwner($token);

            $_SESSION['admin_expires'] = $token->getExpires();
            $_SESSION['admin_user'] = sprintf('%s#%s', $user->getUsername(), $user->getDiscriminator());

            return redirect(route('admin.home'));
        } catch (Exception $e) {
            die('Unknown error');
        }
    }
}
